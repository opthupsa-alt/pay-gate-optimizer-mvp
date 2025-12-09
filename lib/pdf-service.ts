/**
 * PDF Service - Professional PDF Generation
 * 
 * خدمة توليد ملفات PDF احترافية
 * 
 * تستخدم PDFShift API لتحويل HTML إلى PDF بجودة عالية
 * يدعم العربية والإنجليزية مع خطوط Cairo
 * 
 * الإعدادات تُقرأ من:
 * 1. قاعدة البيانات (site_settings) - الأولوية الأولى
 * 2. متغيرات البيئة - احتياطي
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

interface PDFSettings {
  provider: 'pdfshift' | 'html2pdf' | 'fallback'
  pdfshiftApiKey: string
  html2pdfApiKey: string
  enabled: boolean
}

// ==================== Constants ====================

const PDFSHIFT_API_URL = 'https://api.pdfshift.io/v3/convert/pdf'
const HTML2PDF_API_URL = 'https://api.html2pdf.app/v1/generate'

// Cache for PDF settings
let pdfSettingsCache: PDFSettings | null = null
let settingsCacheTimestamp = 0
const SETTINGS_CACHE_TTL = 60 * 1000 // 1 minute

// ==================== Settings Functions ====================

/**
 * Get PDF settings from database with fallback to env vars
 */
async function getPDFSettings(): Promise<PDFSettings> {
  const now = Date.now()
  
  // Return cached if valid
  if (pdfSettingsCache && (now - settingsCacheTimestamp) < SETTINGS_CACHE_TTL) {
    return pdfSettingsCache
  }
  
  try {
    // Dynamic import to avoid circular dependencies
    const { prisma } = await import('./db')
    
    // Try to get from database
    const dbSettings = await prisma.siteSetting.findMany({
      where: {
        key: {
          in: ['pdf.provider', 'pdf.pdfshift_api_key', 'pdf.html2pdf_api_key', 'pdf.enabled']
        }
      }
    })
    
    const settingsMap = new Map<string, string>(dbSettings.map((s: { key: string; value: string }) => [s.key, s.value]))
    
    pdfSettingsCache = {
      provider: (settingsMap.get('pdf.provider') as PDFSettings['provider']) || 'pdfshift',
      pdfshiftApiKey: String(settingsMap.get('pdf.pdfshift_api_key') || process.env.PDFSHIFT_API_KEY || ''),
      html2pdfApiKey: String(settingsMap.get('pdf.html2pdf_api_key') || process.env.HTML2PDF_API_KEY || ''),
      enabled: settingsMap.get('pdf.enabled') !== 'false',
    }
    settingsCacheTimestamp = now
    
    return pdfSettingsCache!
  } catch (error) {
    console.warn('Failed to get PDF settings from DB, using env vars:', error)
    // Fallback to env vars
    return {
      provider: 'pdfshift',
      pdfshiftApiKey: process.env.PDFSHIFT_API_KEY || '',
      html2pdfApiKey: process.env.HTML2PDF_API_KEY || '',
      enabled: true,
    }
  }
}

/**
 * Clear PDF settings cache (call after settings update)
 */
export function clearPDFSettingsCache() {
  pdfSettingsCache = null
  settingsCacheTimestamp = 0
}

// ==================== Main Function ====================

/**
 * Generate a professional PDF from wizard results
 * Uses provider from settings, with fallbacks
 */
export async function generateProfessionalPDF(options: PDFGenerationOptions): Promise<PDFResult> {
  const { locale, wizardData, recommendations, sectorName } = options
  
  // Get settings from database
  const settings = await getPDFSettings()
  
  // Check if PDF generation is enabled
  if (!settings.enabled) {
    return {
      success: false,
      error: 'PDF generation is disabled in settings',
    }
  }
  
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
  
  // Use configured provider
  if (settings.provider === 'pdfshift' && settings.pdfshiftApiKey) {
    const result = await generateWithPDFShift(finalHtml, locale, settings.pdfshiftApiKey)
    if (result.success) return result
    console.warn('PDFShift failed, trying fallback:', result.error)
  }
  
  if (settings.provider === 'html2pdf' && settings.html2pdfApiKey) {
    const result = await generateWithHTML2PDF(finalHtml, locale, settings.html2pdfApiKey)
    if (result.success) return result
    console.warn('HTML2PDF failed, using HTML fallback:', result.error)
  }
  
  // Try other provider if primary fails
  if (settings.provider !== 'pdfshift' && settings.pdfshiftApiKey) {
    const result = await generateWithPDFShift(finalHtml, locale, settings.pdfshiftApiKey)
    if (result.success) return result
  }
  
  if (settings.provider !== 'html2pdf' && settings.html2pdfApiKey) {
    const result = await generateWithHTML2PDF(finalHtml, locale, settings.html2pdfApiKey)
    if (result.success) return result
  }
  
  // Fallback: Return HTML that can be converted client-side
  return {
    success: true,
    pdfBase64: Buffer.from(finalHtml).toString('base64'),
    method: 'fallback',
  }
}

// ==================== PDFShift Integration ====================

async function generateWithPDFShift(html: string, locale: 'ar' | 'en', apiKey: string): Promise<PDFResult> {
  try {
    const response = await fetch(PDFSHIFT_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`api:${apiKey}`).toString('base64')}`,
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

async function generateWithHTML2PDF(html: string, locale: 'ar' | 'en', apiKey: string): Promise<PDFResult> {
  try {
    const response = await fetch(HTML2PDF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        html: html,
        apiKey: apiKey,
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
