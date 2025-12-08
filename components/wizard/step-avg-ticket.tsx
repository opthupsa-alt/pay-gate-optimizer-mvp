"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { translations } from "@/lib/translations"
import { cn } from "@/lib/utils"
import { Calculator, CheckCircle2, AlertCircle } from "lucide-react"

interface StepAvgTicketProps {
  avgTicket: number
  monthlyGmv: number
  txCount: number
  onAvgTicketChange: (value: number) => void
  locale: "ar" | "en"
}

export function StepAvgTicket({ avgTicket, monthlyGmv, txCount, onAvgTicketChange, locale }: StepAvgTicketProps) {
  const t = translations[locale].wizard.fields
  const isRTL = locale === "ar"

  const calculatedAvg = txCount > 0 ? Math.round(monthlyGmv / txCount) : 0
  const isValid = avgTicket > 0
  const isTouched = avgTicket > 0

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label 
          htmlFor="avgTicket"
          className={cn("text-sm sm:text-base", isRTL && "font-arabic")}
        >
          {t.avgTicket}
        </Label>
        <div className="relative">
          <Input
            id="avgTicket"
            type="number"
            min={1}
            step={1}
            value={avgTicket || ""}
            onChange={(e) => onAvgTicketChange(Number(e.target.value))}
            placeholder={String(calculatedAvg || 100)}
            dir="ltr"
            className={cn(
              "h-11 sm:h-10 text-sm sm:text-base pe-10 transition-colors",
              isTouched && isValid && "border-emerald-500 focus-visible:ring-emerald-500/20"
            )}
          />
          {isTouched && isValid && (
            <div className="absolute end-3 top-1/2 -translate-y-1/2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
          )}
        </div>
      </div>

      {calculatedAvg > 0 && (
        <div className="flex items-start gap-3 rounded-lg border bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 p-4 transition-all">
          <Calculator className="mt-0.5 h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <div className="space-y-1">
            <p className={cn(
              "text-sm text-emerald-700 dark:text-emerald-300",
              isRTL && "font-arabic"
            )}>
              {t.avgTicketNote}
            </p>
            <p className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">
              {calculatedAvg.toLocaleString(locale === "ar" ? "ar-SA" : "en-SA")} {locale === "ar" ? "ريال" : "SAR"}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
