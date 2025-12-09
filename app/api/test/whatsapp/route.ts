import { NextRequest, NextResponse } from "next/server"
import { sendWhatsAppDocument, sendWhatsAppText } from "@/lib/whatsapp"

/**
 * GET /api/test/whatsapp
 * 
 * Test WhatsApp document sending directly
 * 
 * Query params:
 * - phone: Phone number to send to (required)
 * - url: PDF URL to send (optional, uses a test PDF)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const phone = searchParams.get('phone')
  const pdfUrl = searchParams.get('url') || 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf' // Test PDF from W3C
  
  if (!phone) {
    return NextResponse.json({
      error: "Missing phone parameter. Use: /api/test/whatsapp?phone=966XXXXXXXXX",
    }, { status: 400 })
  }
  
  console.log("=== WhatsApp Test Started ===")
  console.log("Phone:", phone)
  console.log("PDF URL:", pdfUrl)
  
  try {
    // Step 1: Send text message
    console.log("Step 1: Sending text message...")
    const textResult = await sendWhatsAppText(
      phone,
      "🧪 اختبار إرسال PDF من PayGate Optimizer\n\nهذه رسالة تجريبية للتحقق من إرسال الملفات عبر واتساب."
    )
    console.log("Text result:", JSON.stringify(textResult, null, 2))
    
    // Wait 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Step 2: Send document
    console.log("Step 2: Sending document...")
    const docResult = await sendWhatsAppDocument(
      phone,
      pdfUrl,
      "📄 ملف تجريبي - Test PDF"
    )
    console.log("Document result:", JSON.stringify(docResult, null, 2))
    
    return NextResponse.json({
      success: textResult.success && docResult.success,
      phone,
      pdfUrl,
      textResult: {
        success: textResult.success,
        error: textResult.error,
        data: textResult.data,
      },
      docResult: {
        success: docResult.success,
        error: docResult.error,
        data: docResult.data,
      },
    })
    
  } catch (error) {
    console.error("WhatsApp test error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 })
  }
}
