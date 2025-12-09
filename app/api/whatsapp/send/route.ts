import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { sendResultsViaWhatsApp } from "@/lib/whatsapp"
import { generateProfessionalPDF } from "@/lib/pdf-service"
import { savePDF } from "@/lib/pdf-storage"
import type { Recommendation, WizardFormData, PaymentMix, WizardNeeds, CostBreakdown } from "@/lib/types"

interface SendRequest {
  leadId: string
  wizardRunId: string
  pdfUrl?: string // Optional - will be generated if not provided
  locale?: "ar" | "en"
}

/**
 * POST /api/whatsapp/send
 * 
 * Send comparison results to a lead via WhatsApp
 * This is called after wizard submission to deliver PDF results
 * 
 * If pdfUrl is not provided, generates PDF automatically
 */
export async function POST(request: NextRequest) {
  try {
    const body: SendRequest = await request.json()
    const { leadId, wizardRunId, locale = "ar" } = body
    let { pdfUrl } = body

    // Validate required fields
    if (!leadId || !wizardRunId) {
      return NextResponse.json(
        { error: "Missing required fields: leadId, wizardRunId" },
        { status: 400 }
      )
    }

    // Get lead from database
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
    })

    if (!lead) {
      return NextResponse.json(
        { error: "Lead not found" },
        { status: 404 }
      )
    }

    // Check if already sent
    if (lead.whatsappStatus === "sent") {
      return NextResponse.json({
        success: true,
        message: "Already sent",
        whatsappStatus: "sent",
      })
    }

    // Validate phone number
    if (!lead.phoneNormalized) {
      await prisma.lead.update({
        where: { id: leadId },
        data: {
          whatsappStatus: "failed",
          lastError: "No normalized phone number",
        },
      })
      return NextResponse.json(
        { error: "Lead has no valid phone number" },
        { status: 400 }
      )
    }

    // Update status to sending
    await prisma.lead.update({
      where: { id: leadId },
      data: { whatsappStatus: "sending" },
    })

    // Get platform URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                    "https://paygate-optimizer.vercel.app")

    // Generate PDF if not provided
    if (!pdfUrl) {
      try {
        // Fetch wizard run data
        const wizardRun = await prisma.wizardRun.findUnique({
          where: { id: wizardRunId },
          include: {
            recommendations: {
              include: { provider: true },
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
            mada: 60, visa_mc: 25, apple_pay: 10, google_pay: 5, other: 0,
          },
          refunds_rate: Number(wizardRun.refundsRate) || 2,
          chargebacks_rate: Number(wizardRun.chargebacksRate) || 0.5,
          needs: (wizardRun.needs as unknown as WizardNeeds) || {},
          contact: {
            fullName: lead.name,
            companyName: lead.companyName || "",
            sector: lead.sector || "",
            phone: { raw: lead.phoneRaw || "", normalized: lead.phoneNormalized || "", countryCode: lead.countryCode || "966", isValid: true },
          },
          locale,
        }

        const sectorName = wizardRun.sector ? (locale === "ar" ? wizardRun.sector.nameAr : wizardRun.sector.nameEn) : undefined

        // Generate professional PDF
        const pdfResult = await generateProfessionalPDF({
          locale,
          wizardData,
          recommendations,
          sectorName,
        })

        if (!pdfResult.success || !pdfResult.pdfBase64) {
          console.error("PDF generation failed:", pdfResult.error)
          return NextResponse.json(
            { error: "Failed to generate PDF" },
            { status: 500 }
          )
        }

        // Save PDF to temp storage
        const pdfBuffer = Buffer.from(pdfResult.pdfBase64, 'base64')
        const savedPdf = await savePDF(pdfBuffer, wizardRunId)
        pdfUrl = `${baseUrl}${savedPdf.url}`
      } catch (pdfError) {
        console.error("PDF generation error:", pdfError)
        return NextResponse.json(
          { error: "Failed to generate PDF" },
          { status: 500 }
        )
      }
    }

    const platformUrl = `${baseUrl}/results/${wizardRunId}`

    // Send via WhatsApp
    const { textResult, docResult } = await sendResultsViaWhatsApp(
      lead.phoneNormalized,
      pdfUrl,
      lead.name,
      platformUrl,
      locale
    )

    // Determine overall success
    const success = textResult.success && docResult.success
    const partialSuccess = textResult.success || docResult.success

    // Build error message if any
    let errorMessage: string | null = null
    if (!success) {
      const errors = []
      if (!textResult.success) errors.push(`Text: ${textResult.error}`)
      if (!docResult.success) errors.push(`PDF: ${docResult.error}`)
      errorMessage = errors.join("; ")
    }

    // Update lead with result
    await prisma.lead.update({
      where: { id: leadId },
      data: {
        whatsappStatus: success ? "sent" : partialSuccess ? "sent" : "failed",
        whatsappSentAt: success || partialSuccess ? new Date() : null,
        lastError: errorMessage,
      },
    })

    return NextResponse.json({
      success,
      partialSuccess,
      whatsappStatus: success ? "sent" : partialSuccess ? "sent" : "failed",
      textResult: { success: textResult.success, error: textResult.error },
      docResult: { success: docResult.success, error: docResult.error },
    })

  } catch (error) {
    console.error("WhatsApp send error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * GET /api/whatsapp/send?leadId=xxx
 * 
 * Check WhatsApp send status for a lead
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const leadId = searchParams.get("leadId")

    if (!leadId) {
      return NextResponse.json(
        { error: "leadId is required" },
        { status: 400 }
      )
    }

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: {
        id: true,
        whatsappStatus: true,
        whatsappSentAt: true,
        lastError: true,
      },
    })

    if (!lead) {
      return NextResponse.json(
        { error: "Lead not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(lead)

  } catch (error) {
    console.error("WhatsApp status check error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
