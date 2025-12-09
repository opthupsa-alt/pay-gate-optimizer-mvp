/**
 * PDF Generator - Server-side HTML report generation
 * 
 * نظام توليد تقارير HTML للإرسال عبر WhatsApp
 * يستخدم HTML مباشرة لأن مكتبات PDF غير متوافقة مع Turbopack
 * 
 * الآلية:
 * 1. نولد HTML كامل مع التنسيقات
 * 2. نحفظه محلياً كملف HTML
 * 3. نرسل رابط التحميل عبر WhatsApp
 * 4. التنظيف التلقائي بعد 24 ساعة
 */

import { saveHTMLForPDF, getPDFPath } from './pdf-storage'
import type { Recommendation, WizardFormData } from './types'

// ==================== Types ====================

export interface GeneratePDFOptions {
  locale: 'ar' | 'en'
  wizardData: WizardFormData
  recommendations: Recommendation[]
  sectorName?: string
}

export interface GeneratedPDF {
  id: string
  url: string
  filePath: string
}

// ==================== Translations ====================

const translations = {
  ar: {
    title: 'تقرير مقارنة بوابات الدفع',
    subtitle: 'PayGate Optimizer',
    generatedAt: 'تاريخ التقرير',
    businessInfo: 'معلومات النشاط التجاري',
    businessName: 'اسم النشاط',
    businessType: 'نوع النشاط',
    sector: 'القطاع',
    monthlyVolume: 'حجم المعاملات الشهري',
    averageTransaction: 'متوسط المعاملة',
    transactionCount: 'عدد المعاملات',
    recommendations: 'التوصيات',
    provider: 'مزود الخدمة',
    matchScore: 'نسبة التوافق',
    monthlyCost: 'التكلفة المتوقعة',
    setupFee: 'رسوم التأسيس',
    monthlyFee: 'الرسوم الشهرية',
    reasons: 'أسباب التوصية',
    caveats: 'ملاحظات مهمة',
    currency: '﷼',
    contactUs: 'للتواصل والاستشارات',
    poweredBy: 'مقدم من',
    topPick: 'الخيار الأفضل',
    rank: 'الترتيب',
    // New fields
    pros: 'المميزات',
    cons: 'العيوب',
    activationTime: 'مدة التفعيل',
    settlementDays: 'مدة التسوية',
    supportChannels: 'قنوات الدعم',
    visitWebsite: 'زيارة الموقع',
    days: 'أيام',
    hours24: 'ساعة',
  },
  en: {
    title: 'Payment Gateway Comparison Report',
    subtitle: 'PayGate Optimizer',
    generatedAt: 'Report Date',
    businessInfo: 'Business Information',
    businessName: 'Business Name',
    businessType: 'Business Type',
    sector: 'Sector',
    monthlyVolume: 'Monthly Volume',
    averageTransaction: 'Average Transaction',
    transactionCount: 'Transaction Count',
    recommendations: 'Recommendations',
    provider: 'Provider',
    matchScore: 'Match Score',
    monthlyCost: 'Expected Cost',
    setupFee: 'Setup Fee',
    monthlyFee: 'Monthly Fee',
    reasons: 'Reasons',
    caveats: 'Important Notes',
    currency: '﷼',
    contactUs: 'For consultation and support',
    poweredBy: 'Powered by',
    topPick: 'Top Pick',
    rank: 'Rank',
    // New fields
    pros: 'Pros',
    cons: 'Cons',
    activationTime: 'Activation Time',
    settlementDays: 'Settlement Period',
    supportChannels: 'Support Channels',
    visitWebsite: 'Visit Website',
    days: 'days',
    hours24: 'hours',
  }
}

// ==================== Translation Helper ====================

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
  const setupFeeAr = text.match(/رسوم تسجيل:\s*([\d,]+)\s*﷼/)
  if (setupFeeAr) return locale === "ar" ? text : `Setup fee: ${setupFeeAr[1]} SAR`
  const setupFeeEn = text.match(/Setup fee:\s*([\d,]+)\s*(?:﷼|SAR)/)
  if (setupFeeEn) return locale === "en" ? text : `رسوم تسجيل: ${setupFeeEn[1]} ﷼`
  const monthlyFeeAr = text.match(/رسوم شهرية:\s*([\d,]+)\s*﷼/)
  if (monthlyFeeAr) return locale === "ar" ? text : `Monthly fee: ${monthlyFeeAr[1]} SAR`
  const monthlyFeeEn = text.match(/Monthly fee:\s*([\d,]+)\s*(?:﷼|SAR)/)
  if (monthlyFeeEn) return locale === "en" ? text : `رسوم شهرية: ${monthlyFeeEn[1]} ﷼`
  return text
}

// ==================== Helper Functions ====================

/**
 * Format currency with SAR symbol
 */
function formatCurrency(amount: number | undefined | null, symbol: string): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return `0 ${symbol}`
  }
  return `${amount.toLocaleString('en-US', { maximumFractionDigits: 2 })} ${symbol}`
}

/**
 * Get provider name based on locale
 */
function getProviderName(rec: Recommendation, locale: 'ar' | 'en'): string {
  if (rec.provider) {
    return locale === 'ar' ? rec.provider.name_ar : rec.provider.name_en
  }
  return '-'
}

// ==================== HTML Generator ====================

/**
 * Generate HTML report content
 */
function generateReportHTML(options: GeneratePDFOptions): string {
  const { locale, wizardData, recommendations, sectorName } = options
  const isRTL = locale === 'ar'
  const t = translations[locale]
  
  const date = new Date().toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // Generate recommendations HTML
  const recommendationsHTML = recommendations.slice(0, 5).map((rec, index) => {
    const providerName = getProviderName(rec, locale)
    const costMin = formatCurrency(rec.expected_cost_min, t.currency)
    const costMax = formatCurrency(rec.expected_cost_max, t.currency)
    const score = Math.round(rec.score_total)
    const setupFee = rec.provider?.setup_fee ? formatCurrency(rec.provider.setup_fee, t.currency) : '-'
    const monthlyFee = rec.provider?.monthly_fee ? formatCurrency(rec.provider.monthly_fee, t.currency) : '-'
    
    // Get new fields from recommendation
    const recAny = rec as any
    const prosAr = recAny.pros_ar || []
    const prosEn = recAny.pros_en || []
    const consAr = recAny.cons_ar || []
    const consEn = recAny.cons_en || []
    const pros = locale === 'ar' ? prosAr : prosEn
    const cons = locale === 'ar' ? consAr : consEn
    const activationMin = recAny.activation_time_min
    const activationMax = recAny.activation_time_max
    const settlementMin = recAny.settlement_days_min
    const settlementMax = recAny.settlement_days_max
    const supportChannels = recAny.support_channels || []
    const docsUrl = recAny.docs_url
    
    const reasonsHTML = rec.reasons && rec.reasons.length > 0 
      ? `<div class="reasons"><strong>${t.reasons}:</strong><ul>${rec.reasons.map(r => `<li>${translateReasonCaveat(r, locale)}</li>`).join('')}</ul></div>`
      : ''
    
    const caveatsHTML = rec.caveats && rec.caveats.length > 0
      ? `<div class="caveats"><strong>${t.caveats}:</strong><ul>${rec.caveats.map(c => `<li>${translateReasonCaveat(c, locale)}</li>`).join('')}</ul></div>`
      : ''
    
    // Generate pros/cons HTML
    const prosHTML = pros.length > 0
      ? `<div class="pros"><strong>✓ ${t.pros}:</strong><ul>${pros.map((p: string) => `<li>${p}</li>`).join('')}</ul></div>`
      : ''
    
    const consHTML = cons.length > 0
      ? `<div class="cons"><strong>⚠ ${t.cons}:</strong><ul>${cons.map((c: string) => `<li>${c}</li>`).join('')}</ul></div>`
      : ''
    
    // Generate provider details HTML
    const activationText = activationMin && activationMax
      ? `${activationMin}-${activationMax} ${t.days}`
      : activationMin ? `${activationMin}+ ${t.days}` : '-'
    
    const settlementText = settlementMin && settlementMax
      ? `${settlementMin}-${settlementMax} ${t.days}`
      : settlementMin ? `${settlementMin}+ ${t.days}` : '-'
    
    const supportText = supportChannels.length > 0 ? supportChannels.join(', ') : '-'
    
    const websiteHTML = docsUrl
      ? `<a href="${docsUrl}" target="_blank" class="website-link">${t.visitWebsite}</a>`
      : ''

    return `
    <div class="recommendation-card ${index === 0 ? 'top-pick' : ''}">
      <div class="recommendation-header">
        <div class="provider-info">
          <span class="rank">#${rec.rank}</span>
          <h3 class="provider-name">${providerName}</h3>
          ${index === 0 ? `<span class="badge">${t.topPick}</span>` : ''}
        </div>
        <div class="match-score">
          <span class="score-value">${score}%</span>
          <span class="score-label">${t.matchScore}</span>
        </div>
      </div>
      
      <div class="recommendation-details">
        <div class="detail-row">
          <span class="detail-label">${t.monthlyCost}</span>
          <span class="detail-value">${costMin} - ${costMax}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">${t.setupFee}</span>
          <span class="detail-value">${setupFee}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">${t.monthlyFee}</span>
          <span class="detail-value">${monthlyFee}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">${t.activationTime}</span>
          <span class="detail-value">${activationText}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">${t.settlementDays}</span>
          <span class="detail-value">${settlementText}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">${t.supportChannels}</span>
          <span class="detail-value">${supportText}</span>
        </div>
      </div>
      
      ${prosHTML}
      ${consHTML}
      ${reasonsHTML}
      ${caveatsHTML}
      ${websiteHTML}
    </div>`
  }).join('')

  // Get business info
  const businessName = wizardData.contact?.companyName || wizardData.contact?.fullName || '-'
  const businessType = wizardData.business_type || '-'
  const monthlyVolume = formatCurrency(wizardData.monthly_gmv, t.currency)
  const avgTicket = formatCurrency(wizardData.avg_ticket, t.currency)
  const txCount = wizardData.tx_count?.toLocaleString() || '-'

  return `<!DOCTYPE html>
<html lang="${locale}" dir="${isRTL ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    body {
      font-family: 'Tajawal', -apple-system, BlinkMacSystemFont, sans-serif;
      direction: ${isRTL ? 'rtl' : 'ltr'};
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      min-height: 100vh;
      padding: 24px;
      color: #1e293b;
      line-height: 1.7;
    }
    
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.08);
      overflow: hidden;
    }
    
    .header {
      background: linear-gradient(135deg, #059669 0%, #10b981 100%);
      color: white;
      padding: 40px 32px;
      text-align: center;
    }
    
    .header h1 { font-size: 26px; margin-bottom: 8px; font-weight: 700; }
    .header .subtitle { font-size: 18px; opacity: 0.95; margin-bottom: 12px; }
    .header .date { opacity: 0.85; font-size: 14px; }
    
    .content { padding: 32px; }
    
    .info-card {
      background: #f8fafc;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 32px;
      border: 1px solid #e2e8f0;
    }
    
    .info-card h2 {
      font-size: 18px;
      color: #059669;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 2px solid #e2e8f0;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }
    
    .info-item {
      padding: 16px;
      background: white;
      border-radius: 10px;
      border: 1px solid #e2e8f0;
    }
    
    .info-item label {
      display: block;
      font-size: 13px;
      color: #64748b;
      margin-bottom: 6px;
    }
    
    .info-item span {
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
    }
    
    .recommendations-section h2 {
      font-size: 20px;
      color: #1e293b;
      margin-bottom: 24px;
      padding-bottom: 12px;
      border-bottom: 2px solid #e2e8f0;
    }
    
    .recommendation-card {
      background: #fafafa;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 20px;
      transition: all 0.2s;
    }
    
    .recommendation-card.top-pick {
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      border: 2px solid #10b981;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
    }
    
    .recommendation-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 16px;
    }
    
    .provider-info {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    
    .rank {
      background: #e2e8f0;
      color: #64748b;
      font-size: 14px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 6px;
    }
    
    .top-pick .rank {
      background: #059669;
      color: white;
    }
    
    .provider-name {
      font-size: 20px;
      font-weight: 700;
      color: #1e293b;
    }
    
    .badge {
      background: #059669;
      color: white;
      font-size: 12px;
      padding: 5px 12px;
      border-radius: 20px;
      font-weight: 500;
    }
    
    .match-score {
      text-align: center;
      background: white;
      padding: 14px 24px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.04);
    }
    
    .score-value {
      display: block;
      font-size: 32px;
      font-weight: 700;
      color: #059669;
      line-height: 1;
    }
    
    .score-label {
      font-size: 12px;
      color: #64748b;
      margin-top: 4px;
    }
    
    .recommendation-details {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 16px;
    }
    
    .detail-row {
      background: white;
      padding: 14px;
      border-radius: 10px;
      border: 1px solid #e2e8f0;
    }
    
    .detail-label {
      display: block;
      font-size: 12px;
      color: #64748b;
      margin-bottom: 4px;
    }
    
    .detail-value {
      font-size: 15px;
      font-weight: 600;
      color: #1e293b;
    }
    
    .reasons, .caveats, .pros, .cons {
      margin-top: 16px;
      padding: 16px;
      border-radius: 10px;
      font-size: 14px;
    }
    
    .reasons {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
    }
    
    .caveats {
      background: #fef3c7;
      border: 1px solid #fcd34d;
    }
    
    .pros {
      background: #ecfdf5;
      border: 1px solid #6ee7b7;
    }
    
    .cons {
      background: #fef2f2;
      border: 1px solid #fca5a5;
    }
    
    .reasons ul, .caveats ul, .pros ul, .cons ul {
      margin: 8px 0 0 20px;
      padding: 0;
    }
    
    .reasons li, .caveats li, .pros li, .cons li {
      margin-bottom: 4px;
    }
    
    .website-link {
      display: inline-block;
      margin-top: 16px;
      padding: 10px 20px;
      background: #059669;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      transition: background 0.2s;
    }
    
    .website-link:hover {
      background: #047857;
    }
    
    .footer {
      text-align: center;
      padding: 28px;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
    }
    
    .footer p {
      font-size: 14px;
      color: #64748b;
    }
    
    .footer .brand {
      color: #059669;
      font-weight: 700;
    }
    
    @media (max-width: 640px) {
      body { padding: 12px; }
      .content { padding: 20px; }
      .recommendation-details { grid-template-columns: 1fr; }
      .header { padding: 28px 20px; }
    }
    
    @media print {
      body { background: white; padding: 0; }
      .container { box-shadow: none; border-radius: 0; }
      .recommendation-card { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${t.title}</h1>
      <p class="subtitle">${t.subtitle}</p>
      <p class="date">${t.generatedAt}: ${date}</p>
    </div>
    
    <div class="content">
      <div class="info-card">
        <h2>${t.businessInfo}</h2>
        <div class="info-grid">
          <div class="info-item">
            <label>${t.businessName}</label>
            <span>${businessName}</span>
          </div>
          <div class="info-item">
            <label>${t.businessType}</label>
            <span>${businessType}</span>
          </div>
          ${sectorName ? `
          <div class="info-item">
            <label>${t.sector}</label>
            <span>${sectorName}</span>
          </div>
          ` : ''}
          <div class="info-item">
            <label>${t.monthlyVolume}</label>
            <span>${monthlyVolume}</span>
          </div>
          <div class="info-item">
            <label>${t.averageTransaction}</label>
            <span>${avgTicket}</span>
          </div>
          <div class="info-item">
            <label>${t.transactionCount}</label>
            <span>${txCount}</span>
          </div>
        </div>
      </div>
      
      <div class="recommendations-section">
        <h2>${t.recommendations}</h2>
        ${recommendationsHTML}
      </div>
    </div>
    
    <div class="footer">
      <p>${t.poweredBy} <span class="brand">PayGate Optimizer</span></p>
      <p style="margin-top: 10px; font-size: 12px;">© ${new Date().getFullYear()} - ${locale === 'ar' ? 'جميع الحقوق محفوظة' : 'All Rights Reserved'}</p>
    </div>
  </div>
</body>
</html>`
}

// ==================== Public API ====================

/**
 * Generate PDF (HTML report) for WhatsApp sending
 * يولد تقرير HTML للإرسال عبر واتساب
 */
export async function generatePDF(options: GeneratePDFOptions): Promise<GeneratedPDF> {
  const html = generateReportHTML(options)
  const result = await saveHTMLForPDF(html)
  
  return {
    id: result.id,
    url: result.url,
    filePath: result.filePath
  }
}

/**
 * Get report download URL
 */
export function getReportURL(fileId: string, baseUrl: string): string {
  return `${baseUrl}/api/pdf/${fileId}`
}

/**
 * Check if report exists
 */
export async function reportExists(fileId: string): Promise<boolean> {
  const filePath = getPDFPath(fileId)
  if (!filePath) return false
  
  try {
    const fs = await import('fs/promises')
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

// Re-export storage functions
export { getPDFPath, cleanupOldPDFs, getCleanupStatus, runCleanup } from './pdf-storage'
