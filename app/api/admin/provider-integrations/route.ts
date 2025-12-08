import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

export const dynamic = "force-dynamic"

// Validation schema
const integrationSchema = z.object({
  provider_id: z.string().uuid(),
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
    const supabase = await createClient()
    
    // Check admin role
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 })
    }

    const searchParams = request.nextUrl.searchParams
    const providerId = searchParams.get("provider_id")

    let query = supabase
      .from("provider_integrations")
      .select(`
        *,
        providers(id, slug, name_ar, name_en)
      `)
      .order("platform")

    if (providerId) {
      query = query.eq("provider_id", providerId)
    }

    const { data: integrations, error } = await query

    if (error) throw error

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
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "admin") {
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

    const { data: integration, error } = await supabase
      .from("provider_integrations")
      .insert({
        ...validation.data,
        last_verified_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

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
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: "معرف التكامل مطلوب" }, { status: 400 })
    }

    const { data: integration, error } = await supabase
      .from("provider_integrations")
      .update({
        ...updates,
        last_verified_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

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
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 })
    }

    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "معرف التكامل مطلوب" }, { status: 400 })
    }

    const { error } = await supabase
      .from("provider_integrations")
      .delete()
      .eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting integration:", error)
    return NextResponse.json(
      { error: "فشل في حذف التكامل" },
      { status: 500 }
    )
  }
}

