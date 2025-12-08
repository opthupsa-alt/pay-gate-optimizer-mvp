"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText,
  RefreshCw,
  DollarSign
} from "lucide-react"
import { toast } from "sonner"

interface AnalyticsData {
  overview: {
    totalComparisons: number
    totalLeads: number
    conversionRate: number
    avgGmv: number
    comparisonsGrowth: number
    leadsGrowth: number
  }
  monthlyData: Array<{ month: string; comparisons: number; leads: number }>
  sectorData: Array<{ sector: string; percentage: number; count: number }>
  providerData: Array<{ name: string; recommendations: number; percentage: number }>
  gmvRanges: Array<{ range: string; percentage: number; count: number }>
}

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<AnalyticsData | null>(null)

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/analytics")
      if (!response.ok) {
        throw new Error("Failed to fetch analytics")
      }
      const analyticsData = await response.json()
      setData(analyticsData)
    } catch (error) {
      console.error("Error fetching analytics:", error)
      toast.error("فشل في جلب البيانات")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  // Use data or defaults
  const overview = data?.overview ?? {
    totalComparisons: 0,
    totalLeads: 0,
    conversionRate: 0,
    avgGmv: 0,
    comparisonsGrowth: 0,
    leadsGrowth: 0,
  }
  const monthlyData = data?.monthlyData ?? []
  const sectorData = data?.sectorData ?? []
  const providerData = data?.providerData ?? []
  const gmvRanges = data?.gmvRanges ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">التحليلات</h1>
          <p className="text-muted-foreground">إحصائيات وتحليلات استخدام المنصة</p>
        </div>
        <Button variant="outline" onClick={fetchAnalytics} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 me-2 ${isLoading ? 'animate-spin' : ''}`} />
          تحديث
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              إجمالي المقارنات
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{overview.totalComparisons.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={overview.comparisonsGrowth >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {overview.comparisonsGrowth >= 0 ? '+' : ''}{overview.comparisonsGrowth}%
                  </span> من الشهر السابق
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              العملاء المحتملين
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{overview.totalLeads.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={overview.leadsGrowth >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {overview.leadsGrowth >= 0 ? '+' : ''}{overview.leadsGrowth}%
                  </span> من الشهر السابق
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              معدل التحويل
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{overview.conversionRate}%</div>
                <p className="text-xs text-muted-foreground">
                  نسبة تحويل الزوار لعملاء
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              متوسط GMV
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{overview.avgGmv.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">ريال سعودي</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="monthly" className="space-y-6">
        <TabsList>
          <TabsTrigger value="monthly">الأداء الشهري</TabsTrigger>
          <TabsTrigger value="sectors">القطاعات</TabsTrigger>
          <TabsTrigger value="providers">المزودين</TabsTrigger>
          <TabsTrigger value="gmv">حجم المبيعات</TabsTrigger>
        </TabsList>

        {/* Monthly Performance */}
        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>الأداء الشهري</CardTitle>
              <CardDescription>عدد المقارنات والعملاء المحتملين شهرياً</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.month}</span>
                      <span className="text-muted-foreground">
                        {item.comparisons} مقارنة • {item.leads} عميل
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(item.comparisons / 500) * 100}%` }}
                        />
                      </div>
                      <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${(item.leads / 40) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sectors */}
        <TabsContent value="sectors">
          <Card>
            <CardHeader>
              <CardTitle>توزيع القطاعات</CardTitle>
              <CardDescription>المقارنات حسب القطاع التجاري</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sectorData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.sector}</span>
                      <span className="text-muted-foreground">
                        {item.count} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Providers */}
        <TabsContent value="providers">
          <Card>
            <CardHeader>
              <CardTitle>التوصيات حسب المزود</CardTitle>
              <CardDescription>أكثر المزودين توصية في النتائج</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {providerData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-muted-foreground">
                        {item.recommendations} توصية ({item.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full transition-all"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* GMV Ranges */}
        <TabsContent value="gmv">
          <Card>
            <CardHeader>
              <CardTitle>توزيع حجم المبيعات</CardTitle>
              <CardDescription>المقارنات حسب حجم المبيعات الشهرية</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {gmvRanges.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.range} ريال</span>
                      <span className="text-muted-foreground">
                        {item.count} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

