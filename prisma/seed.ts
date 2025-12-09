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
    // New providers fees
    paymob: [
      { paymentMethodCode: 'mada', feePercent: 1.7, feeFixed: 1, notesAr: 'تقديري للسعودية', notesEn: 'Estimated for KSA', isEstimated: true },
      { paymentMethodCode: 'visa_mc', feePercent: 2.65, feeFixed: 1, isEstimated: true },
      { paymentMethodCode: 'apple_pay', feePercent: 2.65, feeFixed: 1, isEstimated: true },
      { paymentMethodCode: 'stc_pay', feePercent: 2.0, feeFixed: 1, isEstimated: true },
    ],
    foloosi: [
      { paymentMethodCode: 'visa_mc', feePercent: 1.5, feeFixed: 0.5, notesAr: 'VIP - محلي', notesEn: 'VIP - Local', isEstimated: false },
    ],
    urpay: [
      { paymentMethodCode: 'mada', feePercent: 1.75, feeFixed: 1, notesAr: 'تقديري', isEstimated: true },
      { paymentMethodCode: 'visa_mc', feePercent: 2.2, feeFixed: 1, isEstimated: true },
    ],
    spotii: [
      { paymentMethodCode: 'tabby', feePercent: 5.0, feeFixed: 0, notesAr: '4 دفعات بدون فوائد', notesEn: '4 interest-free payments', isEstimated: true },
    ],
    nearpay: [
      { paymentMethodCode: 'mada', feePercent: 1.5, feeFixed: 0.5, notesAr: 'SoftPOS', notesEn: 'SoftPOS', isEstimated: true },
      { paymentMethodCode: 'visa_mc', feePercent: 2.5, feeFixed: 0.5, isEstimated: true },
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
    // New providers integrations
    paymob: [
      { platform: 'shopify', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'easy' },
      { platform: 'woocommerce', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'easy' },
      { platform: 'magento', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'medium' },
      { platform: 'custom_api', integrationType: 'api', isOfficial: true, setupDifficulty: 'medium' },
    ],
    foloosi: [
      { platform: 'woocommerce', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'easy' },
      { platform: 'shopify', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'easy' },
      { platform: 'custom_api', integrationType: 'api', isOfficial: true, setupDifficulty: 'medium' },
    ],
    urpay: [
      { platform: 'salla', integrationType: 'api', isOfficial: true, setupDifficulty: 'easy' },
      { platform: 'zid', integrationType: 'api', isOfficial: true, setupDifficulty: 'easy' },
      { platform: 'custom_api', integrationType: 'api', isOfficial: true, setupDifficulty: 'medium' },
    ],
    spotii: [
      { platform: 'shopify', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'easy' },
      { platform: 'woocommerce', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'easy' },
      { platform: 'magento', integrationType: 'plugin', isOfficial: true, setupDifficulty: 'medium' },
    ],
    nearpay: [
      { platform: 'custom_api', integrationType: 'sdk', isOfficial: true, setupDifficulty: 'hard', officialUrl: 'https://docs.nearpay.io' },
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
    // New providers added from providers-data
    {
      slug: 'paymob',
      nameAr: 'بايموب',
      nameEn: 'Paymob',
      websiteUrl: 'https://paymob.com',
      category: 'psp' as const,
      activationTimeDaysMin: 1,
      activationTimeDaysMax: 3,
      settlementDaysMin: 1,
      settlementDaysMax: 5,
      supportChannels: JSON.stringify(['email', 'phone', 'chat']),
      prosAr: JSON.stringify(['توسع سريع في السعودية', 'دعم BNPL', 'تكامل POS']),
      prosEn: JSON.stringify(['Rapid Saudi expansion', 'BNPL support', 'POS integration']),
      consAr: JSON.stringify(['أسعار تفاوضية', 'حديث في السوق السعودي']),
      consEn: JSON.stringify(['Negotiable pricing', 'New to Saudi market']),
    },
    {
      slug: 'foloosi',
      nameAr: 'فلوسي',
      nameEn: 'Foloosi',
      websiteUrl: 'https://foloosi.com',
      category: 'payment_gateway' as const,
      activationTimeDaysMin: 1,
      activationTimeDaysMax: 3,
      settlementDaysMin: 1,
      settlementDaysMax: 5,
      supportChannels: JSON.stringify(['email', 'chat']),
      prosAr: JSON.stringify(['تفعيل سريع', 'SoftPOS/Tap on Phone', 'بدون رسوم شهرية']),
      prosEn: JSON.stringify(['Fast activation', 'SoftPOS/Tap on Phone', 'No monthly fees']),
      consAr: JSON.stringify(['تركيز على الإمارات', 'محدود في السعودية']),
      consEn: JSON.stringify(['UAE focused', 'Limited in Saudi']),
    },
    {
      slug: 'urpay',
      nameAr: 'أورباي',
      nameEn: 'urpay',
      websiteUrl: 'https://urpay.com.sa',
      category: 'wallet' as const,
      activationTimeDaysMin: 1,
      activationTimeDaysMax: 3,
      settlementDaysMin: 1,
      settlementDaysMax: 2,
      supportChannels: JSON.stringify(['phone', 'branches']),
      prosAr: JSON.stringify(['تسوية يومية', 'أكثر من 4 مليون مستخدم', 'دعم الراجحي']),
      prosEn: JSON.stringify(['Daily settlement', '4M+ users', 'Al Rajhi backed']),
      consAr: JSON.stringify(['محدود للسعودية', 'أسعار غير معلنة']),
      consEn: JSON.stringify(['Saudi only', 'Pricing not public']),
    },
    {
      slug: 'spotii',
      nameAr: 'سبوتي',
      nameEn: 'Spotii',
      websiteUrl: 'https://spotii.com',
      category: 'bnpl' as const,
      activationTimeDaysMin: 3,
      activationTimeDaysMax: 7,
      settlementDaysMin: 1,
      settlementDaysMax: 3,
      supportChannels: JSON.stringify(['email', 'chat']),
      prosAr: JSON.stringify(['4 دفعات بدون فوائد', 'مدعوم من Zip', 'انتشار خليجي']),
      prosEn: JSON.stringify(['4 interest-free payments', 'Backed by Zip', 'GCC presence']),
      consAr: JSON.stringify(['تم الاستحواذ عليه', 'مستقبل العلامة غير واضح']),
      consEn: JSON.stringify(['Acquired company', 'Brand future unclear']),
    },
    {
      slug: 'nearpay',
      nameAr: 'نيرباي',
      nameEn: 'NearPay',
      websiteUrl: 'https://nearpay.io',
      category: 'psp' as const,
      activationTimeDaysMin: 3,
      activationTimeDaysMax: 7,
      settlementDaysMin: 1,
      settlementDaysMax: 3,
      supportChannels: JSON.stringify(['email', 'phone']),
      prosAr: JSON.stringify(['بنية تحتية سعودية', 'SoftPOS/Tap to Pay', 'شراكات مع بنوك']),
      prosEn: JSON.stringify(['Saudi infrastructure', 'SoftPOS/Tap to Pay', 'Bank partnerships']),
      consAr: JSON.stringify(['B2B فقط', 'ليس للتاجر مباشرة']),
      consEn: JSON.stringify(['B2B only', 'Not direct to merchant']),
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

  // ==================== Add Real Data for Dashboard ====================
  
  // Get all providers and sectors for creating realistic data
  const allProviders = await prisma.provider.findMany({ select: { id: true, slug: true } })
  const allSectors = await prisma.sector.findMany({ select: { id: true, code: true } })

  // Create realistic WizardRuns (40 runs over the past 2 months)
  const wizardRunsData: Array<{
    sectorCode: string
    businessType: string
    monthlyGmv: number
    txCount: number
    avgTicket: number
    daysAgo: number
  }> = [
    // E-commerce runs
    { sectorCode: 'ecommerce', businessType: 'online_store', monthlyGmv: 50000, txCount: 500, avgTicket: 100, daysAgo: 1 },
    { sectorCode: 'ecommerce', businessType: 'dropshipping', monthlyGmv: 25000, txCount: 250, avgTicket: 100, daysAgo: 2 },
    { sectorCode: 'ecommerce', businessType: 'marketplace', monthlyGmv: 150000, txCount: 1500, avgTicket: 100, daysAgo: 3 },
    { sectorCode: 'ecommerce', businessType: 'online_store', monthlyGmv: 80000, txCount: 800, avgTicket: 100, daysAgo: 5 },
    { sectorCode: 'ecommerce', businessType: 'online_store', monthlyGmv: 35000, txCount: 350, avgTicket: 100, daysAgo: 7 },
    { sectorCode: 'ecommerce', businessType: 'online_store', monthlyGmv: 120000, txCount: 1000, avgTicket: 120, daysAgo: 10 },
    { sectorCode: 'ecommerce', businessType: 'online_store', monthlyGmv: 45000, txCount: 450, avgTicket: 100, daysAgo: 15 },
    { sectorCode: 'ecommerce', businessType: 'online_store', monthlyGmv: 200000, txCount: 2000, avgTicket: 100, daysAgo: 20 },
    // Retail runs
    { sectorCode: 'retail', businessType: 'retail_store', monthlyGmv: 100000, txCount: 2000, avgTicket: 50, daysAgo: 2 },
    { sectorCode: 'retail', businessType: 'retail_chain', monthlyGmv: 500000, txCount: 10000, avgTicket: 50, daysAgo: 4 },
    { sectorCode: 'retail', businessType: 'retail_store', monthlyGmv: 75000, txCount: 1500, avgTicket: 50, daysAgo: 8 },
    { sectorCode: 'retail', businessType: 'retail_store', monthlyGmv: 60000, txCount: 1200, avgTicket: 50, daysAgo: 12 },
    { sectorCode: 'retail', businessType: 'retail_store', monthlyGmv: 90000, txCount: 1800, avgTicket: 50, daysAgo: 18 },
    // Restaurants runs
    { sectorCode: 'restaurants', businessType: 'restaurant', monthlyGmv: 40000, txCount: 800, avgTicket: 50, daysAgo: 1 },
    { sectorCode: 'restaurants', businessType: 'cafe', monthlyGmv: 20000, txCount: 600, avgTicket: 33, daysAgo: 3 },
    { sectorCode: 'restaurants', businessType: 'restaurant_chain', monthlyGmv: 300000, txCount: 6000, avgTicket: 50, daysAgo: 6 },
    { sectorCode: 'restaurants', businessType: 'restaurant', monthlyGmv: 55000, txCount: 1100, avgTicket: 50, daysAgo: 9 },
    { sectorCode: 'restaurants', businessType: 'cloud_kitchen', monthlyGmv: 35000, txCount: 700, avgTicket: 50, daysAgo: 14 },
    { sectorCode: 'restaurants', businessType: 'restaurant', monthlyGmv: 45000, txCount: 900, avgTicket: 50, daysAgo: 22 },
    // Services runs
    { sectorCode: 'services', businessType: 'consulting', monthlyGmv: 30000, txCount: 30, avgTicket: 1000, daysAgo: 2 },
    { sectorCode: 'services', businessType: 'salon', monthlyGmv: 25000, txCount: 250, avgTicket: 100, daysAgo: 5 },
    { sectorCode: 'services', businessType: 'gym', monthlyGmv: 50000, txCount: 500, avgTicket: 100, daysAgo: 11 },
    { sectorCode: 'services', businessType: 'consulting', monthlyGmv: 80000, txCount: 80, avgTicket: 1000, daysAgo: 16 },
    { sectorCode: 'services', businessType: 'cleaning', monthlyGmv: 40000, txCount: 200, avgTicket: 200, daysAgo: 25 },
    // Education runs
    { sectorCode: 'education', businessType: 'online_courses', monthlyGmv: 60000, txCount: 200, avgTicket: 300, daysAgo: 3 },
    { sectorCode: 'education', businessType: 'school', monthlyGmv: 200000, txCount: 400, avgTicket: 500, daysAgo: 7 },
    { sectorCode: 'education', businessType: 'training_center', monthlyGmv: 45000, txCount: 90, avgTicket: 500, daysAgo: 13 },
    { sectorCode: 'education', businessType: 'online_courses', monthlyGmv: 35000, txCount: 116, avgTicket: 300, daysAgo: 19 },
    // Medical runs
    { sectorCode: 'medical', businessType: 'clinic', monthlyGmv: 80000, txCount: 400, avgTicket: 200, daysAgo: 4 },
    { sectorCode: 'medical', businessType: 'pharmacy', monthlyGmv: 120000, txCount: 2400, avgTicket: 50, daysAgo: 8 },
    { sectorCode: 'medical', businessType: 'hospital', monthlyGmv: 500000, txCount: 1000, avgTicket: 500, daysAgo: 17 },
    { sectorCode: 'medical', businessType: 'dental', monthlyGmv: 60000, txCount: 200, avgTicket: 300, daysAgo: 24 },
    // Travel runs
    { sectorCode: 'travel', businessType: 'travel_agency', monthlyGmv: 150000, txCount: 100, avgTicket: 1500, daysAgo: 6 },
    { sectorCode: 'travel', businessType: 'hotel', monthlyGmv: 300000, txCount: 600, avgTicket: 500, daysAgo: 12 },
    { sectorCode: 'travel', businessType: 'car_rental', monthlyGmv: 80000, txCount: 160, avgTicket: 500, daysAgo: 21 },
    // Marketplace runs
    { sectorCode: 'marketplace', businessType: 'multi_vendor', monthlyGmv: 400000, txCount: 4000, avgTicket: 100, daysAgo: 5 },
    { sectorCode: 'marketplace', businessType: 'auction', monthlyGmv: 100000, txCount: 200, avgTicket: 500, daysAgo: 10 },
    { sectorCode: 'marketplace', businessType: 'multi_vendor', monthlyGmv: 250000, txCount: 2500, avgTicket: 100, daysAgo: 23 },
    // More recent activity
    { sectorCode: 'ecommerce', businessType: 'fashion', monthlyGmv: 70000, txCount: 700, avgTicket: 100, daysAgo: 0 },
    { sectorCode: 'retail', businessType: 'electronics', monthlyGmv: 180000, txCount: 600, avgTicket: 300, daysAgo: 0 },
  ]

  // Top recommended providers (for realistic distribution)
  const topProviderSlugs = ['moyasar', 'tap', 'hyperpay', 'paylink', 'myfatoorah', 'paymob', 'geidea']
  
  let createdWizardRuns: Array<{ id: string, sectorId: string | null }> = []
  
  for (const runData of wizardRunsData) {
    const sector = allSectors.find(s => s.code === runData.sectorCode)
    const createdDate = new Date()
    createdDate.setDate(createdDate.getDate() - runData.daysAgo)
    
    const existingRun = await prisma.wizardRun.findFirst({
      where: {
        businessType: runData.businessType,
        monthlyGmv: runData.monthlyGmv,
      }
    })
    
    if (!existingRun) {
      const wizardRun = await prisma.wizardRun.create({
        data: {
          locale: 'ar',
          sectorId: sector?.id || null,
          businessType: runData.businessType,
          monthlyGmv: runData.monthlyGmv,
          txCount: runData.txCount,
          avgTicket: runData.avgTicket,
          refundsRate: 0.02,
          chargebacksRate: 0.005,
          paymentMix: JSON.stringify({ mada: 60, visa_mc: 30, apple_pay: 10 }),
          needs: JSON.stringify({ recurring: false, tokenization: true, multi_currency: false }),
          createdAt: createdDate,
        },
      })
      createdWizardRuns.push({ id: wizardRun.id, sectorId: sector?.id || null })
      
      // Create 3 recommendations for each wizard run
      const shuffledProviders = [...topProviderSlugs].sort(() => Math.random() - 0.5).slice(0, 3)
      let rank = 1
      for (const providerSlug of shuffledProviders) {
        const provider = allProviders.find(p => p.slug === providerSlug)
        if (provider) {
          const baseCost = runData.monthlyGmv * 0.02 // ~2% of GMV
          await prisma.recommendation.create({
            data: {
              wizardRunId: wizardRun.id,
              providerId: provider.id,
              rank: rank,
              expectedCostMin: baseCost * (0.8 + rank * 0.05),
              expectedCostMax: baseCost * (1.0 + rank * 0.1),
              scoreTotal: 95 - (rank - 1) * 10,
              scoreCost: 90 - (rank - 1) * 8,
              scoreFit: 95 - (rank - 1) * 5,
              scoreOps: 88 - (rank - 1) * 7,
              scoreRisk: 92 - (rank - 1) * 6,
              reasons: JSON.stringify(['سهولة التكامل', 'أسعار تنافسية', 'دعم فني ممتاز']),
              caveats: JSON.stringify([]),
              createdAt: createdDate,
            },
          })
          rank++
        }
      }
    }
  }
  console.log('✅ WizardRuns and Recommendations created')

  // Create realistic Leads (20 leads with different statuses)
  const leadsData: Array<{
    name: string
    phone: string
    email: string
    companyName: string
    sector: string
    city: string
    status: 'new' | 'contacted' | 'qualified' | 'won' | 'lost'
    daysAgo: number
  }> = [
    // New leads (recent)
    { name: 'أحمد محمد', phone: '966512345678', email: 'ahmed@company.sa', companyName: 'شركة التقنية', sector: 'التجارة الإلكترونية', city: 'الرياض', status: 'new', daysAgo: 0 },
    { name: 'فاطمة السعيد', phone: '966523456789', email: 'fatima@store.sa', companyName: 'متجر فاشن', sector: 'التجارة الإلكترونية', city: 'جدة', status: 'new', daysAgo: 1 },
    { name: 'عبدالله الراشد', phone: '966534567890', email: 'abdullah@tech.sa', companyName: 'تك سوليوشنز', sector: 'الخدمات', city: 'الدمام', status: 'new', daysAgo: 2 },
    // Contacted leads
    { name: 'سارة العلي', phone: '966545678901', email: 'sara@resto.sa', companyName: 'مطعم الذواقة', sector: 'المطاعم', city: 'الرياض', status: 'contacted', daysAgo: 3 },
    { name: 'محمد الشهري', phone: '966556789012', email: 'mohammed@edu.sa', companyName: 'أكاديمية المستقبل', sector: 'التعليم', city: 'مكة', status: 'contacted', daysAgo: 4 },
    { name: 'نورة الحربي', phone: '966567890123', email: 'noura@health.sa', companyName: 'عيادة الصحة', sector: 'القطاع الطبي', city: 'الرياض', status: 'contacted', daysAgo: 5 },
    { name: 'خالد السعيد', phone: '966578901234', email: 'khaled@clinic.sa', companyName: 'عيادات الصحة', sector: 'القطاع الطبي', city: 'جدة', status: 'contacted', daysAgo: 6 },
    // Qualified leads
    { name: 'هند العتيبي', phone: '966589012345', email: 'hind@fashion.sa', companyName: 'بوتيك هند', sector: 'التجزئة', city: 'الرياض', status: 'qualified', daysAgo: 7 },
    { name: 'سلطان القحطاني', phone: '966590123456', email: 'sultan@travel.sa', companyName: 'وكالة السفر', sector: 'السفر والسياحة', city: 'الدمام', status: 'qualified', daysAgo: 10 },
    { name: 'منى الدوسري', phone: '966501234567', email: 'mona@market.sa', companyName: 'سوق المنى', sector: 'الأسواق الإلكترونية', city: 'الرياض', status: 'qualified', daysAgo: 12 },
    { name: 'يوسف البكري', phone: '966512345679', email: 'youssef@gym.sa', companyName: 'نادي اللياقة', sector: 'الخدمات', city: 'جدة', status: 'qualified', daysAgo: 14 },
    // Won leads (converted)
    { name: 'ريم الزهراني', phone: '966523456780', email: 'reem@store.sa', companyName: 'متجر ريم', sector: 'التجارة الإلكترونية', city: 'الرياض', status: 'won', daysAgo: 15 },
    { name: 'فهد المالكي', phone: '966534567891', email: 'fahad@resto.sa', companyName: 'مطاعم فهد', sector: 'المطاعم', city: 'جدة', status: 'won', daysAgo: 20 },
    { name: 'لمى الغامدي', phone: '966545678902', email: 'lama@beauty.sa', companyName: 'صالون لمى', sector: 'الخدمات', city: 'الرياض', status: 'won', daysAgo: 25 },
    { name: 'عمر الشمري', phone: '966556789013', email: 'omar@cars.sa', companyName: 'معرض السيارات', sector: 'التجزئة', city: 'الدمام', status: 'won', daysAgo: 30 },
    { name: 'دانة القرني', phone: '966567890124', email: 'dana@kids.sa', companyName: 'ملابس الأطفال', sector: 'التجارة الإلكترونية', city: 'مكة', status: 'won', daysAgo: 35 },
    // Lost leads
    { name: 'طلال الحارثي', phone: '966578901235', email: 'talal@company.sa', companyName: 'شركة طلال', sector: 'الخدمات', city: 'الطائف', status: 'lost', daysAgo: 18 },
    { name: 'أمل العنزي', phone: '966589012346', email: 'amal@shop.sa', companyName: 'متجر أمل', sector: 'التجزئة', city: 'الرياض', status: 'lost', daysAgo: 22 },
    { name: 'ماجد الرشيدي', phone: '966590123457', email: 'majed@food.sa', companyName: 'مطعم ماجد', sector: 'المطاعم', city: 'جدة', status: 'lost', daysAgo: 28 },
    { name: 'هيا المطيري', phone: '966501234568', email: 'haya@travel.sa', companyName: 'سفريات هيا', sector: 'السفر والسياحة', city: 'الرياض', status: 'lost', daysAgo: 40 },
  ]

  for (const leadData of leadsData) {
    const createdDate = new Date()
    createdDate.setDate(createdDate.getDate() - leadData.daysAgo)
    
    // Find a matching wizard run for some leads
    const matchingRun = createdWizardRuns.length > 0 
      ? createdWizardRuns[Math.floor(Math.random() * createdWizardRuns.length)]
      : null
    
    const existingLead = await prisma.lead.findFirst({
      where: { email: leadData.email }
    })
    
    if (!existingLead) {
      await prisma.lead.create({
        data: {
          wizardRunId: Math.random() > 0.3 ? matchingRun?.id : null, // 70% linked to wizard runs
          name: leadData.name,
          phone: leadData.phone,
          phoneRaw: leadData.phone,
          phoneNormalized: leadData.phone,
          countryCode: '966',
          email: leadData.email,
          companyName: leadData.companyName,
          sector: leadData.sector,
          city: leadData.city,
          preferredContact: 'whatsapp',
          status: leadData.status,
          whatsappStatus: leadData.status === 'won' ? 'sent' : (leadData.status === 'contacted' ? 'sent' : 'pending'),
          createdAt: createdDate,
          updatedAt: createdDate,
        },
      })
    }
  }
  console.log('✅ Leads created')

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

