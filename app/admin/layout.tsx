import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { getSession, isAdmin } from "@/lib/auth"

export const metadata = {
  title: 'لوحة التحكم | PayGate Optimizer',
  description: 'لوحة التحكم الإدارية',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const locale = (cookieStore.get("locale")?.value as "ar" | "en") || "ar"

  // Check authentication
  const session = await getSession()
  if (!session) {
    redirect("/auth/login?callbackUrl=/admin")
  }

  // Check if user is admin
  const admin = await isAdmin()
  if (!admin) {
    redirect("/")
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      <AdminSidebar locale={locale} />
      <main className="flex-1 overflow-auto bg-muted/30 p-6">
        {children}
      </main>
    </div>
  )
}
