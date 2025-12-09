import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/results/[id]
 * 
 * Fetch wizard run results from database
 * This allows sharing results via URL (works across devices/browsers)
 */
export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const { id } = await context.params

    // Fetch wizard run with recommendations
    const wizardRun = await prisma.wizardRun.findUnique({
      where: { id },
      include: {
        recommendations: {
          include: {
            provider: true,
          },
          orderBy: { rank: "asc" },
          take: 5,
        },
        sector: true,
      },
    })

    if (!wizardRun) {
      return NextResponse.json(
        { error: "Results not found" },
        { status: 404 }
      )
    }

    // Build response in the format expected by the results page
    const recommendations = wizardRun.recommendations.map((rec) => ({
      provider_id: rec.providerId,
      provider_name_ar: rec.provider.nameAr,
      provider_name_en: rec.provider.nameEn,
      expected_cost_min: Number(rec.expectedCostMin),
      expected_cost_max: Number(rec.expectedCostMax),
      score_total: rec.scoreTotal,
      score_cost: rec.scoreCost,
      score_fit: rec.scoreFit,
      score_ops: rec.scoreOps,
      score_risk: rec.scoreRisk,
      reasons: rec.reasons as string[],
      caveats: rec.caveats as string[],
      breakdown: rec.breakdown as Array<{
        payment_method?: string
        method?: string
        tx_count?: number
        txCount?: number
        volume?: number
        fee_amount?: number
        cost?: number
        fee_percent?: number
        feePercent?: number
        fee_fixed?: number
        feeFixed?: number
        isMonthlyFee?: boolean
        isEstimate?: boolean
      }>,
    }))

    return NextResponse.json({
      wizardRunId: wizardRun.id,
      recommendations,
      wizardRun: {
        monthly_gmv: Number(wizardRun.monthlyGmv) || 0,
        tx_count: wizardRun.txCount || 0,
        avg_ticket: Number(wizardRun.avgTicket) || 0,
        locale: wizardRun.locale as "ar" | "en",
        sector: wizardRun.sector ? {
          name_ar: wizardRun.sector.nameAr,
          name_en: wizardRun.sector.nameEn,
        } : null,
        business_type: wizardRun.businessType,
        created_at: wizardRun.createdAt.toISOString(),
      },
    })

  } catch (error) {
    console.error("Results API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
