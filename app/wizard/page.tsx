import { WizardForm } from "@/components/wizard/wizard-form"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { translations } from "@/lib/translations"
import { mockSectors } from "@/lib/mock-data"

export default async function WizardPage() {
  const cookieStore = await cookies()
  const locale = (cookieStore.get("locale")?.value as "ar" | "en") || "ar"
  const t = translations[locale].wizard

  // Try to get sectors from Supabase, fallback to mock data
  let sectors = mockSectors
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (supabaseUrl && supabaseUrl !== 'https://your-project.supabase.co') {
    try {
      const supabase = await createClient()
      const { data } = await supabase.from("sectors").select("*").order("name_en")
      if (data && data.length > 0) {
        sectors = data
      }
    } catch {
      // Use mock data on error
    }
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="mx-auto mb-8 max-w-2xl text-center">
        <h1 className="mb-2 text-3xl font-bold">{t.title}</h1>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      <WizardForm sectors={sectors} locale={locale} />
    </div>
  )
}
