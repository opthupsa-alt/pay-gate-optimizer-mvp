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
          <span className="font-medium text-emerald-600 dark:text-emerald-400">
            {Math.round((currentStep / totalSteps) * 100)}%
          </span>
        </div>
        <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500 ease-out rounded-full relative"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Step indicators for tablet and desktop */}
      <div className="hidden sm:flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={cn(
                "flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full border-2 text-xs md:text-sm font-medium transition-all duration-300 shrink-0",
                step < currentStep
                  ? "border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                  : step === currentStep
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 ring-4 ring-emerald-500/20"
                    : "border-muted-foreground/30 text-muted-foreground bg-background",
              )}
            >
              {step < currentStep ? <Check className="h-4 w-4 md:h-5 md:w-5" strokeWidth={2.5} /> : step}
            </div>
            {step < totalSteps && (
              <div
                className={cn(
                  "h-0.5 w-4 sm:w-6 md:w-10 lg:w-16 xl:w-20 transition-all duration-300",
                  step < currentStep 
                    ? "bg-emerald-500" 
                    : "bg-muted-foreground/20",
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
