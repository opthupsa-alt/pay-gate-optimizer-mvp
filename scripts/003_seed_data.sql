-- Seed Data for PayGate Optimizer
-- NOTE: Replace with real provider agreements before production use

-- Seed Sectors
INSERT INTO sectors (code, name_ar, name_en) VALUES
  ('medical', 'القطاع الطبي', 'Medical'),
  ('restaurants', 'المطاعم', 'Restaurants'),
  ('ecommerce', 'التجارة الإلكترونية', 'E-Commerce'),
  ('services', 'الخدمات', 'Services'),
  ('education', 'التعليم', 'Education'),
  ('travel', 'السفر والسياحة', 'Travel'),
  ('retail', 'التجزئة', 'Retail'),
  ('marketplace', 'الأسواق الإلكترونية', 'Marketplace')
ON CONFLICT (code) DO NOTHING;

-- Seed Payment Methods
INSERT INTO payment_methods (code, name_ar, name_en, is_active) VALUES
  ('mada', 'مدى', 'Mada', true),
  ('visa_mc', 'فيزا/ماستركارد', 'Visa/Mastercard', true),
  ('apple_pay', 'Apple Pay', 'Apple Pay', true),
  ('google_pay', 'Google Pay', 'Google Pay', true),
  ('bank_transfer', 'تحويل بنكي', 'Bank Transfer', true),
  ('bnpl', 'اشتر الآن وادفع لاحقاً', 'Buy Now Pay Later', true)
ON CONFLICT (code) DO NOTHING;

-- Seed Capabilities
INSERT INTO capabilities (code, name_ar, name_en) VALUES
  ('recurring', 'الدفعات المتكررة', 'Recurring Payments'),
  ('multi_currency', 'العملات المتعددة', 'Multi-Currency'),
  ('plugins_shopify', 'إضافة Shopify', 'Shopify Plugin'),
  ('plugins_woocommerce', 'إضافة WooCommerce', 'WooCommerce Plugin'),
  ('fraud_tools', 'أدوات مكافحة الاحتيال', 'Fraud Prevention Tools'),
  ('tokenization', 'ترميز البطاقات', 'Card Tokenization'),
  ('payouts_split', 'تقسيم المدفوعات', 'Split Payouts')
ON CONFLICT (code) DO NOTHING;

-- Seed Default Scoring Weights
INSERT INTO scoring_weights (cost_weight, fit_weight, ops_weight, risk_weight) 
VALUES (0.50, 0.25, 0.15, 0.10)
ON CONFLICT DO NOTHING;

-- Seed Sample Providers (Fictional - Replace with real data)

-- Provider 1: PayFlow
INSERT INTO providers (slug, name_ar, name_en, website_url, activation_time_days_min, activation_time_days_max, settlement_days_min, settlement_days_max, support_channels, notes_ar, notes_en, is_active)
VALUES ('payflow', 'باي فلو', 'PayFlow', 'https://payflow.example.com', 3, 7, 1, 2, '["email", "phone", "chat"]', 'مزود دفع محلي سريع', 'Fast local payment provider', true);

-- Provider 2: GulfPay
INSERT INTO providers (slug, name_ar, name_en, website_url, activation_time_days_min, activation_time_days_max, settlement_days_min, settlement_days_max, support_channels, notes_ar, notes_en, is_active)
VALUES ('gulfpay', 'خليج باي', 'GulfPay', 'https://gulfpay.example.com', 5, 14, 2, 3, '["email", "phone"]', 'حلول دفع للخليج', 'Gulf region payment solutions', true);

-- Provider 3: SaudiGate
INSERT INTO providers (slug, name_ar, name_en, website_url, activation_time_days_min, activation_time_days_max, settlement_days_min, settlement_days_max, support_channels, notes_ar, notes_en, is_active)
VALUES ('saudigate', 'البوابة السعودية', 'SaudiGate', 'https://saudigate.example.com', 2, 5, 1, 2, '["email", "phone", "chat", "whatsapp"]', 'بوابة دفع سعودية متكاملة', 'Integrated Saudi payment gateway', true);

-- Provider 4: QuickPay KSA
INSERT INTO providers (slug, name_ar, name_en, website_url, activation_time_days_min, activation_time_days_max, settlement_days_min, settlement_days_max, support_channels, notes_ar, notes_en, is_active)
VALUES ('quickpay', 'كويك باي', 'QuickPay KSA', 'https://quickpay.example.com', 1, 3, 1, 1, '["email", "chat"]', 'أسرع تفعيل وتسوية', 'Fastest activation and settlement', true);

-- Provider 5: MerchantHub
INSERT INTO providers (slug, name_ar, name_en, website_url, activation_time_days_min, activation_time_days_max, settlement_days_min, settlement_days_max, support_channels, notes_ar, notes_en, is_active)
VALUES ('merchanthub', 'مركز التجار', 'MerchantHub', 'https://merchanthub.example.com', 7, 14, 2, 4, '["email", "phone"]', 'متخصص في التجارة الإلكترونية', 'E-commerce specialist', true);

-- Provider 6: PaySmart
INSERT INTO providers (slug, name_ar, name_en, website_url, activation_time_days_min, activation_time_days_max, settlement_days_min, settlement_days_max, support_channels, notes_ar, notes_en, is_active)
VALUES ('paysmart', 'باي سمارت', 'PaySmart', 'https://paysmart.example.com', 4, 10, 1, 3, '["email", "phone", "chat"]', 'حلول ذكية للمدفوعات', 'Smart payment solutions', true);
