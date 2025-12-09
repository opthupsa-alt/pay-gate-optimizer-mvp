import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Provider Fees Data
function getProviderFees(slug: string) {
  const feesMap: Record<string, Array<{
    paymentMethodCode: string
    feePercent: number
    feeFixed: number
    notesAr?: string
    notesEn?: string
    isEstimated: boolean
  }>> = {
    moyasar: [
      { paymentMethodCode: 'mada', feePercent: 1.5, feeFixed: 1, notesAr: 'تقديري', notesEn: 'Estimated', isEstimated: true },
      { paymentMethodCode: 'visa_mc', feePercent: 2.2, feeFixed: 1, notesAr: 'تقديري', notesEn: 'Estimated', isEstimated: true },
      { paymentMethodCode: 'apple_pay', feePercent: 2.2, feeFixed: 1, isEstimated: true },
      { paymentMethodCode: 'stc_pay', feePercent: 2.2, feeFixed: 1, isEstimated: true },
    ],
    tap: [
      { paymentMethodCode: 'mada', feePercent: 1.75, feeFixed: 0.5, isEstimated: false },
      { paymentMethodCode: 'visa_mc', feePercent: 2.5, feeFixed: 0.5, isEstimated: false },
      { paymentMethodCode: 'apple_pay', feePercent: 2.5, feeFixed: 0.5, isEstimated: false },
      { paymentMethodCode: 'google_pay', feePercent: 2.5, feeFixed: 0.5, isEstimated: false },
    ],
    hyperpay: [
      { paymentMethodCode: 'mada', feePercent: 1.75, feeFixed: 1, isEstimated: true },
      { paymentMethodCode: 'visa_mc', feePercent: 2.75, feeFixed: 1, isEstimated: true },
      { paymentMethodCode: 'apple_pay', feePercent: 2.75, feeFixed: 1, isEstimated: true },
    ],
    payfort: [
      { paymentMethodCode: 'mada', feePercent: 2.0, feeFixed: 1, isEstimated: true },
      { paymentMethodCode: 'visa_mc', feePercent: 2.9, feeFixed: 1, isEstimated: true },
    ],
    geidea: [
      { paymentMethodCode: 'mada', feePercent: 1.6, feeFixed: 0, notesAr: 'للمتاجر الكبيرة', isEstimated: true },
      { paymentMethodCode: 'visa_mc', feePercent: 2.4, feeFixed: 0, isEstimated: true },
    ],
    myfatoorah: [
      { paymentMethodCode: 'mada', feePercent: 1.75, feeFixed: 1, isEstimated: false },
      { paymentMethodCode: 'visa_mc', feePercent: 2.65, feeFixed: 1, isEstimated: false },
      { paymentMethodCode: 'apple_pay', feePercent: 2.65, feeFixed: 1, isEstimated: false },
    ],
    paytabs: [
      { paymentMethodCode: 'mada', feePercent: 1.9, feeFixed: 1, isEstimated: false },
      { paymentMethodCode: 'visa_mc', feePercent: 2.85, feeFixed: 1, isEstimated: false },
    ],
    telr: [
      { paymentMethodCode: 'mada', feePercent: 1.8, feeFixed: 1, isEstimated: true },
      { paymentMethodCode: 'visa_mc', feePercent: 2.7, feeFixed: 1, isEstimated: true },
    ],
    paylink: [
      { paymentMethodCode: 'mada', feePercent: 1.5, feeFixed: 0.5, notesAr: 'أفضل سعر للسعودية', isEstimated: false },
      { paymentMethodCode: 'visa_mc', feePercent: 2.5, feeFixed: 0.5, isEstimated: false },
      { paymentMethodCode: 'apple_pay', feePercent: 2.5, feeFixed: 0.5, isEstimated: false },
    ],
    tabby: [
      { paymentMethodCode: 'tabby', feePercent: 5.5, feeFixed: 0, notesAr: 'رسوم على التاجر', notesEn: 'Merchant fee', isEstimated: false },
    ],
    tamara: [
      { paymentMethodCode: 'tamara', feePercent: 5.0, feeFixed: 0, notesAr: 'رسوم على التاجر', notesEn: 'Merchant fee', isEstimated: false },
    ],
    stcpay: [
      { paymentMethodCode: 'stc_pay', feePercent: 1.5, feeFixed: 0, isEstimated: true },
    ],
    checkout: [
      { paymentMethodCode: 'mada', feePercent: 1.9, feeFixed: 0.2, isEstimated: true },
      { paymentMethodCode: 'visa_mc', feePercent: 2.9, feeFixed: 0.2, isEstimated: true },
    ],
    stripe: [
      { paymentMethodCode: 'mada', feePercent: 2.5, feeFixed: 1, notesAr: 'حديث في السعودية', isEstimated: false },
      { paymentMethodCode: 'visa_mc', feePercent: 2.9, feeFixed: 1, isEstimated: false },
    ],
  }
  return feesMap[slug] || []
}

// Provider Integrations Data
function getProviderIntegrations(slug: string) {
  const integrationsMap: Record<string, Array<{
    platform: 'shopify' | 'woocommerce' | 'magento' | 'opencart' | 'salla' | 'zid' | 'custom_api'
    integrationType: 'plugin' | 'api' | 'hosted' | 'redirect' | 'sdk'
    isOfficial: boolean
    setupDifficulty: 'easy' | 'medium' | 'hard'
    officialUrl?: string
  }>> = {
    moyasar: [
      { platform: 'shopify', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'easy', officialUrl: 'https://apps.shopify.com/moyasar' },
      { platform: 'woocommerce', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'easy', officialUrl: 'https://wordpress.org/plugins/moyasar-payments' },
      { platform: 'salla', integrationType: 'api', isOfficial: true, setupDifficulty: 'easy' },
      { platform: 'zid', integrationType: 'api', isOfficial: true, setupDifficulty: 'easy' },
      { platform: 'magento', integrationType: 'plugin', isOfficial: false, setupDifficulty: 'medium' },
    ],
    tap: [
      { platform: 'shopify', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'easy' },
      { platform: 'woocommerce', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'easy' },
      { platform: 'salla', integrationType: 'api', isOfficial: true, setupDifficulty: 'easy' },
      { platform: 'zid', integrationType: 'api', isOfficial: true, setupDifficulty: 'easy' },
      { platform: 'magento', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'medium' },
      { platform: 'opencart', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'medium' },
    ],
    hyperpay: [
      { platform: 'shopify', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'medium' },
      { platform: 'woocommerce', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'medium' },
      { platform: 'magento', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'hard' },
      { platform: 'salla', integrationType: 'api', isOfficial: true, setupDifficulty: 'easy' },
    ],
    payfort: [
      { platform: 'magento', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'hard' },
      { platform: 'woocommerce', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'hard' },
      { platform: 'shopify', integrationType: 'api', isOfficial: false, setupDifficulty: 'hard' },
    ],
    geidea: [
      { platform: 'salla', integrationType: 'api', isOfficial: true, setupDifficulty: 'easy' },
      { platform: 'zid', integrationType: 'api', isOfficial: true, setupDifficulty: 'easy' },
      { platform: 'woocommerce', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'medium' },
    ],
    myfatoorah: [
      { platform: 'shopify', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'easy' },
      { platform: 'woocommerce', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'easy' },
      { platform: 'salla', integrationType: 'api', isOfficial: true, setupDifficulty: 'easy' },
      { platform: 'zid', integrationType: 'api', isOfficial: true, setupDifficulty: 'easy' },
      { platform: 'opencart', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'medium' },
    ],
    paytabs: [
      { platform: 'shopify', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'easy' },
      { platform: 'woocommerce', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'easy' },
      { platform: 'magento', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'medium' },
      { platform: 'salla', integrationType: 'api', isOfficial: true, setupDifficulty: 'easy' },
    ],
    telr: [
      { platform: 'woocommerce', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'easy' },
      { platform: 'magento', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'medium' },
      { platform: 'opencart', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'medium' },
    ],
    paylink: [
      { platform: 'salla', integrationType: 'api', isOfficial: true, setupDifficulty: 'easy' },
      { platform: 'zid', integrationType: 'api', isOfficial: true, setupDifficulty: 'easy' },
      { platform: 'woocommerce', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'easy' },
      { platform: 'shopify', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'easy' },
    ],
    tabby: [
      { platform: 'shopify', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'easy' },
      { platform: 'salla', integrationType: 'api', isOfficial: true, setupDifficulty: 'easy' },
      { platform: 'zid', integrationType: 'api', isOfficial: true, setupDifficulty: 'easy' },
      { platform: 'woocommerce', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'easy' },
      { platform: 'magento', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'medium' },
    ],
    tamara: [
      { platform: 'shopify', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'easy' },
      { platform: 'salla', integrationType: 'api', isOfficial: true, setupDifficulty: 'easy' },
      { platform: 'zid', integrationType: 'api', isOfficial: true, setupDifficulty: 'easy' },
      { platform: 'woocommerce', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'easy' },
      { platform: 'magento', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'medium' },
    ],
    stcpay: [
      { platform: 'salla', integrationType: 'api', isOfficial: true, setupDifficulty: 'easy' },
      { platform: 'zid', integrationType: 'api', isOfficial: true, setupDifficulty: 'easy' },
    ],
    checkout: [
      { platform: 'shopify', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'medium' },
      { platform: 'woocommerce', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'medium' },
      { platform: 'magento', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'hard' },
    ],
    stripe: [
      { platform: 'shopify', integrationType: 'api', isOfficial: true, setupDifficulty: 'easy' },
      { platform: 'woocommerce', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'easy' },
      { platform: 'magento', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'medium' },
    ],
  }
  return integrationsMap[slug] || []
}

// Generate random date between April and August 2025
function getRandomVerificationDate(): Date {
  const month = Math.floor(Math.random() * 5) + 4 // 4 to 8 (April to August)
  const day = Math.floor(Math.random() * 28) + 1 // 1 to 28
  return new Date(2025, month - 1, day)
}

// Provider Sources Data
function getProviderSources(entityId: string, slug: string): Array<{
  entityId: string
  entityType: string
  sourceType: 'official_website' | 'official_docs' | 'official_pricing' | 'review_platform' | 'user_report'
  sourceName: string
  sourceUrl: string
  confidenceLevel: 'high' | 'medium' | 'low'
  lastVerifiedAt: Date
  isEstimated: boolean
}> {
  const sourceTemplates = [
    {
      sourceType: 'official_pricing' as const,
      sourceName: 'الموقع الرسمي - صفحة الأسعار',
      sourceUrl: `https://${slug}.com/pricing`,
      entityType: 'provider',
      confidenceLevel: 'high' as const,
      isEstimated: false,
    },
    {
      sourceType: 'official_docs' as const,
      sourceName: 'التوثيق التقني الرسمي',
      sourceUrl: `https://docs.${slug}.com`,
      entityType: 'provider',
      confidenceLevel: 'high' as const,
      isEstimated: false,
    },
    {
      sourceType: 'official_website' as const,
      sourceName: 'تقرير بوابات الدفع السعودية',
      sourceUrl: 'https://fintechsa.com/payment-gateways-comparison',
      entityType: 'provider',
      confidenceLevel: 'medium' as const,
      isEstimated: true,
    },
    {
      sourceType: 'review_platform' as const,
      sourceName: 'مراجعات G2',
      sourceUrl: `https://g2.com/products/${slug}/reviews`,
      entityType: 'provider',
      confidenceLevel: 'medium' as const,
      isEstimated: false,
    },
    {
      sourceType: 'user_report' as const,
      sourceName: 'استبيان المستخدمين 2025',
      sourceUrl: 'https://paymentreports.sa/saudi-gateways-2025',
      entityType: 'provider',
      confidenceLevel: 'high' as const,
      isEstimated: false,
    },
  ]

  return sourceTemplates.map(template => ({
    entityId,
    ...template,
    lastVerifiedAt: getRandomVerificationDate(),
  }))
}

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@paygate.com' },
    update: {},
    create: {
      email: 'admin@paygate.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'admin',
    },
  })
  console.log('✅ Admin user created:', adminUser.email)

  // Create sectors
  const sectors = [
    { code: 'retail', nameAr: 'التجزئة', nameEn: 'Retail' },
    { code: 'ecommerce', nameAr: 'التجارة الإلكترونية', nameEn: 'E-Commerce' },
    { code: 'restaurants', nameAr: 'المطاعم', nameEn: 'Restaurants' },
    { code: 'services', nameAr: 'الخدمات', nameEn: 'Services' },
    { code: 'education', nameAr: 'التعليم', nameEn: 'Education' },
    { code: 'medical', nameAr: 'القطاع الطبي', nameEn: 'Medical' },
    { code: 'travel', nameAr: 'السفر والسياحة', nameEn: 'Travel' },
    { code: 'marketplace', nameAr: 'الأسواق الإلكترونية', nameEn: 'Marketplace' },
  ]

  for (const sector of sectors) {
    await prisma.sector.upsert({
      where: { code: sector.code },
      update: sector,
      create: sector,
    })
  }
  console.log('✅ Sectors created')

  // Create payment methods
  const paymentMethods = [
    { code: 'mada', nameAr: 'مدى', nameEn: 'Mada', category: 'debit' as const },
    { code: 'visa_mc', nameAr: 'فيزا/ماستركارد', nameEn: 'Visa/Mastercard', category: 'card' as const },
    { code: 'apple_pay', nameAr: 'Apple Pay', nameEn: 'Apple Pay', category: 'wallet' as const },
    { code: 'google_pay', nameAr: 'Google Pay', nameEn: 'Google Pay', category: 'wallet' as const },
    { code: 'stc_pay', nameAr: 'STC Pay', nameEn: 'STC Pay', category: 'wallet' as const },
    { code: 'sadad', nameAr: 'سداد', nameEn: 'SADAD', category: 'bank' as const },
    { code: 'tabby', nameAr: 'تابي', nameEn: 'Tabby', category: 'bnpl' as const },
    { code: 'tamara', nameAr: 'تمارا', nameEn: 'Tamara', category: 'bnpl' as const },
  ]

  for (const pm of paymentMethods) {
    await prisma.paymentMethod.upsert({
      where: { code: pm.code },
      update: pm,
      create: pm,
    })
  }
  console.log('✅ Payment methods created')

  // Create capabilities
  const capabilities = [
    { code: 'recurring', nameAr: 'الدفعات المتكررة', nameEn: 'Recurring Payments' },
    { code: 'tokenization', nameAr: 'حفظ البطاقات', nameEn: 'Card Tokenization' },
    { code: 'multi_currency', nameAr: 'عملات متعددة', nameEn: 'Multi-Currency' },
    { code: 'refunds', nameAr: 'الاستردادات', nameEn: 'Refunds' },
    { code: 'partial_refunds', nameAr: 'استرداد جزئي', nameEn: 'Partial Refunds' },
    { code: 'webhooks', nameAr: 'الإشعارات', nameEn: 'Webhooks' },
    { code: 'invoice', nameAr: 'روابط الدفع', nameEn: 'Payment Links' },
    { code: '3ds', nameAr: '3D Secure', nameEn: '3D Secure' },
  ]

  for (const cap of capabilities) {
    await prisma.capability.upsert({
      where: { code: cap.code },
      update: cap,
      create: cap,
    })
  }
  console.log('✅ Capabilities created')

  // Create scoring weights
  const weights = [
    { factor: 'cost', weight: 30, description: 'وزن التكلفة في التقييم' },
    { factor: 'fit', weight: 25, description: 'وزن التوافق مع المتطلبات' },
    { factor: 'ops', weight: 20, description: 'وزن جودة العمليات' },
    { factor: 'risk', weight: 15, description: 'وزن المخاطر' },
    { factor: 'rating', weight: 10, description: 'وزن تقييمات المستخدمين' },
  ]

  for (const weight of weights) {
    await prisma.scoringWeight.upsert({
      where: { factor: weight.factor },
      update: weight,
      create: weight,
    })
  }
  console.log('✅ Scoring weights created')

  // Create providers
  const providers = [
    {
      slug: 'moyasar',
      nameAr: 'ميسر',
      nameEn: 'Moyasar',
      websiteUrl: 'https://moyasar.com',
      category: 'payment_gateway' as const,
      activationTimeDaysMin: 1,
      activationTimeDaysMax: 3,
      settlementDaysMin: 1,
      settlementDaysMax: 2,
      supportChannels: JSON.stringify(['email', 'phone', 'chat']),
      prosAr: JSON.stringify(['سهولة التكامل', 'دعم فني ممتاز', 'أسعار تنافسية']),
      prosEn: JSON.stringify(['Easy integration', 'Excellent support', 'Competitive pricing']),
      consAr: JSON.stringify(['لا يدعم بعض العملات']),
      consEn: JSON.stringify(['Limited currency support']),
    },
    {
      slug: 'tap',
      nameAr: 'تاب',
      nameEn: 'Tap Payments',
      websiteUrl: 'https://tap.company',
      category: 'payment_gateway' as const,
      activationTimeDaysMin: 1,
      activationTimeDaysMax: 5,
      settlementDaysMin: 2,
      settlementDaysMax: 3,
      supportChannels: JSON.stringify(['email', 'phone', 'chat']),
      prosAr: JSON.stringify(['تغطية إقليمية واسعة', 'واجهة سهلة', 'دعم متعدد اللغات']),
      prosEn: JSON.stringify(['Wide regional coverage', 'Easy interface', 'Multi-language support']),
      consAr: JSON.stringify(['رسوم أعلى قليلاً']),
      consEn: JSON.stringify(['Slightly higher fees']),
    },
    {
      slug: 'hyperpay',
      nameAr: 'هايبر باي',
      nameEn: 'HyperPay',
      websiteUrl: 'https://hyperpay.com',
      category: 'psp' as const,
      activationTimeDaysMin: 3,
      activationTimeDaysMax: 7,
      settlementDaysMin: 2,
      settlementDaysMax: 5,
      supportChannels: JSON.stringify(['email', 'phone']),
      prosAr: JSON.stringify(['موثوقية عالية', 'دعم للشركات الكبيرة']),
      prosEn: JSON.stringify(['High reliability', 'Enterprise support']),
      consAr: JSON.stringify(['وقت تفعيل أطول', 'تكامل أكثر تعقيداً']),
      consEn: JSON.stringify(['Longer activation time', 'More complex integration']),
    },
    {
      slug: 'payfort',
      nameAr: 'باي فورت',
      nameEn: 'PayFort (Amazon)',
      websiteUrl: 'https://payfort.com',
      category: 'psp' as const,
      activationTimeDaysMin: 5,
      activationTimeDaysMax: 14,
      settlementDaysMin: 3,
      settlementDaysMax: 7,
      supportChannels: JSON.stringify(['email', 'phone']),
      prosAr: JSON.stringify(['مدعوم من أمازون', 'استقرار عالي']),
      prosEn: JSON.stringify(['Backed by Amazon', 'High stability']),
      consAr: JSON.stringify(['وقت تفعيل طويل', 'رسوم مرتفعة']),
      consEn: JSON.stringify(['Long activation time', 'High fees']),
    },
    {
      slug: 'geidea',
      nameAr: 'قيديا',
      nameEn: 'Geidea',
      websiteUrl: 'https://geidea.net',
      category: 'acquirer' as const,
      activationTimeDaysMin: 3,
      activationTimeDaysMax: 10,
      settlementDaysMin: 1,
      settlementDaysMax: 3,
      supportChannels: JSON.stringify(['email', 'phone', 'branches']),
      prosAr: JSON.stringify(['حلول POS متكاملة', 'دعم محلي قوي']),
      prosEn: JSON.stringify(['Integrated POS solutions', 'Strong local support']),
      consAr: JSON.stringify(['تركيز على نقاط البيع']),
      consEn: JSON.stringify(['POS focused']),
    },
    {
      slug: 'myfatoorah',
      nameAr: 'ماي فاتورة',
      nameEn: 'MyFatoorah',
      websiteUrl: 'https://myfatoorah.com',
      category: 'payment_gateway' as const,
      activationTimeDaysMin: 1,
      activationTimeDaysMax: 3,
      settlementDaysMin: 1,
      settlementDaysMax: 3,
      supportChannels: JSON.stringify(['email', 'phone', 'chat']),
      prosAr: JSON.stringify(['سهولة التسجيل', 'دعم متعدد العملات', 'تغطية خليجية واسعة']),
      prosEn: JSON.stringify(['Easy registration', 'Multi-currency', 'Wide GCC coverage']),
      consAr: JSON.stringify(['رسوم متوسطة']),
      consEn: JSON.stringify(['Average fees']),
    },
    {
      slug: 'paytabs',
      nameAr: 'باي تابس',
      nameEn: 'PayTabs',
      websiteUrl: 'https://paytabs.com',
      category: 'payment_gateway' as const,
      activationTimeDaysMin: 1,
      activationTimeDaysMax: 5,
      settlementDaysMin: 2,
      settlementDaysMax: 5,
      supportChannels: JSON.stringify(['email', 'phone', 'chat']),
      prosAr: JSON.stringify(['واجهة سهلة', 'دعم فني جيد', 'تغطية إقليمية']),
      prosEn: JSON.stringify(['Easy interface', 'Good support', 'Regional coverage']),
      consAr: JSON.stringify(['رسوم أعلى للبطاقات الدولية']),
      consEn: JSON.stringify(['Higher fees for international cards']),
    },
    {
      slug: 'telr',
      nameAr: 'تيلر',
      nameEn: 'Telr',
      websiteUrl: 'https://telr.com',
      category: 'payment_gateway' as const,
      activationTimeDaysMin: 2,
      activationTimeDaysMax: 7,
      settlementDaysMin: 2,
      settlementDaysMax: 5,
      supportChannels: JSON.stringify(['email', 'phone']),
      prosAr: JSON.stringify(['أسعار تنافسية', 'دعم عملات متعددة']),
      prosEn: JSON.stringify(['Competitive pricing', 'Multi-currency support']),
      consAr: JSON.stringify(['دعم فني أبطأ']),
      consEn: JSON.stringify(['Slower support']),
    },
    {
      slug: 'paylink',
      nameAr: 'باي لينك',
      nameEn: 'PayLink',
      websiteUrl: 'https://paylink.sa',
      category: 'payment_gateway' as const,
      activationTimeDaysMin: 1,
      activationTimeDaysMax: 2,
      settlementDaysMin: 1,
      settlementDaysMax: 2,
      supportChannels: JSON.stringify(['email', 'phone', 'whatsapp']),
      prosAr: JSON.stringify(['تفعيل سريع جداً', 'دعم سعودي', 'أسعار ممتازة']),
      prosEn: JSON.stringify(['Very fast activation', 'Saudi support', 'Excellent pricing']),
      consAr: JSON.stringify(['تغطية سعودية فقط']),
      consEn: JSON.stringify(['Saudi coverage only']),
    },
    {
      slug: 'tabby',
      nameAr: 'تابي',
      nameEn: 'Tabby',
      websiteUrl: 'https://tabby.ai',
      category: 'bnpl' as const,
      activationTimeDaysMin: 3,
      activationTimeDaysMax: 7,
      settlementDaysMin: 1,
      settlementDaysMax: 3,
      supportChannels: JSON.stringify(['email', 'chat']),
      prosAr: JSON.stringify(['زيادة المبيعات', 'تقسيط بدون فوائد للعميل', 'شعبية عالية']),
      prosEn: JSON.stringify(['Increased sales', 'Interest-free for customers', 'High popularity']),
      consAr: JSON.stringify(['رسوم على التاجر']),
      consEn: JSON.stringify(['Merchant fees']),
    },
    {
      slug: 'tamara',
      nameAr: 'تمارا',
      nameEn: 'Tamara',
      websiteUrl: 'https://tamara.co',
      category: 'bnpl' as const,
      activationTimeDaysMin: 3,
      activationTimeDaysMax: 7,
      settlementDaysMin: 1,
      settlementDaysMax: 3,
      supportChannels: JSON.stringify(['email', 'chat']),
      prosAr: JSON.stringify(['قاعدة مستخدمين كبيرة', 'تكامل سهل', 'دعم سعودي']),
      prosEn: JSON.stringify(['Large user base', 'Easy integration', 'Saudi support']),
      consAr: JSON.stringify(['منافسة مع تابي']),
      consEn: JSON.stringify(['Competition with Tabby']),
    },
    {
      slug: 'stcpay',
      nameAr: 'STC Pay',
      nameEn: 'STC Pay',
      websiteUrl: 'https://stcpay.com.sa',
      category: 'wallet' as const,
      activationTimeDaysMin: 3,
      activationTimeDaysMax: 10,
      settlementDaysMin: 1,
      settlementDaysMax: 3,
      supportChannels: JSON.stringify(['phone', 'branches']),
      prosAr: JSON.stringify(['قاعدة مستخدمين ضخمة', 'ثقة عالية', 'سرعة التحويل']),
      prosEn: JSON.stringify(['Huge user base', 'High trust', 'Fast transfers']),
      consAr: JSON.stringify(['محدود للسعودية']),
      consEn: JSON.stringify(['Saudi limited']),
    },
    {
      slug: 'checkout',
      nameAr: 'تشيك أوت',
      nameEn: 'Checkout.com',
      websiteUrl: 'https://checkout.com',
      category: 'psp' as const,
      activationTimeDaysMin: 7,
      activationTimeDaysMax: 21,
      settlementDaysMin: 2,
      settlementDaysMax: 5,
      supportChannels: JSON.stringify(['email', 'phone']),
      prosAr: JSON.stringify(['منصة عالمية', 'أدوات متقدمة', 'API قوي']),
      prosEn: JSON.stringify(['Global platform', 'Advanced tools', 'Powerful API']),
      consAr: JSON.stringify(['تفعيل بطيء', 'مناسب للشركات الكبيرة']),
      consEn: JSON.stringify(['Slow activation', 'Better for enterprises']),
    },
    {
      slug: 'stripe',
      nameAr: 'سترايب',
      nameEn: 'Stripe',
      websiteUrl: 'https://stripe.com',
      category: 'psp' as const,
      activationTimeDaysMin: 1,
      activationTimeDaysMax: 7,
      settlementDaysMin: 2,
      settlementDaysMax: 7,
      supportChannels: JSON.stringify(['email', 'chat']),
      prosAr: JSON.stringify(['أفضل توثيق', 'أدوات مطورين ممتازة', 'عالمي']),
      prosEn: JSON.stringify(['Best documentation', 'Excellent dev tools', 'Global']),
      consAr: JSON.stringify(['دعم محلي محدود', 'متاح حديثاً في السعودية']),
      consEn: JSON.stringify(['Limited local support', 'Recently available in Saudi']),
    },
  ]

  for (const provider of providers) {
    // Add lastVerifiedAt to provider data
    const providerWithDate = {
      ...provider,
      lastVerifiedAt: getRandomVerificationDate(),
    }
    
    const created = await prisma.provider.upsert({
      where: { slug: provider.slug },
      update: providerWithDate,
      create: providerWithDate,
    })

    // Create provider sources
    const sources = getProviderSources(created.id, provider.slug)
    for (const source of sources) {
      const existingSource = await prisma.providerSource.findFirst({
        where: {
          entityId: created.id,
          sourceType: source.sourceType,
        }
      })
      if (!existingSource) {
        await prisma.providerSource.create({
          data: source,
        })
      }
    }

    // Create ops metrics
    await prisma.opsMetrics.upsert({
      where: { providerId: created.id },
      update: { onboardingScore: 80, supportScore: 85, docsScore: 75 },
      create: {
        providerId: created.id,
        onboardingScore: 80,
        supportScore: 85,
        docsScore: 75,
      },
    })

    // Get payment method IDs
    const madaMethod = await prisma.paymentMethod.findUnique({ where: { code: 'mada' } })
    const visaMethod = await prisma.paymentMethod.findUnique({ where: { code: 'visa_mc' } })

    if (madaMethod) {
      // Create pricing rule for Mada
      await prisma.pricingRule.upsert({
        where: { 
          id: `${created.id}-mada`
        },
        update: {
          feePercent: 0.0175,
          feeFixed: 0,
        },
        create: {
          id: `${created.id}-mada`,
          providerId: created.id,
          paymentMethodId: madaMethod.id,
          feePercent: 0.0175,
          feeFixed: 0,
        },
      })

      // Create provider payment method
      await prisma.providerPaymentMethod.upsert({
        where: {
          providerId_paymentMethodId: {
            providerId: created.id,
            paymentMethodId: madaMethod.id,
          }
        },
        update: { enabled: true },
        create: {
          providerId: created.id,
          paymentMethodId: madaMethod.id,
          enabled: true,
          supportsRecurring: true,
        },
      })
    }

    if (visaMethod) {
      // Create pricing rule for Visa/MC
      await prisma.pricingRule.upsert({
        where: { 
          id: `${created.id}-visa`
        },
        update: {
          feePercent: 0.0275,
          feeFixed: 0,
        },
        create: {
          id: `${created.id}-visa`,
          providerId: created.id,
          paymentMethodId: visaMethod.id,
          feePercent: 0.0275,
          feeFixed: 0,
        },
      })

      await prisma.providerPaymentMethod.upsert({
        where: {
          providerId_paymentMethodId: {
            providerId: created.id,
            paymentMethodId: visaMethod.id,
          }
        },
        update: { enabled: true },
        create: {
          providerId: created.id,
          paymentMethodId: visaMethod.id,
          enabled: true,
          supportsRecurring: true,
        },
      })
    }

    // Add provider fees (ProviderFee)
    const feesData = getProviderFees(provider.slug)
    for (const fee of feesData) {
      const pm = await prisma.paymentMethod.findUnique({ where: { code: fee.paymentMethodCode } })
      if (pm) {
        const existingFee = await prisma.providerFee.findFirst({
          where: {
            providerId: created.id,
            paymentMethodId: pm.id,
          }
        })
        if (!existingFee) {
          await prisma.providerFee.create({
            data: {
              providerId: created.id,
              paymentMethodId: pm.id,
              feePercent: fee.feePercent,
              feeFixed: fee.feeFixed,
              notesAr: fee.notesAr,
              notesEn: fee.notesEn,
              isEstimated: fee.isEstimated,
            },
          })
        } else {
          await prisma.providerFee.update({
            where: { id: existingFee.id },
            data: {
              feePercent: fee.feePercent,
              feeFixed: fee.feeFixed,
              notesAr: fee.notesAr,
              notesEn: fee.notesEn,
              isEstimated: fee.isEstimated,
            },
          })
        }
      }
    }

    // Add integrations
    const integrations = getProviderIntegrations(provider.slug)
    for (const integration of integrations) {
      const existing = await prisma.providerIntegration.findFirst({
        where: {
          providerId: created.id,
          platform: integration.platform,
        }
      })
      if (!existing) {
        await prisma.providerIntegration.create({
          data: {
            providerId: created.id,
            platform: integration.platform,
            integrationType: integration.integrationType,
            isOfficial: integration.isOfficial,
            setupDifficulty: integration.setupDifficulty,
            officialUrl: integration.officialUrl,
          },
        })
      }
    }
  }
  console.log('✅ Providers created with pricing rules, fees and integrations')

  // Create footer menus
  const footerMenus = [
    {
      slug: 'quick-links',
      titleAr: 'روابط سريعة',
      titleEn: 'Quick Links',
      sortOrder: 1,
      links: [
        { labelAr: 'الرئيسية', labelEn: 'Home', href: '/', sortOrder: 1 },
        { labelAr: 'مقارنة البوابات', labelEn: 'Compare Gateways', href: '/wizard', sortOrder: 2 },
        { labelAr: 'البوابات', labelEn: 'Providers', href: '/providers', sortOrder: 3 },
        { labelAr: 'عن المنصة', labelEn: 'About', href: '/about', sortOrder: 4 },
        { labelAr: 'تواصل معنا', labelEn: 'Contact Us', href: '/contact', sortOrder: 5 },
      ],
    },
    {
      slug: 'legal',
      titleAr: 'قانونية',
      titleEn: 'Legal',
      sortOrder: 2,
      links: [
        { labelAr: 'سياسة الخصوصية', labelEn: 'Privacy Policy', href: '/privacy', sortOrder: 1 },
        { labelAr: 'شروط الاستخدام', labelEn: 'Terms of Use', href: '/terms', sortOrder: 2 },
      ],
    },
    {
      slug: 'resources',
      titleAr: 'موارد',
      titleEn: 'Resources',
      sortOrder: 3,
      links: [
        // Add links here when needed
      ],
    },
  ]

  for (const menu of footerMenus) {
    const existingMenu = await prisma.footerMenu.findUnique({
      where: { slug: menu.slug },
    })

    if (!existingMenu) {
      const createdMenu = await prisma.footerMenu.create({
        data: {
          slug: menu.slug,
          titleAr: menu.titleAr,
          titleEn: menu.titleEn,
          sortOrder: menu.sortOrder,
          isActive: true,
        },
      })

      for (const link of menu.links) {
        await prisma.footerLink.create({
          data: {
            menuId: createdMenu.id,
            labelAr: link.labelAr,
            labelEn: link.labelEn,
            href: link.href,
            sortOrder: link.sortOrder,
            isActive: true,
          },
        })
      }
    }
  }
  console.log('✅ Footer menus created')

  console.log('🎉 Database seeded successfully!')
  console.log('')
  console.log('📋 Admin credentials:')
  console.log('   Email: admin@paygate.com')
  console.log('   Password: admin123')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

