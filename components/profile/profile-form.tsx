"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Shield, Calendar, Save, Loader2, LogOut } from "lucide-react"
import { toast } from "sonner"
import type { Profile } from "@/lib/types"
import type { User as AuthUser } from "@supabase/supabase-js"

interface ProfileFormProps {
  user: AuthUser
  profile: Profile | null
  locale: "ar" | "en"
}

export function ProfileForm({ user, profile, locale }: ProfileFormProps) {
  const router = useRouter()
  const [name, setName] = useState(profile?.name || "")
  const [isLoading, setIsLoading] = useState(false)

  const t = {
    ar: {
      title: "الملف الشخصي",
      subtitle: "إدارة معلومات حسابك",
      personalInfo: "المعلومات الشخصية",
      name: "الاسم",
      email: "البريد الإلكتروني",
      role: "الصلاحية",
      memberSince: "عضو منذ",
      save: "حفظ التغييرات",
      saving: "جاري الحفظ...",
      logout: "تسجيل الخروج",
      successMessage: "تم تحديث الملف الشخصي بنجاح",
      errorMessage: "حدث خطأ أثناء التحديث",
      roles: {
        admin: "مدير",
        analyst: "محلل",
        merchant: "تاجر"
      },
      accountInfo: "معلومات الحساب",
      securityInfo: "الأمان والخصوصية",
      emailVerified: "البريد موثق",
      lastSignIn: "آخر تسجيل دخول"
    },
    en: {
      title: "Profile",
      subtitle: "Manage your account information",
      personalInfo: "Personal Information",
      name: "Name",
      email: "Email",
      role: "Role",
      memberSince: "Member Since",
      save: "Save Changes",
      saving: "Saving...",
      logout: "Logout",
      successMessage: "Profile updated successfully",
      errorMessage: "Error updating profile",
      roles: {
        admin: "Admin",
        analyst: "Analyst",
        merchant: "Merchant"
      },
      accountInfo: "Account Information",
      securityInfo: "Security & Privacy",
      emailVerified: "Email Verified",
      lastSignIn: "Last Sign In"
    }
  }[locale]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('profiles')
        .update({ name, updated_at: new Date().toISOString() })
        .eq('id', user.id)

      if (error) throw error

      toast.success(t.successMessage)
      router.refresh()
    } catch {
      toast.error(t.errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const roleKey = (profile?.role || 'merchant') as keyof typeof t.roles

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">{t.title}</h1>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t.personalInfo}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t.name}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={locale === "ar" ? "أدخل اسمك" : "Enter your name"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t.email}</Label>
              <Input
                id="email"
                type="email"
                value={user.email || ""}
                disabled
                dir="ltr"
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin me-2" />
                  {t.saving}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 me-2" />
                  {t.save}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t.accountInfo}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{t.role}</span>
            </div>
            <Badge variant="secondary">
              {t.roles[roleKey]}
            </Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{t.memberSince}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {profile?.created_at ? formatDate(profile.created_at) : "-"}
            </span>
          </div>
          {user.email_confirmed_at && (
            <>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm">{t.emailVerified}</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  ✓
                </Badge>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
        <CardContent className="pt-6">
          <Button 
            variant="destructive" 
            onClick={handleLogout}
            className="w-full sm:w-auto"
          >
            <LogOut className="h-4 w-4 me-2" />
            {t.logout}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

