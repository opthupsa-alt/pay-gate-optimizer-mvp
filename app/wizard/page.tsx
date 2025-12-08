import { WizardForm } from "@/components/wizard/wizard-form"
import { cookies } from "next/headers"
import { translations } from "@/lib/translations"
import { mockSectors } from "@/lib/mock-data"
import prisma from "@/lib/db"

export default async function WizardPage() {
  const cookieStore = await cookies()
  const locale = (cookieStore.get("locale")?.value as "ar" | "en") || "ar"
  const t = translations[locale].wizard

  // Try to get sectors from database, fallback to mock data
  let sectors = mockSectors
  
  try {
    const dbSectors = await prisma.sector.findMany({
      orderBy: { nameEn: "asc" },
    })
    if (dbSectors && dbSectors.length > 0) {
      // Map to expected format
      sectors = dbSectors.map(s => ({
        id: s.id,
        code: s.code,
        name_ar: s.nameAr,
        name_en: s.nameEn,
        created_at: s.createdAt.toISOString(),
      }))
    }
  } catch {
    // Use mock data on error
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
