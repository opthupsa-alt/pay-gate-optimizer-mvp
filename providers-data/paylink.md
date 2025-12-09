# Paylink – بيانات البوابة المحدثة (2025-12-09)

================================================================================
القسم 1: المعلومات الأساسية
================================================================================

**المعرف (slug):**  
paylink

**الاسم بالعربية:**  
بيلينك

**الاسم بالإنجليزية:**  
Paylink

**الموقع الرسمي:**  
https://paylink.sa :contentReference[oaicite:0]{index=0}  

**صفحة بوابة الدفع:**  
https://paylink.sa/payment-gateway :contentReference[oaicite:1]{index=1}  

**الفئة:**  
payment_gateway / aggregator / invoicing

**الحالة:**  
active

================================================================================
القسم 2: الرسوم الثابتة (من الشروط الرسمية)
================================================================================

من صفحة الشروط / الباقات عند بيلينك: setup و الاشتراك الشهري مجاناً، ورسوم العمليات كما في الجدول أدناه. :contentReference[oaicite:2]{index=2}  

**رسوم التسجيل (Setup Fee):**  
0 ر.س (Free)

**الرسوم الشهرية (Monthly Subscription):**  
0 ر.س (Free)

================================================================================
القسم 3: رسوم المعاملات (Transaction Fees)
================================================================================

**حسب صفحة الشروط الرسمية:** :contentReference[oaicite:3]{index=3}  

| طريقة الدفع           | النسبة % | الثابت (ر.س) | ملاحظات |
|-----------------------|----------|--------------|---------|
| مدى (MADA)            | 1.00%    | 0            | كما هو مذكور في الجدول الرسمي |
| فيزا / ماستركارد     | 2.75%    | 1.00         | ثابت 1 ر.س لكل عملية |
| أمريكان إكسبريس      | ~2.75–3% | 1.00         | تقديري مشابه للـ Visa/Master |
| Apple Pay             | 2.75%    | 1.00         | تمر كبطاقات Visa/Master |
| STC Pay               | ~2–2.5%  | 1.00         | تقديري – مدعوم رسمياً كطريقة دفع |
| URPay                 | ~2–2.5%  | 1.00         | تقديري – مدعوم رسمياً |
| Tabby (BNPL)          | حسب عقد Tabby | —   | الرسوم عند مزود BNPL |
| Tamara (BNPL)         | حسب عقد Tamara | —  | الرسوم عند مزود BNPL |

> ملاحظة:  
> الأرقام الدقيقة لأمريكان إكسبريس و STC Pay و URPay و BNPL غير مذكورة رقمياً في الموقع،  
> لكن طرق الدفع نفسها مذكورة بوضوح في توثيق Paylink و plugins. :contentReference[oaicite:4]{index=4}  

**رسوم Refund:**  
0 ر.س عادة (مع خصم رسوم العملية الأصلية فقط – يحتاج تأكيد من الدعم).

**رسوم Chargeback:**  
تقريبًا 50–75 ر.س (افتراضي مثل باقي السوق – للتعديل إذا حصلت أرقام رسمية لاحقًا).

================================================================================
القسم 4: العمليات والتسوية (Ops)
================================================================================

**وقت التفعيل (Activation):**  
- الحد الأدنى: 1 يوم  
- الحد الأقصى: 3 أيام  
> بيلينك تستهدف التجار الصغار والمتوسطين، والتفعيل عادة سريع.

**وقت التسوية (Settlement):**  
التوثيق يشير إلى *Quick Settlements to your bank account*، أي تسويات سريعة لحسابك البنكي. :contentReference[oaicite:5]{index=5}  

- الحد الأدنى: 1–2 يوم عمل  
- الحد الأقصى: 5 أيام عمل  

**جدول الدفع (Payout Schedule):**  
weekly (افتراضي)، مع إمكانية daily لبعض الحالات.

================================================================================
القسم 5: الدعم الفني
================================================================================

**قنوات الدعم:**  
- email (عبر الموقع)  
- ticket من خلال لوحة التحكم  
- phone / WhatsApp (حسب الباقات / الدعم التجاري)  

**ساعات الدعم:**  
أوقات الدوام الرسمي داخل السعودية، مع استجابة أسرع للتجار النشطين.

================================================================================
القسم 6: تقييمات الأداء (0–100)
================================================================================

> هذه القيم لتغذية نموذج المقارنات، ويمكن تعديلها لاحقاً بناءً على data حقيقية.

**onboardingScore:** 85  
**supportScore:** 75  
**docsScore:** 80  

**ratingAvg:** 4.2/5 (تقريبي من تقييمات التطبيق والإضافات) :contentReference[oaicite:6]{index=6}  
**ratingCount:** متوسط (عشرات إلى مئات التقييمات عبر المتاجر والتطبيقات)

================================================================================
القسم 7: طرق الدفع المدعومة (Payment Methods)
================================================================================

من صفحة *Payment Methods* في توثيق بيلينك: Mada, STCPay, URPay, Tamara, Tabby, Apple Pay, Visa, MasterCard, American Express. :contentReference[oaicite:7]{index=7}  

| الطريقة              | مدعوم؟ | اشتراكات Recurring؟ |
|----------------------|--------|----------------------|
| mada                 | نعم    | لا |
| visa                 | نعم    | لا (من طرف بيلينك؛ recurring ممكن عبر منظومات خارجية) |
| mastercard           | نعم    | لا |
| amex                 | نعم    | لا |
| Apple Pay            | نعم    | لا |
| Google Pay           | غير مذكور صراحةً – نفترض لا حالياً |
| STC Pay              | نعم    | لا |
| URPay                | نعم    | لا |
| Tabby (BNPL)         | نعم    | — |
| Tamara (BNPL)        | نعم    | — |
| سداد                 | غير مدعومة |
| تحويل بنكي مباشر    | لا كـ online method، فقط تسويات للحساب البنكي |

================================================================================
القسم 8: القدرات (Capabilities)
================================================================================

من التوثيق الرسمي وتوصيف التطبيق: :contentReference[oaicite:8]{index=8}  

- invoicing: قوي جدًا (إصدار فواتير وروابط دفع من الجوال أو الويب)  
- payment_links (URL payments): مدعوم بقوة  
- quick_pay: روابط ثابتة للمنتجات  
- mobile_app: تطبيق جوال رسمي (iOS/Android) :contentReference[oaicite:9]{index=9}  
- multi_methods: دعم عدة وسائل دفع محلية  
- reconciliation APIs: متوفر (settlement webhooks / recon APIs) :contentReference[oaicite:10]{index=10}  
- libraries & SDKs:  
  - PHP Package  
  - Laravel Package  
  - Python Package  
  - Flutter Package  
  - iOS Package  
  - Android Package  
  - JavaScript SDK (Web Embedded / Apple Pay / STC Pay) :contentReference[oaicite:11]{index=11}  

================================================================================
القسم 9: القطاعات المدعومة
================================================================================

بيلينك موجهة بالأساس لـ:

- micro & small businesses  
- online sellers عبر السوشيال ميديا  
- freelancers  
- متاجر صغيرة ومتوسطة  
- مقدمي خدمات واستشارات  

في نموذج المقارنة عندك ممكن نعتبر:

- ecommerce — مدعوم  
- retail — مدعوم  
- restaurants — مدعوم (أونلاين وفواتير)  
- services — مدعوم بقوة  
- saas — مدعوم بشكل أساسي عبر الفواتير  
- healthcare — مقيد  
- travel — مقيد  
- gaming — مقيد  
- crypto — ممنوع  
- adult — ممنوع  

================================================================================
القسم 10: التكاملات (Integrations)
================================================================================

من صفحة التوثيق والـ Plugins: WooCommerce, Shopify, Odoo, OpenCart, ExpandCart، إضافة ووردبريس رسمية. :contentReference[oaicite:12]{index=12}  

| المنصة       | متاح؟ | رسمي؟ | ملاحظات |
|--------------|-------|--------|----------|
| WooCommerce  | نعم   | رسمي (Plugin على WordPress.org) | https://wordpress.org/plugins/paylink/ |
| Shopify      | نعم   | رسمي | عبر Plugin مذكور في docs |
| OpenCart     | نعم   | رسمي / شريك | مذكور في قائمة الـ Plugins في docs |
| Odoo         | نعم   | Module | مذكور في docs |
| ExpandCart   | نعم   | تكامل جاهز | مذكور في docs |
| سلة          | يمكن التكامل عبر روابط الدفع / Webhooks | ليس كبوابة مدمجة مباشرة |
| زد           | نفس الفكرة (روابط دفع) |
| Custom API   | نعم   | رسمي | عبر Paylink Developer Portal :contentReference[oaicite:13]{index=13}  

================================================================================
القسم 11: المميزات والعيوب
================================================================================

### ⭐ المميزات بالعربية:
1. **رسوم واضحة وشفافة**: مدى 1% فقط بدون رسوم شهرية أو رسوم تسجيل – ممتازة جداً للتجار الصغار. :contentReference[oaicite:14]{index=14}  
2. دعم قوي للمدفوعات المحلية (Mada, STC Pay, URPay, Tabby, Tamara, Apple Pay). :contentReference[oaicite:15]{index=15}  
3. منصّة فواتير وروابط دفع مثالية للتجار اللي شغالين عن طريق الواتساب والسوشيال. :contentReference[oaicite:16]{index=16}  
4. مكتبات جاهزة (PHP/Laravel/Flutter/JS…) تسهّل الدمج البرمجي. :contentReference[oaicite:17]{index=17}  
5. إضافة WooCommerce رسمية تجعل الربط مع ووردبريس سهل جداً. :contentReference[oaicite:18]{index=18}  

### ❗ العيوب بالعربية:
1. أقل في “الصورة Enterprise” مقارنة بـ HyperPay / Checkout / Amazon PS.  
2. لا يوجد تركيز كبير على recurring/subscriptions المتقدّمة مثل Stripe / Checkout.  
3. بعض التجار اشتكوا من تأخر في تحويل الأرصدة أو تواصل الدعم (حسب التقييمات على App Store). :contentReference[oaicite:19]{index=19}  

### ⭐ المميزات بالإنجليزية:
1. Transparent flat pricing for KSA merchants (1% Mada, 2.75% Visa/MasterCard + 1 SAR). :contentReference[oaicite:20]{index=20}  
2. Great for small merchants and invoice-based businesses. :contentReference[oaicite:21]{index=21}  
3. Supports key Saudi payment methods: Mada, STCPay, URPay, Tabby, Tamara, Apple Pay. :contentReference[oaicite:22]{index=22}  
4. Easy integration via plugins and SDKs. :contentReference[oaicite:23]{index=23}  

### ❗ العيوب بالإنجليزية:
1. Not primarily designed for very large enterprise-scale or complex marketplace flows.  
2. Limited public information on advanced features like marketplace split payments, complex routing, etc.

================================================================================
القسم 12: مصادر المعلومات
================================================================================

- صفحة الشروط / الأسعار في Paylink (Setup + Subscription + Mada + Visa/MasterCard fees). :contentReference[oaicite:24]{index=24}  
- صفحة Payment Methods في توثيق Paylink (طرق الدفع المدعومة). :contentReference[oaicite:25]{index=25}  
- صفحة Paylink Application – المميزات والتسويات السريعة. :contentReference[oaicite:26]{index=26}  
- صفحة Plugin ووردبريس الرسمية PayLink Payment Gateway. :contentReference[oaicite:27]{index=27}  
- تقييمات تطبيق Paylink في App Store. :contentReference[oaicite:28]{index=28}  

**Last Updated:**  
2025-12-09

================================================================================
