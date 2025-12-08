-- PayGate Optimizer Database Schema
-- Run this script to create all necessary tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  role TEXT DEFAULT 'merchant' CHECK (role IN ('admin', 'analyst', 'merchant')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Sectors table
CREATE TABLE IF NOT EXISTS sectors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Payment Methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Capabilities table
CREATE TABLE IF NOT EXISTS capabilities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Providers table
CREATE TABLE IF NOT EXISTS providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  website_url TEXT,
  logo_path TEXT,
  activation_time_days_min INTEGER DEFAULT 1,
  activation_time_days_max INTEGER DEFAULT 14,
  settlement_days_min INTEGER DEFAULT 1,
  settlement_days_max INTEGER DEFAULT 3,
  support_channels JSONB DEFAULT '[]'::jsonb,
  notes_ar TEXT,
  notes_en TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Provider Payment Methods (junction table)
CREATE TABLE IF NOT EXISTS provider_payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  payment_method_id UUID NOT NULL REFERENCES payment_methods(id) ON DELETE CASCADE,
  enabled BOOLEAN DEFAULT true,
  supports_recurring BOOLEAN DEFAULT false,
  supports_tokenization BOOLEAN DEFAULT false,
  supports_refunds BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(provider_id, payment_method_id)
);

-- 7. Pricing Rules table
CREATE TABLE IF NOT EXISTS pricing_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  payment_method_id UUID NOT NULL REFERENCES payment_methods(id) ON DELETE CASCADE,
  currency TEXT DEFAULT 'SAR',
  fee_percent DECIMAL(5,4) DEFAULT 0,
  fee_fixed DECIMAL(10,2) DEFAULT 0,
  monthly_fee DECIMAL(10,2) DEFAULT 0,
  setup_fee DECIMAL(10,2) DEFAULT 0,
  refund_fee_fixed DECIMAL(10,2) DEFAULT 0,
  chargeback_fee_fixed DECIMAL(10,2) DEFAULT 0,
  minimum_fee_per_txn DECIMAL(10,2),
  maximum_fee_per_txn DECIMAL(10,2),
  notes_ar TEXT,
  notes_en TEXT,
  effective_from DATE,
  effective_to DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Provider Capabilities (junction table)
CREATE TABLE IF NOT EXISTS provider_capabilities (
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  capability_id UUID NOT NULL REFERENCES capabilities(id) ON DELETE CASCADE,
  PRIMARY KEY (provider_id, capability_id)
);

-- 9. Provider Sector Rules
CREATE TABLE IF NOT EXISTS provider_sector_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  sector_id UUID NOT NULL REFERENCES sectors(id) ON DELETE CASCADE,
  is_supported BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(provider_id, sector_id)
);

-- 10. Ops Metrics
CREATE TABLE IF NOT EXISTS ops_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE UNIQUE,
  onboarding_score INTEGER DEFAULT 70 CHECK (onboarding_score >= 0 AND onboarding_score <= 100),
  support_score INTEGER DEFAULT 70 CHECK (support_score >= 0 AND support_score <= 100),
  docs_score INTEGER DEFAULT 70 CHECK (docs_score >= 0 AND docs_score <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Scoring Weights (configuration)
CREATE TABLE IF NOT EXISTS scoring_weights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cost_weight DECIMAL(3,2) DEFAULT 0.50,
  fit_weight DECIMAL(3,2) DEFAULT 0.25,
  ops_weight DECIMAL(3,2) DEFAULT 0.15,
  risk_weight DECIMAL(3,2) DEFAULT 0.10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Wizard Runs
CREATE TABLE IF NOT EXISTS wizard_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  locale TEXT DEFAULT 'ar' CHECK (locale IN ('ar', 'en')),
  ip_hash TEXT,
  sector_id UUID REFERENCES sectors(id),
  business_type TEXT,
  monthly_gmv DECIMAL(15,2),
  tx_count INTEGER,
  avg_ticket DECIMAL(10,2),
  refunds_rate DECIMAL(5,4) DEFAULT 0.02,
  chargebacks_rate DECIMAL(5,4) DEFAULT 0.005,
  payment_mix JSONB DEFAULT '{}'::jsonb,
  needs JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Recommendations
CREATE TABLE IF NOT EXISTS recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wizard_run_id UUID NOT NULL REFERENCES wizard_runs(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL,
  expected_cost_min DECIMAL(15,2),
  expected_cost_max DECIMAL(15,2),
  breakdown JSONB DEFAULT '{}'::jsonb,
  score_total DECIMAL(5,2),
  score_cost DECIMAL(5,2),
  score_fit DECIMAL(5,2),
  score_ops DECIMAL(5,2),
  score_risk DECIMAL(5,2),
  reasons JSONB DEFAULT '[]'::jsonb,
  caveats JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Leads
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wizard_run_id UUID REFERENCES wizard_runs(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  company_name TEXT,
  city TEXT,
  preferred_contact TEXT DEFAULT 'email',
  notes TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'won', 'lost')),
  owner_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_pricing_rules_provider ON pricing_rules(provider_id);
CREATE INDEX IF NOT EXISTS idx_pricing_rules_payment_method ON pricing_rules(payment_method_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_wizard_run ON recommendations(wizard_run_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_wizard_runs_created_at ON wizard_runs(created_at);
