import type { SupabaseClient } from "@supabase/supabase-js"
import type { WizardFormData, WizardRun, ProviderWithRelations, ScoringWeights, CostBreakdown, ScoringWeight, Provider } from "@/lib/types"
import { calculatePricing, calculatePricingExtended } from "./pricing-engine"
import { calculateScore, calculateScoreExtended } from "./scoring-engine"
import { getAllMockProvidersWithRelations, mockScoringWeights, mockProviderFees, mockProviderIntegrations, mockProviderReviews, mockProviderWallets, mockProviderBnpl } from "@/lib/mock-data"

interface RecommendationResult {
  provider_id: string
  provider_name_ar?: string
  provider_name_en?: string
  provider_slug?: string
  provider_logo?: string
  expected_cost_min: number
  expected_cost_max: number
  breakdown: CostBreakdown[]
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
  data_freshness?: string
  provider?: Provider
}

// Mock version for local development
export function calculateRecommendationsMock(
  wizardRun: WizardRun,
  formData: WizardFormData,
): RecommendationResult[] {
  const providers = getAllMockProvidersWithRelations()

  if (!providers || providers.length === 0) {
    return []
  }

  const weights = mockScoringWeights

  // Calculate pricing for all providers
  const providerResults: Array<{
    provider: ProviderWithRelations
    pricing: ReturnType<typeof calculatePricing>
  }> = []

  for (const provider of providers) {
    const activePricingRules = provider.pricing_rules?.filter((r) => r.is_active) || []

    if (activePricingRules.length === 0) continue

    const pricing = calculatePricing(activePricingRules, formData)
    providerResults.push({ provider, pricing })
  }

  if (providerResults.length === 0) {
    return []
  }

  // Find minimum cost for normalization
  const minCostOverall = Math.min(...providerResults.map((r) => (r.pricing.totalCostMin + r.pricing.totalCostMax) / 2))

  // Calculate scores for all providers
  const recommendations: RecommendationResult[] = []

  for (const { provider, pricing } of providerResults) {
    const midCost = (pricing.totalCostMin + pricing.totalCostMax) / 2

    const scoring = calculateScore(provider, formData, midCost, minCostOverall, weights, formData.locale)

    if (scoring.disqualified) continue

    recommendations.push({
      provider_id: provider.id,
      provider_name_ar: provider.name_ar,
      provider_name_en: provider.name_en,
      provider_slug: provider.slug,
      provider_logo: provider.logo_path || undefined,
      expected_cost_min: pricing.totalCostMin,
      expected_cost_max: pricing.totalCostMax,
      breakdown: pricing.breakdown,
      score_total: scoring.score_total,
      score_cost: scoring.score_cost,
      score_fit: scoring.score_fit,
      score_ops: scoring.score_ops,
      score_risk: scoring.score_risk,
      reasons: scoring.reasons,
      caveats: scoring.caveats,
      provider,
    })
  }

  // Sort by total score descending and return ALL qualified providers
  recommendations.sort((a, b) => b.score_total - a.score_total)

  return recommendations
}

// Extended Mock version with new data structures
export function calculateRecommendationsMockExtended(
  formData: WizardFormData,
): RecommendationResult[] {
  const providers = getAllMockProvidersWithRelations()

  if (!providers || providers.length === 0) {
    return []
  }

  const weights = mockScoringWeights

  // Calculate pricing for all providers
  const providerResults: Array<{
    provider: ProviderWithRelations
    pricing: ReturnType<typeof calculatePricing>
  }> = []

  for (const provider of providers) {
    // Get provider fees
    const providerFees = mockProviderFees.filter(f => f.provider_id === provider.id && f.is_active)
    
    // Get integrations, reviews, wallets, bnpl for enhanced provider
    const integrations = mockProviderIntegrations.filter(i => i.provider_id === provider.id)
    const reviews = mockProviderReviews.filter(r => r.provider_id === provider.id)
    const wallets = mockProviderWallets.filter(w => w.provider_id === provider.id)
    const bnpl = mockProviderBnpl.filter(b => b.provider_id === provider.id)

    // Enhance provider with extended data
    const enhancedProvider: ProviderWithRelations = {
      ...provider,
      provider_integrations: integrations,
      provider_reviews: reviews,
      provider_wallets: wallets,
      provider_bnpl: bnpl,
    }

    // Calculate pricing
    let pricing
    if (providerFees.length > 0) {
      pricing = calculatePricingExtended(providerFees, formData)
    } else {
      const activePricingRules = provider.pricing_rules?.filter((r) => r.is_active) || []
      if (activePricingRules.length === 0) continue
      pricing = calculatePricing(activePricingRules, formData)
    }

    providerResults.push({ provider: enhancedProvider, pricing })
  }

  if (providerResults.length === 0) {
    return []
  }

  // Find minimum cost for normalization
  const minCostOverall = Math.min(...providerResults.map((r) => (r.pricing.totalCostMin + r.pricing.totalCostMax) / 2))

  // Calculate scores for all providers
  const recommendations: RecommendationResult[] = []

  for (const { provider, pricing } of providerResults) {
    const midCost = (pricing.totalCostMin + pricing.totalCostMax) / 2

    const scoring = calculateScore(provider, formData, midCost, minCostOverall, weights, formData.locale)

    if (scoring.disqualified) continue

    recommendations.push({
      provider_id: provider.id,
      provider_name_ar: provider.name_ar,
      provider_name_en: provider.name_en,
      provider_slug: provider.slug,
      provider_logo: provider.logo_path || undefined,
      expected_cost_min: pricing.totalCostMin,
      expected_cost_max: pricing.totalCostMax,
      breakdown: pricing.breakdown,
      score_total: scoring.score_total,
      score_cost: scoring.score_cost,
      score_fit: scoring.score_fit,
      score_ops: scoring.score_ops,
      score_risk: scoring.score_risk,
      score_onboarding: scoring.score_onboarding,
      score_settlement: scoring.score_settlement,
      score_integration: scoring.score_integration,
      score_payment_match: scoring.score_payment_match,
      score_rating: scoring.score_rating,
      reasons: scoring.reasons,
      caveats: scoring.caveats,
      data_freshness: scoring.data_freshness,
      provider,
    })
  }

  // Sort by total score descending and return ALL qualified providers
  recommendations.sort((a, b) => b.score_total - a.score_total)

  return recommendations
}

export async function calculateRecommendations(
  supabase: SupabaseClient,
  wizardRun: WizardRun,
  formData: WizardFormData,
): Promise<RecommendationResult[]> {
  // Fetch all active providers with their relations
  const { data: providers } = await supabase
    .from("providers")
    .select(`
      *,
      provider_payment_methods (
        *,
        payment_method:payment_methods (*)
      ),
      pricing_rules (
        *,
        payment_method:payment_methods (*)
      ),
      provider_capabilities (
        *,
        capability:capabilities (*)
      ),
      provider_sector_rules (
        *,
        sector:sectors (*)
      ),
      ops_metrics (*)
    `)
    .eq("is_active", true)

  if (!providers || providers.length === 0) {
    return []
  }

  // Fetch scoring weights
  const { data: weightsData } = await supabase.from("scoring_weights").select("*").single()

  const weights: ScoringWeights = weightsData || {
    id: "",
    cost_weight: 0.5,
    fit_weight: 0.25,
    ops_weight: 0.15,
    risk_weight: 0.1,
    created_at: "",
    updated_at: "",
  }

  // Calculate pricing for all providers
  const providerResults: Array<{
    provider: ProviderWithRelations
    pricing: ReturnType<typeof calculatePricing>
  }> = []

  for (const provider of providers as ProviderWithRelations[]) {
    const activePricingRules = provider.pricing_rules?.filter((r) => r.is_active) || []

    if (activePricingRules.length === 0) continue

    const pricing = calculatePricing(activePricingRules, formData)
    providerResults.push({ provider, pricing })
  }

  if (providerResults.length === 0) {
    return []
  }

  // Find minimum cost for normalization
  const minCostOverall = Math.min(...providerResults.map((r) => (r.pricing.totalCostMin + r.pricing.totalCostMax) / 2))

  // Calculate scores for all providers
  const recommendations: RecommendationResult[] = []

  for (const { provider, pricing } of providerResults) {
    const midCost = (pricing.totalCostMin + pricing.totalCostMax) / 2

    const scoring = calculateScore(provider, formData, midCost, minCostOverall, weights, formData.locale)

    if (scoring.disqualified) continue

    recommendations.push({
      provider_id: provider.id,
      provider_name_ar: provider.name_ar,
      provider_name_en: provider.name_en,
      provider_slug: provider.slug,
      provider_logo: provider.logo_path || undefined,
      expected_cost_min: pricing.totalCostMin,
      expected_cost_max: pricing.totalCostMax,
      breakdown: pricing.breakdown,
      score_total: scoring.score_total,
      score_cost: scoring.score_cost,
      score_fit: scoring.score_fit,
      score_ops: scoring.score_ops,
      score_risk: scoring.score_risk,
      reasons: scoring.reasons,
      caveats: scoring.caveats,
    })
  }

  // Sort by total score descending and return ALL qualified providers
  recommendations.sort((a, b) => b.score_total - a.score_total)

  return recommendations
}

// Extended version using new data structures
export async function calculateRecommendationsExtended(
  supabase: SupabaseClient,
  formData: WizardFormData,
): Promise<RecommendationResult[]> {
  // Fetch all active providers with extended relations
  const { data: providers } = await supabase
    .from("providers")
    .select(`
      *,
      provider_payment_methods (
        *,
        payment_methods (*)
      ),
      pricing_rules (
        *,
        payment_methods (*)
      ),
      provider_fees (
        *,
        payment_methods (*)
      ),
      provider_capabilities (
        *,
        capabilities (*)
      ),
      provider_sector_rules (
        *,
        sectors (*)
      ),
      provider_integrations (*),
      provider_currencies (*),
      provider_reviews (*),
      provider_wallets (*),
      provider_bnpl (*),
      ops_metrics (*)
    `)
    .eq("is_active", true)

  if (!providers || providers.length === 0) {
    return []
  }

  // Fetch scoring weights (new format)
  const { data: weightsArray } = await supabase
    .from("scoring_weights")
    .select("*")
    .eq("is_active", true)

  // Convert to legacy format if needed
  let weights: ScoringWeights
  if (weightsArray && weightsArray.length > 0 && weightsArray[0].factor) {
    // New format with factor column
    const weightMap: Record<string, number> = {}
    for (const w of weightsArray as ScoringWeight[]) {
      weightMap[w.factor] = w.weight
    }
    weights = {
      id: "",
      cost_weight: (weightMap.cost || 30) / 100,
      fit_weight: (weightMap.fit || 20) / 100,
      ops_weight: (weightMap.ops || 15) / 100,
      risk_weight: (weightMap.risk || 15) / 100,
      created_at: "",
      updated_at: "",
    }
  } else {
    weights = {
      id: "",
      cost_weight: 0.30,
      fit_weight: 0.20,
      ops_weight: 0.15,
      risk_weight: 0.15,
      created_at: "",
      updated_at: "",
    }
  }

  // Calculate pricing for all providers
  const providerResults: Array<{
    provider: ProviderWithRelations
    pricing: ReturnType<typeof calculatePricing>
  }> = []

  for (const provider of providers as ProviderWithRelations[]) {
    // Use provider_fees if available, otherwise fall back to pricing_rules
    const providerFees = provider.provider_fees?.filter((f) => f.is_active) || []
    const activePricingRules = provider.pricing_rules?.filter((r) => r.is_active) || []

    if (providerFees.length === 0 && activePricingRules.length === 0) continue

    let pricing
    if (providerFees.length > 0) {
      pricing = calculatePricingExtended(providerFees, formData)
    } else {
      pricing = calculatePricing(activePricingRules, formData)
    }

    providerResults.push({ provider, pricing })
  }

  if (providerResults.length === 0) {
    return []
  }

  // Find minimum cost for normalization
  const minCostOverall = Math.min(...providerResults.map((r) => (r.pricing.totalCostMin + r.pricing.totalCostMax) / 2))

  // Calculate scores for all providers
  const recommendations: RecommendationResult[] = []

  for (const { provider, pricing } of providerResults) {
    const midCost = (pricing.totalCostMin + pricing.totalCostMax) / 2

    const scoring = calculateScore(provider, formData, midCost, minCostOverall, weights, formData.locale)

    if (scoring.disqualified) continue

    recommendations.push({
      provider_id: provider.id,
      provider_name_ar: provider.name_ar,
      provider_name_en: provider.name_en,
      provider_slug: provider.slug,
      provider_logo: provider.logo_path || undefined,
      expected_cost_min: pricing.totalCostMin,
      expected_cost_max: pricing.totalCostMax,
      breakdown: pricing.breakdown,
      score_total: scoring.score_total,
      score_cost: scoring.score_cost,
      score_fit: scoring.score_fit,
      score_ops: scoring.score_ops,
      score_risk: scoring.score_risk,
      score_onboarding: scoring.score_onboarding,
      score_settlement: scoring.score_settlement,
      score_integration: scoring.score_integration,
      score_payment_match: scoring.score_payment_match,
      score_rating: scoring.score_rating,
      reasons: scoring.reasons,
      caveats: scoring.caveats,
      data_freshness: scoring.data_freshness,
      provider,
    })
  }

  // Sort by total score descending and return ALL qualified providers
  recommendations.sort((a, b) => b.score_total - a.score_total)

  return recommendations
}

// Generate recommendation explanation
export function generateRecommendationExplanation(
  recommendation: RecommendationResult,
  locale: "ar" | "en" = "ar"
): string {
  const reasons = recommendation.reasons
  const score = recommendation.score_total

  if (locale === "ar") {
    if (score >= 80) {
      return `${recommendation.provider_name_ar} هو الخيار الأمثل لنشاطك. ${reasons.slice(0, 3).join("، ")}.`
    } else if (score >= 60) {
      return `${recommendation.provider_name_ar} خيار جيد مع بعض التحفظات. ${reasons.slice(0, 2).join("، ")}.`
    } else {
      return `${recommendation.provider_name_ar} خيار متاح لكن قد تحتاج لمراجعة البدائل.`
    }
  } else {
    if (score >= 80) {
      return `${recommendation.provider_name_en} is the best choice for your business. ${reasons.slice(0, 3).join(", ")}.`
    } else if (score >= 60) {
      return `${recommendation.provider_name_en} is a good option with some considerations. ${reasons.slice(0, 2).join(", ")}.`
    } else {
      return `${recommendation.provider_name_en} is available but you may want to review alternatives.`
    }
  }
}

// Format cost range
export function formatCostRange(min: number, max: number, locale: "ar" | "en" = "ar"): string {
  const formatter = new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-SA", {
    style: "currency",
    currency: "SAR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  if (min === max) {
    return formatter.format(min)
  }

  return `${formatter.format(min)} - ${formatter.format(max)}`
}
