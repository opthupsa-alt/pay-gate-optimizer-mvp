import type { WizardFormData, ProviderWithRelations, ScoringWeights, ScoringWeight, ProviderIntegration, ProviderReview } from "@/lib/types"

interface ScoringResult {
  score_total: number
  score_cost: number
  score_fit: number
  score_ops: number
  score_risk: number
  score_onboarding?: number
  score_settlement?: number
  score_integration?: number
  score_payment_match?: number
  score_rating?: number
  reasons: string[]
  caveats: string[]
  disqualified: boolean
  disqualifyReason?: string
  data_freshness?: string
}

// Default weights for backward compatibility
const DEFAULT_WEIGHTS: ScoringWeights = {
  id: "",
  cost_weight: 0.30,
  fit_weight: 0.20,
  ops_weight: 0.15,
  risk_weight: 0.15,
  created_at: "",
  updated_at: "",
}

// Extended weights with new factors
interface ExtendedWeights {
  cost: number
  fit: number
  ops: number
  risk: number
  onboarding_speed: number
  settlement_speed: number
  integration_match: number
  payment_methods_match: number
  rating: number
}

const DEFAULT_EXTENDED_WEIGHTS: ExtendedWeights = {
  cost: 30,
  fit: 20,
  ops: 15,
  risk: 15,
  onboarding_speed: 8,
  settlement_speed: 8,
  integration_match: 10,
  payment_methods_match: 10,
  rating: 10,
}

// Convert ScoringWeight array to ExtendedWeights object
function parseWeights(weights: ScoringWeight[]): ExtendedWeights {
  const result = { ...DEFAULT_EXTENDED_WEIGHTS }
  for (const w of weights) {
    if (w.factor in result && w.is_active) {
      (result as Record<string, number>)[w.factor] = w.weight
    }
  }
  // Normalize to 100
  const total = Object.values(result).reduce((a, b) => a + b, 0)
  if (total !== 100) {
    const factor = 100 / total
    for (const key of Object.keys(result)) {
      (result as Record<string, number>)[key] *= factor
    }
  }
  return result
}

export function calculateScore(
  provider: ProviderWithRelations,
  formData: WizardFormData,
  providerCost: number,
  minCostOverall: number,
  weights: ScoringWeights = DEFAULT_WEIGHTS,
  locale: "ar" | "en" = "ar",
): ScoringResult {
  const reasons: string[] = []
  const caveats: string[] = []
  let disqualified = false
  let disqualifyReason: string | undefined

  // Check if provider supports the sector
  if (formData.sector_id) {
    const sectorRule = provider.provider_sector_rules?.find((r) => r.sector_id === formData.sector_id)
    if (sectorRule && !sectorRule.is_supported) {
      disqualified = true
      disqualifyReason =
        locale === "ar" ? "المزود لا يدعم قطاع النشاط المحدد" : "Provider does not support the selected sector"
      return createDisqualifiedResult(disqualifyReason, disqualified)
    }
  }

  // Check required payment methods
  const paymentMethodCodes = Object.entries(formData.payment_mix)
    .filter(([, percent]) => (percent as number) > 0)
    .map(([key]) => {
      const map: Record<string, string> = {
        mada: "mada",
        visa_mc: "visa_mc",
        apple_pay: "apple_pay",
        google_pay: "google_pay",
        stc_pay: "stc_pay",
        tabby: "tabby",
        tamara: "tamara",
      }
      return map[key]
    })
    .filter(Boolean)

  const supportedMethods =
    provider.provider_payment_methods?.filter((ppm) => ppm.enabled).map((ppm) => ppm.payment_method?.code) || []

  // Add wallet support check
  const walletMethods = provider.provider_wallets?.filter((w) => w.is_supported).map((w) => w.wallet_type) || []
  
  for (const code of paymentMethodCodes) {
    const isSupported = supportedMethods.includes(code) || walletMethods.includes(code as never)
    if (!isSupported) {
      // Check if it's a critical method
      const mixPercent = (formData.payment_mix as unknown as Record<string, number>)[code] || 0
      if (mixPercent >= 20) {
        // More than 20% of transactions - disqualify
        disqualified = true
        disqualifyReason =
          locale === "ar"
            ? `المزود لا يدعم طريقة الدفع المطلوبة: ${code}`
            : `Provider does not support required payment method: ${code}`
        return createDisqualifiedResult(disqualifyReason, disqualified)
      } else {
        // Minor method - add caveat
        caveats.push(
          locale === "ar"
            ? `طريقة الدفع ${code} غير مدعومة`
            : `Payment method ${code} is not supported`
        )
      }
    }
  }

  // Check recurring requirement
  if (formData.needs.recurring) {
    const supportsRecurring = provider.provider_payment_methods?.some((ppm) => ppm.supports_recurring)
    if (!supportsRecurring) {
      disqualified = true
      disqualifyReason =
        locale === "ar"
          ? "المزود لا يدعم الدفعات المتكررة المطلوبة"
          : "Provider does not support required recurring payments"
      return createDisqualifiedResult(disqualifyReason, disqualified)
    }
  }

  // Check BNPL requirement
  if (formData.needs.bnpl_support) {
    const supportsBnpl = provider.provider_bnpl && provider.provider_bnpl.length > 0
    if (!supportsBnpl) {
      disqualified = true
      disqualifyReason =
        locale === "ar"
          ? "المزود لا يدعم خدمة الشراء الآن والدفع لاحقاً"
          : "Provider does not support Buy Now Pay Later"
      return createDisqualifiedResult(disqualifyReason, disqualified)
    }
  }

  // --- COST SCORE (0-100) ---
  let scoreCost = 0
  if (providerCost > 0 && minCostOverall > 0) {
    scoreCost = Math.min(100, Math.round((minCostOverall / providerCost) * 100))
  }

  if (scoreCost >= 80) {
    reasons.push(locale === "ar" ? "رسوم منخفضة مقارنة بالمنافسين" : "Low fees compared to competitors")
  }

  // --- FIT SCORE (0-100) ---
  let fitPoints = 0
  const maxFitPoints = 100

  const capabilities = provider.provider_capabilities?.map((pc) => pc.capability?.code) || []
  const integrations = provider.provider_integrations || []

  // Recurring (20 points)
  if (formData.needs.recurring) {
    const supportsRecurring = provider.provider_payment_methods?.some((ppm) => ppm.supports_recurring)
    if (supportsRecurring) {
      fitPoints += 20
      reasons.push(
        locale === "ar" ? "يدعم الدفعات المتكررة للاشتراكات" : "Supports recurring payments for subscriptions",
      )
    }
  } else {
    fitPoints += 20
  }

  // Apple Pay (12 points)
  if (formData.needs.apple_pay) {
    const supportsApplePay = supportedMethods.includes("apple_pay") || walletMethods.includes("apple_pay")
    if (supportsApplePay) {
      fitPoints += 12
      reasons.push(locale === "ar" ? "يدعم Apple Pay" : "Supports Apple Pay")
    }
  } else {
    fitPoints += 12
  }

  // Google Pay (8 points)
  if (formData.needs.google_pay) {
    const supportsGooglePay = supportedMethods.includes("google_pay") || walletMethods.includes("google_pay")
    if (supportsGooglePay) {
      fitPoints += 8
      reasons.push(locale === "ar" ? "يدعم Google Pay" : "Supports Google Pay")
    }
  } else {
    fitPoints += 8
  }

  // Platform integration (20 points)
  const platformScore = calculatePlatformScore(integrations, formData, locale, reasons)
  fitPoints += platformScore.points

  // Multi-currency (15 points)
  if (formData.needs.multi_currency || formData.needs.international_customers) {
    const supportsMultiCurrency = provider.multi_currency_supported || 
      (provider.provider_currencies && provider.provider_currencies.length > 1) ||
      capabilities.includes("multi_currency")
    if (supportsMultiCurrency) {
      fitPoints += 15
      reasons.push(locale === "ar" ? "يدعم العملات المتعددة" : "Supports multi-currency")
    }
  } else {
    fitPoints += 15
  }

  // Tokenization (10 points)
  if (formData.needs.tokenization) {
    const supportsTokenization = provider.provider_payment_methods?.some((ppm) => ppm.supports_tokenization) ||
      capabilities.includes("tokenization")
    if (supportsTokenization) {
      fitPoints += 10
      reasons.push(locale === "ar" ? "يدعم حفظ بيانات البطاقة" : "Supports card tokenization")
    }
  } else {
    fitPoints += 10
  }

  // BNPL support (15 points)
  if (formData.needs.bnpl_support) {
    const supportsBnpl = provider.provider_bnpl && provider.provider_bnpl.length > 0
    if (supportsBnpl) {
      fitPoints += 15
      const bnplProviders = provider.provider_bnpl!.map(b => b.bnpl_provider).join(", ")
      reasons.push(
        locale === "ar" 
          ? `يدعم الشراء الآن والدفع لاحقاً (${bnplProviders})` 
          : `Supports BNPL (${bnplProviders})`
      )
    }
  } else {
    fitPoints += 15
  }

  const scoreFit = Math.round((fitPoints / maxFitPoints) * 100)

  // --- OPS SCORE (0-100) ---
  const opsMetrics = provider.ops_metrics
  let scoreOps = 70 // Default

  if (opsMetrics) {
    scoreOps = Math.round(
      opsMetrics.onboarding_score * 0.4 + opsMetrics.support_score * 0.4 + opsMetrics.docs_score * 0.2,
    )
  }

  // --- ONBOARDING SPEED SCORE (0-100) ---
  let scoreOnboarding = 50
  if (provider.activation_time_days_max <= 3) {
    scoreOnboarding = 100
    reasons.push(
      locale === "ar"
        ? `تفعيل سريع جداً (${provider.activation_time_days_min}-${provider.activation_time_days_max} أيام)`
        : `Very fast activation (${provider.activation_time_days_min}-${provider.activation_time_days_max} days)`,
    )
  } else if (provider.activation_time_days_max <= 7) {
    scoreOnboarding = 80
    reasons.push(
      locale === "ar"
        ? `تفعيل سريع (${provider.activation_time_days_min}-${provider.activation_time_days_max} أيام)`
        : `Fast activation (${provider.activation_time_days_min}-${provider.activation_time_days_max} days)`,
    )
  } else if (provider.activation_time_days_max <= 14) {
    scoreOnboarding = 60
  } else {
    scoreOnboarding = 40
    caveats.push(
      locale === "ar"
        ? `التفعيل قد يستغرق ${provider.activation_time_days_max}+ يوم`
        : `Activation may take ${provider.activation_time_days_max}+ days`
    )
  }

  // --- SETTLEMENT SPEED SCORE (0-100) ---
  let scoreSettlement = 50
  if (formData.needs.fast_settlement) {
    if (provider.settlement_days_min <= 1) {
      scoreSettlement = 100
      reasons.push(
        locale === "ar"
          ? `تسوية يومية (${provider.settlement_days_min}-${provider.settlement_days_max} أيام)`
          : `Daily settlement (${provider.settlement_days_min}-${provider.settlement_days_max} days)`,
      )
    } else if (provider.settlement_days_min <= 3) {
      scoreSettlement = 70
    } else {
      scoreSettlement = 40
      caveats.push(
        locale === "ar"
          ? `التسوية قد تستغرق ${provider.settlement_days_max}+ يوم`
          : `Settlement may take ${provider.settlement_days_max}+ days`
      )
    }
  } else {
    scoreSettlement = provider.settlement_days_max <= 5 ? 80 : 60
  }

  // --- INTEGRATION MATCH SCORE (0-100) ---
  const scoreIntegration = platformScore.score

  // --- PAYMENT METHODS MATCH SCORE (0-100) ---
  const scorePaymentMatch = calculatePaymentMethodsMatch(
    supportedMethods,
    walletMethods,
    formData.payment_mix as unknown as Record<string, number>,
    formData.needs
  )

  // --- RATING SCORE (0-100) ---
  const scoreRating = calculateRatingScore(provider.provider_reviews || [])

  // --- RISK SCORE (0-100, start at 100 and apply penalties) ---
  let scoreRisk = 100

  // High chargeback fees penalty
  const chargebackRule = provider.pricing_rules?.find((r) => r.chargeback_fee_fixed > 60)
  if (chargebackRule) {
    scoreRisk -= 15
  }

  // Missing fraud tools when high chargeback rate
  if (formData.chargebacks_rate > 1 && !capabilities.includes("fraud_tools")) {
    scoreRisk -= 20
    caveats.push(
      locale === "ar"
        ? "ينصح بأدوات مكافحة الاحتيال لمعدل الرفض العالي"
        : "Fraud prevention tools recommended for high chargeback rate"
    )
  }

  // Check for rolling reserve
  if (provider.rolling_reserve_percent && provider.rolling_reserve_percent > 0) {
    scoreRisk -= 10
    caveats.push(
      locale === "ar"
        ? `احتياطي متحرك ${provider.rolling_reserve_percent}%`
        : `Rolling reserve ${provider.rolling_reserve_percent}%`
    )
  }

  scoreRisk = Math.max(0, Math.min(100, scoreRisk))

  // --- TOTAL SCORE (Using extended weights) ---
  const extendedWeights = DEFAULT_EXTENDED_WEIGHTS
  const totalWeightSum = Object.values(extendedWeights).reduce((a, b) => a + b, 0)
  
  const scoreTotal = Math.round(
    (extendedWeights.cost * scoreCost +
    extendedWeights.fit * scoreFit +
    extendedWeights.ops * scoreOps +
    extendedWeights.risk * scoreRisk +
    extendedWeights.onboarding_speed * scoreOnboarding +
    extendedWeights.settlement_speed * scoreSettlement +
    extendedWeights.integration_match * scoreIntegration +
    extendedWeights.payment_methods_match * scorePaymentMatch +
    extendedWeights.rating * scoreRating) / totalWeightSum
  )

  // Add standard caveats
  caveats.push(
    locale === "ar"
      ? "الأسعار المعروضة تقديرية؛ يرجى التأكد من الرسوم النهائية مع المزود"
      : "Pricing shown is an estimate; confirm final MDR and fees with provider",
  )

  // Check data freshness
  const lastVerified = provider.last_verified_at
  let dataFreshness = locale === "ar" ? "محدث" : "Up to date"
  if (lastVerified) {
    const daysSinceVerified = Math.floor((Date.now() - new Date(lastVerified).getTime()) / (1000 * 60 * 60 * 24))
    if (daysSinceVerified > 90) {
      dataFreshness = locale === "ar" ? `آخر تحقق: ${daysSinceVerified} يوم` : `Last verified: ${daysSinceVerified} days ago`
      caveats.push(
        locale === "ar"
          ? "البيانات قد تكون قديمة؛ يرجى التحقق من المزود"
          : "Data may be outdated; please verify with provider"
      )
    }
  }

  return {
    score_total: scoreTotal,
    score_cost: scoreCost,
    score_fit: scoreFit,
    score_ops: scoreOps,
    score_risk: scoreRisk,
    score_onboarding: scoreOnboarding,
    score_settlement: scoreSettlement,
    score_integration: scoreIntegration,
    score_payment_match: scorePaymentMatch,
    score_rating: scoreRating,
    reasons,
    caveats,
    disqualified,
    disqualifyReason,
    data_freshness: dataFreshness,
  }
}

// Extended scoring with new weights array format
export function calculateScoreExtended(
  provider: ProviderWithRelations,
  formData: WizardFormData,
  providerCost: number,
  minCostOverall: number,
  weights: ScoringWeight[],
  locale: "ar" | "en" = "ar",
): ScoringResult {
  const parsedWeights = parseWeights(weights)
  
  // Convert to legacy format for backward compatibility
  const legacyWeights: ScoringWeights = {
    id: "",
    cost_weight: parsedWeights.cost / 100,
    fit_weight: parsedWeights.fit / 100,
    ops_weight: parsedWeights.ops / 100,
    risk_weight: parsedWeights.risk / 100,
    created_at: "",
    updated_at: "",
  }
  
  return calculateScore(provider, formData, providerCost, minCostOverall, legacyWeights, locale)
}

// Helper: Create disqualified result
function createDisqualifiedResult(reason: string | undefined, disqualified: boolean): ScoringResult {
  return {
    score_total: 0,
    score_cost: 0,
    score_fit: 0,
    score_ops: 0,
    score_risk: 0,
    reasons: [],
    caveats: [],
    disqualified,
    disqualifyReason: reason,
  }
}

// Helper: Calculate platform integration score
function calculatePlatformScore(
  integrations: ProviderIntegration[],
  formData: WizardFormData,
  locale: "ar" | "en",
  reasons: string[]
): { points: number; score: number } {
  let points = 0
  const maxPoints = 20

  // Check specific platform needs
  if (formData.needs.plugins_shopify) {
    const hasShopify = integrations.some(i => i.platform === "shopify" && i.is_active)
    if (hasShopify) {
      points += 5
      reasons.push(locale === "ar" ? "يتضمن إضافة Shopify" : "Includes Shopify plugin")
    }
  } else {
    points += 5
  }

  if (formData.needs.plugins_woocommerce) {
    const hasWoo = integrations.some(i => i.platform === "woocommerce" && i.is_active)
    if (hasWoo) {
      points += 5
      reasons.push(locale === "ar" ? "يتضمن إضافة WooCommerce" : "Includes WooCommerce plugin")
    }
  } else {
    points += 5
  }

  if (formData.needs.plugins_salla) {
    const hasSalla = integrations.some(i => i.platform === "salla" && i.is_active)
    if (hasSalla) {
      points += 5
      reasons.push(locale === "ar" ? "يتضمن تكامل سلة" : "Includes Salla integration")
    }
  } else {
    points += 5
  }

  if (formData.needs.plugins_zid) {
    const hasZid = integrations.some(i => i.platform === "zid" && i.is_active)
    if (hasZid) {
      points += 5
      reasons.push(locale === "ar" ? "يتضمن تكامل زد" : "Includes Zid integration")
    }
  } else {
    points += 5
  }

  // Check specific platform from wizard
  if (formData.platform) {
    const hasPlatform = integrations.some(i => i.platform === formData.platform && i.is_active)
    if (hasPlatform) {
      points = maxPoints // Full points if specific platform is supported
    } else {
      points = Math.round(points * 0.5) // Half points if not
    }
  }

  const score = Math.round((points / maxPoints) * 100)
  return { points, score }
}

// Helper: Calculate payment methods match score
function calculatePaymentMethodsMatch(
  supportedMethods: (string | undefined)[],
  walletMethods: string[],
  paymentMix: Record<string, number>,
  needs: WizardFormData["needs"]
): number {
  let totalWeight = 0
  let matchedWeight = 0

  for (const [method, percent] of Object.entries(paymentMix)) {
    if (percent <= 0) continue
    
    totalWeight += percent
    
    const methodMap: Record<string, string[]> = {
      mada: ["mada"],
      visa_mc: ["visa_mc", "visa", "mastercard"],
      apple_pay: ["apple_pay"],
      google_pay: ["google_pay"],
      stc_pay: ["stc_pay"],
      tabby: ["tabby"],
      tamara: ["tamara"],
    }
    
    const methodCodes = methodMap[method] || [method]
    const isSupported = methodCodes.some(code => 
      supportedMethods.includes(code) || walletMethods.includes(code)
    )
    
    if (isSupported) {
      matchedWeight += percent
    }
  }

  return totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 100) : 100
}

// Helper: Calculate rating score from reviews
function calculateRatingScore(reviews: ProviderReview[]): number {
  if (!reviews || reviews.length === 0) return 50 // Default score

  let totalScore = 0
  let totalWeight = 0

  for (const review of reviews) {
    if (review.rating_avg === null) continue

    // Weight by rating count (more reviews = more weight)
    const weight = Math.log10(Math.max(10, review.rating_count))
    
    // Normalize rating to 0-100 scale
    const normalizedRating = (review.rating_avg / review.rating_max) * 100
    
    totalScore += normalizedRating * weight
    totalWeight += weight
  }

  return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 50
}
