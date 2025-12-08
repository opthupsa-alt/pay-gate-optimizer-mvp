import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { DataQualityIssue } from "@/lib/types"

export const dynamic = "force-dynamic"

const STALE_DATA_DAYS = 90 // Data older than 90 days is considered stale

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

    const issues: DataQualityIssue[] = []

    // 1. Providers without pricing_url
    const { data: noPricingUrl } = await supabase
      .from("providers")
      .select("id, name_ar, name_en, pricing_url, last_verified_at")
      .eq("is_active", true)
      .is("pricing_url", null)

    if (noPricingUrl) {
      for (const provider of noPricingUrl) {
        issues.push({
          provider_id: provider.id,
          provider_name: provider.name_ar,
          issue_type: "no_pricing_url",
          description: "المزود ليس لديه رابط صفحة الأسعار الرسمية",
          last_verified_at: provider.last_verified_at,
          severity: "medium",
        })
      }
    }

    // 2. Stale data (last_verified_at > 90 days)
    const staleDate = new Date()
    staleDate.setDate(staleDate.getDate() - STALE_DATA_DAYS)

    const { data: staleProviders } = await supabase
      .from("providers")
      .select("id, name_ar, name_en, last_verified_at")
      .eq("is_active", true)
      .lt("last_verified_at", staleDate.toISOString())

    if (staleProviders) {
      for (const provider of staleProviders) {
        const daysSince = Math.floor(
          (Date.now() - new Date(provider.last_verified_at).getTime()) / (1000 * 60 * 60 * 24)
        )
        issues.push({
          provider_id: provider.id,
          provider_name: provider.name_ar,
          issue_type: "stale_data",
          description: `آخر تحقق من البيانات منذ ${daysSince} يوم`,
          last_verified_at: provider.last_verified_at,
          severity: daysSince > 180 ? "high" : "medium",
        })
      }
    }

    // 3. Estimated fees
    const { data: estimatedFees } = await supabase
      .from("provider_fees")
      .select(`
        id,
        provider_id,
        is_estimated,
        providers(name_ar, name_en)
      `)
      .eq("is_estimated", true)
      .eq("is_active", true)

    if (estimatedFees) {
      // Group by provider
      const providerEstimates = new Map<string, number>()
      for (const fee of estimatedFees) {
        const count = providerEstimates.get(fee.provider_id) || 0
        providerEstimates.set(fee.provider_id, count + 1)
      }

      for (const [providerId, count] of providerEstimates) {
        const fee = estimatedFees.find(f => f.provider_id === providerId)
        const provider = fee?.providers as unknown as { name_ar: string; name_en: string } | null
        if (provider) {
          issues.push({
            provider_id: providerId,
            provider_name: provider.name_ar,
            issue_type: "estimated_data",
            description: `${count} رسوم مقدرة (غير مؤكدة)`,
            last_verified_at: null,
            severity: count > 3 ? "high" : "low",
          })
        }
      }
    }

    // 4. Missing fees (providers without any fees)
    const { data: allProviders } = await supabase
      .from("providers")
      .select("id, name_ar, name_en")
      .eq("is_active", true)

    const { data: providersWithFees } = await supabase
      .from("provider_fees")
      .select("provider_id")
      .eq("is_active", true)

    if (allProviders && providersWithFees) {
      const providerIdsWithFees = new Set(providersWithFees.map(f => f.provider_id))
      
      for (const provider of allProviders) {
        if (!providerIdsWithFees.has(provider.id)) {
          // Check pricing_rules as fallback
          const { data: pricingRules } = await supabase
            .from("pricing_rules")
            .select("id")
            .eq("provider_id", provider.id)
            .eq("is_active", true)
            .limit(1)

          if (!pricingRules || pricingRules.length === 0) {
            issues.push({
              provider_id: provider.id,
              provider_name: provider.name_ar,
              issue_type: "missing_fees",
              description: "المزود ليس لديه رسوم مسجلة",
              last_verified_at: null,
              severity: "high",
            })
          }
        }
      }
    }

    // 5. Missing integrations (active providers without any integrations)
    const { data: providersWithIntegrations } = await supabase
      .from("provider_integrations")
      .select("provider_id")
      .eq("is_active", true)

    if (allProviders && providersWithIntegrations) {
      const providerIdsWithIntegrations = new Set(providersWithIntegrations.map(i => i.provider_id))
      
      for (const provider of allProviders) {
        if (!providerIdsWithIntegrations.has(provider.id)) {
          issues.push({
            provider_id: provider.id,
            provider_name: provider.name_ar,
            issue_type: "missing_integrations",
            description: "المزود ليس لديه تكاملات مسجلة",
            last_verified_at: null,
            severity: "low",
          })
        }
      }
    }

    // Sort by severity
    const severityOrder = { high: 0, medium: 1, low: 2 }
    issues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])

    // Summary stats
    const summary = {
      total_issues: issues.length,
      high_severity: issues.filter(i => i.severity === "high").length,
      medium_severity: issues.filter(i => i.severity === "medium").length,
      low_severity: issues.filter(i => i.severity === "low").length,
      by_type: {
        no_pricing_url: issues.filter(i => i.issue_type === "no_pricing_url").length,
        stale_data: issues.filter(i => i.issue_type === "stale_data").length,
        estimated_data: issues.filter(i => i.issue_type === "estimated_data").length,
        missing_fees: issues.filter(i => i.issue_type === "missing_fees").length,
        missing_integrations: issues.filter(i => i.issue_type === "missing_integrations").length,
      },
    }

    return NextResponse.json({ issues, summary })
  } catch (error) {
    console.error("Error checking data quality:", error)
    return NextResponse.json(
      { error: "فشل في فحص جودة البيانات" },
      { status: 500 }
    )
  }
}

