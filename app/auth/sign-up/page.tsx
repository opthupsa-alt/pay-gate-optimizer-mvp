"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { useLocale } from "@/hooks/use-locale"

const translations = {
  ar: {
    title: "إنشاء حساب جديد",
    subtitle: "أنشئ حسابك للوصول إلى جميع المميزات",
    name: "الاسم",
    namePlaceholder: "أدخل اسمك",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    passwordPlaceholder: "8 أحرف على الأقل",
    confirmPassword: "تأكيد كلمة المرور",
    confirmPlaceholder: "أعد إدخال كلمة المرور",
    submit: "إنشاء الحساب",
    submitting: "جاري إنشاء الحساب...",
    hasAccount: "لديك حساب بالفعل؟",
    login: "تسجيل الدخول",
    errorPasswordMismatch: "كلمتا المرور غير متطابقتان",
    errorPasswordLength: "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
    errorCreateFailed: "فشل في إنشاء الحساب",
    errorGeneral: "حدث خطأ. يرجى المحاولة مرة أخرى",
    successTitle: "تم إنشاء الحساب بنجاح!",
    successRedirect: "جاري تحويلك لصفحة تسجيل الدخول...",
  },
  en: {
    title: "Create New Account",
    subtitle: "Create your account to access all features",
    name: "Name",
    namePlaceholder: "Enter your name",
    email: "Email",
    password: "Password",
    passwordPlaceholder: "At least 8 characters",
    confirmPassword: "Confirm Password",
    confirmPlaceholder: "Re-enter password",
    submit: "Create Account",
    submitting: "Creating account...",
    hasAccount: "Already have an account?",
    login: "Sign In",
    errorPasswordMismatch: "Passwords do not match",
    errorPasswordLength: "Password must be at least 8 characters",
    errorCreateFailed: "Failed to create account",
    errorGeneral: "An error occurred. Please try again",
    successTitle: "Account created successfully!",
    successRedirect: "Redirecting to login page...",
  },
}

export default function SignUpPage() {
  const router = useRouter()
  const locale = useLocale()
  const t = translations[locale]
  
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (password !== confirmPassword) {
      setError(t.errorPasswordMismatch)
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError(t.errorPasswordLength)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || t.errorCreateFailed)
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/auth/login")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errorGeneral)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-8">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" />
            <h2 className="mt-4 text-2xl font-bold">{t.successTitle}</h2>
            <p className="mt-2 text-muted-foreground">
              {t.successRedirect}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t.title}</CardTitle>
          <CardDescription>
            {t.subtitle}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">{t.name}</Label>
              <Input
                id="name"
                type="text"
                placeholder={t.namePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t.email}</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t.password}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t.confirmPassword}</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t.confirmPlaceholder}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                dir="ltr"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="me-2 h-4 w-4 animate-spin" />
                  {t.submitting}
                </>
              ) : (
                t.submit
              )}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {t.hasAccount}{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                {t.login}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
