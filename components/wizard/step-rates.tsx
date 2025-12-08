"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { translations } from "@/lib/translations"
import { HelpCircle } from "lucide-react"
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

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="refundsRate">{t.refundsRate}</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{t.refundsRateHelp}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            id="refundsRate"
            type="number"
            min={0}
            max={100}
            step={0.1}
            value={refundsRate}
            onChange={(e) => onRefundsRateChange(Number(e.target.value))}
            dir="ltr"
          />
          <p className="text-xs text-muted-foreground">{locale === "ar" ? "القيمة الافتراضية: 2%" : "Default: 2%"}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="chargebacksRate">{t.chargebacksRate}</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{t.chargebacksRateHelp}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            id="chargebacksRate"
            type="number"
            min={0}
            max={100}
            step={0.01}
            value={chargebacksRate}
            onChange={(e) => onChargebacksRateChange(Number(e.target.value))}
            dir="ltr"
          />
          <p className="text-xs text-muted-foreground">
            {locale === "ar" ? "القيمة الافتراضية: 0.5%" : "Default: 0.5%"}
          </p>
        </div>
      </div>
    </TooltipProvider>
  )
}
