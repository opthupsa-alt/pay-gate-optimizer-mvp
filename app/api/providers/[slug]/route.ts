import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

export const dynamic = "force-dynamic"

interface RouteParams {
  params: Promise<{ slug: string }>
}

// Helper to convert camelCase to snake_case
function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
}

// Parse JSON string fields to arrays
function parseJsonFields(obj: Record<string, unknown>): Record<string, unknown> {
  const jsonFields = [
    'prosAr', 'prosEn', 'consAr', 'consEn', 'supportChannels',
    'highlightsPositive', 'highlightsNegative', 'pros_ar', 'pros_en', 
    'cons_ar', 'cons_en', 'support_channels', 'highlights_positive', 'highlights_negative'
  ]
  
  for (const field of jsonFields) {
    if (obj[field] && typeof obj[field] === 'string') {
      try {
        obj[field] = JSON.parse(obj[field] as string)
      } catch {
        // Keep as is if not valid JSON
      }
    }
  }
  return obj
}

// Transform object keys to snake_case
function transformKeys(obj: Record<string, unknown>): Record<string, unknown> {
  if (obj === null || typeof obj !== "object") return obj
  if (Array.isArray(obj)) return obj.map(item => 
    typeof item === "object" && item !== null ? transformKeys(item as Record<string, unknown>) : item
  ) as unknown as Record<string, unknown>
  
  // First parse JSON fields
  obj = parseJsonFields(obj)
  
  const result: Record<string, unknown> = {}
  for (const key in obj) {
    const snakeKey = toSnakeCase(key)
    const value = obj[key]
    result[snakeKey] = typeof value === "object" && value !== null 
      ? transformKeys(value as Record<string, unknown>) 
      : value
  }
  return result
}

export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const { slug } = await context.params

    const provider = await prisma.provider.findUnique({
      where: { slug },
      include: {
        providerFees: {
          include: {
            paymentMethod: true,
          },
        },
        providerIntegrations: true,
        providerReviews: true,
        providerWallets: true,
        providerBnpl: true,
        providerCurrencies: true,
        providerPaymentMethods: {
          include: {
            paymentMethod: true,
          },
        },
        providerCapabilities: {
          include: {
            capability: true,
          },
        },
        providerSectorRules: {
          include: {
            sector: true,
          },
        },
        opsMetrics: true,
        providerSources: true,
      },
    })

    if (!provider) {
      return NextResponse.json(
        { error: "المزود غير موجود" },
        { status: 404 }
      )
    }

    // Transform to snake_case for frontend consistency
    const transformedProvider = transformKeys(provider as unknown as Record<string, unknown>)

    return NextResponse.json({
      provider: transformedProvider,
      sources: (provider.providerSources || []).map(s => transformKeys(s as unknown as Record<string, unknown>)),
    })
  } catch (error) {
    console.error("Error fetching provider:", error)
    return NextResponse.json(
      { error: "فشل في جلب بيانات المزود" },
      { status: 500 }
    )
  }
}
