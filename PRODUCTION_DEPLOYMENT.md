# 🚀 PayGate Optimizer - دليل النشر على الإنتاج

## نظرة سريعة

هذا الدليل يشرح خطوات نشر PayGate Optimizer على بيئة الإنتاج العالمية.

---

## 📋 المتطلبات

1. حساب [Vercel](https://vercel.com) (مجاني)
2. حساب [Neon](https://neon.tech) لقاعدة البيانات PostgreSQL (مجاني)
3. حساب [GitHub](https://github.com) لربط المشروع

---

## 🗄️ الخطوة 1: إعداد قاعدة البيانات (Neon)

### 1.1 إنشاء حساب ومشروع
1. اذهب إلى [neon.tech](https://neon.tech)
2. سجل دخول بحساب GitHub
3. اضغط "Create a project"
4. اختر:
   - **Project name**: `paygate-optimizer`
   - **Region**: اختر الأقرب لجمهورك (مثل `eu-central-1` لأوروبا/الشرق الأوسط)
   - **Database name**: `neondb`

### 1.2 الحصول على رابط الاتصال
1. بعد إنشاء المشروع، انسخ **Connection String**
2. ستجد رابطين:
   - **Pooled**: للتطبيق (DATABASE_URL)
   - **Direct**: للـ migrations (DIRECT_URL)

مثال:
```
DATABASE_URL="postgresql://neondb_owner:abc123@ep-cool-name-123456.eu-central-1.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://neondb_owner:abc123@ep-cool-name-123456-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"
```

---

## 🔧 الخطوة 2: إعداد المشروع محليًا

### 2.1 تحديث ملف .env
```bash
# افتح ملف .env وأضف الروابط من Neon
DATABASE_URL="your-pooled-connection-string"
DIRECT_URL="your-direct-connection-string"
```

### 2.2 تشغيل Migration
```bash
# إنشاء الجداول في قاعدة البيانات
pnpm prisma db push

# (اختياري) إضافة البيانات الأولية
pnpm db:seed
```

### 2.3 اختبار محلي
```bash
pnpm dev
```
افتح [http://localhost:3000](http://localhost:3000) وتأكد من عمل كل شيء.

---

## 🚀 الخطوة 3: النشر على Vercel

### 3.1 رفع المشروع على GitHub
```bash
git init
git add .
git commit -m "Initial commit - production ready"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/paygate-optimizer.git
git push -u origin main
```

### 3.2 ربط بـ Vercel
1. اذهب إلى [vercel.com](https://vercel.com)
2. اضغط "Add New Project"
3. اختر repository من GitHub
4. **Framework Preset**: Next.js (سيتم اكتشافه تلقائيًا)

### 3.3 إضافة Environment Variables
في صفحة إعدادات المشروع على Vercel:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | رابط Pooled من Neon |
| `DIRECT_URL` | رابط Direct من Neon |
| `NEXTAUTH_SECRET` | مفتاح سري قوي (32+ حرف) |
| `NEXTAUTH_URL` | `https://your-domain.vercel.app` |
| `DEMO_MODE` | `false` |
| `NODE_ENV` | `production` |

**لإنشاء NEXTAUTH_SECRET آمن:**
```bash
openssl rand -base64 32
```

### 3.4 النشر
اضغط "Deploy" وانتظر انتهاء البناء.

---

## 🌐 الخطوة 4: إعداد الدومين (اختياري)

### 4.1 إضافة دومين مخصص
1. في Vercel: Settings → Domains
2. أضف الدومين الخاص بك
3. اتبع تعليمات إعداد DNS

### 4.2 تحديث NEXTAUTH_URL
بعد إضافة الدومين، حدث:
```
NEXTAUTH_URL=https://yourdomain.com
```

---

## 🔐 الأمان

### إعدادات أمان مُطبقة:
- ✅ Security Headers (HSTS, X-Frame-Options, etc.)
- ✅ Rate Limiting على الـ APIs
- ✅ CSRF Protection
- ✅ SQL Injection Protection (Prisma)
- ✅ XSS Protection
- ✅ Environment Variables مؤمنة

### توصيات إضافية:
1. **غيّر NEXTAUTH_SECRET** - استخدم مفتاح فريد وقوي
2. **فعّل 2FA** على حسابات Vercel و Neon
3. **راقب الـ logs** بانتظام

---

## 📊 المراقبة والتحليلات

### Vercel Analytics (مُفعّل تلقائيًا)
- مشاهدة الإحصائيات في Vercel Dashboard → Analytics

### إضافة Sentry للـ Error Tracking (اختياري)
```bash
pnpm add @sentry/nextjs
```

---

## 🔄 التحديثات

### للتحديث التلقائي:
أي `git push` للـ `main` branch سيُنشر تلقائيًا.

### للتحديث اليدوي:
```bash
git add .
git commit -m "Update description"
git push origin main
```

---

## 🆘 استكشاف الأخطاء

### خطأ في الاتصال بقاعدة البيانات
1. تأكد من صحة `DATABASE_URL`
2. تأكد أن Neon project نشط
3. جرب: `pnpm prisma db push`

### خطأ في المصادقة
1. تأكد من `NEXTAUTH_SECRET`
2. تأكد من `NEXTAUTH_URL` صحيح

### صفحة 500 Error
1. تحقق من Vercel logs
2. تأكد من جميع Environment Variables

---

## 📞 الدعم

- **مستندات Vercel**: https://vercel.com/docs
- **مستندات Neon**: https://neon.tech/docs
- **مستندات Next.js**: https://nextjs.org/docs
- **مستندات Prisma**: https://prisma.io/docs

---

**🎉 مبروك! مشروعك جاهز للإنتاج العالمي!**
