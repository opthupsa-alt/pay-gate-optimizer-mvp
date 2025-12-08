import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { calculateRecommendationsExtended, calculateRecommendationsMockExtended } from "@/lib/engines/recommendation-engine"
import { z } from "zod"
import type { CompareRequest, WizardFormData, PaymentMix, WizardNeeds } from "@/lib/types"
import { checkRateLimit, getClientIP, RateLimitPresets, createRateLimitHeaders } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"

// Validation schema
const compareSchema = z.object({
  sector_id: z.string().uuid().optional(),
  monthly_gmv: z.number().min(0),
  tx_count: z.number().min(0),
  avg_ticket: z.number().min(0),
  payment_mix: z.object({
    mada: z.number().min(0).max(100),
    visa_mc: z.number().min(0).max(100),
    apple_pay: z.number().min(0).max(100),
    google_pay: z.number().min(0).max(100),
    stc_pay: z.number().min(0).max(100).optional(),
    tabby: z.number().min(0).max(100).optional(),
    tamara: z.number().min(0).max(100).optional(),
    other: z.number().min(0).max(100),
  }),
  needs: z.object({
    recurring: z.boolean(),
    tokenization: z.boolean(),
    multi_currency: z.boolean(),
    international_customers: z.boolean().optional(),
    plugins_shopify: z.boolean(),
    plugins_woocommerce: z.boolean(),
    plugins_salla: z.boolean().optional(),
    plugins_zid: z.boolean().optional(),
    fast_settlement: z.boolean(),
    apple_pay: z.boolean(),
    google_pay: z.boolean(),
    bnpl_support: z.boolean().optional(),
  }),
  platform: z.string().optional(),
  refunds_rate: z.number().min(0).max(100).optional(),
  chargebacks_rate: z.number().min(0).max(100).optional(),
  locale: z.enum(["ar", "en"]).optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request)
    const rateLimitResult = checkRateLimit(clientIP, RateLimitPresets.wizard)
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: "تم تجاوز الحد الأقصى للطلبات. يرجى المحاولة بعد قليل.",
          retryAfter: rateLimitResult.resetIn
        },
        { 
          status: 429,
          headers: createRateLimitHeaders(rateLimitResult)
        }
      )
    }

    const body = await request.json()
    
    // Validate request
    const validation = compareSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: "بيانات غير صالحة",
          details: validation.error.errors 
        },
        { status: 400 }
      )
    }

    const data = validation.data as CompareRequest

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const useMock = !supabaseUrl || supabaseUrl.includes("placeholder")

    // Convert to WizardFormData format
    const wizardData: WizardFormData = {
      sector_id: data.sector_id || "",
      business_type: "ecommerce",
      monthly_gmv: data.monthly_gmv,
      tx_count: data.tx_count,
      avg_ticket: data.avg_ticket,
      payment_mix: data.payment_mix as PaymentMix,
      refunds_rate: body.refunds_rate || 2,
      chargebacks_rate: body.chargebacks_rate || 0.5,
      needs: data.needs as WizardNeeds,
      platform: data.platform as WizardFormData["platform"],
      locale: body.locale || "ar",
    }

    let recommendations
    let wizardRunId = `compare-${Date.now()}`

    if (useMock) {
      // Use mock data
      recommendations = await calculateRecommendationsMockExtended(wizardData)
    } else {
      // Use Supabase
      const supabase = await createClient()

      // Create wizard run record
      const { data: wizardRun, error: wizardError } = await supabase
        .from("wizard_runs")
        .insert({
          locale: wizardData.locale,
          sector_id: wizardData.sector_id || null,
          business_type: wizardData.business_type,
          monthly_gmv: wizardData.monthly_gmv,
          tx_count: wizardData.tx_count,
          avg_ticket: wizardData.avg_ticket,
          payment_mix: wizardData.payment_mix,
          needs: wizardData.needs,
          refunds_rate: wizardData.refunds_rate,
          chargebacks_rate: wizardData.chargebacks_rate,
        })
        .select()
        .single()

      if (wizardError) {
        console.error("Error creating wizard run:", wizardError)
        throw wizardError
      }

      wizardRunId = wizardRun.id
      recommendations = await calculateRecommendationsExtended(supabase, wizardData)

      // Save recommendations
      if (recommendations.length > 0) {
        const recommendationsToSave = recommendations.map((rec, index) => ({
          wizard_run_id: wizardRunId,
          provider_id: rec.provider_id,
          rank: index + 1,
          expected_cost_min: rec.expected_cost_min,
          expected_cost_max: rec.expected_cost_max,
          breakdown: rec.breakdown,
          score_total: rec.score_total,
          score_cost: rec.score_cost,
          score_fit: rec.score_fit,
          score_ops: rec.score_ops,
          score_risk: rec.score_risk,
          reasons: rec.reasons,
          caveats: rec.caveats,
        }))

        await supabase.from("recommendations").insert(recommendationsToSave)
      }
    }

    return NextResponse.json({
      recommendations,
      wizard_run_id: wizardRunId,
      generated_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in compare API:", error)
    return NextResponse.json(
      { error: "فشل في إجراء المقارنة" },
      { status: 500 }
    )
  }
}

