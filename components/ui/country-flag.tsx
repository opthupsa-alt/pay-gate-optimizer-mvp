"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface CountryFlagProps {
  countryCode: string
  className?: string
  size?: "sm" | "md" | "lg"
}

const sizeMap = {
  sm: { width: 16, height: 12 },
  md: { width: 20, height: 15 },
  lg: { width: 24, height: 18 },
}

const sizeClasses = {
  sm: "w-4 h-3",
  md: "w-5 h-[15px]",
  lg: "w-6 h-[18px]",
}

/**
 * Displays a country flag using SVG from country-flag-icons package
 * Uses static URL to the 3x2 aspect ratio SVGs
 */
export function CountryFlag({ 
  countryCode, 
  className,
  size = "md" 
}: CountryFlagProps) {
  const code = countryCode.toUpperCase()
  const { width, height } = sizeMap[size]
  
  // Use the CDN URL for country-flag-icons
  const flagUrl = `https://purecatamphetamine.github.io/country-flag-icons/3x2/${code}.svg`
  
  return (
    <Image
      src={flagUrl}
      alt={`${code} flag`}
      width={width}
      height={height}
      className={cn(
        "inline-block rounded-[2px] shadow-sm object-cover",
        sizeClasses[size],
        className
      )}
      unoptimized
    />
  )
}

export default CountryFlag
