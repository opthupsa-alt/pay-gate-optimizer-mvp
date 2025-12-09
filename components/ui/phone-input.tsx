"use client"

import * as React from "react"
import { Check, ChevronDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CountryFlag } from "@/components/ui/country-flag"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { 
  countries, 
  defaultCountry, 
  type Country,
  normalizePhoneNumber,
  isValidPhoneNumber,
  findCountryByDialCode,
  detectCountryFromNumber,
  formatPhoneAsYouType,
} from "@/lib/countries"

export interface PhoneInputValue {
  raw: string           // As user entered
  normalized: string    // 966XXXXXXXXX format
  countryCode: string   // 966
  isValid: boolean
}

interface PhoneInputProps {
  value?: PhoneInputValue
  onChange?: (value: PhoneInputValue) => void
  locale?: "ar" | "en"
  placeholder?: string
  disabled?: boolean
  error?: string
  className?: string
}

export function PhoneInput({
  value,
  onChange,
  locale = "ar",
  placeholder,
  disabled = false,
  error,
  className,
}: PhoneInputProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedCountry, setSelectedCountry] = React.useState<Country>(defaultCountry)
  const [phoneNumber, setPhoneNumber] = React.useState("")
  const [displayValue, setDisplayValue] = React.useState("") // Formatted display
  const [searchQuery, setSearchQuery] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)
  const isRTL = locale === "ar"

  // Initialize from value prop
  React.useEffect(() => {
    if (value?.raw && !phoneNumber) {
      setPhoneNumber(value.raw)
      // Format for display
      const formatted = formatPhoneAsYouType(value.raw, value.countryCode || "966")
      setDisplayValue(formatted)
      if (value.countryCode) {
        const country = findCountryByDialCode(value.countryCode)
        if (country) setSelectedCountry(country)
      }
    }
  }, [value, phoneNumber])

  // Filter countries based on search
  const filteredCountries = React.useMemo(() => {
    if (!searchQuery) return countries
    const q = searchQuery.toLowerCase()
    return countries.filter(c => {
      const name = locale === "ar" ? c.nameAr : c.nameEn
      return (
        name.toLowerCase().includes(q) ||
        c.dialCode.includes(q) ||
        c.code.toLowerCase().includes(q)
      )
    })
  }, [searchQuery, locale])

  // Handle phone number input change (with live formatting)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    
    // Format as user types
    const formatted = formatPhoneAsYouType(raw, selectedCountry.dialCode)
    setDisplayValue(formatted)
    
    // Store raw digits
    const digits = raw.replace(/\D/g, "")
    setPhoneNumber(digits)
    
    const normalized = normalizePhoneNumber(digits, selectedCountry.dialCode)
    const isValid = isValidPhoneNumber(normalized)
    
    onChange?.({
      raw: digits,
      normalized,
      countryCode: selectedCountry.dialCode,
      isValid,
    })
  }

  // Handle paste event - auto-detect country and format
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    
    const pastedText = e.clipboardData.getData("text")
    const digits = pastedText.replace(/\D/g, "")
    
    // Try to detect country from pasted number
    let detectedCountry = detectCountryFromNumber(digits)
    let localDigits = digits
    
    if (detectedCountry) {
      // Update country selector
      setSelectedCountry(detectedCountry)
      // Remove country code from digits
      localDigits = digits.slice(detectedCountry.dialCode.length)
    } else {
      // Keep current country, handle local format
      detectedCountry = selectedCountry
      // Remove leading 0 if present
      if (digits.startsWith("0")) {
        localDigits = digits.slice(1)
      }
    }
    
    // Format the number
    const formatted = formatPhoneAsYouType(localDigits, detectedCountry.dialCode)
    setDisplayValue(formatted)
    setPhoneNumber(localDigits)
    
    // Notify parent
    const normalized = normalizePhoneNumber(localDigits, detectedCountry.dialCode)
    const isValid = isValidPhoneNumber(normalized)
    
    onChange?.({
      raw: localDigits,
      normalized,
      countryCode: detectedCountry.dialCode,
      isValid,
    })
  }

  // Handle country change
  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country)
    setOpen(false)
    setSearchQuery("")
    
    // Re-format with new country code
    const formatted = formatPhoneAsYouType(phoneNumber, country.dialCode)
    setDisplayValue(formatted)
    
    // Re-normalize with new country code
    const normalized = normalizePhoneNumber(phoneNumber, country.dialCode)
    const isValid = isValidPhoneNumber(normalized)
    
    onChange?.({
      raw: phoneNumber,
      normalized,
      countryCode: country.dialCode,
      isValid,
    })
  }

  const defaultPlaceholder = locale === "ar" ? "56 403 9942" : "56 403 9942"

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div 
        dir="ltr" 
        className={cn(
          "flex rounded-lg border bg-background transition-colors",
          error ? "border-destructive" : "border-input focus-within:border-primary",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {/* Country Picker */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              role="combobox"
              aria-expanded={open}
              disabled={disabled}
              className={cn(
                "h-11 px-3 rounded-l-lg rounded-r-none border-r shrink-0",
                "hover:bg-muted/50 focus:ring-0 focus:ring-offset-0"
              )}
            >
              <CountryFlag countryCode={selectedCountry.code} size="md" className="mr-1.5" />
              <span className="text-sm font-medium tabular-nums">+{selectedCountry.dialCode}</span>
              <ChevronDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-0" align="start">
            <Command>
              <div className="flex items-center border-b px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <input
                  placeholder={locale === "ar" ? "ابحث عن دولة..." : "Search country..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              <CommandList>
                <CommandEmpty>
                  {locale === "ar" ? "لم يتم العثور على دولة" : "No country found"}
                </CommandEmpty>
                <CommandGroup className="max-h-[300px] overflow-y-auto">
                  {filteredCountries.map((country) => (
                    <div
                      key={country.code}
                      onClick={() => handleCountrySelect(country)}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2.5 cursor-pointer hover:bg-accent transition-colors",
                        selectedCountry.code === country.code && "bg-accent"
                      )}
                    >
                      <CountryFlag countryCode={country.code} size="md" />
                      <span className="flex-1 text-sm">
                        {locale === "ar" ? country.nameAr : country.nameEn}
                      </span>
                      <span className="text-sm text-muted-foreground tabular-nums">
                        +{country.dialCode}
                      </span>
                      {selectedCountry.code === country.code && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Phone Number Input */}
        <Input
          ref={inputRef}
          type="tel"
          inputMode="tel"
          value={displayValue}
          onChange={handlePhoneChange}
          onPaste={handlePaste}
          disabled={disabled}
          placeholder={placeholder || defaultPlaceholder}
          className={cn(
            "flex-1 border-0 rounded-l-none h-11 text-base tabular-nums tracking-wide",
            "focus-visible:ring-0 focus-visible:ring-offset-0",
            "placeholder:text-muted-foreground/60"
          )}
        />
      </div>

      {/* Error Message */}
      {error && (
        <p className={cn(
          "text-xs text-destructive",
          isRTL && "text-right font-arabic"
        )}>
          {error}
        </p>
      )}

      {/* Helper text showing full international format */}
      {phoneNumber && !error && (
        <p className="text-xs text-muted-foreground tabular-nums" dir="ltr">
          +{selectedCountry.dialCode} {displayValue} → {normalizePhoneNumber(phoneNumber, selectedCountry.dialCode)}
        </p>
      )}
    </div>
  )
}

export default PhoneInput
