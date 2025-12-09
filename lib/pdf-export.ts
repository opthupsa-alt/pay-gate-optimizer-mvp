// PDF Export utilities for PayGate Optimizer
// Uses browser print functionality with custom styling

import type { Recommendation, WizardFormData, Provider } from "./types"

// SVG for Saudi Riyal symbol - matches the one used in the website
const SAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1124.14 1256.39" class="sar-symbol" aria-label="SAR"><path fill="currentColor" d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"/><path fill="currentColor" d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"/></svg>`

// ==================== Translation Helper ====================

/**
 * Bilingual translations for reasons and caveats
 * This ensures PDF content matches the requested locale
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
 * Translate a reason or caveat to the target locale
 */
function translateReasonCaveat(text: string, locale: "ar" | "en"): string {
  // Check if it's a known phrase
  if (reasonsCaveatsTranslations[text]) {
    return reasonsCaveatsTranslations[text][locale]
  }
  
  // Handle fee patterns: "رسوم تسجيل: X ﷼" or "Setup fee: X ﷼"
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
  
  // Return original if no translation found
  return text
}

interface PDFExportOptions {
  locale: "ar" | "en"
  wizardData?: WizardFormData
  recommendations: Recommendation[]
  providers?: Provider[]
}

export function generatePDFContent(options: PDFExportOptions): string {
  const { locale, recommendations, wizardData } = options
  const isRTL = locale === "ar"
  const t = translations[locale]

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Cairo', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 40px;
      direction: ${isRTL ? 'rtl' : 'ltr'};
      color: #1f2937;
      line-height: 1.6;
      background: white;
    }
    
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 24px;
      border-bottom: 3px solid #10b981;
    }
    
    .header-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 16px;
    }
    
    .header-logo svg {
      width: 56px;
      height: 56px;
    }
    
    .header-brand {
      font-size: 32px;
      font-weight: 700;
    }
    
    .header-brand .pay {
      color: #1f2937;
    }
    
    .header-brand .optimizer {
      color: #10b981;
    }
    
    .header h1 {
      font-size: 28px;
      color: #1e3a8a;
      margin-bottom: 8px;
    }
    
    .header p {
      color: #6b7280;
      font-size: 14px;
    }
    
    .metadata {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 30px;
      padding: 16px;
      background: #f3f4f6;
      border-radius: 8px;
    }
    
    .metadata-item {
      flex: 1;
      min-width: 150px;
    }
    
    .metadata-item label {
      display: block;
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 4px;
    }
    
    .metadata-item value {
      display: block;
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
    }
    
    .section-title {
      font-size: 20px;
      font-weight: 700;
      color: #1e3a8a;
      margin: 30px 0 20px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e5e7eb;
    }
    
    .recommendation {
      margin-bottom: 30px;
      padding: 24px;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      page-break-inside: avoid;
    }
    
    .recommendation.rank-1 {
      border-color: #eab308;
      background: linear-gradient(135deg, #fefce8 0%, #ffffff 100%);
    }
    
    .recommendation.rank-2 {
      border-color: #9ca3af;
      background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
    }
    
    .recommendation.rank-3 {
      border-color: #d97706;
      background: linear-gradient(135deg, #fffbeb 0%, #ffffff 100%);
    }
    
    .rec-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 16px;
    }
    
    .rec-rank {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    .rank-1 .rec-rank {
      background: #fef08a;
      color: #854d0e;
    }
    
    .rank-2 .rec-rank {
      background: #e5e7eb;
      color: #374151;
    }
    
    .rank-3 .rec-rank {
      background: #fed7aa;
      color: #9a3412;
    }
    
    .rec-name {
      font-size: 22px;
      font-weight: 700;
      color: #1f2937;
    }
    
    .rec-cost {
      text-align: ${isRTL ? 'left' : 'right'};
    }
    
    .rec-cost label {
      display: block;
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 4px;
    }
    
    .rec-cost value {
      display: block;
      font-size: 24px;
      font-weight: 700;
      color: #2563eb;
    }
    
    .scores {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    
    .score-item {
      flex: 1;
      min-width: 80px;
      text-align: center;
      padding: 12px;
      background: #f9fafb;
      border-radius: 8px;
    }
    
    .score-item.total {
      background: #2563eb;
      color: white;
    }
    
    .score-item label {
      display: block;
      font-size: 11px;
      margin-bottom: 4px;
      opacity: 0.8;
    }
    
    .score-item value {
      display: block;
      font-size: 20px;
      font-weight: 700;
    }
    
    .score-bar {
      height: 4px;
      background: #e5e7eb;
      border-radius: 2px;
      margin-top: 6px;
      overflow: hidden;
    }
    
    .score-bar-fill {
      height: 100%;
      background: #2563eb;
      border-radius: 2px;
    }
    
    .score-item.total .score-bar {
      background: rgba(255, 255, 255, 0.3);
    }
    
    .score-item.total .score-bar-fill {
      background: white;
    }
    
    .reasons-caveats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }
    
    @media (max-width: 600px) {
      .reasons-caveats {
        grid-template-columns: 1fr;
      }
    }
    
    .reasons h4, .caveats h4 {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .reasons h4 {
      color: #16a34a;
    }
    
    .caveats h4 {
      color: #d97706;
    }
    
    .reasons ul, .caveats ul {
      list-style: none;
      padding: 0;
    }
    
    .reasons li, .caveats li {
      padding: 6px 0;
      font-size: 13px;
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }
    
    .reasons li::before {
      content: "✓";
      color: #16a34a;
      font-weight: bold;
    }
    
    .caveats li::before {
      content: "⚠";
      color: #d97706;
    }
    
    .breakdown {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }
    
    .breakdown h4 {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 12px;
      color: #374151;
    }
    
    .breakdown table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    
    .breakdown th, .breakdown td {
      padding: 10px 12px;
      text-align: ${isRTL ? 'right' : 'left'};
      border-bottom: 1px solid #e5e7eb;
    }
    
    .breakdown th {
      background: #f9fafb;
      font-weight: 600;
      color: #6b7280;
    }
    
    .breakdown td:last-child {
      font-weight: 600;
      color: #2563eb;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
    }
    
    .footer p {
      font-size: 12px;
      color: #9ca3af;
      margin-bottom: 8px;
    }
    
    .footer .disclaimer {
      font-size: 11px;
      color: #6b7280;
      padding: 12px;
      background: #f9fafb;
      border-radius: 8px;
      margin-top: 16px;
    }
    
    .sources {
      margin-top: 30px;
      padding: 16px;
      background: #f9fafb;
      border-radius: 8px;
    }
    
    .sources h4 {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 12px;
      color: #374151;
    }
    
    .sources ul {
      list-style: none;
      padding: 0;
    }
    
    .sources li {
      font-size: 12px;
      color: #6b7280;
      padding: 4px 0;
    }
    
    @media print {
      body {
        padding: 20px;
      }
      
      .recommendation {
        page-break-inside: avoid;
      }
    }
    
    /* SAR Symbol styling */
    .sar-symbol {
      display: inline-block;
      width: 0.9em;
      height: 0.9em;
      vertical-align: middle;
      margin: 0 2px;
    }
    
    .rec-cost .sar-symbol {
      width: 1em;
      height: 1em;
    }
  `

  const recommendationsHTML = recommendations.map((rec, index) => {
    const providerName = locale === "ar" 
      ? (rec as unknown as { provider_name_ar?: string }).provider_name_ar || rec.provider?.name_ar || `مزود #${index + 1}`
      : (rec as unknown as { provider_name_en?: string }).provider_name_en || rec.provider?.name_en || `Provider #${index + 1}`
    const rank = index + 1
    
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
    
    // Format activation and settlement text
    const activationText = activationMin && activationMax
      ? `${activationMin}-${activationMax} ${t.days}`
      : activationMin ? `${activationMin}+ ${t.days}` : '-'
    
    const settlementText = settlementMin && settlementMax
      ? `${settlementMin}-${settlementMax} ${t.days}`
      : settlementMin ? `${settlementMin}+ ${t.days}` : '-'
    
    const supportText = supportChannels.length > 0 ? supportChannels.join(', ') : '-'

    return `
      <div class="recommendation rank-${rank}">
        <div class="rec-header">
          <div>
            <span class="rec-rank">${t.ranks[index] || `#${rank}`}</span>
            <div class="rec-name">${providerName}</div>
          </div>
          <div class="rec-cost">
            <label>${t.monthlyCost}</label>
            <value>${formatCurrency(rec.expected_cost_min, locale)} - ${formatCurrency(rec.expected_cost_max, locale)} ${SAR_SVG}</value>
          </div>
        </div>
        
        <div class="scores">
          <div class="score-item total">
            <label>${t.scores.total}</label>
            <value>${Math.round(rec.score_total)}</value>
            <div class="score-bar"><div class="score-bar-fill" style="width: ${rec.score_total}%"></div></div>
          </div>
          <div class="score-item">
            <label>${t.scores.cost}</label>
            <value>${Math.round(rec.score_cost)}</value>
            <div class="score-bar"><div class="score-bar-fill" style="width: ${rec.score_cost}%"></div></div>
          </div>
          <div class="score-item">
            <label>${t.scores.fit}</label>
            <value>${Math.round(rec.score_fit)}</value>
            <div class="score-bar"><div class="score-bar-fill" style="width: ${rec.score_fit}%"></div></div>
          </div>
          <div class="score-item">
            <label>${t.scores.ops}</label>
            <value>${Math.round(rec.score_ops)}</value>
            <div class="score-bar"><div class="score-bar-fill" style="width: ${rec.score_ops}%"></div></div>
          </div>
          <div class="score-item">
            <label>${t.scores.risk}</label>
            <value>${Math.round(rec.score_risk)}</value>
            <div class="score-bar"><div class="score-bar-fill" style="width: ${rec.score_risk}%"></div></div>
          </div>
        </div>
        
        <!-- Provider Details Section -->
        <div class="provider-details" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 16px 0; padding: 16px; background: #f8fafc; border-radius: 8px;">
          <div>
            <span style="display: block; font-size: 11px; color: #6b7280;">${t.activationTime}</span>
            <span style="font-weight: 600;">${activationText}</span>
          </div>
          <div>
            <span style="display: block; font-size: 11px; color: #6b7280;">${t.settlementDays}</span>
            <span style="font-weight: 600;">${settlementText}</span>
          </div>
          <div>
            <span style="display: block; font-size: 11px; color: #6b7280;">${t.supportChannels}</span>
            <span style="font-weight: 600;">${supportText}</span>
          </div>
        </div>
        
        <!-- Pros and Cons -->
        ${pros.length > 0 || cons.length > 0 ? `
          <div class="pros-cons" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
            ${pros.length > 0 ? `
              <div style="padding: 12px; background: #ecfdf5; border-radius: 8px; border: 1px solid #6ee7b7;">
                <h4 style="font-size: 13px; color: #059669; margin-bottom: 8px;">✓ ${t.pros}</h4>
                <ul style="margin: 0; padding: 0 0 0 16px; font-size: 12px;">
                  ${pros.map((p: string) => `<li style="margin-bottom: 4px;">${p}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
            ${cons.length > 0 ? `
              <div style="padding: 12px; background: #fef2f2; border-radius: 8px; border: 1px solid #fca5a5;">
                <h4 style="font-size: 13px; color: #dc2626; margin-bottom: 8px;">⚠ ${t.cons}</h4>
                <ul style="margin: 0; padding: 0 0 0 16px; font-size: 12px;">
                  ${cons.map((c: string) => `<li style="margin-bottom: 4px;">${c}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        ` : ''}
        
        <div class="reasons-caveats">
          ${rec.reasons.length > 0 ? `
            <div class="reasons">
              <h4>${t.reasons}</h4>
              <ul>
                ${rec.reasons.map(r => `<li>${translateReasonCaveat(r, locale)}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          ${rec.caveats.length > 0 ? `
            <div class="caveats">
              <h4>${t.caveats}</h4>
              <ul>
                ${rec.caveats.map(c => `<li>${translateReasonCaveat(c, locale)}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
        
        ${rec.breakdown.length > 0 ? `
          <div class="breakdown">
            <h4>${t.breakdown}</h4>
            <table>
              <thead>
                <tr>
                  <th>${t.paymentMethod}</th>
                  <th>${t.transactions}</th>
                  <th>${t.volume}</th>
                  <th>${t.fees}</th>
                </tr>
              </thead>
              <tbody>
                ${rec.breakdown.map(item => {
                  // Handle both new and legacy field names
                  const paymentMethod = item.payment_method || (item as any).method || "unknown"
                  const txCount = item.tx_count ?? (item as any).txCount ?? 0
                  const volume = item.volume ?? 0
                  const feeAmount = item.fee_amount ?? (item as any).cost ?? 0
                  const isMonthlyFee = (item as any).isMonthlyFee || paymentMethod === "monthly_fee"
                  
                  if (isMonthlyFee) {
                    return `
                      <tr style="background: #f9fafb;">
                        <td colspan="3" style="font-weight: 600;">${locale === "ar" ? "رسوم شهرية ثابتة" : "Monthly Fixed Fee"}</td>
                        <td>${formatCurrency(feeAmount, locale)} ${SAR_SVG}</td>
                      </tr>
                    `
                  }
                  
                  return `
                    <tr>
                      <td>${getPaymentMethodName(paymentMethod, locale)}</td>
                      <td>${txCount.toLocaleString(locale === "ar" ? "ar-SA" : "en-US")}</td>
                      <td>${formatCurrency(volume, locale)} ${SAR_SVG}</td>
                      <td>${formatCurrency(feeAmount, locale)} ${SAR_SVG}</td>
                    </tr>
                  `
                }).join('')}
              </tbody>
            </table>
          </div>
        ` : ''}
        
        ${rec.data_freshness ? `
          <div class="data-freshness" style="margin-top: 12px; font-size: 11px; color: #9ca3af;">
            ${t.dataFreshness}: ${rec.data_freshness}
          </div>
        ` : ''}
        
        ${docsUrl ? `
          <div style="margin-top: 16px;">
            <a href="${docsUrl}" target="_blank" style="display: inline-block; padding: 10px 20px; background: #059669; color: white; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 500;">${t.visitWebsite}</a>
          </div>
        ` : ''}
      </div>
    `
  }).join('')

  const businessSummary = wizardData ? `
    <div class="metadata">
      <div class="metadata-item">
        <label>${t.monthlyVolume}</label>
        <value>${formatCurrency(wizardData.monthly_gmv, locale)} ${SAR_SVG}</value>
      </div>
      <div class="metadata-item">
        <label>${t.transactionCount}</label>
        <value>${wizardData.tx_count.toLocaleString(locale === "ar" ? "ar-SA" : "en-US")}</value>
      </div>
      <div class="metadata-item">
        <label>${t.avgTicket}</label>
        <value>${formatCurrency(wizardData.avg_ticket, locale)} ${SAR_SVG}</value>
      </div>
    </div>
  ` : ''

  return `
    <!DOCTYPE html>
    <html lang="${locale}" dir="${isRTL ? 'rtl' : 'ltr'}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>PayGate Optimizer - ${t.reportTitle}</title>
      <style>${styles}</style>
    </head>
    <body>
      <div class="header">
        <div class="header-logo">
          <svg viewBox="0 0 512 512" width="56" height="56">
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#10b981"/>
                <stop offset="100%" stop-color="#059669"/>
              </linearGradient>
            </defs>
            <rect x="16" y="16" width="480" height="480" rx="96" fill="url(#logoGrad)"/>
            <rect x="48" y="48" width="416" height="416" rx="80" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
            <path d="M168 400 L168 112 L312 112 Q376 112 408 152 Q440 192 440 256 Q440 320 408 360 Q376 400 312 400 L168 400 Z M224 344 L296 344 Q340 344 362 316 Q384 288 384 256 Q384 224 362 196 Q340 168 296 168 L224 168 Z" fill="white"/>
            <g transform="translate(350, 70)">
              <rect width="90" height="56" rx="10" fill="rgba(255,255,255,0.25)"/>
              <rect x="12" y="16" width="35" height="6" rx="3" fill="rgba(255,255,255,0.6)"/>
              <rect x="12" y="28" width="22" height="4" rx="2" fill="rgba(255,255,255,0.4)"/>
              <circle cx="68" cy="28" r="14" fill="rgba(255,255,255,0.4)"/>
              <circle cx="55" cy="28" r="14" fill="rgba(255,255,255,0.3)"/>
            </g>
          </svg>
          <span class="header-brand">
            <span class="pay">PayGate</span>
            <span class="optimizer"> Optimizer</span>
          </span>
        </div>
        <p style="font-size: 18px; color: #374151; margin-bottom: 8px;">${t.reportTitle}</p>
        <p style="font-size: 12px; color: #9ca3af; margin-top: 8px;">
          ${t.generatedAt}: ${new Date().toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
      
      ${businessSummary}
      
      <h2 class="section-title">${t.recommendations}</h2>
      ${recommendationsHTML}
      
      <div class="footer">
        <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 8px;">
          <svg viewBox="0 0 512 512" width="24" height="24">
            <defs>
              <linearGradient id="footerLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#10b981"/>
                <stop offset="100%" stop-color="#059669"/>
              </linearGradient>
            </defs>
            <rect x="16" y="16" width="480" height="480" rx="96" fill="url(#footerLogoGrad)"/>
            <path d="M168 400 L168 112 L312 112 Q376 112 408 152 Q440 192 440 256 Q440 320 408 360 Q376 400 312 400 L168 400 Z M224 344 L296 344 Q340 344 362 316 Q384 288 384 256 Q384 224 362 196 Q340 168 296 168 L224 168 Z" fill="white"/>
          </svg>
          <span style="font-weight: 600;">PayGate <span style="color: #10b981;">Optimizer</span></span>
        </div>
        <p style="font-size: 11px; color: #6b7280;">${t.poweredBy}</p>
        <div class="disclaimer">
          ${t.disclaimer}
        </div>
        
        <!-- شعار الشركة المالكة -->
        <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <a href="https://op-target.com" target="_blank" style="text-decoration: none; display: inline-block;">
            <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
              <img src="https://op-target.com/logo.png" alt="الهدف الأمثل للتسويق" style="height: 50px; width: auto;" onerror="this.style.display='none'"/>
              <div style="text-align: center;">
                <p style="font-size: 11px; color: #6b7280; margin: 0;">
                  ${isRTL ? 'منصة تابعة لـ' : 'A platform by'}
                </p>
                <p style="font-size: 13px; color: #1f2937; font-weight: 600; margin: 4px 0 0 0;">
                  ${isRTL ? 'الهدف الأمثل لتطوير الأعمال' : 'Marketing Optimum Target'}
                </p>
                <p style="font-size: 10px; color: #10b981; margin: 2px 0 0 0;">op-target.com</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </body>
    </html>
  `
}

function formatCurrency(amount: number, locale: "ar" | "en"): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-SA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

function getPaymentMethodName(code: string, locale: "ar" | "en"): string {
  const names: Record<string, Record<"ar" | "en", string>> = {
    mada: { ar: "مدى", en: "mada" },
    visa_mc: { ar: "فيزا / ماستركارد", en: "Visa / Mastercard" },
    visa: { ar: "فيزا", en: "Visa" },
    mastercard: { ar: "ماستركارد", en: "Mastercard" },
    apple_pay: { ar: "Apple Pay", en: "Apple Pay" },
    google_pay: { ar: "Google Pay", en: "Google Pay" },
    stc_pay: { ar: "STC Pay", en: "STC Pay" },
    tabby: { ar: "تابي", en: "Tabby" },
    tamara: { ar: "تمارا", en: "Tamara" },
    other: { ar: "أخرى", en: "Other" },
  }
  return names[code]?.[locale] || code
}

const translations = {
  ar: {
    reportTitle: "تقرير مقارنة بوابات الدفع",
    generatedAt: "تاريخ التقرير",
    recommendations: "التوصيات",
    ranks: ["الأفضل", "الخيار الثاني", "الخيار الثالث", "الخيار الرابع", "الخيار الخامس"],
    monthlyCost: "التكلفة الشهرية المتوقعة",
    scores: {
      total: "الإجمالي",
      cost: "التكلفة",
      fit: "التوافق",
      ops: "العمليات",
      risk: "المخاطر",
    },
    reasons: "لماذا هذا الخيار؟",
    caveats: "ملاحظات مهمة",
    breakdown: "تفاصيل التكاليف",
    paymentMethod: "طريقة الدفع",
    transactions: "المعاملات",
    volume: "الحجم",
    fees: "الرسوم",
    dataFreshness: "حداثة البيانات",
    monthlyVolume: "الحجم الشهري",
    transactionCount: "عدد المعاملات",
    avgTicket: "متوسط قيمة العملية",
    poweredBy: "مدعوم بالذكاء الاصطناعي",
    disclaimer: "هذا التقرير استرشادي فقط. الأسعار والشروط النهائية قد تختلف. يرجى التحقق من المزودين مباشرة قبل اتخاذ القرار. البيانات مجمعة من المصادر الرسمية ومراجعات المستخدمين.",
    // New fields
    pros: "المميزات",
    cons: "العيوب",
    activationTime: "مدة التفعيل",
    settlementDays: "مدة التسوية",
    supportChannels: "قنوات الدعم",
    visitWebsite: "زيارة الموقع",
    days: "أيام",
    providerDetails: "تفاصيل المزود",
  },
  en: {
    reportTitle: "Payment Gateway Comparison Report",
    generatedAt: "Report Date",
    recommendations: "Recommendations",
    ranks: ["Best Choice", "Second Option", "Third Option", "Fourth Option", "Fifth Option"],
    monthlyCost: "Expected Monthly Cost",
    scores: {
      total: "Total",
      cost: "Cost",
      fit: "Fit",
      ops: "Ops",
      risk: "Risk",
    },
    reasons: "Why this option?",
    caveats: "Important Notes",
    breakdown: "Cost Breakdown",
    paymentMethod: "Payment Method",
    transactions: "Transactions",
    volume: "Volume",
    fees: "Fees",
    dataFreshness: "Data Freshness",
    monthlyVolume: "Monthly Volume",
    transactionCount: "Transaction Count",
    avgTicket: "Average Ticket",
    poweredBy: "Powered by AI",
    disclaimer: "This report is for guidance only. Final prices and terms may vary. Please verify with providers directly before making a decision. Data is collected from official sources and user reviews.",
    // New fields
    pros: "Pros",
    cons: "Cons",
    activationTime: "Activation Time",
    settlementDays: "Settlement Period",
    supportChannels: "Support Channels",
    visitWebsite: "Visit Website",
    days: "days",
    providerDetails: "Provider Details",
  },
}

// Open print dialog with generated PDF content
export function printPDF(options: PDFExportOptions): void {
  const content = generatePDFContent(options)
  const blob = new Blob([content], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  
  const printWindow = window.open(url, '_blank')
  if (printWindow) {
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
        URL.revokeObjectURL(url)
      }, 500)
    }
  }
}

// Download as HTML file
export function downloadHTML(options: PDFExportOptions, filename: string = 'paygate-report'): void {
  const content = generatePDFContent(options)
  const blob = new Blob([content], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.html`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

