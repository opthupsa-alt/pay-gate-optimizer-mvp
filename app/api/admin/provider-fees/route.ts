import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

export const dynamic = "force-dynamic"

// Validation schema for provider fee
const providerFeeSchema = z.object({
  provider_id: z.string().uuid(),
  payment_method_id: z.string().uuid().nullable().optional(),
  fee_percent: z.number().min(0).max(100),
  fee_fixed: z.number().min(0),
  monthly_fee: z.number().min(0).optional().default(0),
  setup_fee: z.number().min(0).optional().default(0),
  refund_fee_fixed: z.number().min(0).optional().default(0),
  refund_fee_percent: z.number().min(0).optional().default(0),
  chargeback_fee_fixed: z.number().min(0).optional().default(0),
  cross_border_fee_percent: z.number().min(0).optional().default(0),
  currency_conversion_fee_percent: z.number().min(0).optional().default(0),
  payout_fee_fixed: z.number().min(0).optional().default(0),
  minimum_fee_per_txn: z.number().min(0).nullable().optional(),
  maximum_fee_per_txn: z.number().min(0).nullable().optional(),
  minimum_txn_amount: z.number().min(0).nullable().optional(),
  maximum_txn_amount: z.number().min(0).nullable().optional(),
  volume_tier: z.string().nullable().optional(),
  currency: z.string().default("SAR"),
  notes_ar: z.string().nullable().optional(),
  notes_en: z.string().nullable().optional(),
  is_estimated: z.boolean().default(false),
  source_url: z.string().url().nullable().optional(),
  effective_from: z.string().nullable().optional(),
  effective_to: z.string().nullable().optional(),
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

    // Get query params
    const searchParams = request.nextUrl.searchParams
    const providerId = searchParams.get("provider_id")

    let query = supabase
      .from("provider_fees")
      .select(`
        *,
        payment_methods(id, code, name_ar, name_en),
        providers(id, slug, name_ar, name_en)
      `)
      .order("created_at", { ascending: false })

    if (providerId) {
      query = query.eq("provider_id", providerId)
    }

    const { data: fees, error } = await query

    if (error) throw error

    return NextResponse.json({ fees })
  } catch (error) {
    console.error("Error fetching provider fees:", error)
    return NextResponse.json(
      { error: "فشل في جلب رسوم المزود" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    
    // Validate input
    const validation = providerFeeSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: "بيانات غير صالحة", details: validation.error.errors },
        { status: 400 }
      )
    }

    const feeData = {
      ...validation.data,
      last_verified_at: new Date().toISOString(),
    }

    const { data: fee, error } = await supabase
      .from("provider_fees")
      .insert(feeData)
      .select()
      .single()

    if (error) throw error

    // Log to audit
    await supabase.from("audit_log").insert({
      table_name: "provider_fees",
      record_id: fee.id,
      action: "INSERT",
      new_values: feeData,
      user_id: user.id,
      user_email: user.email,
    })

    return NextResponse.json({ fee })
  } catch (error) {
    console.error("Error creating provider fee:", error)
    return NextResponse.json(
      { error: "فشل في إنشاء رسوم المزود" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
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

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: "معرف الرسوم مطلوب" }, { status: 400 })
    }

    // Get old values for audit
    const { data: oldFee } = await supabase
      .from("provider_fees")
      .select("*")
      .eq("id", id)
      .single()

    const feeData = {
      ...updates,
      updated_at: new Date().toISOString(),
    }

    const { data: fee, error } = await supabase
      .from("provider_fees")
      .update(feeData)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    // Log to audit
    await supabase.from("audit_log").insert({
      table_name: "provider_fees",
      record_id: id,
      action: "UPDATE",
      old_values: oldFee,
      new_values: feeData,
      user_id: user.id,
      user_email: user.email,
    })

    return NextResponse.json({ fee })
  } catch (error) {
    console.error("Error updating provider fee:", error)
    return NextResponse.json(
      { error: "فشل في تحديث رسوم المزود" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
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

    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "معرف الرسوم مطلوب" }, { status: 400 })
    }

    // Get old values for audit
    const { data: oldFee } = await supabase
      .from("provider_fees")
      .select("*")
      .eq("id", id)
      .single()

    const { error } = await supabase
      .from("provider_fees")
      .delete()
      .eq("id", id)

    if (error) throw error

    // Log to audit
    await supabase.from("audit_log").insert({
      table_name: "provider_fees",
      record_id: id,
      action: "DELETE",
      old_values: oldFee,
      user_id: user.id,
      user_email: user.email,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting provider fee:", error)
    return NextResponse.json(
      { error: "فشل في حذف رسوم المزود" },
      { status: 500 }
    )
  }
}

