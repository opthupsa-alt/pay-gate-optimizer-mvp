import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { ProviderImportRow, ImportResult } from "@/lib/types"

export const dynamic = "force-dynamic"

// Validate a single import row
function validateRow(row: Record<string, unknown>, rowIndex: number): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Required fields
  if (!row.provider_slug || typeof row.provider_slug !== "string") {
    errors.push(`Row ${rowIndex}: provider_slug is required`)
  }
  if (!row.name_ar || typeof row.name_ar !== "string") {
    errors.push(`Row ${rowIndex}: name_ar is required`)
  }
  if (!row.name_en || typeof row.name_en !== "string") {
    errors.push(`Row ${rowIndex}: name_en is required`)
  }

  // Numeric validation
  if (row.fee_percent !== undefined && (isNaN(Number(row.fee_percent)) || Number(row.fee_percent) < 0)) {
    errors.push(`Row ${rowIndex}: fee_percent must be a positive number`)
  }
  if (row.fee_fixed !== undefined && (isNaN(Number(row.fee_fixed)) || Number(row.fee_fixed) < 0)) {
    errors.push(`Row ${rowIndex}: fee_fixed must be a positive number`)
  }

  return { valid: errors.length === 0, errors }
}

// Parse CSV string to array of objects
function parseCSV(csvString: string): Record<string, unknown>[] {
  const lines = csvString.split("\n").filter(line => line.trim())
  if (lines.length < 2) return []

  const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/"/g, ""))
  
  return lines.slice(1).map(line => {
    const values = line.split(",").map(v => v.trim().replace(/"/g, ""))
    const row: Record<string, unknown> = {}
    
    headers.forEach((header, index) => {
      const value = values[index]
      // Try to parse numbers
      if (!isNaN(Number(value)) && value !== "") {
        row[header] = Number(value)
      } else if (value === "true" || value === "false") {
        row[header] = value === "true"
      } else {
        row[header] = value || null
      }
    })
    
    return row
  })
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

    const contentType = request.headers.get("content-type")
    let data: Record<string, unknown>[]

    if (contentType?.includes("multipart/form-data")) {
      // Handle file upload
      const formData = await request.formData()
      const file = formData.get("file") as File | null
      
      if (!file) {
        return NextResponse.json({ error: "الملف مطلوب" }, { status: 400 })
      }

      const text = await file.text()
      
      if (file.name.endsWith(".csv")) {
        data = parseCSV(text)
      } else if (file.name.endsWith(".json")) {
        data = JSON.parse(text)
        if (!Array.isArray(data)) {
          data = [data]
        }
      } else {
        return NextResponse.json({ error: "صيغة الملف غير مدعومة (CSV أو JSON فقط)" }, { status: 400 })
      }
    } else {
      // Handle JSON body
      const body = await request.json()
      data = Array.isArray(body.data) ? body.data : [body.data]
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "لا توجد بيانات للاستيراد" }, { status: 400 })
    }

    const result: ImportResult = {
      success: true,
      imported: 0,
      skipped: 0,
      errors: [],
    }

    // Validate all rows first
    for (let i = 0; i < data.length; i++) {
      const validation = validateRow(data[i], i + 1)
      if (!validation.valid) {
        result.errors.push(...validation.errors.map(e => ({ row: i + 1, error: e })))
      }
    }

    // If validation errors, return without importing
    if (result.errors.length > 0) {
      result.success = false
      return NextResponse.json({ result })
    }

    // Process each row
    for (let i = 0; i < data.length; i++) {
      const row = data[i] as unknown as ProviderImportRow
      
      try {
        // Check if provider exists
        const { data: existingProvider } = await supabase
          .from("providers")
          .select("id")
          .eq("slug", row.provider_slug)
          .single()

        let providerId: string

        if (existingProvider) {
          // Update existing provider
          const { error: updateError } = await supabase
            .from("providers")
            .update({
              name_ar: row.name_ar,
              name_en: row.name_en,
              website_url: row.website_url || null,
              setup_fee: row.setup_fee || 0,
              monthly_fee: row.monthly_fee || 0,
              activation_time_days_min: row.activation_min || 1,
              activation_time_days_max: row.activation_max || 7,
              settlement_days_min: row.settlement_min || 1,
              settlement_days_max: row.settlement_max || 7,
              pricing_url: row.official_pricing_url || null,
              docs_url: row.docs_url || null,
              terms_url: row.terms_url || null,
              last_verified_at: row.last_verified_at || new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingProvider.id)

          if (updateError) throw updateError
          providerId = existingProvider.id
        } else {
          // Create new provider
          const { data: newProvider, error: insertError } = await supabase
            .from("providers")
            .insert({
              slug: row.provider_slug,
              name_ar: row.name_ar,
              name_en: row.name_en,
              website_url: row.website_url || null,
              setup_fee: row.setup_fee || 0,
              monthly_fee: row.monthly_fee || 0,
              activation_time_days_min: row.activation_min || 1,
              activation_time_days_max: row.activation_max || 7,
              settlement_days_min: row.settlement_min || 1,
              settlement_days_max: row.settlement_max || 7,
              pricing_url: row.official_pricing_url || null,
              docs_url: row.docs_url || null,
              terms_url: row.terms_url || null,
              support_channels: ["email"],
              is_active: true,
              last_verified_at: row.last_verified_at || new Date().toISOString(),
            })
            .select()
            .single()

          if (insertError) throw insertError
          providerId = newProvider.id
        }

        // Handle fee if payment_method_code is provided
        if (row.payment_method_code && (row.fee_percent !== undefined || row.fee_fixed !== undefined)) {
          // Get payment method ID
          const { data: paymentMethod } = await supabase
            .from("payment_methods")
            .select("id")
            .eq("code", row.payment_method_code)
            .single()

          if (paymentMethod) {
            // Check if fee exists
            const { data: existingFee } = await supabase
              .from("provider_fees")
              .select("id")
              .eq("provider_id", providerId)
              .eq("payment_method_id", paymentMethod.id)
              .single()

            const feeData = {
              provider_id: providerId,
              payment_method_id: paymentMethod.id,
              fee_percent: row.fee_percent || 0,
              fee_fixed: row.fee_fixed || 0,
              source_url: row.official_pricing_url || null,
              last_verified_at: row.last_verified_at || new Date().toISOString(),
              is_active: true,
            }

            if (existingFee) {
              await supabase
                .from("provider_fees")
                .update(feeData)
                .eq("id", existingFee.id)
            } else {
              await supabase
                .from("provider_fees")
                .insert(feeData)
            }
          }
        }

        // Handle currencies
        if (row.currencies) {
          const currencies = row.currencies.split("|").map(c => c.trim())
          for (const currency of currencies) {
            await supabase
              .from("provider_currencies")
              .upsert({
                provider_id: providerId,
                currency_code: currency,
                is_settlement_supported: true,
                is_pricing_supported: true,
              }, {
                onConflict: "provider_id,currency_code"
              })
          }
        }

        // Handle integrations
        if (row.integrations) {
          const platforms = row.integrations.split("|").map(p => p.trim().toLowerCase())
          for (const platform of platforms) {
            const validPlatforms = [
              "shopify", "woocommerce", "magento", "opencart", "prestashop",
              "salla", "zid", "expandcart", "youcan", "wordpress"
            ]
            if (validPlatforms.includes(platform)) {
              await supabase
                .from("provider_integrations")
                .upsert({
                  provider_id: providerId,
                  platform,
                  integration_type: "plugin",
                  is_official: true,
                  is_active: true,
                }, {
                  onConflict: "provider_id,platform"
                })
            }
          }
        }

        // Handle review
        if (row.rating_avg && row.rating_source && row.rating_url) {
          await supabase
            .from("provider_reviews")
            .upsert({
              provider_id: providerId,
              platform: row.rating_source.toLowerCase(),
              rating_avg: row.rating_avg,
              rating_count: row.rating_count || 0,
              source_url: row.rating_url,
              last_verified_at: row.last_verified_at || new Date().toISOString(),
            }, {
              onConflict: "provider_id,platform"
            })
        }

        result.imported++
      } catch (error) {
        console.error(`Error importing row ${i + 1}:`, error)
        result.errors.push({
          row: i + 1,
          error: error instanceof Error ? error.message : "خطأ غير معروف",
        })
        result.skipped++
      }
    }

    // Log import action
    await supabase.from("audit_log").insert({
      table_name: "providers",
      record_id: "00000000-0000-0000-0000-000000000000",
      action: "INSERT",
      new_values: { action: "bulk_import", count: result.imported },
      user_id: user.id,
      user_email: user.email,
    })

    result.success = result.errors.length === 0

    return NextResponse.json({ result })
  } catch (error) {
    console.error("Error in import:", error)
    return NextResponse.json(
      { error: "فشل في استيراد البيانات" },
      { status: 500 }
    )
  }
}

// GET: Download template
export async function GET() {
  const template = `provider_slug,name_ar,name_en,website_url,setup_fee,monthly_fee,payment_method_code,fee_percent,fee_fixed,activation_min,activation_max,settlement_min,settlement_max,currencies,integrations,rating_avg,rating_count,rating_source,rating_url,official_pricing_url,docs_url,terms_url,last_verified_at
example-provider,مثال,Example Provider,https://example.com,0,0,mada,1.5,1,1,3,1,2,SAR|AED,shopify|woocommerce,4.5,100,trustpilot,https://trustpilot.com/review/example,https://example.com/pricing,https://example.com/docs,https://example.com/terms,2024-12-01`

  return new NextResponse(template, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=provider_import_template.csv",
    },
  })
}

