// Mock data for local development without Supabase
// Extended with comprehensive provider data

import type { 
  Sector, 
  Provider, 
  PaymentMethod, 
  Capability,
  ProviderWithRelations,
  PricingRule,
  ProviderPaymentMethod,
  ProviderCapability,
  ProviderSectorRule,
  OpsMetrics,
  ScoringWeights,
  ProviderFee,
  ProviderIntegration,
  ProviderReview,
  ProviderSource,
  ProviderWallet,
  ProviderBnpl,
  ProviderCurrency,
} from "./types"

// Sectors - القطاعات
export const mockSectors: Sector[] = [
  {
    id: "sector-1",
    code: "ecommerce",
    name_ar: "التجارة الإلكترونية",
    name_en: "E-commerce",
    created_at: new Date().toISOString(),
  },
  {
    id: "sector-2",
    code: "retail",
    name_ar: "تجارة التجزئة",
    name_en: "Retail",
    created_at: new Date().toISOString(),
  },
  {
    id: "sector-3",
    code: "restaurants",
    name_ar: "المطاعم والمقاهي",
    name_en: "Restaurants & Cafes",
    created_at: new Date().toISOString(),
  },
  {
    id: "sector-4",
    code: "medical",
    name_ar: "الخدمات الطبية",
    name_en: "Medical Services",
    created_at: new Date().toISOString(),
  },
  {
    id: "sector-5",
    code: "education",
    name_ar: "التعليم والتدريب",
    name_en: "Education & Training",
    created_at: new Date().toISOString(),
  },
  {
    id: "sector-6",
    code: "travel",
    name_ar: "السفر والسياحة",
    name_en: "Travel & Tourism",
    created_at: new Date().toISOString(),
  },
  {
    id: "sector-7",
    code: "saas",
    name_ar: "البرمجيات كخدمة",
    name_en: "SaaS",
    created_at: new Date().toISOString(),
  },
  {
    id: "sector-8",
    code: "professional_services",
    name_ar: "الخدمات المهنية",
    name_en: "Professional Services",
    created_at: new Date().toISOString(),
  },
  {
    id: "sector-9",
    code: "real_estate",
    name_ar: "العقارات",
    name_en: "Real Estate",
    created_at: new Date().toISOString(),
  },
  {
    id: "sector-10",
    code: "beauty",
    name_ar: "الجمال والعناية",
    name_en: "Beauty & Wellness",
    created_at: new Date().toISOString(),
  },
]

// Payment Methods - طرق الدفع
export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "pm-1",
    code: "mada",
    name_ar: "مدى",
    name_en: "Mada",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "pm-2",
    code: "visa_mc",
    name_ar: "فيزا / ماستركارد",
    name_en: "Visa / Mastercard",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "pm-3",
    code: "apple_pay",
    name_ar: "Apple Pay",
    name_en: "Apple Pay",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "pm-4",
    code: "google_pay",
    name_ar: "Google Pay",
    name_en: "Google Pay",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "pm-5",
    code: "bank_transfer",
    name_ar: "التحويل البنكي",
    name_en: "Bank Transfer",
    is_active: true,
    created_at: new Date().toISOString(),
  },
]

// Capabilities - المميزات
export const mockCapabilities: Capability[] = [
  { id: "cap-1", code: "recurring", name_ar: "الدفعات المتكررة", name_en: "Recurring Payments", created_at: new Date().toISOString() },
  { id: "cap-2", code: "multi_currency", name_ar: "العملات المتعددة", name_en: "Multi-Currency", created_at: new Date().toISOString() },
  { id: "cap-3", code: "tokenization", name_ar: "حفظ البطاقات", name_en: "Tokenization", created_at: new Date().toISOString() },
  { id: "cap-4", code: "plugins_shopify", name_ar: "تكامل Shopify", name_en: "Shopify Plugin", created_at: new Date().toISOString() },
  { id: "cap-5", code: "plugins_woocommerce", name_ar: "تكامل WooCommerce", name_en: "WooCommerce Plugin", created_at: new Date().toISOString() },
  { id: "cap-6", code: "fraud_tools", name_ar: "أدوات مكافحة الاحتيال", name_en: "Fraud Prevention", created_at: new Date().toISOString() },
]

// Providers - مزودي الخدمة (بيانات حقيقية للمزودين السعوديين)
export const mockProviders: Provider[] = [
  {
    id: "prov-1",
    slug: "moyasar",
    name_ar: "ميسر",
    name_en: "Moyasar",
    website_url: "https://moyasar.com",
    logo_path: "/logos/moyasar.svg",
    activation_time_days_min: 1,
    activation_time_days_max: 3,
    settlement_days_min: 1,
    settlement_days_max: 2,
    support_channels: ["email", "phone", "chat", "whatsapp"],
    notes_ar: "بوابة دفع سعودية سريعة التفعيل مع دعم ممتاز ومتوافقة مع معايير PCI DSS",
    notes_en: "Fast Saudi payment gateway with excellent support and PCI DSS compliant",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prov-2",
    slug: "tap",
    name_ar: "تاب للمدفوعات",
    name_en: "Tap Payments",
    website_url: "https://tap.company",
    logo_path: "/logos/tap.svg",
    activation_time_days_min: 2,
    activation_time_days_max: 5,
    settlement_days_min: 1,
    settlement_days_max: 3,
    support_channels: ["email", "phone", "chat"],
    notes_ar: "بوابة إقليمية رائدة مع دعم متعدد العملات وتغطية في 8 دول",
    notes_en: "Leading regional gateway with multi-currency support covering 8 countries",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prov-3",
    slug: "hyperpay",
    name_ar: "هايبر باي",
    name_en: "HyperPay",
    website_url: "https://hyperpay.com",
    logo_path: "/logos/hyperpay.svg",
    activation_time_days_min: 3,
    activation_time_days_max: 7,
    settlement_days_min: 2,
    settlement_days_max: 5,
    support_channels: ["email", "phone"],
    notes_ar: "معتمدة من البنوك السعودية الكبرى مع حلول متكاملة للشركات",
    notes_en: "Certified by major Saudi banks with integrated enterprise solutions",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prov-4",
    slug: "payfort",
    name_ar: "باي فورت",
    name_en: "PayFort (Amazon)",
    website_url: "https://payfort.com",
    logo_path: "/logos/payfort.svg",
    activation_time_days_min: 5,
    activation_time_days_max: 14,
    settlement_days_min: 2,
    settlement_days_max: 7,
    support_channels: ["email", "phone"],
    notes_ar: "مملوكة لأمازون، مناسبة للشركات الكبيرة مع حلول مكافحة الاحتيال المتقدمة",
    notes_en: "Owned by Amazon, suitable for enterprises with advanced fraud prevention",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prov-5",
    slug: "tabby",
    name_ar: "تابي",
    name_en: "Tabby",
    website_url: "https://tabby.ai",
    logo_path: "/logos/tabby.svg",
    activation_time_days_min: 2,
    activation_time_days_max: 5,
    settlement_days_min: 1,
    settlement_days_max: 3,
    support_channels: ["email", "chat"],
    notes_ar: "خدمة اشتر الآن وادفع لاحقاً الرائدة في المنطقة - تقسيط بدون فوائد",
    notes_en: "Leading BNPL service in the region - interest-free installments",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prov-6",
    slug: "tamara",
    name_ar: "تمارا",
    name_en: "Tamara",
    website_url: "https://tamara.co",
    logo_path: "/logos/tamara.svg",
    activation_time_days_min: 2,
    activation_time_days_max: 5,
    settlement_days_min: 1,
    settlement_days_max: 3,
    support_channels: ["email", "chat", "phone"],
    notes_ar: "خدمة تقسيط متوافقة مع الشريعة الإسلامية - تقسيط حتى 4 دفعات",
    notes_en: "Sharia-compliant installment service - split into up to 4 payments",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prov-7",
    slug: "geidea",
    name_ar: "قيديا",
    name_en: "Geidea",
    website_url: "https://geidea.net",
    logo_path: "/logos/geidea.svg",
    activation_time_days_min: 3,
    activation_time_days_max: 10,
    settlement_days_min: 1,
    settlement_days_max: 3,
    support_channels: ["email", "phone", "branches"],
    notes_ar: "حلول نقاط بيع متكاملة مع بوابة دفع إلكتروني - دعم محلي قوي وفروع في جميع أنحاء المملكة",
    notes_en: "Integrated POS solutions with online payment gateway - strong local support with branches across KSA",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prov-8",
    slug: "neoleap",
    name_ar: "نيوليب",
    name_en: "Neoleap",
    website_url: "https://neoleap.com.sa",
    logo_path: "/logos/neoleap.svg",
    activation_time_days_min: 2,
    activation_time_days_max: 7,
    settlement_days_min: 1,
    settlement_days_max: 2,
    support_channels: ["email", "phone", "chat"],
    notes_ar: "شركة سعودية ناشئة تركز على التكنولوجيا المالية - أسعار تنافسية وتكامل سهل",
    notes_en: "Saudi fintech startup focused on modern payment solutions - competitive pricing and easy integration",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prov-9",
    slug: "checkout",
    name_ar: "تشيك آوت",
    name_en: "Checkout.com",
    website_url: "https://checkout.com",
    logo_path: "/logos/checkout.svg",
    activation_time_days_min: 5,
    activation_time_days_max: 14,
    settlement_days_min: 2,
    settlement_days_max: 5,
    support_channels: ["email", "phone"],
    notes_ar: "بوابة دفع عالمية رائدة مع تغطية في أكثر من 150 دولة - مناسبة للتوسع الدولي",
    notes_en: "Leading global payment gateway with coverage in 150+ countries - ideal for international expansion",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prov-10",
    slug: "paymob",
    name_ar: "باي موب",
    name_en: "Paymob",
    website_url: "https://paymob.com",
    logo_path: "/logos/paymob.svg",
    activation_time_days_min: 3,
    activation_time_days_max: 7,
    settlement_days_min: 2,
    settlement_days_max: 4,
    support_channels: ["email", "phone", "chat"],
    notes_ar: "بوابة دفع إقليمية مع تركيز على الشرق الأوسط وشمال أفريقيا - أسعار تنافسية",
    notes_en: "Regional payment gateway focusing on MENA region - competitive pricing",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prov-11",
    slug: "stcpay",
    name_ar: "إس تي سي باي",
    name_en: "STC Pay",
    website_url: "https://stcpay.com.sa",
    logo_path: "/logos/stcpay.svg",
    activation_time_days_min: 3,
    activation_time_days_max: 10,
    settlement_days_min: 1,
    settlement_days_max: 3,
    support_channels: ["app", "phone", "chat"],
    notes_ar: "محفظة رقمية سعودية رائدة مع قاعدة مستخدمين ضخمة - تكامل مع نقاط البيع",
    notes_en: "Leading Saudi digital wallet with massive user base - POS integration available",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prov-12",
    slug: "paylink",
    name_ar: "باي لينك",
    name_en: "Paylink",
    website_url: "https://paylink.sa",
    logo_path: "/logos/paylink.svg",
    activation_time_days_min: 1,
    activation_time_days_max: 3,
    settlement_days_min: 1,
    settlement_days_max: 2,
    support_channels: ["email", "whatsapp", "phone"],
    notes_ar: "بوابة سعودية سهلة الاستخدام - تفعيل سريع جداً وروابط دفع بسيطة",
    notes_en: "Easy-to-use Saudi gateway - very fast activation and simple payment links",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prov-13",
    slug: "myfatoorah",
    name_ar: "ماي فاتورة",
    name_en: "MyFatoorah",
    website_url: "https://myfatoorah.com",
    logo_path: "/logos/myfatoorah.svg",
    activation_time_days_min: 2,
    activation_time_days_max: 5,
    settlement_days_min: 2,
    settlement_days_max: 4,
    support_channels: ["email", "phone", "chat"],
    notes_ar: "بوابة كويتية إقليمية مع حضور قوي في الخليج - دعم متعدد العملات",
    notes_en: "Kuwaiti regional gateway with strong GCC presence - multi-currency support",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prov-14",
    slug: "foloosi",
    name_ar: "فلوسي",
    name_en: "Foloosi",
    website_url: "https://foloosi.com",
    logo_path: "/logos/foloosi.svg",
    activation_time_days_min: 1,
    activation_time_days_max: 3,
    settlement_days_min: 1,
    settlement_days_max: 2,
    support_channels: ["email", "chat"],
    notes_ar: "بوابة دفع سهلة ومرنة - مناسبة للمشاريع الصغيرة والمتوسطة",
    notes_en: "Easy and flexible payment gateway - suitable for SMEs",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prov-15",
    slug: "telr",
    name_ar: "تيلر",
    name_en: "Telr",
    website_url: "https://telr.com",
    logo_path: "/logos/telr.svg",
    activation_time_days_min: 3,
    activation_time_days_max: 7,
    settlement_days_min: 2,
    settlement_days_max: 5,
    support_channels: ["email", "phone"],
    notes_ar: "بوابة إماراتية مع تغطية خليجية - دعم للعملات المتعددة والمحافظ الرقمية",
    notes_en: "UAE-based gateway with GCC coverage - multi-currency and digital wallet support",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// Pricing Rules - قواعد التسعير (بيانات تقريبية - يجب التحقق من المزود)
export const mockPricingRules: PricingRule[] = [
  // Moyasar - أسعار تنافسية للشركات الصغيرة والمتوسطة
  { id: "pr-1", provider_id: "prov-1", payment_method_id: "pm-1", currency: "SAR", fee_percent: 1.5, fee_fixed: 0, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, chargeback_fee_fixed: 50, minimum_fee_per_txn: null, maximum_fee_per_txn: null, notes_ar: "بدون رسوم شهرية", notes_en: "No monthly fees", effective_from: null, effective_to: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "pr-2", provider_id: "prov-1", payment_method_id: "pm-2", currency: "SAR", fee_percent: 2.75, fee_fixed: 1, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, chargeback_fee_fixed: 75, minimum_fee_per_txn: null, maximum_fee_per_txn: null, notes_ar: null, notes_en: null, effective_from: null, effective_to: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "pr-3", provider_id: "prov-1", payment_method_id: "pm-3", currency: "SAR", fee_percent: 2.0, fee_fixed: 0.5, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, chargeback_fee_fixed: 50, minimum_fee_per_txn: null, maximum_fee_per_txn: null, notes_ar: null, notes_en: null, effective_from: null, effective_to: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // Tap - أسعار متوسطة مع مميزات إضافية
  { id: "pr-5", provider_id: "prov-2", payment_method_id: "pm-1", currency: "SAR", fee_percent: 1.75, fee_fixed: 0, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, chargeback_fee_fixed: 60, minimum_fee_per_txn: null, maximum_fee_per_txn: null, notes_ar: null, notes_en: null, effective_from: null, effective_to: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "pr-6", provider_id: "prov-2", payment_method_id: "pm-2", currency: "SAR", fee_percent: 2.9, fee_fixed: 1, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, chargeback_fee_fixed: 75, minimum_fee_per_txn: null, maximum_fee_per_txn: null, notes_ar: null, notes_en: null, effective_from: null, effective_to: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "pr-7", provider_id: "prov-2", payment_method_id: "pm-3", currency: "SAR", fee_percent: 2.25, fee_fixed: 0.5, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, chargeback_fee_fixed: 50, minimum_fee_per_txn: null, maximum_fee_per_txn: null, notes_ar: null, notes_en: null, effective_from: null, effective_to: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "pr-8", provider_id: "prov-2", payment_method_id: "pm-4", currency: "SAR", fee_percent: 2.25, fee_fixed: 0.5, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, chargeback_fee_fixed: 50, minimum_fee_per_txn: null, maximum_fee_per_txn: null, notes_ar: null, notes_en: null, effective_from: null, effective_to: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // HyperPay - أسعار منخفضة للعمليات مع رسوم شهرية
  { id: "pr-9", provider_id: "prov-3", payment_method_id: "pm-1", currency: "SAR", fee_percent: 1.4, fee_fixed: 0, monthly_fee: 299, setup_fee: 0, refund_fee_fixed: 0, chargeback_fee_fixed: 75, minimum_fee_per_txn: null, maximum_fee_per_txn: null, notes_ar: "مناسب للأحجام الكبيرة", notes_en: "Suitable for high volumes", effective_from: null, effective_to: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "pr-10", provider_id: "prov-3", payment_method_id: "pm-2", currency: "SAR", fee_percent: 2.6, fee_fixed: 1, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, chargeback_fee_fixed: 100, minimum_fee_per_txn: null, maximum_fee_per_txn: null, notes_ar: null, notes_en: null, effective_from: null, effective_to: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "pr-11", provider_id: "prov-3", payment_method_id: "pm-3", currency: "SAR", fee_percent: 2.0, fee_fixed: 0.5, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, chargeback_fee_fixed: 75, minimum_fee_per_txn: null, maximum_fee_per_txn: null, notes_ar: null, notes_en: null, effective_from: null, effective_to: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // PayFort - للشركات الكبيرة مع رسوم إعداد
  { id: "pr-12", provider_id: "prov-4", payment_method_id: "pm-1", currency: "SAR", fee_percent: 1.6, fee_fixed: 0, monthly_fee: 500, setup_fee: 1000, refund_fee_fixed: 5, chargeback_fee_fixed: 100, minimum_fee_per_txn: 1, maximum_fee_per_txn: null, notes_ar: "للشركات الكبيرة", notes_en: "For enterprises", effective_from: null, effective_to: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "pr-13", provider_id: "prov-4", payment_method_id: "pm-2", currency: "SAR", fee_percent: 2.8, fee_fixed: 1.5, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 5, chargeback_fee_fixed: 125, minimum_fee_per_txn: 1.5, maximum_fee_per_txn: null, notes_ar: null, notes_en: null, effective_from: null, effective_to: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "pr-14", provider_id: "prov-4", payment_method_id: "pm-3", currency: "SAR", fee_percent: 2.3, fee_fixed: 1, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 5, chargeback_fee_fixed: 100, minimum_fee_per_txn: 1, maximum_fee_per_txn: null, notes_ar: null, notes_en: null, effective_from: null, effective_to: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "pr-15", provider_id: "prov-4", payment_method_id: "pm-4", currency: "SAR", fee_percent: 2.3, fee_fixed: 1, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 5, chargeback_fee_fixed: 100, minimum_fee_per_txn: 1, maximum_fee_per_txn: null, notes_ar: null, notes_en: null, effective_from: null, effective_to: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // Tabby - BNPL (التاجر يدفع نسبة أعلى)
  { id: "pr-16", provider_id: "prov-5", payment_method_id: "pm-2", currency: "SAR", fee_percent: 5.0, fee_fixed: 0, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, chargeback_fee_fixed: 50, minimum_fee_per_txn: null, maximum_fee_per_txn: null, notes_ar: "اشتر الآن وادفع لاحقاً", notes_en: "Buy Now Pay Later", effective_from: null, effective_to: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // Tamara - BNPL
  { id: "pr-17", provider_id: "prov-6", payment_method_id: "pm-2", currency: "SAR", fee_percent: 4.5, fee_fixed: 0, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, chargeback_fee_fixed: 50, minimum_fee_per_txn: null, maximum_fee_per_txn: null, notes_ar: "تقسيط متوافق مع الشريعة", notes_en: "Sharia-compliant installments", effective_from: null, effective_to: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // Geidea
  { id: "pr-18", provider_id: "prov-7", payment_method_id: "pm-1", currency: "SAR", fee_percent: 1.65, fee_fixed: 0, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, chargeback_fee_fixed: 75, minimum_fee_per_txn: null, maximum_fee_per_txn: null, notes_ar: "أسعار تنافسية للمدى", notes_en: "Competitive Mada rates", effective_from: null, effective_to: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "pr-19", provider_id: "prov-7", payment_method_id: "pm-2", currency: "SAR", fee_percent: 2.7, fee_fixed: 0.5, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, chargeback_fee_fixed: 100, minimum_fee_per_txn: null, maximum_fee_per_txn: null, notes_ar: null, notes_en: null, effective_from: null, effective_to: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "pr-20", provider_id: "prov-7", payment_method_id: "pm-3", currency: "SAR", fee_percent: 2.2, fee_fixed: 0.5, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, chargeback_fee_fixed: 75, minimum_fee_per_txn: null, maximum_fee_per_txn: null, notes_ar: null, notes_en: null, effective_from: null, effective_to: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // Neoleap
  { id: "pr-21", provider_id: "prov-8", payment_method_id: "pm-1", currency: "SAR", fee_percent: 1.45, fee_fixed: 0, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, chargeback_fee_fixed: 50, minimum_fee_per_txn: null, maximum_fee_per_txn: null, notes_ar: "أسعار منخفضة للشركات الناشئة", notes_en: "Low rates for startups", effective_from: null, effective_to: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "pr-22", provider_id: "prov-8", payment_method_id: "pm-2", currency: "SAR", fee_percent: 2.65, fee_fixed: 0.5, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, chargeback_fee_fixed: 75, minimum_fee_per_txn: null, maximum_fee_per_txn: null, notes_ar: null, notes_en: null, effective_from: null, effective_to: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "pr-23", provider_id: "prov-8", payment_method_id: "pm-3", currency: "SAR", fee_percent: 2.0, fee_fixed: 0.5, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, chargeback_fee_fixed: 50, minimum_fee_per_txn: null, maximum_fee_per_txn: null, notes_ar: null, notes_en: null, effective_from: null, effective_to: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // Checkout.com
  { id: "pr-24", provider_id: "prov-9", payment_method_id: "pm-1", currency: "SAR", fee_percent: 1.8, fee_fixed: 0, monthly_fee: 199, setup_fee: 0, refund_fee_fixed: 0, chargeback_fee_fixed: 100, minimum_fee_per_txn: 1, maximum_fee_per_txn: null, notes_ar: "للتوسع الدولي", notes_en: "For international expansion", effective_from: null, effective_to: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "pr-25", provider_id: "prov-9", payment_method_id: "pm-2", currency: "SAR", fee_percent: 2.9, fee_fixed: 0.3, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, chargeback_fee_fixed: 125, minimum_fee_per_txn: 1, maximum_fee_per_txn: null, notes_ar: null, notes_en: null, effective_from: null, effective_to: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "pr-26", provider_id: "prov-9", payment_method_id: "pm-3", currency: "SAR", fee_percent: 2.3, fee_fixed: 0.3, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, chargeback_fee_fixed: 100, minimum_fee_per_txn: 1, maximum_fee_per_txn: null, notes_ar: null, notes_en: null, effective_from: null, effective_to: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // Paymob
  { id: "pr-27", provider_id: "prov-10", payment_method_id: "pm-1", currency: "SAR", fee_percent: 1.6, fee_fixed: 0, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, chargeback_fee_fixed: 60, minimum_fee_per_txn: null, maximum_fee_per_txn: null, notes_ar: "أسعار إقليمية تنافسية", notes_en: "Competitive regional rates", effective_from: null, effective_to: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "pr-28", provider_id: "prov-10", payment_method_id: "pm-2", currency: "SAR", fee_percent: 2.75, fee_fixed: 0.5, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, chargeback_fee_fixed: 75, minimum_fee_per_txn: null, maximum_fee_per_txn: null, notes_ar: null, notes_en: null, effective_from: null, effective_to: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // STC Pay
  { id: "pr-29", provider_id: "prov-11", payment_method_id: "pm-1", currency: "SAR", fee_percent: 1.5, fee_fixed: 0, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, chargeback_fee_fixed: 50, minimum_fee_per_txn: null, maximum_fee_per_txn: null, notes_ar: "محفظة رقمية سعودية", notes_en: "Saudi digital wallet", effective_from: null, effective_to: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // Paylink
  { id: "pr-30", provider_id: "prov-12", payment_method_id: "pm-1", currency: "SAR", fee_percent: 1.75, fee_fixed: 0, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, chargeback_fee_fixed: 50, minimum_fee_per_txn: null, maximum_fee_per_txn: null, notes_ar: "سهل وسريع", notes_en: "Easy and fast", effective_from: null, effective_to: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "pr-31", provider_id: "prov-12", payment_method_id: "pm-2", currency: "SAR", fee_percent: 2.9, fee_fixed: 1, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, chargeback_fee_fixed: 75, minimum_fee_per_txn: null, maximum_fee_per_txn: null, notes_ar: null, notes_en: null, effective_from: null, effective_to: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "pr-32", provider_id: "prov-12", payment_method_id: "pm-3", currency: "SAR", fee_percent: 2.2, fee_fixed: 0.5, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, chargeback_fee_fixed: 50, minimum_fee_per_txn: null, maximum_fee_per_txn: null, notes_ar: null, notes_en: null, effective_from: null, effective_to: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // MyFatoorah
  { id: "pr-33", provider_id: "prov-13", payment_method_id: "pm-1", currency: "SAR", fee_percent: 1.7, fee_fixed: 0, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, chargeback_fee_fixed: 60, minimum_fee_per_txn: null, maximum_fee_per_txn: null, notes_ar: "تغطية خليجية", notes_en: "GCC coverage", effective_from: null, effective_to: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "pr-34", provider_id: "prov-13", payment_method_id: "pm-2", currency: "SAR", fee_percent: 2.8, fee_fixed: 0.5, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, chargeback_fee_fixed: 75, minimum_fee_per_txn: null, maximum_fee_per_txn: null, notes_ar: null, notes_en: null, effective_from: null, effective_to: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "pr-35", provider_id: "prov-13", payment_method_id: "pm-3", currency: "SAR", fee_percent: 2.2, fee_fixed: 0.5, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, chargeback_fee_fixed: 60, minimum_fee_per_txn: null, maximum_fee_per_txn: null, notes_ar: null, notes_en: null, effective_from: null, effective_to: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // Foloosi
  { id: "pr-36", provider_id: "prov-14", payment_method_id: "pm-1", currency: "SAR", fee_percent: 1.6, fee_fixed: 0, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, chargeback_fee_fixed: 50, minimum_fee_per_txn: null, maximum_fee_per_txn: null, notes_ar: "للمشاريع الصغيرة", notes_en: "For small businesses", effective_from: null, effective_to: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "pr-37", provider_id: "prov-14", payment_method_id: "pm-2", currency: "SAR", fee_percent: 2.7, fee_fixed: 0.5, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, chargeback_fee_fixed: 60, minimum_fee_per_txn: null, maximum_fee_per_txn: null, notes_ar: null, notes_en: null, effective_from: null, effective_to: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // Telr
  { id: "pr-38", provider_id: "prov-15", payment_method_id: "pm-1", currency: "SAR", fee_percent: 1.7, fee_fixed: 0, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, chargeback_fee_fixed: 60, minimum_fee_per_txn: null, maximum_fee_per_txn: null, notes_ar: "تغطية خليجية", notes_en: "GCC coverage", effective_from: null, effective_to: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "pr-39", provider_id: "prov-15", payment_method_id: "pm-2", currency: "SAR", fee_percent: 2.85, fee_fixed: 0.5, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, chargeback_fee_fixed: 75, minimum_fee_per_txn: null, maximum_fee_per_txn: null, notes_ar: null, notes_en: null, effective_from: null, effective_to: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "pr-40", provider_id: "prov-15", payment_method_id: "pm-3", currency: "SAR", fee_percent: 2.2, fee_fixed: 0.5, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, chargeback_fee_fixed: 60, minimum_fee_per_txn: null, maximum_fee_per_txn: null, notes_ar: null, notes_en: null, effective_from: null, effective_to: null, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
]

// Provider Payment Methods
export const mockProviderPaymentMethods: ProviderPaymentMethod[] = [
  // Moyasar
  { id: "ppm-1", provider_id: "prov-1", payment_method_id: "pm-1", enabled: true, supports_recurring: true, supports_tokenization: true, supports_refunds: true, created_at: new Date().toISOString() },
  { id: "ppm-2", provider_id: "prov-1", payment_method_id: "pm-2", enabled: true, supports_recurring: true, supports_tokenization: true, supports_refunds: true, created_at: new Date().toISOString() },
  { id: "ppm-3", provider_id: "prov-1", payment_method_id: "pm-3", enabled: true, supports_recurring: false, supports_tokenization: false, supports_refunds: true, created_at: new Date().toISOString() },
  { id: "ppm-4", provider_id: "prov-1", payment_method_id: "pm-4", enabled: true, supports_recurring: false, supports_tokenization: false, supports_refunds: true, created_at: new Date().toISOString() },
  
  // Tap
  { id: "ppm-5", provider_id: "prov-2", payment_method_id: "pm-1", enabled: true, supports_recurring: true, supports_tokenization: true, supports_refunds: true, created_at: new Date().toISOString() },
  { id: "ppm-6", provider_id: "prov-2", payment_method_id: "pm-2", enabled: true, supports_recurring: true, supports_tokenization: true, supports_refunds: true, created_at: new Date().toISOString() },
  { id: "ppm-7", provider_id: "prov-2", payment_method_id: "pm-3", enabled: true, supports_recurring: false, supports_tokenization: false, supports_refunds: true, created_at: new Date().toISOString() },
  { id: "ppm-8", provider_id: "prov-2", payment_method_id: "pm-4", enabled: true, supports_recurring: false, supports_tokenization: false, supports_refunds: true, created_at: new Date().toISOString() },
  
  // HyperPay
  { id: "ppm-9", provider_id: "prov-3", payment_method_id: "pm-1", enabled: true, supports_recurring: true, supports_tokenization: true, supports_refunds: true, created_at: new Date().toISOString() },
  { id: "ppm-10", provider_id: "prov-3", payment_method_id: "pm-2", enabled: true, supports_recurring: true, supports_tokenization: true, supports_refunds: true, created_at: new Date().toISOString() },
  { id: "ppm-11", provider_id: "prov-3", payment_method_id: "pm-3", enabled: true, supports_recurring: false, supports_tokenization: false, supports_refunds: true, created_at: new Date().toISOString() },
  
  // PayFort
  { id: "ppm-12", provider_id: "prov-4", payment_method_id: "pm-1", enabled: true, supports_recurring: true, supports_tokenization: true, supports_refunds: true, created_at: new Date().toISOString() },
  { id: "ppm-13", provider_id: "prov-4", payment_method_id: "pm-2", enabled: true, supports_recurring: true, supports_tokenization: true, supports_refunds: true, created_at: new Date().toISOString() },
  { id: "ppm-14", provider_id: "prov-4", payment_method_id: "pm-3", enabled: true, supports_recurring: false, supports_tokenization: false, supports_refunds: true, created_at: new Date().toISOString() },
  { id: "ppm-15", provider_id: "prov-4", payment_method_id: "pm-4", enabled: true, supports_recurring: false, supports_tokenization: false, supports_refunds: true, created_at: new Date().toISOString() },
  
  // Geidea
  { id: "ppm-16", provider_id: "prov-7", payment_method_id: "pm-1", enabled: true, supports_recurring: true, supports_tokenization: true, supports_refunds: true, created_at: new Date().toISOString() },
  { id: "ppm-17", provider_id: "prov-7", payment_method_id: "pm-2", enabled: true, supports_recurring: true, supports_tokenization: true, supports_refunds: true, created_at: new Date().toISOString() },
  { id: "ppm-18", provider_id: "prov-7", payment_method_id: "pm-3", enabled: true, supports_recurring: false, supports_tokenization: false, supports_refunds: true, created_at: new Date().toISOString() },
  
  // Neoleap
  { id: "ppm-19", provider_id: "prov-8", payment_method_id: "pm-1", enabled: true, supports_recurring: true, supports_tokenization: true, supports_refunds: true, created_at: new Date().toISOString() },
  { id: "ppm-20", provider_id: "prov-8", payment_method_id: "pm-2", enabled: true, supports_recurring: true, supports_tokenization: true, supports_refunds: true, created_at: new Date().toISOString() },
  { id: "ppm-21", provider_id: "prov-8", payment_method_id: "pm-3", enabled: true, supports_recurring: false, supports_tokenization: false, supports_refunds: true, created_at: new Date().toISOString() },
  { id: "ppm-22", provider_id: "prov-8", payment_method_id: "pm-4", enabled: true, supports_recurring: false, supports_tokenization: false, supports_refunds: true, created_at: new Date().toISOString() },
  
  // Checkout.com
  { id: "ppm-23", provider_id: "prov-9", payment_method_id: "pm-1", enabled: true, supports_recurring: true, supports_tokenization: true, supports_refunds: true, created_at: new Date().toISOString() },
  { id: "ppm-24", provider_id: "prov-9", payment_method_id: "pm-2", enabled: true, supports_recurring: true, supports_tokenization: true, supports_refunds: true, created_at: new Date().toISOString() },
  { id: "ppm-25", provider_id: "prov-9", payment_method_id: "pm-3", enabled: true, supports_recurring: false, supports_tokenization: false, supports_refunds: true, created_at: new Date().toISOString() },
  { id: "ppm-26", provider_id: "prov-9", payment_method_id: "pm-4", enabled: true, supports_recurring: false, supports_tokenization: false, supports_refunds: true, created_at: new Date().toISOString() },
  
  // Paymob
  { id: "ppm-27", provider_id: "prov-10", payment_method_id: "pm-1", enabled: true, supports_recurring: false, supports_tokenization: true, supports_refunds: true, created_at: new Date().toISOString() },
  { id: "ppm-28", provider_id: "prov-10", payment_method_id: "pm-2", enabled: true, supports_recurring: false, supports_tokenization: true, supports_refunds: true, created_at: new Date().toISOString() },
  
  // STC Pay
  { id: "ppm-29", provider_id: "prov-11", payment_method_id: "pm-1", enabled: true, supports_recurring: false, supports_tokenization: false, supports_refunds: true, created_at: new Date().toISOString() },
  
  // Paylink
  { id: "ppm-30", provider_id: "prov-12", payment_method_id: "pm-1", enabled: true, supports_recurring: false, supports_tokenization: true, supports_refunds: true, created_at: new Date().toISOString() },
  { id: "ppm-31", provider_id: "prov-12", payment_method_id: "pm-2", enabled: true, supports_recurring: false, supports_tokenization: true, supports_refunds: true, created_at: new Date().toISOString() },
  { id: "ppm-32", provider_id: "prov-12", payment_method_id: "pm-3", enabled: true, supports_recurring: false, supports_tokenization: false, supports_refunds: true, created_at: new Date().toISOString() },
  
  // MyFatoorah
  { id: "ppm-33", provider_id: "prov-13", payment_method_id: "pm-1", enabled: true, supports_recurring: true, supports_tokenization: true, supports_refunds: true, created_at: new Date().toISOString() },
  { id: "ppm-34", provider_id: "prov-13", payment_method_id: "pm-2", enabled: true, supports_recurring: true, supports_tokenization: true, supports_refunds: true, created_at: new Date().toISOString() },
  { id: "ppm-35", provider_id: "prov-13", payment_method_id: "pm-3", enabled: true, supports_recurring: false, supports_tokenization: false, supports_refunds: true, created_at: new Date().toISOString() },
  
  // Foloosi
  { id: "ppm-36", provider_id: "prov-14", payment_method_id: "pm-1", enabled: true, supports_recurring: false, supports_tokenization: true, supports_refunds: true, created_at: new Date().toISOString() },
  { id: "ppm-37", provider_id: "prov-14", payment_method_id: "pm-2", enabled: true, supports_recurring: false, supports_tokenization: true, supports_refunds: true, created_at: new Date().toISOString() },
  
  // Telr
  { id: "ppm-38", provider_id: "prov-15", payment_method_id: "pm-1", enabled: true, supports_recurring: true, supports_tokenization: true, supports_refunds: true, created_at: new Date().toISOString() },
  { id: "ppm-39", provider_id: "prov-15", payment_method_id: "pm-2", enabled: true, supports_recurring: true, supports_tokenization: true, supports_refunds: true, created_at: new Date().toISOString() },
  { id: "ppm-40", provider_id: "prov-15", payment_method_id: "pm-3", enabled: true, supports_recurring: false, supports_tokenization: false, supports_refunds: true, created_at: new Date().toISOString() },
]

// Provider Capabilities
export const mockProviderCapabilities: ProviderCapability[] = [
  // Moyasar
  { provider_id: "prov-1", capability_id: "cap-1" },
  { provider_id: "prov-1", capability_id: "cap-3" },
  { provider_id: "prov-1", capability_id: "cap-4" },
  { provider_id: "prov-1", capability_id: "cap-5" },
  
  // Tap
  { provider_id: "prov-2", capability_id: "cap-1" },
  { provider_id: "prov-2", capability_id: "cap-2" },
  { provider_id: "prov-2", capability_id: "cap-3" },
  { provider_id: "prov-2", capability_id: "cap-4" },
  { provider_id: "prov-2", capability_id: "cap-5" },
  { provider_id: "prov-2", capability_id: "cap-6" },
  
  // HyperPay
  { provider_id: "prov-3", capability_id: "cap-1" },
  { provider_id: "prov-3", capability_id: "cap-2" },
  { provider_id: "prov-3", capability_id: "cap-3" },
  { provider_id: "prov-3", capability_id: "cap-6" },
  
  // PayFort
  { provider_id: "prov-4", capability_id: "cap-1" },
  { provider_id: "prov-4", capability_id: "cap-2" },
  { provider_id: "prov-4", capability_id: "cap-3" },
  { provider_id: "prov-4", capability_id: "cap-4" },
  { provider_id: "prov-4", capability_id: "cap-5" },
  { provider_id: "prov-4", capability_id: "cap-6" },
  
  // Geidea
  { provider_id: "prov-7", capability_id: "cap-1" },
  { provider_id: "prov-7", capability_id: "cap-3" },
  { provider_id: "prov-7", capability_id: "cap-6" },
  
  // Neoleap
  { provider_id: "prov-8", capability_id: "cap-1" },
  { provider_id: "prov-8", capability_id: "cap-3" },
  { provider_id: "prov-8", capability_id: "cap-4" },
  { provider_id: "prov-8", capability_id: "cap-5" },
  
  // Checkout.com
  { provider_id: "prov-9", capability_id: "cap-1" },
  { provider_id: "prov-9", capability_id: "cap-2" },
  { provider_id: "prov-9", capability_id: "cap-3" },
  { provider_id: "prov-9", capability_id: "cap-4" },
  { provider_id: "prov-9", capability_id: "cap-5" },
  { provider_id: "prov-9", capability_id: "cap-6" },
  
  // Paymob
  { provider_id: "prov-10", capability_id: "cap-3" },
  { provider_id: "prov-10", capability_id: "cap-6" },
  
  // STC Pay
  { provider_id: "prov-11", capability_id: "cap-6" },
  
  // Paylink
  { provider_id: "prov-12", capability_id: "cap-3" },
  { provider_id: "prov-12", capability_id: "cap-4" },
  { provider_id: "prov-12", capability_id: "cap-5" },
  
  // MyFatoorah
  { provider_id: "prov-13", capability_id: "cap-1" },
  { provider_id: "prov-13", capability_id: "cap-2" },
  { provider_id: "prov-13", capability_id: "cap-3" },
  { provider_id: "prov-13", capability_id: "cap-4" },
  { provider_id: "prov-13", capability_id: "cap-5" },
  
  // Foloosi
  { provider_id: "prov-14", capability_id: "cap-3" },
  { provider_id: "prov-14", capability_id: "cap-4" },
  { provider_id: "prov-14", capability_id: "cap-5" },
  
  // Telr
  { provider_id: "prov-15", capability_id: "cap-1" },
  { provider_id: "prov-15", capability_id: "cap-2" },
  { provider_id: "prov-15", capability_id: "cap-3" },
  { provider_id: "prov-15", capability_id: "cap-4" },
  { provider_id: "prov-15", capability_id: "cap-5" },
]

// Provider Sector Rules - كل المزودين يدعمون كل القطاعات افتراضياً
export const mockProviderSectorRules: ProviderSectorRule[] = mockProviders.flatMap(provider =>
  mockSectors.map(sector => ({
    id: `psr-${provider.id}-${sector.id}`,
    provider_id: provider.id,
    sector_id: sector.id,
    is_supported: true,
    notes: null,
    created_at: new Date().toISOString(),
  }))
)

// Ops Metrics - تقييمات العمليات للمزودين
export const mockOpsMetrics: OpsMetrics[] = [
  { id: "ops-1", provider_id: "prov-1", onboarding_score: 95, support_score: 90, docs_score: 88, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "ops-2", provider_id: "prov-2", onboarding_score: 88, support_score: 85, docs_score: 92, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "ops-3", provider_id: "prov-3", onboarding_score: 75, support_score: 82, docs_score: 85, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "ops-4", provider_id: "prov-4", onboarding_score: 70, support_score: 85, docs_score: 95, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "ops-5", provider_id: "prov-5", onboarding_score: 90, support_score: 85, docs_score: 80, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "ops-6", provider_id: "prov-6", onboarding_score: 88, support_score: 82, docs_score: 78, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "ops-7", provider_id: "prov-7", onboarding_score: 80, support_score: 88, docs_score: 82, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "ops-8", provider_id: "prov-8", onboarding_score: 92, support_score: 88, docs_score: 85, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "ops-9", provider_id: "prov-9", onboarding_score: 72, support_score: 80, docs_score: 95, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "ops-10", provider_id: "prov-10", onboarding_score: 85, support_score: 82, docs_score: 80, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "ops-11", provider_id: "prov-11", onboarding_score: 78, support_score: 85, docs_score: 75, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "ops-12", provider_id: "prov-12", onboarding_score: 98, support_score: 90, docs_score: 80, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "ops-13", provider_id: "prov-13", onboarding_score: 85, support_score: 85, docs_score: 88, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "ops-14", provider_id: "prov-14", onboarding_score: 92, support_score: 85, docs_score: 78, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "ops-15", provider_id: "prov-15", onboarding_score: 80, support_score: 82, docs_score: 85, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
]

// Scoring Weights
export const mockScoringWeights: ScoringWeights = {
  id: "sw-1",
  cost_weight: 50,
  fit_weight: 25,
  ops_weight: 15,
  risk_weight: 10,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

// Helper function to get provider with all relations
export function getMockProviderWithRelations(providerId: string): ProviderWithRelations | null {
  const provider = mockProviders.find(p => p.id === providerId)
  if (!provider) return null

  return {
    ...provider,
    provider_payment_methods: mockProviderPaymentMethods
      .filter(ppm => ppm.provider_id === providerId)
      .map(ppm => ({
        ...ppm,
        payment_method: mockPaymentMethods.find(pm => pm.id === ppm.payment_method_id),
      })),
    pricing_rules: mockPricingRules
      .filter(pr => pr.provider_id === providerId)
      .map(pr => ({
        ...pr,
        payment_method: mockPaymentMethods.find(pm => pm.id === pr.payment_method_id),
      })),
    provider_capabilities: mockProviderCapabilities
      .filter(pc => pc.provider_id === providerId)
      .map(pc => ({
        ...pc,
        capability: mockCapabilities.find(c => c.id === pc.capability_id),
      })),
    provider_sector_rules: mockProviderSectorRules
      .filter(psr => psr.provider_id === providerId)
      .map(psr => ({
        ...psr,
        sector: mockSectors.find(s => s.id === psr.sector_id),
      })),
    ops_metrics: mockOpsMetrics.find(om => om.provider_id === providerId) || null,
  }
}

// Get all providers with relations
export function getAllMockProvidersWithRelations(): ProviderWithRelations[] {
  return mockProviders
    .filter(p => p.is_active)
    .map(p => getMockProviderWithRelations(p.id)!)
    .filter(Boolean)
}

// Extended Provider Data
export const mockProviderFees: ProviderFee[] = [
  // Moyasar
  { id: "fee-1", provider_id: "prov-1", payment_method_id: "pm-1", fee_percent: 1.75, fee_fixed: 1, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, refund_fee_percent: 0, chargeback_fee_fixed: 50, cross_border_fee_percent: 0, currency_conversion_fee_percent: 0, payout_fee_fixed: 0, minimum_fee_per_txn: null, maximum_fee_per_txn: null, minimum_txn_amount: null, maximum_txn_amount: null, volume_tier: null, currency: "SAR", notes_ar: "رسوم مدى", notes_en: "mada fees", is_estimated: false, source_url: "https://moyasar.com/pricing", effective_from: null, effective_to: null, is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "fee-2", provider_id: "prov-1", payment_method_id: "pm-2", fee_percent: 2.60, fee_fixed: 1, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, refund_fee_percent: 0, chargeback_fee_fixed: 75, cross_border_fee_percent: 1.5, currency_conversion_fee_percent: 0, payout_fee_fixed: 0, minimum_fee_per_txn: null, maximum_fee_per_txn: null, minimum_txn_amount: null, maximum_txn_amount: null, volume_tier: null, currency: "SAR", notes_ar: "رسوم فيزا/ماستركارد", notes_en: "Visa/MC fees", is_estimated: false, source_url: "https://moyasar.com/pricing", effective_from: null, effective_to: null, is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "fee-3", provider_id: "prov-1", payment_method_id: "pm-3", fee_percent: 2.60, fee_fixed: 1, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, refund_fee_percent: 0, chargeback_fee_fixed: 50, cross_border_fee_percent: 0, currency_conversion_fee_percent: 0, payout_fee_fixed: 0, minimum_fee_per_txn: null, maximum_fee_per_txn: null, minimum_txn_amount: null, maximum_txn_amount: null, volume_tier: null, currency: "SAR", notes_ar: "رسوم Apple Pay", notes_en: "Apple Pay fees", is_estimated: false, source_url: "https://moyasar.com/pricing", effective_from: null, effective_to: null, is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // Tap
  { id: "fee-4", provider_id: "prov-2", payment_method_id: "pm-1", fee_percent: 1.90, fee_fixed: 0.75, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, refund_fee_percent: 0, chargeback_fee_fixed: 60, cross_border_fee_percent: 0, currency_conversion_fee_percent: 2.5, payout_fee_fixed: 0, minimum_fee_per_txn: null, maximum_fee_per_txn: null, minimum_txn_amount: null, maximum_txn_amount: null, volume_tier: null, currency: "SAR", notes_ar: "رسوم مدى", notes_en: "mada fees", is_estimated: false, source_url: "https://tap.company/ksa/ar/pricing", effective_from: null, effective_to: null, is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "fee-5", provider_id: "prov-2", payment_method_id: "pm-2", fee_percent: 2.50, fee_fixed: 0.75, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, refund_fee_percent: 0, chargeback_fee_fixed: 75, cross_border_fee_percent: 1.5, currency_conversion_fee_percent: 2.5, payout_fee_fixed: 0, minimum_fee_per_txn: null, maximum_fee_per_txn: null, minimum_txn_amount: null, maximum_txn_amount: null, volume_tier: null, currency: "SAR", notes_ar: "رسوم البطاقات", notes_en: "Cards fees", is_estimated: false, source_url: "https://tap.company/ksa/ar/pricing", effective_from: null, effective_to: null, is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // HyperPay
  { id: "fee-6", provider_id: "prov-3", payment_method_id: "pm-1", fee_percent: 1.50, fee_fixed: 0.5, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, refund_fee_percent: 0, chargeback_fee_fixed: 75, cross_border_fee_percent: 0, currency_conversion_fee_percent: 2.0, payout_fee_fixed: 0, minimum_fee_per_txn: null, maximum_fee_per_txn: null, minimum_txn_amount: null, maximum_txn_amount: null, volume_tier: null, currency: "SAR", notes_ar: "رسوم مدى", notes_en: "mada fees", is_estimated: false, source_url: "https://hyperpay.com/pricing", effective_from: null, effective_to: null, is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "fee-7", provider_id: "prov-3", payment_method_id: "pm-2", fee_percent: 2.40, fee_fixed: 0.5, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, refund_fee_percent: 0, chargeback_fee_fixed: 100, cross_border_fee_percent: 1.5, currency_conversion_fee_percent: 2.0, payout_fee_fixed: 0, minimum_fee_per_txn: null, maximum_fee_per_txn: null, minimum_txn_amount: null, maximum_txn_amount: null, volume_tier: null, currency: "SAR", notes_ar: "رسوم البطاقات", notes_en: "Cards fees", is_estimated: false, source_url: "https://hyperpay.com/pricing", effective_from: null, effective_to: null, is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // PayFort
  { id: "fee-8", provider_id: "prov-4", payment_method_id: "pm-1", fee_percent: 1.60, fee_fixed: 0, monthly_fee: 500, setup_fee: 1000, refund_fee_fixed: 5, refund_fee_percent: 0, chargeback_fee_fixed: 100, cross_border_fee_percent: 0, currency_conversion_fee_percent: 2.5, payout_fee_fixed: 0, minimum_fee_per_txn: 1, maximum_fee_per_txn: null, minimum_txn_amount: null, maximum_txn_amount: null, volume_tier: null, currency: "SAR", notes_ar: "رسوم مدى للشركات", notes_en: "mada enterprise fees", is_estimated: false, source_url: "https://paymentservices.amazon.com/pricing", effective_from: null, effective_to: null, is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "fee-9", provider_id: "prov-4", payment_method_id: "pm-2", fee_percent: 2.80, fee_fixed: 1.5, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 5, refund_fee_percent: 0, chargeback_fee_fixed: 125, cross_border_fee_percent: 1.5, currency_conversion_fee_percent: 2.5, payout_fee_fixed: 0, minimum_fee_per_txn: 1.5, maximum_fee_per_txn: null, minimum_txn_amount: null, maximum_txn_amount: null, volume_tier: null, currency: "SAR", notes_ar: "رسوم البطاقات", notes_en: "Cards fees", is_estimated: false, source_url: "https://paymentservices.amazon.com/pricing", effective_from: null, effective_to: null, is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // Tabby BNPL
  { id: "fee-10", provider_id: "prov-5", payment_method_id: null, fee_percent: 5.50, fee_fixed: 0, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, refund_fee_percent: 0, chargeback_fee_fixed: 50, cross_border_fee_percent: 0, currency_conversion_fee_percent: 0, payout_fee_fixed: 0, minimum_fee_per_txn: null, maximum_fee_per_txn: null, minimum_txn_amount: 100, maximum_txn_amount: 5000, volume_tier: null, currency: "SAR", notes_ar: "رسوم BNPL", notes_en: "BNPL fees", is_estimated: false, source_url: "https://tabby.ai/business/pricing", effective_from: null, effective_to: null, is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // Tamara BNPL
  { id: "fee-11", provider_id: "prov-6", payment_method_id: null, fee_percent: 6.00, fee_fixed: 0, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, refund_fee_percent: 0, chargeback_fee_fixed: 50, cross_border_fee_percent: 0, currency_conversion_fee_percent: 0, payout_fee_fixed: 0, minimum_fee_per_txn: null, maximum_fee_per_txn: null, minimum_txn_amount: 100, maximum_txn_amount: 5000, volume_tier: null, currency: "SAR", notes_ar: "رسوم BNPL", notes_en: "BNPL fees", is_estimated: false, source_url: "https://tamara.co/business/pricing", effective_from: null, effective_to: null, is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // Geidea
  { id: "fee-12", provider_id: "prov-7", payment_method_id: "pm-1", fee_percent: 1.65, fee_fixed: 0.5, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, refund_fee_percent: 0, chargeback_fee_fixed: 75, cross_border_fee_percent: 0, currency_conversion_fee_percent: 2.0, payout_fee_fixed: 0, minimum_fee_per_txn: null, maximum_fee_per_txn: null, minimum_txn_amount: null, maximum_txn_amount: null, volume_tier: null, currency: "SAR", notes_ar: "رسوم مدى", notes_en: "mada fees", is_estimated: false, source_url: "https://geidea.net/pricing", effective_from: null, effective_to: null, is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "fee-13", provider_id: "prov-7", payment_method_id: "pm-2", fee_percent: 2.70, fee_fixed: 0.5, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, refund_fee_percent: 0, chargeback_fee_fixed: 100, cross_border_fee_percent: 1.5, currency_conversion_fee_percent: 2.0, payout_fee_fixed: 0, minimum_fee_per_txn: null, maximum_fee_per_txn: null, minimum_txn_amount: null, maximum_txn_amount: null, volume_tier: null, currency: "SAR", notes_ar: "رسوم البطاقات", notes_en: "Cards fees", is_estimated: false, source_url: "https://geidea.net/pricing", effective_from: null, effective_to: null, is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // Neoleap
  { id: "fee-14", provider_id: "prov-8", payment_method_id: "pm-1", fee_percent: 1.45, fee_fixed: 0.5, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, refund_fee_percent: 0, chargeback_fee_fixed: 50, cross_border_fee_percent: 0, currency_conversion_fee_percent: 0, payout_fee_fixed: 0, minimum_fee_per_txn: null, maximum_fee_per_txn: null, minimum_txn_amount: null, maximum_txn_amount: null, volume_tier: null, currency: "SAR", notes_ar: "رسوم مدى - أسعار منخفضة", notes_en: "mada fees - low rates", is_estimated: false, source_url: "https://neoleap.com.sa/pricing", effective_from: null, effective_to: null, is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "fee-15", provider_id: "prov-8", payment_method_id: "pm-2", fee_percent: 2.65, fee_fixed: 0.5, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, refund_fee_percent: 0, chargeback_fee_fixed: 75, cross_border_fee_percent: 1.5, currency_conversion_fee_percent: 2.0, payout_fee_fixed: 0, minimum_fee_per_txn: null, maximum_fee_per_txn: null, minimum_txn_amount: null, maximum_txn_amount: null, volume_tier: null, currency: "SAR", notes_ar: "رسوم البطاقات", notes_en: "Cards fees", is_estimated: false, source_url: "https://neoleap.com.sa/pricing", effective_from: null, effective_to: null, is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // Checkout.com
  { id: "fee-16", provider_id: "prov-9", payment_method_id: "pm-1", fee_percent: 1.80, fee_fixed: 0, monthly_fee: 199, setup_fee: 0, refund_fee_fixed: 0, refund_fee_percent: 0, chargeback_fee_fixed: 100, cross_border_fee_percent: 0, currency_conversion_fee_percent: 2.0, payout_fee_fixed: 0, minimum_fee_per_txn: 1, maximum_fee_per_txn: null, minimum_txn_amount: null, maximum_txn_amount: null, volume_tier: null, currency: "SAR", notes_ar: "رسوم مدى للشركات", notes_en: "mada enterprise fees", is_estimated: false, source_url: "https://checkout.com/pricing", effective_from: null, effective_to: null, is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "fee-17", provider_id: "prov-9", payment_method_id: "pm-2", fee_percent: 2.90, fee_fixed: 0.3, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, refund_fee_percent: 0, chargeback_fee_fixed: 125, cross_border_fee_percent: 1.0, currency_conversion_fee_percent: 2.0, payout_fee_fixed: 0, minimum_fee_per_txn: 1, maximum_fee_per_txn: null, minimum_txn_amount: null, maximum_txn_amount: null, volume_tier: null, currency: "SAR", notes_ar: "رسوم البطاقات الدولية", notes_en: "International cards fees", is_estimated: false, source_url: "https://checkout.com/pricing", effective_from: null, effective_to: null, is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // Paymob
  { id: "fee-18", provider_id: "prov-10", payment_method_id: "pm-1", fee_percent: 1.60, fee_fixed: 0.5, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, refund_fee_percent: 0, chargeback_fee_fixed: 60, cross_border_fee_percent: 0, currency_conversion_fee_percent: 2.5, payout_fee_fixed: 0, minimum_fee_per_txn: null, maximum_fee_per_txn: null, minimum_txn_amount: null, maximum_txn_amount: null, volume_tier: null, currency: "SAR", notes_ar: "رسوم مدى إقليمية", notes_en: "Regional mada fees", is_estimated: false, source_url: "https://paymob.com/pricing", effective_from: null, effective_to: null, is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "fee-19", provider_id: "prov-10", payment_method_id: "pm-2", fee_percent: 2.75, fee_fixed: 0.5, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, refund_fee_percent: 0, chargeback_fee_fixed: 75, cross_border_fee_percent: 1.5, currency_conversion_fee_percent: 2.5, payout_fee_fixed: 0, minimum_fee_per_txn: null, maximum_fee_per_txn: null, minimum_txn_amount: null, maximum_txn_amount: null, volume_tier: null, currency: "SAR", notes_ar: "رسوم البطاقات", notes_en: "Cards fees", is_estimated: false, source_url: "https://paymob.com/pricing", effective_from: null, effective_to: null, is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // STC Pay
  { id: "fee-20", provider_id: "prov-11", payment_method_id: "pm-1", fee_percent: 1.50, fee_fixed: 0, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, refund_fee_percent: 0, chargeback_fee_fixed: 50, cross_border_fee_percent: 0, currency_conversion_fee_percent: 0, payout_fee_fixed: 0, minimum_fee_per_txn: null, maximum_fee_per_txn: null, minimum_txn_amount: null, maximum_txn_amount: null, volume_tier: null, currency: "SAR", notes_ar: "رسوم المحفظة", notes_en: "Wallet fees", is_estimated: false, source_url: "https://stcpay.com.sa/business", effective_from: null, effective_to: null, is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // Paylink
  { id: "fee-21", provider_id: "prov-12", payment_method_id: "pm-1", fee_percent: 1.75, fee_fixed: 0.5, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, refund_fee_percent: 0, chargeback_fee_fixed: 50, cross_border_fee_percent: 0, currency_conversion_fee_percent: 0, payout_fee_fixed: 0, minimum_fee_per_txn: null, maximum_fee_per_txn: null, minimum_txn_amount: null, maximum_txn_amount: null, volume_tier: null, currency: "SAR", notes_ar: "رسوم سهلة ومباشرة", notes_en: "Simple straightforward fees", is_estimated: false, source_url: "https://paylink.sa/pricing", effective_from: null, effective_to: null, is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "fee-22", provider_id: "prov-12", payment_method_id: "pm-2", fee_percent: 2.90, fee_fixed: 1, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, refund_fee_percent: 0, chargeback_fee_fixed: 75, cross_border_fee_percent: 1.5, currency_conversion_fee_percent: 2.0, payout_fee_fixed: 0, minimum_fee_per_txn: null, maximum_fee_per_txn: null, minimum_txn_amount: null, maximum_txn_amount: null, volume_tier: null, currency: "SAR", notes_ar: "رسوم البطاقات", notes_en: "Cards fees", is_estimated: false, source_url: "https://paylink.sa/pricing", effective_from: null, effective_to: null, is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // MyFatoorah
  { id: "fee-23", provider_id: "prov-13", payment_method_id: "pm-1", fee_percent: 1.70, fee_fixed: 0.5, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, refund_fee_percent: 0, chargeback_fee_fixed: 60, cross_border_fee_percent: 0, currency_conversion_fee_percent: 2.0, payout_fee_fixed: 0, minimum_fee_per_txn: null, maximum_fee_per_txn: null, minimum_txn_amount: null, maximum_txn_amount: null, volume_tier: null, currency: "SAR", notes_ar: "رسوم خليجية", notes_en: "GCC rates", is_estimated: false, source_url: "https://myfatoorah.com/pricing", effective_from: null, effective_to: null, is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "fee-24", provider_id: "prov-13", payment_method_id: "pm-2", fee_percent: 2.80, fee_fixed: 0.5, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, refund_fee_percent: 0, chargeback_fee_fixed: 75, cross_border_fee_percent: 1.5, currency_conversion_fee_percent: 2.0, payout_fee_fixed: 0, minimum_fee_per_txn: null, maximum_fee_per_txn: null, minimum_txn_amount: null, maximum_txn_amount: null, volume_tier: null, currency: "SAR", notes_ar: "رسوم البطاقات", notes_en: "Cards fees", is_estimated: false, source_url: "https://myfatoorah.com/pricing", effective_from: null, effective_to: null, is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // Foloosi
  { id: "fee-25", provider_id: "prov-14", payment_method_id: "pm-1", fee_percent: 1.60, fee_fixed: 0.5, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, refund_fee_percent: 0, chargeback_fee_fixed: 50, cross_border_fee_percent: 0, currency_conversion_fee_percent: 0, payout_fee_fixed: 0, minimum_fee_per_txn: null, maximum_fee_per_txn: null, minimum_txn_amount: null, maximum_txn_amount: null, volume_tier: null, currency: "SAR", notes_ar: "رسوم SME", notes_en: "SME rates", is_estimated: false, source_url: "https://foloosi.com/pricing", effective_from: null, effective_to: null, is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "fee-26", provider_id: "prov-14", payment_method_id: "pm-2", fee_percent: 2.70, fee_fixed: 0.5, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, refund_fee_percent: 0, chargeback_fee_fixed: 60, cross_border_fee_percent: 1.0, currency_conversion_fee_percent: 2.0, payout_fee_fixed: 0, minimum_fee_per_txn: null, maximum_fee_per_txn: null, minimum_txn_amount: null, maximum_txn_amount: null, volume_tier: null, currency: "SAR", notes_ar: "رسوم البطاقات", notes_en: "Cards fees", is_estimated: false, source_url: "https://foloosi.com/pricing", effective_from: null, effective_to: null, is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // Telr
  { id: "fee-27", provider_id: "prov-15", payment_method_id: "pm-1", fee_percent: 1.70, fee_fixed: 0.5, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, refund_fee_percent: 0, chargeback_fee_fixed: 60, cross_border_fee_percent: 0, currency_conversion_fee_percent: 2.0, payout_fee_fixed: 0, minimum_fee_per_txn: null, maximum_fee_per_txn: null, minimum_txn_amount: null, maximum_txn_amount: null, volume_tier: null, currency: "SAR", notes_ar: "رسوم إماراتية", notes_en: "UAE rates", is_estimated: false, source_url: "https://telr.com/pricing", effective_from: null, effective_to: null, is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "fee-28", provider_id: "prov-15", payment_method_id: "pm-2", fee_percent: 2.85, fee_fixed: 0.5, monthly_fee: 0, setup_fee: 0, refund_fee_fixed: 0, refund_fee_percent: 0, chargeback_fee_fixed: 75, cross_border_fee_percent: 1.5, currency_conversion_fee_percent: 2.0, payout_fee_fixed: 0, minimum_fee_per_txn: null, maximum_fee_per_txn: null, minimum_txn_amount: null, maximum_txn_amount: null, volume_tier: null, currency: "SAR", notes_ar: "رسوم البطاقات", notes_en: "Cards fees", is_estimated: false, source_url: "https://telr.com/pricing", effective_from: null, effective_to: null, is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
]

// Provider Integrations
export const mockProviderIntegrations: ProviderIntegration[] = [
  // Moyasar
  { id: "int-1", provider_id: "prov-1", platform: "shopify", integration_type: "plugin", is_official: true, official_url: "https://apps.shopify.com/moyasar", docs_url: "https://docs.moyasar.com/shopify", setup_difficulty: "easy", features_supported: ["refunds", "recurring"], notes_ar: "تكامل رسمي", notes_en: "Official integration", is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: "int-2", provider_id: "prov-1", platform: "woocommerce", integration_type: "plugin", is_official: true, official_url: "https://wordpress.org/plugins/moyasar-woocommerce", docs_url: "https://docs.moyasar.com/woocommerce", setup_difficulty: "easy", features_supported: ["refunds", "recurring", "tokenization"], notes_ar: "تكامل رسمي", notes_en: "Official integration", is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: "int-3", provider_id: "prov-1", platform: "salla", integration_type: "plugin", is_official: true, official_url: "https://salla.sa/integrations/moyasar", docs_url: null, setup_difficulty: "easy", features_supported: ["refunds"], notes_ar: "تكامل رسمي مع سلة", notes_en: "Official Salla integration", is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: "int-4", provider_id: "prov-1", platform: "zid", integration_type: "plugin", is_official: true, official_url: "https://zid.sa/integrations/moyasar", docs_url: null, setup_difficulty: "easy", features_supported: ["refunds"], notes_ar: "تكامل رسمي مع زد", notes_en: "Official Zid integration", is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString() },
  
  // Tap
  { id: "int-5", provider_id: "prov-2", platform: "shopify", integration_type: "plugin", is_official: true, official_url: "https://apps.shopify.com/tap-payments", docs_url: "https://developers.tap.company", setup_difficulty: "easy", features_supported: ["refunds", "recurring", "tokenization"], notes_ar: "تكامل رسمي", notes_en: "Official integration", is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: "int-6", provider_id: "prov-2", platform: "woocommerce", integration_type: "plugin", is_official: true, official_url: "https://wordpress.org/plugins/tap-payment", docs_url: "https://developers.tap.company", setup_difficulty: "easy", features_supported: ["refunds", "recurring", "tokenization"], notes_ar: "تكامل رسمي", notes_en: "Official integration", is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: "int-7", provider_id: "prov-2", platform: "salla", integration_type: "plugin", is_official: true, official_url: "https://salla.sa/integrations/tap", docs_url: null, setup_difficulty: "easy", features_supported: ["refunds"], notes_ar: "تكامل رسمي مع سلة", notes_en: "Official Salla integration", is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: "int-8", provider_id: "prov-2", platform: "mobile_sdk", integration_type: "sdk", is_official: true, official_url: "https://developers.tap.company/docs/mobile-sdk", docs_url: "https://developers.tap.company/docs/mobile-sdk", setup_difficulty: "medium", features_supported: ["tokenization", "recurring"], notes_ar: "SDK للموبايل", notes_en: "Mobile SDK", is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString() },
  
  // HyperPay
  { id: "int-9", provider_id: "prov-3", platform: "shopify", integration_type: "plugin", is_official: true, official_url: "https://apps.shopify.com/hyperpay", docs_url: "https://wordpresshyperpay.docs.oppwa.com", setup_difficulty: "easy", features_supported: ["refunds"], notes_ar: "تكامل رسمي", notes_en: "Official integration", is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: "int-10", provider_id: "prov-3", platform: "woocommerce", integration_type: "plugin", is_official: true, official_url: "https://wordpress.org/plugins/hyperpay", docs_url: "https://wordpresshyperpay.docs.oppwa.com", setup_difficulty: "easy", features_supported: ["refunds", "tokenization"], notes_ar: "تكامل رسمي", notes_en: "Official integration", is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: "int-11", provider_id: "prov-3", platform: "magento", integration_type: "plugin", is_official: true, official_url: "https://marketplace.magento.com/hyperpay", docs_url: null, setup_difficulty: "medium", features_supported: ["refunds"], notes_ar: "تكامل رسمي", notes_en: "Official integration", is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString() },

  // Tabby
  { id: "int-12", provider_id: "prov-5", platform: "shopify", integration_type: "plugin", is_official: true, official_url: "https://apps.shopify.com/tabby", docs_url: "https://docs.tabby.ai", setup_difficulty: "easy", features_supported: [], notes_ar: "تكامل BNPL", notes_en: "BNPL integration", is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: "int-13", provider_id: "prov-5", platform: "woocommerce", integration_type: "plugin", is_official: true, official_url: "https://wordpress.org/plugins/tabby", docs_url: "https://docs.tabby.ai", setup_difficulty: "easy", features_supported: [], notes_ar: "تكامل BNPL", notes_en: "BNPL integration", is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: "int-14", provider_id: "prov-5", platform: "salla", integration_type: "plugin", is_official: true, official_url: "https://salla.sa/integrations/tabby", docs_url: null, setup_difficulty: "easy", features_supported: [], notes_ar: "تكامل مع سلة", notes_en: "Salla integration", is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString() },

  // Tamara
  { id: "int-15", provider_id: "prov-6", platform: "shopify", integration_type: "plugin", is_official: true, official_url: "https://apps.shopify.com/tamara", docs_url: "https://developer.tamara.co", setup_difficulty: "easy", features_supported: [], notes_ar: "تكامل BNPL", notes_en: "BNPL integration", is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: "int-16", provider_id: "prov-6", platform: "salla", integration_type: "plugin", is_official: true, official_url: "https://salla.sa/integrations/tamara", docs_url: null, setup_difficulty: "easy", features_supported: [], notes_ar: "تكامل مع سلة", notes_en: "Salla integration", is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: "int-17", provider_id: "prov-6", platform: "zid", integration_type: "plugin", is_official: true, official_url: "https://zid.sa/integrations/tamara", docs_url: null, setup_difficulty: "easy", features_supported: [], notes_ar: "تكامل مع زد", notes_en: "Zid integration", is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString() },
  
  // Geidea
  { id: "int-18", provider_id: "prov-7", platform: "shopify", integration_type: "plugin", is_official: true, official_url: "https://apps.shopify.com/geidea", docs_url: "https://docs.geidea.net", setup_difficulty: "easy", features_supported: ["refunds"], notes_ar: "تكامل رسمي", notes_en: "Official integration", is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: "int-19", provider_id: "prov-7", platform: "woocommerce", integration_type: "plugin", is_official: true, official_url: "https://wordpress.org/plugins/geidea", docs_url: "https://docs.geidea.net", setup_difficulty: "easy", features_supported: ["refunds"], notes_ar: "تكامل رسمي", notes_en: "Official integration", is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: "int-20", provider_id: "prov-7", platform: "salla", integration_type: "plugin", is_official: true, official_url: "https://salla.sa/integrations/geidea", docs_url: null, setup_difficulty: "easy", features_supported: ["refunds"], notes_ar: "تكامل مع سلة", notes_en: "Salla integration", is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString() },
  
  // Neoleap
  { id: "int-21", provider_id: "prov-8", platform: "shopify", integration_type: "plugin", is_official: true, official_url: "https://apps.shopify.com/neoleap", docs_url: "https://docs.neoleap.com.sa", setup_difficulty: "easy", features_supported: ["refunds", "tokenization"], notes_ar: "تكامل رسمي", notes_en: "Official integration", is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: "int-22", provider_id: "prov-8", platform: "woocommerce", integration_type: "plugin", is_official: true, official_url: "https://wordpress.org/plugins/neoleap", docs_url: "https://docs.neoleap.com.sa", setup_difficulty: "easy", features_supported: ["refunds", "tokenization"], notes_ar: "تكامل رسمي", notes_en: "Official integration", is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString() },
  
  // Checkout.com
  { id: "int-23", provider_id: "prov-9", platform: "shopify", integration_type: "plugin", is_official: true, official_url: "https://apps.shopify.com/checkout-com", docs_url: "https://docs.checkout.com", setup_difficulty: "medium", features_supported: ["refunds", "recurring", "tokenization"], notes_ar: "تكامل دولي", notes_en: "International integration", is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: "int-24", provider_id: "prov-9", platform: "woocommerce", integration_type: "plugin", is_official: true, official_url: "https://wordpress.org/plugins/checkout-com", docs_url: "https://docs.checkout.com", setup_difficulty: "medium", features_supported: ["refunds", "recurring", "tokenization"], notes_ar: "تكامل رسمي", notes_en: "Official integration", is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: "int-25", provider_id: "prov-9", platform: "magento", integration_type: "plugin", is_official: true, official_url: "https://marketplace.magento.com/checkout-checkout", docs_url: "https://docs.checkout.com", setup_difficulty: "medium", features_supported: ["refunds", "recurring"], notes_ar: "تكامل رسمي", notes_en: "Official integration", is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString() },
  
  // Paymob
  { id: "int-26", provider_id: "prov-10", platform: "woocommerce", integration_type: "plugin", is_official: true, official_url: "https://wordpress.org/plugins/paymob", docs_url: "https://docs.paymob.com", setup_difficulty: "easy", features_supported: ["refunds"], notes_ar: "تكامل رسمي", notes_en: "Official integration", is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString() },
  
  // Paylink
  { id: "int-27", provider_id: "prov-12", platform: "shopify", integration_type: "plugin", is_official: true, official_url: "https://apps.shopify.com/paylink", docs_url: "https://paylink.sa/docs", setup_difficulty: "easy", features_supported: ["refunds"], notes_ar: "تكامل رسمي", notes_en: "Official integration", is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: "int-28", provider_id: "prov-12", platform: "woocommerce", integration_type: "plugin", is_official: true, official_url: "https://wordpress.org/plugins/paylink", docs_url: "https://paylink.sa/docs", setup_difficulty: "easy", features_supported: ["refunds"], notes_ar: "تكامل رسمي", notes_en: "Official integration", is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: "int-29", provider_id: "prov-12", platform: "salla", integration_type: "plugin", is_official: true, official_url: "https://salla.sa/integrations/paylink", docs_url: null, setup_difficulty: "easy", features_supported: ["refunds"], notes_ar: "تكامل مع سلة", notes_en: "Salla integration", is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: "int-30", provider_id: "prov-12", platform: "zid", integration_type: "plugin", is_official: true, official_url: "https://zid.sa/integrations/paylink", docs_url: null, setup_difficulty: "easy", features_supported: ["refunds"], notes_ar: "تكامل مع زد", notes_en: "Zid integration", is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString() },
  
  // MyFatoorah
  { id: "int-31", provider_id: "prov-13", platform: "shopify", integration_type: "plugin", is_official: true, official_url: "https://apps.shopify.com/myfatoorah", docs_url: "https://docs.myfatoorah.com", setup_difficulty: "easy", features_supported: ["refunds", "recurring"], notes_ar: "تكامل خليجي", notes_en: "GCC integration", is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: "int-32", provider_id: "prov-13", platform: "woocommerce", integration_type: "plugin", is_official: true, official_url: "https://wordpress.org/plugins/myfatoorah", docs_url: "https://docs.myfatoorah.com", setup_difficulty: "easy", features_supported: ["refunds", "recurring"], notes_ar: "تكامل رسمي", notes_en: "Official integration", is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString() },
  
  // Foloosi
  { id: "int-33", provider_id: "prov-14", platform: "shopify", integration_type: "plugin", is_official: true, official_url: "https://apps.shopify.com/foloosi", docs_url: "https://docs.foloosi.com", setup_difficulty: "easy", features_supported: ["refunds"], notes_ar: "تكامل رسمي", notes_en: "Official integration", is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: "int-34", provider_id: "prov-14", platform: "woocommerce", integration_type: "plugin", is_official: true, official_url: "https://wordpress.org/plugins/foloosi", docs_url: "https://docs.foloosi.com", setup_difficulty: "easy", features_supported: ["refunds"], notes_ar: "تكامل رسمي", notes_en: "Official integration", is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString() },
  
  // Telr
  { id: "int-35", provider_id: "prov-15", platform: "shopify", integration_type: "plugin", is_official: true, official_url: "https://apps.shopify.com/telr", docs_url: "https://telr.com/docs", setup_difficulty: "easy", features_supported: ["refunds", "recurring"], notes_ar: "تكامل إماراتي", notes_en: "UAE integration", is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: "int-36", provider_id: "prov-15", platform: "woocommerce", integration_type: "plugin", is_official: true, official_url: "https://wordpress.org/plugins/telr", docs_url: "https://telr.com/docs", setup_difficulty: "easy", features_supported: ["refunds", "recurring"], notes_ar: "تكامل رسمي", notes_en: "Official integration", is_active: true, last_verified_at: new Date().toISOString(), created_at: new Date().toISOString() },
]

// Provider Reviews
export const mockProviderReviews: ProviderReview[] = [
  { id: "rev-1", provider_id: "prov-1", platform: "trustpilot", rating_avg: 4.3, rating_count: 125, rating_max: 5, highlights_positive: ["دعم فني ممتاز", "تفعيل سريع", "سهولة الاستخدام"], highlights_negative: ["رسوم أعلى للحجم الكبير"], sample_reviews: [], source_url: "https://www.trustpilot.com/review/moyasar.com", last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "rev-2", provider_id: "prov-2", platform: "trustpilot", rating_avg: 4.2, rating_count: 156, rating_max: 5, highlights_positive: ["منصة متكاملة", "API جيد", "دعم BNPL"], highlights_negative: ["أسعار متوسطة"], sample_reviews: [], source_url: "https://www.trustpilot.com/review/tap.company", last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "rev-3", provider_id: "prov-3", platform: "trustpilot", rating_avg: 4.1, rating_count: 203, rating_max: 5, highlights_positive: ["تغطية واسعة", "دعم 24/7", "استقرار"], highlights_negative: ["إعداد معقد", "وثائق بحاجة تحسين"], sample_reviews: [], source_url: "https://www.trustpilot.com/review/hyperpay.com", last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "rev-4", provider_id: "prov-5", platform: "trustpilot", rating_avg: 4.5, rating_count: 1250, rating_max: 5, highlights_positive: ["زيادة المبيعات", "سهولة التكامل", "دعم ممتاز"], highlights_negative: ["رسوم مرتفعة"], sample_reviews: [], source_url: "https://www.trustpilot.com/review/tabby.ai", last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "rev-5", provider_id: "prov-6", platform: "trustpilot", rating_avg: 4.4, rating_count: 980, rating_max: 5, highlights_positive: ["شركة سعودية", "دعم عربي", "تكامل سهل"], highlights_negative: ["حد أدنى للطلب"], sample_reviews: [], source_url: "https://www.trustpilot.com/review/tamara.co", last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "rev-6", provider_id: "prov-7", platform: "trustpilot", rating_avg: 4.0, rating_count: 340, rating_max: 5, highlights_positive: ["فروع محلية", "نقاط بيع متكاملة", "دعم تقني"], highlights_negative: ["تفعيل يأخذ وقت"], sample_reviews: [], source_url: "https://www.trustpilot.com/review/geidea.net", last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "rev-7", provider_id: "prov-8", platform: "trustpilot", rating_avg: 4.4, rating_count: 85, rating_max: 5, highlights_positive: ["أسعار منخفضة", "تفعيل سريع", "شركة سعودية"], highlights_negative: ["شركة جديدة"], sample_reviews: [], source_url: "https://www.trustpilot.com/review/neoleap.com.sa", last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "rev-8", provider_id: "prov-9", platform: "trustpilot", rating_avg: 4.2, rating_count: 520, rating_max: 5, highlights_positive: ["تغطية دولية", "استقرار عالي", "API قوي"], highlights_negative: ["رسوم شهرية", "إعداد معقد"], sample_reviews: [], source_url: "https://www.trustpilot.com/review/checkout.com", last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "rev-9", provider_id: "prov-10", platform: "trustpilot", rating_avg: 4.0, rating_count: 280, rating_max: 5, highlights_positive: ["أسعار تنافسية", "تغطية إقليمية", "دعم عربي"], highlights_negative: ["وثائق محدودة"], sample_reviews: [], source_url: "https://www.trustpilot.com/review/paymob.com", last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "rev-10", provider_id: "prov-11", platform: "app_store", rating_avg: 4.6, rating_count: 15000, rating_max: 5, highlights_positive: ["محفظة معروفة", "قاعدة مستخدمين كبيرة", "سهولة الاستخدام"], highlights_negative: ["محدود للسعودية"], sample_reviews: [], source_url: "https://apps.apple.com/sa/app/stc-pay", last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "rev-11", provider_id: "prov-12", platform: "trustpilot", rating_avg: 4.5, rating_count: 420, rating_max: 5, highlights_positive: ["تفعيل سريع جداً", "سهولة الاستخدام", "روابط دفع"], highlights_negative: ["مميزات محدودة"], sample_reviews: [], source_url: "https://www.trustpilot.com/review/paylink.sa", last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "rev-12", provider_id: "prov-13", platform: "trustpilot", rating_avg: 4.1, rating_count: 310, rating_max: 5, highlights_positive: ["تغطية خليجية", "متعدد العملات", "تكاملات جيدة"], highlights_negative: ["دعم بالإنجليزية"], sample_reviews: [], source_url: "https://www.trustpilot.com/review/myfatoorah.com", last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "rev-13", provider_id: "prov-14", platform: "trustpilot", rating_avg: 4.2, rating_count: 95, rating_max: 5, highlights_positive: ["سهل للمبتدئين", "أسعار جيدة", "تفعيل سريع"], highlights_negative: ["شركة صغيرة"], sample_reviews: [], source_url: "https://www.trustpilot.com/review/foloosi.com", last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "rev-14", provider_id: "prov-15", platform: "trustpilot", rating_avg: 4.0, rating_count: 180, rating_max: 5, highlights_positive: ["تغطية خليجية", "متعدد العملات", "استقرار"], highlights_negative: ["دعم أبطأ"], sample_reviews: [], source_url: "https://www.trustpilot.com/review/telr.com", last_verified_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
]

// Provider Sources
export const mockProviderSources: ProviderSource[] = [
  { id: "src-1", entity_type: "provider", entity_id: "prov-1", source_type: "official_pricing", source_url: "https://moyasar.com/pricing", source_name: "Moyasar Pricing Page", extracted_fields: { fees: "transaction fees", setup_fee: "no setup" }, screenshot_path: null, is_estimated: false, confidence_level: "high", notes: null, verified_by: "system", last_verified_at: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: "src-2", entity_type: "provider", entity_id: "prov-2", source_type: "official_pricing", source_url: "https://tap.company/ksa/ar/pricing", source_name: "Tap Pricing Page", extracted_fields: { fees: "transaction fees" }, screenshot_path: null, is_estimated: false, confidence_level: "high", notes: null, verified_by: "system", last_verified_at: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: "src-3", entity_type: "provider", entity_id: "prov-3", source_type: "official_pricing", source_url: "https://hyperpay.com/pricing", source_name: "HyperPay Pricing Page", extracted_fields: { fees: "transaction fees" }, screenshot_path: null, is_estimated: false, confidence_level: "high", notes: null, verified_by: "system", last_verified_at: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: "src-4", entity_type: "provider", entity_id: "prov-5", source_type: "official_pricing", source_url: "https://tabby.ai/business/pricing", source_name: "Tabby Business Pricing", extracted_fields: { fees: "merchant fees" }, screenshot_path: null, is_estimated: false, confidence_level: "high", notes: null, verified_by: "system", last_verified_at: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: "src-5", entity_type: "provider", entity_id: "prov-6", source_type: "official_pricing", source_url: "https://tamara.co/business/pricing", source_name: "Tamara Business Pricing", extracted_fields: { fees: "merchant fees" }, screenshot_path: null, is_estimated: false, confidence_level: "high", notes: null, verified_by: "system", last_verified_at: new Date().toISOString(), created_at: new Date().toISOString() },
]

// Provider Wallets
export const mockProviderWallets: ProviderWallet[] = [
  { id: "wallet-1", provider_id: "prov-1", wallet_type: "apple_pay", is_supported: true, fee_percent: 2.60, fee_fixed: 1, requirements: null, notes_ar: null, notes_en: null, created_at: new Date().toISOString() },
  { id: "wallet-2", provider_id: "prov-1", wallet_type: "stc_pay", is_supported: true, fee_percent: 2.00, fee_fixed: 1, requirements: null, notes_ar: null, notes_en: null, created_at: new Date().toISOString() },
  { id: "wallet-3", provider_id: "prov-2", wallet_type: "apple_pay", is_supported: true, fee_percent: 2.50, fee_fixed: 0.75, requirements: null, notes_ar: null, notes_en: null, created_at: new Date().toISOString() },
  { id: "wallet-4", provider_id: "prov-2", wallet_type: "google_pay", is_supported: true, fee_percent: 2.50, fee_fixed: 0.75, requirements: null, notes_ar: null, notes_en: null, created_at: new Date().toISOString() },
  { id: "wallet-5", provider_id: "prov-3", wallet_type: "apple_pay", is_supported: true, fee_percent: 2.40, fee_fixed: 0.5, requirements: null, notes_ar: null, notes_en: null, created_at: new Date().toISOString() },
  { id: "wallet-6", provider_id: "prov-3", wallet_type: "google_pay", is_supported: true, fee_percent: 2.40, fee_fixed: 0.5, requirements: null, notes_ar: null, notes_en: null, created_at: new Date().toISOString() },
  { id: "wallet-7", provider_id: "prov-3", wallet_type: "stc_pay", is_supported: true, fee_percent: 1.80, fee_fixed: 0.5, requirements: null, notes_ar: null, notes_en: null, created_at: new Date().toISOString() },
]

// Provider BNPL Support
export const mockProviderBnpl: ProviderBnpl[] = [
  { id: "bnpl-1", provider_id: "prov-1", bnpl_provider: "tabby", is_integrated: true, merchant_fee_percent: 5.50, merchant_fee_fixed: 0, max_installments: 4, min_order_amount: 100, max_order_amount: 5000, settlement_days: 3, notes_ar: null, notes_en: null, integration_url: "https://docs.moyasar.com/tabby", created_at: new Date().toISOString() },
  { id: "bnpl-2", provider_id: "prov-1", bnpl_provider: "tamara", is_integrated: true, merchant_fee_percent: 6.00, merchant_fee_fixed: 0, max_installments: 4, min_order_amount: 100, max_order_amount: 5000, settlement_days: 3, notes_ar: null, notes_en: null, integration_url: "https://docs.moyasar.com/tamara", created_at: new Date().toISOString() },
  { id: "bnpl-3", provider_id: "prov-2", bnpl_provider: "tabby", is_integrated: true, merchant_fee_percent: 5.50, merchant_fee_fixed: 0, max_installments: 4, min_order_amount: 100, max_order_amount: 5000, settlement_days: 3, notes_ar: null, notes_en: null, integration_url: "https://developers.tap.company/tabby", created_at: new Date().toISOString() },
  { id: "bnpl-4", provider_id: "prov-2", bnpl_provider: "tamara", is_integrated: true, merchant_fee_percent: 6.00, merchant_fee_fixed: 0, max_installments: 4, min_order_amount: 100, max_order_amount: 5000, settlement_days: 3, notes_ar: null, notes_en: null, integration_url: "https://developers.tap.company/tamara", created_at: new Date().toISOString() },
  { id: "bnpl-5", provider_id: "prov-3", bnpl_provider: "tabby", is_integrated: true, merchant_fee_percent: 5.50, merchant_fee_fixed: 0, max_installments: 4, min_order_amount: 100, max_order_amount: 5000, settlement_days: 3, notes_ar: null, notes_en: null, integration_url: null, created_at: new Date().toISOString() },
]

// Provider Currencies
export const mockProviderCurrencies: ProviderCurrency[] = [
  { id: "cur-1", provider_id: "prov-1", currency_code: "SAR", is_settlement_supported: true, is_pricing_supported: true, conversion_fee_percent: 0, notes: null, created_at: new Date().toISOString() },
  { id: "cur-2", provider_id: "prov-2", currency_code: "SAR", is_settlement_supported: true, is_pricing_supported: true, conversion_fee_percent: 0, notes: null, created_at: new Date().toISOString() },
  { id: "cur-3", provider_id: "prov-2", currency_code: "AED", is_settlement_supported: true, is_pricing_supported: true, conversion_fee_percent: 2.5, notes: null, created_at: new Date().toISOString() },
  { id: "cur-4", provider_id: "prov-2", currency_code: "USD", is_settlement_supported: false, is_pricing_supported: true, conversion_fee_percent: 2.5, notes: null, created_at: new Date().toISOString() },
  { id: "cur-5", provider_id: "prov-3", currency_code: "SAR", is_settlement_supported: true, is_pricing_supported: true, conversion_fee_percent: 0, notes: null, created_at: new Date().toISOString() },
  { id: "cur-6", provider_id: "prov-3", currency_code: "AED", is_settlement_supported: true, is_pricing_supported: true, conversion_fee_percent: 2.0, notes: null, created_at: new Date().toISOString() },
  { id: "cur-7", provider_id: "prov-3", currency_code: "USD", is_settlement_supported: true, is_pricing_supported: true, conversion_fee_percent: 2.0, notes: null, created_at: new Date().toISOString() },
  { id: "cur-8", provider_id: "prov-4", currency_code: "SAR", is_settlement_supported: true, is_pricing_supported: true, conversion_fee_percent: 0, notes: null, created_at: new Date().toISOString() },
  { id: "cur-9", provider_id: "prov-4", currency_code: "AED", is_settlement_supported: true, is_pricing_supported: true, conversion_fee_percent: 2.5, notes: null, created_at: new Date().toISOString() },
  { id: "cur-10", provider_id: "prov-5", currency_code: "SAR", is_settlement_supported: true, is_pricing_supported: true, conversion_fee_percent: 0, notes: null, created_at: new Date().toISOString() },
  { id: "cur-11", provider_id: "prov-6", currency_code: "SAR", is_settlement_supported: true, is_pricing_supported: true, conversion_fee_percent: 0, notes: null, created_at: new Date().toISOString() },
]
