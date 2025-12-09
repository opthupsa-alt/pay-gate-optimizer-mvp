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
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-muted/50 to-background py-8 md:py-12 lg:py-16">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-3 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">{t.title}</h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">{t.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 container py-6 md:py-10">
        <WizardForm sectors={sectors} locale={locale} />
      </div>
    </div>
  )
}
