"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { useLocale } from "@/hooks/use-locale"

const translations = {
  ar: {
    title: "تم إنشاء الحساب بنجاح!",
    subtitle: "يرجى التحقق من بريدك الإلكتروني",
    description: "لقد أرسلنا رابط تأكيد إلى بريدك الإلكتروني. يرجى النقر على الرابط لتفعيل حسابك.",
    backHome: "العودة للصفحة الرئيسية",
  },
  en: {
    title: "Account Created Successfully!",
    subtitle: "Please check your email",
    description: "We have sent a confirmation link to your email. Please click the link to activate your account.",
    backHome: "Back to Home",
  },
}

export default function SignUpSuccessPage() {
  const locale = useLocale()
  const t = translations[locale]

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-muted/30 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">{t.title}</CardTitle>
            <CardDescription>{t.subtitle}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              {t.description}
            </p>
          </CardContent>
        </Card>
        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:underline">
            {t.backHome}
          </Link>
        </div>
      </div>
    </div>
  )
}
