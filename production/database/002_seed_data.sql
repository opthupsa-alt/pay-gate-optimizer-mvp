-- PayGate Optimizer - Seed Data
-- ==============================
-- Database: optg_pay
-- Run this after creating tables

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- ==================== Admin User ====================
-- Password: PayGate@2025 (bcrypt hash)

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
('admin-001', 'مدير النظام', 'admin@op-tg.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Lnq6Vy', 'admin', NOW(), NOW());

-- ==================== Sectors ====================

INSERT INTO `sectors` (`id`, `code`, `name_ar`, `name_en`) VALUES
('sector-001', 'ecommerce', 'التجارة الإلكترونية', 'E-commerce'),
('sector-002', 'retail', 'تجارة التجزئة', 'Retail'),
('sector-003', 'restaurants', 'المطاعم والمقاهي', 'Restaurants & Cafes'),
('sector-004', 'medical', 'الخدمات الطبية', 'Medical Services'),
('sector-005', 'education', 'التعليم والتدريب', 'Education & Training'),
('sector-006', 'travel', 'السفر والسياحة', 'Travel & Tourism'),
('sector-007', 'saas', 'البرمجيات كخدمة', 'SaaS'),
('sector-008', 'professional', 'الخدمات المهنية', 'Professional Services'),
('sector-009', 'real_estate', 'العقارات', 'Real Estate'),
('sector-010', 'beauty', 'الجمال والعناية', 'Beauty & Wellness');

-- ==================== Payment Methods ====================

INSERT INTO `payment_methods` (`id`, `code`, `name_ar`, `name_en`, `category`, `display_order`) VALUES
('pm-001', 'mada', 'مدى', 'Mada', 'debit', 1),
('pm-002', 'visa_mc', 'فيزا / ماستركارد', 'Visa / Mastercard', 'card', 2),
('pm-003', 'apple_pay', 'Apple Pay', 'Apple Pay', 'wallet', 3),
('pm-004', 'google_pay', 'Google Pay', 'Google Pay', 'wallet', 4),
('pm-005', 'stc_pay', 'STC Pay', 'STC Pay', 'wallet', 5),
('pm-006', 'bank_transfer', 'تحويل بنكي', 'Bank Transfer', 'bank', 6),
('pm-007', 'sadad', 'سداد', 'SADAD', 'bank', 7);

-- ==================== Capabilities ====================

INSERT INTO `capabilities` (`id`, `code`, `name_ar`, `name_en`) VALUES
('cap-001', 'recurring', 'الدفعات المتكررة', 'Recurring Payments'),
('cap-002', 'multi_currency', 'العملات المتعددة', 'Multi-Currency'),
('cap-003', 'tokenization', 'حفظ البطاقات', 'Tokenization'),
('cap-004', 'plugins_shopify', 'تكامل Shopify', 'Shopify Plugin'),
('cap-005', 'plugins_woocommerce', 'تكامل WooCommerce', 'WooCommerce Plugin'),
('cap-006', 'plugins_salla', 'تكامل سلة', 'Salla Plugin'),
('cap-007', 'plugins_zid', 'تكامل زد', 'Zid Plugin'),
('cap-008', 'fraud_tools', 'أدوات مكافحة الاحتيال', 'Fraud Prevention');

-- ==================== Scoring Weights ====================

INSERT INTO `scoring_weights` (`id`, `factor`, `weight`, `description`) VALUES
('sw-001', 'cost', 40, 'وزن التكلفة في التقييم'),
('sw-002', 'fit', 30, 'وزن الملاءمة للاحتياجات'),
('sw-003', 'ops', 20, 'وزن جودة العمليات'),
('sw-004', 'risk', 10, 'وزن تقييم المخاطر');

-- ==================== Providers ====================

INSERT INTO `providers` (`id`, `slug`, `name_ar`, `name_en`, `website_url`, `category`, `activation_time_days_min`, `activation_time_days_max`, `settlement_days_min`, `settlement_days_max`, `support_channels`, `notes_ar`, `notes_en`, `is_active`) VALUES
('prov-001', 'moyasar', 'ميسر', 'Moyasar', 'https://moyasar.com', 'payment_gateway', 1, 3, 1, 2, '["email", "phone", "chat", "whatsapp"]', 'بوابة دفع سعودية سريعة التفعيل مع دعم ممتاز', 'Fast Saudi payment gateway with excellent support', 1),
('prov-002', 'tap', 'تاب للمدفوعات', 'Tap Payments', 'https://tap.company', 'payment_gateway', 2, 5, 1, 3, '["email", "phone", "chat"]', 'بوابة إقليمية رائدة مع دعم متعدد العملات', 'Leading regional gateway with multi-currency support', 1),
('prov-003', 'hyperpay', 'هايبر باي', 'HyperPay', 'https://hyperpay.com', 'payment_gateway', 3, 7, 2, 5, '["email", "phone"]', 'معتمدة من البنوك السعودية الكبرى', 'Certified by major Saudi banks', 1),
('prov-004', 'payfort', 'باي فورت', 'PayFort (Amazon)', 'https://payfort.com', 'payment_gateway', 5, 14, 2, 7, '["email", "phone"]', 'مملوكة لأمازون، مناسبة للشركات الكبيرة', 'Owned by Amazon, suitable for enterprises', 1),
('prov-005', 'tabby', 'تابي', 'Tabby', 'https://tabby.ai', 'bnpl', 2, 5, 1, 3, '["email", "chat"]', 'خدمة اشتر الآن وادفع لاحقاً الرائدة', 'Leading BNPL service in the region', 1),
('prov-006', 'tamara', 'تمارا', 'Tamara', 'https://tamara.co', 'bnpl', 2, 5, 1, 3, '["email", "chat", "phone"]', 'تقسيط متوافق مع الشريعة الإسلامية', 'Sharia-compliant installment service', 1),
('prov-007', 'geidea', 'قيديا', 'Geidea', 'https://geidea.net', 'payment_gateway', 3, 10, 1, 3, '["email", "phone", "branches"]', 'حلول نقاط بيع متكاملة مع بوابة دفع', 'Integrated POS solutions with payment gateway', 1),
('prov-008', 'neoleap', 'نيوليب', 'Neoleap', 'https://neoleap.com.sa', 'payment_gateway', 2, 7, 1, 2, '["email", "phone", "chat"]', 'شركة سعودية ناشئة بأسعار تنافسية', 'Saudi fintech startup with competitive pricing', 1),
('prov-009', 'checkout', 'تشيك آوت', 'Checkout.com', 'https://checkout.com', 'payment_gateway', 5, 14, 2, 5, '["email", "phone"]', 'بوابة دفع عالمية للتوسع الدولي', 'Global payment gateway for international expansion', 1),
('prov-010', 'paymob', 'باي موب', 'Paymob', 'https://paymob.com', 'payment_gateway', 3, 7, 2, 4, '["email", "phone", "chat"]', 'بوابة إقليمية بأسعار تنافسية', 'Regional gateway with competitive pricing', 1),
('prov-011', 'stcpay', 'إس تي سي باي', 'STC Pay', 'https://stcpay.com.sa', 'wallet', 3, 10, 1, 3, '["app", "phone", "chat"]', 'محفظة رقمية سعودية رائدة', 'Leading Saudi digital wallet', 1),
('prov-012', 'paylink', 'باي لينك', 'Paylink', 'https://paylink.sa', 'payment_gateway', 1, 3, 1, 2, '["email", "whatsapp", "phone"]', 'تفعيل سريع جداً وروابط دفع بسيطة', 'Very fast activation with simple payment links', 1),
('prov-013', 'myfatoorah', 'ماي فاتورة', 'MyFatoorah', 'https://myfatoorah.com', 'payment_gateway', 2, 5, 2, 4, '["email", "phone", "chat"]', 'بوابة خليجية مع دعم متعدد العملات', 'GCC gateway with multi-currency support', 1),
('prov-014', 'foloosi', 'فلوسي', 'Foloosi', 'https://foloosi.com', 'payment_gateway', 1, 3, 1, 2, '["email", "chat"]', 'بوابة سهلة للمشاريع الصغيرة', 'Easy gateway for small businesses', 1),
('prov-015', 'telr', 'تيلر', 'Telr', 'https://telr.com', 'payment_gateway', 3, 7, 2, 5, '["email", "phone"]', 'بوابة إماراتية مع تغطية خليجية', 'UAE gateway with GCC coverage', 1);

-- ==================== Provider Fees ====================

INSERT INTO `provider_fees` (`id`, `provider_id`, `payment_method_id`, `fee_percent`, `fee_fixed`, `monthly_fee`, `setup_fee`, `chargeback_fee_fixed`, `currency`, `notes_ar`, `notes_en`, `source_url`) VALUES
-- Moyasar
('fee-001', 'prov-001', 'pm-001', 1.75, 1.00, 0, 0, 50, 'SAR', 'رسوم مدى', 'Mada fees', 'https://moyasar.com/pricing'),
('fee-002', 'prov-001', 'pm-002', 2.60, 1.00, 0, 0, 75, 'SAR', 'رسوم البطاقات', 'Cards fees', 'https://moyasar.com/pricing'),
('fee-003', 'prov-001', 'pm-003', 2.60, 1.00, 0, 0, 50, 'SAR', 'رسوم Apple Pay', 'Apple Pay fees', 'https://moyasar.com/pricing'),
-- Tap
('fee-004', 'prov-002', 'pm-001', 1.90, 0.75, 0, 0, 60, 'SAR', 'رسوم مدى', 'Mada fees', 'https://tap.company/pricing'),
('fee-005', 'prov-002', 'pm-002', 2.50, 0.75, 0, 0, 75, 'SAR', 'رسوم البطاقات', 'Cards fees', 'https://tap.company/pricing'),
('fee-006', 'prov-002', 'pm-003', 2.50, 0.75, 0, 0, 60, 'SAR', 'رسوم Apple Pay', 'Apple Pay fees', 'https://tap.company/pricing'),
-- HyperPay
('fee-007', 'prov-003', 'pm-001', 1.50, 0.50, 0, 0, 75, 'SAR', 'رسوم مدى', 'Mada fees', 'https://hyperpay.com/pricing'),
('fee-008', 'prov-003', 'pm-002', 2.40, 0.50, 0, 0, 100, 'SAR', 'رسوم البطاقات', 'Cards fees', 'https://hyperpay.com/pricing'),
-- PayFort
('fee-009', 'prov-004', 'pm-001', 1.60, 0.00, 500, 1000, 100, 'SAR', 'للشركات الكبيرة', 'Enterprise fees', 'https://payfort.com/pricing'),
('fee-010', 'prov-004', 'pm-002', 2.80, 1.50, 0, 0, 125, 'SAR', 'رسوم البطاقات', 'Cards fees', 'https://payfort.com/pricing'),
-- Tabby
('fee-011', 'prov-005', NULL, 5.50, 0.00, 0, 0, 50, 'SAR', 'رسوم BNPL', 'BNPL fees', 'https://tabby.ai/pricing'),
-- Tamara
('fee-012', 'prov-006', NULL, 6.00, 0.00, 0, 0, 50, 'SAR', 'رسوم تقسيط', 'Installment fees', 'https://tamara.co/pricing'),
-- Geidea
('fee-013', 'prov-007', 'pm-001', 1.65, 0.50, 0, 0, 75, 'SAR', 'رسوم مدى', 'Mada fees', 'https://geidea.net/pricing'),
('fee-014', 'prov-007', 'pm-002', 2.70, 0.50, 0, 0, 100, 'SAR', 'رسوم البطاقات', 'Cards fees', 'https://geidea.net/pricing'),
-- Neoleap
('fee-015', 'prov-008', 'pm-001', 1.45, 0.50, 0, 0, 50, 'SAR', 'أسعار منخفضة', 'Low rates', 'https://neoleap.com.sa/pricing'),
('fee-016', 'prov-008', 'pm-002', 2.65, 0.50, 0, 0, 75, 'SAR', 'رسوم البطاقات', 'Cards fees', 'https://neoleap.com.sa/pricing'),
-- Checkout.com
('fee-017', 'prov-009', 'pm-001', 1.80, 0.00, 199, 0, 100, 'SAR', 'للتوسع الدولي', 'International', 'https://checkout.com/pricing'),
('fee-018', 'prov-009', 'pm-002', 2.90, 0.30, 0, 0, 125, 'SAR', 'رسوم دولية', 'International fees', 'https://checkout.com/pricing'),
-- Paymob
('fee-019', 'prov-010', 'pm-001', 1.60, 0.50, 0, 0, 60, 'SAR', 'أسعار إقليمية', 'Regional rates', 'https://paymob.com/pricing'),
('fee-020', 'prov-010', 'pm-002', 2.75, 0.50, 0, 0, 75, 'SAR', 'رسوم البطاقات', 'Cards fees', 'https://paymob.com/pricing'),
-- STC Pay
('fee-021', 'prov-011', 'pm-005', 1.50, 0.00, 0, 0, 50, 'SAR', 'رسوم المحفظة', 'Wallet fees', 'https://stcpay.com.sa'),
-- Paylink
('fee-022', 'prov-012', 'pm-001', 1.75, 0.50, 0, 0, 50, 'SAR', 'تفعيل سريع', 'Fast activation', 'https://paylink.sa/pricing'),
('fee-023', 'prov-012', 'pm-002', 2.90, 1.00, 0, 0, 75, 'SAR', 'رسوم البطاقات', 'Cards fees', 'https://paylink.sa/pricing'),
-- MyFatoorah
('fee-024', 'prov-013', 'pm-001', 1.70, 0.50, 0, 0, 60, 'SAR', 'تغطية خليجية', 'GCC coverage', 'https://myfatoorah.com/pricing'),
('fee-025', 'prov-013', 'pm-002', 2.80, 0.50, 0, 0, 75, 'SAR', 'رسوم البطاقات', 'Cards fees', 'https://myfatoorah.com/pricing'),
-- Foloosi
('fee-026', 'prov-014', 'pm-001', 1.60, 0.50, 0, 0, 50, 'SAR', 'للمشاريع الصغيرة', 'SME rates', 'https://foloosi.com/pricing'),
('fee-027', 'prov-014', 'pm-002', 2.70, 0.50, 0, 0, 60, 'SAR', 'رسوم البطاقات', 'Cards fees', 'https://foloosi.com/pricing'),
-- Telr
('fee-028', 'prov-015', 'pm-001', 1.70, 0.50, 0, 0, 60, 'SAR', 'تغطية خليجية', 'GCC rates', 'https://telr.com/pricing'),
('fee-029', 'prov-015', 'pm-002', 2.85, 0.50, 0, 0, 75, 'SAR', 'رسوم البطاقات', 'Cards fees', 'https://telr.com/pricing');

-- ==================== Provider Payment Methods ====================

INSERT INTO `provider_payment_methods` (`id`, `provider_id`, `payment_method_id`, `is_supported`, `supports_recurring`) VALUES
-- Moyasar
('ppm-001', 'prov-001', 'pm-001', 1, 1),
('ppm-002', 'prov-001', 'pm-002', 1, 1),
('ppm-003', 'prov-001', 'pm-003', 1, 0),
('ppm-004', 'prov-001', 'pm-004', 1, 0),
-- Tap
('ppm-005', 'prov-002', 'pm-001', 1, 1),
('ppm-006', 'prov-002', 'pm-002', 1, 1),
('ppm-007', 'prov-002', 'pm-003', 1, 0),
('ppm-008', 'prov-002', 'pm-004', 1, 0),
-- HyperPay
('ppm-009', 'prov-003', 'pm-001', 1, 1),
('ppm-010', 'prov-003', 'pm-002', 1, 1),
('ppm-011', 'prov-003', 'pm-003', 1, 0),
-- PayFort
('ppm-012', 'prov-004', 'pm-001', 1, 1),
('ppm-013', 'prov-004', 'pm-002', 1, 1),
('ppm-014', 'prov-004', 'pm-003', 1, 0),
-- Geidea
('ppm-015', 'prov-007', 'pm-001', 1, 1),
('ppm-016', 'prov-007', 'pm-002', 1, 1),
('ppm-017', 'prov-007', 'pm-003', 1, 0),
-- Neoleap
('ppm-018', 'prov-008', 'pm-001', 1, 1),
('ppm-019', 'prov-008', 'pm-002', 1, 1),
('ppm-020', 'prov-008', 'pm-003', 1, 0),
-- Paylink
('ppm-021', 'prov-012', 'pm-001', 1, 0),
('ppm-022', 'prov-012', 'pm-002', 1, 0),
('ppm-023', 'prov-012', 'pm-003', 1, 0),
-- MyFatoorah
('ppm-024', 'prov-013', 'pm-001', 1, 1),
('ppm-025', 'prov-013', 'pm-002', 1, 1),
-- Foloosi
('ppm-026', 'prov-014', 'pm-001', 1, 0),
('ppm-027', 'prov-014', 'pm-002', 1, 0),
-- Telr
('ppm-028', 'prov-015', 'pm-001', 1, 1),
('ppm-029', 'prov-015', 'pm-002', 1, 1);

-- ==================== Ops Metrics ====================

INSERT INTO `ops_metrics` (`id`, `provider_id`, `onboarding_score`, `support_score`, `docs_score`) VALUES
('ops-001', 'prov-001', 95, 90, 88),
('ops-002', 'prov-002', 88, 85, 92),
('ops-003', 'prov-003', 75, 82, 85),
('ops-004', 'prov-004', 70, 85, 95),
('ops-005', 'prov-005', 90, 85, 80),
('ops-006', 'prov-006', 88, 82, 78),
('ops-007', 'prov-007', 80, 88, 82),
('ops-008', 'prov-008', 92, 88, 85),
('ops-009', 'prov-009', 72, 80, 95),
('ops-010', 'prov-010', 85, 82, 80),
('ops-011', 'prov-011', 78, 85, 75),
('ops-012', 'prov-012', 98, 90, 80),
('ops-013', 'prov-013', 85, 85, 88),
('ops-014', 'prov-014', 92, 85, 78),
('ops-015', 'prov-015', 80, 82, 85);

-- ==================== Provider Integrations ====================

INSERT INTO `provider_integrations` (`id`, `provider_id`, `platform`, `integration_type`, `is_official`, `setup_difficulty`, `notes_ar`, `notes_en`) VALUES
-- Moyasar
('int-001', 'prov-001', 'shopify', 'plugin', 1, 'easy', 'تكامل رسمي', 'Official'),
('int-002', 'prov-001', 'woocommerce', 'plugin', 1, 'easy', 'تكامل رسمي', 'Official'),
('int-003', 'prov-001', 'salla', 'plugin', 1, 'easy', 'تكامل مع سلة', 'Salla'),
('int-004', 'prov-001', 'zid', 'plugin', 1, 'easy', 'تكامل مع زد', 'Zid'),
-- Tap
('int-005', 'prov-002', 'shopify', 'plugin', 1, 'easy', 'تكامل رسمي', 'Official'),
('int-006', 'prov-002', 'woocommerce', 'plugin', 1, 'easy', 'تكامل رسمي', 'Official'),
('int-007', 'prov-002', 'salla', 'plugin', 1, 'easy', 'تكامل مع سلة', 'Salla'),
-- HyperPay
('int-008', 'prov-003', 'shopify', 'plugin', 1, 'easy', 'تكامل رسمي', 'Official'),
('int-009', 'prov-003', 'woocommerce', 'plugin', 1, 'easy', 'تكامل رسمي', 'Official'),
('int-010', 'prov-003', 'magento', 'plugin', 1, 'medium', 'تكامل رسمي', 'Official'),
-- Geidea
('int-011', 'prov-007', 'shopify', 'plugin', 1, 'easy', 'تكامل رسمي', 'Official'),
('int-012', 'prov-007', 'salla', 'plugin', 1, 'easy', 'تكامل مع سلة', 'Salla'),
-- Paylink
('int-013', 'prov-012', 'shopify', 'plugin', 1, 'easy', 'تكامل رسمي', 'Official'),
('int-014', 'prov-012', 'salla', 'plugin', 1, 'easy', 'تكامل مع سلة', 'Salla'),
('int-015', 'prov-012', 'zid', 'plugin', 1, 'easy', 'تكامل مع زد', 'Zid');

-- ==================== Provider Reviews ====================

INSERT INTO `provider_reviews` (`id`, `provider_id`, `platform`, `rating_avg`, `rating_count`, `highlights_positive`, `highlights_negative`, `source_url`) VALUES
('rev-001', 'prov-001', 'trustpilot', 4.30, 125, '["دعم فني ممتاز", "تفعيل سريع", "سهولة الاستخدام"]', '["رسوم أعلى للحجم الكبير"]', 'https://trustpilot.com/moyasar'),
('rev-002', 'prov-002', 'trustpilot', 4.20, 156, '["منصة متكاملة", "API جيد", "دعم BNPL"]', '["أسعار متوسطة"]', 'https://trustpilot.com/tap'),
('rev-003', 'prov-003', 'trustpilot', 4.10, 203, '["تغطية واسعة", "دعم 24/7", "استقرار"]', '["إعداد معقد"]', 'https://trustpilot.com/hyperpay'),
('rev-004', 'prov-005', 'trustpilot', 4.50, 1250, '["زيادة المبيعات", "سهولة التكامل"]', '["رسوم مرتفعة"]', 'https://trustpilot.com/tabby'),
('rev-005', 'prov-006', 'trustpilot', 4.40, 980, '["شركة سعودية", "دعم عربي"]', '["حد أدنى للطلب"]', 'https://trustpilot.com/tamara'),
('rev-006', 'prov-007', 'trustpilot', 4.00, 340, '["فروع محلية", "نقاط بيع متكاملة"]', '["تفعيل يأخذ وقت"]', 'https://trustpilot.com/geidea'),
('rev-007', 'prov-008', 'trustpilot', 4.40, 85, '["أسعار منخفضة", "شركة سعودية"]', '["شركة جديدة"]', 'https://trustpilot.com/neoleap'),
('rev-008', 'prov-012', 'trustpilot', 4.50, 420, '["تفعيل سريع جداً", "سهولة الاستخدام"]', '["مميزات محدودة"]', 'https://trustpilot.com/paylink');

-- ==================== Provider Capabilities ====================

INSERT INTO `provider_capabilities` (`id`, `provider_id`, `capability_id`) VALUES
-- Moyasar
('pc-001', 'prov-001', 'cap-001'),
('pc-002', 'prov-001', 'cap-003'),
('pc-003', 'prov-001', 'cap-004'),
('pc-004', 'prov-001', 'cap-005'),
('pc-005', 'prov-001', 'cap-006'),
('pc-006', 'prov-001', 'cap-007'),
-- Tap
('pc-007', 'prov-002', 'cap-001'),
('pc-008', 'prov-002', 'cap-002'),
('pc-009', 'prov-002', 'cap-003'),
('pc-010', 'prov-002', 'cap-004'),
('pc-011', 'prov-002', 'cap-005'),
('pc-012', 'prov-002', 'cap-008'),
-- HyperPay
('pc-013', 'prov-003', 'cap-001'),
('pc-014', 'prov-003', 'cap-002'),
('pc-015', 'prov-003', 'cap-003'),
('pc-016', 'prov-003', 'cap-008'),
-- PayFort
('pc-017', 'prov-004', 'cap-001'),
('pc-018', 'prov-004', 'cap-002'),
('pc-019', 'prov-004', 'cap-003'),
('pc-020', 'prov-004', 'cap-008'),
-- Paylink
('pc-021', 'prov-012', 'cap-004'),
('pc-022', 'prov-012', 'cap-005'),
('pc-023', 'prov-012', 'cap-006'),
('pc-024', 'prov-012', 'cap-007');

-- ==================== Done ====================
SELECT 'Database seeded successfully!' as message;

