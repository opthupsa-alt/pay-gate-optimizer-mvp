/**
 * Seed PDF Settings Script
 * 
 * Run with: npx tsx scripts/seed-pdf-settings.ts
 */

import { PrismaClient, SettingType } from '@prisma/client'

const prisma = new PrismaClient()

const pdfSettings = [
  { 
    key: 'pdf.provider', 
    value: 'pdfshift', 
    type: 'string' as SettingType, 
    group: 'pdf', 
    label: 'مزود خدمة PDF', 
    description: 'اختر المزود: pdfshift أو html2pdf أو fallback (HTML)', 
    isPublic: false, 
    sortOrder: 25 
  },
  { 
    key: 'pdf.pdfshift_api_key', 
    value: 'sk_af186d0b97bf5773e33cda8eac7d513f708b3208', 
    type: 'string' as SettingType, 
    group: 'pdf', 
    label: 'مفتاح PDFShift API', 
    description: 'مفتاح API من موقع pdfshift.io (مجاني 50 ملف/شهر)', 
    isPublic: false, 
    sortOrder: 26 
  },
  { 
    key: 'pdf.html2pdf_api_key', 
    value: '', 
    type: 'string' as SettingType, 
    group: 'pdf', 
    label: 'مفتاح HTML2PDF API', 
    description: 'مفتاح API من موقع html2pdf.app (مجاني 100 ملف/شهر)', 
    isPublic: false, 
    sortOrder: 27 
  },
  { 
    key: 'pdf.enabled', 
    value: 'true', 
    type: 'boolean' as SettingType, 
    group: 'pdf', 
    label: 'تفعيل توليد PDF', 
    description: 'تفعيل أو تعطيل توليد ملفات PDF', 
    isPublic: false, 
    sortOrder: 28 
  },
]

async function seedPDFSettings() {
  console.log('🔧 Seeding PDF settings...\n')
  
  for (const setting of pdfSettings) {
    try {
      await prisma.siteSetting.upsert({
        where: { key: setting.key },
        create: setting,
        update: { value: setting.value },
      })
      console.log(`✅ Upserted: ${setting.key} = ${setting.key.includes('api_key') ? '[HIDDEN]' : setting.value}`)
    } catch (error) {
      console.error(`❌ Failed to upsert ${setting.key}:`, error)
    }
  }
  
  console.log('\n✨ Done!')
}

seedPDFSettings()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
