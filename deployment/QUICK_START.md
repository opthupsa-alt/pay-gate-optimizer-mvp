# ⚡ التشغيل السريع - Quick Start

## 🇸🇦 العربية

### الخطوة 1: إنشاء ملف .env
انسخ `env-production.txt` إلى `.env`:
```bash
cp deployment/env-production.txt .env
```

### الخطوة 2: تعديل الإعدادات
افتح `.env` وغيّر:
- `NEXTAUTH_SECRET` → مفتاح عشوائي (32 حرف)
- `NEXTAUTH_URL` → رابط موقعك

### الخطوة 3: التثبيت والتشغيل
```bash
npm install
npm run build
npm start
```

### الخطوة 4: تسجيل الدخول
- الرابط: http://localhost:3000
- البريد: admin@paygate.com
- كلمة المرور: admin123

---

## 🇬🇧 English

### Step 1: Create .env file
Copy `env-production.txt` to `.env`:
```bash
cp deployment/env-production.txt .env
```

### Step 2: Edit settings
Open `.env` and change:
- `NEXTAUTH_SECRET` → random key (32 chars)
- `NEXTAUTH_URL` → your website URL

### Step 3: Install and run
```bash
npm install
npm run build
npm start
```

### Step 4: Login
- URL: http://localhost:3000
- Email: admin@paygate.com
- Password: admin123

---

## 📝 الأوامر المهمة - Important Commands

| الأمر | الوصف |
|-------|-------|
| `npm install` | تثبيت الحزم |
| `npm run build` | بناء المشروع |
| `npm start` | تشغيل الإنتاج |
| `npm run dev` | تشغيل التطوير |

## 🔗 الروابط المهمة - Important URLs

| الصفحة | الرابط |
|--------|--------|
| الرئيسية | `/` |
| المزودين | `/providers` |
| المقارنة | `/wizard` |
| لوحة التحكم | `/admin` |
| تسجيل الدخول | `/auth/login` |

