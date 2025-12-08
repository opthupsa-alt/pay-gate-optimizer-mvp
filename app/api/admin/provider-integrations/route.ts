import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { z } from "zod"
import { IntegrationPlatform, IntegrationType, SetupDifficulty } from "@prisma/client"

export const dynamic = "force-dynamic"

// Validation schema
const integrationSchema = z.object({
  provider_id: z.string(),
  platform: z.enum([
    "shopify", "woocommerce", "magento", "opencart", "prestashop",
    "salla", "zid", "expandcart", "youcan", "wordpress",
    "custom_api", "hosted_checkout", "mobile_sdk", "pos"
  ]),
  integration_type: z.enum(["plugin", "api", "hosted", "redirect", "sdk", "iframe"]).default("plugin"),
  is_official: z.boolean().default(true),
  official_url: z.string().url().nullable().optional(),
  docs_url: z.string().url().nullable().optional(),
  setup_difficulty: z.enum(["easy", "medium", "hard"]).default("easy"),
  features_supported: z.array(z.string()).default([]),
  notes_ar: z.string().nullable().optional(),
  notes_en: z.string().nullable().optional(),
  is_active: z.boolean().default(true),
})

export async function GET(request: NextRequest) {
  try {
    // Check admin role
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    if (user.role !== "admin") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 })
    }

    const searchParams = request.nextUrl.searchParams
    const providerId = searchParams.get("provider_id")

    const integrations = await prisma.providerIntegration.findMany({
      where: providerId ? { providerId } : undefined,
      include: {
        provider: {
          select: { id: true, slug: true, nameAr: true, nameEn: true }
        },
      },
      orderBy: { platform: "asc" },
    })

    return NextResponse.json({ integrations })
  } catch (error) {
    console.error("Error fetching integrations:", error)
    return NextResponse.json(
      { error: "فشل في جلب التكاملات" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check admin role
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    if (user.role !== "admin") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 })
    }

    const body = await request.json()
    
    const validation = integrationSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: "بيانات غير صالحة", details: validation.error.errors },
        { status: 400 }
      )
    }

    const data = validation.data

    const integration = await prisma.providerIntegration.create({
      data: {
        providerId: data.provider_id,
        platform: data.platform as IntegrationPlatform,
        integrationType: data.integration_type as IntegrationType,
        isOfficial: data.is_official,
        officialUrl: data.official_url || null,
        docsUrl: data.docs_url || null,
        setupDifficulty: data.setup_difficulty as SetupDifficulty,
        featuresSupported: data.features_supported,
        notesAr: data.notes_ar || null,
        notesEn: data.notes_en || null,
        isActive: data.is_active,
        lastVerifiedAt: new Date(),
      },
    })

    return NextResponse.json({ integration })
  } catch (error) {
    console.error("Error creating integration:", error)
    return NextResponse.json(
      { error: "فشل في إنشاء التكامل" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check admin role
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    if (user.role !== "admin") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: "معرف التكامل مطلوب" }, { status: 400 })
    }

    const existingIntegration = await prisma.providerIntegration.findUnique({
      where: { id },
    })

    if (!existingIntegration) {
      return NextResponse.json({ error: "التكامل غير موجود" }, { status: 404 })
    }

    const integration = await prisma.providerIntegration.update({
      where: { id },
      data: {
        providerId: updates.provider_id,
        platform: updates.platform as IntegrationPlatform,
        integrationType: updates.integration_type as IntegrationType,
        isOfficial: updates.is_official,
        officialUrl: updates.official_url || null,
        docsUrl: updates.docs_url || null,
        setupDifficulty: updates.setup_difficulty as SetupDifficulty,
        featuresSupported: updates.features_supported,
        notesAr: updates.notes_ar || null,
        notesEn: updates.notes_en || null,
        isActive: updates.is_active,
        lastVerifiedAt: new Date(),
      },
    })

    return NextResponse.json({ integration })
  } catch (error) {
    console.error("Error updating integration:", error)
    return NextResponse.json(
      { error: "فشل في تحديث التكامل" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check admin role
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    if (user.role !== "admin") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 })
    }

    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "معرف التكامل مطلوب" }, { status: 400 })
    }

    const existingIntegration = await prisma.providerIntegration.findUnique({
      where: { id },
    })

    if (!existingIntegration) {
      return NextResponse.json({ error: "التكامل غير موجود" }, { status: 404 })
    }

    await prisma.providerIntegration.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting integration:", error)
    return NextResponse.json(
      { error: "فشل في حذف التكامل" },
      { status: 500 }
    )
  }
}

