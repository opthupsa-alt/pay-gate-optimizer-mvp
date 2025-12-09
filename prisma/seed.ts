import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

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
  ]

  for (const provider of providers) {
    const created = await prisma.provider.upsert({
      where: { slug: provider.slug },
      update: provider,
      create: provider,
    })

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
  }
  console.log('✅ Providers created with pricing rules')

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

