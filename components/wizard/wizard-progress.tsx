"use client"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface WizardProgressProps {
  currentStep: number
  totalSteps: number
  locale: "ar" | "en"
}

export function WizardProgress({ currentStep, totalSteps, locale }: WizardProgressProps) {
  const isRTL = locale === "ar"

  return (
    <div className="mb-6 sm:mb-8 px-2 sm:px-0">
      {/* Progress bar for mobile */}
      <div className="sm:hidden mb-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span className={cn(isRTL && "font-arabic")}>
            {isRTL ? `الخطوة ${currentStep} من ${totalSteps}` : `Step ${currentStep} of ${totalSteps}`}
          </span>
          <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step indicators for tablet and desktop */}
      <div className="hidden sm:flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={cn(
                "flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full border-2 text-xs md:text-sm font-medium transition-colors shrink-0",
                step < currentStep
                  ? "border-primary bg-primary text-primary-foreground"
                  : step === currentStep
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-muted-foreground/30 text-muted-foreground",
              )}
            >
              {step < currentStep ? <Check className="h-4 w-4 md:h-5 md:w-5" /> : step}
            </div>
            {step < totalSteps && (
              <div
                className={cn(
                  "h-0.5 w-4 sm:w-6 md:w-10 lg:w-16 xl:w-20 transition-colors",
                  step < currentStep ? "bg-primary" : "bg-muted-foreground/30",
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
