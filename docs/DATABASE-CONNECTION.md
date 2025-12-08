# 🗄️ Database Connection Guide | دليل الاتصال بقاعدة البيانات

> **آخر تحديث:** 2025-12-08

## 📋 معلومات Supabase

### Project Info
| المفتاح | القيمة |
|---------|--------|
| **Project ID** | `cpezjepcvvcnimvjfzvv` |
| **Region** | `aws-1-us-east-1` |
| **Database** | PostgreSQL |

### URLs & Endpoints

```env
# Supabase Dashboard
https://supabase.com/dashboard/project/cpezjepcvvcnimvjfzvv

# API URL (للـ Client)
NEXT_PUBLIC_SUPABASE_URL="https://cpezjepcvvcnimvjfzvv.supabase.co"

# Database Host
POSTGRES_HOST="db.cpezjepcvvcnimvjfzvv.supabase.co"
```

---

## 🔗 Connection Strings

### 1. Pooled Connection (للـ Prisma و Serverless)
```env
DATABASE_URL="postgres://postgres.cpezjepcvvcnimvjfzvv:AUH6Nfz3PLL2xaTv@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true"
```

> ⚠️ **استخدم هذا للـ Prisma Client** - Port 6543 مع PgBouncer

### 2. Direct Connection (للـ Migrations)
```env
DIRECT_URL="postgres://postgres.cpezjepcvvcnimvjfzvv:AUH6Nfz3PLL2xaTv@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require"
```

> ⚠️ **استخدم هذا للـ `prisma db push` و `prisma migrate`** - Port 5432

### 3. Non-Pooling (للاتصال المباشر)
```env
POSTGRES_URL_NON_POOLING="postgres://postgres.cpezjepcvvcnimvjfzvv:AUH6Nfz3PLL2xaTv@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require"
```

---

## 🔐 API Keys

### Anon Key (Public - للـ Client)
```env
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwZXpqZXBjdnZjbmltdmpmenZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMjk4NjEsImV4cCI6MjA3OTgwNTg2MX0.74tprD2ijV2ZOxXNEhfMEMX9ILWUc51weM8hARNQUAk"
```

### Service Role Key (Secret - للـ Server فقط)
```env
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwZXpqZXBjdnZjbmltdmpmenZ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDIyOTg2MSwiZXhwIjoyMDc5ODA1ODYxfQ.kS-7QjftX-CKK_vhRxU2bizVvK_9FKBsWBrq0eg2h9o"
```

### JWT Secret
```env
SUPABASE_JWT_SECRET="jVHN8kIVWfdLITecaShBqIuRvESzIIcP9iktxN3jbb3+8FPNmMZ18vSINpXGpf/+K9T1iOMZahbTGYI7mAoxRw=="
```

---

## 🛠️ أوامر Prisma

### تطبيق Schema على قاعدة البيانات
```bash
# تأكد من وجود DIRECT_URL في .env
npx prisma db push
```

### إنشاء Migration
```bash
npx prisma migrate dev --name your_migration_name
```

### Deploy للـ Production
```bash
npx prisma migrate deploy
```

### تجديد Prisma Client
```bash
npx prisma generate
```

### فتح Prisma Studio
```bash
npx prisma studio
```

### التحقق من صحة Schema
```bash
npx prisma validate
```

---

## 📁 ملفات الإعدادات

### prisma/schema.prisma
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

### .env
```env
DATABASE_URL="postgres://...6543/postgres?pgbouncer=true"
DIRECT_URL="postgres://...5432/postgres"
```

---

## 🔄 خطوات الإعداد السريع

### 1. نسخ بيانات الاتصال
```bash
# تأكد من وجود .env بالمعلومات أعلاه
```

### 2. تطبيق Schema
```bash
npx prisma db push
```

### 3. تجديد Client
```bash
npx prisma generate
```

### 4. (اختياري) Seed Data
```bash
npx prisma db seed
```

---

## ⚠️ ملاحظات مهمة

1. **Port 6543** = Pooled (للـ Prisma queries)
2. **Port 5432** = Direct (للـ migrations)
3. لا تشارك **Service Role Key** أبداً
4. **Anon Key** آمن للاستخدام في الـ Client
5. تأكد من `sslmode=require` دائماً

---

## 🔗 روابط مفيدة

- [Supabase Dashboard](https://supabase.com/dashboard/project/cpezjepcvvcnimvjfzvv)
- [Prisma Docs](https://www.prisma.io/docs)
- [Supabase Docs](https://supabase.com/docs)
