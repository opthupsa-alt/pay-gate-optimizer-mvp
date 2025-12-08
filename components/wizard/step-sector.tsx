"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { translations } from "@/lib/translations"
import type { Sector } from "@/lib/types"
import { cn } from "@/lib/utils"
import { 
  ShoppingCart, 
  GraduationCap, 
  Store, 
  Stethoscope, 
  UtensilsCrossed, 
  ShoppingBag, 
  Wrench, 
  Plane,
  Building2,
  Briefcase,
  Rocket,
  Factory,
  Globe,
  Laptop,
  HeartPulse,
  Coffee,
  Car,
  Home,
  Banknote,
  type LucideIcon
} from "lucide-react"

interface StepSectorProps {
  sectors: Sector[]
  sectorId: string
  businessType: string
  onSectorChange: (value: string) => void
  onBusinessTypeChange: (value: string) => void
  locale: "ar" | "en"
}

// Map sector codes to icons
const sectorIcons: Record<string, LucideIcon> = {
  ecommerce: ShoppingCart,
  education: GraduationCap,
  marketplace: Store,
  healthcare: Stethoscope,
  restaurants: UtensilsCrossed,
  retail: ShoppingBag,
  services: Wrench,
  travel: Plane,
  technology: Laptop,
  finance: Banknote,
  automotive: Car,
  realestate: Home,
  hospitality: Coffee,
  medical: HeartPulse,
  // Default fallback
  default: Globe,
}

// Get icon for a sector based on code or name
function getSectorIcon(sector: Sector): LucideIcon {
  const code = sector.code?.toLowerCase() || ""
  const nameEn = sector.name_en?.toLowerCase() || ""
  
  // Try exact match first
  if (sectorIcons[code]) return sectorIcons[code]
  
  // Try partial matches
  if (nameEn.includes("commerce") || nameEn.includes("ecommerce")) return ShoppingCart
  if (nameEn.includes("education") || nameEn.includes("training")) return GraduationCap
  if (nameEn.includes("market")) return Store
  if (nameEn.includes("health") || nameEn.includes("medical")) return Stethoscope
  if (nameEn.includes("restaurant") || nameEn.includes("food")) return UtensilsCrossed
  if (nameEn.includes("retail")) return ShoppingBag
  if (nameEn.includes("service")) return Wrench
  if (nameEn.includes("travel") || nameEn.includes("tourism")) return Plane
  if (nameEn.includes("tech")) return Laptop
  if (nameEn.includes("finance") || nameEn.includes("banking")) return Banknote
  
  return Globe
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
    { value: "individual", label: t.businessTypes.individual, icon: Building2 },
    { value: "company", label: t.businessTypes.company, icon: Briefcase },
    { value: "startup", label: t.businessTypes.startup, icon: Rocket },
    { value: "enterprise", label: t.businessTypes.enterprise, icon: Factory },
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Sector Selection - Cards Grid */}
      <div className="space-y-3">
        <Label 
          className={cn("text-sm sm:text-base font-semibold", isRTL && "font-arabic")}
        >
          {t.sector}
        </Label>
        <RadioGroup 
          value={sectorId} 
          onValueChange={onSectorChange}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
        >
          {sectors.map((sector) => {
            const Icon = getSectorIcon(sector)
            const isSelected = sectorId === sector.id
            const sectorName = locale === "ar" ? sector.name_ar : sector.name_en
            
            return (
              <div key={sector.id}>
                <RadioGroupItem 
                  value={sector.id} 
                  id={`sector-${sector.id}`} 
                  className="peer sr-only" 
                />
                <Label
                  htmlFor={`sector-${sector.id}`}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 sm:gap-3 cursor-pointer",
                    "rounded-xl border-2 bg-card p-4 sm:p-5 min-h-[100px] sm:min-h-[120px]",
                    "text-center transition-all duration-200",
                    "hover:bg-accent/50 hover:border-primary/50 hover:shadow-md",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    isSelected 
                      ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/20" 
                      : "border-muted",
                    isRTL && "font-arabic"
                  )}
                >
                  <Icon className={cn(
                    "h-7 w-7 sm:h-8 sm:w-8 transition-colors",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )} />
                  <span className={cn(
                    "text-xs sm:text-sm font-medium leading-tight",
                    isSelected ? "text-primary" : "text-foreground"
                  )}>
                    {sectorName}
                  </span>
                </Label>
              </div>
            )
          })}
        </RadioGroup>
      </div>

      {/* Business Type Selection - Enhanced Cards */}
      <div className="space-y-3">
        <Label className={cn("text-sm sm:text-base font-semibold", isRTL && "font-arabic")}>
          {t.businessType}
        </Label>
        <RadioGroup 
          value={businessType} 
          onValueChange={onBusinessTypeChange} 
          className="grid grid-cols-2 gap-3"
        >
          {businessTypes.map((type) => {
            const isSelected = businessType === type.value
            const Icon = type.icon
            
            return (
              <div key={type.value}>
                <RadioGroupItem 
                  value={type.value} 
                  id={`business-${type.value}`} 
                  className="peer sr-only" 
                />
                <Label
                  htmlFor={`business-${type.value}`}
                  className={cn(
                    "flex items-center gap-3 cursor-pointer",
                    "rounded-xl border-2 bg-card p-4 sm:p-5",
                    "text-sm sm:text-base font-medium transition-all duration-200",
                    "hover:bg-accent/50 hover:border-primary/50 hover:shadow-md",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    isSelected 
                      ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/20" 
                      : "border-muted",
                    isRTL && "font-arabic"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 sm:h-6 sm:w-6 shrink-0 transition-colors",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )} />
                  <span className={cn(
                    isSelected ? "text-primary" : "text-foreground"
                  )}>
                    {type.label}
                  </span>
                </Label>
              </div>
            )
          })}
        </RadioGroup>
      </div>
    </div>
  )
}
