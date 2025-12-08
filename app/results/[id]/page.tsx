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

interface Recommendation {
  provider_id: string
  provider_name_ar?: string
  provider_name_en?: string
  expected_cost_min: number
  expected_cost_max: number
  breakdown: Array<{
    payment_method: string
    tx_count: number
    volume: number
    fee_amount: number
  }>
  score_total: number
  score_cost: number
  score_fit: number
  score_ops: number
  score_risk: number
  reasons: string[]
  caveats: string[]
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

export default function ResultsPage() {
  const params = useParams()
  const [data, setData] = useState<ResultData | null>(null)
  const [locale, setLocale] = useState<"ar" | "en">("ar")
  const [isExporting, setIsExporting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  })
  const [isSubmittingLead, setIsSubmittingLead] = useState(false)

  useEffect(() => {
    // Get data from sessionStorage
    const storedData = sessionStorage.getItem(`wizard-result-${params.id}`)
    if (storedData) {
      const parsed = JSON.parse(storedData)
      setData(parsed)
      setLocale(parsed.wizardRun?.locale || "ar")
    }
  }, [params.id])

  const isRTL = locale === "ar"
  const BackArrow = isRTL ? ArrowRight : ArrowLeft

  // Export to PDF function
  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      // Generate PDF content
      const content = generatePDFContent()
      
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
    } catch {
      toast.error(locale === "ar" ? "حدث خطأ أثناء التصدير" : "Error exporting")
    } finally {
      setIsExporting(false)
    }
  }

  // Generate PDF content
  const generatePDFContent = () => {
    if (!data) return ""
    
    const recommendations = data.recommendations.map((rec, index) => `
      <div style="margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h3 style="margin: 0 0 10px 0;">#${index + 1} ${locale === "ar" ? rec.provider_name_ar : rec.provider_name_en}</h3>
        <p style="font-size: 18px; color: #2563eb; margin: 10px 0;">
          ${formatCurrency(rec.expected_cost_min)} - ${formatCurrency(rec.expected_cost_max)} ${locale === "ar" ? "ر.س" : "SAR"}
        </p>
        <p><strong>${locale === "ar" ? "التقييم الإجمالي" : "Total Score"}:</strong> ${Math.round(rec.score_total)}/100</p>
        <p><strong>${locale === "ar" ? "الأسباب" : "Reasons"}:</strong></p>
        <ul>
          ${rec.reasons.map(r => `<li>${r}</li>`).join("")}
        </ul>
      </div>
    `).join("")

    return `
      <!DOCTYPE html>
      <html dir="${isRTL ? 'rtl' : 'ltr'}">
      <head>
        <meta charset="UTF-8">
        <title>PayGate Optimizer - ${locale === "ar" ? "تقرير المقارنة" : "Comparison Report"}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; direction: ${isRTL ? 'rtl' : 'ltr'}; }
          h1 { color: #1e3a8a; margin-bottom: 20px; }
          h2 { color: #374151; margin-top: 30px; }
        </style>
      </head>
      <body>
        <h1>PayGate Optimizer</h1>
        <h2>${locale === "ar" ? "تقرير مقارنة بوابات الدفع" : "Payment Gateway Comparison Report"}</h2>
        <p>${locale === "ar" ? "تاريخ التقرير" : "Report Date"}: ${new Date().toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US")}</p>
        <hr>
        <h2>${locale === "ar" ? "التوصيات" : "Recommendations"}</h2>
        ${recommendations}
        <hr>
        <p style="font-size: 12px; color: #666;">
          ${locale === "ar" 
            ? "هذا التقرير استرشادي فقط. يرجى التحقق من الأسعار والشروط النهائية مباشرة مع مزودي الخدمة." 
            : "This report is for guidance only. Please verify final pricing and terms directly with providers."}
        </p>
      </body>
      </html>
    `
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
      sar: "ر.س",
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
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
                    {formatCurrency(rec.expected_cost_min)} - {formatCurrency(rec.expected_cost_max)} {t.sar}
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
                          <span>{reason}</span>
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
                          <span>{caveat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

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
                        {rec.breakdown.map((item, i) => (
                          <tr key={i} className="border-b last:border-0">
                            <td className="py-2">
                              {paymentMethodNames[locale][item.payment_method as keyof typeof paymentMethodNames.ar] || item.payment_method}
                            </td>
                            <td className="py-2 text-end tabular-nums">{item.tx_count.toLocaleString()}</td>
                            <td className="py-2 text-end tabular-nums">{formatCurrency(item.volume)} {t.sar}</td>
                            <td className="py-2 text-end font-medium tabular-nums">{formatCurrency(item.fee_amount)} {t.sar}</td>
                          </tr>
                        ))}
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
