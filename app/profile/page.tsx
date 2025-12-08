import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { getCurrentUser } from "@/lib/auth"
import { ProfileForm } from "@/components/profile/profile-form"

export const metadata = {
  title: 'الملف الشخصي | PayGate Optimizer',
  description: 'إدارة حسابك ومعلوماتك الشخصية',
}

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const locale = (cookieStore.get("locale")?.value as "ar" | "en") || "ar"

  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="container py-8 md:py-12">
      <ProfileForm 
        user={user} 
        locale={locale} 
      />
    </div>
  )
}

