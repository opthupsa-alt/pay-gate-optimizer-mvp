/**
 * سكريبت تنظيف قاعدة البيانات
 * يحذف جميع الجداول القديمة قبل إنشاء جداول المشروع الجديدة
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanDatabase() {
  console.log('🧹 بدء تنظيف قاعدة البيانات...\n')

  try {
    // الحصول على قائمة جميع الجداول في schema public
    const tables = await prisma.$queryRaw<{ tablename: string }[]>`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
    `

    if (tables.length === 0) {
      console.log('✅ قاعدة البيانات فارغة بالفعل!\n')
      return
    }

    console.log(`📋 تم العثور على ${tables.length} جدول:\n`)
    tables.forEach(t => console.log(`   - ${t.tablename}`))
    console.log('')

    // تعطيل الـ foreign key checks مؤقتاً
    await prisma.$executeRaw`SET session_replication_role = 'replica'`

    // حذف جميع الجداول
    for (const table of tables) {
      try {
        await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "${table.tablename}" CASCADE`)
        console.log(`🗑️  تم حذف: ${table.tablename}`)
      } catch (error) {
        console.log(`⚠️  تخطي: ${table.tablename} (قد يكون محذوفاً)`)
      }
    }

    // إعادة تفعيل الـ foreign key checks
    await prisma.$executeRaw`SET session_replication_role = 'origin'`

    // حذف الـ enums إن وجدت
    const enums = await prisma.$queryRaw<{ typname: string }[]>`
      SELECT t.typname
      FROM pg_type t
      JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
      WHERE n.nspname = 'public'
      AND t.typtype = 'e'
    `

    if (enums.length > 0) {
      console.log(`\n📋 تم العثور على ${enums.length} enum:\n`)
      for (const e of enums) {
        try {
          await prisma.$executeRawUnsafe(`DROP TYPE IF EXISTS "${e.typname}" CASCADE`)
          console.log(`🗑️  تم حذف enum: ${e.typname}`)
        } catch (error) {
          console.log(`⚠️  تخطي enum: ${e.typname}`)
        }
      }
    }

    console.log('\n✅ تم تنظيف قاعدة البيانات بنجاح!\n')

  } catch (error) {
    console.error('❌ خطأ في تنظيف قاعدة البيانات:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

cleanDatabase()
  .then(() => {
    console.log('🎉 اكتمل التنظيف! يمكنك الآن تشغيل: pnpm prisma db push\n')
    process.exit(0)
  })
  .catch((error) => {
    console.error('فشل التنظيف:', error)
    process.exit(1)
  })
