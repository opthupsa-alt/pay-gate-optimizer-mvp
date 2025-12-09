import { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import ProviderClient from "./provider-client"

interface PageProps {
  params: Promise<{ slug: string }>
}

// Generate static paths for all providers
export async function generateStaticParams() {
  try {
    const providers = await prisma.provider.findMany({
      where: { isActive: true },
      select: { slug: true }
    })
    return providers.map((p) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

// Fetch provider data
async function getProvider(slug: string) {
  try {
    const provider = await prisma.provider.findUnique({
      where: { slug },
      include: {
        providerPaymentMethods: {
          include: { paymentMethod: true }
        },
        pricingRules: {
          include: { paymentMethod: true }
        },
        providerCapabilities: {
          include: { capability: true }
        },
        providerSectorRules: {
          include: { sector: true }
        },
        opsMetrics: true,
        providerFees: {
          include: { paymentMethod: true }
        },
        providerIntegrations: true,
        providerCurrencies: true,
        providerSources: true,
        providerReviews: true,
        providerWallets: true,
        providerBnpl: true,
      }
    })
    return provider
  } catch {
    return null
  }
}

// Generate SEO metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const provider = await getProvider(slug)
  
  if (!provider) {
    return {
      title: "مزود غير موجود | PayGate Optimizer",
      description: "الصفحة المطلوبة غير موجودة"
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://paygate-optimizer.com"
  
  // Use custom meta or generate from provider data
  const titleAr = provider.metaTitleAr || `${provider.nameAr} - بوابة الدفع | PayGate Optimizer`
  const titleEn = provider.metaTitleEn || `${provider.nameEn} - Payment Gateway | PayGate Optimizer`
  const descriptionAr = provider.metaDescriptionAr || provider.descriptionAr || `تعرف على ${provider.nameAr} - رسوم، مميزات، تكاملات، وتقييمات. مقارنة شاملة لبوابات الدفع في السعودية.`
  const descriptionEn = provider.metaDescriptionEn || provider.descriptionEn || `Learn about ${provider.nameEn} - fees, features, integrations, and reviews. Comprehensive payment gateway comparison in Saudi Arabia.`
  
  // Get keywords
  const keywordsAr = Array.isArray(provider.keywordsAr) ? provider.keywordsAr as string[] : []
  const keywordsEn = Array.isArray(provider.keywordsEn) ? provider.keywordsEn as string[] : []
  
  // Default keywords if none provided
  const defaultKeywordsAr = [provider.nameAr, "بوابة دفع", "دفع إلكتروني", "السعودية", "مقارنة بوابات الدفع"]
  const defaultKeywordsEn = [provider.nameEn, "payment gateway", "online payments", "Saudi Arabia", "payment comparison"]
  
  const allKeywordsAr = [...new Set([...keywordsAr, ...defaultKeywordsAr])]
  const allKeywordsEn = [...new Set([...keywordsEn, ...defaultKeywordsEn])]

  // Get images with fallbacks
  const logoUrl = provider.logoUrl || provider.logoPath || "/providers/default-logo.svg"
  const ogImageUrl = provider.ogImageUrl || provider.coverImageUrl || "/providers/default-og.svg"
  
  // Ensure absolute URLs
  const absoluteLogoUrl = logoUrl.startsWith("http") ? logoUrl : `${baseUrl}${logoUrl}`
  const absoluteOgImageUrl = ogImageUrl.startsWith("http") ? ogImageUrl : `${baseUrl}${ogImageUrl}`

  return {
    title: titleAr,
    description: descriptionAr,
    keywords: [...allKeywordsAr, ...allKeywordsEn].join(", "),
    authors: [{ name: "PayGate Optimizer" }],
    creator: "PayGate Optimizer",
    publisher: "PayGate Optimizer",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: `${baseUrl}/providers/${slug}`,
      languages: {
        "ar-SA": `${baseUrl}/providers/${slug}`,
        "en-US": `${baseUrl}/en/providers/${slug}`,
      },
    },
    openGraph: {
      type: "website",
      locale: "ar_SA",
      alternateLocale: "en_US",
      url: `${baseUrl}/providers/${slug}`,
      title: titleAr,
      description: descriptionAr,
      siteName: "PayGate Optimizer",
      images: [
        {
          url: absoluteOgImageUrl,
          width: 1200,
          height: 630,
          alt: `${provider.nameAr} - بوابة الدفع`,
          type: "image/svg+xml",
        },
        {
          url: absoluteLogoUrl,
          width: 200,
          height: 200,
          alt: `شعار ${provider.nameAr}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titleAr,
      description: descriptionAr,
      images: [absoluteOgImageUrl],
      creator: "@paygateoptimizer",
    },
    other: {
      "og:locale": "ar_SA",
      "og:locale:alternate": "en_US",
    },
  }
}

// JSON-LD Structured Data
function generateJsonLd(provider: NonNullable<Awaited<ReturnType<typeof getProvider>>>, baseUrl: string) {
  const logoUrl = provider.logoUrl || provider.logoPath || "/providers/default-logo.svg"
  const absoluteLogoUrl = logoUrl.startsWith("http") ? logoUrl : `${baseUrl}${logoUrl}`

  // Get average rating
  const reviews = provider.providerReviews || []
  const avgRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + (Number(r.ratingAvg) || 0), 0) / reviews.length 
    : null
  const totalReviews = reviews.reduce((sum, r) => sum + (r.ratingCount || 0), 0)

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "@id": `${baseUrl}/providers/${provider.slug}`,
    name: provider.nameAr,
    alternateName: provider.nameEn,
    description: provider.descriptionAr || provider.descriptionEn,
    url: `${baseUrl}/providers/${provider.slug}`,
    image: absoluteLogoUrl,
    provider: {
      "@type": "Organization",
      name: provider.nameEn,
      url: provider.websiteUrl,
      logo: absoluteLogoUrl,
    },
    areaServed: {
      "@type": "Country",
      name: "Saudi Arabia",
    },
    category: "Payment Gateway",
  }

  // Add aggregate rating if available
  if (avgRating && totalReviews > 0) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: avgRating.toFixed(1),
      bestRating: "5",
      worstRating: "1",
      ratingCount: totalReviews,
    }
  }

  // Add offers/pricing
  if (provider.providerFees && provider.providerFees.length > 0) {
    jsonLd.offers = {
      "@type": "Offer",
      priceCurrency: "SAR",
      price: provider.setupFee ? Number(provider.setupFee) : 0,
      availability: provider.status === "active" 
        ? "https://schema.org/InStock" 
        : "https://schema.org/LimitedAvailability",
    }
  }

  // Add FAQ if pros/cons available
  const prosAr = Array.isArray(provider.prosAr) ? provider.prosAr as string[] : []
  const consAr = Array.isArray(provider.consAr) ? provider.consAr as string[] : []

  if (prosAr.length > 0 || consAr.length > 0) {
    const faqItems = []
    
    if (prosAr.length > 0) {
      faqItems.push({
        "@type": "Question",
        name: `ما هي مميزات ${provider.nameAr}؟`,
        acceptedAnswer: {
          "@type": "Answer",
          text: prosAr.join("، "),
        },
      })
    }

    if (consAr.length > 0) {
      faqItems.push({
        "@type": "Question",
        name: `ما هي عيوب ${provider.nameAr}؟`,
        acceptedAnswer: {
          "@type": "Answer",
          text: consAr.join("، "),
        },
      })
    }

    if (faqItems.length > 0) {
      jsonLd.mainEntity = {
        "@type": "FAQPage",
        mainEntity: faqItems,
      }
    }
  }

  return jsonLd
}

// Breadcrumb JSON-LD
function generateBreadcrumbJsonLd(provider: NonNullable<Awaited<ReturnType<typeof getProvider>>>, baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "الرئيسية",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "المزودون",
        item: `${baseUrl}/providers`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: provider.nameAr,
        item: `${baseUrl}/providers/${provider.slug}`,
      },
    ],
  }
}

export default async function ProviderDetailPage({ params }: PageProps) {
  const { slug } = await params
  const provider = await getProvider(slug)

  if (!provider) {
    notFound()
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://paygate-optimizer.com"

  // Transform Prisma result to match expected types
  const transformedProvider = {
    ...provider,
    // Map snake_case to camelCase for client component
    name_ar: provider.nameAr,
    name_en: provider.nameEn,
    description_ar: provider.descriptionAr,
    description_en: provider.descriptionEn,
    notes_ar: provider.notesAr,
    notes_en: provider.notesEn,
    website_url: provider.websiteUrl,
    logo_path: provider.logoPath,
    logo_url: provider.logoUrl,
    cover_image_url: provider.coverImageUrl,
    og_image_url: provider.ogImageUrl,
    is_featured: provider.isFeatured,
    setup_fee: provider.setupFee,
    monthly_fee: provider.monthlyFee,
    activation_time_days_min: provider.activationTimeDaysMin,
    activation_time_days_max: provider.activationTimeDaysMax,
    settlement_days_min: provider.settlementDaysMin,
    settlement_days_max: provider.settlementDaysMax,
    multi_currency_supported: provider.multiCurrencySupported,
    support_channels: provider.supportChannels as string[],
    support_hours: provider.supportHours,
    docs_url: provider.docsUrl,
    pricing_url: provider.pricingUrl,
    last_verified_at: provider.lastVerifiedAt,
    pros_ar: provider.prosAr as string[],
    pros_en: provider.prosEn as string[],
    cons_ar: provider.consAr as string[],
    cons_en: provider.consEn as string[],
    // Transform relations
    provider_fees: provider.providerFees?.map(f => ({
      ...f,
      fee_percent: f.feePercent,
      fee_fixed: f.feeFixed,
      is_estimated: f.isEstimated,
      notes_ar: f.notesAr,
      notes_en: f.notesEn,
      payment_method: f.paymentMethod ? {
        ...f.paymentMethod,
        name_ar: f.paymentMethod.nameAr,
        name_en: f.paymentMethod.nameEn,
      } : null,
    })) || [],
    pricing_rules: provider.pricingRules?.map(r => ({
      ...r,
      fee_percent: r.feePercent,
      fee_fixed: r.feeFixed,
      payment_method: r.paymentMethod ? {
        ...r.paymentMethod,
        name_ar: r.paymentMethod.nameAr,
        name_en: r.paymentMethod.nameEn,
      } : null,
    })) || [],
    provider_integrations: provider.providerIntegrations?.map(i => ({
      ...i,
      integration_type: i.integrationType,
      setup_difficulty: i.setupDifficulty,
      is_official: i.isOfficial,
      official_url: i.officialUrl,
    })) || [],
    provider_reviews: provider.providerReviews?.map(r => ({
      ...r,
      rating_avg: r.ratingAvg,
      rating_max: r.ratingMax,
      rating_count: r.ratingCount,
      source_url: r.sourceUrl,
      highlights_positive: r.highlightsPositive as string[],
      highlights_negative: r.highlightsNegative as string[],
    })) || [],
  }

  // Get sources separately
  const sources = provider.providerSources?.map(s => ({
    ...s,
    source_type: s.sourceType,
    source_url: s.sourceUrl,
    source_name: s.sourceName,
    entity_type: s.entityType,
    confidence_level: s.confidenceLevel,
    last_verified_at: s.lastVerifiedAt,
  })) || []

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateJsonLd(provider, baseUrl)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbJsonLd(provider, baseUrl)),
        }}
      />
      
      {/* Client Component */}
      <ProviderClient 
        slug={slug} 
        initialProvider={transformedProvider as never} 
        initialSources={sources as never[]}
      />
    </>
  )
}
