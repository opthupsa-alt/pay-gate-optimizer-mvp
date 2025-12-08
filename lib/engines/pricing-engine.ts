import type { WizardFormData, PricingRule, PaymentMix, CostBreakdown, ProviderFee } from "@/lib/types"

interface PricingResult {
  totalCostMin: number
  totalCostMax: number
  breakdown: CostBreakdown[]
  monthlyFee: number
  setupFee: number
  refundsCost: number
  chargebacksCost: number
  crossBorderCost: number
  currencyConversionCost: number
  vatAmount: number
  totalWithVAT: number
}

const PAYMENT_METHOD_MAP: Record<keyof PaymentMix, string> = {
  mada: "mada",
  visa_mc: "visa_mc",
  apple_pay: "apple_pay",
  google_pay: "google_pay",
  stc_pay: "stc_pay",
  tabby: "tabby",
  tamara: "tamara",
  other: "bank_transfer",
}

const VAT_RATE = 0.15 // 15% VAT in Saudi Arabia

// Calculate pricing using legacy PricingRule format
export function calculatePricing(pricingRules: PricingRule[], formData: WizardFormData): PricingResult {
  const { monthly_gmv, tx_count, payment_mix, refunds_rate, chargebacks_rate, needs } = formData

  const breakdown: CostBreakdown[] = []
  let totalMethodCost = 0
  let monthlyFee = 0
  let setupFee = 0
  let crossBorderCost = 0
  let currencyConversionCost = 0

  // Get maximum monthly fee from all rules (only one applies)
  const monthlyFees = pricingRules.filter((r) => r.monthly_fee > 0)
  if (monthlyFees.length > 0) {
    monthlyFee = Math.max(...monthlyFees.map((r) => r.monthly_fee))
  }

  // Get setup fee
  const setupFees = pricingRules.filter((r) => r.setup_fee > 0)
  if (setupFees.length > 0) {
    setupFee = Math.max(...setupFees.map((r) => r.setup_fee))
  }

  // Calculate cost for each payment method in the mix
  for (const [mixKey, mixPercent] of Object.entries(payment_mix)) {
    if (mixPercent <= 0) continue

    const methodCode = PAYMENT_METHOD_MAP[mixKey as keyof PaymentMix]
    const rule = pricingRules.find((r) => r.payment_method?.code === methodCode && r.is_active)

    if (!rule) continue

    const txCountMethod = Math.round(tx_count * (mixPercent / 100))
    const volumeMethod = monthly_gmv * (mixPercent / 100)
    const avgTicketMethod = txCountMethod > 0 ? volumeMethod / txCountMethod : 0

    // Calculate fee per transaction
    let feePerTxn = avgTicketMethod * (rule.fee_percent / 100) + rule.fee_fixed

    // Apply min/max caps
    if (rule.minimum_fee_per_txn && feePerTxn < rule.minimum_fee_per_txn) {
      feePerTxn = rule.minimum_fee_per_txn
    }
    if (rule.maximum_fee_per_txn && feePerTxn > rule.maximum_fee_per_txn) {
      feePerTxn = rule.maximum_fee_per_txn
    }

    const methodCost = feePerTxn * txCountMethod
    totalMethodCost += methodCost

    breakdown.push({
      payment_method: methodCode,
      payment_method_name_ar: rule.payment_method?.name_ar || methodCode,
      payment_method_name_en: rule.payment_method?.name_en || methodCode,
      tx_count: txCountMethod,
      volume: volumeMethod,
      fee_amount: methodCost,
      fee_percent: rule.fee_percent,
      fee_fixed: rule.fee_fixed,
    })
  }

  // Calculate refund and chargeback costs
  const refundRule = pricingRules.find((r) => r.refund_fee_fixed > 0)
  const chargebackRule = pricingRules.find((r) => r.chargeback_fee_fixed > 0)

  const refundTxCount = Math.round(tx_count * (refunds_rate / 100))
  const chargebackTxCount = Math.round(tx_count * (chargebacks_rate / 100))

  const refundsCost = refundTxCount * (refundRule?.refund_fee_fixed || 0)
  const chargebacksCost = chargebackTxCount * (chargebackRule?.chargeback_fee_fixed || 0)

  // Calculate international fees if multi-currency is needed
  if (needs?.multi_currency || needs?.international_customers) {
    // Estimate 20% of transactions are international
    const internationalVolume = monthly_gmv * 0.2
    crossBorderCost = internationalVolume * 0.015 // Assume 1.5% cross-border fee
    currencyConversionCost = internationalVolume * 0.025 // Assume 2.5% conversion fee
  }

  // Calculate totals
  const baseCost = totalMethodCost + monthlyFee + refundsCost + chargebacksCost + crossBorderCost + currencyConversionCost

  // Min: best-case (lower refunds/chargebacks)
  const refundsCostMin = Math.round(refundTxCount * 0.5) * (refundRule?.refund_fee_fixed || 0)
  const chargebacksCostMin = Math.round(chargebackTxCount * 0.5) * (chargebackRule?.chargeback_fee_fixed || 0)
  const totalCostMin = totalMethodCost + monthlyFee + refundsCostMin + chargebacksCostMin + crossBorderCost + currencyConversionCost

  // Max: worst-case (higher refunds/chargebacks)
  const refundsCostMax = Math.round(refundTxCount * 1.5) * (refundRule?.refund_fee_fixed || 0)
  const chargebacksCostMax = Math.round(chargebackTxCount * 1.5) * (chargebackRule?.chargeback_fee_fixed || 0)
  const totalCostMax = totalMethodCost + monthlyFee + refundsCostMax + chargebacksCostMax + crossBorderCost + currencyConversionCost

  // Calculate VAT
  const vatAmount = baseCost * VAT_RATE
  const totalWithVAT = baseCost + vatAmount

  return {
    totalCostMin: Math.round(totalCostMin * 100) / 100,
    totalCostMax: Math.round(totalCostMax * 100) / 100,
    breakdown,
    monthlyFee,
    setupFee,
    refundsCost,
    chargebacksCost,
    crossBorderCost: Math.round(crossBorderCost * 100) / 100,
    currencyConversionCost: Math.round(currencyConversionCost * 100) / 100,
    vatAmount: Math.round(vatAmount * 100) / 100,
    totalWithVAT: Math.round(totalWithVAT * 100) / 100,
  }
}

// Calculate pricing using extended ProviderFee format
export function calculatePricingExtended(providerFees: ProviderFee[], formData: WizardFormData): PricingResult {
  const { monthly_gmv, tx_count, payment_mix, refunds_rate, chargebacks_rate, needs } = formData

  const breakdown: CostBreakdown[] = []
  let totalMethodCost = 0
  let monthlyFee = 0
  let setupFee = 0
  let crossBorderCost = 0
  let currencyConversionCost = 0
  let refundsCost = 0
  let chargebacksCost = 0

  // Get monthly and setup fees
  const baseFee = providerFees.find((f) => !f.payment_method_id)
  if (baseFee) {
    monthlyFee = baseFee.monthly_fee || 0
    setupFee = baseFee.setup_fee || 0
  }

  // Calculate cost for each payment method in the mix
  for (const [mixKey, mixPercent] of Object.entries(payment_mix)) {
    if (mixPercent <= 0) continue

    const methodCode = PAYMENT_METHOD_MAP[mixKey as keyof PaymentMix]
    const fee = providerFees.find((f) => f.payment_method?.code === methodCode && f.is_active)

    if (!fee) {
      // Use base fee if no specific fee for this method
      const baseFee = providerFees.find((f) => !f.payment_method_id && f.is_active)
      if (!baseFee) continue
      
      const txCountMethod = Math.round(tx_count * (mixPercent / 100))
      const volumeMethod = monthly_gmv * (mixPercent / 100)
      const avgTicketMethod = txCountMethod > 0 ? volumeMethod / txCountMethod : 0

      let feePerTxn = avgTicketMethod * (baseFee.fee_percent / 100) + baseFee.fee_fixed
      const methodCost = feePerTxn * txCountMethod
      totalMethodCost += methodCost

      breakdown.push({
        payment_method: mixKey,
        tx_count: txCountMethod,
        volume: volumeMethod,
        fee_amount: methodCost,
        fee_percent: baseFee.fee_percent,
        fee_fixed: baseFee.fee_fixed,
      })
      continue
    }

    const txCountMethod = Math.round(tx_count * (mixPercent / 100))
    const volumeMethod = monthly_gmv * (mixPercent / 100)
    const avgTicketMethod = txCountMethod > 0 ? volumeMethod / txCountMethod : 0

    // Calculate fee per transaction
    let feePerTxn = avgTicketMethod * (fee.fee_percent / 100) + fee.fee_fixed

    // Apply min/max caps
    if (fee.minimum_fee_per_txn && feePerTxn < fee.minimum_fee_per_txn) {
      feePerTxn = fee.minimum_fee_per_txn
    }
    if (fee.maximum_fee_per_txn && feePerTxn > fee.maximum_fee_per_txn) {
      feePerTxn = fee.maximum_fee_per_txn
    }

    const methodCost = feePerTxn * txCountMethod
    totalMethodCost += methodCost

    // Add cross-border and conversion fees for international transactions
    if (needs?.multi_currency || needs?.international_customers) {
      const internationalRatio = 0.2 // Assume 20% international
      crossBorderCost += volumeMethod * internationalRatio * (fee.cross_border_fee_percent / 100)
      currencyConversionCost += volumeMethod * internationalRatio * (fee.currency_conversion_fee_percent / 100)
    }

    breakdown.push({
      payment_method: methodCode,
      payment_method_name_ar: fee.payment_method?.name_ar || methodCode,
      payment_method_name_en: fee.payment_method?.name_en || methodCode,
      tx_count: txCountMethod,
      volume: volumeMethod,
      fee_amount: methodCost,
      fee_percent: fee.fee_percent,
      fee_fixed: fee.fee_fixed,
    })
  }

  // Calculate refund and chargeback costs
  const refundFee = providerFees.find((f) => f.refund_fee_fixed > 0 || f.refund_fee_percent > 0)
  const chargebackFee = providerFees.find((f) => f.chargeback_fee_fixed > 0)

  const refundTxCount = Math.round(tx_count * (refunds_rate / 100))
  const chargebackTxCount = Math.round(tx_count * (chargebacks_rate / 100))

  if (refundFee) {
    const avgRefundAmount = formData.avg_ticket || (monthly_gmv / tx_count)
    refundsCost = refundTxCount * (refundFee.refund_fee_fixed + avgRefundAmount * (refundFee.refund_fee_percent / 100))
  }

  if (chargebackFee) {
    chargebacksCost = chargebackTxCount * chargebackFee.chargeback_fee_fixed
  }

  // Calculate totals
  const baseCost = totalMethodCost + monthlyFee + refundsCost + chargebacksCost + crossBorderCost + currencyConversionCost

  // Min: best-case
  const totalCostMin = totalMethodCost + monthlyFee + refundsCost * 0.5 + chargebacksCost * 0.5 + crossBorderCost + currencyConversionCost

  // Max: worst-case
  const totalCostMax = totalMethodCost + monthlyFee + refundsCost * 1.5 + chargebacksCost * 1.5 + crossBorderCost + currencyConversionCost

  // Calculate VAT
  const vatAmount = baseCost * VAT_RATE
  const totalWithVAT = baseCost + vatAmount

  return {
    totalCostMin: Math.round(totalCostMin * 100) / 100,
    totalCostMax: Math.round(totalCostMax * 100) / 100,
    breakdown,
    monthlyFee,
    setupFee,
    refundsCost: Math.round(refundsCost * 100) / 100,
    chargebacksCost: Math.round(chargebacksCost * 100) / 100,
    crossBorderCost: Math.round(crossBorderCost * 100) / 100,
    currencyConversionCost: Math.round(currencyConversionCost * 100) / 100,
    vatAmount: Math.round(vatAmount * 100) / 100,
    totalWithVAT: Math.round(totalWithVAT * 100) / 100,
  }
}

// Format cost as Saudi Riyals
export function formatCost(amount: number, locale: "ar" | "en" = "ar"): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-SA", {
    style: "currency",
    currency: "SAR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Format percentage
export function formatPercent(value: number, locale: "ar" | "en" = "ar"): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-SA", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100)
}
