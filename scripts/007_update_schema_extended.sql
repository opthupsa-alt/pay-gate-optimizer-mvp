-- PayGate Optimizer - Extended Schema for Complete Provider Management
-- This migration adds comprehensive provider data tracking with sources

-- ============================================
-- 1. UPDATE providers TABLE
-- ============================================

-- Add new columns to providers table
ALTER TABLE providers ADD COLUMN IF NOT EXISTS description_ar TEXT;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS description_en TEXT;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'payment_gateway' 
  CHECK (category IN ('payment_gateway', 'psp', 'acquirer', 'bnpl', 'aggregator', 'wallet'));
ALTER TABLE providers ADD COLUMN IF NOT EXISTS countries_served JSONB DEFAULT '["SA"]'::jsonb;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS license_info JSONB DEFAULT '{}'::jsonb;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS support_hours TEXT DEFAULT '9-5 Sun-Thu';
ALTER TABLE providers ADD COLUMN IF NOT EXISTS support_sla TEXT;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS docs_url TEXT;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS terms_url TEXT;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS pricing_url TEXT;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS supported_currencies JSONB DEFAULT '["SAR"]'::jsonb;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS multi_currency_supported BOOLEAN DEFAULT false;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS payout_schedule TEXT DEFAULT 'weekly' 
  CHECK (payout_schedule IN ('daily', 'weekly', 'biweekly', 'monthly', 'custom'));
ALTER TABLE providers ADD COLUMN IF NOT EXISTS payout_min_amount DECIMAL(10,2) DEFAULT 0;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS risk_notes TEXT;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS rolling_reserve_percent DECIMAL(5,2);
ALTER TABLE providers ADD COLUMN IF NOT EXISTS rolling_reserve_days INTEGER;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS pros_ar JSONB DEFAULT '[]'::jsonb;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS pros_en JSONB DEFAULT '[]'::jsonb;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS cons_ar JSONB DEFAULT '[]'::jsonb;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS cons_en JSONB DEFAULT '[]'::jsonb;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE providers ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' 
  CHECK (status IN ('active', 'limited', 'paused', 'deprecated'));

-- ============================================
-- 2. CREATE provider_fees TABLE (Normalized)
-- ============================================

CREATE TABLE IF NOT EXISTS provider_fees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  payment_method_id UUID REFERENCES payment_methods(id) ON DELETE SET NULL,
  
  -- Fees
  fee_percent DECIMAL(6,4) DEFAULT 0,
  fee_fixed DECIMAL(10,2) DEFAULT 0,
  monthly_fee DECIMAL(10,2) DEFAULT 0,
  setup_fee DECIMAL(10,2) DEFAULT 0,
  
  -- Refund & Chargeback
  refund_fee_fixed DECIMAL(10,2) DEFAULT 0,
  refund_fee_percent DECIMAL(5,4) DEFAULT 0,
  chargeback_fee_fixed DECIMAL(10,2) DEFAULT 0,
  
  -- International
  cross_border_fee_percent DECIMAL(5,4) DEFAULT 0,
  currency_conversion_fee_percent DECIMAL(5,4) DEFAULT 0,
  payout_fee_fixed DECIMAL(10,2) DEFAULT 0,
  
  -- Limits
  minimum_fee_per_txn DECIMAL(10,2),
  maximum_fee_per_txn DECIMAL(10,2),
  minimum_txn_amount DECIMAL(10,2),
  maximum_txn_amount DECIMAL(15,2),
  
  -- Conditions
  volume_tier TEXT, -- e.g., '0-50000', '50001-200000', '200001+'
  currency TEXT DEFAULT 'SAR',
  
  -- Metadata
  notes_ar TEXT,
  notes_en TEXT,
  is_estimated BOOLEAN DEFAULT false,
  source_url TEXT,
  effective_from DATE,
  effective_to DATE,
  is_active BOOLEAN DEFAULT true,
  last_verified_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_provider_fees_provider ON provider_fees(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_fees_payment_method ON provider_fees(payment_method_id);

-- ============================================
-- 3. CREATE provider_integrations TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS provider_integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  
  platform TEXT NOT NULL CHECK (platform IN (
    'shopify', 'woocommerce', 'magento', 'opencart', 'prestashop',
    'salla', 'zid', 'expandcart', 'youcan', 'wordpress',
    'custom_api', 'hosted_checkout', 'mobile_sdk', 'pos'
  )),
  
  integration_type TEXT DEFAULT 'plugin' CHECK (integration_type IN (
    'plugin', 'api', 'hosted', 'redirect', 'sdk', 'iframe'
  )),
  
  is_official BOOLEAN DEFAULT true,
  official_url TEXT,
  docs_url TEXT,
  setup_difficulty TEXT DEFAULT 'easy' CHECK (setup_difficulty IN ('easy', 'medium', 'hard')),
  
  features_supported JSONB DEFAULT '[]'::jsonb, -- ['recurring', 'refunds', 'tokenization']
  notes_ar TEXT,
  notes_en TEXT,
  
  is_active BOOLEAN DEFAULT true,
  last_verified_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_provider_integrations_provider ON provider_integrations(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_integrations_platform ON provider_integrations(platform);

-- ============================================
-- 4. CREATE provider_currencies TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS provider_currencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  currency_code TEXT NOT NULL,
  
  is_settlement_supported BOOLEAN DEFAULT false,
  is_pricing_supported BOOLEAN DEFAULT true,
  conversion_fee_percent DECIMAL(5,4) DEFAULT 0,
  
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(provider_id, currency_code)
);

CREATE INDEX IF NOT EXISTS idx_provider_currencies_provider ON provider_currencies(provider_id);

-- ============================================
-- 5. CREATE provider_sources TABLE (Data Provenance)
-- ============================================

CREATE TABLE IF NOT EXISTS provider_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  entity_type TEXT NOT NULL CHECK (entity_type IN (
    'provider', 'fee', 'integration', 'review', 'capability', 'currency'
  )),
  entity_id UUID NOT NULL,
  
  source_type TEXT NOT NULL CHECK (source_type IN (
    'official_website', 'official_docs', 'official_pricing',
    'review_platform', 'user_report', 'api_response', 'support_confirmation'
  )),
  
  source_url TEXT NOT NULL,
  source_name TEXT, -- e.g., 'Moyasar Pricing Page', 'Trustpilot'
  
  extracted_fields JSONB DEFAULT '{}'::jsonb, -- What data this source proves
  screenshot_path TEXT, -- Optional screenshot for verification
  
  is_estimated BOOLEAN DEFAULT false,
  confidence_level TEXT DEFAULT 'high' CHECK (confidence_level IN ('high', 'medium', 'low')),
  
  notes TEXT,
  verified_by TEXT, -- Admin who verified
  last_verified_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_provider_sources_entity ON provider_sources(entity_type, entity_id);

-- ============================================
-- 6. CREATE provider_reviews TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS provider_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  
  platform TEXT NOT NULL CHECK (platform IN (
    'trustpilot', 'g2', 'capterra', 'google_play', 'app_store',
    'twitter', 'reddit', 'internal', 'other'
  )),
  
  rating_avg DECIMAL(3,2), -- e.g., 4.5
  rating_count INTEGER DEFAULT 0,
  rating_max DECIMAL(3,2) DEFAULT 5.0,
  
  highlights_positive JSONB DEFAULT '[]'::jsonb, -- Top positive themes
  highlights_negative JSONB DEFAULT '[]'::jsonb, -- Top negative themes
  
  sample_reviews JSONB DEFAULT '[]'::jsonb, -- [{text, rating, date}]
  
  source_url TEXT NOT NULL,
  last_verified_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(provider_id, platform)
);

CREATE INDEX IF NOT EXISTS idx_provider_reviews_provider ON provider_reviews(provider_id);

-- ============================================
-- 7. CREATE provider_wallets TABLE (for digital wallets support)
-- ============================================

CREATE TABLE IF NOT EXISTS provider_wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  
  wallet_type TEXT NOT NULL CHECK (wallet_type IN (
    'apple_pay', 'google_pay', 'samsung_pay', 'stc_pay', 
    'urpay', 'mobily_pay', 'paypal', 'other'
  )),
  
  is_supported BOOLEAN DEFAULT true,
  fee_percent DECIMAL(5,4),
  fee_fixed DECIMAL(10,2),
  
  requirements TEXT, -- Any special requirements
  notes_ar TEXT,
  notes_en TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(provider_id, wallet_type)
);

-- ============================================
-- 8. CREATE provider_bnpl TABLE (BNPL specific data)
-- ============================================

CREATE TABLE IF NOT EXISTS provider_bnpl (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  
  bnpl_provider TEXT NOT NULL CHECK (bnpl_provider IN (
    'tabby', 'tamara', 'postpay', 'spotii', 'cashew', 'splitit', 'other'
  )),
  
  is_integrated BOOLEAN DEFAULT false,
  merchant_fee_percent DECIMAL(5,4),
  merchant_fee_fixed DECIMAL(10,2) DEFAULT 0,
  
  max_installments INTEGER DEFAULT 4,
  min_order_amount DECIMAL(10,2),
  max_order_amount DECIMAL(15,2),
  
  settlement_days INTEGER,
  
  notes_ar TEXT,
  notes_en TEXT,
  integration_url TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(provider_id, bnpl_provider)
);

-- ============================================
-- 9. CREATE audit_log TABLE (For tracking changes)
-- ============================================

CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  
  old_values JSONB,
  new_values JSONB,
  changed_fields TEXT[],
  
  user_id UUID REFERENCES profiles(id),
  user_email TEXT,
  ip_address TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_table ON audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_log_record ON audit_log(record_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON audit_log(created_at);

-- ============================================
-- 10. UPDATE payment_methods TABLE
-- ============================================

ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'card'
  CHECK (category IN ('card', 'debit', 'wallet', 'bank', 'bnpl', 'other'));
ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS icon_name TEXT;
ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- ============================================
-- 11. CREATE wizard_questions TABLE (Dynamic questions)
-- ============================================

CREATE TABLE IF NOT EXISTS wizard_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  step_number INTEGER NOT NULL,
  question_key TEXT UNIQUE NOT NULL,
  
  question_ar TEXT NOT NULL,
  question_en TEXT NOT NULL,
  
  description_ar TEXT,
  description_en TEXT,
  
  input_type TEXT NOT NULL CHECK (input_type IN (
    'select', 'multi_select', 'slider', 'number', 'boolean', 'percentage_split'
  )),
  
  options JSONB, -- For select/multi_select
  validation_rules JSONB, -- {min, max, required, etc}
  
  affects_scoring JSONB DEFAULT '[]'::jsonb, -- Which scores this affects
  
  is_required BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 12. RLS POLICIES
-- ============================================

-- provider_fees RLS
ALTER TABLE provider_fees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "provider_fees_select_all" ON provider_fees FOR SELECT USING (true);
CREATE POLICY "provider_fees_admin_all" ON provider_fees FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- provider_integrations RLS
ALTER TABLE provider_integrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "provider_integrations_select_all" ON provider_integrations FOR SELECT USING (true);
CREATE POLICY "provider_integrations_admin_all" ON provider_integrations FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- provider_currencies RLS
ALTER TABLE provider_currencies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "provider_currencies_select_all" ON provider_currencies FOR SELECT USING (true);
CREATE POLICY "provider_currencies_admin_all" ON provider_currencies FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- provider_sources RLS
ALTER TABLE provider_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "provider_sources_select_all" ON provider_sources FOR SELECT USING (true);
CREATE POLICY "provider_sources_admin_all" ON provider_sources FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- provider_reviews RLS
ALTER TABLE provider_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "provider_reviews_select_all" ON provider_reviews FOR SELECT USING (true);
CREATE POLICY "provider_reviews_admin_all" ON provider_reviews FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- provider_wallets RLS
ALTER TABLE provider_wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "provider_wallets_select_all" ON provider_wallets FOR SELECT USING (true);
CREATE POLICY "provider_wallets_admin_all" ON provider_wallets FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- provider_bnpl RLS
ALTER TABLE provider_bnpl ENABLE ROW LEVEL SECURITY;
CREATE POLICY "provider_bnpl_select_all" ON provider_bnpl FOR SELECT USING (true);
CREATE POLICY "provider_bnpl_admin_all" ON provider_bnpl FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- audit_log RLS (admin only)
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audit_log_admin_only" ON audit_log FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- wizard_questions RLS
ALTER TABLE wizard_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wizard_questions_select_all" ON wizard_questions FOR SELECT USING (true);
CREATE POLICY "wizard_questions_admin_all" ON wizard_questions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================
-- 13. TRIGGERS FOR updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_provider_fees_updated_at ON provider_fees;
CREATE TRIGGER update_provider_fees_updated_at
  BEFORE UPDATE ON provider_fees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_provider_reviews_updated_at ON provider_reviews;
CREATE TRIGGER update_provider_reviews_updated_at
  BEFORE UPDATE ON provider_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

