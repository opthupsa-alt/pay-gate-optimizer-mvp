import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { z } from "zod"

export const dynamic = "force-dynamic"

// Validation schema for provider fee
const providerFeeSchema = z.object({
  provider_id: z.string(),
  payment_method_id: z.string().nullable().optional(),
  fee_percent: z.number().min(0).max(100),
  fee_fixed: z.number().min(0),
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
    // Check admin role
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    if (user.role !== "admin") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 })
    }

    // Get query params
    const searchParams = request.nextUrl.searchParams
    const providerId = searchParams.get("provider_id")

    const fees = await prisma.providerFee.findMany({
      where: providerId ? { providerId } : undefined,
      include: {
        paymentMethod: true,
        provider: {
          select: { id: true, slug: true, nameAr: true, nameEn: true }
        },
      },
      orderBy: { createdAt: "desc" },
    })

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
    // Check admin role
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    if (user.role !== "admin") {
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

    const data = validation.data

    const fee = await prisma.providerFee.create({
      data: {
        providerId: data.provider_id,
        paymentMethodId: data.payment_method_id || null,
        feePercent: data.fee_percent,
        feeFixed: data.fee_fixed,
        refundFeeFixed: data.refund_fee_fixed || 0,
        refundFeePercent: data.refund_fee_percent || 0,
        chargebackFeeFixed: data.chargeback_fee_fixed || 0,
        crossBorderFeePercent: data.cross_border_fee_percent || 0,
        currencyConversionPercent: data.currency_conversion_fee_percent || 0,
        payoutFeeFixed: data.payout_fee_fixed || 0,
        minimumFeePerTxn: data.minimum_fee_per_txn || null,
        maximumFeePerTxn: data.maximum_fee_per_txn || null,
        minimumTxnAmount: data.minimum_txn_amount || null,
        maximumTxnAmount: data.maximum_txn_amount || null,
        volumeTier: data.volume_tier || null,
        currency: data.currency || "SAR",
        notesAr: data.notes_ar || null,
        notesEn: data.notes_en || null,
        isEstimated: data.is_estimated || false,
        sourceUrl: data.source_url || null,
        effectiveFrom: data.effective_from ? new Date(data.effective_from) : null,
        effectiveTo: data.effective_to ? new Date(data.effective_to) : null,
        isActive: data.is_active ?? true,
        lastVerifiedAt: new Date(),
      },
    })

    // Log to audit
    await prisma.auditLog.create({
      data: {
        tableName: "provider_fees",
        recordId: fee.id,
        action: "INSERT",
        newValues: data as object,
        userId: user.id,
      },
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
      return NextResponse.json({ error: "معرف الرسوم مطلوب" }, { status: 400 })
    }

    // Get old values for audit
    const oldFee = await prisma.providerFee.findUnique({
      where: { id },
    })

    if (!oldFee) {
      return NextResponse.json({ error: "الرسوم غير موجودة" }, { status: 404 })
    }

    const fee = await prisma.providerFee.update({
      where: { id },
      data: {
        providerId: updates.provider_id,
        paymentMethodId: updates.payment_method_id || null,
        feePercent: updates.fee_percent,
        feeFixed: updates.fee_fixed,
        refundFeeFixed: updates.refund_fee_fixed || 0,
        refundFeePercent: updates.refund_fee_percent || 0,
        chargebackFeeFixed: updates.chargeback_fee_fixed || 0,
        crossBorderFeePercent: updates.cross_border_fee_percent || 0,
        currencyConversionPercent: updates.currency_conversion_fee_percent || 0,
        payoutFeeFixed: updates.payout_fee_fixed || 0,
        minimumFeePerTxn: updates.minimum_fee_per_txn || null,
        maximumFeePerTxn: updates.maximum_fee_per_txn || null,
        minimumTxnAmount: updates.minimum_txn_amount || null,
        maximumTxnAmount: updates.maximum_txn_amount || null,
        volumeTier: updates.volume_tier || null,
        currency: updates.currency || "SAR",
        notesAr: updates.notes_ar || null,
        notesEn: updates.notes_en || null,
        isEstimated: updates.is_estimated || false,
        sourceUrl: updates.source_url || null,
        effectiveFrom: updates.effective_from ? new Date(updates.effective_from) : null,
        effectiveTo: updates.effective_to ? new Date(updates.effective_to) : null,
        isActive: updates.is_active ?? true,
      },
    })

    // Log to audit
    await prisma.auditLog.create({
      data: {
        tableName: "provider_fees",
        recordId: id,
        action: "UPDATE",
        oldValues: oldFee as object,
        newValues: updates as object,
        userId: user.id,
      },
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
      return NextResponse.json({ error: "معرف الرسوم مطلوب" }, { status: 400 })
    }

    // Get old values for audit
    const oldFee = await prisma.providerFee.findUnique({
      where: { id },
    })

    if (!oldFee) {
      return NextResponse.json({ error: "الرسوم غير موجودة" }, { status: 404 })
    }

    await prisma.providerFee.delete({
      where: { id },
    })

    // Log to audit
    await prisma.auditLog.create({
      data: {
        tableName: "provider_fees",
        recordId: id,
        action: "DELETE",
        oldValues: oldFee as object,
        userId: user.id,
      },
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

