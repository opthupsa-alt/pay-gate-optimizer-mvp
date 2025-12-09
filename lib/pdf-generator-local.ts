/**
 * مولد PDF محلي - بدون أي API خارجي
 * 
 * يستخدم PDFKit لتوليد ملفات PDF احترافية
 * مع دعم كامل للغة العربية
 * 
 * المميزات:
 * - لا حاجة لأي خدمة خارجية
 * - سريع جداً
 * - دعم كامل للعربية مع RTL
 * - تحكم كامل بالتصميم
 * - مجاني 100%
 */

import PDFDocument from 'pdfkit'
import path from 'path'
import fs from 'fs'
import type { Recommendation, WizardFormData } from './types'

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
 * Reverse text for RTL rendering in PDFKit
 * PDFKit doesn't support RTL natively, so we need to reverse Arabic text
 */
function reverseArabicText(text: string): string {
  // Split by spaces, reverse each word's characters, then reverse word order
  return text.split(' ').map(word => {
    // Check if word contains Arabic
    if (/[\u0600-\u06FF]/.test(word)) {
      return word.split('').reverse().join('')
    }
    return word
  }).reverse().join(' ')
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
          doc.fillColor(COLORS.dark)
          if (isArabic) {
            doc.text(`${reverseArabicText(reason)} ✓`, 50, yPos, { align: 'right', width: 495 })
          } else {
            doc.text(`✓ ${reason}`, 110, yPos, { width: 385 })
          }
          yPos += 16
        }
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
      doc.moveTo(50, 780)
         .lineTo(545, 780)
         .strokeColor(COLORS.lightGray)
         .stroke()
      
      // Footer text
      const footerText = isArabic 
        ? `PayGate Optimizer - تم إنشاء هذا التقرير في ${new Date().toLocaleDateString('ar-SA')}`
        : `Generated by PayGate Optimizer on ${new Date().toLocaleDateString('en-US')}`
      
      doc.font('Arabic')
         .fontSize(9)
         .fillColor(COLORS.gray)
      
      if (isArabic) {
        doc.text(reverseArabicText(footerText), 50, 790, { align: 'right', width: 495 })
      } else {
        doc.text(footerText, 50, 790, { align: 'left', width: 495 })
      }
      
      // Page number
      doc.text(`${i + 1} / ${pageCount}`, 50, 790, { align: 'center', width: 495 })
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
