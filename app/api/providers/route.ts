import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

export const dynamic = "force-dynamic"

interface ProviderFilters {
  category?: string
  payment_methods?: string[]
  settlement_days_max?: number
  search?: string
  page?: number
  limit?: number
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    const filters: ProviderFilters = {
      category: searchParams.get("category") || undefined,
      payment_methods: searchParams.get("payment_methods")?.split(",").filter(Boolean),
      settlement_days_max: searchParams.get("settlement_days_max") 
        ? parseInt(searchParams.get("settlement_days_max")!) 
        : undefined,
      search: searchParams.get("search") || undefined,
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "20"),
    }

    // Build where clause
    const where: Record<string, unknown> = {
      isActive: true,
    }

    if (filters.category && filters.category !== "all") {
      where.category = filters.category
    }

    if (filters.search) {
      where.OR = [
        { nameAr: { contains: filters.search } },
        { nameEn: { contains: filters.search } },
        { slug: { contains: filters.search } },
      ]
    }

    if (filters.settlement_days_max) {
      where.settlementDaysMin = { lte: filters.settlement_days_max }
    }

    // Get total count
    const total = await prisma.provider.count({ where })

    // Get providers with relations
    const providers = await prisma.provider.findMany({
      where,
      include: {
        providerFees: {
          include: {
            paymentMethod: true,
          },
        },
        providerIntegrations: true,
        providerReviews: true,
        providerPaymentMethods: {
          include: {
            paymentMethod: true,
          },
        },
        opsMetrics: true,
      },
      orderBy: [
        { isFeatured: "desc" },
        { displayOrder: "asc" },
        { nameAr: "asc" },
      ],
      skip: (filters.page! - 1) * filters.limit!,
      take: filters.limit!,
    })

    // Transform providers to match expected format
    const transformedProviders = providers.map(p => ({
      id: p.id,
      slug: p.slug,
      name_ar: p.nameAr,
      name_en: p.nameEn,
      description_ar: p.descriptionAr,
      description_en: p.descriptionEn,
      notes_ar: p.notesAr,
      notes_en: p.notesEn,
      website_url: p.websiteUrl,
      logo_path: p.logoPath,
      logo_url: p.logoUrl,
      cover_image_url: p.coverImageUrl,
      is_featured: p.isFeatured,
      display_order: p.displayOrder,
      category: p.category,
      activation_time_days_min: p.activationTimeDaysMin,
      activation_time_days_max: p.activationTimeDaysMax,
      settlement_days_min: p.settlementDaysMin,
      settlement_days_max: p.settlementDaysMax,
      multi_currency_supported: p.multiCurrencySupported,
      status: p.status,
      provider_fees: p.providerFees?.map(f => ({
        id: f.id,
        fee_percent: f.feePercent,
        fee_fixed: f.feeFixed,
        payment_method: f.paymentMethod ? {
          id: f.paymentMethod.id,
          name_ar: f.paymentMethod.nameAr,
          name_en: f.paymentMethod.nameEn,
        } : null,
      })) || [],
      provider_integrations: p.providerIntegrations?.map(i => ({
        id: i.id,
        platform: i.platform,
        integration_type: i.integrationType,
        is_official: i.isOfficial,
      })) || [],
      provider_reviews: p.providerReviews?.map(r => ({
        id: r.id,
        platform: r.platform,
        rating_avg: r.ratingAvg,
        rating_max: r.ratingMax,
        rating_count: r.ratingCount,
      })) || [],
    }))

    return NextResponse.json({
      providers: transformedProviders,
      total,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(total / filters.limit!),
    })
  } catch (error) {
    console.error("Error in providers API:", error)
    return NextResponse.json(
      { error: "فشل في جلب المزودين" },
      { status: 500 }
    )
  }
}
