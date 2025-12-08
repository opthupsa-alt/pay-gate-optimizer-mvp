import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-muted/30 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-2xl">حدث خطأ</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {params?.error ? (
              <p className="text-sm text-muted-foreground">رمز الخطأ: {params.error}</p>
            ) : (
              <p className="text-sm text-muted-foreground">حدث خطأ غير محدد. يرجى المحاولة مرة أخرى.</p>
            )}
          </CardContent>
        </Card>
        <div className="mt-4 text-center">
          <Link href="/auth/login" className="text-sm text-muted-foreground hover:underline">
            العودة لتسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  )
}
