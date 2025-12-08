# دليل نشر PayGate Optimizer
# PayGate Optimizer Deployment Guide

---

## 📋 متطلبات النشر

### الخيار 1: Vercel (الأسهل والموصى به)
- حساب على Vercel (مجاني)
- ربط مع GitHub/GitLab

### الخيار 2: Railway/Render
- حساب على Railway أو Render
- Node.js 18+

### الخيار 3: VPS/استضافة مشتركة مع Node.js
- Node.js 18 أو أحدث
- PM2 لإدارة العمليات
- Nginx كـ reverse proxy

---

## 🚀 طريقة 1: النشر على Vercel (الأسهل)

### الخطوات:

1. **ارفع المشروع على GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/paygate-optimizer.git
git push -u origin main
```

2. **اذهب إلى [vercel.com](https://vercel.com) وسجل دخول**

3. **اضغط "New Project" واختر المستودع**

4. **أضف Environment Variables:**
```
DEMO_MODE=true
NEXTAUTH_SECRET=your-super-secure-secret-key-32-chars-minimum
NEXTAUTH_URL=https://your-domain.vercel.app
```

5. **اضغط Deploy**

✅ سيتم النشر تلقائياً!

---

## 🚀 طريقة 2: النشر على Railway

### الخطوات:

1. **اذهب إلى [railway.app](https://railway.app)**

2. **New Project → Deploy from GitHub**

3. **أضف Environment Variables:**
```
DEMO_MODE=true
NEXTAUTH_SECRET=your-super-secure-secret-key
NEXTAUTH_URL=https://your-app.railway.app
NODE_ENV=production
```

4. **Railway سيكتشف Next.js تلقائياً**

---

## 🚀 طريقة 3: VPS أو استضافة مع Node.js

### الخطوات:

#### 1. رفع الملفات:
ارفع المجلد كاملاً إلى السيرفر عبر SFTP أو Git

#### 2. تثبيت Dependencies:
```bash
cd /path/to/paygate-optimizer
npm install
# أو
pnpm install
```

#### 3. إنشاء ملف `.env.production`:
```bash
nano .env.production
```

أضف:
```env
NODE_ENV=production
DEMO_MODE=true
NEXTAUTH_SECRET=your-super-secure-secret-key-change-this
NEXTAUTH_URL=https://yourdomain.com
```

#### 4. بناء المشروع:
```bash
npm run build
```

#### 5. تشغيل المشروع مع PM2:
```bash
# تثبيت PM2
npm install -g pm2

# تشغيل المشروع
pm2 start npm --name "paygate" -- start

# حفظ الإعداد
pm2 save
pm2 startup
```

#### 6. إعداد Nginx:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 7. SSL مع Let's Encrypt:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## 📦 طريقة 4: استضافة مشتركة (cPanel مع Node.js)

### إذا كانت استضافتك تدعم Node.js:

1. **ادخل لـ cPanel → Setup Node.js App**

2. **أنشئ تطبيق جديد:**
   - Node.js Version: 18+
   - Application mode: Production
   - Application root: paygate-optimizer
   - Application URL: yourdomain.com
   - Application startup file: node_modules/.bin/next

3. **ارفع الملفات عبر File Manager أو FTP**

4. **من Terminal في cPanel:**
```bash
cd ~/paygate-optimizer
npm install
npm run build
```

5. **أعد تشغيل التطبيق من cPanel**

---

## ⚙️ Environment Variables المطلوبة

| المتغير | الوصف | مثال |
|---------|-------|------|
| `DEMO_MODE` | تفعيل وضع العرض | `true` |
| `NEXTAUTH_SECRET` | مفتاح التشفير (32 حرف+) | `your-32-char-secret-key` |
| `NEXTAUTH_URL` | رابط الموقع | `https://yourdomain.com` |
| `NODE_ENV` | بيئة التشغيل | `production` |

### لتوليد NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

---

## 🔐 بيانات الدخول الافتراضية

- **البريد:** `admin@paygate.com`
- **كلمة المرور:** `admin123`

⚠️ **مهم:** غيّر كلمة المرور بعد أول تسجيل دخول!

---

## ✅ قائمة التحقق قبل النشر

- [ ] تم تغيير NEXTAUTH_SECRET
- [ ] تم تعيين NEXTAUTH_URL الصحيح
- [ ] تم اختبار تسجيل الدخول
- [ ] تم اختبار صفحة المزودين
- [ ] تم اختبار معالج المقارنة
- [ ] تم اختبار لوحة التحكم

---

## 🐛 حل المشاكل الشائعة

### خطأ 500 عند تسجيل الدخول:
- تأكد من تعيين NEXTAUTH_SECRET
- تأكد من NEXTAUTH_URL صحيح

### الصفحات لا تحمّل:
- تأكد من تشغيل `npm run build` قبل `npm start`
- تأكد من Node.js 18+

### مشكلة في الـ API:
- تأكد من DEMO_MODE=true

---

## 📞 الدعم

للمساعدة، تواصل معنا عبر:
- 📧 support@paygate.sa
- 💬 واتساب: +966XXXXXXXXX

