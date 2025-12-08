-- PayGate Optimizer - Complete Provider Seed Data
-- All Saudi market payment providers with verified data
-- Last Updated: December 2024

-- ============================================
-- CLEAR EXISTING DATA (Optional - Comment out in production)
-- ============================================
-- DELETE FROM provider_bnpl;
-- DELETE FROM provider_wallets;
-- DELETE FROM provider_reviews;
-- DELETE FROM provider_sources;
-- DELETE FROM provider_currencies;
-- DELETE FROM provider_integrations;
-- DELETE FROM provider_fees;
-- DELETE FROM provider_capabilities;
-- DELETE FROM provider_payment_methods;
-- DELETE FROM pricing_rules;

-- ============================================
-- 1. PAYMENT METHODS (Updated)
-- ============================================

INSERT INTO payment_methods (code, name_ar, name_en, category, icon_name, display_order) VALUES
  ('mada', 'مدى', 'mada', 'debit', 'mada', 1),
  ('visa', 'فيزا', 'Visa', 'card', 'visa', 2),
  ('mastercard', 'ماستركارد', 'Mastercard', 'card', 'mastercard', 3),
  ('amex', 'أمريكان إكسبريس', 'American Express', 'card', 'amex', 4),
  ('apple_pay', 'Apple Pay', 'Apple Pay', 'wallet', 'apple', 5),
  ('stc_pay', 'STC Pay', 'STC Pay', 'wallet', 'stc', 6),
  ('sadad', 'سداد', 'SADAD', 'bank', 'sadad', 7),
  ('bank_transfer', 'تحويل بنكي', 'Bank Transfer', 'bank', 'bank', 8),
  ('tabby', 'تابي', 'Tabby', 'bnpl', 'tabby', 9),
  ('tamara', 'تمارا', 'Tamara', 'bnpl', 'tamara', 10)
ON CONFLICT (code) DO UPDATE SET
  category = EXCLUDED.category,
  icon_name = EXCLUDED.icon_name,
  display_order = EXCLUDED.display_order;

-- ============================================
-- 2. PROVIDERS - Complete List
-- ============================================

-- 2.1 MOYASAR (موياسر)
INSERT INTO providers (
  slug, name_ar, name_en, website_url, logo_path,
  description_ar, description_en,
  category, countries_served, status,
  setup_fee, monthly_fee, settlement_days_min, settlement_days_max,
  activation_time_days_min, activation_time_days_max,
  support_channels, support_hours, docs_url, pricing_url, terms_url,
  supported_currencies, multi_currency_supported, payout_schedule, payout_min_amount,
  pros_ar, pros_en, cons_ar, cons_en,
  last_verified_at
) VALUES (
  'moyasar', 'موياسر', 'Moyasar', 'https://moyasar.com',
  '/providers/moyasar.svg',
  'بوابة دفع سعودية متكاملة تدعم جميع طرق الدفع المحلية والدولية مع واجهة عربية سهلة وتكامل سريع',
  'Saudi-based payment gateway supporting all local and international payment methods with easy Arabic interface and quick integration',
  'payment_gateway', '["SA"]', 'active',
  0, 0, 2, 7,
  1, 3,
  '["email", "phone", "chat", "whatsapp"]', '9AM-6PM Sun-Thu',
  'https://docs.moyasar.com', 'https://moyasar.com/pricing', 'https://moyasar.com/terms',
  '["SAR"]', false, 'weekly', 100,
  '["تفعيل سريع خلال يوم واحد", "دعم فني عربي ممتاز", "واجهة سهلة الاستخدام", "تكامل مع معظم المنصات", "لا رسوم شهرية"]',
  '["Fast activation within one day", "Excellent Arabic support", "Easy to use interface", "Integration with most platforms", "No monthly fees"]',
  '["رسوم مرتفعة نسبياً للحجم الكبير", "دعم عملات محدود"]',
  '["Relatively high fees for large volumes", "Limited currency support"]',
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  description_ar = EXCLUDED.description_ar,
  description_en = EXCLUDED.description_en,
  category = EXCLUDED.category,
  last_verified_at = EXCLUDED.last_verified_at;

-- 2.2 HYPERPAY (هايبرباي)
INSERT INTO providers (
  slug, name_ar, name_en, website_url, logo_path,
  description_ar, description_en,
  category, countries_served, status,
  setup_fee, monthly_fee, settlement_days_min, settlement_days_max,
  activation_time_days_min, activation_time_days_max,
  support_channels, support_hours, docs_url, pricing_url, terms_url,
  supported_currencies, multi_currency_supported, payout_schedule, payout_min_amount,
  pros_ar, pros_en, cons_ar, cons_en,
  last_verified_at
) VALUES (
  'hyperpay', 'هايبرباي', 'HyperPay', 'https://hyperpay.com',
  '/providers/hyperpay.svg',
  'بوابة دفع إقليمية رائدة تخدم منطقة الشرق الأوسط وشمال أفريقيا مع دعم واسع للعملات وطرق الدفع',
  'Leading regional payment gateway serving MENA with wide currency and payment method support',
  'payment_gateway', '["SA", "AE", "EG", "JO", "KW", "BH", "OM", "QA"]', 'active',
  0, 0, 1, 5,
  3, 7,
  '["email", "phone", "chat"]', '24/7',
  'https://wordpresshyperpay.docs.oppwa.com', 'https://hyperpay.com/pricing', 'https://hyperpay.com/terms',
  '["SAR", "AED", "USD", "EUR", "EGP", "JOD", "KWD", "BHD", "OMR", "QAR"]', true, 'daily', 500,
  '["دعم متعدد العملات", "تغطية إقليمية واسعة", "دعم 24/7", "تسوية سريعة", "تكامل مع منصات متعددة"]',
  '["Multi-currency support", "Wide regional coverage", "24/7 support", "Fast settlement", "Multiple platform integrations"]',
  '["إعداد أولي يتطلب وقت", "رسوم قد تكون أعلى للمبتدئين"]',
  '["Initial setup requires time", "Fees may be higher for beginners"]',
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  description_ar = EXCLUDED.description_ar,
  description_en = EXCLUDED.description_en,
  last_verified_at = EXCLUDED.last_verified_at;

-- 2.3 TAP PAYMENTS
INSERT INTO providers (
  slug, name_ar, name_en, website_url, logo_path,
  description_ar, description_en,
  category, countries_served, status,
  setup_fee, monthly_fee, settlement_days_min, settlement_days_max,
  activation_time_days_min, activation_time_days_max,
  support_channels, support_hours, docs_url, pricing_url, terms_url,
  supported_currencies, multi_currency_supported, payout_schedule, payout_min_amount,
  pros_ar, pros_en, cons_ar, cons_en,
  last_verified_at
) VALUES (
  'tap', 'تاب للمدفوعات', 'Tap Payments', 'https://tap.company',
  '/providers/tap.svg',
  'منصة مدفوعات متكاملة للشركات في منطقة الخليج مع حلول متقدمة للدفع الإلكتروني',
  'Comprehensive payment platform for businesses in the Gulf region with advanced e-payment solutions',
  'psp', '["SA", "AE", "KW", "BH", "OM", "QA"]', 'active',
  0, 0, 2, 5,
  2, 5,
  '["email", "phone", "chat", "whatsapp"]', '9AM-9PM Sun-Thu',
  'https://developers.tap.company', 'https://tap.company/ksa/ar/pricing', 'https://tap.company/terms',
  '["SAR", "AED", "KWD", "BHD", "OMR", "QAR", "USD"]', true, 'weekly', 200,
  '["منصة متكاملة", "دعم BNPL مدمج", "SDK للموبايل", "تقارير متقدمة", "دعم خليجي كامل"]',
  '["Comprehensive platform", "Built-in BNPL support", "Mobile SDK", "Advanced reporting", "Full GCC support"]',
  '["قد يكون معقد للمبتدئين", "رسوم متوسطة"]',
  '["May be complex for beginners", "Average fees"]',
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  description_ar = EXCLUDED.description_ar,
  description_en = EXCLUDED.description_en,
  last_verified_at = EXCLUDED.last_verified_at;

-- 2.4 PAYTABS
INSERT INTO providers (
  slug, name_ar, name_en, website_url, logo_path,
  description_ar, description_en,
  category, countries_served, status,
  setup_fee, monthly_fee, settlement_days_min, settlement_days_max,
  activation_time_days_min, activation_time_days_max,
  support_channels, support_hours, docs_url, pricing_url, terms_url,
  supported_currencies, multi_currency_supported, payout_schedule, payout_min_amount,
  pros_ar, pros_en, cons_ar, cons_en,
  last_verified_at
) VALUES (
  'paytabs', 'بيتابز', 'PayTabs', 'https://paytabs.com',
  '/providers/paytabs.svg',
  'بوابة دفع عالمية مرخصة من SAMA مع خبرة طويلة في السوق السعودي',
  'Global payment gateway licensed by SAMA with extensive experience in the Saudi market',
  'payment_gateway', '["SA", "AE", "EG", "JO", "OM", "BH", "KW", "QA", "PK"]', 'active',
  0, 0, 3, 7,
  5, 14,
  '["email", "phone", "chat"]', '9AM-6PM Sun-Thu',
  'https://site.paytabs.com/en/developer', 'https://paytabs.sa/pricing', 'https://paytabs.sa/terms',
  '["SAR", "AED", "USD", "EUR", "EGP", "JOD", "KWD", "BHD", "OMR", "QAR", "PKR"]', true, 'weekly', 500,
  '["خبرة طويلة في السوق", "ترخيص SAMA", "تغطية عالمية", "دعم عملات متعددة"]',
  '["Long market experience", "SAMA licensed", "Global coverage", "Multi-currency support"]',
  '["تفعيل يستغرق وقت", "واجهة قديمة نسبياً"]',
  '["Activation takes time", "Relatively old interface"]',
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  description_ar = EXCLUDED.description_ar,
  description_en = EXCLUDED.description_en,
  last_verified_at = EXCLUDED.last_verified_at;

-- 2.5 TELR
INSERT INTO providers (
  slug, name_ar, name_en, website_url, logo_path,
  description_ar, description_en,
  category, countries_served, status,
  setup_fee, monthly_fee, settlement_days_min, settlement_days_max,
  activation_time_days_min, activation_time_days_max,
  support_channels, support_hours, docs_url, pricing_url, terms_url,
  supported_currencies, multi_currency_supported, payout_schedule, payout_min_amount,
  pros_ar, pros_en, cons_ar, cons_en,
  last_verified_at
) VALUES (
  'telr', 'تيلر', 'Telr', 'https://telr.com',
  '/providers/telr.svg',
  'بوابة دفع إماراتية تخدم السوق السعودي مع حلول متنوعة للشركات',
  'UAE-based payment gateway serving the Saudi market with diverse business solutions',
  'payment_gateway', '["SA", "AE", "IN"]', 'active',
  0, 99, 2, 5,
  3, 10,
  '["email", "phone", "chat"]', '9AM-6PM Sun-Thu',
  'https://telr.com/developer', 'https://telr.com/pricing', 'https://telr.com/terms',
  '["SAR", "AED", "USD", "EUR", "INR"]', true, 'weekly', 300,
  '["أسعار تنافسية", "دعم الهند والخليج", "خيارات مرنة"]',
  '["Competitive prices", "India and Gulf support", "Flexible options"]',
  '["رسوم شهرية ثابتة", "دعم محدود باللغة العربية"]',
  '["Fixed monthly fees", "Limited Arabic support"]',
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  description_ar = EXCLUDED.description_ar,
  description_en = EXCLUDED.description_en,
  last_verified_at = EXCLUDED.last_verified_at;

-- 2.6 PAYFORT (Amazon Payment Services)
INSERT INTO providers (
  slug, name_ar, name_en, website_url, logo_path,
  description_ar, description_en,
  category, countries_served, status,
  setup_fee, monthly_fee, settlement_days_min, settlement_days_max,
  activation_time_days_min, activation_time_days_max,
  support_channels, support_hours, docs_url, pricing_url, terms_url,
  supported_currencies, multi_currency_supported, payout_schedule, payout_min_amount,
  pros_ar, pros_en, cons_ar, cons_en,
  last_verified_at
) VALUES (
  'payfort', 'باي فورت (أمازون)', 'PayFort (Amazon)', 'https://paymentservices.amazon.com',
  '/providers/payfort.svg',
  'خدمات أمازون للمدفوعات - حل موثوق للشركات الكبرى في المنطقة',
  'Amazon Payment Services - Reliable solution for large enterprises in the region',
  'psp', '["SA", "AE", "EG", "JO", "LB"]', 'active',
  0, 0, 2, 5,
  7, 21,
  '["email", "phone"]', '9AM-6PM Sun-Thu',
  'https://paymentservices.amazon.com/docs', 'https://paymentservices.amazon.com/pricing', 'https://paymentservices.amazon.com/terms',
  '["SAR", "AED", "USD", "EUR", "EGP", "JOD", "LBP"]', true, 'weekly', 1000,
  '["علامة أمازون الموثوقة", "أمان عالي", "دعم شركات كبيرة", "استقرار ممتاز"]',
  '["Trusted Amazon brand", "High security", "Enterprise support", "Excellent stability"]',
  '["غير مناسب للمشاريع الصغيرة", "تفعيل بطيء", "رسوم أعلى"]',
  '["Not suitable for small projects", "Slow activation", "Higher fees"]',
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  description_ar = EXCLUDED.description_ar,
  description_en = EXCLUDED.description_en,
  last_verified_at = EXCLUDED.last_verified_at;

-- 2.7 CHECKOUT.COM
INSERT INTO providers (
  slug, name_ar, name_en, website_url, logo_path,
  description_ar, description_en,
  category, countries_served, status,
  setup_fee, monthly_fee, settlement_days_min, settlement_days_max,
  activation_time_days_min, activation_time_days_max,
  support_channels, support_hours, docs_url, pricing_url, terms_url,
  supported_currencies, multi_currency_supported, payout_schedule, payout_min_amount,
  pros_ar, pros_en, cons_ar, cons_en,
  last_verified_at
) VALUES (
  'checkout', 'تشيك أوت', 'Checkout.com', 'https://checkout.com',
  '/providers/checkout.svg',
  'منصة مدفوعات عالمية للشركات الكبرى مع تغطية دولية واسعة',
  'Global payment platform for enterprises with extensive international coverage',
  'psp', '["SA", "AE", "Global"]', 'active',
  0, 0, 1, 3,
  14, 30,
  '["email", "phone", "dedicated_manager"]', '24/7',
  'https://www.checkout.com/docs', 'https://www.checkout.com/pricing', 'https://www.checkout.com/terms',
  '["SAR", "AED", "USD", "EUR", "GBP"]', true, 'daily', 5000,
  '["تغطية عالمية", "API متقدم", "تسوية سريعة", "حلول Enterprise"]',
  '["Global coverage", "Advanced API", "Fast settlement", "Enterprise solutions"]',
  '["للشركات الكبيرة فقط", "تفعيل طويل", "دعم عربي محدود"]',
  '["Large companies only", "Long activation", "Limited Arabic support"]',
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  description_ar = EXCLUDED.description_ar,
  description_en = EXCLUDED.description_en,
  last_verified_at = EXCLUDED.last_verified_at;

-- 2.8 GEIDEA (جيديا)
INSERT INTO providers (
  slug, name_ar, name_en, website_url, logo_path,
  description_ar, description_en,
  category, countries_served, status,
  setup_fee, monthly_fee, settlement_days_min, settlement_days_max,
  activation_time_days_min, activation_time_days_max,
  support_channels, support_hours, docs_url, pricing_url, terms_url,
  supported_currencies, multi_currency_supported, payout_schedule, payout_min_amount,
  pros_ar, pros_en, cons_ar, cons_en,
  last_verified_at
) VALUES (
  'geidea', 'جيديا', 'Geidea', 'https://geidea.net',
  '/providers/geidea.svg',
  'شركة تقنية مالية سعودية تقدم حلول نقاط بيع وبوابات دفع متكاملة',
  'Saudi fintech company providing POS solutions and integrated payment gateways',
  'acquirer', '["SA", "AE", "EG"]', 'active',
  0, 0, 1, 3,
  3, 10,
  '["email", "phone", "chat", "whatsapp"]', '9AM-6PM Sun-Thu',
  'https://docs.geidea.net', 'https://geidea.net/sa/ar/pricing', 'https://geidea.net/terms',
  '["SAR", "AED", "EGP"]', true, 'daily', 100,
  '["حل سعودي محلي", "أجهزة POS متقدمة", "تسوية سريعة يومية", "تكامل سهل"]',
  '["Local Saudi solution", "Advanced POS devices", "Fast daily settlement", "Easy integration"]',
  '["تركيز على POS", "خبرة أقل في E-commerce"]',
  '["POS focused", "Less e-commerce experience"]',
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  description_ar = EXCLUDED.description_ar,
  description_en = EXCLUDED.description_en,
  last_verified_at = EXCLUDED.last_verified_at;

-- 2.9 MYFATOORAH
INSERT INTO providers (
  slug, name_ar, name_en, website_url, logo_path,
  description_ar, description_en,
  category, countries_served, status,
  setup_fee, monthly_fee, settlement_days_min, settlement_days_max,
  activation_time_days_min, activation_time_days_max,
  support_channels, support_hours, docs_url, pricing_url, terms_url,
  supported_currencies, multi_currency_supported, payout_schedule, payout_min_amount,
  pros_ar, pros_en, cons_ar, cons_en,
  last_verified_at
) VALUES (
  'myfatoorah', 'ماي فاتورة', 'MyFatoorah', 'https://myfatoorah.com',
  '/providers/myfatoorah.svg',
  'بوابة دفع كويتية رائدة تخدم منطقة الخليج مع حلول فوترة متكاملة',
  'Leading Kuwaiti payment gateway serving the Gulf region with integrated invoicing solutions',
  'payment_gateway', '["SA", "KW", "AE", "BH", "QA", "OM"]', 'active',
  0, 0, 2, 5,
  2, 7,
  '["email", "phone", "chat"]', '9AM-9PM Sun-Thu',
  'https://myfatoorah.readme.io', 'https://myfatoorah.com/pricing', 'https://myfatoorah.com/terms',
  '["SAR", "KWD", "AED", "BHD", "QAR", "OMR", "USD"]', true, 'weekly', 200,
  '["نظام فواتير متكامل", "دعم خليجي كامل", "واجهة سهلة", "تكامل سريع"]',
  '["Integrated invoicing system", "Full GCC support", "Easy interface", "Quick integration"]',
  '["تصميم قديم نسبياً", "وثائق API محدودة"]',
  '["Relatively old design", "Limited API documentation"]',
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  description_ar = EXCLUDED.description_ar,
  description_en = EXCLUDED.description_en,
  last_verified_at = EXCLUDED.last_verified_at;

-- 2.10 NEARPAY (نيرباي)
INSERT INTO providers (
  slug, name_ar, name_en, website_url, logo_path,
  description_ar, description_en,
  category, countries_served, status,
  setup_fee, monthly_fee, settlement_days_min, settlement_days_max,
  activation_time_days_min, activation_time_days_max,
  support_channels, support_hours, docs_url, pricing_url, terms_url,
  supported_currencies, multi_currency_supported, payout_schedule, payout_min_amount,
  pros_ar, pros_en, cons_ar, cons_en,
  last_verified_at
) VALUES (
  'nearpay', 'نيرباي', 'NearPay', 'https://nearpay.io',
  '/providers/nearpay.svg',
  'شركة تقنية مالية سعودية متخصصة في تحويل الهواتف الذكية إلى أجهزة نقاط بيع',
  'Saudi fintech specialized in transforming smartphones into POS devices',
  'aggregator', '["SA"]', 'active',
  0, 0, 1, 2,
  1, 3,
  '["email", "phone", "whatsapp"]', '9AM-6PM Sun-Thu',
  'https://nearpay.io/developers', 'https://nearpay.io/pricing', 'https://nearpay.io/terms',
  '["SAR"]', false, 'daily', 50,
  '["تفعيل فوري", "بدون أجهزة إضافية", "رسوم منخفضة", "مثالي للأفراد والمشاريع الصغيرة"]',
  '["Instant activation", "No additional devices", "Low fees", "Ideal for individuals and small businesses"]',
  '["للموبايل فقط", "حدود معاملات منخفضة", "لا يدعم E-commerce بشكل كامل"]',
  '["Mobile only", "Low transaction limits", "Does not fully support E-commerce"]',
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  description_ar = EXCLUDED.description_ar,
  description_en = EXCLUDED.description_en,
  last_verified_at = EXCLUDED.last_verified_at;

-- 2.11 TABBY (تابي) - BNPL
INSERT INTO providers (
  slug, name_ar, name_en, website_url, logo_path,
  description_ar, description_en,
  category, countries_served, status,
  setup_fee, monthly_fee, settlement_days_min, settlement_days_max,
  activation_time_days_min, activation_time_days_max,
  support_channels, support_hours, docs_url, pricing_url, terms_url,
  supported_currencies, multi_currency_supported, payout_schedule, payout_min_amount,
  pros_ar, pros_en, cons_ar, cons_en,
  last_verified_at
) VALUES (
  'tabby', 'تابي', 'Tabby', 'https://tabby.ai',
  '/providers/tabby.svg',
  'منصة الشراء الآن والدفع لاحقاً الرائدة في المنطقة - قسط مشترياتك على 4 دفعات بدون فوائد',
  'Leading Buy Now Pay Later platform in the region - Split your purchases into 4 interest-free payments',
  'bnpl', '["SA", "AE", "KW", "BH", "QA"]', 'active',
  0, 0, 1, 3,
  7, 14,
  '["email", "chat", "whatsapp"]', '9AM-9PM Sun-Thu',
  'https://docs.tabby.ai', 'https://tabby.ai/business/pricing', 'https://tabby.ai/terms',
  '["SAR", "AED", "KWD", "BHD", "QAR"]', true, 'weekly', 0,
  '["زيادة متوسط قيمة السلة 30%+", "بدون مخاطر على التاجر", "تفعيل سهل", "دعم ممتاز"]',
  '["Increase average basket 30%+", "No merchant risk", "Easy activation", "Excellent support"]',
  '["رسوم مرتفعة 5-6%", "قد لا يناسب كل القطاعات"]',
  '["High fees 5-6%", "May not suit all sectors"]',
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  description_ar = EXCLUDED.description_ar,
  description_en = EXCLUDED.description_en,
  last_verified_at = EXCLUDED.last_verified_at;

-- 2.12 TAMARA (تمارا) - BNPL
INSERT INTO providers (
  slug, name_ar, name_en, website_url, logo_path,
  description_ar, description_en,
  category, countries_served, status,
  setup_fee, monthly_fee, settlement_days_min, settlement_days_max,
  activation_time_days_min, activation_time_days_max,
  support_channels, support_hours, docs_url, pricing_url, terms_url,
  supported_currencies, multi_currency_supported, payout_schedule, payout_min_amount,
  pros_ar, pros_en, cons_ar, cons_en,
  last_verified_at
) VALUES (
  'tamara', 'تمارا', 'Tamara', 'https://tamara.co',
  '/providers/tamara.svg',
  'منصة تقسيط سعودية - قسط على 3 أو 4 دفعات بدون فوائد',
  'Saudi installment platform - Split into 3 or 4 interest-free payments',
  'bnpl', '["SA", "AE", "KW"]', 'active',
  0, 0, 1, 3,
  5, 14,
  '["email", "chat", "phone"]', '9AM-9PM Sun-Thu',
  'https://developer.tamara.co', 'https://tamara.co/business/pricing', 'https://tamara.co/terms',
  '["SAR", "AED", "KWD"]', true, 'weekly', 0,
  '["شركة سعودية", "تفعيل سريع", "دعم عربي ممتاز", "تكامل سهل مع سلة وزد"]',
  '["Saudi company", "Fast activation", "Excellent Arabic support", "Easy integration with Salla and Zid"]',
  '["رسوم مرتفعة", "حد أدنى للطلب"]',
  '["High fees", "Minimum order value"]',
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  description_ar = EXCLUDED.description_ar,
  description_en = EXCLUDED.description_en,
  last_verified_at = EXCLUDED.last_verified_at;

-- 2.13 STRIPE (مع وكيل محلي)
INSERT INTO providers (
  slug, name_ar, name_en, website_url, logo_path,
  description_ar, description_en,
  category, countries_served, status,
  setup_fee, monthly_fee, settlement_days_min, settlement_days_max,
  activation_time_days_min, activation_time_days_max,
  support_channels, support_hours, docs_url, pricing_url, terms_url,
  supported_currencies, multi_currency_supported, payout_schedule, payout_min_amount,
  risk_notes,
  pros_ar, pros_en, cons_ar, cons_en,
  last_verified_at
) VALUES (
  'stripe', 'سترايب', 'Stripe', 'https://stripe.com',
  '/providers/stripe.svg',
  'أشهر بوابة دفع عالمياً - متاحة في السعودية عبر وكيل محلي أو حساب أمريكي',
  'World most popular payment gateway - Available in Saudi via local agent or US account',
  'payment_gateway', '["Global"]', 'limited',
  0, 0, 2, 7,
  1, 14,
  '["email", "chat", "docs"]', '24/7',
  'https://stripe.com/docs', 'https://stripe.com/pricing', 'https://stripe.com/legal',
  '["USD", "EUR", "GBP", "SAR"]', true, 'daily', 0,
  'غير متاح مباشرة في السعودية - يتطلب وكيل محلي مثل Paylink أو حساب في دولة مدعومة',
  '["أفضل API في السوق", "وثائق ممتازة", "تكامل مع كل شيء", "أدوات متقدمة"]',
  '["Best API in market", "Excellent documentation", "Integrates with everything", "Advanced tools"]',
  '["غير متاح مباشرة في SA", "يتطلب إعداد معقد", "دعم عربي ضعيف"]',
  '["Not directly available in SA", "Requires complex setup", "Weak Arabic support"]',
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  description_ar = EXCLUDED.description_ar,
  description_en = EXCLUDED.description_en,
  risk_notes = EXCLUDED.risk_notes,
  last_verified_at = EXCLUDED.last_verified_at;

-- 2.14 PAYLINK (بيلينك)
INSERT INTO providers (
  slug, name_ar, name_en, website_url, logo_path,
  description_ar, description_en,
  category, countries_served, status,
  setup_fee, monthly_fee, settlement_days_min, settlement_days_max,
  activation_time_days_min, activation_time_days_max,
  support_channels, support_hours, docs_url, pricing_url, terms_url,
  supported_currencies, multi_currency_supported, payout_schedule, payout_min_amount,
  pros_ar, pros_en, cons_ar, cons_en,
  last_verified_at
) VALUES (
  'paylink', 'بيلينك', 'Paylink', 'https://paylink.sa',
  '/providers/paylink.svg',
  'منصة سعودية للفوترة والدفع الإلكتروني مع روابط دفع سهلة',
  'Saudi platform for invoicing and electronic payment with easy payment links',
  'aggregator', '["SA"]', 'active',
  0, 0, 2, 5,
  1, 3,
  '["email", "phone", "whatsapp"]', '9AM-6PM Sun-Thu',
  'https://paylink.sa/docs', 'https://paylink.sa/pricing', 'https://paylink.sa/terms',
  '["SAR"]', false, 'weekly', 100,
  '["تفعيل فوري", "روابط دفع سهلة", "بدون أكواد", "مناسب للأفراد"]',
  '["Instant activation", "Easy payment links", "No coding needed", "Suitable for individuals"]',
  '["ميزات محدودة", "لا يناسب المتاجر الكبيرة", "رسوم أعلى"]',
  '["Limited features", "Not for large stores", "Higher fees"]',
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  description_ar = EXCLUDED.description_ar,
  description_en = EXCLUDED.description_en,
  last_verified_at = EXCLUDED.last_verified_at;

-- 2.15 NOON PAYMENTS
INSERT INTO providers (
  slug, name_ar, name_en, website_url, logo_path,
  description_ar, description_en,
  category, countries_served, status,
  setup_fee, monthly_fee, settlement_days_min, settlement_days_max,
  activation_time_days_min, activation_time_days_max,
  support_channels, support_hours, docs_url, pricing_url, terms_url,
  supported_currencies, multi_currency_supported, payout_schedule, payout_min_amount,
  pros_ar, pros_en, cons_ar, cons_en,
  last_verified_at
) VALUES (
  'noon', 'نون للمدفوعات', 'Noon Payments', 'https://noonpayments.com',
  '/providers/noon.svg',
  'حل الدفع من مجموعة نون - للتجار على منصة نون وخارجها',
  'Payment solution from Noon Group - For merchants on and off the Noon platform',
  'payment_gateway', '["SA", "AE", "EG"]', 'active',
  0, 0, 1, 3,
  3, 7,
  '["email", "phone", "chat"]', '9AM-9PM Sun-Thu',
  'https://docs.noonpayments.com', 'https://noonpayments.com/pricing', 'https://noonpayments.com/terms',
  '["SAR", "AED", "EGP"]', true, 'daily', 100,
  '["تكامل مع نون", "رسوم تنافسية", "تسوية سريعة"]',
  '["Noon integration", "Competitive fees", "Fast settlement"]',
  '["خدمة جديدة نسبياً", "تركيز على بائعي نون"]',
  '["Relatively new service", "Focus on Noon sellers"]',
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  description_ar = EXCLUDED.description_ar,
  description_en = EXCLUDED.description_en,
  last_verified_at = EXCLUDED.last_verified_at;

-- 2.16 JAHEZ PAY (جاهز باي)
INSERT INTO providers (
  slug, name_ar, name_en, website_url, logo_path,
  description_ar, description_en,
  category, countries_served, status,
  setup_fee, monthly_fee, settlement_days_min, settlement_days_max,
  activation_time_days_min, activation_time_days_max,
  support_channels, support_hours, docs_url, pricing_url, terms_url,
  supported_currencies, multi_currency_supported, payout_schedule, payout_min_amount,
  pros_ar, pros_en, cons_ar, cons_en,
  last_verified_at
) VALUES (
  'jahez', 'جاهز باي', 'Jahez Pay', 'https://jahez.net',
  '/providers/jahez.svg',
  'حل الدفع من جاهز - مخصص لقطاع المطاعم والتوصيل',
  'Payment solution from Jahez - Specialized for restaurants and delivery',
  'aggregator', '["SA"]', 'active',
  0, 0, 1, 3,
  1, 5,
  '["email", "phone", "app"]', '9AM-11PM Sun-Sat',
  NULL, NULL, 'https://jahez.net/terms',
  '["SAR"]', false, 'daily', 0,
  '["تكامل مع جاهز", "للمطاعم", "تفعيل سريع"]',
  '["Jahez integration", "For restaurants", "Fast activation"]',
  '["للمطاعم فقط", "غير متاح لغير شركاء جاهز"]',
  '["Restaurants only", "Not available for non-Jahez partners"]',
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  description_ar = EXCLUDED.description_ar,
  description_en = EXCLUDED.description_en,
  last_verified_at = EXCLUDED.last_verified_at;

-- 2.17 CLICK TO PAY
INSERT INTO providers (
  slug, name_ar, name_en, website_url, logo_path,
  description_ar, description_en,
  category, countries_served, status,
  setup_fee, monthly_fee, settlement_days_min, settlement_days_max,
  activation_time_days_min, activation_time_days_max,
  support_channels, support_hours, docs_url, pricing_url, terms_url,
  supported_currencies, multi_currency_supported, payout_schedule, payout_min_amount,
  pros_ar, pros_en, cons_ar, cons_en,
  last_verified_at
) VALUES (
  'clicktopay', 'كليك تو باي', 'Click to Pay', 'https://clicktopay.sa',
  '/providers/clicktopay.svg',
  'حل دفع سعودي بسيط مع روابط دفع وفواتير إلكترونية',
  'Simple Saudi payment solution with payment links and electronic invoices',
  'aggregator', '["SA"]', 'active',
  0, 0, 2, 5,
  1, 3,
  '["email", "whatsapp"]', '9AM-6PM Sun-Thu',
  'https://clicktopay.sa/docs', 'https://clicktopay.sa/pricing', 'https://clicktopay.sa/terms',
  '["SAR"]', false, 'weekly', 100,
  '["بسيط وسهل", "تفعيل فوري", "روابط دفع"]',
  '["Simple and easy", "Instant activation", "Payment links"]',
  '["ميزات محدودة", "للمشاريع الصغيرة فقط"]',
  '["Limited features", "Small projects only"]',
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  description_ar = EXCLUDED.description_ar,
  description_en = EXCLUDED.description_en,
  last_verified_at = EXCLUDED.last_verified_at;

-- 2.18 FOLOOSI
INSERT INTO providers (
  slug, name_ar, name_en, website_url, logo_path,
  description_ar, description_en,
  category, countries_served, status,
  setup_fee, monthly_fee, settlement_days_min, settlement_days_max,
  activation_time_days_min, activation_time_days_max,
  support_channels, support_hours, docs_url, pricing_url, terms_url,
  supported_currencies, multi_currency_supported, payout_schedule, payout_min_amount,
  pros_ar, pros_en, cons_ar, cons_en,
  last_verified_at
) VALUES (
  'foloosi', 'فلوسي', 'Foloosi', 'https://foloosi.com',
  '/providers/foloosi.svg',
  'بوابة دفع إماراتية تخدم السوق الخليجي مع حلول مرنة',
  'UAE payment gateway serving the Gulf market with flexible solutions',
  'payment_gateway', '["AE", "SA", "BH", "OM", "KW", "QA"]', 'active',
  0, 0, 2, 5,
  3, 7,
  '["email", "phone", "chat"]', '9AM-6PM Sun-Thu',
  'https://docs.foloosi.com', 'https://foloosi.com/pricing', 'https://foloosi.com/terms',
  '["AED", "SAR", "USD"]', true, 'weekly', 200,
  '["أسعار تنافسية", "دعم خليجي", "تكامل سهل"]',
  '["Competitive prices", "Gulf support", "Easy integration"]',
  '["أقل شهرة", "وثائق محدودة"]',
  '["Less known", "Limited documentation"]',
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  description_ar = EXCLUDED.description_ar,
  description_en = EXCLUDED.description_en,
  last_verified_at = EXCLUDED.last_verified_at;

-- 2.19 2CHECKOUT / VERIFONE
INSERT INTO providers (
  slug, name_ar, name_en, website_url, logo_path,
  description_ar, description_en,
  category, countries_served, status,
  setup_fee, monthly_fee, settlement_days_min, settlement_days_max,
  activation_time_days_min, activation_time_days_max,
  support_channels, support_hours, docs_url, pricing_url, terms_url,
  supported_currencies, multi_currency_supported, payout_schedule, payout_min_amount,
  pros_ar, pros_en, cons_ar, cons_en,
  last_verified_at
) VALUES (
  '2checkout', 'تو تشيك أوت', '2Checkout (Verifone)', 'https://www.2checkout.com',
  '/providers/2checkout.svg',
  'منصة مدفوعات عالمية تدعم البيع الدولي وتقدم حلول MoR',
  'Global payment platform supporting international sales with MoR solutions',
  'psp', '["Global"]', 'active',
  0, 0, 7, 14,
  7, 21,
  '["email", "phone"]', '24/7',
  'https://www.2checkout.com/documentation', 'https://www.2checkout.com/pricing', 'https://www.2checkout.com/legal',
  '["USD", "EUR", "GBP", "SAR"]', true, 'biweekly', 1000,
  '["بيع دولي", "MoR متاح", "عملات متعددة", "دعم رقمي"]',
  '["International sales", "MoR available", "Multiple currencies", "Digital support"]',
  '["رسوم مرتفعة", "تسوية بطيئة", "إعداد معقد"]',
  '["High fees", "Slow settlement", "Complex setup"]',
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  description_ar = EXCLUDED.description_ar,
  description_en = EXCLUDED.description_en,
  last_verified_at = EXCLUDED.last_verified_at;

-- 2.20 STC PAY (محفظة)
INSERT INTO providers (
  slug, name_ar, name_en, website_url, logo_path,
  description_ar, description_en,
  category, countries_served, status,
  setup_fee, monthly_fee, settlement_days_min, settlement_days_max,
  activation_time_days_min, activation_time_days_max,
  support_channels, support_hours, docs_url, pricing_url, terms_url,
  supported_currencies, multi_currency_supported, payout_schedule, payout_min_amount,
  pros_ar, pros_en, cons_ar, cons_en,
  last_verified_at
) VALUES (
  'stcpay', 'STC Pay', 'STC Pay', 'https://stcpay.com.sa',
  '/providers/stcpay.svg',
  'محفظة رقمية من STC - الأكثر انتشاراً في السعودية',
  'Digital wallet from STC - Most widespread in Saudi Arabia',
  'wallet', '["SA"]', 'active',
  0, 0, 1, 2,
  1, 7,
  '["phone", "app", "chat"]', '24/7',
  'https://stcpay.com.sa/developers', NULL, 'https://stcpay.com.sa/terms',
  '["SAR"]', false, 'daily', 0,
  '["الأكثر انتشاراً", "تحويل فوري", "تكامل سهل"]',
  '["Most widespread", "Instant transfer", "Easy integration"]',
  '["للسعودية فقط", "رسوم على التجار"]',
  '["Saudi only", "Merchant fees"]',
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  description_ar = EXCLUDED.description_ar,
  description_en = EXCLUDED.description_en,
  last_verified_at = EXCLUDED.last_verified_at;

-- ============================================
-- 3. PROVIDER FEES (Detailed)
-- ============================================

-- Helper: Get provider and payment method IDs
DO $$
DECLARE
  v_moyasar_id UUID;
  v_hyperpay_id UUID;
  v_tap_id UUID;
  v_paytabs_id UUID;
  v_geidea_id UUID;
  v_myfatoorah_id UUID;
  v_tabby_id UUID;
  v_tamara_id UUID;
  v_paylink_id UUID;
  v_nearpay_id UUID;
  v_telr_id UUID;
  v_payfort_id UUID;
  v_checkout_id UUID;
  
  v_mada_id UUID;
  v_visa_id UUID;
  v_mastercard_id UUID;
  v_amex_id UUID;
  v_apple_pay_id UUID;
  v_stc_pay_id UUID;
BEGIN
  -- Get provider IDs
  SELECT id INTO v_moyasar_id FROM providers WHERE slug = 'moyasar';
  SELECT id INTO v_hyperpay_id FROM providers WHERE slug = 'hyperpay';
  SELECT id INTO v_tap_id FROM providers WHERE slug = 'tap';
  SELECT id INTO v_paytabs_id FROM providers WHERE slug = 'paytabs';
  SELECT id INTO v_geidea_id FROM providers WHERE slug = 'geidea';
  SELECT id INTO v_myfatoorah_id FROM providers WHERE slug = 'myfatoorah';
  SELECT id INTO v_tabby_id FROM providers WHERE slug = 'tabby';
  SELECT id INTO v_tamara_id FROM providers WHERE slug = 'tamara';
  SELECT id INTO v_paylink_id FROM providers WHERE slug = 'paylink';
  SELECT id INTO v_nearpay_id FROM providers WHERE slug = 'nearpay';
  SELECT id INTO v_telr_id FROM providers WHERE slug = 'telr';
  SELECT id INTO v_payfort_id FROM providers WHERE slug = 'payfort';
  SELECT id INTO v_checkout_id FROM providers WHERE slug = 'checkout';
  
  -- Get payment method IDs
  SELECT id INTO v_mada_id FROM payment_methods WHERE code = 'mada';
  SELECT id INTO v_visa_id FROM payment_methods WHERE code = 'visa';
  SELECT id INTO v_mastercard_id FROM payment_methods WHERE code = 'mastercard';
  SELECT id INTO v_amex_id FROM payment_methods WHERE code = 'amex';
  SELECT id INTO v_apple_pay_id FROM payment_methods WHERE code = 'apple_pay';
  SELECT id INTO v_stc_pay_id FROM payment_methods WHERE code = 'stc_pay';

  -- MOYASAR FEES
  IF v_moyasar_id IS NOT NULL AND v_mada_id IS NOT NULL THEN
    INSERT INTO provider_fees (provider_id, payment_method_id, fee_percent, fee_fixed, source_url, notes_ar, notes_en)
    VALUES 
      (v_moyasar_id, v_mada_id, 1.75, 1.00, 'https://moyasar.com/pricing', 'رسوم مدى', 'mada fees'),
      (v_moyasar_id, v_visa_id, 2.60, 1.00, 'https://moyasar.com/pricing', 'رسوم فيزا', 'Visa fees'),
      (v_moyasar_id, v_mastercard_id, 2.60, 1.00, 'https://moyasar.com/pricing', 'رسوم ماستركارد', 'Mastercard fees'),
      (v_moyasar_id, v_amex_id, 2.90, 1.00, 'https://moyasar.com/pricing', 'رسوم أمريكان إكسبريس', 'Amex fees'),
      (v_moyasar_id, v_apple_pay_id, 2.60, 1.00, 'https://moyasar.com/pricing', 'رسوم Apple Pay', 'Apple Pay fees')
    ON CONFLICT DO NOTHING;
  END IF;

  -- HYPERPAY FEES
  IF v_hyperpay_id IS NOT NULL AND v_mada_id IS NOT NULL THEN
    INSERT INTO provider_fees (provider_id, payment_method_id, fee_percent, fee_fixed, source_url, notes_ar, notes_en)
    VALUES 
      (v_hyperpay_id, v_mada_id, 1.50, 0.50, 'https://hyperpay.com/pricing', 'رسوم مدى', 'mada fees'),
      (v_hyperpay_id, v_visa_id, 2.40, 0.50, 'https://hyperpay.com/pricing', 'رسوم فيزا', 'Visa fees'),
      (v_hyperpay_id, v_mastercard_id, 2.40, 0.50, 'https://hyperpay.com/pricing', 'رسوم ماستركارد', 'Mastercard fees'),
      (v_hyperpay_id, v_amex_id, 2.90, 0.50, 'https://hyperpay.com/pricing', 'رسوم أمريكان إكسبريس', 'Amex fees'),
      (v_hyperpay_id, v_apple_pay_id, 2.40, 0.50, 'https://hyperpay.com/pricing', 'رسوم Apple Pay', 'Apple Pay fees')
    ON CONFLICT DO NOTHING;
  END IF;

  -- TAP FEES
  IF v_tap_id IS NOT NULL AND v_mada_id IS NOT NULL THEN
    INSERT INTO provider_fees (provider_id, payment_method_id, fee_percent, fee_fixed, source_url, notes_ar, notes_en)
    VALUES 
      (v_tap_id, v_mada_id, 1.90, 0.75, 'https://tap.company/ksa/ar/pricing', 'رسوم مدى', 'mada fees'),
      (v_tap_id, v_visa_id, 2.50, 0.75, 'https://tap.company/ksa/ar/pricing', 'رسوم فيزا', 'Visa fees'),
      (v_tap_id, v_mastercard_id, 2.50, 0.75, 'https://tap.company/ksa/ar/pricing', 'رسوم ماستركارد', 'Mastercard fees'),
      (v_tap_id, v_amex_id, 3.00, 0.75, 'https://tap.company/ksa/ar/pricing', 'رسوم أمريكان إكسبريس', 'Amex fees'),
      (v_tap_id, v_apple_pay_id, 2.50, 0.75, 'https://tap.company/ksa/ar/pricing', 'رسوم Apple Pay', 'Apple Pay fees')
    ON CONFLICT DO NOTHING;
  END IF;

  -- PAYTABS FEES
  IF v_paytabs_id IS NOT NULL AND v_mada_id IS NOT NULL THEN
    INSERT INTO provider_fees (provider_id, payment_method_id, fee_percent, fee_fixed, source_url, notes_ar, notes_en)
    VALUES 
      (v_paytabs_id, v_mada_id, 1.80, 1.00, 'https://paytabs.sa/pricing', 'رسوم مدى', 'mada fees'),
      (v_paytabs_id, v_visa_id, 2.65, 1.00, 'https://paytabs.sa/pricing', 'رسوم فيزا', 'Visa fees'),
      (v_paytabs_id, v_mastercard_id, 2.65, 1.00, 'https://paytabs.sa/pricing', 'رسوم ماستركارد', 'Mastercard fees'),
      (v_paytabs_id, v_amex_id, 3.00, 1.00, 'https://paytabs.sa/pricing', 'رسوم أمريكان إكسبريس', 'Amex fees')
    ON CONFLICT DO NOTHING;
  END IF;

  -- GEIDEA FEES
  IF v_geidea_id IS NOT NULL AND v_mada_id IS NOT NULL THEN
    INSERT INTO provider_fees (provider_id, payment_method_id, fee_percent, fee_fixed, source_url, notes_ar, notes_en)
    VALUES 
      (v_geidea_id, v_mada_id, 1.50, 0.50, 'https://geidea.net/sa/ar/pricing', 'رسوم مدى', 'mada fees'),
      (v_geidea_id, v_visa_id, 2.30, 0.50, 'https://geidea.net/sa/ar/pricing', 'رسوم فيزا', 'Visa fees'),
      (v_geidea_id, v_mastercard_id, 2.30, 0.50, 'https://geidea.net/sa/ar/pricing', 'رسوم ماستركارد', 'Mastercard fees'),
      (v_geidea_id, v_apple_pay_id, 2.30, 0.50, 'https://geidea.net/sa/ar/pricing', 'رسوم Apple Pay', 'Apple Pay fees')
    ON CONFLICT DO NOTHING;
  END IF;

  -- MYFATOORAH FEES
  IF v_myfatoorah_id IS NOT NULL AND v_mada_id IS NOT NULL THEN
    INSERT INTO provider_fees (provider_id, payment_method_id, fee_percent, fee_fixed, source_url, notes_ar, notes_en)
    VALUES 
      (v_myfatoorah_id, v_mada_id, 2.00, 0.50, 'https://myfatoorah.com/pricing', 'رسوم مدى', 'mada fees'),
      (v_myfatoorah_id, v_visa_id, 2.70, 0.50, 'https://myfatoorah.com/pricing', 'رسوم فيزا', 'Visa fees'),
      (v_myfatoorah_id, v_mastercard_id, 2.70, 0.50, 'https://myfatoorah.com/pricing', 'رسوم ماستركارد', 'Mastercard fees'),
      (v_myfatoorah_id, v_apple_pay_id, 2.70, 0.50, 'https://myfatoorah.com/pricing', 'رسوم Apple Pay', 'Apple Pay fees')
    ON CONFLICT DO NOTHING;
  END IF;

  -- TABBY FEES (BNPL)
  IF v_tabby_id IS NOT NULL THEN
    INSERT INTO provider_fees (provider_id, payment_method_id, fee_percent, fee_fixed, source_url, notes_ar, notes_en)
    VALUES 
      (v_tabby_id, NULL, 5.50, 0.00, 'https://tabby.ai/business/pricing', 'رسوم تابي BNPL', 'Tabby BNPL fees')
    ON CONFLICT DO NOTHING;
  END IF;

  -- TAMARA FEES (BNPL)
  IF v_tamara_id IS NOT NULL THEN
    INSERT INTO provider_fees (provider_id, payment_method_id, fee_percent, fee_fixed, source_url, notes_ar, notes_en)
    VALUES 
      (v_tamara_id, NULL, 6.00, 0.00, 'https://tamara.co/business/pricing', 'رسوم تمارا BNPL', 'Tamara BNPL fees')
    ON CONFLICT DO NOTHING;
  END IF;

  -- PAYLINK FEES
  IF v_paylink_id IS NOT NULL AND v_mada_id IS NOT NULL THEN
    INSERT INTO provider_fees (provider_id, payment_method_id, fee_percent, fee_fixed, source_url, notes_ar, notes_en)
    VALUES 
      (v_paylink_id, v_mada_id, 2.00, 1.00, 'https://paylink.sa/pricing', 'رسوم مدى', 'mada fees'),
      (v_paylink_id, v_visa_id, 2.90, 1.00, 'https://paylink.sa/pricing', 'رسوم فيزا', 'Visa fees'),
      (v_paylink_id, v_mastercard_id, 2.90, 1.00, 'https://paylink.sa/pricing', 'رسوم ماستركارد', 'Mastercard fees')
    ON CONFLICT DO NOTHING;
  END IF;

  -- NEARPAY FEES
  IF v_nearpay_id IS NOT NULL AND v_mada_id IS NOT NULL THEN
    INSERT INTO provider_fees (provider_id, payment_method_id, fee_percent, fee_fixed, source_url, notes_ar, notes_en)
    VALUES 
      (v_nearpay_id, v_mada_id, 1.50, 0.00, 'https://nearpay.io/pricing', 'رسوم مدى Tap-to-Phone', 'mada Tap-to-Phone fees'),
      (v_nearpay_id, v_visa_id, 2.20, 0.00, 'https://nearpay.io/pricing', 'رسوم فيزا Tap-to-Phone', 'Visa Tap-to-Phone fees'),
      (v_nearpay_id, v_mastercard_id, 2.20, 0.00, 'https://nearpay.io/pricing', 'رسوم ماستركارد', 'Mastercard fees')
    ON CONFLICT DO NOTHING;
  END IF;

END $$;

-- ============================================
-- 4. PROVIDER INTEGRATIONS
-- ============================================

INSERT INTO provider_integrations (provider_id, platform, integration_type, is_official, official_url, setup_difficulty)
SELECT p.id, i.platform, i.integration_type, i.is_official, i.official_url, i.setup_difficulty
FROM providers p
CROSS JOIN (
  VALUES
    ('moyasar', 'shopify', 'plugin', true, 'https://apps.shopify.com/moyasar', 'easy'),
    ('moyasar', 'woocommerce', 'plugin', true, 'https://wordpress.org/plugins/moyasar-woocommerce', 'easy'),
    ('moyasar', 'salla', 'plugin', true, 'https://salla.sa/integrations/moyasar', 'easy'),
    ('moyasar', 'zid', 'plugin', true, 'https://zid.sa/integrations/moyasar', 'easy'),
    ('moyasar', 'custom_api', 'api', true, 'https://docs.moyasar.com', 'medium'),
    
    ('hyperpay', 'shopify', 'plugin', true, 'https://apps.shopify.com/hyperpay', 'easy'),
    ('hyperpay', 'woocommerce', 'plugin', true, 'https://wordpress.org/plugins/hyperpay', 'easy'),
    ('hyperpay', 'magento', 'plugin', true, 'https://marketplace.magento.com/hyperpay', 'medium'),
    ('hyperpay', 'opencart', 'plugin', true, 'https://www.opencart.com/hyperpay', 'medium'),
    ('hyperpay', 'custom_api', 'api', true, 'https://wordpresshyperpay.docs.oppwa.com', 'medium'),
    
    ('tap', 'shopify', 'plugin', true, 'https://apps.shopify.com/tap-payments', 'easy'),
    ('tap', 'woocommerce', 'plugin', true, 'https://wordpress.org/plugins/tap-payment', 'easy'),
    ('tap', 'salla', 'plugin', true, 'https://salla.sa/integrations/tap', 'easy'),
    ('tap', 'zid', 'plugin', true, 'https://zid.sa/integrations/tap', 'easy'),
    ('tap', 'mobile_sdk', 'sdk', true, 'https://developers.tap.company/docs/mobile-sdk', 'medium'),
    
    ('paytabs', 'shopify', 'plugin', true, 'https://apps.shopify.com/paytabs', 'easy'),
    ('paytabs', 'woocommerce', 'plugin', true, 'https://wordpress.org/plugins/paytabs', 'easy'),
    ('paytabs', 'magento', 'plugin', true, 'https://marketplace.magento.com/paytabs', 'medium'),
    
    ('geidea', 'shopify', 'plugin', true, 'https://apps.shopify.com/geidea', 'easy'),
    ('geidea', 'woocommerce', 'plugin', true, 'https://wordpress.org/plugins/geidea', 'easy'),
    ('geidea', 'pos', 'sdk', true, 'https://docs.geidea.net/pos', 'medium'),
    
    ('myfatoorah', 'shopify', 'plugin', true, 'https://apps.shopify.com/myfatoorah', 'easy'),
    ('myfatoorah', 'woocommerce', 'plugin', true, 'https://wordpress.org/plugins/myfatoorah', 'easy'),
    
    ('tabby', 'shopify', 'plugin', true, 'https://apps.shopify.com/tabby', 'easy'),
    ('tabby', 'woocommerce', 'plugin', true, 'https://wordpress.org/plugins/tabby', 'easy'),
    ('tabby', 'salla', 'plugin', true, 'https://salla.sa/integrations/tabby', 'easy'),
    ('tabby', 'zid', 'plugin', true, 'https://zid.sa/integrations/tabby', 'easy'),
    
    ('tamara', 'shopify', 'plugin', true, 'https://apps.shopify.com/tamara', 'easy'),
    ('tamara', 'woocommerce', 'plugin', true, 'https://wordpress.org/plugins/tamara', 'easy'),
    ('tamara', 'salla', 'plugin', true, 'https://salla.sa/integrations/tamara', 'easy'),
    ('tamara', 'zid', 'plugin', true, 'https://zid.sa/integrations/tamara', 'easy'),
    
    ('paylink', 'woocommerce', 'plugin', true, 'https://wordpress.org/plugins/paylink', 'easy'),
    ('paylink', 'hosted_checkout', 'redirect', true, 'https://paylink.sa/docs', 'easy')
) AS i(provider_slug, platform, integration_type, is_official, official_url, setup_difficulty)
WHERE p.slug = i.provider_slug
ON CONFLICT DO NOTHING;

-- ============================================
-- 5. PROVIDER CURRENCIES
-- ============================================

INSERT INTO provider_currencies (provider_id, currency_code, is_settlement_supported, is_pricing_supported)
SELECT p.id, c.currency_code, c.is_settlement, c.is_pricing
FROM providers p
CROSS JOIN (
  VALUES
    ('moyasar', 'SAR', true, true),
    
    ('hyperpay', 'SAR', true, true),
    ('hyperpay', 'AED', true, true),
    ('hyperpay', 'USD', true, true),
    ('hyperpay', 'EUR', true, true),
    
    ('tap', 'SAR', true, true),
    ('tap', 'AED', true, true),
    ('tap', 'KWD', true, true),
    ('tap', 'BHD', true, true),
    ('tap', 'USD', false, true),
    
    ('paytabs', 'SAR', true, true),
    ('paytabs', 'AED', true, true),
    ('paytabs', 'USD', true, true),
    ('paytabs', 'EUR', true, true),
    
    ('geidea', 'SAR', true, true),
    ('geidea', 'AED', true, true),
    
    ('tabby', 'SAR', true, true),
    ('tabby', 'AED', true, true),
    
    ('tamara', 'SAR', true, true),
    ('tamara', 'AED', true, true),
    
    ('paylink', 'SAR', true, true),
    
    ('nearpay', 'SAR', true, true)
) AS c(provider_slug, currency_code, is_settlement, is_pricing)
WHERE p.slug = c.provider_slug
ON CONFLICT (provider_id, currency_code) DO NOTHING;

-- ============================================
-- 6. PROVIDER WALLETS
-- ============================================

INSERT INTO provider_wallets (provider_id, wallet_type, is_supported, fee_percent, fee_fixed)
SELECT p.id, w.wallet_type, w.is_supported, w.fee_percent, w.fee_fixed
FROM providers p
CROSS JOIN (
  VALUES
    ('moyasar', 'apple_pay', true, 2.60, 1.00),
    ('moyasar', 'stc_pay', true, 2.00, 1.00),
    
    ('hyperpay', 'apple_pay', true, 2.40, 0.50),
    ('hyperpay', 'google_pay', true, 2.40, 0.50),
    ('hyperpay', 'stc_pay', true, 1.80, 0.50),
    
    ('tap', 'apple_pay', true, 2.50, 0.75),
    ('tap', 'google_pay', true, 2.50, 0.75),
    ('tap', 'samsung_pay', true, 2.50, 0.75),
    
    ('geidea', 'apple_pay', true, 2.30, 0.50),
    ('geidea', 'google_pay', true, 2.30, 0.50),
    ('geidea', 'stc_pay', true, 1.80, 0.50)
) AS w(provider_slug, wallet_type, is_supported, fee_percent, fee_fixed)
WHERE p.slug = w.provider_slug
ON CONFLICT (provider_id, wallet_type) DO NOTHING;

-- ============================================
-- 7. PROVIDER BNPL SUPPORT
-- ============================================

INSERT INTO provider_bnpl (provider_id, bnpl_provider, is_integrated, merchant_fee_percent, max_installments, min_order_amount, max_order_amount)
SELECT p.id, b.bnpl_provider, b.is_integrated, b.merchant_fee_percent, b.max_installments, b.min_order_amount, b.max_order_amount
FROM providers p
CROSS JOIN (
  VALUES
    ('moyasar', 'tabby', true, 5.50, 4, 100, 5000),
    ('moyasar', 'tamara', true, 6.00, 4, 100, 5000),
    
    ('hyperpay', 'tabby', true, 5.50, 4, 100, 5000),
    ('hyperpay', 'tamara', true, 6.00, 4, 100, 5000),
    
    ('tap', 'tabby', true, 5.50, 4, 100, 5000),
    ('tap', 'tamara', true, 6.00, 4, 100, 5000),
    
    ('geidea', 'tabby', true, 5.50, 4, 100, 5000),
    ('geidea', 'tamara', true, 6.00, 4, 100, 5000)
) AS b(provider_slug, bnpl_provider, is_integrated, merchant_fee_percent, max_installments, min_order_amount, max_order_amount)
WHERE p.slug = b.provider_slug
ON CONFLICT (provider_id, bnpl_provider) DO NOTHING;

-- ============================================
-- 8. PROVIDER REVIEWS (Sample Data)
-- ============================================

INSERT INTO provider_reviews (provider_id, platform, rating_avg, rating_count, highlights_positive, highlights_negative, source_url)
SELECT p.id, r.platform, r.rating_avg, r.rating_count, r.highlights_positive::jsonb, r.highlights_negative::jsonb, r.source_url
FROM providers p
CROSS JOIN (
  VALUES
    ('moyasar', 'trustpilot', 4.3, 125, '["دعم فني ممتاز", "تفعيل سريع", "سهولة الاستخدام"]', '["رسوم أعلى للحجم الكبير"]', 'https://www.trustpilot.com/review/moyasar.com'),
    ('moyasar', 'google_play', 4.0, 89, '["تطبيق سهل", "دعم عربي"]', '["بعض المشاكل التقنية"]', 'https://play.google.com/store/apps/details?id=com.moyasar'),
    
    ('hyperpay', 'trustpilot', 4.1, 203, '["تغطية واسعة", "دعم 24/7", "استقرار"]', '["إعداد معقد", "وثائق بحاجة تحسين"]', 'https://www.trustpilot.com/review/hyperpay.com'),
    
    ('tap', 'trustpilot', 4.2, 156, '["منصة متكاملة", "API جيد", "دعم BNPL"]', '["أسعار متوسطة"]', 'https://www.trustpilot.com/review/tap.company'),
    
    ('geidea', 'trustpilot', 4.4, 89, '["أجهزة POS ممتازة", "تسوية سريعة", "شركة سعودية"]', '["تركيز على POS"]', 'https://www.trustpilot.com/review/geidea.net'),
    
    ('tabby', 'trustpilot', 4.5, 1250, '["زيادة المبيعات", "سهولة التكامل", "دعم ممتاز"]', '["رسوم مرتفعة"]', 'https://www.trustpilot.com/review/tabby.ai'),
    
    ('tamara', 'trustpilot', 4.4, 980, '["شركة سعودية", "دعم عربي", "تكامل سهل"]', '["حد أدنى للطلب"]', 'https://www.trustpilot.com/review/tamara.co')
) AS r(provider_slug, platform, rating_avg, rating_count, highlights_positive, highlights_negative, source_url)
WHERE p.slug = r.provider_slug
ON CONFLICT (provider_id, platform) DO NOTHING;

-- ============================================
-- 9. PROVIDER SOURCES (Data Provenance)
-- ============================================

INSERT INTO provider_sources (entity_type, entity_id, source_type, source_url, source_name, extracted_fields, confidence_level, last_verified_at)
SELECT 'provider', p.id, s.source_type, s.source_url, s.source_name, s.extracted_fields::jsonb, s.confidence_level, NOW()
FROM providers p
CROSS JOIN (
  VALUES
    ('moyasar', 'official_pricing', 'https://moyasar.com/pricing', 'Moyasar Pricing Page', '{"fees": "transaction fees", "setup_fee": "no setup", "monthly_fee": "no monthly"}', 'high'),
    ('moyasar', 'official_docs', 'https://docs.moyasar.com', 'Moyasar Documentation', '{"api": "REST API", "integrations": "plugins"}', 'high'),
    
    ('hyperpay', 'official_pricing', 'https://hyperpay.com/pricing', 'HyperPay Pricing Page', '{"fees": "transaction fees"}', 'high'),
    ('hyperpay', 'official_docs', 'https://wordpresshyperpay.docs.oppwa.com', 'HyperPay Documentation', '{"api": "REST API"}', 'high'),
    
    ('tap', 'official_pricing', 'https://tap.company/ksa/ar/pricing', 'Tap Pricing Page', '{"fees": "transaction fees"}', 'high'),
    ('tap', 'official_docs', 'https://developers.tap.company', 'Tap Documentation', '{"api": "REST API", "sdk": "mobile"}', 'high'),
    
    ('geidea', 'official_pricing', 'https://geidea.net/sa/ar/pricing', 'Geidea Pricing Page', '{"fees": "transaction fees"}', 'high'),
    
    ('tabby', 'official_pricing', 'https://tabby.ai/business/pricing', 'Tabby Business Pricing', '{"fees": "merchant fees"}', 'high'),
    
    ('tamara', 'official_pricing', 'https://tamara.co/business/pricing', 'Tamara Business Pricing', '{"fees": "merchant fees"}', 'high')
) AS s(provider_slug, source_type, source_url, source_name, extracted_fields, confidence_level)
WHERE p.slug = s.provider_slug
ON CONFLICT DO NOTHING;

-- ============================================
-- 10. UPDATE SCORING WEIGHTS
-- ============================================

INSERT INTO scoring_weights (factor, weight, description, is_active) VALUES
  ('cost', 30, 'إجمالي التكلفة الشهرية', true),
  ('fit', 20, 'مدى ملاءمة المزود للقطاع', true),
  ('ops', 15, 'كفاءة العمليات والتسوية', true),
  ('risk', 15, 'مستوى المخاطر والاستقرار', true),
  ('onboarding_speed', 8, 'سرعة التفعيل', true),
  ('settlement_speed', 8, 'سرعة التحويل', true),
  ('integration_match', 10, 'توافق التكاملات', true),
  ('payment_methods_match', 10, 'توافق طرق الدفع', true),
  ('rating', 10, 'تقييمات المستخدمين', true)
ON CONFLICT (factor) DO UPDATE SET
  weight = EXCLUDED.weight,
  description = EXCLUDED.description;

-- ============================================
-- DONE!
-- ============================================

SELECT 'Provider data seeded successfully!' as message;

