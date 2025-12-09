"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useLocale } from "@/hooks/use-locale"

const errorMessages = {
  ar: {
    InvalidCredentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    CredentialsSignin: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    Default: "حدث خطأ غير متوقع",
    AccessDenied: "ليس لديك صلاحية الوصول",
    Configuration: "خطأ في إعدادات المصادقة",
  },
  en: {
    InvalidCredentials: "Invalid email or password",
    CredentialsSignin: "Invalid email or password",
    Default: "An unexpected error occurred",
    AccessDenied: "You do not have access",
    Configuration: "Authentication configuration error",
  },
}

const translations = {
  ar: {
    title: "حدث خطأ",
    backToLogin: "العودة لتسجيل الدخول",
  },
  en: {
    title: "An Error Occurred",
    backToLogin: "Back to Login",
  },
}

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const locale = useLocale()
  const t = translations[locale]
  const messages = errorMessages[locale]

  const errorMessage = error 
    ? messages[error as keyof typeof messages] || messages.Default
    : messages.Default

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
            <p className="text-sm text-muted-foreground">{errorMessage}</p>
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
