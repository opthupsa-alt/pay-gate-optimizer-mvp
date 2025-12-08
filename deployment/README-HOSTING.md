# 🚀 دليل الرفع الكامل على الاستضافة المشتركة
# Complete Hosting Deployment Guide

---

## 📋 المتطلبات الأساسية

### متطلبات السيرفر:
- **Node.js**: 18.x أو أحدث
- **NPM**: 9.x أو أحدث
- **RAM**: 512MB كحد أدنى (1GB موصى به)
- **المساحة**: 500MB للمشروع

### منصات الاستضافة المدعومة:
- ✅ cPanel مع Node.js
- ✅ Plesk مع Node.js
- ✅ DirectAdmin مع Node.js
- ✅ VPS (DigitalOcean, Vultr, Linode)
- ✅ Vercel (مجاني)
- ✅ Railway
- ✅ Render

---

## 🔧 خطوات الرفع (cPanel)

### الخطوة 1: رفع الملفات

1. **اضغط الملفات في ZIP:**
```bash
# في جهازك المحلي
cd paygate-optimizer
zip -r paygate.zip . -x "node_modules/*" -x ".next/*" -x ".git/*"
```

2. **ارفع عبر File Manager:**
   - ادخل cPanel → File Manager
   - اذهب إلى مجلد الموقع (مثل `public_html/paygate`)
   - ارفع ملف `paygate.zip`
   - فك الضغط

### الخطوة 2: إعداد Node.js App

1. ادخل cPanel → **Setup Node.js App**

2. أنشئ تطبيق جديد:
   - **Node.js Version**: 18.x أو أحدث
   - **Application Mode**: Production
   - **Application Root**: المسار للمجلد (مثل `paygate`)
   - **Application URL**: الدومين
   - **Application Startup File**: `server.js`

3. انسخ الأمر المعروض لتفعيل البيئة (مثل):
```bash
source /home/username/nodevenv/paygate/18/bin/activate
```

### الخطوة 3: تثبيت الحزم والبناء

1. ادخل **Terminal** في cPanel

2. نفذ الأوامر:
```bash
# تفعيل بيئة Node.js
source /home/username/nodevenv/paygate/18/bin/activate

# الدخول لمجلد المشروع
cd ~/paygate

# تثبيت الحزم
npm install --production=false

# بناء المشروع
npm run build
```

### الخطوة 4: إعداد المتغيرات البيئية

في cPanel Node.js App، أضف المتغيرات:

| المتغير | القيمة |
|---------|--------|
| `NODE_ENV` | `production` |
| `DEMO_MODE` | `true` |
| `NEXTAUTH_SECRET` | `[مفتاح عشوائي 32 حرف]` |
| `NEXTAUTH_URL` | `https://yourdomain.com` |

### الخطوة 5: تشغيل التطبيق

1. اضغط **START APP** في cPanel
2. أو من Terminal:
```bash
npm start
```

---

## 🔧 خطوات الرفع (VPS)

### الخطوة 1: الاتصال بالسيرفر
```bash
ssh root@your-server-ip
```

### الخطوة 2: تثبيت المتطلبات
```bash
# تحديث النظام
apt update && apt upgrade -y

# تثبيت Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# تثبيت PM2
npm install -g pm2

# تثبيت Nginx
apt install -y nginx
```

### الخطوة 3: رفع المشروع
```bash
# إنشاء مجلد
mkdir -p /var/www/paygate
cd /var/www/paygate

# رفع عبر Git أو SCP
git clone https://github.com/username/paygate-optimizer.git .
# أو
scp -r ./paygate-optimizer root@server:/var/www/paygate
```

### الخطوة 4: الإعداد والتشغيل
```bash
cd /var/www/paygate

# تثبيت الحزم
npm install

# إنشاء ملف البيئة
cp deployment/.env.production .env

# تعديل المتغيرات
nano .env

# بناء المشروع
npm run build

# تشغيل مع PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### الخطوة 5: إعداد Nginx
```bash
# نسخ إعدادات Nginx
cp deployment/nginx.conf /etc/nginx/sites-available/paygate
ln -s /etc/nginx/sites-available/paygate /etc/nginx/sites-enabled/

# اختبار الإعدادات
nginx -t

# إعادة تشغيل Nginx
systemctl restart nginx
```

### الخطوة 6: إعداد SSL
```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## ✅ قائمة التحقق بعد الرفع

- [ ] الموقع يفتح على الرابط
- [ ] صفحة تسجيل الدخول تعمل
- [ ] الدخول بـ admin@paygate.com / admin123
- [ ] لوحة التحكم تعمل
- [ ] صفحة المزودين تعرض 15 مزود
- [ ] معالج المقارنة يعمل
- [ ] النتائج تظهر بشكل صحيح
- [ ] الموقع يعمل بالعربي والإنجليزي
- [ ] HTTPS يعمل (إذا مفعّل)

---

## 🐛 حل المشاكل الشائعة

### خطأ: Application Error
```bash
# تحقق من الـ logs
pm2 logs paygate
# أو في cPanel، راجع stderr.log
```

### خطأ: 502 Bad Gateway
```bash
# تأكد أن التطبيق يعمل
pm2 status
# تأكد أن المنفذ صحيح (3000)
```

### خطأ: Cannot find module
```bash
# أعد تثبيت الحزم
rm -rf node_modules
npm install
npm run build
```

### صفحة بيضاء / خطأ 500
- تأكد من NEXTAUTH_SECRET
- تأكد من NEXTAUTH_URL
- راجع logs الخطأ

---

## 📞 الدعم

إذا واجهت أي مشكلة:
1. راجع ملفات الـ logs
2. تأكد من جميع المتغيرات البيئية
3. تأكد من إصدار Node.js

---

## 🔐 بيانات الدخول الافتراضية

| الدور | البريد | كلمة المرور |
|------|--------|------------|
| Admin | admin@paygate.com | admin123 |

⚠️ **مهم**: غيّر كلمة المرور فور الدخول!

