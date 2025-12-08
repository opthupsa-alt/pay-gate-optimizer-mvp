import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { ProfileForm } from "@/components/profile/profile-form"

export const metadata = {
  title: 'الملف الشخصي | PayGate Optimizer',
  description: 'إدارة حسابك ومعلوماتك الشخصية',
}

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const locale = (cookieStore.get("locale")?.value as "ar" | "en") || "ar"

  // Check Supabase configuration
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl || supabaseUrl === 'https://your-project.supabase.co') {
    redirect("/auth/login")
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="container py-8 md:py-12">
      <ProfileForm 
        user={user} 
        profile={profile} 
        locale={locale} 
      />
    </div>
  )
}

