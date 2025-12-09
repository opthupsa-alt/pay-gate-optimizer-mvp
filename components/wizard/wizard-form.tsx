"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WizardProgress } from "./wizard-progress"
import { StepSector } from "./step-sector"
import { StepVolume } from "./step-volume"
import { StepAvgTicket } from "./step-avg-ticket"
import { StepPaymentMix } from "./step-payment-mix"
import { StepRates } from "./step-rates"
import { StepNeeds } from "./step-needs"
import { StepSummary } from "./step-summary"
import { StepContact, type ContactData } from "./step-contact"
import { translations } from "@/lib/translations"
import type { Sector, WizardFormData, PaymentMix, WizardNeeds, WizardContactData } from "@/lib/types"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface WizardFormProps {
  sectors: Sector[]
  locale: "ar" | "en"
}

const TOTAL_STEPS = 8

const defaultPaymentMix: PaymentMix = {
  mada: 60,
  visa_mc: 25,
  apple_pay: 10,
  google_pay: 5,
  other: 0,
}

const defaultNeeds: WizardNeeds = {
  recurring: false,
  tokenization: false,
  multi_currency: false,
  plugins_shopify: false,
  plugins_woocommerce: false,
  fast_settlement: false,
  apple_pay: false,
  google_pay: false,
}

const defaultContact: WizardContactData = {
  fullName: "",
  companyName: "",
  sector: "",
  phone: {
    raw: "",
    normalized: "",
    countryCode: "966",
    isValid: false,
  },
}

export function WizardForm({ sectors, locale }: WizardFormProps) {
  const router = useRouter()
  const isRTL = locale === "ar"
  const t = translations[locale].wizard

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<WizardFormData>({
    sector_id: "",
    business_type: "company",
    monthly_gmv: 0,
    tx_count: 0,
    avg_ticket: 0,
    payment_mix: defaultPaymentMix,
    refunds_rate: 2,
    chargebacks_rate: 0.5,
    needs: defaultNeeds,
    contact: defaultContact,
    locale,
  })

  const updateFormData = <K extends keyof WizardFormData>(key: K, value: WizardFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const validateStep = (): boolean => {
    switch (currentStep) {
      case 1:
        return formData.sector_id !== "" && formData.business_type !== ""
      case 2:
        return formData.monthly_gmv >= 1000 && formData.tx_count >= 10
      case 3:
        return formData.avg_ticket > 0
      case 4:
        const total = Object.values(formData.payment_mix).reduce((sum, val) => sum + val, 0)
        return total === 100
      case 5:
        return true
      case 6:
        return true
      case 7:
        return true
      case 8:
        // Validate contact info
        return (
          formData.contact.fullName.trim().length >= 3 &&
          formData.contact.companyName.trim().length >= 2 &&
          formData.contact.phone.isValid
        )
      default:
        return false
    }
  }

  const handleNext = () => {
    if (validateStep() && currentStep < TOTAL_STEPS) {
      // Auto-calculate avg ticket if not set
      if (currentStep === 2 && formData.avg_ticket === 0 && formData.tx_count > 0) {
        const calculated = Math.round(formData.monthly_gmv / formData.tx_count)
        updateFormData("avg_ticket", calculated)
      }
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    if (!validateStep()) return

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/wizard/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to process wizard")
      }

      const result = await response.json()
      
      // Store result in sessionStorage for results page
      sessionStorage.setItem(`wizard-result-${result.wizardRunId}`, JSON.stringify(result))
      
      router.push(`/results/${result.wizardRunId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const stepInfo = t.steps[currentStep as keyof typeof t.steps]
  const BackArrow = isRTL ? ArrowRight : ArrowLeft
  const NextArrow = isRTL ? ArrowLeft : ArrowRight

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
      <WizardProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} locale={locale} />

      <Card className="shadow-lg border bg-card/80 backdrop-blur-sm">
        <CardHeader className="px-6 py-6 sm:px-8 sm:py-8 border-b bg-muted/30">
          <div className={cn(
            "flex items-center gap-2 text-sm text-muted-foreground",
            isRTL && "font-arabic"
          )}>
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              {currentStep}
            </span>
            <span>{t.of}</span>
            <span>{TOTAL_STEPS}</span>
          </div>
          <CardTitle className={cn(
            "text-xl sm:text-2xl md:text-3xl mt-2",
            isRTL && "font-arabic"
          )}>{stepInfo.title}</CardTitle>
          <CardDescription className={cn(
            "text-sm sm:text-base mt-2",
            isRTL && "font-arabic"
          )}>{stepInfo.subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          {currentStep === 1 && (
            <StepSector
              sectors={sectors}
              sectorId={formData.sector_id}
              businessType={formData.business_type}
              onSectorChange={(value) => updateFormData("sector_id", value)}
              onBusinessTypeChange={(value) => updateFormData("business_type", value)}
              locale={locale}
            />
          )}

          {currentStep === 2 && (
            <StepVolume
              monthlyGmv={formData.monthly_gmv}
              txCount={formData.tx_count}
              onGmvChange={(value) => updateFormData("monthly_gmv", value)}
              onTxCountChange={(value) => updateFormData("tx_count", value)}
              locale={locale}
            />
          )}

          {currentStep === 3 && (
            <StepAvgTicket
              avgTicket={formData.avg_ticket}
              monthlyGmv={formData.monthly_gmv}
              txCount={formData.tx_count}
              onAvgTicketChange={(value) => updateFormData("avg_ticket", value)}
              locale={locale}
            />
          )}

          {currentStep === 4 && (
            <StepPaymentMix
              paymentMix={formData.payment_mix}
              onPaymentMixChange={(mix) => updateFormData("payment_mix", mix)}
              locale={locale}
            />
          )}

          {currentStep === 5 && (
            <StepRates
              refundsRate={formData.refunds_rate}
              chargebacksRate={formData.chargebacks_rate}
              onRefundsRateChange={(value) => updateFormData("refunds_rate", value)}
              onChargebacksRateChange={(value) => updateFormData("chargebacks_rate", value)}
              locale={locale}
            />
          )}

          {currentStep === 6 && (
            <StepNeeds
              needs={formData.needs}
              onNeedsChange={(needs) => updateFormData("needs", needs)}
              locale={locale}
            />
          )}

          {currentStep === 7 && <StepSummary data={formData} sectors={sectors} locale={locale} />}

          {currentStep === 8 && (
            <StepContact
              contactData={formData.contact}
              onContactDataChange={(contact) => updateFormData("contact", contact as WizardContactData)}
              sectorName={sectors.find(s => s.id === formData.sector_id)?.[locale === "ar" ? "name_ar" : "name_en"]}
              locale={locale}
            />
          )}

          {error && (
            <p className={cn(
              "mt-4 text-xs sm:text-sm text-destructive p-3 bg-destructive/10 rounded-md",
              isRTL && "font-arabic"
            )}>
              {error}
            </p>
          )}

          {/* Navigation Buttons */}
          <div className="mt-10 pt-6 border-t flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <Button 
              variant="outline" 
              onClick={handleBack} 
              disabled={currentStep === 1 || isSubmitting}
              size="lg"
              className={cn(
                "w-full sm:w-auto px-8",
                "active:scale-[0.98] transition-transform",
                isRTL && "font-arabic"
              )}
            >
              <BackArrow className="h-5 w-5 shrink-0" />
              <span className="ms-2">{t.back}</span>
            </Button>

            {currentStep < TOTAL_STEPS ? (
              <Button 
                onClick={handleNext} 
                disabled={!validateStep()}
                size="lg"
                className={cn(
                  "w-full sm:w-auto px-8 bg-emerald-600 hover:bg-emerald-700",
                  "active:scale-[0.98] transition-transform shadow-lg shadow-emerald-500/20",
                  isRTL && "font-arabic"
                )}
              >
                <span className="me-2">{t.next}</span>
                <NextArrow className="h-5 w-5 shrink-0" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting || !validateStep()}
                size="lg"
                className={cn(
                  "w-full sm:w-auto px-8 bg-emerald-600 hover:bg-emerald-700",
                  "active:scale-[0.98] transition-transform shadow-lg shadow-emerald-500/20",
                  isRTL && "font-arabic"
                )}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin shrink-0" />
                    <span className="ms-2">{t.submitting}</span>
                  </>
                ) : (
                  <>
                    <span className="me-2">{t.submit}</span>
                    <NextArrow className="h-5 w-5 shrink-0" />
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
