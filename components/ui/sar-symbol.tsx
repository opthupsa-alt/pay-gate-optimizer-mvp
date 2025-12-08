"use client"

import { cn } from "@/lib/utils"

interface SARSymbolProps {
  className?: string
  /** Size preset: matches common text sizes */
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl"
  /** Custom width/height in pixels or CSS units */
  width?: string | number
  height?: string | number
}

/**
 * Saudi Riyal Symbol Component
 * 
 * A professional, inline SVG component for the new Saudi Riyal symbol (﷼)
 * Inherits color from parent text (currentColor) and scales appropriately
 * 
 * @example
 * // Basic usage - inherits size from parent
 * <span>100 <SARSymbol /></span>
 * 
 * // With size preset
 * <SARSymbol size="lg" />
 * 
 * // With custom className
 * <SARSymbol className="h-4 w-4 text-primary" />
 */
export function SARSymbol({ 
  className, 
  size = "base",
  width,
  height 
}: SARSymbolProps) {
  // Size presets that match Tailwind text sizes
  const sizeClasses: Record<string, string> = {
    xs: "h-3 w-3",      // text-xs
    sm: "h-3.5 w-3.5",  // text-sm
    base: "h-4 w-4",    // text-base
    lg: "h-5 w-5",      // text-lg
    xl: "h-5 w-5",      // text-xl
    "2xl": "h-6 w-6",   // text-2xl
    "3xl": "h-7 w-7",   // text-3xl
    "4xl": "h-8 w-8",   // text-4xl
  }

  const style = width || height ? {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  } : undefined

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1124.14 1256.39"
      aria-label="SAR"
      role="img"
      style={style}
      className={cn(
        "inline-block shrink-0 align-middle",
        !width && !height && sizeClasses[size],
        className
      )}
    >
      <path 
        fill="currentColor" 
        d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"
      />
      <path 
        fill="currentColor" 
        d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"
      />
    </svg>
  )
}

/**
 * Format a number with SAR symbol
 * 
 * @example
 * formatSAR(1500.50) // Returns formatted string with symbol
 * formatSAR(1500.50, "ar") // Arabic formatting
 */
export function formatSARValue(
  amount: number, 
  locale: "ar" | "en" = "ar",
  options?: {
    minimumFractionDigits?: number
    maximumFractionDigits?: number
  }
): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-SA", {
    minimumFractionDigits: options?.minimumFractionDigits ?? 2,
    maximumFractionDigits: options?.maximumFractionDigits ?? 2,
  }).format(amount)
}

interface SARAmountProps {
  /** The amount to display */
  amount: number
  /** Locale for number formatting */
  locale?: "ar" | "en"
  /** Size preset */
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl"
  /** Additional className for the container */
  className?: string
  /** Additional className for the symbol */
  symbolClassName?: string
  /** Show decimals */
  showDecimals?: boolean
  /** Symbol position - auto follows locale convention */
  symbolPosition?: "before" | "after" | "auto"
}

/**
 * SAR Amount Component
 * 
 * Displays a formatted amount with the SAR symbol
 * Automatically handles RTL/LTR and number formatting
 * 
 * @example
 * <SARAmount amount={1500.50} locale="ar" />
 * // Displays: ١٬٥٠٠٫٥٠ ﷼
 * 
 * <SARAmount amount={1500.50} locale="en" />
 * // Displays: 1,500.50 SAR
 */
export function SARAmount({
  amount,
  locale = "ar",
  size = "base",
  className,
  symbolClassName,
  showDecimals = true,
  symbolPosition = "auto",
}: SARAmountProps) {
  const formattedAmount = formatSARValue(amount, locale, {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  })

  // In Arabic, symbol typically comes after the number
  // In English, it can go either way, but after is more common for SAR
  const position = symbolPosition === "auto" 
    ? "after" 
    : symbolPosition

  const sizeToText: Record<string, string> = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
  }

  return (
    <span 
      className={cn(
        "inline-flex items-center gap-1 tabular-nums",
        sizeToText[size],
        className
      )}
    >
      {position === "before" && (
        <SARSymbol size={size} className={symbolClassName} />
      )}
      <span>{formattedAmount}</span>
      {position === "after" && (
        <SARSymbol size={size} className={symbolClassName} />
      )}
    </span>
  )
}

export default SARSymbol
