import { type NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import prisma from "@/lib/db"

async function isAdmin(request: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) return false
  
  const token = await getToken({ req: request, secret })
  if (!token) return false
  return token.role === "admin"
}

// GET - List all providers
export async function GET(request: NextRequest) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const providers = await prisma.provider.findMany({
      include: {
        providerPaymentMethods: {
          include: {
            paymentMethod: true,
          },
        },
        pricingRules: {
          include: {
            paymentMethod: true,
          },
        },
        opsMetrics: true,
        providerFees: true,
        providerIntegrations: true,
        providerReviews: true,
      },
      orderBy: { nameEn: "asc" },
    })

    return NextResponse.json({ providers })
  } catch (error) {
    console.error("Error fetching providers:", error)
    return NextResponse.json({ error: "Failed to fetch providers" }, { status: 500 })
  }
}

// POST - Create new provider
export async function POST(request: NextRequest) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    
    const provider = await prisma.provider.create({
      data: {
        slug: body.slug,
        nameAr: body.name_ar,
        nameEn: body.name_en,
        websiteUrl: body.website_url,
        logoUrl: body.logo_url,
        coverImageUrl: body.cover_image_url,
        ogImageUrl: body.og_image_url,
        keywordsAr: body.keywords_ar || [],
        keywordsEn: body.keywords_en || [],
        metaTitleAr: body.meta_title_ar,
        metaTitleEn: body.meta_title_en,
        metaDescriptionAr: body.meta_description_ar,
        metaDescriptionEn: body.meta_description_en,
        displayOrder: body.display_order || 0,
        isFeatured: body.is_featured ?? false,
        activationTimeDaysMin: body.activation_time_days_min || 1,
        activationTimeDaysMax: body.activation_time_days_max || 14,
        settlementDaysMin: body.settlement_days_min || 1,
        settlementDaysMax: body.settlement_days_max || 3,
        supportChannels: body.support_channels || [],
        notesAr: body.notes_ar,
        notesEn: body.notes_en,
        isActive: body.is_active ?? true,
      },
    })

    return NextResponse.json({ provider })
  } catch (error) {
    console.error("Error creating provider:", error)
    return NextResponse.json({ error: "Failed to create provider" }, { status: 500 })
  }
}

// PUT - Update provider
export async function PUT(request: NextRequest) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: "Provider ID is required" }, { status: 400 })
    }

    // Build update data object, only including defined fields
    const updateData: Record<string, unknown> = {}
    
    if (updates.slug !== undefined) updateData.slug = updates.slug
    if (updates.name_ar !== undefined) updateData.nameAr = updates.name_ar
    if (updates.name_en !== undefined) updateData.nameEn = updates.name_en
    if (updates.website_url !== undefined) updateData.websiteUrl = updates.website_url
    if (updates.logo_url !== undefined) updateData.logoUrl = updates.logo_url
    if (updates.cover_image_url !== undefined) updateData.coverImageUrl = updates.cover_image_url
    if (updates.og_image_url !== undefined) updateData.ogImageUrl = updates.og_image_url
    if (updates.keywords_ar !== undefined) updateData.keywordsAr = updates.keywords_ar
    if (updates.keywords_en !== undefined) updateData.keywordsEn = updates.keywords_en
    if (updates.meta_title_ar !== undefined) updateData.metaTitleAr = updates.meta_title_ar
    if (updates.meta_title_en !== undefined) updateData.metaTitleEn = updates.meta_title_en
    if (updates.meta_description_ar !== undefined) updateData.metaDescriptionAr = updates.meta_description_ar
    if (updates.meta_description_en !== undefined) updateData.metaDescriptionEn = updates.meta_description_en
    if (updates.display_order !== undefined) updateData.displayOrder = updates.display_order
    if (updates.is_featured !== undefined) updateData.isFeatured = updates.is_featured
    if (updates.activation_time_days_min !== undefined) updateData.activationTimeDaysMin = updates.activation_time_days_min
    if (updates.activation_time_days_max !== undefined) updateData.activationTimeDaysMax = updates.activation_time_days_max
    if (updates.settlement_days_min !== undefined) updateData.settlementDaysMin = updates.settlement_days_min
    if (updates.settlement_days_max !== undefined) updateData.settlementDaysMax = updates.settlement_days_max
    if (updates.support_channels !== undefined) updateData.supportChannels = updates.support_channels
    if (updates.notes_ar !== undefined) updateData.notesAr = updates.notes_ar
    if (updates.notes_en !== undefined) updateData.notesEn = updates.notes_en
    if (updates.is_active !== undefined) updateData.isActive = updates.is_active

    const provider = await prisma.provider.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ provider })
  } catch (error) {
    console.error("Error updating provider:", error)
    return NextResponse.json({ error: "Failed to update provider" }, { status: 500 })
  }
}

// DELETE - Delete provider
export async function DELETE(request: NextRequest) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Provider ID is required" }, { status: 400 })
    }

    await prisma.provider.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Provider deleted successfully" })
  } catch (error) {
    console.error("Error deleting provider:", error)
    return NextResponse.json({ error: "Failed to delete provider" }, { status: 500 })
  }
}
