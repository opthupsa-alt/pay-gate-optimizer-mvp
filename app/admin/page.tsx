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

export default async function AdminDashboard() {
  const cookieStore = await cookies()
  const locale = (cookieStore.get("locale")?.value as "ar" | "en") || "ar"

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
      viewAll: "عرض الكل"
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
      viewAll: "View All"
    }
  }[locale]

  // Mock data for demonstration
  const stats = [
    {
      title: t.stats.wizardRuns,
      value: "1,234",
      change: "+12%",
      trend: "up",
      icon: FileText
    },
    {
      title: t.stats.leads,
      value: "89",
      change: "+8%",
      trend: "up",
      icon: Users
    },
    {
      title: t.stats.providers,
      value: "6",
      change: "0%",
      trend: "neutral",
      icon: Building2
    },
    {
      title: t.stats.conversionRate,
      value: "7.2%",
      change: "+2.1%",
      trend: "up",
      icon: TrendingUp
    }
  ]

  const recentLeads = [
    { id: 1, name: "أحمد محمد", company: "شركة التقنية", sector: "التجارة الإلكترونية", status: "new", date: "منذ ساعتين" },
    { id: 2, name: "سارة العلي", company: "مطعم الذواقة", sector: "المطاعم", status: "contacted", date: "منذ 5 ساعات" },
    { id: 3, name: "خالد السعيد", company: "عيادات الصحة", sector: "الطبي", status: "qualified", date: "أمس" },
  ]

  const topProviders = [
    { name: "ميسر", nameEn: "Moyasar", recommendations: 456, percentage: 37 },
    { name: "تاب", nameEn: "Tap Payments", recommendations: 312, percentage: 25 },
    { name: "هايبر باي", nameEn: "HyperPay", recommendations: 234, percentage: 19 },
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
        {stats.map((stat, index) => (
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
            <div className="space-y-4">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">{lead.company} • {lead.sector}</p>
                  </div>
                  <div className="text-end">
                    <Badge className={statusColors[lead.status]}>
                      {lead.status === "new" ? "جديد" : lead.status === "contacted" ? "تم التواصل" : "مؤهل"}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{lead.date}</p>
                  </div>
                </div>
              ))}
            </div>
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

