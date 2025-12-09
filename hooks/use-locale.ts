"use client"

import { useState, useEffect } from "react"

export type Locale = "ar" | "en"

/**
 * Hook to get the current locale from cookies
 * For use in client components
 */
export function useLocale(): Locale {
  const [locale, setLocale] = useState<Locale>("ar")

  useEffect(() => {
    // Read locale from cookie
    const cookies = document.cookie.split(";")
    const localeCookie = cookies.find((c) => c.trim().startsWith("locale="))
    if (localeCookie) {
      const value = localeCookie.split("=")[1]?.trim()
      if (value === "en" || value === "ar") {
        setLocale(value)
      }
    }
  }, [])

  return locale
}

/**
 * Get locale from cookie (for use in useEffect or event handlers)
 */
export function getLocaleFromCookie(): Locale {
  if (typeof document === "undefined") return "ar"
  
  const cookies = document.cookie.split(";")
  const localeCookie = cookies.find((c) => c.trim().startsWith("locale="))
  if (localeCookie) {
    const value = localeCookie.split("=")[1]?.trim()
    if (value === "en" || value === "ar") {
      return value
    }
  }
  return "ar"
}
