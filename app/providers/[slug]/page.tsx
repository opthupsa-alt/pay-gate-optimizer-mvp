"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Star, 
  Clock, 
  CreditCard, 
  Globe, 
  ExternalLink,
  CheckCircle,
  XCircle,
  Info,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Shield,
  Building2,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react"
import type { ProviderWithRelations, ProviderSource } from "@/lib/types"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function ProviderDetailPage({ params }: PageProps) {
  const { slug } = use(params)
  const [provider, setProvider] = useState<ProviderWithRelations | null>(null)
  const [sources, setSources] = useState<ProviderSource[]>([])
  const [loading, setLoading] = useState(true)
  const [locale] = useState<"ar" | "en">("ar")

  useEffect(() => {
    fetchProvider()
  }, [slug])

  const fetchProvider = async () => {
    try {
      const response = await fetch(`/api/providers/${slug}`)
      if (!response.ok) throw new Error("Provider not found")
      const data = await response.json()
      setProvider(data.provider)
      setSources(data.sources || [])
    } catch (error) {
      console.error("Error fetching provider:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Skeleton className="h-10 w-1/3 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-64 w-full" />
          </div>
          <div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">
          {locale === "ar" ? "المزود غير موجود" : "Provider not found"}
        </h1>
        <Link href="/providers">
          <Button>{locale === "ar" ? "العودة للمزودين" : "Back to providers"}</Button>
        </Link>
      </div>
    )
  }

  const getAverageRating = () => {
    const reviews = provider.provider_reviews
    if (!reviews || reviews.length === 0) return null
    const totalRating = reviews.reduce((sum, r) => sum + (r.rating_avg || 0), 0)
    return (totalRating / reviews.length).toFixed(1)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/providers" className="hover:text-primary">
          {locale === "ar" ? "المزودون" : "Providers"}
        </Link>
        <span className="mx-2">/</span>
        <span>{locale === "ar" ? provider.name_ar : provider.name_en}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {locale === "ar" ? provider.name_ar : provider.name_en}
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              {locale === "ar" 
                ? provider.description_ar || provider.notes_ar 
                : provider.description_en || provider.notes_en}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {getAverageRating() && (
              <Badge variant="secondary" className="text-lg px-3 py-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 me-1" />
                {getAverageRating()}
              </Badge>
            )}
            {provider.website_url && (
              <a href={provider.website_url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <ExternalLink className="h-4 w-4 me-2" />
                  {locale === "ar" ? "زيارة الموقع" : "Visit Website"}
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex flex-wrap gap-4 mt-6">
          <Badge variant="outline" className="text-sm py-1.5 px-3">
            <Clock className="h-4 w-4 me-2" />
            {locale === "ar" ? "التفعيل: " : "Activation: "}
            {provider.activation_time_days_min}-{provider.activation_time_days_max} 
            {locale === "ar" ? " يوم" : " days"}
          </Badge>
          <Badge variant="outline" className="text-sm py-1.5 px-3">
            <CreditCard className="h-4 w-4 me-2" />
            {locale === "ar" ? "التسوية: " : "Settlement: "}
            {provider.settlement_days_min}-{provider.settlement_days_max} 
            {locale === "ar" ? " يوم" : " days"}
          </Badge>
          {provider.multi_currency_supported && (
            <Badge variant="outline" className="text-sm py-1.5 px-3">
              <Globe className="h-4 w-4 me-2" />
              {locale === "ar" ? "متعدد العملات" : "Multi-currency"}
            </Badge>
          )}
          <Badge 
            variant={provider.status === "active" ? "default" : "secondary"} 
            className="text-sm py-1.5 px-3"
          >
            {provider.status === "active" 
              ? (locale === "ar" ? "نشط" : "Active")
              : (locale === "ar" ? "محدود" : "Limited")}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="fees" className="space-y-6" dir={locale === "ar" ? "rtl" : "ltr"}>
            <TabsList className={`grid grid-cols-4 w-full ${locale === "ar" ? "flex-row-reverse" : ""}`}>
              <TabsTrigger value="sources">
                {locale === "ar" ? "المصادر" : "Sources"}
              </TabsTrigger>
              <TabsTrigger value="reviews">
                {locale === "ar" ? "التقييمات" : "Reviews"}
              </TabsTrigger>
              <TabsTrigger value="integrations">
                {locale === "ar" ? "التكاملات" : "Integrations"}
              </TabsTrigger>
              <TabsTrigger value="fees">
                {locale === "ar" ? "الرسوم" : "Fees"}
              </TabsTrigger>
            </TabsList>

            {/* Fees Tab */}
            <TabsContent value="fees">
              <Card>
                <CardHeader>
                  <CardTitle>{locale === "ar" ? "جدول الرسوم" : "Fee Schedule"}</CardTitle>
                  <CardDescription>
                    {locale === "ar" 
                      ? "الرسوم لكل طريقة دفع (بالريال السعودي)"
                      : "Fees per payment method (in SAR)"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {provider.provider_fees && provider.provider_fees.length > 0 ? (
                    <Table dir={locale === "ar" ? "rtl" : "ltr"} className={locale === "ar" ? "text-right" : "text-left"}>
                      <TableHeader>
                        <TableRow>
                          <TableHead className={locale === "ar" ? "text-right" : "text-left"}>{locale === "ar" ? "طريقة الدفع" : "Payment Method"}</TableHead>
                          <TableHead className={locale === "ar" ? "text-right" : "text-left"}>{locale === "ar" ? "نسبة" : "Percentage"}</TableHead>
                          <TableHead className={locale === "ar" ? "text-right" : "text-left"}>{locale === "ar" ? "ثابت" : "Fixed"}</TableHead>
                          <TableHead className={locale === "ar" ? "text-right" : "text-left"}>{locale === "ar" ? "ملاحظات" : "Notes"}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {provider.provider_fees.map((fee) => (
                          <TableRow key={fee.id}>
                            <TableCell className="font-medium">
                              {fee.payment_method
                                ? (locale === "ar" ? fee.payment_method.name_ar : fee.payment_method.name_en)
                                : (locale === "ar" ? "عام" : "General")}
                            </TableCell>
                            <TableCell>{fee.fee_percent}%</TableCell>
                            <TableCell>{fee.fee_fixed} SAR</TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {locale === "ar" ? fee.notes_ar : fee.notes_en}
                              {fee.is_estimated && (
                                <Badge variant="outline" className="ms-2 text-xs">
                                  {locale === "ar" ? "تقديري" : "Estimated"}
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : provider.pricing_rules && provider.pricing_rules.length > 0 ? (
                    <Table dir={locale === "ar" ? "rtl" : "ltr"} className={locale === "ar" ? "text-right" : "text-left"}>
                      <TableHeader>
                        <TableRow>
                          <TableHead className={locale === "ar" ? "text-right" : "text-left"}>{locale === "ar" ? "طريقة الدفع" : "Payment Method"}</TableHead>
                          <TableHead className={locale === "ar" ? "text-right" : "text-left"}>{locale === "ar" ? "نسبة" : "Percentage"}</TableHead>
                          <TableHead className={locale === "ar" ? "text-right" : "text-left"}>{locale === "ar" ? "ثابت" : "Fixed"}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {provider.pricing_rules.map((rule) => (
                          <TableRow key={rule.id}>
                            <TableCell className="font-medium">
                              {rule.payment_method
                                ? (locale === "ar" ? rule.payment_method.name_ar : rule.payment_method.name_en)
                                : "-"}
                            </TableCell>
                            <TableCell>{rule.fee_percent}%</TableCell>
                            <TableCell>{rule.fee_fixed} SAR</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      {locale === "ar" ? "لا توجد رسوم مسجلة" : "No fees recorded"}
                    </p>
                  )}

                  {/* Additional Fees */}
                  {(provider.setup_fee || provider.monthly_fee) && (
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="font-medium mb-4">
                        {locale === "ar" ? "رسوم إضافية" : "Additional Fees"}
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        {provider.setup_fee && provider.setup_fee > 0 && (
                          <div className="p-3 bg-muted rounded-lg">
                            <div className="text-sm text-muted-foreground">
                              {locale === "ar" ? "رسوم التأسيس" : "Setup Fee"}
                            </div>
                            <div className="text-lg font-bold">{provider.setup_fee} SAR</div>
                          </div>
                        )}
                        {provider.monthly_fee && provider.monthly_fee > 0 && (
                          <div className="p-3 bg-muted rounded-lg">
                            <div className="text-sm text-muted-foreground">
                              {locale === "ar" ? "رسوم شهرية" : "Monthly Fee"}
                            </div>
                            <div className="text-lg font-bold">{provider.monthly_fee} SAR</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {provider.pricing_url && (
                    <div className="mt-6 text-center">
                      <a href={provider.pricing_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline">
                          <ExternalLink className="h-4 w-4 me-2" />
                          {locale === "ar" ? "صفحة الأسعار الرسمية" : "Official Pricing Page"}
                        </Button>
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Integrations Tab */}
            <TabsContent value="integrations">
              <Card>
                <CardHeader>
                  <CardTitle>{locale === "ar" ? "التكاملات المدعومة" : "Supported Integrations"}</CardTitle>
                </CardHeader>
                <CardContent>
                  {provider.provider_integrations && provider.provider_integrations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {provider.provider_integrations.map((integration) => (
                        <div 
                          key={integration.id} 
                          className="p-4 border rounded-lg flex items-start justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium capitalize">{integration.platform}</span>
                              {integration.is_official && (
                                <Badge variant="secondary" className="text-xs">
                                  {locale === "ar" ? "رسمي" : "Official"}
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {integration.integration_type}
                              {" • "}
                              {integration.setup_difficulty === "easy" 
                                ? (locale === "ar" ? "سهل" : "Easy")
                                : integration.setup_difficulty === "medium"
                                ? (locale === "ar" ? "متوسط" : "Medium")
                                : (locale === "ar" ? "صعب" : "Hard")}
                            </div>
                          </div>
                          {integration.official_url && (
                            <a href={integration.official_url} target="_blank" rel="noopener noreferrer">
                              <Button variant="ghost" size="icon">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      {locale === "ar" ? "لا توجد تكاملات مسجلة" : "No integrations recorded"}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>{locale === "ar" ? "التقييمات والمراجعات" : "Ratings & Reviews"}</CardTitle>
                </CardHeader>
                <CardContent>
                  {provider.provider_reviews && provider.provider_reviews.length > 0 ? (
                    <div className="space-y-6">
                      {provider.provider_reviews.map((review) => (
                        <div key={review.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <Badge variant="outline" className="capitalize">
                              {review.platform}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-bold">{review.rating_avg}</span>
                              <span className="text-muted-foreground text-sm">
                                / {review.rating_max} ({review.rating_count} {locale === "ar" ? "تقييم" : "reviews"})
                              </span>
                            </div>
                          </div>

                          {review.highlights_positive && review.highlights_positive.length > 0 && (
                            <div className="mb-3">
                              <div className="text-sm font-medium text-emerald-600 mb-2 flex items-center gap-1">
                                <CheckCircle className="h-4 w-4" />
                                {locale === "ar" ? "نقاط القوة" : "Strengths"}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {review.highlights_positive.map((highlight, i) => (
                                  <Badge key={i} variant="secondary" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                    {highlight}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {review.highlights_negative && review.highlights_negative.length > 0 && (
                            <div className="mb-3">
                              <div className="text-sm font-medium text-red-600 mb-2 flex items-center gap-1">
                                <XCircle className="h-4 w-4" />
                                {locale === "ar" ? "نقاط الضعف" : "Weaknesses"}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {review.highlights_negative.map((highlight, i) => (
                                  <Badge key={i} variant="secondary" className="bg-red-50 text-red-700">
                                    {highlight}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          <a 
                            href={review.source_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                          >
                            {locale === "ar" ? "عرض التقييمات" : "View reviews"}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      {locale === "ar" ? "لا توجد تقييمات مسجلة" : "No reviews recorded"}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sources Tab */}
            <TabsContent value="sources">
              <Card>
                <CardHeader>
                  <CardTitle>{locale === "ar" ? "مصادر البيانات" : "Data Sources"}</CardTitle>
                  <CardDescription>
                    {locale === "ar" 
                      ? "مصادر المعلومات المستخدمة للتحقق من البيانات"
                      : "Information sources used to verify data"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {sources.length > 0 ? (
                    <div className="space-y-4">
                      {sources.map((source) => (
                        <div key={source.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-medium">{source.source_name || source.source_type}</div>
                              <div className="text-sm text-muted-foreground mt-1">
                                {source.entity_type}
                                {source.confidence_level && (
                                  <Badge 
                                    variant="outline" 
                                    className={`ms-2 text-xs ${
                                      source.confidence_level === "high" ? "border-emerald-500 text-emerald-600" :
                                      source.confidence_level === "medium" ? "border-yellow-500 text-yellow-600" :
                                      "border-red-500 text-red-600"
                                    }`}
                                  >
                                    {source.confidence_level}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(source.last_verified_at).toLocaleDateString(
                                locale === "ar" ? "ar-SA" : "en-US"
                              )}
                            </div>
                          </div>
                          <a 
                            href={source.source_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline flex items-center gap-1 mt-2"
                          >
                            {source.source_url}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      {locale === "ar" ? "لا توجد مصادر مسجلة" : "No sources recorded"}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pros & Cons */}
          <Card>
            <CardHeader>
              <CardTitle>{locale === "ar" ? "المميزات والعيوب" : "Pros & Cons"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {provider.pros_ar && provider.pros_ar.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-emerald-600 mb-2 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    {locale === "ar" ? "المميزات" : "Pros"}
                  </div>
                  <ul className="space-y-2">
                    {(locale === "ar" ? provider.pros_ar : provider.pros_en)?.map((pro, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {provider.cons_ar && provider.cons_ar.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-red-600 mb-2 flex items-center gap-1">
                    <XCircle className="h-4 w-4" />
                    {locale === "ar" ? "العيوب" : "Cons"}
                  </div>
                  <ul className="space-y-2">
                    {(locale === "ar" ? provider.cons_ar : provider.cons_en)?.map((con, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Support & Contact */}
          <Card>
            <CardHeader>
              <CardTitle>{locale === "ar" ? "الدعم والتواصل" : "Support & Contact"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {provider.support_hours && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{provider.support_hours}</span>
                </div>
              )}
              {provider.support_channels && (
                <div className="flex flex-wrap gap-2">
                  {provider.support_channels.map((channel) => (
                    <Badge key={channel} variant="outline" className="text-xs">
                      {channel === "email" && <Mail className="h-3 w-3 me-1" />}
                      {channel === "phone" && <Phone className="h-3 w-3 me-1" />}
                      {channel === "chat" && <MessageCircle className="h-3 w-3 me-1" />}
                      {channel}
                    </Badge>
                  ))}
                </div>
              )}
              {provider.docs_url && (
                <a href={provider.docs_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="h-4 w-4 me-2" />
                    {locale === "ar" ? "التوثيق" : "Documentation"}
                  </Button>
                </a>
              )}
            </CardContent>
          </Card>

          {/* Data Freshness */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                {locale === "ar" ? "حداثة البيانات" : "Data Freshness"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                {locale === "ar" ? "آخر تحقق: " : "Last verified: "}
                {provider.last_verified_at 
                  ? new Date(provider.last_verified_at).toLocaleDateString(
                      locale === "ar" ? "ar-SA" : "en-US",
                      { year: "numeric", month: "long", day: "numeric" }
                    )
                  : (locale === "ar" ? "غير محدد" : "Not specified")}
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="py-6 text-center">
              <h3 className="font-bold mb-2">
                {locale === "ar" ? "مقارنة مع مزودين آخرين؟" : "Compare with others?"}
              </h3>
              <p className="text-sm opacity-90 mb-4">
                {locale === "ar" 
                  ? "استخدم المعالج للحصول على توصية مخصصة"
                  : "Use the wizard for personalized recommendations"}
              </p>
              <Link href="/wizard">
                <Button variant="secondary" className="w-full">
                  {locale === "ar" ? "ابدأ المقارنة" : "Start Comparison"}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

