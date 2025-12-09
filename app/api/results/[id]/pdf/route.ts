import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { generateProfessionalPDF, generatePDFFilename, getPDFMimeType } from "@/lib/pdf-service"
import type { Recommendation, WizardFormData, PaymentMix, WizardNeeds, CostBreakdown } from "@/lib/types"

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/results/[id]/pdf
 * 
 * Generate and download professional PDF for wizard results
 * Returns actual PDF binary file (not HTML)
 */
export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const { id } = await context.params
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "download" // download, base64
    
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

    const locale = (wizardRun.locale as "ar" | "en") || "ar"

    // Build recommendations array
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

    // Build wizard data
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
      locale,
    }

    const sectorName = wizardRun.sector 
      ? (locale === "ar" ? wizardRun.sector.nameAr : wizardRun.sector.nameEn)
      : undefined

    // Generate PDF
    const pdfResult = await generateProfessionalPDF({
      locale,
      wizardData,
      recommendations,
      sectorName,
    })

    if (!pdfResult.success) {
      return NextResponse.json(
        { error: pdfResult.error || "PDF generation failed" },
        { status: 500 }
      )
    }

    const filename = generatePDFFilename(locale, id)

    // Return based on format
    if (format === "base64") {
      return NextResponse.json({
        success: true,
        filename,
        pdfBase64: pdfResult.pdfBase64,
        method: pdfResult.method,
        mimeType: pdfResult.method === 'fallback' ? 'text/html' : getPDFMimeType(),
      })
    }

    // Return as downloadable file
    const contentType = pdfResult.method === 'fallback' 
      ? 'text/html; charset=utf-8'
      : getPDFMimeType()
    
    const fileExtension = pdfResult.method === 'fallback' ? '.html' : '.pdf'
    const downloadFilename = filename.replace('.pdf', fileExtension)

    const buffer = pdfResult.pdfBuffer || Buffer.from(pdfResult.pdfBase64 || '', 'base64')

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${downloadFilename}"`,
        "Content-Length": buffer.length.toString(),
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
