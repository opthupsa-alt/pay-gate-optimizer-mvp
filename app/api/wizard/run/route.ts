import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import type { WizardFormData } from "@/lib/types"
import { calculateRecommendations, calculateRecommendationsMock } from "@/lib/engines/recommendation-engine"

const USE_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                 process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://your-project.supabase.co'

export async function POST(request: NextRequest) {
  try {
    const data: WizardFormData = await request.json()

    // Validate required fields
    if (!data.sector_id || !data.business_type) {
      return NextResponse.json({ error: "Sector and business type are required" }, { status: 400 })
    }

    if (data.monthly_gmv < 1000 || data.tx_count < 10) {
      return NextResponse.json({ error: "Invalid volume data" }, { status: 400 })
    }

    const paymentMixTotal = Object.values(data.payment_mix).reduce((sum, val) => sum + val, 0)
    if (paymentMixTotal !== 100) {
      return NextResponse.json({ error: "Payment mix must total 100%" }, { status: 400 })
    }

    // Hash IP for privacy
    const forwarded = request.headers.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(",")[0] : "unknown"
    const ipHash = await hashIP(ip)

    // Use mock data if Supabase is not configured
    if (USE_MOCK) {
      const mockWizardRun = {
        id: `mock-${Date.now()}`,
        locale: data.locale,
        ip_hash: ipHash,
        sector_id: data.sector_id,
        business_type: data.business_type,
        monthly_gmv: data.monthly_gmv,
        tx_count: data.tx_count,
        avg_ticket: data.avg_ticket,
        refunds_rate: data.refunds_rate / 100,
        chargebacks_rate: data.chargebacks_rate / 100,
        payment_mix: data.payment_mix,
        needs: data.needs,
        created_at: new Date().toISOString(),
      }

      const recommendations = calculateRecommendationsMock(mockWizardRun, data)

      // Store in sessionStorage via response
      return NextResponse.json({ 
        wizardRunId: mockWizardRun.id,
        recommendations,
        wizardRun: mockWizardRun,
        isMock: true 
      })
    }

    const supabase = await createClient()

    // Create wizard run
    const { data: wizardRun, error: wizardError } = await supabase
      .from("wizard_runs")
      .insert({
        locale: data.locale,
        ip_hash: ipHash,
        sector_id: data.sector_id,
        business_type: data.business_type,
        monthly_gmv: data.monthly_gmv,
        tx_count: data.tx_count,
        avg_ticket: data.avg_ticket,
        refunds_rate: data.refunds_rate / 100,
        chargebacks_rate: data.chargebacks_rate / 100,
        payment_mix: data.payment_mix,
        needs: data.needs,
      })
      .select()
      .single()

    if (wizardError || !wizardRun) {
      console.error("Wizard run error:", wizardError)
      return NextResponse.json({ error: "Failed to create wizard run" }, { status: 500 })
    }

    // Calculate recommendations
    const recommendations = await calculateRecommendations(supabase, wizardRun, data)

    // Store recommendations
    if (recommendations.length > 0) {
      const { error: recError } = await supabase.from("recommendations").insert(
        recommendations.map((rec, index) => ({
          wizard_run_id: wizardRun.id,
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
        })),
      )

      if (recError) {
        console.error("Recommendations error:", recError)
      }
    }

    return NextResponse.json({ wizardRunId: wizardRun.id })
  } catch (error) {
    console.error("Wizard API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(ip + process.env.SUPABASE_JWT_SECRET)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}
