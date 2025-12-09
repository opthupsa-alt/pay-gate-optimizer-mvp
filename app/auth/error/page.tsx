"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useLocale } from "@/hooks/use-locale"

const translations = {
  ar: {
    title: "حدث خطأ",
    errorCode: "رمز الخطأ:",
    unknownError: "حدث خطأ غير محدد. يرجى المحاولة مرة أخرى.",
    backToLogin: "العودة لتسجيل الدخول",
  },
  en: {
    title: "An Error Occurred",
    errorCode: "Error code:",
    unknownError: "An unknown error occurred. Please try again.",
    backToLogin: "Back to Login",
  },
}

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const locale = useLocale()
  const t = translations[locale]

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-muted/30 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-2xl">{t.title}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {error ? (
              <p className="text-sm text-muted-foreground">{t.errorCode} {error}</p>
            ) : (
              <p className="text-sm text-muted-foreground">{t.unknownError}</p>
            )}
          </CardContent>
        </Card>
        <div className="mt-4 text-center">
          <Link href="/auth/login" className="text-sm text-muted-foreground hover:underline">
            {t.backToLogin}
          </Link>
        </div>
      </div>
    </div>
  )
}
