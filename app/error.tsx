"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import Link from "next/link"
import { useLocale } from "@/hooks/use-locale"

const translations = {
  ar: {
    title: "حدث خطأ غير متوقع",
    description: "نعتذر عن هذا الخطأ. يرجى المحاولة مرة أخرى أو العودة للصفحة الرئيسية.",
    errorCode: "رمز الخطأ:",
    retry: "إعادة المحاولة",
    home: "الصفحة الرئيسية",
  },
  en: {
    title: "An Unexpected Error Occurred",
    description: "We apologize for this error. Please try again or go back to the home page.",
    errorCode: "Error code:",
    retry: "Try Again",
    home: "Home",
  },
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const locale = useLocale()
  const t = translations[locale]

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-12">
      <Card className="mx-auto max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">{t.title}</CardTitle>
          <CardDescription>
            {t.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error.digest && (
            <p className="text-xs text-muted-foreground">
              {t.errorCode} {error.digest}
            </p>
          )}
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button onClick={reset} variant="default">
              <RefreshCw className="h-4 w-4 me-2" />
              {t.retry}
            </Button>
            <Button asChild variant="outline">
              <Link href="/">
                <Home className="h-4 w-4 me-2" />
                {t.home}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

