import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import type { WizardFormData } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const data: WizardFormData = await request.json()

    // Validate required fields
    if (!data.sector_id || !data.business_type) {
      return NextResponse.json(
        { error: "Sector and business type are required" },
        { status: 400 }
      )
    }

    if (data.monthly_gmv < 1000 || data.tx_count < 10) {
      return NextResponse.json(
        { error: "Invalid volume data" },
        { status: 400 }
      )
    }

    const paymentMixTotal = Object.values(data.payment_mix).reduce(
      (sum, val) => sum + val,
      0
    )
    if (paymentMixTotal !== 100) {
      return NextResponse.json(
        { error: "Payment mix must total 100%" },
        { status: 400 }
      )
    }

    // Hash IP for privacy
    const forwarded = request.headers.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(",")[0] : "unknown"
    const ipHash = await hashIP(ip)

    // Get all active providers with their fees and payment methods
    const providers = await prisma.provider.findMany({
      where: { isActive: true },
      include: {
        providerFees: {
          where: { isActive: true },
          include: {
            paymentMethod: true,
          },
        },
        providerPaymentMethods: {
          include: {
            paymentMethod: true,
          },
        },
        providerIntegrations: {
          where: { isActive: true },
        },
        providerReviews: true,
        opsMetrics: true,
        providerCapabilities: {
          include: {
            capability: true,
          },
        },
        providerSectorRules: {
          include: {
            sector: true,
          },
        },
      },
    })

    if (!providers || providers.length === 0) {
      return NextResponse.json(
        { error: "No providers available" },
        { status: 404 }
      )
    }

    // Get scoring weights
    const weights = await prisma.scoringWeight.findMany()
    const weightsMap: Record<string, number> = {}
    weights.forEach((w) => {
      weightsMap[w.factor] = w.weight
    })

    // Calculate recommendations
    const recommendations = calculateProviderRecommendations(
      providers,
      data,
      weightsMap
    )

    // Find sector by code if provided
    let sectorId: string | null = null
    if (data.sector_id) {
      const sector = await prisma.sector.findFirst({
        where: {
          OR: [
            { id: data.sector_id },
            { code: data.sector_id },
          ],
        },
      })
      sectorId = sector?.id || null
    }

    // Create wizard run record
    const wizardRun = await prisma.wizardRun.create({
      data: {
        locale: data.locale || "ar",
        ipHash: ipHash,
        sectorId: sectorId,
        businessType: data.business_type,
        monthlyGmv: data.monthly_gmv,
        txCount: data.tx_count,
        avgTicket: data.avg_ticket,
        refundsRate: data.refunds_rate / 100,
        chargebacksRate: data.chargebacks_rate / 100,
        paymentMix: data.payment_mix as object,
        needs: data.needs as object,
      },
    })

    // Store recommendations
    if (recommendations.length > 0) {
      await prisma.recommendation.createMany({
        data: recommendations.map((rec, index) => ({
          wizardRunId: wizardRun.id,
          providerId: rec.provider_id,
          rank: index + 1,
          expectedCostMin: rec.expected_cost_min,
          expectedCostMax: rec.expected_cost_max,
          breakdown: rec.breakdown,
          scoreTotal: rec.score_total,
          scoreCost: rec.score_cost,
          scoreFit: rec.score_fit,
          scoreOps: rec.score_ops,
          scoreRisk: rec.score_risk,
          reasons: rec.reasons,
          caveats: rec.caveats,
        })),
      })
    }

    return NextResponse.json({
      wizardRunId: wizardRun.id,
      recommendations: recommendations.slice(0, 5), // Top 5
    })
  } catch (error) {
    console.error("Wizard API error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    )
  }
}

async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder()
  const secret = process.env.NEXTAUTH_SECRET || "paygate-secret"
  const data = encoder.encode(ip + secret)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

interface RecommendationResult {
  provider_id: string
  provider_name_ar: string
  provider_name_en: string | null
  provider_slug: string
  provider_logo: string | null
  expected_cost_min: number
  expected_cost_max: number
  breakdown: any[]
  score_total: number
  score_cost: number
  score_fit: number
  score_ops: number
  score_risk: number
  reasons: string[]
  caveats: string[]
}

function calculateProviderRecommendations(
  providers: any[],
  formData: WizardFormData,
  weights: Record<string, number>
): RecommendationResult[] {
  const results: RecommendationResult[] = []
  const costWeight = (weights.cost || 30) / 100
  const fitWeight = (weights.fit || 25) / 100
  const opsWeight = (weights.ops || 20) / 100
  const riskWeight = (weights.risk || 15) / 100
  const ratingWeight = (weights.rating || 10) / 100

  // First pass: calculate all costs for normalization
  const allCosts: number[] = []
  for (const provider of providers) {
    const pricing = calculateProviderPricing(provider, formData)
    allCosts.push(pricing.totalCost)
  }
  const minCost = Math.min(...allCosts)
  const maxCost = Math.max(...allCosts)

  for (const provider of providers) {
    // Check sector compatibility
    const sectorRule = provider.sectorRules?.find(
      (r: any) => r.sector?.code === formData.sector_id
    )
    if (sectorRule && !sectorRule.isAllowed) {
      continue // Skip disallowed sectors
    }

    // Calculate pricing
    const pricing = calculateProviderPricing(provider, formData)

    // Calculate scores
    const costScore = calculateCostScore(pricing.totalCost, minCost, maxCost)
    const fitScore = calculateFitScore(provider, formData)
    const opsScore = calculateOpsScore(provider)
    const riskScore = calculateRiskScore(provider)
    const ratingScore = calculateRatingScore(provider)

    const totalScore =
      costScore * costWeight +
      fitScore * fitWeight +
      opsScore * opsWeight +
      riskScore * riskWeight +
      ratingScore * ratingWeight

    const reasons = generateReasons(provider, formData, formData.locale || "ar")
    const caveats = generateCaveats(provider, formData, formData.locale || "ar")

    results.push({
      provider_id: provider.id,
      provider_name_ar: provider.nameAr,
      provider_name_en: provider.nameEn,
      provider_slug: provider.slug,
      provider_logo: provider.logoPath,
      expected_cost_min: pricing.totalCostMin,
      expected_cost_max: pricing.totalCostMax,
      breakdown: pricing.breakdown,
      score_total: Math.round(totalScore * 100) / 100,
      score_cost: Math.round(costScore * 100) / 100,
      score_fit: Math.round(fitScore * 100) / 100,
      score_ops: Math.round(opsScore * 100) / 100,
      score_risk: Math.round(riskScore * 100) / 100,
      reasons,
      caveats,
    })
  }

  // Sort by total score descending
  results.sort((a, b) => b.score_total - a.score_total)

  return results
}

function calculateProviderPricing(
  provider: any,
  formData: WizardFormData
): { totalCost: number; totalCostMin: number; totalCostMax: number; breakdown: any[] } {
  const breakdown: any[] = []
  let totalCost = 0

  const monthlyVolume = formData.monthly_gmv
  const txCount = formData.tx_count

  // Calculate fees for each payment method in the mix
  for (const [methodCode, percentage] of Object.entries(formData.payment_mix)) {
    if (percentage <= 0) continue

    const methodVolume = (monthlyVolume * percentage) / 100
    const methodTxCount = Math.round((txCount * percentage) / 100)

    // Find fee for this payment method
    const fee = provider.providerFees?.find(
      (f: any) => f.paymentMethod?.code === methodCode
    )

    if (fee) {
      const feePercent = Number(fee.feePercent) || 0
      const feeFixed = Number(fee.feeFixed) || 0

      const percentageCost = (methodVolume * feePercent) / 100
      const fixedCost = methodTxCount * feeFixed
      const methodCost = percentageCost + fixedCost

      totalCost += methodCost

      breakdown.push({
        method: methodCode,
        volume: methodVolume,
        txCount: methodTxCount,
        feePercent,
        feeFixed,
        cost: methodCost,
      })
    } else {
      // Use default rates if no specific fee
      const defaultPercent = methodCode === "mada" ? 1.5 : 2.5
      const defaultFixed = 1

      const percentageCost = (methodVolume * defaultPercent) / 100
      const fixedCost = methodTxCount * defaultFixed
      const methodCost = percentageCost + fixedCost

      totalCost += methodCost

      breakdown.push({
        method: methodCode,
        volume: methodVolume,
        txCount: methodTxCount,
        feePercent: defaultPercent,
        feeFixed: defaultFixed,
        cost: methodCost,
        isEstimate: true,
      })
    }
  }

  // Add monthly fees
  const monthlyFee = Number(provider.monthlyFee) || 0
  if (monthlyFee > 0) {
    breakdown.push({ type: "monthly", cost: monthlyFee })
    totalCost += monthlyFee
  }

  return {
    totalCost,
    totalCostMin: totalCost * 0.95,
    totalCostMax: totalCost * 1.05,
    breakdown,
  }
}

function calculateCostScore(cost: number, minCost: number, maxCost: number): number {
  if (maxCost === minCost) return 100
  // Lower cost = higher score
  const normalized = 1 - (cost - minCost) / (maxCost - minCost)
  return normalized * 100
}

function calculateFitScore(provider: any, formData: WizardFormData): number {
  let score = 70 // Base score

  // Check payment method support
  const supportedMethods = provider.providerPaymentMethods?.map(
    (pm: any) => pm.paymentMethod?.code
  ) || []

  for (const [method, percentage] of Object.entries(formData.payment_mix)) {
    if (percentage > 0 && supportedMethods.includes(method)) {
      score += 5
    }
  }

  // Check capabilities match with needs
  const capabilities = provider.providerCapabilities?.map(
    (c: any) => c.capability?.code
  ) || []

  // Convert needs object to array of enabled needs
  const enabledNeeds = formData.needs 
    ? Object.entries(formData.needs)
        .filter(([, enabled]) => enabled === true)
        .map(([need]) => need)
    : []

  for (const need of enabledNeeds) {
    if (capabilities.includes(need)) {
      score += 3
    }
  }

  // Sector preference bonus
  const sectorRule = provider.providerSectorRules?.find(
    (r: any) => r.sector?.code === formData.sector_id
  )
  if (sectorRule?.isPreferred) {
    score += 10
  }

  return Math.min(score, 100)
}

function calculateOpsScore(provider: any): number {
  const metrics = provider.opsMetrics?.[0]
  if (!metrics) return 70

  const onboarding = metrics.onboardingScore || 70
  const support = metrics.supportScore || 70
  const docs = metrics.docsScore || 70

  return (onboarding + support + docs) / 3
}

function calculateRiskScore(provider: any): number {
  return 80 // Base risk score
}

function calculateRatingScore(provider: any): number {
  const review = provider.providerReviews?.[0]
  if (!review) return 70

  const rating = Number(review.ratingAvg) || 3.5
  return (rating / 5) * 100
}

function generateReasons(
  provider: any,
  formData: WizardFormData,
  locale: string
): string[] {
  const reasons: string[] = []
  const isAr = locale === "ar"

  const supportedMethods = provider.providerPaymentMethods?.map(
    (pm: any) => pm.paymentMethod?.code
  ) || []

  if (supportedMethods.includes("mada")) {
    reasons.push(isAr ? "يدعم مدى" : "Supports Mada")
  }

  if (supportedMethods.includes("apple_pay")) {
    reasons.push(isAr ? "يدعم Apple Pay" : "Supports Apple Pay")
  }

  const sectorRule = provider.providerSectorRules?.find(
    (r: any) => r.sector?.code === formData.sector_id
  )
  if (sectorRule?.isPreferred) {
    reasons.push(isAr ? "متخصص في قطاعك" : "Specialized in your sector")
  }

  const metrics = provider.opsMetrics?.[0]
  if (metrics?.onboardingScore && metrics.onboardingScore >= 80) {
    reasons.push(isAr ? "تفعيل سريع" : "Fast activation")
  }

  if (metrics?.supportScore && metrics.supportScore >= 80) {
    reasons.push(isAr ? "دعم فني ممتاز" : "Excellent support")
  }

  return reasons.slice(0, 4)
}

function generateCaveats(
  provider: any,
  formData: WizardFormData,
  locale: string
): string[] {
  const caveats: string[] = []
  const isAr = locale === "ar"

  const setupFee = Number(provider.setupFee) || 0
  const monthlyFee = Number(provider.monthlyFee) || 0

  if (setupFee > 0) {
    caveats.push(
      isAr ? `رسوم تسجيل: ${setupFee} ر.س` : `Setup fee: ${setupFee} SAR`
    )
  }

  if (monthlyFee > 0) {
    caveats.push(
      isAr ? `رسوم شهرية: ${monthlyFee} ر.س` : `Monthly fee: ${monthlyFee} SAR`
    )
  }

  return caveats.slice(0, 3)
}
