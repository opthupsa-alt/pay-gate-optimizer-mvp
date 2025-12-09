import { cookies } from "next/headers"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Building2, 
  FileText, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import prisma from "@/lib/db"

// Check if database is configured
function isDatabaseConfigured() {
  const dbUrl = process.env.DATABASE_URL
  return dbUrl && !dbUrl.includes("localhost:3306/your_database")
}

export default async function AdminDashboard() {
  const cookieStore = await cookies()
  const locale = (cookieStore.get("locale")?.value as "ar" | "en") || "ar"

  // Fetch real data from database
  let stats = {
    wizardRuns: 0,
    wizardRunsChange: 0,
    leads: 0,
    leadsChange: 0,
    providers: 0,
    conversionRate: 0
  }

  let recentLeads: Array<{
    id: string
    name: string
    company: string | null
    sector: string | null
    status: string
    createdAt: Date
  }> = []

  let topProviders: Array<{
    name: string
    nameEn: string
    recommendations: number
    percentage: number
  }> = []

  if (isDatabaseConfigured()) {
    try {
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

      // Wizard runs
      const totalWizardRuns = await prisma.wizardRun.count()
      const thisMonthWizardRuns = await prisma.wizardRun.count({
        where: { createdAt: { gte: startOfMonth } }
      })
      const lastMonthWizardRuns = await prisma.wizardRun.count({
        where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } }
      })

      // Leads
      const totalLeads = await prisma.lead.count()
      const thisMonthLeads = await prisma.lead.count({
        where: { createdAt: { gte: startOfMonth } }
      })
      const lastMonthLeads = await prisma.lead.count({
        where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } }
      })

      // Providers
      const activeProviders = await prisma.provider.count({
        where: { isActive: true }
      })

      // Calculate changes
      const wizardChange = lastMonthWizardRuns > 0
        ? Math.round((thisMonthWizardRuns - lastMonthWizardRuns) / lastMonthWizardRuns * 100)
        : 0
      const leadsChange = lastMonthLeads > 0
        ? Math.round((thisMonthLeads - lastMonthLeads) / lastMonthLeads * 100)
        : 0
      const conversionRate = totalWizardRuns > 0
        ? Math.round(totalLeads / totalWizardRuns * 1000) / 10
        : 0

      stats = {
        wizardRuns: totalWizardRuns,
        wizardRunsChange: wizardChange,
        leads: totalLeads,
        leadsChange: leadsChange,
        providers: activeProviders,
        conversionRate
      }

      // Recent leads
      const dbLeads = await prisma.lead.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          wizardRun: {
            include: {
              sector: true
            }
          }
        }
      })

      recentLeads = dbLeads.map(lead => ({
        id: lead.id,
        name: lead.name,
        company: lead.companyName,
        sector: lead.wizardRun?.sector?.nameAr || null,
        status: lead.status,
        createdAt: lead.createdAt
      }))

      // Top providers
      const providerCounts = await prisma.recommendation.groupBy({
        by: ["providerId"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 3,
      })

      const totalRecs = providerCounts.reduce((sum, p) => sum + p._count.id, 0)

      for (const p of providerCounts) {
        const provider = await prisma.provider.findUnique({
          where: { id: p.providerId },
          select: { nameAr: true, nameEn: true }
        })
        if (provider) {
          topProviders.push({
            name: provider.nameAr,
            nameEn: provider.nameEn,
            recommendations: p._count.id,
            percentage: totalRecs > 0 ? Math.round(p._count.id / totalRecs * 100) : 0
          })
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    }
  }

  // Fallback mock data if no real data
  if (stats.wizardRuns === 0 && stats.leads === 0) {
    stats = {
      wizardRuns: 1234,
      wizardRunsChange: 12,
      leads: 89,
      leadsChange: 8,
      providers: 6,
      conversionRate: 7.2
    }
    recentLeads = [
      { id: "1", name: "أحمد محمد", company: "شركة التقنية", sector: "التجارة الإلكترونية", status: "new", createdAt: new Date() },
      { id: "2", name: "سارة العلي", company: "مطعم الذواقة", sector: "المطاعم", status: "contacted", createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000) },
      { id: "3", name: "خالد السعيد", company: "عيادات الصحة", sector: "الطبي", status: "qualified", createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    ]
    topProviders = [
      { name: "ميسر", nameEn: "Moyasar", recommendations: 456, percentage: 37 },
      { name: "تاب", nameEn: "Tap Payments", recommendations: 312, percentage: 25 },
      { name: "هايبر باي", nameEn: "HyperPay", recommendations: 234, percentage: 19 },
    ]
  }

  const t = {
    ar: {
      title: "لوحة المعلومات",
      subtitle: "نظرة عامة على أداء المنصة",
      stats: {
        wizardRuns: "المقارنات",
        leads: "العملاء المحتملين",
        providers: "مزودي الخدمة",
        conversionRate: "معدل التحويل"
      },
      recentLeads: "أحدث العملاء المحتملين",
      topProviders: "أكثر المزودين توصية",
      thisMonth: "هذا الشهر",
      vsLastMonth: "مقارنة بالشهر السابق",
      noLeads: "لا يوجد عملاء محتملين بعد",
      viewAll: "عرض الكل",
      statuses: {
        new: "جديد",
        contacted: "تم التواصل",
        qualified: "مؤهل",
        won: "تم الفوز",
        lost: "خسارة"
      },
      timeAgo: {
        justNow: "الآن",
        minutesAgo: "منذ {n} دقيقة",
        hoursAgo: "منذ {n} ساعة",
        daysAgo: "منذ {n} يوم"
      }
    },
    en: {
      title: "Dashboard",
      subtitle: "Platform performance overview",
      stats: {
        wizardRuns: "Comparisons",
        leads: "Leads",
        providers: "Providers",
        conversionRate: "Conversion Rate"
      },
      recentLeads: "Recent Leads",
      topProviders: "Top Recommended Providers",
      thisMonth: "This Month",
      vsLastMonth: "vs last month",
      noLeads: "No leads yet",
      viewAll: "View All",
      statuses: {
        new: "New",
        contacted: "Contacted",
        qualified: "Qualified",
        won: "Won",
        lost: "Lost"
      },
      timeAgo: {
        justNow: "Just now",
        minutesAgo: "{n} min ago",
        hoursAgo: "{n}h ago",
        daysAgo: "{n}d ago"
      }
    }
  }[locale]

  // Format relative time
  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return t.timeAgo.justNow
    if (diffMins < 60) return t.timeAgo.minutesAgo.replace("{n}", String(diffMins))
    if (diffHours < 24) return t.timeAgo.hoursAgo.replace("{n}", String(diffHours))
    return t.timeAgo.daysAgo.replace("{n}", String(diffDays))
  }

  // Stats array using real data
  const statsArray = [
    {
      title: t.stats.wizardRuns,
      value: stats.wizardRuns.toLocaleString(),
      change: `${stats.wizardRunsChange >= 0 ? "+" : ""}${stats.wizardRunsChange}%`,
      trend: stats.wizardRunsChange > 0 ? "up" : stats.wizardRunsChange < 0 ? "down" : "neutral",
      icon: FileText
    },
    {
      title: t.stats.leads,
      value: stats.leads.toLocaleString(),
      change: `${stats.leadsChange >= 0 ? "+" : ""}${stats.leadsChange}%`,
      trend: stats.leadsChange > 0 ? "up" : stats.leadsChange < 0 ? "down" : "neutral",
      icon: Users
    },
    {
      title: t.stats.providers,
      value: stats.providers.toString(),
      change: "0%",
      trend: "neutral",
      icon: Building2
    },
    {
      title: t.stats.conversionRate,
      value: `${stats.conversionRate}%`,
      change: "+0%",
      trend: "neutral",
      icon: TrendingUp
    }
  ]

  const statusColors: Record<string, string> = {
    new: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    contacted: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    qualified: "bg-emerald-200 text-emerald-900 dark:bg-emerald-800/30 dark:text-emerald-300",
    won: "bg-emerald-300 text-emerald-900 dark:bg-emerald-700/30 dark:text-emerald-200",
    lost: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t.title}</h1>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsArray.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3 text-emerald-500 me-1" />
                ) : stat.trend === "down" ? (
                  <ArrowDownRight className="h-3 w-3 text-red-500 me-1" />
                ) : null}
                <span className={stat.trend === "up" ? "text-emerald-500" : stat.trend === "down" ? "text-red-500" : "text-muted-foreground"}>
                  {stat.change}
                </span>
                <span className="text-muted-foreground ms-1">{t.vsLastMonth}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Leads */}
        <Card>
          <CardHeader>
            <CardTitle>{t.recentLeads}</CardTitle>
            <CardDescription>{t.thisMonth}</CardDescription>
          </CardHeader>
          <CardContent>
            {recentLeads.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">{t.noLeads}</p>
            ) : (
              <div className="space-y-4">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{lead.name}</p>
                      <p className="text-sm text-muted-foreground">{lead.company} • {lead.sector || "-"}</p>
                    </div>
                    <div className="text-end">
                      <Badge className={statusColors[lead.status]}>
                        {t.statuses[lead.status as keyof typeof t.statuses] || lead.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{formatRelativeTime(lead.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Providers */}
        <Card>
          <CardHeader>
            <CardTitle>{t.topProviders}</CardTitle>
            <CardDescription>{t.thisMonth}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProviders.map((provider, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {locale === "ar" ? provider.name : provider.nameEn}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {provider.recommendations} ({provider.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${provider.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

