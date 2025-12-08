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
