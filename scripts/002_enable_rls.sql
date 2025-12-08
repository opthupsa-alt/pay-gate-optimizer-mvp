-- Enable Row Level Security on all tables

-- Profiles RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read all profiles (for admin views)
CREATE POLICY "profiles_select_all" ON profiles FOR SELECT USING (true);

-- Allow users to update their own profile
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Allow insert for authenticated users (for profile creation)
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Sectors RLS (public read)
ALTER TABLE sectors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sectors_select_all" ON sectors FOR SELECT USING (true);
CREATE POLICY "sectors_admin_all" ON sectors FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Payment Methods RLS (public read)
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "payment_methods_select_all" ON payment_methods FOR SELECT USING (true);
CREATE POLICY "payment_methods_admin_all" ON payment_methods FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Capabilities RLS (public read)
ALTER TABLE capabilities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "capabilities_select_all" ON capabilities FOR SELECT USING (true);
CREATE POLICY "capabilities_admin_all" ON capabilities FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Providers RLS (public read active only)
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "providers_select_active" ON providers FOR SELECT USING (is_active = true OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "providers_admin_all" ON providers FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Provider Payment Methods RLS
ALTER TABLE provider_payment_methods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ppm_select_all" ON provider_payment_methods FOR SELECT USING (true);
CREATE POLICY "ppm_admin_all" ON provider_payment_methods FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Pricing Rules RLS
ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pricing_rules_select_active" ON pricing_rules FOR SELECT USING (is_active = true OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "pricing_rules_admin_all" ON pricing_rules FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Provider Capabilities RLS
ALTER TABLE provider_capabilities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pc_select_all" ON provider_capabilities FOR SELECT USING (true);
CREATE POLICY "pc_admin_all" ON provider_capabilities FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Provider Sector Rules RLS
ALTER TABLE provider_sector_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "psr_select_all" ON provider_sector_rules FOR SELECT USING (true);
CREATE POLICY "psr_admin_all" ON provider_sector_rules FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Ops Metrics RLS
ALTER TABLE ops_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ops_metrics_select_all" ON ops_metrics FOR SELECT USING (true);
CREATE POLICY "ops_metrics_admin_all" ON ops_metrics FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Scoring Weights RLS
ALTER TABLE scoring_weights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "scoring_weights_select_all" ON scoring_weights FOR SELECT USING (true);
CREATE POLICY "scoring_weights_admin_all" ON scoring_weights FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Wizard Runs RLS (public insert, read own or admin)
ALTER TABLE wizard_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wizard_runs_insert_anon" ON wizard_runs FOR INSERT WITH CHECK (true);
CREATE POLICY "wizard_runs_select_all" ON wizard_runs FOR SELECT USING (true);

-- Recommendations RLS (public read)
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "recommendations_insert_anon" ON recommendations FOR INSERT WITH CHECK (true);
CREATE POLICY "recommendations_select_all" ON recommendations FOR SELECT USING (true);

-- Leads RLS (admin and analysts can view all, owners can view own)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leads_insert_anon" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "leads_select_admin" ON leads FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'analyst'))
);
CREATE POLICY "leads_update_admin" ON leads FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "leads_delete_admin" ON leads FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
