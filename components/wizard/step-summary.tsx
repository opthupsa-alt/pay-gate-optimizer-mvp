"use client"

import { Card, CardContent } from "@/components/ui/card"
import { translations } from "@/lib/translations"
import type { Sector, WizardFormData, WizardNeeds } from "@/lib/types"
import { Check } from "lucide-react"

interface StepSummaryProps {
  data: WizardFormData
  sectors: Sector[]
  locale: "ar" | "en"
}

export function StepSummary({ data, sectors, locale }: StepSummaryProps) {
  const t = translations[locale].wizard.summary
  const fieldLabels = translations[locale].wizard.fields

  const sector = sectors.find((s) => s.id === data.sector_id)
  const sectorName = sector ? (locale === "ar" ? sector.name_ar : sector.name_en) : "-"

  const businessTypeLabels = {
    individual: fieldLabels.businessTypes.individual,
    company: fieldLabels.businessTypes.company,
    startup: fieldLabels.businessTypes.startup,
    enterprise: fieldLabels.businessTypes.enterprise,
  }

  const formatNumber = (num: number) => num.toLocaleString(locale === "ar" ? "ar-SA" : "en-SA")

  const activeNeeds = Object.entries(data.needs)
    .filter(([, value]) => value)
    .map(([key]) => {
      const needsLabels: Record<keyof WizardNeeds, string> = {
        recurring: fieldLabels.recurring,
        tokenization: fieldLabels.tokenization,
        multi_currency: fieldLabels.multiCurrency,
        international_customers: locale === "ar" ? "عملاء دوليين" : "International Customers",
        plugins_shopify: fieldLabels.pluginsShopify,
        plugins_woocommerce: fieldLabels.pluginsWoocommerce,
        plugins_salla: locale === "ar" ? "سلة" : "Salla",
        plugins_zid: locale === "ar" ? "زد" : "Zid",
        fast_settlement: fieldLabels.fastSettlement,
        apple_pay: fieldLabels.needsApplePay,
        google_pay: fieldLabels.needsGooglePay,
        bnpl_support: locale === "ar" ? "اشتري الآن وادفع لاحقاً" : "Buy Now Pay Later",
      }
      return needsLabels[key as keyof WizardNeeds]
    })

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="grid gap-4 pt-6 sm:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">{t.sector}</p>
            <p className="font-medium">{sectorName}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t.businessType}</p>
            <p className="font-medium">
              {businessTypeLabels[data.business_type as keyof typeof businessTypeLabels] || data.business_type}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t.monthlyVolume}</p>
            <p className="font-medium">
              {formatNumber(data.monthly_gmv)} {t.sar}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t.transactions}</p>
            <p className="font-medium">{formatNumber(data.tx_count)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t.avgTicket}</p>
            <p className="font-medium">
              {formatNumber(data.avg_ticket)} {t.sar}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t.refundsRate}</p>
            <p className="font-medium">{data.refunds_rate}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t.chargebacksRate}</p>
            <p className="font-medium">{data.chargebacks_rate}%</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <p className="mb-3 text-sm text-muted-foreground">{t.paymentMix}</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {Object.entries(data.payment_mix).map(([key, value]) => {
              const labels: Record<string, string> = {
                mada: fieldLabels.mada,
                visa_mc: fieldLabels.visaMc,
                apple_pay: fieldLabels.applePay,
                google_pay: fieldLabels.googlePay,
                other: fieldLabels.other,
              }
              return (
                <div key={key} className="rounded-lg bg-muted px-3 py-2 text-center">
                  <p className="text-xs text-muted-foreground">{labels[key]}</p>
                  <p className="font-semibold">{value}%</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {activeNeeds.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <p className="mb-3 text-sm text-muted-foreground">{t.requirements}</p>
            <div className="flex flex-wrap gap-2">
              {activeNeeds.map((need, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                >
                  <Check className="h-3.5 w-3.5" />
                  {need}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
