import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import type { ProviderImportRow, ImportResult } from "@/lib/types"
import { IntegrationPlatform, ReviewPlatform } from "@prisma/client"

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
    // Check admin role
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    if (user.role !== "admin") {
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
        const existingProvider = await prisma.provider.findUnique({
          where: { slug: row.provider_slug },
        })

        let providerId: string

        if (existingProvider) {
          // Update existing provider
          await prisma.provider.update({
            where: { id: existingProvider.id },
            data: {
              nameAr: row.name_ar,
              nameEn: row.name_en,
              websiteUrl: row.website_url || null,
              setupFee: row.setup_fee || 0,
              monthlyFee: row.monthly_fee || 0,
              activationTimeDaysMin: row.activation_min || 1,
              activationTimeDaysMax: row.activation_max || 7,
              settlementDaysMin: row.settlement_min || 1,
              settlementDaysMax: row.settlement_max || 7,
              pricingUrl: row.official_pricing_url || null,
              docsUrl: row.docs_url || null,
              termsUrl: row.terms_url || null,
              lastVerifiedAt: row.last_verified_at ? new Date(row.last_verified_at) : new Date(),
            },
          })
          providerId = existingProvider.id
        } else {
          // Create new provider
          const newProvider = await prisma.provider.create({
            data: {
              slug: row.provider_slug,
              nameAr: row.name_ar,
              nameEn: row.name_en,
              websiteUrl: row.website_url || null,
              setupFee: row.setup_fee || 0,
              monthlyFee: row.monthly_fee || 0,
              activationTimeDaysMin: row.activation_min || 1,
              activationTimeDaysMax: row.activation_max || 7,
              settlementDaysMin: row.settlement_min || 1,
              settlementDaysMax: row.settlement_max || 7,
              pricingUrl: row.official_pricing_url || null,
              docsUrl: row.docs_url || null,
              termsUrl: row.terms_url || null,
              supportChannels: ["email"],
              isActive: true,
              lastVerifiedAt: row.last_verified_at ? new Date(row.last_verified_at) : new Date(),
            },
          })
          providerId = newProvider.id
        }

        // Handle fee if payment_method_code is provided
        if (row.payment_method_code && (row.fee_percent !== undefined || row.fee_fixed !== undefined)) {
          // Get payment method ID
          const paymentMethod = await prisma.paymentMethod.findUnique({
            where: { code: row.payment_method_code },
          })

          if (paymentMethod) {
            // Check if fee exists
            const existingFee = await prisma.providerFee.findFirst({
              where: {
                providerId,
                paymentMethodId: paymentMethod.id,
              },
            })

            const feeData = {
              providerId,
              paymentMethodId: paymentMethod.id,
              feePercent: row.fee_percent || 0,
              feeFixed: row.fee_fixed || 0,
              sourceUrl: row.official_pricing_url || null,
              lastVerifiedAt: row.last_verified_at ? new Date(row.last_verified_at) : new Date(),
              isActive: true,
            }

            if (existingFee) {
              await prisma.providerFee.update({
                where: { id: existingFee.id },
                data: feeData,
              })
            } else {
              await prisma.providerFee.create({
                data: feeData,
              })
            }
          }
        }

        // Handle currencies
        if (row.currencies) {
          const currencies = row.currencies.split("|").map(c => c.trim())
          for (const currency of currencies) {
            await prisma.providerCurrency.upsert({
              where: {
                providerId_currencyCode: {
                  providerId,
                  currencyCode: currency,
                },
              },
              update: {
                isSettlementSupported: true,
                isPricingSupported: true,
              },
              create: {
                providerId,
                currencyCode: currency,
                isSettlementSupported: true,
                isPricingSupported: true,
              },
            })
          }
        }

        // Handle integrations
        if (row.integrations) {
          const platforms = row.integrations.split("|").map(p => p.trim().toLowerCase())
          const validPlatforms: IntegrationPlatform[] = [
            "shopify", "woocommerce", "magento", "opencart", "prestashop",
            "salla", "zid", "expandcart", "youcan", "wordpress"
          ]
          
          for (const platform of platforms) {
            if (validPlatforms.includes(platform as IntegrationPlatform)) {
              await prisma.providerIntegration.upsert({
                where: {
                  providerId_platform: {
                    providerId,
                    platform: platform as IntegrationPlatform,
                  },
                },
                update: {
                  isActive: true,
                },
                create: {
                  providerId,
                  platform: platform as IntegrationPlatform,
                  integrationType: "plugin",
                  isOfficial: true,
                  isActive: true,
                },
              })
            }
          }
        }

        // Handle review
        if (row.rating_avg && row.rating_source && row.rating_url) {
          const reviewPlatform = row.rating_source.toLowerCase() as ReviewPlatform
          const validReviewPlatforms: ReviewPlatform[] = [
            "trustpilot", "g2", "capterra", "google_play", "app_store", "twitter", "reddit", "internal", "other"
          ]
          
          const platform = validReviewPlatforms.includes(reviewPlatform) ? reviewPlatform : "other"
          
          await prisma.providerReview.upsert({
            where: {
              providerId_platform: {
                providerId,
                platform,
              },
            },
            update: {
              ratingAvg: row.rating_avg,
              ratingCount: row.rating_count || 0,
              sourceUrl: row.rating_url,
              lastVerifiedAt: row.last_verified_at ? new Date(row.last_verified_at) : new Date(),
            },
            create: {
              providerId,
              platform,
              ratingAvg: row.rating_avg,
              ratingCount: row.rating_count || 0,
              sourceUrl: row.rating_url,
              lastVerifiedAt: row.last_verified_at ? new Date(row.last_verified_at) : new Date(),
            },
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
    await prisma.auditLog.create({
      data: {
        tableName: "providers",
        recordId: "bulk_import",
        action: "INSERT",
        newValues: { action: "bulk_import", count: result.imported },
        userId: user.id,
      },
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

