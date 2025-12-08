// Database types for PayGate Optimizer
// Extended types for comprehensive provider management

export type UserRole = "admin" | "analyst" | "merchant"
export type LeadStatus = "new" | "contacted" | "qualified" | "won" | "lost"
export type Locale = "ar" | "en"
export type ProviderCategory = "payment_gateway" | "psp" | "acquirer" | "bnpl" | "aggregator" | "wallet"
export type ProviderStatus = "active" | "limited" | "paused" | "deprecated"
export type PayoutSchedule = "daily" | "weekly" | "biweekly" | "monthly" | "custom"
export type PaymentMethodCategory = "card" | "debit" | "wallet" | "bank" | "bnpl" | "other"
export type IntegrationPlatform = "shopify" | "woocommerce" | "magento" | "opencart" | "prestashop" | "salla" | "zid" | "expandcart" | "youcan" | "wordpress" | "custom_api" | "hosted_checkout" | "mobile_sdk" | "pos"
export type IntegrationType = "plugin" | "api" | "hosted" | "redirect" | "sdk" | "iframe"
export type WalletType = "apple_pay" | "google_pay" | "samsung_pay" | "stc_pay" | "urpay" | "mobily_pay" | "paypal" | "other"
export type BnplProvider = "tabby" | "tamara" | "postpay" | "spotii" | "cashew" | "splitit" | "other"
export type SourceType = "official_website" | "official_docs" | "official_pricing" | "review_platform" | "user_report" | "api_response" | "support_confirmation"
export type ReviewPlatform = "trustpilot" | "g2" | "capterra" | "google_play" | "app_store" | "twitter" | "reddit" | "internal" | "other"
export type SetupDifficulty = "easy" | "medium" | "hard"
export type ConfidenceLevel = "high" | "medium" | "low"

export interface Profile {
  id: string
  name: string | null
  email: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Sector {
  id: string
  code: string
  name_ar: string
  name_en: string
  created_at: string
}

export interface PaymentMethod {
  id: string
  code: string
  name_ar: string
  name_en: string
  category?: PaymentMethodCategory
  icon_name?: string
  display_order?: number
  is_active: boolean
  created_at: string
}

export interface Capability {
  id: string
  code: string
  name_ar: string
  name_en: string
  created_at: string
}

// Extended Provider interface
export interface Provider {
  id: string
  slug: string
  name_ar: string
  name_en: string
  website_url: string | null
  logo_path: string | null
  description_ar?: string | null
  description_en?: string | null
  category?: ProviderCategory
  countries_served?: string[]
  license_info?: Record<string, string>
  
  // Fees
  setup_fee?: number
  monthly_fee?: number
  
  // Operations
  activation_time_days_min: number
  activation_time_days_max: number
  settlement_days_min: number
  settlement_days_max: number
  payout_schedule?: PayoutSchedule
  payout_min_amount?: number
  
  // Support
  support_channels: string[]
  support_hours?: string
  support_sla?: string
  docs_url?: string
  terms_url?: string
  pricing_url?: string
  
  // Currencies
  supported_currencies?: string[]
  multi_currency_supported?: boolean
  
  // Risk
  risk_notes?: string | null
  rolling_reserve_percent?: number
  rolling_reserve_days?: number
  
  // Pros/Cons
  pros_ar?: string[]
  pros_en?: string[]
  cons_ar?: string[]
  cons_en?: string[]
  
  // Meta
  notes_ar: string | null
  notes_en: string | null
  status?: ProviderStatus
  is_active: boolean
  last_verified_at?: string
  created_at: string
  updated_at: string
}

export interface ProviderPaymentMethod {
  id: string
  provider_id: string
  payment_method_id: string
  enabled: boolean
  supports_recurring: boolean
  supports_tokenization: boolean
  supports_refunds: boolean
  created_at: string
  payment_method?: PaymentMethod
}

export interface PricingRule {
  id: string
  provider_id: string
  payment_method_id: string
  currency: string
  fee_percent: number
  fee_fixed: number
  monthly_fee: number
  setup_fee: number
  refund_fee_fixed: number
  chargeback_fee_fixed: number
  minimum_fee_per_txn: number | null
  maximum_fee_per_txn: number | null
  notes_ar: string | null
  notes_en: string | null
  effective_from: string | null
  effective_to: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  payment_method?: PaymentMethod
}

// Extended Provider Fee (Normalized)
export interface ProviderFee {
  id: string
  provider_id: string
  payment_method_id: string | null
  
  fee_percent: number
  fee_fixed: number
  monthly_fee: number
  setup_fee: number
  
  refund_fee_fixed: number
  refund_fee_percent: number
  chargeback_fee_fixed: number
  
  cross_border_fee_percent: number
  currency_conversion_fee_percent: number
  payout_fee_fixed: number
  
  minimum_fee_per_txn: number | null
  maximum_fee_per_txn: number | null
  minimum_txn_amount: number | null
  maximum_txn_amount: number | null
  
  volume_tier: string | null
  currency: string
  
  notes_ar: string | null
  notes_en: string | null
  is_estimated: boolean
  source_url: string | null
  effective_from: string | null
  effective_to: string | null
  is_active: boolean
  last_verified_at: string
  created_at: string
  updated_at: string
  
  payment_method?: PaymentMethod
}

export interface ProviderIntegration {
  id: string
  provider_id: string
  platform: IntegrationPlatform
  integration_type: IntegrationType
  is_official: boolean
  official_url: string | null
  docs_url: string | null
  setup_difficulty: SetupDifficulty
  features_supported: string[]
  notes_ar: string | null
  notes_en: string | null
  is_active: boolean
  last_verified_at: string
  created_at: string
}

export interface ProviderCurrency {
  id: string
  provider_id: string
  currency_code: string
  is_settlement_supported: boolean
  is_pricing_supported: boolean
  conversion_fee_percent: number
  notes: string | null
  created_at: string
}

export interface ProviderSource {
  id: string
  entity_type: "provider" | "fee" | "integration" | "review" | "capability" | "currency"
  entity_id: string
  source_type: SourceType
  source_url: string
  source_name: string | null
  extracted_fields: Record<string, string>
  screenshot_path: string | null
  is_estimated: boolean
  confidence_level: ConfidenceLevel
  notes: string | null
  verified_by: string | null
  last_verified_at: string
  created_at: string
}

export interface ProviderReview {
  id: string
  provider_id: string
  platform: ReviewPlatform
  rating_avg: number | null
  rating_count: number
  rating_max: number
  highlights_positive: string[]
  highlights_negative: string[]
  sample_reviews: { text: string; rating: number; date: string }[]
  source_url: string
  last_verified_at: string
  created_at: string
  updated_at: string
}

export interface ProviderWallet {
  id: string
  provider_id: string
  wallet_type: WalletType
  is_supported: boolean
  fee_percent: number | null
  fee_fixed: number | null
  requirements: string | null
  notes_ar: string | null
  notes_en: string | null
  created_at: string
}

export interface ProviderBnpl {
  id: string
  provider_id: string
  bnpl_provider: BnplProvider
  is_integrated: boolean
  merchant_fee_percent: number | null
  merchant_fee_fixed: number
  max_installments: number
  min_order_amount: number | null
  max_order_amount: number | null
  settlement_days: number | null
  notes_ar: string | null
  notes_en: string | null
  integration_url: string | null
  created_at: string
}

export interface AuditLog {
  id: string
  table_name: string
  record_id: string
  action: "INSERT" | "UPDATE" | "DELETE"
  old_values: Record<string, unknown> | null
  new_values: Record<string, unknown> | null
  changed_fields: string[] | null
  user_id: string | null
  user_email: string | null
  ip_address: string | null
  created_at: string
}

export interface ProviderCapability {
  provider_id: string
  capability_id: string
  capability?: Capability
}

export interface ProviderSectorRule {
  id: string
  provider_id: string
  sector_id: string
  is_supported: boolean
  notes: string | null
  created_at: string
  sector?: Sector
}

export interface OpsMetrics {
  id: string
  provider_id: string
  onboarding_score: number
  support_score: number
  docs_score: number
  created_at: string
  updated_at: string
}

export interface ScoringWeight {
  id: string
  factor: string
  weight: number
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

// Legacy interface for backward compatibility
export interface ScoringWeights {
  id: string
  cost_weight: number
  fit_weight: number
  ops_weight: number
  risk_weight: number
  created_at: string
  updated_at: string
}

export interface PaymentMix {
  mada: number
  visa_mc: number
  apple_pay: number
  google_pay: number
  stc_pay?: number
  tabby?: number
  tamara?: number
  other: number
}

export interface WizardNeeds {
  recurring: boolean
  tokenization: boolean
  multi_currency: boolean
  international_customers?: boolean
  plugins_shopify: boolean
  plugins_woocommerce: boolean
  plugins_salla?: boolean
  plugins_zid?: boolean
  fast_settlement: boolean
  apple_pay: boolean
  google_pay: boolean
  bnpl_support?: boolean
}

export interface WizardRun {
  id: string
  locale: Locale
  ip_hash: string | null
  sector_id: string | null
  business_type: string | null
  monthly_gmv: number | null
  tx_count: number | null
  avg_ticket: number | null
  refunds_rate: number
  chargebacks_rate: number
  payment_mix: PaymentMix
  needs: WizardNeeds
  created_at: string
  sector?: Sector
}

export interface CostBreakdown {
  payment_method: string
  payment_method_name_ar?: string
  payment_method_name_en?: string
  tx_count: number
  volume: number
  fee_amount: number
  fee_percent?: number
  fee_fixed?: number
}

export interface Recommendation {
  id: string
  wizard_run_id: string
  provider_id: string
  rank: number
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
  created_at: string
  provider?: Provider
}

export interface Lead {
  id: string
  wizard_run_id: string | null
  name: string
  phone: string | null
  email: string | null
  company_name: string | null
  city: string | null
  preferred_contact: string
  notes: string | null
  status: LeadStatus
  owner_user_id: string | null
  created_at: string
  updated_at: string
  wizard_run?: WizardRun
  owner?: Profile
}

// Extended Wizard form data
export interface WizardFormData {
  // Step 1 - Sector
  sector_id: string
  business_type: string
  
  // Step 2 - Volume
  monthly_gmv: number
  tx_count: number
  
  // Step 3 - Average Ticket
  avg_ticket: number
  
  // Step 4 - Payment Mix
  payment_mix: PaymentMix
  
  // Step 5 - Rates
  refunds_rate: number
  chargebacks_rate: number
  
  // Step 6 - Needs
  needs: WizardNeeds
  
  // Step 7 - Platform (Optional)
  platform?: IntegrationPlatform
  
  // Step 8 - Contact Info (for WhatsApp delivery)
  contact: WizardContactData
  
  // Meta
  locale: Locale
}

// Contact data for WhatsApp delivery
export interface WizardContactData {
  fullName: string
  companyName: string
  sector: string
  phone: {
    raw: string
    normalized: string
    countryCode: string
    isValid: boolean
  }
}

// Provider with all relations (Extended)
export interface ProviderWithRelations extends Provider {
  provider_payment_methods: ProviderPaymentMethod[]
  pricing_rules: PricingRule[]
  provider_capabilities: ProviderCapability[]
  provider_sector_rules: ProviderSectorRule[]
  ops_metrics: OpsMetrics | null
  
  // Extended relations
  provider_fees?: ProviderFee[]
  provider_integrations?: ProviderIntegration[]
  provider_currencies?: ProviderCurrency[]
  provider_sources?: ProviderSource[]
  provider_reviews?: ProviderReview[]
  provider_wallets?: ProviderWallet[]
  provider_bnpl?: ProviderBnpl[]
}

// API Response types
export interface ProviderListResponse {
  providers: Provider[]
  total: number
  page: number
  limit: number
}

export interface ProviderDetailResponse {
  provider: ProviderWithRelations
  sources: ProviderSource[]
}

export interface CompareRequest {
  sector_id: string
  monthly_gmv: number
  tx_count: number
  avg_ticket: number
  payment_mix: PaymentMix
  needs: WizardNeeds
  platform?: IntegrationPlatform
}

export interface CompareResponse {
  recommendations: Recommendation[]
  wizard_run_id: string
}

// Data Quality types
export interface DataQualityIssue {
  provider_id: string
  provider_name: string
  issue_type: "no_pricing_url" | "stale_data" | "estimated_data" | "missing_fees" | "missing_integrations"
  description: string
  last_verified_at: string | null
  severity: "high" | "medium" | "low"
}

// Import/Export types
export interface ProviderImportRow {
  provider_slug: string
  name_ar: string
  name_en: string
  website_url: string
  setup_fee: number
  monthly_fee: number
  payment_method_code: string
  fee_percent: number
  fee_fixed: number
  activation_min: number
  activation_max: number
  settlement_min: number
  settlement_max: number
  currencies: string
  integrations: string
  rating_avg: number
  rating_count: number
  rating_source: string
  rating_url: string
  official_pricing_url: string
  docs_url: string
  terms_url: string
  last_verified_at: string
}

export interface ImportResult {
  success: boolean
  imported: number
  skipped: number
  errors: { row: number; error: string }[]
}

// PDF Export types
export interface PDFExportData {
  wizard_run: WizardRun
  recommendations: Recommendation[]
  providers: Provider[]
  generated_at: string
  locale: Locale
}
