-- Seed Provider Payment Methods, Pricing Rules, Capabilities, Sector Rules, and Ops Metrics

-- Get provider IDs
DO $$
DECLARE
  v_payflow_id UUID;
  v_gulfpay_id UUID;
  v_saudigate_id UUID;
  v_quickpay_id UUID;
  v_merchanthub_id UUID;
  v_paysmart_id UUID;
  v_mada_id UUID;
  v_visa_mc_id UUID;
  v_apple_pay_id UUID;
  v_google_pay_id UUID;
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
  SELECT id INTO v_payflow_id FROM providers WHERE slug = 'payflow';
  SELECT id INTO v_gulfpay_id FROM providers WHERE slug = 'gulfpay';
  SELECT id INTO v_saudigate_id FROM providers WHERE slug = 'saudigate';
  SELECT id INTO v_quickpay_id FROM providers WHERE slug = 'quickpay';
  SELECT id INTO v_merchanthub_id FROM providers WHERE slug = 'merchanthub';
  SELECT id INTO v_paysmart_id FROM providers WHERE slug = 'paysmart';

  -- Get payment method IDs
  SELECT id INTO v_mada_id FROM payment_methods WHERE code = 'mada';
  SELECT id INTO v_visa_mc_id FROM payment_methods WHERE code = 'visa_mc';
  SELECT id INTO v_apple_pay_id FROM payment_methods WHERE code = 'apple_pay';
  SELECT id INTO v_google_pay_id FROM payment_methods WHERE code = 'google_pay';

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

  -- PayFlow: Payment Methods
  INSERT INTO provider_payment_methods (provider_id, payment_method_id, enabled, supports_recurring, supports_tokenization, supports_refunds)
  VALUES 
    (v_payflow_id, v_mada_id, true, true, true, true),
    (v_payflow_id, v_visa_mc_id, true, true, true, true),
    (v_payflow_id, v_apple_pay_id, true, false, false, true),
    (v_payflow_id, v_google_pay_id, true, false, false, true);

  -- PayFlow: Pricing Rules
  INSERT INTO pricing_rules (provider_id, payment_method_id, fee_percent, fee_fixed, monthly_fee, refund_fee_fixed, chargeback_fee_fixed, is_active)
  VALUES 
    (v_payflow_id, v_mada_id, 0.0150, 0.50, 0, 5.00, 50.00, true),
    (v_payflow_id, v_visa_mc_id, 0.0250, 1.00, 0, 5.00, 50.00, true),
    (v_payflow_id, v_apple_pay_id, 0.0200, 0.75, 0, 5.00, 50.00, true),
    (v_payflow_id, v_google_pay_id, 0.0200, 0.75, 0, 5.00, 50.00, true);

  -- PayFlow: Capabilities
  INSERT INTO provider_capabilities (provider_id, capability_id) VALUES 
    (v_payflow_id, v_recurring_id),
    (v_payflow_id, v_tokenization_id),
    (v_payflow_id, v_shopify_id),
    (v_payflow_id, v_fraud_tools_id);

  -- PayFlow: Sector Rules (supports all)
  INSERT INTO provider_sector_rules (provider_id, sector_id, is_supported) VALUES 
    (v_payflow_id, v_ecommerce_id, true),
    (v_payflow_id, v_retail_id, true),
    (v_payflow_id, v_services_id, true),
    (v_payflow_id, v_restaurants_id, true),
    (v_payflow_id, v_medical_id, true),
    (v_payflow_id, v_education_id, true),
    (v_payflow_id, v_travel_id, true),
    (v_payflow_id, v_marketplace_id, true);

  -- PayFlow: Ops Metrics
  INSERT INTO ops_metrics (provider_id, onboarding_score, support_score, docs_score)
  VALUES (v_payflow_id, 85, 80, 90);

  -- GulfPay: Payment Methods
  INSERT INTO provider_payment_methods (provider_id, payment_method_id, enabled, supports_recurring, supports_tokenization, supports_refunds)
  VALUES 
    (v_gulfpay_id, v_mada_id, true, true, true, true),
    (v_gulfpay_id, v_visa_mc_id, true, true, true, true),
    (v_gulfpay_id, v_apple_pay_id, true, true, true, true);

  -- GulfPay: Pricing Rules
  INSERT INTO pricing_rules (provider_id, payment_method_id, fee_percent, fee_fixed, monthly_fee, refund_fee_fixed, chargeback_fee_fixed, minimum_fee_per_txn, is_active)
  VALUES 
    (v_gulfpay_id, v_mada_id, 0.0120, 0.25, 500, 3.00, 75.00, 1.50, true),
    (v_gulfpay_id, v_visa_mc_id, 0.0220, 0.50, 500, 3.00, 75.00, 2.00, true),
    (v_gulfpay_id, v_apple_pay_id, 0.0180, 0.50, 0, 3.00, 75.00, 1.75, true);

  -- GulfPay: Capabilities
  INSERT INTO provider_capabilities (provider_id, capability_id) VALUES 
    (v_gulfpay_id, v_recurring_id),
    (v_gulfpay_id, v_tokenization_id),
    (v_gulfpay_id, v_multi_currency_id),
    (v_gulfpay_id, v_fraud_tools_id);

  -- GulfPay: Sector Rules
  INSERT INTO provider_sector_rules (provider_id, sector_id, is_supported) VALUES 
    (v_gulfpay_id, v_ecommerce_id, true),
    (v_gulfpay_id, v_retail_id, true),
    (v_gulfpay_id, v_services_id, true),
    (v_gulfpay_id, v_travel_id, true),
    (v_gulfpay_id, v_marketplace_id, true);

  -- GulfPay: Ops Metrics
  INSERT INTO ops_metrics (provider_id, onboarding_score, support_score, docs_score)
  VALUES (v_gulfpay_id, 70, 85, 75);

  -- SaudiGate: Payment Methods
  INSERT INTO provider_payment_methods (provider_id, payment_method_id, enabled, supports_recurring, supports_tokenization, supports_refunds)
  VALUES 
    (v_saudigate_id, v_mada_id, true, true, true, true),
    (v_saudigate_id, v_visa_mc_id, true, true, true, true),
    (v_saudigate_id, v_apple_pay_id, true, true, true, true),
    (v_saudigate_id, v_google_pay_id, true, true, true, true);

  -- SaudiGate: Pricing Rules (competitive rates)
  INSERT INTO pricing_rules (provider_id, payment_method_id, fee_percent, fee_fixed, monthly_fee, refund_fee_fixed, chargeback_fee_fixed, is_active)
  VALUES 
    (v_saudigate_id, v_mada_id, 0.0100, 0.30, 0, 2.00, 40.00, true),
    (v_saudigate_id, v_visa_mc_id, 0.0200, 0.75, 0, 2.00, 40.00, true),
    (v_saudigate_id, v_apple_pay_id, 0.0150, 0.50, 0, 2.00, 40.00, true),
    (v_saudigate_id, v_google_pay_id, 0.0150, 0.50, 0, 2.00, 40.00, true);

  -- SaudiGate: Capabilities (full featured)
  INSERT INTO provider_capabilities (provider_id, capability_id) VALUES 
    (v_saudigate_id, v_recurring_id),
    (v_saudigate_id, v_tokenization_id),
    (v_saudigate_id, v_multi_currency_id),
    (v_saudigate_id, v_shopify_id),
    (v_saudigate_id, v_woocommerce_id),
    (v_saudigate_id, v_fraud_tools_id);

  -- SaudiGate: Sector Rules (all sectors)
  INSERT INTO provider_sector_rules (provider_id, sector_id, is_supported) VALUES 
    (v_saudigate_id, v_ecommerce_id, true),
    (v_saudigate_id, v_retail_id, true),
    (v_saudigate_id, v_services_id, true),
    (v_saudigate_id, v_restaurants_id, true),
    (v_saudigate_id, v_medical_id, true),
    (v_saudigate_id, v_education_id, true),
    (v_saudigate_id, v_travel_id, true),
    (v_saudigate_id, v_marketplace_id, true);

  -- SaudiGate: Ops Metrics (excellent)
  INSERT INTO ops_metrics (provider_id, onboarding_score, support_score, docs_score)
  VALUES (v_saudigate_id, 95, 90, 95);

  -- QuickPay: Payment Methods
  INSERT INTO provider_payment_methods (provider_id, payment_method_id, enabled, supports_recurring, supports_tokenization, supports_refunds)
  VALUES 
    (v_quickpay_id, v_mada_id, true, false, false, true),
    (v_quickpay_id, v_visa_mc_id, true, false, false, true),
    (v_quickpay_id, v_apple_pay_id, true, false, false, true);

  -- QuickPay: Pricing Rules (low fees, no recurring)
  INSERT INTO pricing_rules (provider_id, payment_method_id, fee_percent, fee_fixed, monthly_fee, refund_fee_fixed, chargeback_fee_fixed, is_active)
  VALUES 
    (v_quickpay_id, v_mada_id, 0.0110, 0.20, 0, 5.00, 60.00, true),
    (v_quickpay_id, v_visa_mc_id, 0.0190, 0.60, 0, 5.00, 60.00, true),
    (v_quickpay_id, v_apple_pay_id, 0.0160, 0.40, 0, 5.00, 60.00, true);

  -- QuickPay: Capabilities (basic)
  INSERT INTO provider_capabilities (provider_id, capability_id) VALUES 
    (v_quickpay_id, v_shopify_id),
    (v_quickpay_id, v_woocommerce_id);

  -- QuickPay: Sector Rules
  INSERT INTO provider_sector_rules (provider_id, sector_id, is_supported) VALUES 
    (v_quickpay_id, v_ecommerce_id, true),
    (v_quickpay_id, v_retail_id, true),
    (v_quickpay_id, v_restaurants_id, true);

  -- QuickPay: Ops Metrics
  INSERT INTO ops_metrics (provider_id, onboarding_score, support_score, docs_score)
  VALUES (v_quickpay_id, 90, 65, 70);

  -- MerchantHub: Payment Methods
  INSERT INTO provider_payment_methods (provider_id, payment_method_id, enabled, supports_recurring, supports_tokenization, supports_refunds)
  VALUES 
    (v_merchanthub_id, v_mada_id, true, true, true, true),
    (v_merchanthub_id, v_visa_mc_id, true, true, true, true),
    (v_merchanthub_id, v_apple_pay_id, true, true, true, true),
    (v_merchanthub_id, v_google_pay_id, true, true, true, true);

  -- MerchantHub: Pricing Rules (higher monthly, lower per-tx)
  INSERT INTO pricing_rules (provider_id, payment_method_id, fee_percent, fee_fixed, monthly_fee, refund_fee_fixed, chargeback_fee_fixed, maximum_fee_per_txn, is_active)
  VALUES 
    (v_merchanthub_id, v_mada_id, 0.0080, 0.10, 1000, 0, 35.00, 25.00, true),
    (v_merchanthub_id, v_visa_mc_id, 0.0180, 0.25, 1000, 0, 35.00, 50.00, true),
    (v_merchanthub_id, v_apple_pay_id, 0.0140, 0.20, 0, 0, 35.00, 40.00, true),
    (v_merchanthub_id, v_google_pay_id, 0.0140, 0.20, 0, 0, 35.00, 40.00, true);

  -- MerchantHub: Capabilities
  INSERT INTO provider_capabilities (provider_id, capability_id) VALUES 
    (v_merchanthub_id, v_recurring_id),
    (v_merchanthub_id, v_tokenization_id),
    (v_merchanthub_id, v_multi_currency_id),
    (v_merchanthub_id, v_shopify_id),
    (v_merchanthub_id, v_woocommerce_id),
    (v_merchanthub_id, v_fraud_tools_id);

  -- MerchantHub: Sector Rules (e-commerce focused)
  INSERT INTO provider_sector_rules (provider_id, sector_id, is_supported) VALUES 
    (v_merchanthub_id, v_ecommerce_id, true),
    (v_merchanthub_id, v_marketplace_id, true),
    (v_merchanthub_id, v_retail_id, true);

  -- MerchantHub: Ops Metrics
  INSERT INTO ops_metrics (provider_id, onboarding_score, support_score, docs_score)
  VALUES (v_merchanthub_id, 60, 75, 85);

  -- PaySmart: Payment Methods
  INSERT INTO provider_payment_methods (provider_id, payment_method_id, enabled, supports_recurring, supports_tokenization, supports_refunds)
  VALUES 
    (v_paysmart_id, v_mada_id, true, true, true, true),
    (v_paysmart_id, v_visa_mc_id, true, true, true, true),
    (v_paysmart_id, v_apple_pay_id, true, false, false, true);

  -- PaySmart: Pricing Rules
  INSERT INTO pricing_rules (provider_id, payment_method_id, fee_percent, fee_fixed, monthly_fee, refund_fee_fixed, chargeback_fee_fixed, is_active)
  VALUES 
    (v_paysmart_id, v_mada_id, 0.0130, 0.35, 200, 4.00, 55.00, true),
    (v_paysmart_id, v_visa_mc_id, 0.0230, 0.80, 200, 4.00, 55.00, true),
    (v_paysmart_id, v_apple_pay_id, 0.0180, 0.60, 0, 4.00, 55.00, true);

  -- PaySmart: Capabilities
  INSERT INTO provider_capabilities (provider_id, capability_id) VALUES 
    (v_paysmart_id, v_recurring_id),
    (v_paysmart_id, v_tokenization_id),
    (v_paysmart_id, v_shopify_id),
    (v_paysmart_id, v_fraud_tools_id);

  -- PaySmart: Sector Rules
  INSERT INTO provider_sector_rules (provider_id, sector_id, is_supported) VALUES 
    (v_paysmart_id, v_ecommerce_id, true),
    (v_paysmart_id, v_retail_id, true),
    (v_paysmart_id, v_services_id, true),
    (v_paysmart_id, v_education_id, true),
    (v_paysmart_id, v_medical_id, true);

  -- PaySmart: Ops Metrics
  INSERT INTO ops_metrics (provider_id, onboarding_score, support_score, docs_score)
  VALUES (v_paysmart_id, 80, 80, 80);

END $$;
