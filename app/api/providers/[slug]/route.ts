import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

export const dynamic = "force-dynamic"

interface RouteParams {
  params: Promise<{ slug: string }>
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

    return NextResponse.json({
      provider,
      sources: provider.providerSources || [],
    })
  } catch (error) {
    console.error("Error fetching provider:", error)
    return NextResponse.json(
      { error: "فشل في جلب بيانات المزود" },
      { status: 500 }
    )
  }
}
