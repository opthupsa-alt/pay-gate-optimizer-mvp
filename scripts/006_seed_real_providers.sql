-- Real Saudi Payment Providers Data
-- Note: Pricing data is approximate and should be verified with providers

-- Clear existing provider data (optional - comment out in production)
-- DELETE FROM ops_metrics;
-- DELETE FROM provider_capabilities;
-- DELETE FROM provider_sector_rules;
-- DELETE FROM pricing_rules;
-- DELETE FROM provider_payment_methods;
-- DELETE FROM providers WHERE slug IN ('moyasar', 'tap', 'hyperpay', 'payfort', 'tabby', 'tamara');

-- Insert Real Providers
INSERT INTO providers (slug, name_ar, name_en, website_url, activation_time_days_min, activation_time_days_max, settlement_days_min, settlement_days_max, support_channels, notes_ar, notes_en, is_active)
VALUES 
  ('moyasar', 'ميسر', 'Moyasar', 'https://moyasar.com', 1, 3, 1, 2, '["email", "phone", "chat", "whatsapp"]', 'بوابة دفع سعودية سريعة التفعيل مع دعم ممتاز', 'Fast Saudi payment gateway with excellent support', true),
  ('tap', 'تاب للمدفوعات', 'Tap Payments', 'https://tap.company', 2, 5, 1, 3, '["email", "phone", "chat"]', 'بوابة إقليمية رائدة مع دعم متعدد العملات', 'Leading regional gateway with multi-currency support', true),
  ('hyperpay', 'هايبر باي', 'HyperPay', 'https://hyperpay.com', 3, 7, 2, 5, '["email", "phone"]', 'معتمدة من البنوك السعودية الكبرى', 'Certified by major Saudi banks', true),
  ('payfort', 'باي فورت', 'PayFort (Amazon)', 'https://payfort.com', 5, 14, 2, 7, '["email", "phone"]', 'مملوكة لأمازون، مناسبة للشركات الكبيرة', 'Owned by Amazon, suitable for enterprises', true),
  ('tabby', 'تابي', 'Tabby', 'https://tabby.ai', 2, 5, 1, 3, '["email", "chat"]', 'متخصص في خدمة اشتر الآن وادفع لاحقاً', 'Specialized in Buy Now Pay Later service', true),
  ('tamara', 'تمارا', 'Tamara', 'https://tamara.co', 2, 5, 1, 3, '["email", "chat", "phone"]', 'خدمة تقسيط متوافقة مع الشريعة', 'Sharia-compliant installment service', true)
ON CONFLICT (slug) DO UPDATE SET
  name_ar = EXCLUDED.name_ar,
  name_en = EXCLUDED.name_en,
  website_url = EXCLUDED.website_url,
  activation_time_days_min = EXCLUDED.activation_time_days_min,
  activation_time_days_max = EXCLUDED.activation_time_days_max,
  settlement_days_min = EXCLUDED.settlement_days_min,
  settlement_days_max = EXCLUDED.settlement_days_max,
  support_channels = EXCLUDED.support_channels,
  notes_ar = EXCLUDED.notes_ar,
  notes_en = EXCLUDED.notes_en,
  updated_at = NOW();

-- Get provider and payment method IDs for linking
DO $$
DECLARE
  v_moyasar_id UUID;
  v_tap_id UUID;
  v_hyperpay_id UUID;
  v_payfort_id UUID;
  v_tabby_id UUID;
  v_tamara_id UUID;
  v_mada_id UUID;
  v_visa_mc_id UUID;
  v_apple_pay_id UUID;
  v_google_pay_id UUID;
  v_bnpl_id UUID;
  v_recurring_id UUID;
  v_multi_currency_id UUID;
  v_shopify_id UUID;
  v_woocommerce_id UUID;
  v_fraud_tools_id UUID;
  v_tokenization_id UUID;
  v_ecommerce_id UUID;
  v_retail_id UUID;
  v_services_id UUID;
  v_restaurants_id UUID;
  v_medical_id UUID;
  v_education_id UUID;
  v_travel_id UUID;
  v_marketplace_id UUID;
BEGIN
  -- Get provider IDs
  SELECT id INTO v_moyasar_id FROM providers WHERE slug = 'moyasar';
  SELECT id INTO v_tap_id FROM providers WHERE slug = 'tap';
  SELECT id INTO v_hyperpay_id FROM providers WHERE slug = 'hyperpay';
  SELECT id INTO v_payfort_id FROM providers WHERE slug = 'payfort';
  SELECT id INTO v_tabby_id FROM providers WHERE slug = 'tabby';
  SELECT id INTO v_tamara_id FROM providers WHERE slug = 'tamara';

  -- Get payment method IDs
  SELECT id INTO v_mada_id FROM payment_methods WHERE code = 'mada';
  SELECT id INTO v_visa_mc_id FROM payment_methods WHERE code = 'visa_mc';
  SELECT id INTO v_apple_pay_id FROM payment_methods WHERE code = 'apple_pay';
  SELECT id INTO v_google_pay_id FROM payment_methods WHERE code = 'google_pay';
  SELECT id INTO v_bnpl_id FROM payment_methods WHERE code = 'bnpl';

  -- Get capability IDs
  SELECT id INTO v_recurring_id FROM capabilities WHERE code = 'recurring';
  SELECT id INTO v_multi_currency_id FROM capabilities WHERE code = 'multi_currency';
  SELECT id INTO v_shopify_id FROM capabilities WHERE code = 'plugins_shopify';
  SELECT id INTO v_woocommerce_id FROM capabilities WHERE code = 'plugins_woocommerce';
  SELECT id INTO v_fraud_tools_id FROM capabilities WHERE code = 'fraud_tools';
  SELECT id INTO v_tokenization_id FROM capabilities WHERE code = 'tokenization';

  -- Get sector IDs
  SELECT id INTO v_ecommerce_id FROM sectors WHERE code = 'ecommerce';
  SELECT id INTO v_retail_id FROM sectors WHERE code = 'retail';
  SELECT id INTO v_services_id FROM sectors WHERE code = 'services';
  SELECT id INTO v_restaurants_id FROM sectors WHERE code = 'restaurants';
  SELECT id INTO v_medical_id FROM sectors WHERE code = 'medical';
  SELECT id INTO v_education_id FROM sectors WHERE code = 'education';
  SELECT id INTO v_travel_id FROM sectors WHERE code = 'travel';
  SELECT id INTO v_marketplace_id FROM sectors WHERE code = 'marketplace';

  -- ==========================================
  -- MOYASAR - Payment Methods & Pricing
  -- ==========================================
  INSERT INTO provider_payment_methods (provider_id, payment_method_id, enabled, supports_recurring, supports_tokenization, supports_refunds)
  VALUES 
    (v_moyasar_id, v_mada_id, true, true, true, true),
    (v_moyasar_id, v_visa_mc_id, true, true, true, true),
    (v_moyasar_id, v_apple_pay_id, true, false, false, true)
  ON CONFLICT (provider_id, payment_method_id) DO UPDATE SET
    enabled = EXCLUDED.enabled,
    supports_recurring = EXCLUDED.supports_recurring,
    supports_tokenization = EXCLUDED.supports_tokenization;

  -- Moyasar Pricing (approximate - verify with provider)
  INSERT INTO pricing_rules (provider_id, payment_method_id, fee_percent, fee_fixed, monthly_fee, refund_fee_fixed, chargeback_fee_fixed, is_active)
  VALUES 
    (v_moyasar_id, v_mada_id, 0.0150, 0.00, 0, 0, 50.00, true),
    (v_moyasar_id, v_visa_mc_id, 0.0275, 1.00, 0, 0, 75.00, true),
    (v_moyasar_id, v_apple_pay_id, 0.0200, 0.50, 0, 0, 50.00, true)
  ON CONFLICT DO NOTHING;

  -- Moyasar Capabilities
  INSERT INTO provider_capabilities (provider_id, capability_id) VALUES 
    (v_moyasar_id, v_recurring_id),
    (v_moyasar_id, v_tokenization_id),
    (v_moyasar_id, v_shopify_id),
    (v_moyasar_id, v_woocommerce_id),
    (v_moyasar_id, v_fraud_tools_id)
  ON CONFLICT DO NOTHING;

  -- Moyasar Sector Rules (supports all)
  INSERT INTO provider_sector_rules (provider_id, sector_id, is_supported) VALUES 
    (v_moyasar_id, v_ecommerce_id, true),
    (v_moyasar_id, v_retail_id, true),
    (v_moyasar_id, v_services_id, true),
    (v_moyasar_id, v_restaurants_id, true),
    (v_moyasar_id, v_medical_id, true),
    (v_moyasar_id, v_education_id, true),
    (v_moyasar_id, v_travel_id, true),
    (v_moyasar_id, v_marketplace_id, true)
  ON CONFLICT (provider_id, sector_id) DO UPDATE SET is_supported = true;

  -- Moyasar Ops Metrics
  INSERT INTO ops_metrics (provider_id, onboarding_score, support_score, docs_score)
  VALUES (v_moyasar_id, 95, 90, 88)
  ON CONFLICT (provider_id) DO UPDATE SET
    onboarding_score = EXCLUDED.onboarding_score,
    support_score = EXCLUDED.support_score,
    docs_score = EXCLUDED.docs_score,
    updated_at = NOW();

  -- ==========================================
  -- TAP PAYMENTS - Payment Methods & Pricing
  -- ==========================================
  INSERT INTO provider_payment_methods (provider_id, payment_method_id, enabled, supports_recurring, supports_tokenization, supports_refunds)
  VALUES 
    (v_tap_id, v_mada_id, true, true, true, true),
    (v_tap_id, v_visa_mc_id, true, true, true, true),
    (v_tap_id, v_apple_pay_id, true, false, false, true),
    (v_tap_id, v_google_pay_id, true, false, false, true)
  ON CONFLICT (provider_id, payment_method_id) DO UPDATE SET
    enabled = EXCLUDED.enabled,
    supports_recurring = EXCLUDED.supports_recurring,
    supports_tokenization = EXCLUDED.supports_tokenization;

  -- Tap Pricing
  INSERT INTO pricing_rules (provider_id, payment_method_id, fee_percent, fee_fixed, monthly_fee, refund_fee_fixed, chargeback_fee_fixed, is_active)
  VALUES 
    (v_tap_id, v_mada_id, 0.0175, 0.00, 0, 0, 60.00, true),
    (v_tap_id, v_visa_mc_id, 0.0290, 1.00, 0, 0, 75.00, true),
    (v_tap_id, v_apple_pay_id, 0.0225, 0.50, 0, 0, 60.00, true),
    (v_tap_id, v_google_pay_id, 0.0225, 0.50, 0, 0, 60.00, true)
  ON CONFLICT DO NOTHING;

  -- Tap Capabilities
  INSERT INTO provider_capabilities (provider_id, capability_id) VALUES 
    (v_tap_id, v_recurring_id),
    (v_tap_id, v_tokenization_id),
    (v_tap_id, v_multi_currency_id),
    (v_tap_id, v_shopify_id),
    (v_tap_id, v_woocommerce_id),
    (v_tap_id, v_fraud_tools_id)
  ON CONFLICT DO NOTHING;

  -- Tap Sector Rules
  INSERT INTO provider_sector_rules (provider_id, sector_id, is_supported) VALUES 
    (v_tap_id, v_ecommerce_id, true),
    (v_tap_id, v_retail_id, true),
    (v_tap_id, v_services_id, true),
    (v_tap_id, v_restaurants_id, true),
    (v_tap_id, v_medical_id, true),
    (v_tap_id, v_education_id, true),
    (v_tap_id, v_travel_id, true),
    (v_tap_id, v_marketplace_id, true)
  ON CONFLICT (provider_id, sector_id) DO UPDATE SET is_supported = true;

  -- Tap Ops Metrics
  INSERT INTO ops_metrics (provider_id, onboarding_score, support_score, docs_score)
  VALUES (v_tap_id, 88, 85, 92)
  ON CONFLICT (provider_id) DO UPDATE SET
    onboarding_score = EXCLUDED.onboarding_score,
    support_score = EXCLUDED.support_score,
    docs_score = EXCLUDED.docs_score,
    updated_at = NOW();

  -- ==========================================
  -- HYPERPAY - Payment Methods & Pricing
  -- ==========================================
  INSERT INTO provider_payment_methods (provider_id, payment_method_id, enabled, supports_recurring, supports_tokenization, supports_refunds)
  VALUES 
    (v_hyperpay_id, v_mada_id, true, true, true, true),
    (v_hyperpay_id, v_visa_mc_id, true, true, true, true),
    (v_hyperpay_id, v_apple_pay_id, true, false, false, true)
  ON CONFLICT (provider_id, payment_method_id) DO UPDATE SET
    enabled = EXCLUDED.enabled,
    supports_recurring = EXCLUDED.supports_recurring,
    supports_tokenization = EXCLUDED.supports_tokenization;

  -- HyperPay Pricing
  INSERT INTO pricing_rules (provider_id, payment_method_id, fee_percent, fee_fixed, monthly_fee, refund_fee_fixed, chargeback_fee_fixed, is_active)
  VALUES 
    (v_hyperpay_id, v_mada_id, 0.0140, 0.00, 299, 0, 75.00, true),
    (v_hyperpay_id, v_visa_mc_id, 0.0260, 1.00, 0, 0, 100.00, true),
    (v_hyperpay_id, v_apple_pay_id, 0.0200, 0.50, 0, 0, 75.00, true)
  ON CONFLICT DO NOTHING;

  -- HyperPay Capabilities
  INSERT INTO provider_capabilities (provider_id, capability_id) VALUES 
    (v_hyperpay_id, v_recurring_id),
    (v_hyperpay_id, v_tokenization_id),
    (v_hyperpay_id, v_multi_currency_id),
    (v_hyperpay_id, v_fraud_tools_id)
  ON CONFLICT DO NOTHING;

  -- HyperPay Sector Rules
  INSERT INTO provider_sector_rules (provider_id, sector_id, is_supported) VALUES 
    (v_hyperpay_id, v_ecommerce_id, true),
    (v_hyperpay_id, v_retail_id, true),
    (v_hyperpay_id, v_services_id, true),
    (v_hyperpay_id, v_restaurants_id, true),
    (v_hyperpay_id, v_medical_id, true),
    (v_hyperpay_id, v_education_id, true),
    (v_hyperpay_id, v_travel_id, true),
    (v_hyperpay_id, v_marketplace_id, true)
  ON CONFLICT (provider_id, sector_id) DO UPDATE SET is_supported = true;

  -- HyperPay Ops Metrics
  INSERT INTO ops_metrics (provider_id, onboarding_score, support_score, docs_score)
  VALUES (v_hyperpay_id, 75, 82, 85)
  ON CONFLICT (provider_id) DO UPDATE SET
    onboarding_score = EXCLUDED.onboarding_score,
    support_score = EXCLUDED.support_score,
    docs_score = EXCLUDED.docs_score,
    updated_at = NOW();

  -- ==========================================
  -- PAYFORT - Payment Methods & Pricing
  -- ==========================================
  INSERT INTO provider_payment_methods (provider_id, payment_method_id, enabled, supports_recurring, supports_tokenization, supports_refunds)
  VALUES 
    (v_payfort_id, v_mada_id, true, true, true, true),
    (v_payfort_id, v_visa_mc_id, true, true, true, true),
    (v_payfort_id, v_apple_pay_id, true, false, false, true),
    (v_payfort_id, v_google_pay_id, true, false, false, true)
  ON CONFLICT (provider_id, payment_method_id) DO UPDATE SET
    enabled = EXCLUDED.enabled,
    supports_recurring = EXCLUDED.supports_recurring,
    supports_tokenization = EXCLUDED.supports_tokenization;

  -- PayFort Pricing
  INSERT INTO pricing_rules (provider_id, payment_method_id, fee_percent, fee_fixed, monthly_fee, setup_fee, refund_fee_fixed, chargeback_fee_fixed, minimum_fee_per_txn, is_active)
  VALUES 
    (v_payfort_id, v_mada_id, 0.0160, 0.00, 500, 1000, 5, 100.00, 1.00, true),
    (v_payfort_id, v_visa_mc_id, 0.0280, 1.50, 0, 0, 5, 125.00, 1.50, true),
    (v_payfort_id, v_apple_pay_id, 0.0230, 1.00, 0, 0, 5, 100.00, 1.00, true),
    (v_payfort_id, v_google_pay_id, 0.0230, 1.00, 0, 0, 5, 100.00, 1.00, true)
  ON CONFLICT DO NOTHING;

  -- PayFort Capabilities
  INSERT INTO provider_capabilities (provider_id, capability_id) VALUES 
    (v_payfort_id, v_recurring_id),
    (v_payfort_id, v_tokenization_id),
    (v_payfort_id, v_multi_currency_id),
    (v_payfort_id, v_shopify_id),
    (v_payfort_id, v_woocommerce_id),
    (v_payfort_id, v_fraud_tools_id)
  ON CONFLICT DO NOTHING;

  -- PayFort Sector Rules
  INSERT INTO provider_sector_rules (provider_id, sector_id, is_supported) VALUES 
    (v_payfort_id, v_ecommerce_id, true),
    (v_payfort_id, v_retail_id, true),
    (v_payfort_id, v_services_id, true),
    (v_payfort_id, v_restaurants_id, true),
    (v_payfort_id, v_medical_id, true),
    (v_payfort_id, v_education_id, true),
    (v_payfort_id, v_travel_id, true),
    (v_payfort_id, v_marketplace_id, true)
  ON CONFLICT (provider_id, sector_id) DO UPDATE SET is_supported = true;

  -- PayFort Ops Metrics
  INSERT INTO ops_metrics (provider_id, onboarding_score, support_score, docs_score)
  VALUES (v_payfort_id, 70, 85, 95)
  ON CONFLICT (provider_id) DO UPDATE SET
    onboarding_score = EXCLUDED.onboarding_score,
    support_score = EXCLUDED.support_score,
    docs_score = EXCLUDED.docs_score,
    updated_at = NOW();

  -- ==========================================
  -- TABBY - BNPL Provider
  -- ==========================================
  INSERT INTO provider_payment_methods (provider_id, payment_method_id, enabled, supports_recurring, supports_tokenization, supports_refunds)
  VALUES 
    (v_tabby_id, v_bnpl_id, true, false, false, true)
  ON CONFLICT (provider_id, payment_method_id) DO UPDATE SET enabled = true;

  -- Tabby Pricing (BNPL - merchant pays)
  INSERT INTO pricing_rules (provider_id, payment_method_id, fee_percent, fee_fixed, monthly_fee, refund_fee_fixed, chargeback_fee_fixed, is_active)
  VALUES 
    (v_tabby_id, v_bnpl_id, 0.0500, 0.00, 0, 0, 50.00, true)
  ON CONFLICT DO NOTHING;

  -- Tabby Sector Rules (E-commerce focused)
  INSERT INTO provider_sector_rules (provider_id, sector_id, is_supported) VALUES 
    (v_tabby_id, v_ecommerce_id, true),
    (v_tabby_id, v_retail_id, true),
    (v_tabby_id, v_services_id, false),
    (v_tabby_id, v_restaurants_id, false),
    (v_tabby_id, v_medical_id, false),
    (v_tabby_id, v_education_id, false),
    (v_tabby_id, v_travel_id, true),
    (v_tabby_id, v_marketplace_id, true)
  ON CONFLICT (provider_id, sector_id) DO UPDATE SET is_supported = EXCLUDED.is_supported;

  -- Tabby Ops Metrics
  INSERT INTO ops_metrics (provider_id, onboarding_score, support_score, docs_score)
  VALUES (v_tabby_id, 90, 85, 80)
  ON CONFLICT (provider_id) DO UPDATE SET
    onboarding_score = EXCLUDED.onboarding_score,
    support_score = EXCLUDED.support_score,
    docs_score = EXCLUDED.docs_score,
    updated_at = NOW();

  -- ==========================================
  -- TAMARA - BNPL Provider
  -- ==========================================
  INSERT INTO provider_payment_methods (provider_id, payment_method_id, enabled, supports_recurring, supports_tokenization, supports_refunds)
  VALUES 
    (v_tamara_id, v_bnpl_id, true, false, false, true)
  ON CONFLICT (provider_id, payment_method_id) DO UPDATE SET enabled = true;

  -- Tamara Pricing
  INSERT INTO pricing_rules (provider_id, payment_method_id, fee_percent, fee_fixed, monthly_fee, refund_fee_fixed, chargeback_fee_fixed, is_active)
  VALUES 
    (v_tamara_id, v_bnpl_id, 0.0450, 0.00, 0, 0, 50.00, true)
  ON CONFLICT DO NOTHING;

  -- Tamara Capabilities
  INSERT INTO provider_capabilities (provider_id, capability_id) VALUES 
    (v_tamara_id, v_shopify_id),
    (v_tamara_id, v_woocommerce_id)
  ON CONFLICT DO NOTHING;

  -- Tamara Sector Rules
  INSERT INTO provider_sector_rules (provider_id, sector_id, is_supported) VALUES 
    (v_tamara_id, v_ecommerce_id, true),
    (v_tamara_id, v_retail_id, true),
    (v_tamara_id, v_services_id, true),
    (v_tamara_id, v_restaurants_id, false),
    (v_tamara_id, v_medical_id, true),
    (v_tamara_id, v_education_id, true),
    (v_tamara_id, v_travel_id, true),
    (v_tamara_id, v_marketplace_id, true)
  ON CONFLICT (provider_id, sector_id) DO UPDATE SET is_supported = EXCLUDED.is_supported;

  -- Tamara Ops Metrics
  INSERT INTO ops_metrics (provider_id, onboarding_score, support_score, docs_score)
  VALUES (v_tamara_id, 88, 82, 78)
  ON CONFLICT (provider_id) DO UPDATE SET
    onboarding_score = EXCLUDED.onboarding_score,
    support_score = EXCLUDED.support_score,
    docs_score = EXCLUDED.docs_score,
    updated_at = NOW();

END $$;

