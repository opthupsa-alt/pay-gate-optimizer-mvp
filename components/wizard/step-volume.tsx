"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { translations } from "@/lib/translations"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle2 } from "lucide-react"

interface StepVolumeProps {
  monthlyGmv: number
  txCount: number
  onGmvChange: (value: number) => void
  onTxCountChange: (value: number) => void
  locale: "ar" | "en"
}

export function StepVolume({ monthlyGmv, txCount, onGmvChange, onTxCountChange, locale }: StepVolumeProps) {
  const t = translations[locale].wizard.fields
  const isRTL = locale === "ar"
  
  const gmvValid = monthlyGmv >= 1000
  const txValid = txCount >= 10
  const gmvTouched = monthlyGmv > 0
  const txTouched = txCount > 0

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label 
          htmlFor="monthlyGmv"
          className={cn("text-sm sm:text-base", isRTL && "font-arabic")}
        >
          {t.monthlyGmv}
        </Label>
        <div className="relative">
          <Input
            id="monthlyGmv"
            type="number"
            min={1000}
            step={1000}
            value={monthlyGmv || ""}
            onChange={(e) => onGmvChange(Number(e.target.value))}
            placeholder="50000"
            dir="ltr"
            className={cn(
              "h-11 sm:h-10 text-sm sm:text-base ps-4 pe-10 transition-colors",
              gmvTouched && !gmvValid && "border-destructive focus-visible:ring-destructive/20",
              gmvTouched && gmvValid && "border-emerald-500 focus-visible:ring-emerald-500/20"
            )}
          />
          {gmvTouched && (
            <div className="absolute end-3 top-1/2 -translate-y-1/2">
              {gmvValid ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-destructive" />
              )}
            </div>
          )}
        </div>
        {gmvTouched && !gmvValid && (
          <p className={cn(
            "text-xs text-destructive flex items-center gap-1",
            isRTL && "font-arabic"
          )}>
            {isRTL ? "الحد الأدنى 1,000 ريال" : "Minimum 1,000 SAR"}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label 
          htmlFor="txCount"
          className={cn("text-sm sm:text-base", isRTL && "font-arabic")}
        >
          {t.txCount}
        </Label>
        <div className="relative">
          <Input
            id="txCount"
            type="number"
            min={10}
            step={10}
            value={txCount || ""}
            onChange={(e) => onTxCountChange(Number(e.target.value))}
            placeholder="500"
            dir="ltr"
            className={cn(
              "h-11 sm:h-10 text-sm sm:text-base ps-4 pe-10 transition-colors",
              txTouched && !txValid && "border-destructive focus-visible:ring-destructive/20",
              txTouched && txValid && "border-emerald-500 focus-visible:ring-emerald-500/20"
            )}
          />
          {txTouched && (
            <div className="absolute end-3 top-1/2 -translate-y-1/2">
              {txValid ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-destructive" />
              )}
            </div>
          )}
        </div>
        {txTouched && !txValid && (
          <p className={cn(
            "text-xs text-destructive flex items-center gap-1",
            isRTL && "font-arabic"
          )}>
            {isRTL ? "الحد الأدنى 10 معاملات" : "Minimum 10 transactions"}
          </p>
        )}
      </div>
    </div>
  )
}
