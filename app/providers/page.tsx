"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Search, 
  Star, 
  Clock, 
  CreditCard, 
  Globe, 
  ArrowRight,
  ArrowLeft,
  Filter,
  X,
} from "lucide-react"
import { useLocale } from "@/hooks/use-locale"
import type { Provider, ProviderReview, ProviderIntegration, ProviderFee } from "@/lib/types"

interface ProviderWithRelations extends Provider {
  provider_fees?: ProviderFee[]
  provider_integrations?: ProviderIntegration[]
  provider_reviews?: ProviderReview[]
}

const categories = [
  { value: "all", label_ar: "الكل", label_en: "All" },
  { value: "payment_gateway", label_ar: "بوابات الدفع", label_en: "Payment Gateways" },
  { value: "psp", label_ar: "مزودو خدمات الدفع", label_en: "PSP" },
  { value: "acquirer", label_ar: "المستحوذون", label_en: "Acquirers" },
  { value: "bnpl", label_ar: "اشتر الآن ادفع لاحقاً", label_en: "BNPL" },
  { value: "aggregator", label_ar: "المجمعون", label_en: "Aggregators" },
  { value: "wallet", label_ar: "المحافظ الرقمية", label_en: "Wallets" },
]

const platforms = [
  { value: "shopify", label: "Shopify" },
  { value: "woocommerce", label: "WooCommerce" },
  { value: "salla", label: "سلة" },
  { value: "zid", label: "زد" },
  { value: "magento", label: "Magento" },
]

export default function ProvidersPage() {
  const searchParams = useSearchParams()
  const [providers, setProviders] = useState<ProviderWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [category, setCategory] = useState(searchParams.get("category") || "all")
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const locale = useLocale()

  useEffect(() => {
    fetchProviders()
  }, [search, category, selectedPlatforms])

  const fetchProviders = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (category && category !== "all") params.set("category", category)
      if (selectedPlatforms.length > 0) params.set("platforms", selectedPlatforms.join(","))

      const response = await fetch(`/api/providers?${params}`)
      const data = await response.json()
      setProviders(data.providers || [])
    } catch (error) {
      console.error("Error fetching providers:", error)
    } finally {
      setLoading(false)
    }
  }

  const getAverageRating = (reviews?: ProviderReview[]) => {
    if (!reviews || reviews.length === 0) return null
    const totalRating = reviews.reduce((sum, r) => sum + (r.rating_avg || 0), 0)
    return (totalRating / reviews.length).toFixed(1)
  }

  const getMinFee = (fees?: ProviderFee[]) => {
    if (!fees || fees.length === 0) return null
    const minFee = Math.min(...fees.map(f => f.fee_percent || 0))
    return minFee > 0 ? `${minFee}%` : null
  }

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {locale === "ar" ? "مزودو خدمات الدفع" : "Payment Providers"}
        </h1>
        <p className="text-muted-foreground">
          {locale === "ar" 
            ? "استعرض ومقارنة جميع مزودي خدمات الدفع في السعودية"
            : "Browse and compare all payment providers in Saudi Arabia"}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={locale === "ar" ? "ابحث عن مزود..." : "Search providers..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ps-10"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder={locale === "ar" ? "التصنيف" : "Category"} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {locale === "ar" ? cat.label_ar : cat.label_en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="sm:w-auto"
          >
            <Filter className="h-4 w-4 me-2" />
            {locale === "ar" ? "فلاتر" : "Filters"}
            {selectedPlatforms.length > 0 && (
              <Badge variant="secondary" className="ms-2">
                {selectedPlatforms.length}
              </Badge>
            )}
          </Button>
        </div>

        {/* Platform Filters */}
        {showFilters && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                {locale === "ar" ? "المنصات المدعومة" : "Supported Platforms"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {platforms.map((platform) => (
                  <label 
                    key={platform.value} 
                    className="flex items-center space-x-2 space-x-reverse cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedPlatforms.includes(platform.value)}
                      onCheckedChange={() => togglePlatform(platform.value)}
                    />
                    <span className="text-sm">{platform.label}</span>
                  </label>
                ))}
              </div>
              {selectedPlatforms.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-3"
                  onClick={() => setSelectedPlatforms([])}
                >
                  <X className="h-4 w-4 me-1" />
                  {locale === "ar" ? "مسح الفلاتر" : "Clear filters"}
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Providers Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : providers.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground text-lg">
              {locale === "ar" 
                ? "لم يتم العثور على مزودين"
                : "No providers found"}
            </p>
            <Button 
              variant="link" 
              onClick={() => {
                setSearch("")
                setCategory("all")
                setSelectedPlatforms([])
              }}
            >
              {locale === "ar" ? "إعادة تعيين الفلاتر" : "Reset filters"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((provider) => {
            const rating = getAverageRating(provider.provider_reviews)
            const minFee = getMinFee(provider.provider_fees)

            return (
              <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {locale === "ar" ? provider.name_ar : provider.name_en}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {categories.find(c => c.value === provider.category)?.[locale === "ar" ? "label_ar" : "label_en"] || provider.category}
                      </CardDescription>
                    </div>
                    {rating && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {rating}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {locale === "ar" 
                      ? provider.description_ar || provider.notes_ar 
                      : provider.description_en || provider.notes_en}
                  </p>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {minFee && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CreditCard className="h-4 w-4" />
                        <span>
                          {locale === "ar" ? `من ${minFee}` : `From ${minFee}`}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        {provider.activation_time_days_min}-{provider.activation_time_days_max} 
                        {locale === "ar" ? " يوم" : " days"}
                      </span>
                    </div>
                    {provider.multi_currency_supported && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Globe className="h-4 w-4" />
                        <span>{locale === "ar" ? "متعدد العملات" : "Multi-currency"}</span>
                      </div>
                    )}
                  </div>

                  {/* Integrations */}
                  {provider.provider_integrations && provider.provider_integrations.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {provider.provider_integrations.slice(0, 4).map((int) => (
                        <Badge key={int.id} variant="outline" className="text-xs">
                          {int.platform}
                        </Badge>
                      ))}
                      {provider.provider_integrations.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{provider.provider_integrations.length - 4}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Action */}
                  <Link href={`/providers/${provider.slug}`}>
                    <Button variant="outline" className="w-full group">
                      {locale === "ar" ? "عرض التفاصيل" : "View Details"}
                      {locale === "ar" ? (
                        <ArrowLeft className="h-4 w-4 ms-2 group-hover:-translate-x-1 transition-transform" />
                      ) : (
                        <ArrowRight className="h-4 w-4 ms-2 group-hover:translate-x-1 transition-transform" />
                      )}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* CTA */}
      <div className="mt-12 text-center">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="py-8">
            <h2 className="text-2xl font-bold mb-4">
              {locale === "ar" 
                ? "لست متأكداً من المزود المناسب؟"
                : "Not sure which provider is right?"}
            </h2>
            <p className="mb-6 opacity-90">
              {locale === "ar"
                ? "استخدم معالج المقارنة للحصول على توصيات مخصصة بناءً على احتياجاتك"
                : "Use our comparison wizard to get personalized recommendations based on your needs"}
            </p>
            <Link href="/wizard">
              <Button size="lg" variant="secondary">
                {locale === "ar" ? "ابدأ المقارنة" : "Start Comparison"}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

