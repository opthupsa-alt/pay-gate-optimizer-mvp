"use client"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { translations } from "@/lib/translations"
import type { PaymentMix } from "@/lib/types"
import { cn } from "@/lib/utils"

interface StepPaymentMixProps {
  paymentMix: PaymentMix
  onPaymentMixChange: (mix: PaymentMix) => void
  locale: "ar" | "en"
}

export function StepPaymentMix({ paymentMix, onPaymentMixChange, locale }: StepPaymentMixProps) {
  const t = translations[locale].wizard.fields
  const validation = translations[locale].wizard.validation

  const total = Object.values(paymentMix).reduce((sum, val) => sum + val, 0)
  const isValid = total === 100

  const handleChange = (key: keyof PaymentMix, value: number) => {
    onPaymentMixChange({ ...paymentMix, [key]: value })
  }

  const methods = [
    { key: "mada" as const, label: t.mada, color: "bg-emerald-500" },
    { key: "visa_mc" as const, label: t.visaMc, color: "bg-blue-500" },
    { key: "apple_pay" as const, label: t.applePay, color: "bg-zinc-800" },
    { key: "google_pay" as const, label: t.googlePay, color: "bg-amber-500" },
    { key: "other" as const, label: t.other, color: "bg-gray-400" },
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Label>{t.paymentMix}</Label>
        <p className="text-sm text-muted-foreground">{t.paymentMixNote}</p>
      </div>

      {/* Visual distribution bar */}
      <div className="h-4 overflow-hidden rounded-full bg-muted">
        <div className="flex h-full">
          {methods.map((method) => (
            <div
              key={method.key}
              className={cn(method.color, "transition-all duration-300")}
              style={{ width: `${paymentMix[method.key]}%` }}
            />
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-4">
        {methods.map((method) => (
          <div key={method.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn("h-3 w-3 rounded-full", method.color)} />
                <Label className="text-sm">{method.label}</Label>
              </div>
              <span className="text-sm font-medium">{paymentMix[method.key]}%</span>
            </div>
            <Slider
              value={[paymentMix[method.key]]}
              onValueChange={([value]) => handleChange(method.key, value)}
              max={100}
              step={5}
            />
          </div>
        ))}
      </div>

      {/* Total indicator */}
      <div
        className={cn(
          "rounded-lg border p-3 text-center text-sm font-medium",
          isValid
            ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
            : "border-destructive/50 bg-destructive/10 text-destructive",
        )}
      >
        {locale === "ar" ? `المجموع: ${total}%` : `Total: ${total}%`}
        {!isValid && ` - ${validation.paymentMixSum}`}
      </div>
    </div>
  )
}
