import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { sendResultsViaWhatsApp } from "@/lib/whatsapp"

interface SendRequest {
  leadId: string
  wizardRunId: string
  pdfUrl: string
  locale?: "ar" | "en"
}

/**
 * POST /api/whatsapp/send
 * 
 * Send comparison results to a lead via WhatsApp
 * This is called after wizard submission to deliver PDF results
 */
export async function POST(request: NextRequest) {
  try {
    const body: SendRequest = await request.json()
    const { leadId, wizardRunId, pdfUrl, locale = "ar" } = body

    // Validate required fields
    if (!leadId || !wizardRunId || !pdfUrl) {
      return NextResponse.json(
        { error: "Missing required fields: leadId, wizardRunId, pdfUrl" },
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
                    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                    "https://paygate-optimizer.vercel.app"
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
