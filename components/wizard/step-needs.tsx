"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { translations } from "@/lib/translations"
import type { WizardNeeds } from "@/lib/types"
import { RefreshCcw, CreditCard, Globe, ShoppingBag, Zap, Smartphone, Users, Wallet } from "lucide-react"

interface StepNeedsProps {
  needs: WizardNeeds
  onNeedsChange: (needs: WizardNeeds) => void
  locale: "ar" | "en"
}

export function StepNeeds({ needs, onNeedsChange, locale }: StepNeedsProps) {
  const t = translations[locale].wizard.fields

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

  return (
    <div className="space-y-6">
      {/* Core Features */}
      <div>
        <Label className="text-base font-semibold mb-3 block">
          {locale === "ar" ? "الميزات الأساسية" : "Core Features"}
        </Label>
        <div className="space-y-3">
          {coreFeatures.map((feature) => (
            <div key={feature.key} className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start gap-3">
                <feature.icon className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <span className="font-medium block">{feature.label}</span>
                  <span className="text-sm text-muted-foreground">{feature.description}</span>
                </div>
              </div>
              <Switch checked={needs[feature.key] || false} onCheckedChange={() => handleToggle(feature.key)} />
            </div>
          ))}
        </div>
      </div>

      {/* Platform Integrations */}
      <div>
        <Label className="text-base font-semibold mb-3 block">
          {locale === "ar" ? "تكاملات المنصات" : "Platform Integrations"}
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {platformFeatures.map((feature) => (
            <div key={feature.key} className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <feature.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{feature.label}</span>
              </div>
              <Switch 
                checked={needs[feature.key] || false} 
                onCheckedChange={() => handleToggle(feature.key)} 
              />
            </div>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div>
        <Label className="text-base font-semibold mb-3 block">
          {locale === "ar" ? "طرق الدفع المطلوبة" : "Required Payment Methods"}
        </Label>
        <div className="space-y-3">
          {paymentFeatures.map((feature) => (
            <div key={feature.key} className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start gap-3">
                <feature.icon className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <span className="font-medium block">{feature.label}</span>
                  <span className="text-sm text-muted-foreground">{feature.description}</span>
                </div>
              </div>
              <Switch checked={needs[feature.key] || false} onCheckedChange={() => handleToggle(feature.key)} />
            </div>
          ))}
        </div>
      </div>

      {/* International */}
      <div>
        <Label className="text-base font-semibold mb-3 block">
          {locale === "ar" ? "العملاء الدوليون" : "International"}
        </Label>
        <div className="space-y-3">
          {internationalFeatures.map((feature) => (
            <div key={feature.key} className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start gap-3">
                <feature.icon className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <span className="font-medium block">{feature.label}</span>
                  <span className="text-sm text-muted-foreground">{feature.description}</span>
                </div>
              </div>
              <Switch checked={needs[feature.key] || false} onCheckedChange={() => handleToggle(feature.key)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
