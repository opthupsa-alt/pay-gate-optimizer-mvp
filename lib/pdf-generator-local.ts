/**
 * مولد PDF محلي - بدون أي API خارجي
 * 
 * يستخدم PDFKit لتوليد ملفات PDF احترافية
 * مع دعم كامل للغة العربية
 * 
 * المميزات:
 * - لا حاجة لأي خدمة خارجية
 * - سريع جداً
 * - دعم كامل للعربية مع RTL باستخدام bidi-js
 * - تحكم كامل بالتصميم
 * - مجاني 100%
 */

import PDFDocument from 'pdfkit'
import path from 'path'
import fs from 'fs'
// @ts-ignore - bidi-js types
import bidiFactory from 'bidi-js'
import type { Recommendation, WizardFormData } from './types'

// Initialize bidi processor for RTL text
const bidi = bidiFactory()

// ==================== Types ====================

export interface LocalPDFOptions {
  locale: 'ar' | 'en'
  wizardData: WizardFormData
  recommendations: Recommendation[]
  sectorName?: string
}

export interface LocalPDFResult {
  success: boolean
  pdfBuffer?: Buffer
  pdfBase64?: string
  error?: string
}

// ==================== Constants ====================

const COLORS = {
  primary: '#3b82f6',      // Blue
  secondary: '#10b981',    // Green
  dark: '#1f2937',
  gray: '#6b7280',
  lightGray: '#f3f4f6',
  white: '#ffffff',
  warning: '#f59e0b',
  success: '#22c55e',
}

// ==================== Helper Functions ====================

/**
 * Process Arabic text for correct RTL display in PDFKit
 * 
 * PDFKit doesn't support RTL natively. This function:
 * 1. Reverses Arabic words correctly
 * 2. Keeps numbers and English text in correct order
 * 3. Handles mixed Arabic-English text
 */
function processArabicText(text: string): string {
  if (!text) return ''
  
  // Check if text contains Arabic characters
  const hasArabic = /[\u0600-\u06FF]/.test(text)
  
  if (!hasArabic) {
    return text // Return as-is for non-Arabic text
  }
  
  try {
    // Get embedding levels for RTL processing
    const embeddingLevels = bidi.getEmbeddingLevels(text, 'rtl')
    
    // Get the reorder segments
    const segments = bidi.getReorderSegments(text, embeddingLevels)
    
    // Convert text to array for manipulation
    const chars = [...text]
    
    // Apply each reordering segment (reverse in place)
    for (const segment of segments) {
      const [start, end] = segment
      // Reverse this segment
      let left = start
      let right = end
      while (left < right) {
        [chars[left], chars[right]] = [chars[right], chars[left]]
        left++
        right--
      }
    }
    
    // For PDFKit rendering, reverse the entire result
    return chars.reverse().join('')
  } catch (error) {
    console.error('Bidi processing error:', error)
    // Fallback: simple character reversal for Arabic-only text
    return text.split('').reverse().join('')
  }
}

/**
 * Legacy function name for compatibility
 * @deprecated Use processArabicText instead
 */
function reverseArabicText(text: string): string {
  return processArabicText(text)
}

/**
 * Bilingual translations for reasons and caveats
 */
const reasonsCaveatsTranslations: Record<string, { ar: string; en: string }> = {
  // Reasons - Basic
  "يدعم مدى": { ar: "يدعم مدى", en: "Supports Mada" },
  "Supports Mada": { ar: "يدعم مدى", en: "Supports Mada" },
  "يدعم Apple Pay": { ar: "يدعم Apple Pay", en: "Supports Apple Pay" },
  "Supports Apple Pay": { ar: "يدعم Apple Pay", en: "Supports Apple Pay" },
  "يدعم Google Pay": { ar: "يدعم Google Pay", en: "Supports Google Pay" },
  "Supports Google Pay": { ar: "يدعم Google Pay", en: "Supports Google Pay" },
  "يدعم قطاعك": { ar: "يدعم قطاعك", en: "Supports your sector" },
  "Supports your sector": { ar: "يدعم قطاعك", en: "Supports your sector" },
  "تفعيل سريع": { ar: "تفعيل سريع", en: "Fast activation" },
  "Fast activation": { ar: "تفعيل سريع", en: "Fast activation" },
  "دعم فني ممتاز": { ar: "دعم فني ممتاز", en: "Excellent support" },
  "Excellent support": { ar: "دعم فني ممتاز", en: "Excellent support" },
  // Reasons - New
  "يدعم تابي/تمارا": { ar: "يدعم تابي/تمارا", en: "Supports Tabby/Tamara BNPL" },
  "Supports Tabby/Tamara BNPL": { ar: "يدعم تابي/تمارا", en: "Supports Tabby/Tamara BNPL" },
  "يدعم العملات المتعددة": { ar: "يدعم العملات المتعددة", en: "Supports multi-currency" },
  "Supports multi-currency": { ar: "يدعم العملات المتعددة", en: "Supports multi-currency" },
  "يدعم الدفعات المتكررة": { ar: "يدعم الدفعات المتكررة", en: "Supports recurring payments" },
  "Supports recurring payments": { ar: "يدعم الدفعات المتكررة", en: "Supports recurring payments" },
  "تسوية سريعة": { ar: "تسوية سريعة", en: "Fast settlement" },
  "Fast settlement": { ar: "تسوية سريعة", en: "Fast settlement" },
  "تكامل مع Shopify": { ar: "تكامل مع Shopify", en: "Shopify integration" },
  "Shopify integration": { ar: "تكامل مع Shopify", en: "Shopify integration" },
  "تكامل مع WooCommerce": { ar: "تكامل مع WooCommerce", en: "WooCommerce integration" },
  "WooCommerce integration": { ar: "تكامل مع WooCommerce", en: "WooCommerce integration" },
  "تكامل مع سلة": { ar: "تكامل مع سلة", en: "Salla integration" },
  "Salla integration": { ar: "تكامل مع سلة", en: "Salla integration" },
  // Caveats - New
  "تفعيل بطيء": { ar: "تفعيل بطيء", en: "Slow activation time" },
  "Slow activation time": { ar: "تفعيل بطيء", en: "Slow activation time" },
  "تسوية بطيئة": { ar: "تسوية بطيئة", en: "Slow settlement time" },
  "Slow settlement time": { ar: "تسوية بطيئة", en: "Slow settlement time" },
  "ساعات دعم محدودة": { ar: "ساعات دعم محدودة", en: "Limited support hours" },
  "Limited support hours": { ar: "ساعات دعم محدودة", en: "Limited support hours" },
}

/**
 * Translate reason/caveat to target locale
 */
function translateReasonCaveat(text: string, locale: 'ar' | 'en'): string {
  if (reasonsCaveatsTranslations[text]) {
    return reasonsCaveatsTranslations[text][locale]
  }
  // Handle fee patterns
  const setupFeeAr = text.match(/رسوم تسجيل:\s*([\d,]+)\s*﷼/)
  if (setupFeeAr) {
    return locale === "ar" ? text : `Setup fee: ${setupFeeAr[1]} SAR`
  }
  const setupFeeEn = text.match(/Setup fee:\s*([\d,]+)\s*(?:﷼|SAR)/)
  if (setupFeeEn) {
    return locale === "en" ? text : `رسوم تسجيل: ${setupFeeEn[1]} ﷼`
  }
  const monthlyFeeAr = text.match(/رسوم شهرية:\s*([\d,]+)\s*﷼/)
  if (monthlyFeeAr) {
    return locale === "ar" ? text : `Monthly fee: ${monthlyFeeAr[1]} SAR`
  }
  const monthlyFeeEn = text.match(/Monthly fee:\s*([\d,]+)\s*(?:﷼|SAR)/)
  if (monthlyFeeEn) {
    return locale === "en" ? text : `رسوم شهرية: ${monthlyFeeEn[1]} ﷼`
  }
  return text
}

/**
 * Format number with Arabic/English formatting
 */
function formatNumber(num: number, locale: 'ar' | 'en'): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US').format(num)
}

/**
 * Format currency
 */
function formatCurrency(amount: number, locale: 'ar' | 'en'): string {
  const formatted = formatNumber(Math.round(amount), locale)
  return locale === 'ar' ? `${formatted} ر.س` : `SAR ${formatted}`
}

// ==================== Main Function ====================

/**
 * Generate PDF locally using PDFKit
 * No external API needed!
 */
export async function generateLocalPDF(options: LocalPDFOptions): Promise<LocalPDFResult> {
  const { locale, wizardData, recommendations, sectorName } = options
  const isArabic = locale === 'ar'
  
  try {
    // Get font paths
    const fontsDir = path.join(process.cwd(), 'public', 'fonts')
    const regularFontPath = path.join(fontsDir, 'Tajawal-Regular.ttf')
    const boldFontPath = path.join(fontsDir, 'Tajawal-Bold.ttf')
    
    // Check if fonts exist
    if (!fs.existsSync(regularFontPath) || !fs.existsSync(boldFontPath)) {
      console.error('Arabic fonts not found at:', fontsDir)
      return { success: false, error: 'Arabic fonts not found' }
    }
    
    console.log('Font paths:', { regular: regularFontPath, bold: boldFontPath })
    
    // Create PDF document with custom font as default
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
      font: regularFontPath, // Set default font to avoid Helvetica loading
      info: {
        Title: isArabic ? 'تقرير مقارنة بوابات الدفع' : 'Payment Gateway Comparison Report',
        Author: 'PayGate Optimizer',
        Subject: isArabic ? 'تحليل بوابات الدفع' : 'Payment Gateway Analysis',
        Creator: 'PayGate Optimizer MVP',
      },
    })
    
    // Register fonts with names for easier switching
    doc.registerFont('Arabic', regularFontPath)
    doc.registerFont('Arabic-Bold', boldFontPath)
    
    // Collect PDF chunks
    const chunks: Buffer[] = []
    doc.on('data', (chunk) => chunks.push(chunk))
    
    // Create promise to wait for PDF completion
    const pdfPromise = new Promise<Buffer>((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)
    })
    
    // ============ Page 1: Header & Business Info ============
    
    // Header background
    doc.rect(0, 0, 595, 120).fill(COLORS.primary)
    
    // Title
    const title = isArabic ? 'تقرير مقارنة بوابات الدفع' : 'Payment Gateway Comparison Report'
    doc.font('Arabic-Bold')
       .fontSize(24)
       .fillColor(COLORS.white)
    
    if (isArabic) {
      doc.text(reverseArabicText(title), 50, 45, { align: 'right', width: 495 })
    } else {
      doc.text(title, 50, 45, { align: 'left', width: 495 })
    }
    
    // Subtitle
    const subtitle = isArabic ? 'تحليل شامل ومخصص لأعمالك' : 'Comprehensive Analysis for Your Business'
    doc.font('Arabic')
       .fontSize(14)
       .fillColor(COLORS.white)
    
    if (isArabic) {
      doc.text(reverseArabicText(subtitle), 50, 80, { align: 'right', width: 495 })
    } else {
      doc.text(subtitle, 50, 80, { align: 'left', width: 495 })
    }
    
    // Business Info Section
    let yPos = 150
    
    // Section title
    const bizInfoTitle = isArabic ? 'معلومات العمل' : 'Business Information'
    doc.font('Arabic-Bold')
       .fontSize(16)
       .fillColor(COLORS.dark)
    
    if (isArabic) {
      doc.text(reverseArabicText(bizInfoTitle), 50, yPos, { align: 'right', width: 495 })
    } else {
      doc.text(bizInfoTitle, 50, yPos, { align: 'left', width: 495 })
    }
    
    yPos += 30
    
    // Business details
    const businessDetails = [
      {
        label: isArabic ? 'اسم الشركة' : 'Company Name',
        value: wizardData.contact?.companyName || (isArabic ? 'غير محدد' : 'Not specified'),
      },
      {
        label: isArabic ? 'القطاع' : 'Sector',
        value: sectorName || wizardData.contact?.sector || (isArabic ? 'غير محدد' : 'Not specified'),
      },
      {
        label: isArabic ? 'حجم المبيعات الشهري' : 'Monthly GMV',
        value: formatCurrency(wizardData.monthly_gmv || 0, locale),
      },
      {
        label: isArabic ? 'عدد المعاملات الشهرية' : 'Monthly Transactions',
        value: formatNumber(wizardData.tx_count || 0, locale),
      },
      {
        label: isArabic ? 'متوسط قيمة المعاملة' : 'Average Transaction',
        value: formatCurrency(wizardData.avg_ticket || 0, locale),
      },
    ]
    
    doc.font('Arabic').fontSize(11)
    
    for (const detail of businessDetails) {
      doc.fillColor(COLORS.gray)
      if (isArabic) {
        doc.text(reverseArabicText(detail.label + ':'), 300, yPos, { align: 'right', width: 245 })
        doc.fillColor(COLORS.dark)
        doc.text(reverseArabicText(detail.value), 50, yPos, { align: 'right', width: 240 })
      } else {
        doc.text(detail.label + ':', 50, yPos, { width: 150 })
        doc.fillColor(COLORS.dark)
        doc.text(detail.value, 200, yPos, { width: 345 })
      }
      yPos += 22
    }
    
    // Payment Mix Section
    yPos += 20
    const paymentMixTitle = isArabic ? 'توزيع وسائل الدفع' : 'Payment Methods Mix'
    doc.font('Arabic-Bold')
       .fontSize(16)
       .fillColor(COLORS.dark)
    
    if (isArabic) {
      doc.text(reverseArabicText(paymentMixTitle), 50, yPos, { align: 'right', width: 495 })
    } else {
      doc.text(paymentMixTitle, 50, yPos, { align: 'left', width: 495 })
    }
    
    yPos += 30
    
    const paymentMix = wizardData.payment_mix || { mada: 0, visa_mc: 0, apple_pay: 0, google_pay: 0, other: 0 }
    const paymentMethods = [
      { name: 'mada', label: isArabic ? 'مدى' : 'Mada', value: paymentMix.mada || 0 },
      { name: 'visa_mc', label: isArabic ? 'فيزا/ماستر' : 'Visa/MC', value: paymentMix.visa_mc || 0 },
      { name: 'apple_pay', label: 'Apple Pay', value: paymentMix.apple_pay || 0 },
      { name: 'google_pay', label: 'Google Pay', value: paymentMix.google_pay || 0 },
    ]
    
    // Draw payment mix bars
    const barWidth = 400
    const barHeight = 20
    let barX = isArabic ? 95 : 50
    
    for (const method of paymentMethods) {
      if (method.value > 0) {
        // Label
        doc.font('Arabic').fontSize(10).fillColor(COLORS.dark)
        if (isArabic) {
          doc.text(`%${method.value} ${reverseArabicText(method.label)}`, barX, yPos, { align: 'right', width: 100 })
        } else {
          doc.text(`${method.label}: ${method.value}%`, barX, yPos, { width: 100 })
        }
        
        // Background bar
        doc.rect(isArabic ? 200 : 150, yPos - 2, barWidth * 0.6, barHeight)
           .fill(COLORS.lightGray)
        
        // Value bar
        const valueWidth = (method.value / 100) * barWidth * 0.6
        doc.rect(isArabic ? 200 : 150, yPos - 2, valueWidth, barHeight)
           .fill(COLORS.primary)
        
        yPos += 28
      }
    }
    
    // ============ Recommendations Section ============
    
    yPos += 30
    const recsTitle = isArabic ? 'البوابات الموصى بها' : 'Recommended Gateways'
    doc.font('Arabic-Bold')
       .fontSize(18)
       .fillColor(COLORS.primary)
    
    if (isArabic) {
      doc.text(reverseArabicText(recsTitle), 50, yPos, { align: 'right', width: 495 })
    } else {
      doc.text(recsTitle, 50, yPos, { align: 'left', width: 495 })
    }
    
    yPos += 35
    
    // Display top recommendations
    const topRecs = recommendations.slice(0, 3)
    
    for (let i = 0; i < topRecs.length; i++) {
      const rec = topRecs[i]
      // Get provider name from provider object or use a placeholder
      const providerName = isArabic 
        ? (rec.provider?.name_ar || 'بوابة دفع')
        : (rec.provider?.name_en || 'Payment Gateway')
      
      // Check if we need a new page
      if (yPos > 700) {
        doc.addPage()
        yPos = 50
      }
      
      // Rank badge
      const rankColors = [COLORS.success, COLORS.primary, COLORS.warning]
      doc.circle(isArabic ? 520 : 70, yPos + 15, 15)
         .fill(rankColors[i] || COLORS.gray)
      
      doc.font('Arabic-Bold')
         .fontSize(14)
         .fillColor(COLORS.white)
         .text(String(i + 1), isArabic ? 514 : 64, yPos + 9, { width: 12, align: 'center' })
      
      // Provider name
      doc.font('Arabic-Bold')
         .fontSize(14)
         .fillColor(COLORS.dark)
      
      if (isArabic) {
        doc.text(reverseArabicText(providerName || ''), 50, yPos + 8, { align: 'right', width: 440 })
      } else {
        doc.text(providerName || '', 95, yPos + 8, { width: 400 })
      }
      
      yPos += 35
      
      // Score
      const scoreLabel = isArabic ? 'النتيجة الإجمالية' : 'Overall Score'
      doc.font('Arabic').fontSize(11).fillColor(COLORS.gray)
      
      if (isArabic) {
        doc.text(`${rec.score_total}% :${reverseArabicText(scoreLabel)}`, 50, yPos, { align: 'right', width: 495 })
      } else {
        doc.text(`${scoreLabel}: ${rec.score_total}%`, 95, yPos, { width: 400 })
      }
      
      yPos += 20
      
      // Cost estimate
      const costLabel = isArabic ? 'التكلفة المتوقعة' : 'Expected Cost'
      const costRange = `${formatCurrency(rec.expected_cost_min || 0, locale)} - ${formatCurrency(rec.expected_cost_max || 0, locale)}`
      
      if (isArabic) {
        doc.text(`${reverseArabicText(costRange)} :${reverseArabicText(costLabel)}`, 50, yPos, { align: 'right', width: 495 })
      } else {
        doc.text(`${costLabel}: ${costRange}`, 95, yPos, { width: 400 })
      }
      
      yPos += 20
      
      // Reasons
      if (rec.reasons && rec.reasons.length > 0) {
        const reasonsLabel = isArabic ? 'المميزات' : 'Key Benefits'
        doc.fillColor(COLORS.success)
        
        if (isArabic) {
          doc.text(`:${reverseArabicText(reasonsLabel)}`, 50, yPos, { align: 'right', width: 495 })
        } else {
          doc.text(`${reasonsLabel}:`, 95, yPos, { width: 400 })
        }
        
        yPos += 18
        
        for (const reason of rec.reasons.slice(0, 3)) {
          const translatedReason = translateReasonCaveat(reason, locale)
          doc.fillColor(COLORS.dark)
          if (isArabic) {
            doc.text(`${reverseArabicText(translatedReason)} ✓`, 50, yPos, { align: 'right', width: 495 })
          } else {
            doc.text(`✓ ${translatedReason}`, 110, yPos, { width: 385 })
          }
          yPos += 16
        }
      }
      
      // Display new fields: activation time, settlement, support
      const recAny = rec as any
      const activationMin = recAny.activation_time_min
      const activationMax = recAny.activation_time_max
      const settlementMin = recAny.settlement_days_min
      const settlementMax = recAny.settlement_days_max
      const supportChannels = recAny.support_channels || []
      const docsUrl = recAny.docs_url
      
      // Provider details row
      if (activationMin || settlementMin || supportChannels.length > 0) {
        yPos += 10
        doc.font('Arabic').fontSize(10).fillColor(COLORS.gray)
        
        const detailParts: string[] = []
        
        if (activationMin && activationMax) {
          const activationLabel = isArabic ? 'التفعيل' : 'Activation'
          const daysLabel = isArabic ? 'أيام' : 'days'
          detailParts.push(`${activationLabel}: ${activationMin}-${activationMax} ${daysLabel}`)
        }
        
        if (settlementMin && settlementMax) {
          const settlementLabel = isArabic ? 'التسوية' : 'Settlement'
          const daysLabel = isArabic ? 'أيام' : 'days'
          detailParts.push(`${settlementLabel}: ${settlementMin}-${settlementMax} ${daysLabel}`)
        }
        
        if (supportChannels.length > 0) {
          const supportLabel = isArabic ? 'الدعم' : 'Support'
          detailParts.push(`${supportLabel}: ${supportChannels.slice(0, 3).join(', ')}`)
        }
        
        if (detailParts.length > 0) {
          const detailsText = detailParts.join(' | ')
          if (isArabic) {
            doc.text(reverseArabicText(detailsText), 50, yPos, { align: 'right', width: 495 })
          } else {
            doc.text(detailsText, 95, yPos, { width: 400 })
          }
          yPos += 18
        }
      }
      
      // Display pros/cons if available
      const prosAr = recAny.pros_ar || []
      const prosEn = recAny.pros_en || []
      const consAr = recAny.cons_ar || []
      const consEn = recAny.cons_en || []
      const pros = isArabic ? prosAr : prosEn
      const cons = isArabic ? consAr : consEn
      
      if (pros.length > 0) {
        yPos += 5
        const prosLabel = isArabic ? 'النقاط الإيجابية' : 'Pros'
        doc.fillColor(COLORS.success)
        if (isArabic) {
          doc.text(`:${reverseArabicText(prosLabel)}`, 50, yPos, { align: 'right', width: 495 })
        } else {
          doc.text(`${prosLabel}:`, 95, yPos, { width: 400 })
        }
        yPos += 16
        
        for (const pro of pros.slice(0, 2)) {
          doc.fillColor(COLORS.dark)
          if (isArabic) {
            doc.text(`${reverseArabicText(pro)} ●`, 50, yPos, { align: 'right', width: 495 })
          } else {
            doc.text(`● ${pro}`, 110, yPos, { width: 385 })
          }
          yPos += 14
        }
      }
      
      if (cons.length > 0) {
        yPos += 5
        const consLabel = isArabic ? 'النقاط السلبية' : 'Cons'
        doc.fillColor(COLORS.warning)
        if (isArabic) {
          doc.text(`:${reverseArabicText(consLabel)}`, 50, yPos, { align: 'right', width: 495 })
        } else {
          doc.text(`${consLabel}:`, 95, yPos, { width: 400 })
        }
        yPos += 16
        
        for (const con of cons.slice(0, 2)) {
          doc.fillColor(COLORS.dark)
          if (isArabic) {
            doc.text(`${reverseArabicText(con)} ●`, 50, yPos, { align: 'right', width: 495 })
          } else {
            doc.text(`● ${con}`, 110, yPos, { width: 385 })
          }
          yPos += 14
        }
      }
      
      // Website link
      if (docsUrl) {
        yPos += 8
        const visitLabel = isArabic ? 'زيارة الموقع' : 'Visit Website'
        doc.fillColor(COLORS.primary)
           .fontSize(10)
        if (isArabic) {
          doc.text(reverseArabicText(visitLabel), 50, yPos, { align: 'right', width: 495, link: docsUrl, underline: true })
        } else {
          doc.text(visitLabel, 95, yPos, { width: 400, link: docsUrl, underline: true })
        }
        yPos += 18
      }
      
      yPos += 25
      
      // Divider line (except for last item)
      if (i < topRecs.length - 1) {
        doc.moveTo(50, yPos - 10)
           .lineTo(545, yPos - 10)
           .strokeColor(COLORS.lightGray)
           .stroke()
      }
    }
    
    // ============ Footer ============
    
    // Add footer on each page
    const pageCount = doc.bufferedPageRange().count
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i)
      
      // Footer line
      doc.moveTo(50, 760)
         .lineTo(545, 760)
         .strokeColor(COLORS.lightGray)
         .stroke()
      
      // Footer text - PayGate Optimizer
      const footerText = isArabic 
        ? `PayGate Optimizer - تم إنشاء هذا التقرير في ${new Date().toLocaleDateString('ar-SA')}`
        : `Generated by PayGate Optimizer on ${new Date().toLocaleDateString('en-US')}`
      
      doc.font('Arabic')
         .fontSize(9)
         .fillColor(COLORS.gray)
      
      if (isArabic) {
        doc.text(reverseArabicText(footerText), 50, 768, { align: 'right', width: 495 })
      } else {
        doc.text(footerText, 50, 768, { align: 'left', width: 495 })
      }
      
      // شعار الشركة المالكة - الهدف الأمثل
      const ownerText = isArabic 
        ? 'منصة تابعة للهدف الأمثل لتطوير الأعمال'
        : 'A platform by Marketing Optimum Target'
      
      doc.font('Arabic')
         .fontSize(8)
         .fillColor(COLORS.gray)
      
      doc.text(ownerText, 50, 785, { 
        align: 'center', 
        width: 495,
        link: 'https://op-target.com'
      })
      
      doc.fontSize(7)
         .fillColor(COLORS.primary)
         .text('op-target.com', 50, 798, { 
           align: 'center', 
           width: 495,
           link: 'https://op-target.com',
           underline: true
         })
      
      // Page number
      doc.fillColor(COLORS.gray)
         .fontSize(8)
         .text(`${i + 1} / ${pageCount}`, 500, 768, { width: 45, align: 'right' })
    }
    
    // Finalize PDF
    doc.end()
    
    // Wait for PDF to complete
    const pdfBuffer = await pdfPromise
    
    console.log('Local PDF generated successfully, size:', pdfBuffer.length, 'bytes')
    
    return {
      success: true,
      pdfBuffer,
      pdfBase64: pdfBuffer.toString('base64'),
    }
    
  } catch (error) {
    console.error('Local PDF generation error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'PDF generation failed',
    }
  }
}
