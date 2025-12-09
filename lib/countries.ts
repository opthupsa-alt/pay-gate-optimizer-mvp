/**
 * Country data for phone input
 * Includes country code, dial code, and flag emoji
 */

export interface Country {
  code: string      // ISO 3166-1 alpha-2 (SA, AE, etc.)
  dialCode: string  // Without + (966, 971, etc.)
  nameAr: string    // Arabic name
  nameEn: string    // English name
  flag: string      // Emoji flag
}

// Gulf and Arab countries first, then common international
export const countries: Country[] = [
  // Gulf Countries (دول الخليج)
  { code: "SA", dialCode: "966", nameAr: "السعودية", nameEn: "Saudi Arabia", flag: "🇸🇦" },
  { code: "AE", dialCode: "971", nameAr: "الإمارات", nameEn: "UAE", flag: "🇦🇪" },
  { code: "KW", dialCode: "965", nameAr: "الكويت", nameEn: "Kuwait", flag: "🇰🇼" },
  { code: "BH", dialCode: "973", nameAr: "البحرين", nameEn: "Bahrain", flag: "🇧🇭" },
  { code: "QA", dialCode: "974", nameAr: "قطر", nameEn: "Qatar", flag: "🇶🇦" },
  { code: "OM", dialCode: "968", nameAr: "عمان", nameEn: "Oman", flag: "🇴🇲" },
  
  // Arab Countries (الدول العربية)
  { code: "EG", dialCode: "20", nameAr: "مصر", nameEn: "Egypt", flag: "🇪🇬" },
  { code: "JO", dialCode: "962", nameAr: "الأردن", nameEn: "Jordan", flag: "🇯🇴" },
  { code: "LB", dialCode: "961", nameAr: "لبنان", nameEn: "Lebanon", flag: "🇱🇧" },
  { code: "SY", dialCode: "963", nameAr: "سوريا", nameEn: "Syria", flag: "🇸🇾" },
  { code: "IQ", dialCode: "964", nameAr: "العراق", nameEn: "Iraq", flag: "🇮🇶" },
  { code: "YE", dialCode: "967", nameAr: "اليمن", nameEn: "Yemen", flag: "🇾🇪" },
  { code: "PS", dialCode: "970", nameAr: "فلسطين", nameEn: "Palestine", flag: "🇵🇸" },
  { code: "SD", dialCode: "249", nameAr: "السودان", nameEn: "Sudan", flag: "🇸🇩" },
  { code: "LY", dialCode: "218", nameAr: "ليبيا", nameEn: "Libya", flag: "🇱🇾" },
  { code: "TN", dialCode: "216", nameAr: "تونس", nameEn: "Tunisia", flag: "🇹🇳" },
  { code: "DZ", dialCode: "213", nameAr: "الجزائر", nameEn: "Algeria", flag: "🇩🇿" },
  { code: "MA", dialCode: "212", nameAr: "المغرب", nameEn: "Morocco", flag: "🇲🇦" },
  
  // Other Common Countries
  { code: "US", dialCode: "1", nameAr: "أمريكا", nameEn: "United States", flag: "🇺🇸" },
  { code: "GB", dialCode: "44", nameAr: "بريطانيا", nameEn: "United Kingdom", flag: "🇬🇧" },
  { code: "DE", dialCode: "49", nameAr: "ألمانيا", nameEn: "Germany", flag: "🇩🇪" },
  { code: "FR", dialCode: "33", nameAr: "فرنسا", nameEn: "France", flag: "🇫🇷" },
  { code: "TR", dialCode: "90", nameAr: "تركيا", nameEn: "Turkey", flag: "🇹🇷" },
  { code: "IN", dialCode: "91", nameAr: "الهند", nameEn: "India", flag: "🇮🇳" },
  { code: "PK", dialCode: "92", nameAr: "باكستان", nameEn: "Pakistan", flag: "🇵🇰" },
  { code: "BD", dialCode: "880", nameAr: "بنغلاديش", nameEn: "Bangladesh", flag: "🇧🇩" },
  { code: "PH", dialCode: "63", nameAr: "الفلبين", nameEn: "Philippines", flag: "🇵🇭" },
  { code: "ID", dialCode: "62", nameAr: "إندونيسيا", nameEn: "Indonesia", flag: "🇮🇩" },
  { code: "MY", dialCode: "60", nameAr: "ماليزيا", nameEn: "Malaysia", flag: "🇲🇾" },
]

// Default country (Saudi Arabia)
export const defaultCountry = countries[0]

/**
 * Find country by dial code
 */
export function findCountryByDialCode(dialCode: string): Country | undefined {
  const normalized = dialCode.replace(/^\+/, "")
  return countries.find(c => c.dialCode === normalized)
}

/**
 * Find country by ISO code
 */
export function findCountryByCode(code: string): Country | undefined {
  return countries.find(c => c.code.toUpperCase() === code.toUpperCase())
}

/**
 * Search countries by name or dial code
 */
export function searchCountries(query: string, locale: "ar" | "en" = "ar"): Country[] {
  const q = query.toLowerCase().trim()
  if (!q) return countries
  
  return countries.filter(c => {
    const name = locale === "ar" ? c.nameAr : c.nameEn
    return (
      name.toLowerCase().includes(q) ||
      c.dialCode.includes(q) ||
      c.code.toLowerCase().includes(q)
    )
  })
}

/**
 * Normalize a phone number to standard format (digits only, with country code)
 * Handles various input formats:
 * - 0565740429 → 966565740429
 * - 565740429 → 966565740429
 * - +966565740429 → 966565740429
 * - 00966565740429 → 966565740429
 * - 966565740429 → 966565740429
 */
export function normalizePhoneNumber(
  rawInput: string, 
  countryDialCode: string = "966"
): string {
  // Remove all non-digits
  let digits = rawInput.replace(/\D/g, "")
  
  // Remove leading zeros (international prefix 00)
  if (digits.startsWith("00")) {
    digits = digits.slice(2)
  }
  
  // Check if already starts with country code
  if (digits.startsWith(countryDialCode)) {
    return digits
  }
  
  // Remove leading zero (local format)
  if (digits.startsWith("0")) {
    digits = digits.slice(1)
  }
  
  // Prepend country code
  return countryDialCode + digits
}

/**
 * Validate phone number format
 * Returns true if the normalized number looks valid (reasonable length)
 */
export function isValidPhoneNumber(normalizedPhone: string): boolean {
  // Most phone numbers are 10-15 digits including country code
  return /^\d{10,15}$/.test(normalizedPhone)
}

/**
 * Format phone number for display
 */
export function formatPhoneForDisplay(normalizedPhone: string, countryCode: string): string {
  if (!normalizedPhone) return ""
  
  // Remove country code for local display
  const localNumber = normalizedPhone.startsWith(countryCode) 
    ? normalizedPhone.slice(countryCode.length) 
    : normalizedPhone
    
  // Add leading zero for Saudi numbers
  if (countryCode === "966" && !localNumber.startsWith("0")) {
    return "0" + localNumber
  }
  
  return localNumber
}

/**
 * Detect country from phone number
 * Returns the country that matches the phone number's prefix
 */
export function detectCountryFromNumber(phone: string): Country | undefined {
  // Clean the input
  let digits = phone.replace(/\D/g, "")
  
  // Remove leading 00 (international prefix)
  if (digits.startsWith("00")) {
    digits = digits.slice(2)
  }
  
  // Try to find matching country by dial code
  // Sort countries by dial code length (longer first) to match most specific
  const sortedCountries = [...countries].sort((a, b) => b.dialCode.length - a.dialCode.length)
  
  for (const country of sortedCountries) {
    if (digits.startsWith(country.dialCode)) {
      return country
    }
  }
  
  return undefined
}

/**
 * Format phone number as you type (AsYouType formatter)
 * Provides visual formatting while user types
 * 
 * Saudi format: XXX XXX XXXX (e.g., 056 403 9942)
 * International: +966 56 403 9942
 */
export function formatPhoneAsYouType(
  input: string, 
  countryDialCode: string = "966",
  includeCountryCode: boolean = false
): string {
  // Clean input to digits only
  let digits = input.replace(/\D/g, "")
  
  // Handle empty input
  if (!digits) return ""
  
  // Remove leading zeros
  if (digits.startsWith("00")) {
    digits = digits.slice(2)
  }
  
  // Remove country code if present
  if (digits.startsWith(countryDialCode)) {
    digits = digits.slice(countryDialCode.length)
  }
  
  // Remove single leading zero (local format)
  if (digits.startsWith("0")) {
    digits = digits.slice(1)
  }
  
  // Now format the local number
  // Saudi mobile numbers are 9 digits: 5X XXX XXXX
  if (countryDialCode === "966") {
    // Format: 5X XXX XXXX
    let formatted = ""
    
    if (digits.length <= 2) {
      formatted = digits
    } else if (digits.length <= 5) {
      formatted = `${digits.slice(0, 2)} ${digits.slice(2)}`
    } else {
      formatted = `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 9)}`
    }
    
    if (includeCountryCode) {
      return `+${countryDialCode} ${formatted}`.trim()
    }
    return formatted.trim()
  }
  
  // Generic formatting for other countries (groups of 3)
  const groups = []
  for (let i = 0; i < digits.length; i += 3) {
    groups.push(digits.slice(i, i + 3))
  }
  
  const formatted = groups.join(" ")
  
  if (includeCountryCode) {
    return `+${countryDialCode} ${formatted}`.trim()
  }
  return formatted.trim()
}

/**
 * Parse and extract phone number components from any format
 * Handles: +966 56 403 9942, 0564039942, 966564039942, 00966564039942, etc.
 */
export function parsePhoneNumber(input: string): {
  digits: string
  countryCode: string | null
  localNumber: string
  formatted: string
  isValid: boolean
} {
  // Clean input
  let digits = input.replace(/\D/g, "")
  
  // Remove leading 00
  if (digits.startsWith("00")) {
    digits = digits.slice(2)
  }
  
  // Try to detect country
  const country = detectCountryFromNumber(digits)
  
  let countryCode: string | null = null
  let localNumber = digits
  
  if (country) {
    countryCode = country.dialCode
    localNumber = digits.slice(country.dialCode.length)
  } else if (digits.startsWith("0")) {
    // Local format starting with 0
    localNumber = digits.slice(1)
    countryCode = "966" // Default to Saudi
  }
  
  // Validate length (9-12 digits for local number is reasonable)
  const isValid = localNumber.length >= 8 && localNumber.length <= 12
  
  // Format for display
  const formatted = formatPhoneAsYouType(localNumber, countryCode || "966", true)
  
  return {
    digits,
    countryCode,
    localNumber,
    formatted,
    isValid,
  }
}
