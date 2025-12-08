"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { PhoneInput, type PhoneInputValue } from "@/components/ui/phone-input"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, User, Building2, Briefcase, Shield, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ContactData {
  fullName: string
  companyName: string
  sector: string
  phone: PhoneInputValue
}

interface StepContactProps {
  contactData: ContactData
  onContactDataChange: (data: ContactData) => void
  sectorName?: string // Pre-filled from wizard sector selection
  locale: "ar" | "en"
}

export function StepContact({
  contactData,
  onContactDataChange,
  sectorName,
  locale,
}: StepContactProps) {
  const isRTL = locale === "ar"

  const t = {
    ar: {
      title: "احصل على تقريرك المفصّل",
      subtitle: "أدخل بياناتك لاستلام نتائج المقارنة عبر الواتساب",
      fullName: "الاسم الثلاثي",
      fullNamePlaceholder: "مثال: محمد أحمد العلي",
      companyName: "اسم النشاط / الشركة",
      companyNamePlaceholder: "مثال: متجر الإلكترونيات",
      sector: "مجال النشاط",
      sectorPlaceholder: "مثال: تجارة إلكترونية",
      whatsapp: "رقم الواتساب",
      whatsappPlaceholder: "05XXXXXXXX",
      benefits: [
        "تقرير PDF مفصّل بنتائج المقارنة",
        "ملخص سريع لأفضل الخيارات",
        "رابط مباشر للمنصة للمراجعة لاحقاً",
      ],
      privacy: "بياناتك محمية ولن نشاركها مع أي طرف ثالث",
      note: "سنرسل لك ملف النتائج التفصيلي على الواتساب بالإضافة لملخص سريع ورابط المنصة.",
    },
    en: {
      title: "Get Your Detailed Report",
      subtitle: "Enter your details to receive comparison results via WhatsApp",
      fullName: "Full Name",
      fullNamePlaceholder: "e.g., Mohammed Ahmed Ali",
      companyName: "Business / Company Name",
      companyNamePlaceholder: "e.g., Electronics Store",
      sector: "Business Sector",
      sectorPlaceholder: "e.g., E-commerce",
      whatsapp: "WhatsApp Number",
      whatsappPlaceholder: "05XXXXXXXX",
      benefits: [
        "Detailed PDF report with comparison results",
        "Quick summary of best options",
        "Direct link to platform for later review",
      ],
      privacy: "Your data is protected and will not be shared with third parties",
      note: "We will send you the detailed results file on WhatsApp along with a quick summary and platform link.",
    },
  }

  const text = t[locale]

  const handleChange = (field: keyof ContactData, value: string | PhoneInputValue) => {
    onContactDataChange({
      ...contactData,
      [field]: value,
    })
  }

  return (
    <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* WhatsApp Benefit Card */}
      <Card className="border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/20">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900">
              <MessageCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className={cn(
                "text-sm font-medium text-emerald-800 dark:text-emerald-200",
                isRTL && "font-arabic"
              )}>
                {text.note}
              </p>
              <ul className="mt-3 space-y-2">
                {text.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span className={isRTL ? "font-arabic" : ""}>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Full Name */}
        <div className="space-y-2">
          <Label 
            htmlFor="fullName" 
            className={cn("flex items-center gap-2", isRTL && "font-arabic")}
          >
            <User className="h-4 w-4" />
            {text.fullName}
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id="fullName"
            value={contactData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder={text.fullNamePlaceholder}
            className={cn("h-11", isRTL && "font-arabic text-right")}
            dir={isRTL ? "rtl" : "ltr"}
          />
        </div>

        {/* Company Name */}
        <div className="space-y-2">
          <Label 
            htmlFor="companyName" 
            className={cn("flex items-center gap-2", isRTL && "font-arabic")}
          >
            <Building2 className="h-4 w-4" />
            {text.companyName}
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id="companyName"
            value={contactData.companyName}
            onChange={(e) => handleChange("companyName", e.target.value)}
            placeholder={text.companyNamePlaceholder}
            className={cn("h-11", isRTL && "font-arabic text-right")}
            dir={isRTL ? "rtl" : "ltr"}
          />
        </div>

        {/* Sector */}
        <div className="space-y-2">
          <Label 
            htmlFor="sector" 
            className={cn("flex items-center gap-2", isRTL && "font-arabic")}
          >
            <Briefcase className="h-4 w-4" />
            {text.sector}
          </Label>
          <Input
            id="sector"
            value={contactData.sector || sectorName || ""}
            onChange={(e) => handleChange("sector", e.target.value)}
            placeholder={text.sectorPlaceholder}
            className={cn("h-11", isRTL && "font-arabic text-right")}
            dir={isRTL ? "rtl" : "ltr"}
          />
        </div>

        {/* WhatsApp Number */}
        <div className="space-y-2">
          <Label 
            htmlFor="whatsapp" 
            className={cn("flex items-center gap-2", isRTL && "font-arabic")}
          >
            <MessageCircle className="h-4 w-4" />
            {text.whatsapp}
            <span className="text-destructive">*</span>
          </Label>
          <PhoneInput
            value={contactData.phone}
            onChange={(value) => handleChange("phone", value)}
            locale={locale}
            placeholder={text.whatsappPlaceholder}
          />
        </div>
      </div>

      {/* Privacy Note */}
      <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
        <Shield className="h-4 w-4 shrink-0" />
        <p className={isRTL ? "font-arabic" : ""}>{text.privacy}</p>
      </div>
    </div>
  )
}

export default StepContact
