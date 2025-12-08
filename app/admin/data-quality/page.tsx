"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { 
  RefreshCw, 
  AlertTriangle, 
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink,
  Loader2,
  FileWarning,
  DollarSign,
  Link2,
} from "lucide-react"
import type { DataQualityIssue } from "@/lib/types"

interface DataQualitySummary {
  total_issues: number
  high_severity: number
  medium_severity: number
  low_severity: number
  by_type: {
    no_pricing_url: number
    stale_data: number
    estimated_data: number
    missing_fees: number
    missing_integrations: number
  }
}

export default function DataQualityPage() {
  const [issues, setIssues] = useState<DataQualityIssue[]>([])
  const [summary, setSummary] = useState<DataQualitySummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchDataQuality()
  }, [])

  const fetchDataQuality = async () => {
    try {
      const response = await fetch("/api/admin/data-quality")
      const data = await response.json()
      setIssues(data.issues || [])
      setSummary(data.summary || null)
    } catch (error) {
      console.error("Error fetching data quality:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchDataQuality()
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "low":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />
      default:
        return null
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge variant="destructive">عالية</Badge>
      case "medium":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">متوسطة</Badge>
      case "low":
        return <Badge variant="outline">منخفضة</Badge>
      default:
        return null
    }
  }

  const getIssueTypeIcon = (type: string) => {
    switch (type) {
      case "no_pricing_url":
        return <DollarSign className="h-4 w-4" />
      case "stale_data":
        return <Clock className="h-4 w-4" />
      case "estimated_data":
        return <AlertTriangle className="h-4 w-4" />
      case "missing_fees":
        return <FileWarning className="h-4 w-4" />
      case "missing_integrations":
        return <Link2 className="h-4 w-4" />
      default:
        return null
    }
  }

  const getIssueTypeName = (type: string) => {
    switch (type) {
      case "no_pricing_url":
        return "بدون رابط أسعار"
      case "stale_data":
        return "بيانات قديمة"
      case "estimated_data":
        return "بيانات تقديرية"
      case "missing_fees":
        return "بدون رسوم"
      case "missing_integrations":
        return "بدون تكاملات"
      default:
        return type
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">جودة البيانات</h1>
          <p className="text-muted-foreground">
            مراجعة وإصلاح مشاكل البيانات في قاعدة البيانات
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing}>
          {refreshing ? (
            <Loader2 className="h-4 w-4 animate-spin me-2" />
          ) : (
            <RefreshCw className="h-4 w-4 me-2" />
          )}
          تحديث
        </Button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className={summary.high_severity > 0 ? "border-red-500" : ""}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-600">{summary.high_severity}</div>
                  <div className="text-sm text-muted-foreground">مشاكل عالية الخطورة</div>
                </div>
                <AlertCircle className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>

          <Card className={summary.medium_severity > 0 ? "border-yellow-500" : ""}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{summary.medium_severity}</div>
                  <div className="text-sm text-muted-foreground">مشاكل متوسطة</div>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-emerald-600">{summary.low_severity}</div>
                  <div className="text-sm text-muted-foreground">مشاكل منخفضة</div>
                </div>
                <CheckCircle className="h-8 w-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-emerald-600">
                    {summary.total_issues === 0 ? "100%" : `${Math.round((1 - summary.total_issues / 100) * 100)}%`}
                  </div>
                  <div className="text-sm text-muted-foreground">جودة البيانات</div>
                </div>
                <CheckCircle className="h-8 w-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Issues by Type */}
      {summary && (
        <Card>
          <CardHeader>
            <CardTitle>المشاكل حسب النوع</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(summary.by_type).map(([type, count]) => (
                <div key={type} className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="flex justify-center mb-2">
                    {getIssueTypeIcon(type)}
                  </div>
                  <div className="text-xl font-bold">{count}</div>
                  <div className="text-xs text-muted-foreground">{getIssueTypeName(type)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Issues State */}
      {issues.length === 0 && (
        <Alert className="bg-emerald-50 border-emerald-500 dark:bg-emerald-950/30">
          <CheckCircle className="h-4 w-4 text-emerald-500" />
          <AlertTitle className="text-emerald-700 dark:text-emerald-300">جودة البيانات ممتازة!</AlertTitle>
          <AlertDescription className="text-emerald-600 dark:text-emerald-400">
            لا توجد مشاكل في جودة البيانات حالياً. استمر في تحديث البيانات بانتظام.
          </AlertDescription>
        </Alert>
      )}

      {/* Issues Table */}
      {issues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>قائمة المشاكل</CardTitle>
            <CardDescription>
              {issues.length} مشكلة تحتاج للمراجعة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الخطورة</TableHead>
                  <TableHead>المزود</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>الوصف</TableHead>
                  <TableHead>آخر تحقق</TableHead>
                  <TableHead>إجراء</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {issues.map((issue, index) => (
                  <TableRow key={`${issue.provider_id}-${issue.issue_type}-${index}`}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getSeverityIcon(issue.severity)}
                        {getSeverityBadge(issue.severity)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {issue.provider_name}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getIssueTypeIcon(issue.issue_type)}
                        <span className="text-sm">{getIssueTypeName(issue.issue_type)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                      {issue.description}
                    </TableCell>
                    <TableCell className="text-sm">
                      {issue.last_verified_at 
                        ? new Date(issue.last_verified_at).toLocaleDateString("ar-SA")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Link href={`/admin/providers?id=${issue.provider_id}`}>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-3 w-3 me-1" />
                          تعديل
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>توصيات لتحسين جودة البيانات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertTitle>تحديث دوري</AlertTitle>
              <AlertDescription>
                قم بمراجعة بيانات المزودين كل 30-60 يوم للتأكد من دقة الأسعار والمعلومات
              </AlertDescription>
            </Alert>
            <Alert>
              <DollarSign className="h-4 w-4" />
              <AlertTitle>روابط الأسعار</AlertTitle>
              <AlertDescription>
                تأكد من إضافة رابط صفحة الأسعار الرسمية لكل مزود لتسهيل التحقق
              </AlertDescription>
            </Alert>
            <Alert>
              <FileWarning className="h-4 w-4" />
              <AlertTitle>البيانات التقديرية</AlertTitle>
              <AlertDescription>
                حاول استبدال البيانات التقديرية ببيانات موثقة من المصادر الرسمية
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

