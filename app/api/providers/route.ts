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
      orderBy: { nameAr: "asc" },
      skip: (filters.page! - 1) * filters.limit!,
      take: filters.limit!,
    })

    return NextResponse.json({
      providers,
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
