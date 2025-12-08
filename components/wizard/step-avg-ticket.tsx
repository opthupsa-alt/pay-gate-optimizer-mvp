"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { translations } from "@/lib/translations"
import { Calculator } from "lucide-react"

interface StepAvgTicketProps {
  avgTicket: number
  monthlyGmv: number
  txCount: number
  onAvgTicketChange: (value: number) => void
  locale: "ar" | "en"
}

export function StepAvgTicket({ avgTicket, monthlyGmv, txCount, onAvgTicketChange, locale }: StepAvgTicketProps) {
  const t = translations[locale].wizard.fields

  const calculatedAvg = txCount > 0 ? Math.round(monthlyGmv / txCount) : 0

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="avgTicket">{t.avgTicket}</Label>
        <Input
          id="avgTicket"
          type="number"
          min={1}
          step={1}
          value={avgTicket || ""}
          onChange={(e) => onAvgTicketChange(Number(e.target.value))}
          placeholder={String(calculatedAvg || 100)}
          dir="ltr"
        />
      </div>

      {calculatedAvg > 0 && (
        <div className="flex items-start gap-3 rounded-lg border bg-muted/50 p-4">
          <Calculator className="mt-0.5 h-5 w-5 text-muted-foreground" />
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{t.avgTicketNote}</p>
            <p className="text-lg font-semibold">
              {calculatedAvg.toLocaleString(locale === "ar" ? "ar-SA" : "en-SA")} {locale === "ar" ? "ريال" : "SAR"}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
