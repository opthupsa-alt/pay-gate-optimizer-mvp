/**
 * PDF Service - Professional PDF Generation
 * 
 * خدمة توليد ملفات PDF احترافية
 * 
 * تستخدم PDFShift API لتحويل HTML إلى PDF بجودة عالية
 * يدعم العربية والإنجليزية مع خطوط Cairo
 * 
 * للاستخدام:
 * 1. أضف PDFSHIFT_API_KEY في ملف .env
 * 2. اختيارياً: يمكن استخدام خدمات أخرى مثل html2pdf.app
 */

import { generatePDFContent } from './pdf-export'
import type { Recommendation, WizardFormData } from './types'

// ==================== Types ====================

export interface PDFGenerationOptions {
  locale: 'ar' | 'en'
  wizardData: WizardFormData
  recommendations: Recommendation[]
  sectorName?: string
}

export interface PDFResult {
  success: boolean
  pdfBuffer?: Buffer
  pdfBase64?: string
  error?: string
  method?: 'pdfshift' | 'html2pdf' | 'fallback'
}

// ==================== Constants ====================

const PDFSHIFT_API_URL = 'https://api.pdfshift.io/v3/convert/pdf'
const HTML2PDF_API_URL = 'https://api.html2pdf.app/v1/generate'

// ==================== Main Function ====================

/**
 * Generate a professional PDF from wizard results
 * Tries multiple methods in order of preference
 */
export async function generateProfessionalPDF(options: PDFGenerationOptions): Promise<PDFResult> {
  const { locale, wizardData, recommendations, sectorName } = options
  
  // Generate HTML content
  const htmlContent = generatePDFContent({
    locale,
    wizardData,
    recommendations,
  })
  
  // Add sector name to header if available
  const finalHtml = sectorName 
    ? htmlContent.replace('</head>', `<meta name="sector" content="${sectorName}"></head>`)
    : htmlContent
  
  // Try PDFShift first (best quality)
  if (process.env.PDFSHIFT_API_KEY) {
    const result = await generateWithPDFShift(finalHtml, locale)
    if (result.success) return result
    console.warn('PDFShift failed, trying fallback:', result.error)
  }
  
  // Try HTML2PDF.app as fallback
  if (process.env.HTML2PDF_API_KEY) {
    const result = await generateWithHTML2PDF(finalHtml, locale)
    if (result.success) return result
    console.warn('HTML2PDF failed, using HTML fallback:', result.error)
  }
  
  // Fallback: Return HTML that can be converted client-side
  return {
    success: true,
    pdfBase64: Buffer.from(finalHtml).toString('base64'),
    method: 'fallback',
  }
}

// ==================== PDFShift Integration ====================

async function generateWithPDFShift(html: string, locale: 'ar' | 'en'): Promise<PDFResult> {
  try {
    const response = await fetch(PDFSHIFT_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`api:${process.env.PDFSHIFT_API_KEY}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: html,
        sandbox: false,
        format: 'A4',
        margin: {
          top: '20mm',
          bottom: '20mm',
          left: '15mm',
          right: '15mm',
        },
        // Enable Arabic support
        wait_for: 'fonts',
        // Add custom styles for RTL
        css: locale === 'ar' ? `
          * { direction: rtl; text-align: right; }
          body { font-family: 'Cairo', Arial, sans-serif; }
        ` : '',
      }),
    })
    
    if (!response.ok) {
      const error = await response.text()
      return { success: false, error: `PDFShift error: ${error}` }
    }
    
    const pdfBuffer = Buffer.from(await response.arrayBuffer())
    return {
      success: true,
      pdfBuffer,
      pdfBase64: pdfBuffer.toString('base64'),
      method: 'pdfshift',
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'PDFShift request failed',
    }
  }
}

// ==================== HTML2PDF.app Integration ====================

async function generateWithHTML2PDF(html: string, locale: 'ar' | 'en'): Promise<PDFResult> {
  try {
    const response = await fetch(HTML2PDF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HTML2PDF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        html: html,
        apiKey: process.env.HTML2PDF_API_KEY,
        format: 'A4',
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 15,
        marginRight: 15,
        printBackground: true,
        preferCssPageSize: false,
      }),
    })
    
    if (!response.ok) {
      const error = await response.text()
      return { success: false, error: `HTML2PDF error: ${error}` }
    }
    
    const pdfBuffer = Buffer.from(await response.arrayBuffer())
    return {
      success: true,
      pdfBuffer,
      pdfBase64: pdfBuffer.toString('base64'),
      method: 'html2pdf',
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'HTML2PDF request failed',
    }
  }
}

// ==================== Utility Functions ====================

/**
 * Generate a filename for the PDF
 */
export function generatePDFFilename(locale: 'ar' | 'en', wizardRunId?: string): string {
  const timestamp = new Date().toISOString().split('T')[0]
  const prefix = locale === 'ar' ? 'تقرير-بوابات-الدفع' : 'payment-gateway-report'
  const id = wizardRunId ? `-${wizardRunId.slice(-8)}` : ''
  return `${prefix}${id}-${timestamp}.pdf`
}

/**
 * Get MIME type for PDF
 */
export function getPDFMimeType(): string {
  return 'application/pdf'
}
