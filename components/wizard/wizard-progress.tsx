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
    <div className="mb-8 md:mb-10">
      {/* Progress bar for mobile */}
      <div className="lg:hidden mb-6">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <span className={cn("font-medium", isRTL && "font-arabic")}>
            {isRTL ? `الخطوة ${currentStep} من ${totalSteps}` : `Step ${currentStep} of ${totalSteps}`}
          </span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            {Math.round((currentStep / totalSteps) * 100)}%
          </span>
        </div>
        <div className="h-3 w-full bg-muted rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500 ease-out rounded-full relative"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          >
            <div className="absolute inset-0 bg-white/20" />
          </div>
        </div>
      </div>

      {/* Step indicators for desktop - improved spacing */}
      <div className="hidden lg:flex items-center justify-center">
        <div className="flex items-center">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={cn(
                  "flex h-10 w-10 xl:h-12 xl:w-12 items-center justify-center rounded-full border-2 text-sm xl:text-base font-semibold transition-all duration-300 shrink-0",
                  step < currentStep
                    ? "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                    : step === currentStep
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 ring-4 ring-emerald-500/20 scale-110"
                      : "border-muted-foreground/30 text-muted-foreground bg-background hover:border-muted-foreground/50",
                )}
              >
                {step < currentStep ? <Check className="h-5 w-5 xl:h-6 xl:w-6" strokeWidth={2.5} /> : step}
              </div>
              {step < totalSteps && (
                <div
                  className={cn(
                    "h-1 w-8 md:w-12 lg:w-16 xl:w-20 transition-all duration-300 rounded-full mx-1",
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
    </div>
  )
}
