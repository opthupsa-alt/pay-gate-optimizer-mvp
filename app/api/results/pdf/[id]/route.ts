import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { generatePDFContent } from "@/lib/pdf-export"
import type { Recommendation, WizardFormData, PaymentMix, WizardNeeds, CostBreakdown } from "@/lib/types"

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/results/pdf/[id]
 * 
 * Generate and return PDF content for a wizard run
 * Returns HTML that can be converted to PDF client-side or via external service
 */
export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const { id } = await context.params
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "html" // html, json
    
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
        { error: "Wizard run not found" },
        { status: 404 }
      )
    }

    // Build recommendations array for PDF
    const recommendations: Recommendation[] = wizardRun.recommendations.map((rec) => ({
      id: rec.id,
      wizard_run_id: rec.wizardRunId,
      provider_id: rec.providerId,
      rank: rec.rank,
      provider_name_ar: rec.provider.nameAr,
      provider_name_en: rec.provider.nameEn,
      expected_cost_min: Number(rec.expectedCostMin),
      expected_cost_max: Number(rec.expectedCostMax),
      score_total: Number(rec.scoreTotal),
      score_cost: Number(rec.scoreCost),
      score_fit: Number(rec.scoreFit),
      score_ops: Number(rec.scoreOps),
      score_risk: Number(rec.scoreRisk),
      reasons: rec.reasons as string[],
      caveats: rec.caveats as string[],
      breakdown: (rec.breakdown as unknown) as CostBreakdown[],
      created_at: rec.createdAt.toISOString(),
    }))

    // Build wizard data for PDF
    const wizardData: WizardFormData = {
      sector_id: wizardRun.sectorId || "",
      business_type: wizardRun.businessType || "company",
      monthly_gmv: Number(wizardRun.monthlyGmv) || 0,
      tx_count: wizardRun.txCount || 0,
      avg_ticket: Number(wizardRun.avgTicket) || 0,
      payment_mix: (wizardRun.paymentMix as unknown as PaymentMix) || {
        mada: 60,
        visa_mc: 25,
        apple_pay: 10,
        google_pay: 5,
        other: 0,
      },
      refunds_rate: Number(wizardRun.refundsRate) || 2,
      chargebacks_rate: Number(wizardRun.chargebacksRate) || 0.5,
      needs: (wizardRun.needs as unknown as WizardNeeds) || {},
      contact: {
        fullName: "",
        companyName: "",
        sector: "",
        phone: { raw: "", normalized: "", countryCode: "966", isValid: false },
      },
      locale: (wizardRun.locale as "ar" | "en") || "ar",
    }

    const locale = wizardData.locale

    // Generate PDF HTML content
    const htmlContent = generatePDFContent({
      locale,
      wizardData,
      recommendations,
    })

    if (format === "json") {
      // Return JSON data for client-side PDF generation
      return NextResponse.json({
        wizardRunId: id,
        locale,
        wizardData,
        recommendations,
        sector: wizardRun.sector ? {
          name_ar: wizardRun.sector.nameAr,
          name_en: wizardRun.sector.nameEn,
        } : null,
        createdAt: wizardRun.createdAt,
      })
    }

    // Return HTML content
    return new NextResponse(htmlContent, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "private, max-age=3600",
      },
    })

  } catch (error) {
    console.error("PDF generation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
