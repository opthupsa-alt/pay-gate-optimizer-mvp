"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileQuestion, Home, ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useLocale } from "@/hooks/use-locale"

const translations = {
  ar: {
    title: "الصفحة غير موجودة",
    description: "الصفحة التي تبحث عنها غير موجودة أو تم نقلها.",
    home: "الصفحة الرئيسية",
    compare: "ابدأ المقارنة",
  },
  en: {
    title: "Page Not Found",
    description: "The page you are looking for does not exist or has been moved.",
    home: "Home",
    compare: "Start Comparison",
  },
}

export default function NotFound() {
  const locale = useLocale()
  const t = translations[locale]
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight

  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-12">
      <Card className="mx-auto max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <FileQuestion className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-6xl font-bold text-muted-foreground">404</CardTitle>
          <CardTitle className="text-2xl mt-2">{t.title}</CardTitle>
          <CardDescription>
            {t.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button asChild variant="default">
              <Link href="/">
                <Home className="h-4 w-4 me-2" />
                {t.home}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/wizard">
                {t.compare}
                <Arrow className="h-4 w-4 ms-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

