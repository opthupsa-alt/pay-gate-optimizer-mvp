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

    const provider = await prisma.provider.update({
      where: { id },
      data: {
        slug: updates.slug,
        nameAr: updates.name_ar,
        nameEn: updates.name_en,
        websiteUrl: updates.website_url,
        activationTimeDaysMin: updates.activation_time_days_min,
        activationTimeDaysMax: updates.activation_time_days_max,
        settlementDaysMin: updates.settlement_days_min,
        settlementDaysMax: updates.settlement_days_max,
        supportChannels: updates.support_channels,
        notesAr: updates.notes_ar,
        notesEn: updates.notes_en,
        isActive: updates.is_active,
      },
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
