import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { z } from "zod"
import type { WizardFormData, PaymentMix, WizardNeeds } from "@/lib/types"
import { checkRateLimit, getClientIP, RateLimitPresets, createRateLimitHeaders } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"

// Validation schema
const compareSchema = z.object({
  sector_id: z.string().optional(),
  monthly_gmv: z.number().min(0),
  tx_count: z.number().min(0),
  avg_ticket: z.number().min(0),
  payment_mix: z.object({
    mada: z.number().min(0).max(100),
    visa_mc: z.number().min(0).max(100),
    apple_pay: z.number().min(0).max(100),
    google_pay: z.number().min(0).max(100),
    stc_pay: z.number().min(0).max(100).optional(),
    tabby: z.number().min(0).max(100).optional(),
    tamara: z.number().min(0).max(100).optional(),
    other: z.number().min(0).max(100),
  }),
  needs: z.object({
    recurring: z.boolean(),
    tokenization: z.boolean(),
    multi_currency: z.boolean(),
    international_customers: z.boolean().optional(),
    plugins_shopify: z.boolean(),
    plugins_woocommerce: z.boolean(),
    plugins_salla: z.boolean().optional(),
    plugins_zid: z.boolean().optional(),
    fast_settlement: z.boolean(),
    apple_pay: z.boolean(),
    google_pay: z.boolean(),
    bnpl_support: z.boolean().optional(),
  }),
  platform: z.string().optional(),
  refunds_rate: z.number().min(0).max(100).optional(),
  chargebacks_rate: z.number().min(0).max(100).optional(),
  locale: z.enum(["ar", "en"]).optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request)
    const rateLimitResult = checkRateLimit(clientIP, RateLimitPresets.wizard)
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: "تم تجاوز الحد الأقصى للطلبات. يرجى المحاولة بعد قليل.",
          retryAfter: rateLimitResult.resetIn
        },
        { 
          status: 429,
          headers: createRateLimitHeaders(rateLimitResult)
        }
      )
    }

    const body = await request.json()
    
    // Validate request
    const validation = compareSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: "بيانات غير صالحة",
          details: validation.error.errors 
        },
        { status: 400 }
      )
    }

    const data = validation.data

    // Convert to WizardFormData format
    const wizardData: WizardFormData = {
      sector_id: data.sector_id || "",
      business_type: "ecommerce",
      monthly_gmv: data.monthly_gmv,
      tx_count: data.tx_count,
      avg_ticket: data.avg_ticket,
      payment_mix: data.payment_mix as PaymentMix,
      refunds_rate: data.refunds_rate || 2,
      chargebacks_rate: data.chargebacks_rate || 0.5,
      needs: data.needs as WizardNeeds,
      platform: data.platform as WizardFormData["platform"],
      locale: data.locale || "ar",
    }

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
      wizardData,
      weightsMap
    )

    // Hash IP for privacy
    const ipHash = await hashIP(clientIP)

    // Find sector by code if provided
    let sectorId: string | null = null
    if (wizardData.sector_id) {
      const sector = await prisma.sector.findFirst({
        where: {
          OR: [
            { id: wizardData.sector_id },
            { code: wizardData.sector_id },
          ],
        },
      })
      sectorId = sector?.id || null
    }

    // Create wizard run record
    const wizardRun = await prisma.wizardRun.create({
      data: {
        locale: wizardData.locale || "ar",
        ipHash: ipHash,
        sectorId: sectorId,
        businessType: wizardData.business_type,
        monthlyGmv: wizardData.monthly_gmv,
        txCount: wizardData.tx_count,
        avgTicket: wizardData.avg_ticket,
        refundsRate: (wizardData.refunds_rate || 0) / 100,
        chargebacksRate: (wizardData.chargebacks_rate || 0) / 100,
        paymentMix: wizardData.payment_mix as object,
        needs: Object.keys(wizardData.needs).filter(k => (wizardData.needs as any)[k]),
      },
    })

    // Store recommendations
    if (recommendations.length > 0) {
      await prisma.recommendation.createMany({
        data: recommendations.slice(0, 10).map((rec, index) => ({
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
      recommendations: recommendations.slice(0, 5),
      total: recommendations.length,
    })
  } catch (error) {
    console.error("Compare API error:", error instanceof Error ? error.message : "Unknown error")
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder()
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) throw new Error("NEXTAUTH_SECRET is required")
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
    const sectorRule = provider.providerSectorRules?.find(
      (r: any) => r.sector?.code === formData.sector_id
    )
    if (sectorRule && !sectorRule.isSupported) {
      continue
    }

    // Calculate pricing
    const pricing = calculateProviderPricing(provider, formData)

    // Calculate scores
    const costScore = calculateCostScore(pricing.totalCost, minCost, maxCost)
    const fitScore = calculateFitScore(provider, formData)
    const opsScore = calculateOpsScore(provider)
    const riskScore = 80
    const ratingScore = calculateRatingScore(provider)

    const totalScore =
      costScore * costWeight +
      fitScore * fitWeight +
      opsScore * opsWeight +
      riskScore * riskWeight +
      ratingScore * ratingWeight

    const reasons = generateReasons(provider, formData, formData.locale || "ar")
    const caveats = generateCaveats(provider, formData.locale || "ar")

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
      score_risk: 80,
      reasons,
      caveats,
    })
  }

  results.sort((a, b) => b.score_total - a.score_total)
  return results
}

function calculateProviderPricing(provider: any, formData: WizardFormData) {
  const breakdown: any[] = []
  let totalCost = 0

  const monthlyVolume = formData.monthly_gmv
  const txCount = formData.tx_count

  for (const [methodCode, percentage] of Object.entries(formData.payment_mix)) {
    if (percentage <= 0) continue

    const methodVolume = (monthlyVolume * percentage) / 100
    const methodTxCount = Math.round((txCount * percentage) / 100)

    const fee = provider.providerFees?.find((f: any) => f.paymentMethod?.code === methodCode)

    if (fee) {
      const feePercent = Number(fee.feePercent) || 0
      const feeFixed = Number(fee.feeFixed) || 0
      const percentageCost = (methodVolume * feePercent) / 100
      const fixedCost = methodTxCount * feeFixed
      const methodCost = percentageCost + fixedCost
      totalCost += methodCost
      breakdown.push({ method: methodCode, volume: methodVolume, txCount: methodTxCount, feePercent, feeFixed, cost: methodCost })
    } else {
      const defaultPercent = methodCode === "mada" ? 1.5 : 2.5
      const defaultFixed = 1
      const percentageCost = (methodVolume * defaultPercent) / 100
      const fixedCost = methodTxCount * defaultFixed
      const methodCost = percentageCost + fixedCost
      totalCost += methodCost
      breakdown.push({ method: methodCode, volume: methodVolume, txCount: methodTxCount, feePercent: defaultPercent, feeFixed: defaultFixed, cost: methodCost, isEstimate: true })
    }
  }

  const monthlyFee = Number(provider.monthlyFee) || 0
  if (monthlyFee > 0) {
    breakdown.push({ type: "monthly", cost: monthlyFee })
    totalCost += monthlyFee
  }

  return { totalCost, totalCostMin: totalCost * 0.95, totalCostMax: totalCost * 1.05, breakdown }
}

function calculateCostScore(cost: number, minCost: number, maxCost: number): number {
  if (maxCost === minCost) return 100
  return (1 - (cost - minCost) / (maxCost - minCost)) * 100
}

function calculateFitScore(provider: any, formData: WizardFormData): number {
  let score = 70
  const supportedMethods = provider.providerPaymentMethods?.map((pm: any) => pm.paymentMethod?.code) || []
  for (const [method, percentage] of Object.entries(formData.payment_mix)) {
    if (percentage > 0 && supportedMethods.includes(method)) score += 5
  }
  const capabilities = provider.providerCapabilities?.map((c: any) => c.capability?.code) || []
  const needs = formData.needs as any
  if (needs.recurring && capabilities.includes("recurring")) score += 5
  if (needs.tokenization && capabilities.includes("tokenization")) score += 5
  if (needs.multi_currency && capabilities.includes("multi_currency")) score += 5
  const sectorRule = provider.providerSectorRules?.find((r: any) => r.sector?.code === formData.sector_id)
  if (sectorRule?.isSupported) score += 5
  return Math.min(score, 100)
}

function calculateOpsScore(provider: any): number {
  const metrics = provider.opsMetrics
  if (!metrics) return 70
  return ((metrics.onboardingScore || 70) + (metrics.supportScore || 70) + (metrics.docsScore || 70)) / 3
}

function calculateRatingScore(provider: any): number {
  const review = provider.providerReviews?.[0]
  if (!review) return 70
  return (Number(review.ratingAvg) || 3.5) / 5 * 100
}

function generateReasons(provider: any, formData: WizardFormData, locale: string): string[] {
  const reasons: string[] = []
  const isAr = locale === "ar"
  const supportedMethods = provider.providerPaymentMethods?.map((pm: any) => pm.paymentMethod?.code) || []
  if (supportedMethods.includes("mada")) reasons.push(isAr ? "يدعم مدى" : "Supports Mada")
  if (supportedMethods.includes("apple_pay")) reasons.push(isAr ? "يدعم Apple Pay" : "Supports Apple Pay")
  const sectorRule = provider.providerSectorRules?.find((r: any) => r.sector?.code === formData.sector_id)
  if (sectorRule?.isSupported) reasons.push(isAr ? "يدعم قطاعك" : "Supports your sector")
  const metrics = provider.opsMetrics
  if (metrics?.onboardingScore >= 80) reasons.push(isAr ? "تفعيل سريع" : "Fast activation")
  if (metrics?.supportScore >= 80) reasons.push(isAr ? "دعم فني ممتاز" : "Excellent support")
  return reasons.slice(0, 4)
}

function generateCaveats(provider: any, locale: string): string[] {
  const caveats: string[] = []
  const isAr = locale === "ar"
  const setupFee = Number(provider.setupFee) || 0
  const monthlyFee = Number(provider.monthlyFee) || 0
  if (setupFee > 0) caveats.push(isAr ? `رسوم تسجيل: ${setupFee} ر.س` : `Setup fee: ${setupFee} SAR`)
  if (monthlyFee > 0) caveats.push(isAr ? `رسوم شهرية: ${monthlyFee} ر.س` : `Monthly fee: ${monthlyFee} SAR`)
  return caveats.slice(0, 3)
}

