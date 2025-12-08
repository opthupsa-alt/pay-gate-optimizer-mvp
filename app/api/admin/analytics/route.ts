import { type NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import prisma from "@/lib/db"

// Only admins and analysts can access analytics
async function hasAnalyticsAccess(request: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) {
    console.error("NEXTAUTH_SECRET is not configured - denying access")
    return false
  }
  
  const token = await getToken({ req: request, secret })
  if (!token) return false
  
  return token.role === "admin" || token.role === "analyst"
}

// Check if database is configured
function isDatabaseConfigured() {
  const dbUrl = process.env.DATABASE_URL
  return dbUrl && !dbUrl.includes("localhost:3306/your_database")
}

// Mock analytics data for demo mode
const mockAnalytics = {
  overview: {
    totalComparisons: 12345,
    totalLeads: 847,
    conversionRate: 6.8,
    avgGmv: 125000,
    comparisonsGrowth: 15,
    leadsGrowth: 8,
  },
  monthlyData: [
    { month: "يناير", comparisons: 234, leads: 12 },
    { month: "فبراير", comparisons: 289, leads: 18 },
    { month: "مارس", comparisons: 356, leads: 24 },
    { month: "أبريل", comparisons: 412, leads: 31 },
    { month: "مايو", comparisons: 378, leads: 27 },
    { month: "يونيو", comparisons: 445, leads: 35 },
  ],
  sectorData: [
    { sector: "التجارة الإلكترونية", percentage: 35, count: 432 },
    { sector: "المطاعم", percentage: 22, count: 271 },
    { sector: "الخدمات الطبية", percentage: 15, count: 185 },
    { sector: "تجارة التجزئة", percentage: 12, count: 148 },
    { sector: "التعليم", percentage: 8, count: 99 },
    { sector: "أخرى", percentage: 8, count: 99 },
  ],
  providerData: [
    { name: "ميسر", recommendations: 456, percentage: 37 },
    { name: "تاب", recommendations: 312, percentage: 25 },
    { name: "هايبر باي", recommendations: 234, percentage: 19 },
    { name: "باي فورت", recommendations: 148, percentage: 12 },
    { name: "تابي", recommendations: 87, percentage: 7 },
  ],
  gmvRanges: [
    { range: "أقل من 50,000", percentage: 25, count: 308 },
    { range: "50,000 - 100,000", percentage: 35, count: 432 },
    { range: "100,000 - 500,000", percentage: 28, count: 345 },
    { range: "أكثر من 500,000", percentage: 12, count: 148 },
  ],
}

export async function GET(request: NextRequest) {
  try {
    if (!(await hasAnalyticsAccess(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Return mock data if database not configured
    if (!isDatabaseConfigured()) {
      return NextResponse.json({
        ...mockAnalytics,
        message: "Demo mode - using mock data"
      })
    }

    // Get date ranges
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // Fetch total comparisons (wizard runs)
    const totalComparisons = await prisma.wizardRun.count()
    const thisMonthComparisons = await prisma.wizardRun.count({
      where: { createdAt: { gte: startOfMonth } }
    })
    const lastMonthComparisons = await prisma.wizardRun.count({
      where: { 
        createdAt: { 
          gte: startOfLastMonth,
          lte: endOfLastMonth
        } 
      }
    })

    // Fetch total leads
    const totalLeads = await prisma.lead.count()
    const thisMonthLeads = await prisma.lead.count({
      where: { createdAt: { gte: startOfMonth } }
    })
    const lastMonthLeads = await prisma.lead.count({
      where: { 
        createdAt: { 
          gte: startOfLastMonth,
          lte: endOfLastMonth
        } 
      }
    })

    // Calculate conversion rate
    const conversionRate = totalComparisons > 0 
      ? (totalLeads / totalComparisons * 100) 
      : 0

    // Calculate growth percentages
    const comparisonsGrowth = lastMonthComparisons > 0
      ? ((thisMonthComparisons - lastMonthComparisons) / lastMonthComparisons * 100)
      : 0
    const leadsGrowth = lastMonthLeads > 0
      ? ((thisMonthLeads - lastMonthLeads) / lastMonthLeads * 100)
      : 0

    // Fetch average GMV
    const gmvResult = await prisma.wizardRun.aggregate({
      _avg: { monthlyGmv: true }
    })
    const avgGmv = gmvResult._avg.monthlyGmv 
      ? Number(gmvResult._avg.monthlyGmv)
      : 0

    // Fetch monthly data (last 6 months)
    const monthlyData = []
    const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", 
                       "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"]
    
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
      
      const comparisons = await prisma.wizardRun.count({
        where: { createdAt: { gte: monthStart, lte: monthEnd } }
      })
      const leads = await prisma.lead.count({
        where: { createdAt: { gte: monthStart, lte: monthEnd } }
      })
      
      monthlyData.push({
        month: monthNames[monthStart.getMonth()],
        comparisons,
        leads,
      })
    }

    // Fetch sector distribution
    const sectorCounts = await prisma.wizardRun.groupBy({
      by: ["sectorId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 6,
    })

    const sectorData = await Promise.all(
      sectorCounts.map(async (s) => {
        if (!s.sectorId) {
          return { sector: "غير محدد", percentage: 0, count: s._count.id }
        }
        const sector = await prisma.sector.findUnique({
          where: { id: s.sectorId },
          select: { nameAr: true }
        })
        const percentage = totalComparisons > 0 
          ? Math.round(s._count.id / totalComparisons * 100)
          : 0
        return {
          sector: sector?.nameAr || "غير محدد",
          percentage,
          count: s._count.id,
        }
      })
    )

    // Fetch top recommended providers
    const providerCounts = await prisma.recommendation.groupBy({
      by: ["providerId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    })

    const totalRecommendations = providerCounts.reduce((sum, p) => sum + p._count.id, 0)
    
    const providerData = await Promise.all(
      providerCounts.map(async (p) => {
        const provider = await prisma.provider.findUnique({
          where: { id: p.providerId },
          select: { nameAr: true }
        })
        const percentage = totalRecommendations > 0 
          ? Math.round(p._count.id / totalRecommendations * 100)
          : 0
        return {
          name: provider?.nameAr || "غير محدد",
          recommendations: p._count.id,
          percentage,
        }
      })
    )

    // Fetch GMV ranges distribution
    const gmvRangesData = [
      { range: "أقل من 50,000", min: 0, max: 50000, percentage: 0, count: 0 },
      { range: "50,000 - 100,000", min: 50000, max: 100000, percentage: 0, count: 0 },
      { range: "100,000 - 500,000", min: 100000, max: 500000, percentage: 0, count: 0 },
      { range: "أكثر من 500,000", min: 500000, max: null, percentage: 0, count: 0 },
    ]

    for (const range of gmvRangesData) {
      const count = await prisma.wizardRun.count({
        where: {
          monthlyGmv: {
            gte: range.min,
            ...(range.max !== null && { lt: range.max }),
          },
        },
      })
      range.count = count
      range.percentage = totalComparisons > 0 
        ? Math.round(count / totalComparisons * 100)
        : 0
    }

    return NextResponse.json({
      overview: {
        totalComparisons,
        totalLeads,
        conversionRate: Math.round(conversionRate * 10) / 10,
        avgGmv: Math.round(avgGmv),
        comparisonsGrowth: Math.round(comparisonsGrowth * 10) / 10,
        leadsGrowth: Math.round(leadsGrowth * 10) / 10,
      },
      monthlyData,
      sectorData,
      providerData,
      gmvRanges: gmvRangesData.map(r => ({
        range: r.range,
        percentage: r.percentage,
        count: r.count,
      })),
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}

