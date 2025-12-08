"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { translations } from "@/lib/translations"
import type { Sector } from "@/lib/types"
import { cn } from "@/lib/utils"

interface StepSectorProps {
  sectors: Sector[]
  sectorId: string
  businessType: string
  onSectorChange: (value: string) => void
  onBusinessTypeChange: (value: string) => void
  locale: "ar" | "en"
}

export function StepSector({
  sectors,
  sectorId,
  businessType,
  onSectorChange,
  onBusinessTypeChange,
  locale,
}: StepSectorProps) {
  const isRTL = locale === "ar"
  const t = translations[locale].wizard.fields

  const businessTypes = [
    { value: "individual", label: t.businessTypes.individual },
    { value: "company", label: t.businessTypes.company },
    { value: "startup", label: t.businessTypes.startup },
    { value: "enterprise", label: t.businessTypes.enterprise },
  ]

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="space-y-2">
        <Label 
          htmlFor="sector"
          className={cn("text-sm sm:text-base", isRTL && "font-arabic")}
        >
          {t.sector}
        </Label>
        <Select value={sectorId} onValueChange={onSectorChange}>
          <SelectTrigger 
            id="sector" 
            className={cn(
              "h-11 sm:h-10 text-sm sm:text-base",
              isRTL && "font-arabic text-right"
            )}
          >
            <SelectValue 
              placeholder={t.selectSector} 
              className={cn(isRTL && "font-arabic")}
            />
          </SelectTrigger>
          <SelectContent className={cn(isRTL && "font-arabic")}>
            {sectors.map((sector) => (
              <SelectItem 
                key={sector.id} 
                value={sector.id}
                className={cn("text-sm sm:text-base", isRTL && "text-right")}
              >
                {locale === "ar" ? sector.name_ar : sector.name_en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className={cn("text-sm sm:text-base", isRTL && "font-arabic")}>
          {t.businessType}
        </Label>
        <RadioGroup 
          value={businessType} 
          onValueChange={onBusinessTypeChange} 
          className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3"
        >
          {businessTypes.map((type) => (
            <div key={type.value}>
              <RadioGroupItem value={type.value} id={type.value} className="peer sr-only" />
              <Label
                htmlFor={type.value}
                className={cn(
                  "flex cursor-pointer items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 sm:p-4",
                  "text-sm sm:text-base font-medium transition-all",
                  "hover:bg-accent hover:text-accent-foreground hover:border-accent",
                  "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5",
                  "[&:has([data-state=checked])]:border-primary",
                  isRTL && "font-arabic"
                )}
              >
                {type.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  )
}
