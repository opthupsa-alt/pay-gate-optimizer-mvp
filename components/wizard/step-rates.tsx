"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { translations } from "@/lib/translations"
import { cn } from "@/lib/utils"
import { HelpCircle, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface StepRatesProps {
  refundsRate: number
  chargebacksRate: number
  onRefundsRateChange: (value: number) => void
  onChargebacksRateChange: (value: number) => void
  locale: "ar" | "en"
}

export function StepRates({
  refundsRate,
  chargebacksRate,
  onRefundsRateChange,
  onChargebacksRateChange,
  locale,
}: StepRatesProps) {
  const t = translations[locale].wizard.fields
  const isRTL = locale === "ar"
  
  // Visual indicators for rates
  const refundStatus = refundsRate <= 2 ? "good" : refundsRate <= 5 ? "warning" : "bad"
  const chargebackStatus = chargebacksRate <= 0.5 ? "good" : chargebacksRate <= 1 ? "warning" : "bad"

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good": return "border-emerald-500 focus-visible:ring-emerald-500/20"
      case "warning": return "border-amber-500 focus-visible:ring-amber-500/20"
      case "bad": return "border-destructive focus-visible:ring-destructive/20"
      default: return ""
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good": return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      case "warning": return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "bad": return <AlertTriangle className="h-4 w-4 text-destructive" />
      default: return null
    }
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label 
              htmlFor="refundsRate"
              className={cn("text-sm sm:text-base", isRTL && "font-arabic")}
            >
              {t.refundsRate}
            </Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className={cn(isRTL && "font-arabic")}>
                <p className="max-w-xs">{t.refundsRateHelp}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="relative">
            <Input
              id="refundsRate"
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={refundsRate}
              onChange={(e) => onRefundsRateChange(Number(e.target.value))}
              dir="ltr"
              className={cn(
                "h-11 sm:h-10 text-sm sm:text-base ps-4 pe-10 transition-colors",
                getStatusColor(refundStatus)
              )}
            />
            <div className="absolute end-3 top-1/2 -translate-y-1/2">
              {getStatusIcon(refundStatus)}
            </div>
          </div>
          <p className={cn(
            "text-xs text-muted-foreground",
            isRTL && "font-arabic"
          )}>
            {locale === "ar" ? "القيمة الافتراضية: 2%" : "Default: 2%"}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label 
              htmlFor="chargebacksRate"
              className={cn("text-sm sm:text-base", isRTL && "font-arabic")}
            >
              {t.chargebacksRate}
            </Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className={cn(isRTL && "font-arabic")}>
                <p className="max-w-xs">{t.chargebacksRateHelp}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="relative">
            <Input
              id="chargebacksRate"
              type="number"
              min={0}
              max={100}
              step={0.01}
              value={chargebacksRate}
              onChange={(e) => onChargebacksRateChange(Number(e.target.value))}
              dir="ltr"
              className={cn(
                "h-11 sm:h-10 text-sm sm:text-base ps-4 pe-10 transition-colors",
                getStatusColor(chargebackStatus)
              )}
            />
            <div className="absolute end-3 top-1/2 -translate-y-1/2">
              {getStatusIcon(chargebackStatus)}
            </div>
          </div>
          <p className={cn(
            "text-xs text-muted-foreground",
            isRTL && "font-arabic"
          )}>
            {locale === "ar" ? "القيمة الافتراضية: 0.5%" : "Default: 0.5%"}
          </p>
        </div>
      </div>
    </TooltipProvider>
  )
}
