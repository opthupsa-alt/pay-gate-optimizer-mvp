/**
 * WhatsApp QR REST API Client
 * 
 * Integration with wa.washeej.com WhatsApp API
 * for sending comparison results via WhatsApp
 * 
 * Settings Priority:
 * 1. Database (site_settings table) - can be edited from admin panel
 * 2. Environment Variables - fallback
 * 3. Default values - hardcoded defaults
 * 
 * Environment Variables (fallback):
 * - WHATSAPP_API_BASE_URL: Base URL for WhatsApp API (default: https://wa.washeej.com)
 * - WHATSAPP_FROM_NUMBER: Sender phone number (default: 966565740429)
 * - WHATSAPP_QR_API_TOKEN: API token for authentication
 */

import { getWhatsAppSettings } from "@/lib/settings"

// Cache for WhatsApp settings (to avoid DB calls on every message)
let settingsCache: { apiBaseUrl: string; fromNumber: string; enabled: boolean } | null = null
let cacheTimestamp = 0
const CACHE_TTL = 60 * 1000 // 1 minute

/**
 * Get WhatsApp settings with caching
 * Reads from database first, falls back to env vars
 */
async function getSettings() {
  const now = Date.now()
  
  // Return cached if valid
  if (settingsCache && (now - cacheTimestamp) < CACHE_TTL) {
    return settingsCache
  }
  
  try {
    // Try to get from database
    const dbSettings = await getWhatsAppSettings()
    settingsCache = dbSettings
    cacheTimestamp = now
    return dbSettings
  } catch (error) {
    // Fallback to env vars if DB fails
    console.warn("Failed to get WhatsApp settings from DB, using env vars:", error)
    return {
      apiBaseUrl: process.env.WHATSAPP_API_BASE_URL || "https://wa.washeej.com",
      fromNumber: process.env.WHATSAPP_FROM_NUMBER || "966565740429",
      enabled: true,
    }
  }
}

// Sync getters for backward compatibility (use env vars directly)
const getWhatsAppApiUrl = () => {
  const baseUrl = process.env.WHATSAPP_API_BASE_URL || "https://wa.washeej.com"
  return `${baseUrl}/api/qr/rest/send_message`
}

const getFromNumber = () => {
  return process.env.WHATSAPP_FROM_NUMBER || "966565740429"
}

interface WhatsAppTextMessage {
  messageType: "text"
  requestType: "POST"
  token: string
  from: string
  to: string
  text: string
}

interface WhatsAppDocumentMessage {
  messageType: "document"
  requestType: "POST"
  token: string
  from: string
  to: string
  docUrl: string
  caption: string
}

interface WhatsAppApiResponse {
  success: boolean
  message?: string
  error?: string
  data?: Record<string, unknown>
}

/**
 * Send a text message via WhatsApp
 * Uses settings from database first, then env vars as fallback
 */
export async function sendWhatsAppText(
  to: string,
  text: string
): Promise<WhatsAppApiResponse> {
  const token = process.env.WHATSAPP_QR_API_TOKEN
  
  if (!token) {
    console.error("WHATSAPP_QR_API_TOKEN not configured")
    return { success: false, error: "API token not configured" }
  }

  // Get settings from database (with cache)
  const settings = await getSettings()
  
  // Check if WhatsApp is enabled
  if (!settings.enabled) {
    console.log("WhatsApp sending is disabled in settings")
    return { success: false, error: "WhatsApp sending is disabled" }
  }

  const apiUrl = `${settings.apiBaseUrl}/api/qr/rest/send_message`

  const payload: WhatsAppTextMessage = {
    messageType: "text",
    requestType: "POST",
    token,
    from: settings.fromNumber,
    to: normalizePhoneForApi(to),
    text,
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    
    if (!response.ok) {
      return { 
        success: false, 
        error: data.error || data.message || `HTTP ${response.status}` 
      }
    }

    return { success: true, data }
  } catch (error) {
    console.error("WhatsApp text message error:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Network error" 
    }
  }
}

/**
 * Send a document (PDF) via WhatsApp
 * Uses settings from database first, then env vars as fallback
 */
export async function sendWhatsAppDocument(
  to: string,
  docUrl: string,
  caption: string
): Promise<WhatsAppApiResponse> {
  const token = process.env.WHATSAPP_QR_API_TOKEN
  
  if (!token) {
    console.error("WHATSAPP_QR_API_TOKEN not configured")
    return { success: false, error: "API token not configured" }
  }

  // Get settings from database (with cache)
  const settings = await getSettings()
  
  // Check if WhatsApp is enabled
  if (!settings.enabled) {
    console.log("WhatsApp sending is disabled in settings")
    return { success: false, error: "WhatsApp sending is disabled" }
  }

  const apiUrl = `${settings.apiBaseUrl}/api/qr/rest/send_message`

  const payload: WhatsAppDocumentMessage = {
    messageType: "document",
    requestType: "POST",
    token,
    from: settings.fromNumber,
    to: normalizePhoneForApi(to),
    docUrl,
    caption,
  }

  console.log("Sending WhatsApp document. URL:", docUrl, "To:", normalizePhoneForApi(to))

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    
    if (!response.ok) {
      return { 
        success: false, 
        error: data.error || data.message || `HTTP ${response.status}` 
      }
    }

    return { success: true, data }
  } catch (error) {
    console.error("WhatsApp document message error:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Network error" 
    }
  }
}

/**
 * Send results package (text + PDF) via WhatsApp
 */
export async function sendResultsViaWhatsApp(
  to: string,
  pdfUrl: string,
  recipientName: string,
  platformUrl: string,
  locale: "ar" | "en" = "ar"
): Promise<{ textResult: WhatsAppApiResponse; docResult: WhatsAppApiResponse }> {
  // Generate messages
  const textMessage = generateWelcomeMessage(recipientName, platformUrl, locale)
  const pdfCaption = generatePdfCaption(locale)
  
  // Send text message first
  const textResult = await sendWhatsAppText(to, textMessage)
  
  // Wait a moment before sending document
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Send PDF document
  const docResult = await sendWhatsAppDocument(to, pdfUrl, pdfCaption)
  
  return { textResult, docResult }
}

/**
 * Normalize phone number for WhatsApp API
 * API requires digits only, no + sign
 */
function normalizePhoneForApi(phone: string): string {
  // Remove all non-digits
  return phone.replace(/\D/g, "")
}

/**
 * Generate welcome text message (Saudi-style Arabic)
 */
function generateWelcomeMessage(
  name: string, 
  platformUrl: string, 
  locale: "ar" | "en"
): string {
  if (locale === "ar") {
    return `السلام عليكم ${name} 👋

شكراً لاستخدامك منصة *PayGate Optimizer* لمقارنة بوابات الدفع!

📊 مرفق لك تقرير مفصّل بنتائج المقارنة بصيغة PDF.

✅ يتضمن التقرير:
• ترتيب أفضل البوابات لنشاطك
• التكاليف التقريبية لكل بوابة  
• المميزات والملاحظات المهمة

🔗 لمراجعة النتائج لاحقاً:
${platformUrl}

⚠️ *تنبيه مهم:*
الأرقام الواردة تقريبية وقد تختلف حسب سياسات كل مزود. ننصحك بالتواصل مباشرة مع المزود للحصول على عرض سعر دقيق.

مع تحيات فريق PayGate Optimizer 💚`
  }

  return `Hello ${name} 👋

Thank you for using *PayGate Optimizer* to compare payment gateways!

📊 Attached is your detailed comparison report in PDF format.

✅ The report includes:
• Best payment gateways ranked for your business
• Estimated costs for each gateway
• Key features and important notes

🔗 To review results later:
${platformUrl}

⚠️ *Important Note:*
The figures provided are estimates and may vary based on each provider's policies. We recommend contacting providers directly for accurate pricing.

Best regards,
PayGate Optimizer Team 💚`
}

/**
 * Generate PDF document caption
 */
function generatePdfCaption(locale: "ar" | "en"): string {
  if (locale === "ar") {
    return "📄 تقرير مقارنة بوابات الدفع - PayGate Optimizer"
  }
  return "📄 Payment Gateway Comparison Report - PayGate Optimizer"
}

export type { WhatsAppApiResponse }
