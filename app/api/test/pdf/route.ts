import { NextRequest, NextResponse } from "next/server"
import { generateProfessionalPDF } from "@/lib/pdf-service"
import { uploadPDFToStorage, deletePDFFromStorage } from "@/lib/pdf-upload"

/**
 * GET /api/test/pdf
 * 
 * Test endpoint to verify PDF generation and Supabase upload
 * Remove this in production!
 */
export async function GET(request: NextRequest) {
  try {
    console.log("=== PDF Test Started ===")
    
    // Test data
    const testWizardData = {
      sector_id: "test",
      business_type: "company" as const,
      monthly_gmv: 100000,
      tx_count: 500,
      avg_ticket: 200,
      payment_mix: { mada: 60, visa_mc: 25, apple_pay: 10, google_pay: 5, other: 0 },
      refunds_rate: 2,
      chargebacks_rate: 0.5,
      needs: {
        recurring: false,
        tokenization: false,
        multi_currency: false,
        plugins_shopify: false,
        plugins_woocommerce: false,
        installments: false,
        payout_speed_same_day: false,
        localized_checkout: false,
        split_payments: false,
        fast_settlement: false,
        apple_pay: false,
        google_pay: false,
      },
      contact: {
        fullName: "اختبار",
        companyName: "شركة تجريبية",
        sector: "تجزئة",
        phone: { raw: "0500000000", normalized: "966500000000", countryCode: "966", isValid: true },
      },
      locale: "ar" as const,
    }
    
    const testRecommendations = [
      {
        id: "test-1",
        wizard_run_id: "test",
        provider_id: "test",
        rank: 1,
        provider_name_ar: "بوابة تجريبية",
        provider_name_en: "Test Gateway",
        expected_cost_min: 1500,
        expected_cost_max: 2000,
        score_total: 85,
        score_cost: 80,
        score_fit: 90,
        score_ops: 85,
        score_risk: 82,
        reasons: ["سهولة التكامل", "دعم فني ممتاز"],
        caveats: ["رسوم شهرية"],
        breakdown: [],
        created_at: new Date().toISOString(),
      },
    ]
    
    // Step 1: Generate PDF
    console.log("Step 1: Generating PDF...")
    const pdfResult = await generateProfessionalPDF({
      locale: "ar",
      wizardData: testWizardData,
      recommendations: testRecommendations,
      sectorName: "تجزئة",
    })
    
    console.log("PDF Result:", { 
      success: pdfResult.success, 
      method: pdfResult.method,
      error: pdfResult.error,
      hasBase64: !!pdfResult.pdfBase64,
      base64Length: pdfResult.pdfBase64?.length || 0
    })
    
    if (!pdfResult.success || !pdfResult.pdfBase64) {
      return NextResponse.json({
        step: "pdf_generation",
        success: false,
        error: pdfResult.error,
        method: pdfResult.method,
      }, { status: 500 })
    }
    
    // Step 2: Upload to Supabase
    console.log("Step 2: Uploading to Supabase Storage...")
    const pdfBuffer = Buffer.from(pdfResult.pdfBase64, 'base64')
    const uploadResult = await uploadPDFToStorage(pdfBuffer, "test-report.pdf")
    
    console.log("Upload Result:", uploadResult)
    
    if (!uploadResult.success) {
      return NextResponse.json({
        step: "supabase_upload",
        success: false,
        error: uploadResult.error,
        pdfMethod: pdfResult.method,
      }, { status: 500 })
    }
    
    // Step 3: Return success with URL
    console.log("=== PDF Test Successful ===")
    console.log("Public URL:", uploadResult.publicUrl)
    
    // Clean up after 30 seconds (in background)
    if (uploadResult.filePath) {
      setTimeout(() => {
        deletePDFFromStorage(uploadResult.filePath!).then(deleted => {
          console.log("Test PDF cleaned up:", deleted)
        })
      }, 30000)
    }
    
    return NextResponse.json({
      success: true,
      pdfMethod: pdfResult.method,
      publicUrl: uploadResult.publicUrl,
      filePath: uploadResult.filePath,
      message: "PDF generated and uploaded successfully! URL will be deleted in 30 seconds.",
    })
    
  } catch (error) {
    console.error("PDF Test Error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 })
  }
}
