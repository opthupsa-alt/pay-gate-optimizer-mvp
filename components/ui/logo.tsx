"use client"

import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  showText?: boolean
  className?: string
}

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-10 w-10",
  xl: "h-12 w-12",
}

const textSizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
}

export function Logo({ size = "md", showText = true, className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 512 512"
        className={cn(sizeClasses[size], "flex-shrink-0")}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
        
        {/* Background rounded square */}
        <rect x="16" y="16" width="480" height="480" rx="96" fill="url(#logoGradient)"/>
        
        {/* Inner subtle ring */}
        <rect x="48" y="48" width="416" height="416" rx="80" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2"/>
        
        {/* Letter P - Bold modern design */}
        <path 
          d="M168 400 L168 112 L312 112 Q376 112 408 152 Q440 192 440 256 Q440 320 408 360 Q376 400 312 400 L168 400 Z M224 344 L296 344 Q340 344 362 316 Q384 288 384 256 Q384 224 362 196 Q340 168 296 168 L224 168 Z" 
          fill="white"
        />
        
        {/* Accent: Small payment card icon in top right */}
        <g transform="translate(350, 70)">
          <rect width="90" height="56" rx="10" fill="rgba(255,255,255,0.25)"/>
          <rect x="12" y="16" width="35" height="6" rx="3" fill="rgba(255,255,255,0.6)"/>
          <rect x="12" y="28" width="22" height="4" rx="2" fill="rgba(255,255,255,0.4)"/>
          <circle cx="68" cy="28" r="14" fill="rgba(255,255,255,0.4)"/>
          <circle cx="55" cy="28" r="14" fill="rgba(255,255,255,0.3)"/>
        </g>
      </svg>
      
      {showText && (
        <span className={cn("font-bold", textSizeClasses[size])}>
          <span className="text-foreground">PayGate</span>
          <span className="text-emerald-500"> Optimizer</span>
        </span>
      )}
    </div>
  )
}

// SVG string for use in PDF exports (inline)
export const logoSVGString = `
<svg viewBox="0 0 512 512" width="48" height="48">
  <defs>
    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
  </defs>
  <rect x="16" y="16" width="480" height="480" rx="96" fill="url(#logoGrad)"/>
  <rect x="48" y="48" width="416" height="416" rx="80" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
  <path d="M168 400 L168 112 L312 112 Q376 112 408 152 Q440 192 440 256 Q440 320 408 360 Q376 400 312 400 L168 400 Z M224 344 L296 344 Q340 344 362 316 Q384 288 384 256 Q384 224 362 196 Q340 168 296 168 L224 168 Z" fill="white"/>
  <g transform="translate(350, 70)">
    <rect width="90" height="56" rx="10" fill="rgba(255,255,255,0.25)"/>
    <rect x="12" y="16" width="35" height="6" rx="3" fill="rgba(255,255,255,0.6)"/>
    <rect x="12" y="28" width="22" height="4" rx="2" fill="rgba(255,255,255,0.4)"/>
    <circle cx="68" cy="28" r="14" fill="rgba(255,255,255,0.4)"/>
    <circle cx="55" cy="28" r="14" fill="rgba(255,255,255,0.3)"/>
  </g>
</svg>
`

// Base64 encoded logo for maximum compatibility in PDF
export const logoBase64 = `data:image/svg+xml;base64,${typeof btoa !== 'undefined' ? btoa(logoSVGString.trim()) : ''}`
