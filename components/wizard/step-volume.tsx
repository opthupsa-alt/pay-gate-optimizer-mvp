"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { translations } from "@/lib/translations"

interface StepVolumeProps {
  monthlyGmv: number
  txCount: number
  onGmvChange: (value: number) => void
  onTxCountChange: (value: number) => void
  locale: "ar" | "en"
}

export function StepVolume({ monthlyGmv, txCount, onGmvChange, onTxCountChange, locale }: StepVolumeProps) {
  const t = translations[locale].wizard.fields

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="monthlyGmv">{t.monthlyGmv}</Label>
        <Input
          id="monthlyGmv"
          type="number"
          min={1000}
          step={1000}
          value={monthlyGmv || ""}
          onChange={(e) => onGmvChange(Number(e.target.value))}
          placeholder="50000"
          dir="ltr"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="txCount">{t.txCount}</Label>
        <Input
          id="txCount"
          type="number"
          min={10}
          step={10}
          value={txCount || ""}
          onChange={(e) => onTxCountChange(Number(e.target.value))}
          placeholder="500"
          dir="ltr"
        />
      </div>
    </div>
  )
}
