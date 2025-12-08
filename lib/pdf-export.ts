// PDF Export utilities for PayGate Optimizer
// Uses browser print functionality with custom styling

import type { Recommendation, WizardFormData, Provider } from "./types"

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
  `

  const recommendationsHTML = recommendations.map((rec, index) => {
    const providerName = locale === "ar" 
      ? (rec as unknown as { provider_name_ar?: string }).provider_name_ar || rec.provider?.name_ar || `مزود #${index + 1}`
      : (rec as unknown as { provider_name_en?: string }).provider_name_en || rec.provider?.name_en || `Provider #${index + 1}`
    const rank = index + 1

    return `
      <div class="recommendation rank-${rank}">
        <div class="rec-header">
          <div>
            <span class="rec-rank">${t.ranks[index] || `#${rank}`}</span>
            <div class="rec-name">${providerName}</div>
          </div>
          <div class="rec-cost">
            <label>${t.monthlyCost}</label>
            <value>${formatCurrency(rec.expected_cost_min, locale)} - ${formatCurrency(rec.expected_cost_max, locale)} ${t.currency}</value>
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
        
        <div class="reasons-caveats">
          ${rec.reasons.length > 0 ? `
            <div class="reasons">
              <h4>${t.reasons}</h4>
              <ul>
                ${rec.reasons.map(r => `<li>${r}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          ${rec.caveats.length > 0 ? `
            <div class="caveats">
              <h4>${t.caveats}</h4>
              <ul>
                ${rec.caveats.map(c => `<li>${c}</li>`).join('')}
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
                ${rec.breakdown.map(item => `
                  <tr>
                    <td>${getPaymentMethodName(item.payment_method, locale)}</td>
                    <td>${item.tx_count.toLocaleString(locale === "ar" ? "ar-SA" : "en-US")}</td>
                    <td>${formatCurrency(item.volume, locale)} ${t.currency}</td>
                    <td>${formatCurrency(item.fee_amount, locale)} ${t.currency}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : ''}
        
        ${rec.data_freshness ? `
          <div class="data-freshness" style="margin-top: 12px; font-size: 11px; color: #9ca3af;">
            ${t.dataFreshness}: ${rec.data_freshness}
          </div>
        ` : ''}
      </div>
    `
  }).join('')

  const businessSummary = wizardData ? `
    <div class="metadata">
      <div class="metadata-item">
        <label>${t.monthlyVolume}</label>
        <value>${formatCurrency(wizardData.monthly_gmv, locale)} ${t.currency}</value>
      </div>
      <div class="metadata-item">
        <label>${t.transactionCount}</label>
        <value>${wizardData.tx_count.toLocaleString(locale === "ar" ? "ar-SA" : "en-US")}</value>
      </div>
      <div class="metadata-item">
        <label>${t.avgTicket}</label>
        <value>${formatCurrency(wizardData.avg_ticket, locale)} ${t.currency}</value>
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
    currency: "ر.س",
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
  },
  en: {
    reportTitle: "Payment Gateway Comparison Report",
    generatedAt: "Report Date",
    recommendations: "Recommendations",
    ranks: ["Best Choice", "Second Option", "Third Option", "Fourth Option", "Fifth Option"],
    monthlyCost: "Expected Monthly Cost",
    currency: "SAR",
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

