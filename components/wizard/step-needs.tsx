"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { translations } from "@/lib/translations"
import { cn } from "@/lib/utils"
import type { WizardNeeds } from "@/lib/types"
import { RefreshCcw, CreditCard, Globe, ShoppingBag, Zap, Smartphone, Users, Wallet } from "lucide-react"

interface StepNeedsProps {
  needs: WizardNeeds
  onNeedsChange: (needs: WizardNeeds) => void
  locale: "ar" | "en"
}

export function StepNeeds({ needs, onNeedsChange, locale }: StepNeedsProps) {
  const t = translations[locale].wizard.fields
  const isRTL = locale === "ar"

  const handleToggle = (key: keyof WizardNeeds) => {
    onNeedsChange({ ...needs, [key]: !needs[key] })
  }

  // Core Features
  const coreFeatures = [
    { key: "recurring" as const, label: t.recurring, icon: RefreshCcw, description: locale === "ar" ? "للاشتراكات والدفعات الدورية" : "For subscriptions and recurring payments" },
    { key: "tokenization" as const, label: t.tokenization, icon: CreditCard, description: locale === "ar" ? "حفظ بيانات البطاقة لدفعات أسرع" : "Save card data for faster payments" },
    { key: "multi_currency" as const, label: t.multiCurrency, icon: Globe, description: locale === "ar" ? "قبول عملات أخرى غير الريال" : "Accept currencies other than SAR" },
    { key: "fast_settlement" as const, label: t.fastSettlement, icon: Zap, description: locale === "ar" ? "تحويل الأرباح خلال 1-2 يوم" : "Receive funds within 1-2 days" },
  ]

  // Platform Integrations
  const platformFeatures = [
    { key: "plugins_shopify" as const, label: t.pluginsShopify, icon: ShoppingBag, description: locale === "ar" ? "تكامل مع متجر Shopify" : "Integration with Shopify store" },
    { key: "plugins_woocommerce" as const, label: t.pluginsWoocommerce, icon: ShoppingBag, description: locale === "ar" ? "تكامل مع متجر WooCommerce" : "Integration with WooCommerce store" },
    { key: "plugins_salla" as const, label: locale === "ar" ? "تكامل سلة" : "Salla Integration", icon: ShoppingBag, description: locale === "ar" ? "تكامل مع منصة سلة" : "Integration with Salla platform" },
    { key: "plugins_zid" as const, label: locale === "ar" ? "تكامل زد" : "Zid Integration", icon: ShoppingBag, description: locale === "ar" ? "تكامل مع منصة زد" : "Integration with Zid platform" },
  ]

  // Payment Methods
  const paymentFeatures = [
    { key: "apple_pay" as const, label: t.needsApplePay, icon: Smartphone, description: locale === "ar" ? "دفع بـ Apple Pay" : "Accept Apple Pay" },
    { key: "google_pay" as const, label: t.needsGooglePay, icon: Smartphone, description: locale === "ar" ? "دفع بـ Google Pay" : "Accept Google Pay" },
    { key: "bnpl_support" as const, label: locale === "ar" ? "اشتر الآن ادفع لاحقاً" : "Buy Now Pay Later", icon: Wallet, description: locale === "ar" ? "تابي، تمارا، وغيرها" : "Tabby, Tamara, and others" },
  ]

  // International
  const internationalFeatures = [
    { key: "international_customers" as const, label: locale === "ar" ? "عملاء دوليون" : "International Customers", icon: Users, description: locale === "ar" ? "استهداف عملاء من خارج السعودية" : "Target customers outside Saudi Arabia" },
  ]

  // Define feature type for reusability
  type FeatureType = {
    key: keyof WizardNeeds
    label: string
    icon: typeof RefreshCcw
    description: string
  }

  const FeatureItem = ({ feature, compact = false }: { feature: FeatureType, compact?: boolean }) => {
    const isActive = needs[feature.key] || false
    
    return (
      <div 
        dir={isRTL ? "rtl" : "ltr"}
        className={cn(
          "flex items-center justify-between rounded-lg border transition-all duration-200 cursor-pointer",
          // Mobile-optimized padding and touch targets
          compact ? "p-3 min-h-[52px]" : "p-3 sm:p-4 min-h-[60px]",
          isActive 
            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 shadow-sm" 
            : "hover:bg-muted/50 hover:border-muted-foreground/30 active:bg-muted/70"
        )}
        onClick={() => handleToggle(feature.key)}
      >
        <div className={cn("flex items-start gap-2 sm:gap-3", compact && "items-center")}>
          <feature.icon className={cn(
            "shrink-0",
            compact ? "h-5 w-5" : "h-5 w-5 sm:h-5 sm:w-5 mt-0.5",
            isActive ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
          )} />
          <div className="flex-1">
            <span className={cn(
              "font-medium block text-sm sm:text-base leading-tight",
              isRTL && "font-arabic",
              isActive && "text-emerald-800 dark:text-emerald-200"
            )}>
              {feature.label}
            </span>
            {!compact && (
              <span className={cn(
                "text-xs sm:text-sm leading-snug mt-0.5 block",
                isRTL && "font-arabic",
                isActive ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
              )}>
                {feature.description}
              </span>
            )}
          </div>
        </div>
        <Switch 
          checked={isActive} 
          onCheckedChange={() => handleToggle(feature.key)}
          onClick={(e) => e.stopPropagation()}
          className="shrink-0 ms-2"
        />
      </div>
    )
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Core Features */}
      <div>
        <Label className={cn(
          "text-sm sm:text-base font-semibold mb-2.5 sm:mb-3 block",
          isRTL && "font-arabic"
        )}>
          {locale === "ar" ? "الميزات الأساسية" : "Core Features"}
        </Label>
        <div className="space-y-2.5 sm:space-y-3">
          {coreFeatures.map((feature) => (
            <FeatureItem key={feature.key} feature={feature} />
          ))}
        </div>
      </div>

      {/* Platform Integrations */}
      <div>
        <Label className={cn(
          "text-sm sm:text-base font-semibold mb-2.5 sm:mb-3 block",
          isRTL && "font-arabic"
        )}>
          {locale === "ar" ? "تكاملات المنصات" : "Platform Integrations"}
        </Label>
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2.5 sm:gap-3">
          {platformFeatures.map((feature) => (
            <FeatureItem key={feature.key} feature={feature} compact />
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div>
        <Label className={cn(
          "text-sm sm:text-base font-semibold mb-2.5 sm:mb-3 block",
          isRTL && "font-arabic"
        )}>
          {locale === "ar" ? "طرق الدفع المطلوبة" : "Required Payment Methods"}
        </Label>
        <div className="space-y-2.5 sm:space-y-3">
          {paymentFeatures.map((feature) => (
            <FeatureItem key={feature.key} feature={feature} />
          ))}
        </div>
      </div>

      {/* International */}
      <div>
        <Label className={cn(
          "text-sm sm:text-base font-semibold mb-2.5 sm:mb-3 block",
          isRTL && "font-arabic"
        )}>
          {locale === "ar" ? "العملاء الدوليون" : "International"}
        </Label>
        <div className="space-y-2.5 sm:space-y-3">
          {internationalFeatures.map((feature) => (
            <FeatureItem key={feature.key} feature={feature} />
          ))}
        </div>
      </div>
    </div>
  )
}
