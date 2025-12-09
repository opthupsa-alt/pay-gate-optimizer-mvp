"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Trophy, 
  TrendingUp, 
  Shield, 
  Zap, 
  CheckCircle2, 
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Download,
  Share2,
  Copy,
  Check,
  Loader2,
  Mail,
  Phone,
  Building2
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { generatePDFContent as generatePremiumPDF } from "@/lib/pdf-export"
import { SARSymbol } from "@/components/ui/sar-symbol"

interface BreakdownItem {
  payment_method?: string
  method?: string // Legacy field
  tx_count?: number
  txCount?: number // Legacy field
  volume?: number
  fee_amount?: number
  cost?: number // Legacy field
  fee_percent?: number
  feePercent?: number // Legacy field
  fee_fixed?: number
  feeFixed?: number // Legacy field
  isMonthlyFee?: boolean
  isEstimate?: boolean
}

interface Recommendation {
  provider_id: string
  provider_name_ar?: string
  provider_name_en?: string
  expected_cost_min: number
  expected_cost_max: number
  breakdown: BreakdownItem[]
  score_total: number
  score_cost: number
  score_fit: number
  score_ops: number
  score_risk: number
  reasons: string[]
  caveats: string[]
  // Enhanced fields
  activation_time_min?: number
  activation_time_max?: number
  settlement_days_min?: number
  settlement_days_max?: number
  pros?: string[]
  cons?: string[]
  support_channels?: string[]
  website_url?: string | null
  docs_url?: string | null
}

interface ResultData {
  wizardRunId: string
  recommendations: Recommendation[]
  wizardRun: {
    monthly_gmv: number
    tx_count: number
    avg_ticket: number
    locale: "ar" | "en"
  }
  isMock?: boolean
}

// Helper to get locale from cookie (client-side)
function getLocaleFromCookie(): "ar" | "en" {
  if (typeof document === "undefined") return "ar"
  const match = document.cookie.match(/locale=(ar|en)/)
  return (match?.[1] as "ar" | "en") || "ar"
}

export default function ResultsPage() {
  const params = useParams()
  const [data, setData] = useState<ResultData | null>(null)
  // Read locale from cookie (site language), not from wizardRun
  const [locale, setLocale] = useState<"ar" | "en">(getLocaleFromCookie())
  const [isExporting, setIsExporting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  })
  const [isSubmittingLead, setIsSubmittingLead] = useState(false)

  // Update locale when cookie changes (after language toggle)
  useEffect(() => {
    setLocale(getLocaleFromCookie())
  }, [])

  useEffect(() => {
    async function loadResults() {
      setIsLoading(true)
      
      // First, try to get from sessionStorage (fastest for same browser)
      const storedData = sessionStorage.getItem(`wizard-result-${params.id}`)
      if (storedData) {
        const parsed = JSON.parse(storedData)
        setData(parsed)
        // Don't set locale here - we read it from cookie (site language)
        setIsLoading(false)
        return
      }
      
      // If not in sessionStorage, fetch from API (for shared links)
      try {
        const response = await fetch(`/api/results/${params.id}`)
        if (response.ok) {
          const apiData = await response.json()
          setData(apiData)
          // Don't set locale here - we read it from cookie (site language)
          // Cache in sessionStorage for future use
          sessionStorage.setItem(`wizard-result-${params.id}`, JSON.stringify(apiData))
        }
      } catch (error) {
        console.error("Failed to fetch results:", error)
      }
      
      setIsLoading(false)
    }
    
    loadResults()
  }, [params.id])

  const isRTL = locale === "ar"
  const BackArrow = isRTL ? ArrowRight : ArrowLeft

  // Export to PDF function
  const handleExportPDF = async () => {
    if (!data) return
    
    setIsExporting(true)
    try {
      // Convert data format for PDF generator
      const pdfRecommendations = data.recommendations.map(rec => ({
        ...rec,
        // Map field names for compatibility
        breakdown: rec.breakdown.map(item => ({
          payment_method: item.payment_method || item.method || "unknown",
          tx_count: item.tx_count ?? item.txCount ?? 0,
          volume: item.volume ?? 0,
          fee_amount: item.fee_amount ?? item.cost ?? 0,
          fee_percent: item.fee_percent ?? item.feePercent,
          fee_fixed: item.fee_fixed ?? item.feeFixed,
        }))
      }))
      
      // Generate premium PDF content
      const content = generatePremiumPDF({
        locale,
        recommendations: pdfRecommendations as any,
        wizardData: data.wizardRun ? {
          sector_id: "",
          business_type: "company",
          monthly_gmv: data.wizardRun.monthly_gmv,
          tx_count: data.wizardRun.tx_count,
          avg_ticket: data.wizardRun.avg_ticket,
          payment_mix: { mada: 60, visa_mc: 25, apple_pay: 10, google_pay: 5, other: 0 },
          refunds_rate: 2,
          chargebacks_rate: 0.5,
          needs: {
            recurring: false,
            tokenization: false,
            multi_currency: false,
            plugins_shopify: false,
            plugins_woocommerce: false,
            fast_settlement: false,
            apple_pay: false,
            google_pay: false,
          },
          contact: {
            fullName: "",
            companyName: "",
            sector: "",
            phone: { raw: "", normalized: "", countryCode: "966", isValid: false },
          },
          locale,
        } : undefined,
      })
      
      // Create blob and download
      const blob = new Blob([content], { type: 'text/html;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      
      // Open print dialog
      const printWindow = window.open(url, '_blank')
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print()
        }
      }
      
      toast.success(locale === "ar" ? "تم فتح نافذة الطباعة" : "Print dialog opened")
    } catch (error) {
      console.error("PDF export error:", error)
      toast.error(locale === "ar" ? "حدث خطأ أثناء التصدير" : "Error exporting")
    } finally {
      setIsExporting(false)
    }
  }

  // Share function
  const handleShare = async () => {
    const shareUrl = window.location.href
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: locale === "ar" ? "نتائج مقارنة بوابات الدفع" : "Payment Gateway Comparison Results",
          text: locale === "ar" 
            ? "شاهد نتائج مقارنة بوابات الدفع الخاصة بي" 
            : "Check out my payment gateway comparison results",
          url: shareUrl,
        })
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback to copy
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success(locale === "ar" ? "تم نسخ الرابط" : "Link copied")
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Submit lead form
  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingLead(true)

    try {
      const response = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...leadForm,
          company_name: leadForm.company,
          wizard_run_id: data?.wizardRunId,
          preferred_contact: "email",
        }),
      })

      if (response.ok) {
        toast.success(locale === "ar" ? "تم إرسال طلبك بنجاح! سنتواصل معك قريباً" : "Request submitted! We'll contact you soon")
        setShowLeadForm(false)
        setLeadForm({ name: "", email: "", phone: "", company: "" })
      } else {
        throw new Error("Failed to submit")
      }
    } catch {
      toast.error(locale === "ar" ? "حدث خطأ. يرجى المحاولة مرة أخرى" : "Error. Please try again")
    } finally {
      setIsSubmittingLead(false)
    }
  }

  const translations = {
    ar: {
      title: "نتائج المقارنة",
      subtitle: "بناءً على بياناتك، إليك أفضل بوابات الدفع لنشاطك التجاري",
      rank: ["الأفضل", "الثاني", "الثالث", "الرابع", "الخامس", "السادس", "السابع", "الثامن", "التاسع", "العاشر"],
      rankN: "الخيار رقم",
      monthlyCost: "التكلفة الشهرية المتوقعة",
      to: "إلى",
      sar: "﷼",
      scores: {
        total: "التقييم الإجمالي",
        cost: "التكلفة",
        fit: "التوافق",
        ops: "العمليات",
        risk: "المخاطر",
      },
      reasons: "لماذا هذا الخيار؟",
      caveats: "ملاحظات مهمة",
      breakdown: "تفاصيل التكاليف",
      paymentMethod: "طريقة الدفع",
      transactions: "عدد العمليات",
      volume: "الحجم",
      fees: "الرسوم",
      backToWizard: "إجراء مقارنة جديدة",
      downloadReport: "تحميل التقرير",
      shareResults: "مشاركة النتائج",
      noData: "لا توجد بيانات",
      noDataDesc: "لم نتمكن من العثور على نتائج المقارنة. يرجى إجراء مقارنة جديدة.",
      // New fields
      pros: "المميزات",
      cons: "العيوب",
      activationTime: "مدة التفعيل",
      settlementDays: "مدة التسوية",
      supportChannels: "قنوات الدعم",
      visitWebsite: "زيارة الموقع",
      days: "أيام",
      providerDetails: "تفاصيل المزود",
    },
    en: {
      title: "Comparison Results",
      subtitle: "Based on your data, here are the best payment gateways for your business",
      rank: ["Best Choice", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"],
      rankN: "Option #",
      monthlyCost: "Expected Monthly Cost",
      to: "to",
      sar: "SAR",
      scores: {
        total: "Overall Score",
        cost: "Cost",
        fit: "Fit",
        ops: "Operations",
        risk: "Risk",
      },
      reasons: "Why this option?",
      caveats: "Important Notes",
      breakdown: "Cost Breakdown",
      paymentMethod: "Payment Method",
      transactions: "Transactions",
      volume: "Volume",
      fees: "Fees",
      backToWizard: "New Comparison",
      downloadReport: "Download Report",
      shareResults: "Share Results",
      noData: "No Data",
      noDataDesc: "We couldn't find the comparison results. Please run a new comparison.",
      // New fields
      pros: "Pros",
      cons: "Cons",
      activationTime: "Activation Time",
      settlementDays: "Settlement Period",
      supportChannels: "Support Channels",
      visitWebsite: "Visit Website",
      days: "days",
      providerDetails: "Provider Details",
    },
  }

  const t = translations[locale]

  const paymentMethodNames = {
    ar: {
      mada: "مدى",
      visa_mc: "فيزا / ماستركارد",
      apple_pay: "Apple Pay",
      google_pay: "Google Pay",
      other: "أخرى",
    },
    en: {
      mada: "Mada",
      visa_mc: "Visa / Mastercard",
      apple_pay: "Apple Pay",
      google_pay: "Google Pay",
      other: "Other",
    },
  }

  // Bilingual reasons/caveats mapping for dynamic translation
  const reasonsTranslations: Record<string, { ar: string; en: string }> = {
    // Reasons - Basic
    "يدعم مدى": { ar: "يدعم مدى", en: "Supports Mada" },
    "Supports Mada": { ar: "يدعم مدى", en: "Supports Mada" },
    "يدعم Apple Pay": { ar: "يدعم Apple Pay", en: "Supports Apple Pay" },
    "Supports Apple Pay": { ar: "يدعم Apple Pay", en: "Supports Apple Pay" },
    "يدعم Google Pay": { ar: "يدعم Google Pay", en: "Supports Google Pay" },
    "Supports Google Pay": { ar: "يدعم Google Pay", en: "Supports Google Pay" },
    "يدعم قطاعك": { ar: "يدعم قطاعك", en: "Supports your sector" },
    "Supports your sector": { ar: "يدعم قطاعك", en: "Supports your sector" },
    "تفعيل سريع": { ar: "تفعيل سريع", en: "Fast activation" },
    "Fast activation": { ar: "تفعيل سريع", en: "Fast activation" },
    "دعم فني ممتاز": { ar: "دعم فني ممتاز", en: "Excellent support" },
    "Excellent support": { ar: "دعم فني ممتاز", en: "Excellent support" },
    // Reasons - New
    "يدعم تابي/تمارا": { ar: "يدعم تابي/تمارا", en: "Supports Tabby/Tamara BNPL" },
    "Supports Tabby/Tamara BNPL": { ar: "يدعم تابي/تمارا", en: "Supports Tabby/Tamara BNPL" },
    "يدعم العملات المتعددة": { ar: "يدعم العملات المتعددة", en: "Supports multi-currency" },
    "Supports multi-currency": { ar: "يدعم العملات المتعددة", en: "Supports multi-currency" },
    "يدعم الدفعات المتكررة": { ar: "يدعم الدفعات المتكررة", en: "Supports recurring payments" },
    "Supports recurring payments": { ar: "يدعم الدفعات المتكررة", en: "Supports recurring payments" },
    "تسوية سريعة": { ar: "تسوية سريعة", en: "Fast settlement" },
    "Fast settlement": { ar: "تسوية سريعة", en: "Fast settlement" },
    "تكامل مع Shopify": { ar: "تكامل مع Shopify", en: "Shopify integration" },
    "Shopify integration": { ar: "تكامل مع Shopify", en: "Shopify integration" },
    "تكامل مع WooCommerce": { ar: "تكامل مع WooCommerce", en: "WooCommerce integration" },
    "WooCommerce integration": { ar: "تكامل مع WooCommerce", en: "WooCommerce integration" },
    "تكامل مع سلة": { ar: "تكامل مع سلة", en: "Salla integration" },
    "Salla integration": { ar: "تكامل مع سلة", en: "Salla integration" },
    // Caveats - New
    "تفعيل بطيء": { ar: "تفعيل بطيء", en: "Slow activation time" },
    "Slow activation time": { ar: "تفعيل بطيء", en: "Slow activation time" },
    "تسوية بطيئة": { ar: "تسوية بطيئة", en: "Slow settlement time" },
    "Slow settlement time": { ar: "تسوية بطيئة", en: "Slow settlement time" },
    "ساعات دعم محدودة": { ar: "ساعات دعم محدودة", en: "Limited support hours" },
    "Limited support hours": { ar: "ساعات دعم محدودة", en: "Limited support hours" },
  }

  // Translate a reason/caveat to current locale
  const translateText = (text: string): string => {
    // Check if it's a known phrase
    if (reasonsTranslations[text]) {
      return reasonsTranslations[text][locale]
    }
    // Handle fee patterns: "رسوم تسجيل: X ﷼" or "Setup fee: X ﷼"
    const setupFeeAr = text.match(/رسوم تسجيل:\s*([\d,]+)\s*﷼/)
    if (setupFeeAr) {
      return locale === "ar" ? text : `Setup fee: ${setupFeeAr[1]} SAR`
    }
    const setupFeeEn = text.match(/Setup fee:\s*([\d,]+)\s*(?:﷼|SAR)/)
    if (setupFeeEn) {
      return locale === "en" ? text : `رسوم تسجيل: ${setupFeeEn[1]} ﷼`
    }
    const monthlyFeeAr = text.match(/رسوم شهرية:\s*([\d,]+)\s*﷼/)
    if (monthlyFeeAr) {
      return locale === "ar" ? text : `Monthly fee: ${monthlyFeeAr[1]} SAR`
    }
    const monthlyFeeEn = text.match(/Monthly fee:\s*([\d,]+)\s*(?:﷼|SAR)/)
    if (monthlyFeeEn) {
      return locale === "en" ? text : `رسوم شهرية: ${monthlyFeeEn[1]} ﷼`
    }
    // Return original if no translation found
    return text
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-SA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
      case 1:
        return <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
      case 2:
        return <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
      default:
        return <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-500" />
    }
  }

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30"
      case 1:
        return "border-gray-400 bg-gray-50 dark:bg-gray-900/30"
      case 2:
        return "border-amber-600 bg-amber-50 dark:bg-amber-950/30"
      default:
        return "border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30"
    }
  }
  
  const getRankLabel = (index: number) => {
    if (index < t.rank.length) {
      return t.rank[index]
    }
    return `${t.rankN}${index + 1}`
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="container py-8 sm:py-12" dir={isRTL ? "rtl" : "ltr"}>
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>{locale === "ar" ? "جاري تحميل النتائج..." : "Loading results..."}</span>
          </div>
        </div>
      </div>
    )
  }

  if (!data || !data.recommendations || data.recommendations.length === 0) {
    return (
      <div className="container py-8 sm:py-12" dir={isRTL ? "rtl" : "ltr"}>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="mb-4 text-2xl sm:text-3xl font-bold">{t.noData}</h1>
          <p className="mb-8 text-sm sm:text-base text-muted-foreground">{t.noDataDesc}</p>
          <Button asChild>
            <Link href="/wizard">
              <BackArrow className="h-4 w-4 me-2" />
              {t.backToWizard}
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6 sm:py-8 md:py-12" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="mx-auto mb-6 sm:mb-8 max-w-4xl text-center">
        <h1 className="mb-2 text-2xl sm:text-3xl font-bold">{t.title}</h1>
        <p className="text-sm sm:text-base text-muted-foreground">{t.subtitle}</p>
        <Badge variant="outline" className="mt-3 text-sm">
          {locale === "ar" 
            ? `${data.recommendations.length} شركة مؤهلة لمتطلباتك`
            : `${data.recommendations.length} providers match your requirements`}
        </Badge>
      </div>

      {/* Actions */}
      <div className="mx-auto mb-6 sm:mb-8 flex max-w-4xl flex-wrap justify-center gap-2 sm:gap-4">
        <Button variant="outline" size="sm" asChild className="text-xs sm:text-sm">
          <Link href="/wizard">
            <BackArrow className="h-4 w-4 me-1 sm:me-2" />
            {t.backToWizard}
          </Link>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs sm:text-sm"
          onClick={handleExportPDF}
          disabled={isExporting}
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin me-1 sm:me-2" />
          ) : (
            <Download className="h-4 w-4 me-1 sm:me-2" />
          )}
          <span className="hidden xs:inline">{t.downloadReport}</span>
          <span className="xs:hidden">PDF</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs sm:text-sm"
          onClick={handleShare}
        >
          {copied ? (
            <Check className="h-4 w-4 me-1 sm:me-2 text-emerald-500" />
          ) : (
            <Share2 className="h-4 w-4 me-1 sm:me-2" />
          )}
          <span className="hidden xs:inline">{t.shareResults}</span>
          <span className="xs:hidden">Share</span>
        </Button>
        
        {/* Contact Us Dialog */}
        <Dialog open={showLeadForm} onOpenChange={setShowLeadForm}>
          <DialogTrigger asChild>
            <Button size="sm" className="text-xs sm:text-sm">
              <Mail className="h-4 w-4 me-1 sm:me-2" />
              {locale === "ar" ? "تواصل معنا" : "Contact Us"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {locale === "ar" ? "احصل على استشارة مجانية" : "Get Free Consultation"}
              </DialogTitle>
              <DialogDescription>
                {locale === "ar" 
                  ? "أدخل بياناتك وسنتواصل معك لمساعدتك في اختيار البوابة المناسبة" 
                  : "Enter your details and we'll contact you to help choose the right gateway"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitLead} className="space-y-4">
              <div className="space-y-2">
                <Label>{locale === "ar" ? "الاسم" : "Name"}</Label>
                <Input 
                  required
                  value={leadForm.name}
                  onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                  placeholder={locale === "ar" ? "أدخل اسمك" : "Enter your name"}
                />
              </div>
              <div className="space-y-2">
                <Label>{locale === "ar" ? "البريد الإلكتروني" : "Email"}</Label>
                <Input 
                  type="email"
                  required
                  value={leadForm.email}
                  onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                  placeholder="example@domain.com"
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label>{locale === "ar" ? "رقم الجوال" : "Phone"}</Label>
                <Input 
                  type="tel"
                  value={leadForm.phone}
                  onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                  placeholder="05xxxxxxxx"
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label>{locale === "ar" ? "اسم الشركة" : "Company Name"}</Label>
                <Input 
                  value={leadForm.company}
                  onChange={(e) => setLeadForm({ ...leadForm, company: e.target.value })}
                  placeholder={locale === "ar" ? "اسم شركتك أو نشاطك" : "Your company or business name"}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmittingLead}>
                {isSubmittingLead ? (
                  <Loader2 className="h-4 w-4 animate-spin me-2" />
                ) : (
                  <Mail className="h-4 w-4 me-2" />
                )}
                {locale === "ar" ? "إرسال الطلب" : "Submit Request"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Recommendations */}
      <div className="mx-auto max-w-4xl space-y-4 sm:space-y-6">
        {data.recommendations.map((rec, index) => (
          <Card 
            key={rec.provider_id} 
            className={`border-2 ${getRankColor(index)}`}
          >
            <CardHeader className="pb-2 sm:pb-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  {getRankIcon(index)}
                  <div>
                    <Badge variant={index === 0 ? "default" : "secondary"} className="text-xs">
                      {getRankLabel(index)}
                    </Badge>
                    <CardTitle className="mt-1 text-lg sm:text-xl md:text-2xl">
                      {locale === "ar" ? rec.provider_name_ar : rec.provider_name_en}
                    </CardTitle>
                  </div>
                </div>
                <div className={`${isRTL ? "text-start sm:text-end" : "text-start sm:text-end"}`}>
                  <p className="text-xs sm:text-sm text-muted-foreground">{t.monthlyCost}</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary inline-flex items-center gap-1">
                    {formatCurrency(rec.expected_cost_min)} - {formatCurrency(rec.expected_cost_max)}
                    <SARSymbol size="xl" />
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {/* Scores - Mobile: 2 columns, Desktop: 5 columns */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 sm:gap-4">
                <div className="col-span-2 sm:col-span-1 text-center rounded-lg bg-muted/50 p-3">
                  <p className="text-xs sm:text-sm text-muted-foreground">{t.scores.total}</p>
                  <p className="text-xl sm:text-2xl font-bold">{Math.round(rec.score_total)}</p>
                  <Progress value={rec.score_total} className="mt-2 h-2" />
                </div>
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-muted-foreground">{t.scores.cost}</p>
                  <p className="text-base sm:text-lg font-semibold">{Math.round(rec.score_cost)}</p>
                  <Progress value={rec.score_cost} className="mt-2 h-1.5" />
                </div>
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-muted-foreground">{t.scores.fit}</p>
                  <p className="text-base sm:text-lg font-semibold">{Math.round(rec.score_fit)}</p>
                  <Progress value={rec.score_fit} className="mt-2 h-1.5" />
                </div>
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-muted-foreground">{t.scores.ops}</p>
                  <p className="text-base sm:text-lg font-semibold">{Math.round(rec.score_ops)}</p>
                  <Progress value={rec.score_ops} className="mt-2 h-1.5" />
                </div>
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-muted-foreground">{t.scores.risk}</p>
                  <p className="text-base sm:text-lg font-semibold">{Math.round(rec.score_risk)}</p>
                  <Progress value={rec.score_risk} className="mt-2 h-1.5" />
                </div>
              </div>

              <Separator />

              {/* Reasons & Caveats */}
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                {rec.reasons.length > 0 && (
                  <div>
                    <h4 className="mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base font-semibold">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />
                      {t.reasons}
                    </h4>
                    <ul className="space-y-1.5 sm:space-y-2">
                      {rec.reasons.map((reason, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs sm:text-sm">
                          <Zap className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 text-emerald-500 shrink-0" />
                          <span>{translateText(reason)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {rec.caveats.length > 0 && (
                  <div>
                    <h4 className="mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base font-semibold">
                      <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
                      {t.caveats}
                    </h4>
                    <ul className="space-y-1.5 sm:space-y-2">
                      {rec.caveats.map((caveat, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs sm:text-sm">
                          <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 text-amber-500 shrink-0" />
                          <span>{translateText(caveat)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Enhanced Info: Pros, Cons, Activation, Settlement */}
              {(rec.pros?.length || rec.cons?.length || rec.activation_time_min || rec.settlement_days_min) && (
                <>
                  <Separator />
                  <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                    {/* Pros */}
                    {rec.pros && rec.pros.length > 0 && (
                      <div>
                        <h4 className="mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base font-semibold text-emerald-600">
                          <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                          {locale === "ar" ? "المميزات" : "Advantages"}
                        </h4>
                        <ul className="space-y-1.5 sm:space-y-2">
                          {rec.pros.map((pro, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs sm:text-sm">
                              <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 text-emerald-500 shrink-0" />
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Cons */}
                    {rec.cons && rec.cons.length > 0 && (
                      <div>
                        <h4 className="mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base font-semibold text-red-600">
                          <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
                          {locale === "ar" ? "العيوب" : "Disadvantages"}
                        </h4>
                        <ul className="space-y-1.5 sm:space-y-2">
                          {rec.cons.map((con, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs sm:text-sm">
                              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 text-red-500 shrink-0" />
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Quick Stats: Activation & Settlement */}
                  {(rec.activation_time_min || rec.settlement_days_min) && (
                    <div className="flex flex-wrap gap-4 mt-4">
                      {rec.activation_time_min && (
                        <div className="flex items-center gap-2 text-xs sm:text-sm bg-blue-50 dark:bg-blue-950/30 px-3 py-2 rounded-lg">
                          <Zap className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">
                            {locale === "ar" ? "التفعيل:" : "Activation:"} 
                          </span>
                          <span>
                            {rec.activation_time_min === rec.activation_time_max 
                              ? `${rec.activation_time_min} ${locale === "ar" ? "يوم" : "days"}`
                              : `${rec.activation_time_min}-${rec.activation_time_max} ${locale === "ar" ? "يوم" : "days"}`
                            }
                          </span>
                        </div>
                      )}
                      {rec.settlement_days_min && (
                        <div className="flex items-center gap-2 text-xs sm:text-sm bg-green-50 dark:bg-green-950/30 px-3 py-2 rounded-lg">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="font-medium">
                            {locale === "ar" ? "التسوية:" : "Settlement:"} 
                          </span>
                          <span>
                            {rec.settlement_days_min === rec.settlement_days_max 
                              ? `${rec.settlement_days_min} ${locale === "ar" ? "يوم" : "days"}`
                              : `${rec.settlement_days_min}-${rec.settlement_days_max} ${locale === "ar" ? "يوم" : "days"}`
                            }
                          </span>
                        </div>
                      )}
                      {rec.website_url && (
                        <a 
                          href={rec.website_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900/30 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/30 transition-colors"
                        >
                          <Building2 className="h-4 w-4 text-gray-500" />
                          <span>{locale === "ar" ? "زيارة الموقع" : "Visit Website"}</span>
                        </a>
                      )}
                    </div>
                  )}
                </>
              )}

              <Separator />

              {/* Cost Breakdown */}
              <div>
                <h4 className="mb-2 sm:mb-3 text-sm sm:text-base font-semibold">{t.breakdown}</h4>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="min-w-[400px] px-4 sm:px-0">
                    <table className="w-full text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 text-start font-medium">{t.paymentMethod}</th>
                          <th className="py-2 text-end font-medium">{t.transactions}</th>
                          <th className="py-2 text-end font-medium">{t.volume}</th>
                          <th className="py-2 text-end font-medium">{t.fees}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rec.breakdown.map((item, i) => {
                          // Handle both new and legacy field names
                          const paymentMethod = item.payment_method || item.method || "unknown"
                          const txCount = item.tx_count ?? item.txCount ?? 0
                          const volume = item.volume ?? 0
                          const feeAmount = item.fee_amount ?? item.cost ?? 0
                          
                          // Skip monthly fee rows or show them differently
                          if (item.isMonthlyFee || paymentMethod === "monthly_fee") {
                            return (
                              <tr key={i} className="border-b last:border-0 bg-muted/30">
                                <td className="py-2 font-medium" colSpan={3}>
                                  {locale === "ar" ? "رسوم شهرية ثابتة" : "Monthly Fixed Fee"}
                                </td>
                                <td className="py-2 text-end font-medium tabular-nums">
                                  <span className="inline-flex items-center gap-0.5">
                                    {formatCurrency(feeAmount)} <SARSymbol size="xs" />
                                  </span>
                                </td>
                              </tr>
                            )
                          }
                          
                          return (
                            <tr key={i} className="border-b last:border-0">
                              <td className="py-2">
                                {paymentMethodNames[locale][paymentMethod as keyof typeof paymentMethodNames.ar] || paymentMethod}
                              </td>
                              <td className="py-2 text-end tabular-nums">
                                {txCount.toLocaleString()}
                              </td>
                              <td className="py-2 text-end tabular-nums">
                                <span className="inline-flex items-center gap-0.5">
                                  {formatCurrency(volume)} <SARSymbol size="xs" />
                                </span>
                              </td>
                              <td className="py-2 text-end font-medium tabular-nums">
                                <span className="inline-flex items-center gap-0.5">
                                  {formatCurrency(feeAmount)} <SARSymbol size="xs" />
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
