import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import type { DataQualityIssue } from "@/lib/types"

export const dynamic = "force-dynamic"

const STALE_DATA_DAYS = 90 // Data older than 90 days is considered stale

export async function GET() {
  try {
    // Check admin role
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    if (user.role !== "admin") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 })
    }

    const issues: DataQualityIssue[] = []

    // 1. Providers without pricing_url
    const noPricingUrl = await prisma.provider.findMany({
      where: {
        isActive: true,
        pricingUrl: null,
      },
      select: {
        id: true,
        nameAr: true,
        nameEn: true,
        pricingUrl: true,
        lastVerifiedAt: true,
      },
    })

    for (const provider of noPricingUrl) {
      issues.push({
        provider_id: provider.id,
        provider_name: provider.nameAr,
        issue_type: "no_pricing_url",
        description: "المزود ليس لديه رابط صفحة الأسعار الرسمية",
        last_verified_at: provider.lastVerifiedAt?.toISOString() || null,
        severity: "medium",
      })
    }

    // 2. Stale data (last_verified_at > 90 days)
    const staleDate = new Date()
    staleDate.setDate(staleDate.getDate() - STALE_DATA_DAYS)

    const staleProviders = await prisma.provider.findMany({
      where: {
        isActive: true,
        lastVerifiedAt: {
          lt: staleDate,
        },
      },
      select: {
        id: true,
        nameAr: true,
        nameEn: true,
        lastVerifiedAt: true,
      },
    })

    for (const provider of staleProviders) {
      const daysSince = Math.floor(
        (Date.now() - new Date(provider.lastVerifiedAt).getTime()) / (1000 * 60 * 60 * 24)
      )
      issues.push({
        provider_id: provider.id,
        provider_name: provider.nameAr,
        issue_type: "stale_data",
        description: `آخر تحقق من البيانات منذ ${daysSince} يوم`,
        last_verified_at: provider.lastVerifiedAt?.toISOString() || null,
        severity: daysSince > 180 ? "high" : "medium",
      })
    }

    // 3. Estimated fees
    const estimatedFees = await prisma.providerFee.findMany({
      where: {
        isEstimated: true,
        isActive: true,
      },
      include: {
        provider: {
          select: { nameAr: true, nameEn: true },
        },
      },
    })

    // Group by provider
    const providerEstimates = new Map<string, { count: number; providerName: string }>()
    for (const fee of estimatedFees) {
      const existing = providerEstimates.get(fee.providerId)
      if (existing) {
        existing.count++
      } else {
        providerEstimates.set(fee.providerId, { count: 1, providerName: fee.provider.nameAr })
      }
    }

    for (const [providerId, data] of providerEstimates) {
      issues.push({
        provider_id: providerId,
        provider_name: data.providerName,
        issue_type: "estimated_data",
        description: `${data.count} رسوم مقدرة (غير مؤكدة)`,
        last_verified_at: null,
        severity: data.count > 3 ? "high" : "low",
      })
    }

    // 4. Missing fees (providers without any fees)
    const allProviders = await prisma.provider.findMany({
      where: { isActive: true },
      select: { id: true, nameAr: true, nameEn: true },
    })

    const providersWithFees = await prisma.providerFee.findMany({
      where: { isActive: true },
      select: { providerId: true },
      distinct: ["providerId"],
    })

    const providerIdsWithFees = new Set(providersWithFees.map(f => f.providerId))

    for (const provider of allProviders) {
      if (!providerIdsWithFees.has(provider.id)) {
        // Check pricing_rules as fallback
        const pricingRulesCount = await prisma.pricingRule.count({
          where: {
            providerId: provider.id,
            isActive: true,
          },
        })

        if (pricingRulesCount === 0) {
          issues.push({
            provider_id: provider.id,
            provider_name: provider.nameAr,
            issue_type: "missing_fees",
            description: "المزود ليس لديه رسوم مسجلة",
            last_verified_at: null,
            severity: "high",
          })
        }
      }
    }

    // 5. Missing integrations (active providers without any integrations)
    const providersWithIntegrations = await prisma.providerIntegration.findMany({
      where: { isActive: true },
      select: { providerId: true },
      distinct: ["providerId"],
    })

    const providerIdsWithIntegrations = new Set(providersWithIntegrations.map(i => i.providerId))

    for (const provider of allProviders) {
      if (!providerIdsWithIntegrations.has(provider.id)) {
        issues.push({
          provider_id: provider.id,
          provider_name: provider.nameAr,
          issue_type: "missing_integrations",
          description: "المزود ليس لديه تكاملات مسجلة",
          last_verified_at: null,
          severity: "low",
        })
      }
    }

    // Sort by severity
    const severityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 }
    issues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])

    // Summary stats
    const summary = {
      total_issues: issues.length,
      high_severity: issues.filter(i => i.severity === "high").length,
      medium_severity: issues.filter(i => i.severity === "medium").length,
      low_severity: issues.filter(i => i.severity === "low").length,
      by_type: {
        no_pricing_url: issues.filter(i => i.issue_type === "no_pricing_url").length,
        stale_data: issues.filter(i => i.issue_type === "stale_data").length,
        estimated_data: issues.filter(i => i.issue_type === "estimated_data").length,
        missing_fees: issues.filter(i => i.issue_type === "missing_fees").length,
        missing_integrations: issues.filter(i => i.issue_type === "missing_integrations").length,
      },
    }

    return NextResponse.json({ issues, summary })
  } catch (error) {
    console.error("Error checking data quality:", error)
    return NextResponse.json(
      { error: "فشل في فحص جودة البيانات" },
      { status: 500 }
    )
  }
}

