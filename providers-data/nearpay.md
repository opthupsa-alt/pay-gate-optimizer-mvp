# NearPay – بيانات مزود البنية التحتية / SoftPOS (2025-12-09)

================================================================================
القسم 1: المعلومات الأساسية
================================================================================

**المعرّف (slug):**  
nearpay

**الاسم بالعربية:**  
نيرباي

**الاسم بالإنجليزية:**  
NearPay

**الوصف المختصر:**  
شركة سعودية متخصصة في **Payment Infrastructure as a Service (PIaaS)**،  
توفر بنية تحتية لقبول المدفوعات الحضورية (In-Person) عبر **SoftPOS / Tap to Pay**  
وتحوّل أجهزة التابلت والموبايل إلى نقاط بيع تقبل بطاقات مدى، فيزا، ماستركارد، أمريكان إكسبريس وغيرها. :contentReference[oaicite:1]{index=1}  

**الموقع الرسمي:**  
https://nearpay.io :contentReference[oaicite:2]{index=2}  

**صفحة المزايا / المنتج:**  
https://nearpay.io/features :contentReference[oaicite:3]{index=3}  

**صفحة الأخبار (الشهادات والتمويل والشراكات):**  
https://nearpay.io/news :contentReference[oaicite:4]{index=4}  

**الفئة في نظامك:**  
payment_infra / softpos_provider / tap_to_pay  

**الحالة:**  
active

================================================================================
القسم 2: نموذج العمل
================================================================================

NearPay ليست "بوابة دفع تجارية" مباشرة للتاجر النهائي مثل هايبر باي،  
بل:

- **Infra Provider**: تبيع SDKs, APIs, Full-stack SoftPOS للبنوك، PSPs، MSPs، والمنصات. :contentReference[oaicite:5]{index=5}  
- شركاؤها هم اللي يقدّموا المنتج للتجار (مثال: Digital Pay SoftPOS، PayTabs SoftPOS وغيرهم). :contentReference[oaicite:6]{index=6}  

في PayGate Optimizer المفروض تتعامل معها كـ:

- **مزود بُنية تحتية يدعم SoftPOS / Tap-to-Phone / POS**  
- نقطة قوة كبيرة للبوابات اللي متكاملة معها (PayTabs, DigitalPay… إلخ).

================================================================================
القسم 3: الرسوم والتسعير (تقريبي / غير معلن)
================================================================================

NearPay نفسها لا تنشر **تسعير علني للتجار**؛  
التسعير بيكون:

- يا إمّا B2B (لـ PSP / بنك / منصة)  
- يا إمّا جزء من باقات شركائها (Digital Pay, PayTabs SoftPOS… إلخ). :contentReference[oaicite:7]{index=7}  

لذلك في نموذج البيانات عندك:

- `setupFee`: null (يحتاج عرض سعر B2B)  
- `monthlyFee`: null  
- `transactionFees`: null على مستوى التاجر،  
  وتتحسب فعلياً عند مستوى مزود الخدمة النهائي (Digital Pay / PayTabs / بنك…).

**مهم:**  
NearPay هنا مش داخل مقارنة رسوم أونلاين مدى/فيزا للتاجر الصغير؛  
هي عامل مؤثر في الـ **In-Person / POS / SoftPOS Capability**.

================================================================================
القسم 4: العمليات والتسوية (Ops)
================================================================================

NearPay بتقدم:

- **SDK + API + Dashboards** لمنصات الدفع:  
  - Merchant Dashboard  
  - Hub Dashboard  
  - Settlements Management  
  - Terminals Management  
  - Compliance / Certification Management …إلخ. :contentReference[oaicite:8]{index=8}  

**ملاحظات:**

- التسوية (Settlement) والـ Payout Schedule ما بتحددها NearPay مباشرة للتاجر،  
  بل يحددها الـ PSP / البنك اللي يستخدم NearPay كـ Infra.  
- في نظامك يفضّل:

```json
"settlementManagedBy": "psp_or_bank",
"settlementDaysMin": null,
"settlementDaysMax": null
================================================================================
القسم 5: الدعم الفني والتوثيق (Developers)

Documentation / API:

NearPay عندها توثيق تقني واضح للـ Merchants SDK / API:

API Reference (مثال Merchant API):

Base URL (Sandbox):
https://sandbox-api.nearpay.io/v1/merchants-sdk/

Authentication: API Key في الهيدر. 
docs.nearpay.io

تقدم:

SDKs متعددة للـ Android والأنظمة المدعومة. 
nearpay.io
+2
nearpay.io
+2

Dashboard لإدارة الـ terminals / العمليات / الcredentials. 
docs.nearpay.io
+1

الدعم:

Contact / Sales / Technical عبر موقع NearPay. 
nearpay.io
+2
nearpay.io
+2

================================================================================
القسم 6: طرق الدفع / الشبكات المدعومة

NearPay أخذت Kernel Certificates لكل الشبكات الأساسية المعتمدة في السعودية: 
وَمْضَة
+1

mada (الشبكة السعودية للمدفوعات) 
وَمْضَة
+2
mada.com.sa
+2

Visa

MasterCard

American Express (Amex)

وغيرها من الشبكات العالمية المعتمدة

وكذلك SoftPOS لدى شركائها (Digital Pay) يعلن دعم:

Mada

Debit / Credit Cards

Wallets (حسب تكامل Digital Pay). 
digitalpay.sa

في نموذجك:

"supportedSchemes": [
  "mada",
  "visa",
  "mastercard",
  "amex"
],
"supportsContactless": true,
"supportsPinOnGlass": true

================================================================================
القسم 7: نوع العمليات (Transaction Types)

NearPay SoftPOS يغطّي:

Standard Purchase

Purchase with Cash Back (Naqd)

Refunds / Voids (عبر الـ PSP / البنك)

PIN on Glass للعمليات فوق الحد المسموح بدون PIN. 
البنك الأهلي
+2
digitalpay.sa
+2

نوع القبول:

In-Person Tap to Pay (NFC Cards / Wallets)

SoftPOS على موبايل أو تابلت

لا يركّز على E-commerce Online مباشرة (ده دور البوابة اللي فوقه).

================================================================================
القسم 8: القطاعات المدعومة

بما إنه Infra + SoftPOS، فـ NearPay تستهدف:

Micro & Small merchants (بائعين ميدانيين – مندوبين – متاجر صغيرة) عبر شركائها. 
nearpay.io
+2
nearpay.io
+2

Retail / Grocery / Food & Beverage

Delivery / Logistics

Events / Pop-up stores

أي سيناريو محتاج Tap-to-Pay بدون أجهزة POS تقليدية.

في جدول القطاعات عندك:

ecommerce (online): غير مباشر – يعتمد على الـ PSP

in_store_pos: مدعوم بقوة (SoftPOS)

delivery / field_sales: مدعوم بقوة

high-risk / gambling / adult / crypto: حسب سياسات الـ PSP / البنك، مش NearPay مباشرة.

================================================================================
القسم 9: التكاملات (Integrations & Partners)

Partnerships مهمّة في السعودية:

Digital Pay SoftPOS:

Digital Pay تعلن SoftPOS "Powered by NearPay" لقبول mada, debit, credit, wallets على أي جوال NFC. 
digitalpay.sa
+1

PayTabs SoftPOS / PayTabs Touch:

تقارير السوق تذكر شراكات بين PayTabs وNearPay لتعزيز الـ SoftPOS في المنطقة،
كجزء من منصة Payment Orchestration. 
Financial IT
+1

بنوك / PSPs سعودية أخرى:

NearPay مذكورة في تقارير كسعودي FinTech لتمكين Tap-on-Phone ومساندة البنية التحتية لنقاط البيع في المملكة. 
LinkedIn
+3
fintech.global
+3
IBS Intelligence
+3

في JSON:

"availableThroughProviders": [
  "digitalpay",
  "paytabs",
  "banks_psps_partners"
],
"primaryUseCase": "softpos_tap_to_pay"

================================================================================
القسم 10: التقييمات (0–100) – كـ Infra / SoftPOS

دي تقييمات داخلية لنظامك، مش أرقام رسمية.

infraMaturityScore: 90
certificationScore: 95 (حاصل على Kernel وSecurity Certs للشبكات الرئيسية) 
nearpay.io
+3
وَمْضَة
+3
nearpay.io
+3

developerExperienceScore: 80 (API واضح، بس الوثائق مش بنفس ضخامة Stripe) 
docs.nearpay.io
+2
nearpay.io
+2

adoptionInKSA_PosEcosystem: 85 (SoftPOS + شراكات PayTabs/DigitalPay + نمو NFC في السعودية) 
nearpay.io
+2
Markets and Data
+2

================================================================================
القسم 11: المميزات والعيوب
⭐ المميزات (بالعربية):

لا تحتاج أجهزة POS تقليدية: تحوّل أي جوال/تابلت NFC لنقطة بيع معتمدة (SoftPOS / Tap-to-Phone). 
digitalpay.sa
+4
nearpay.io
+4
nearpay.io
+4

بنية تحتية سعودية متوافقة مع mada ومع شبكات عالمية (Visa / MasterCard / Amex). 
ويكيبيديا
+3
وَمْضَة
+3
nearpay.io
+3

مناسبة لـ PSPs والمنصات اللي عايزة تضيف قبول حضوري (POS) بسرعة في منتجاتها. 
IBS Intelligence
+3
nearpay.io
+3
nearpay.io
+3

معتمدة Visa Tap-to-Phone (VRTPKS) من 2020، ومن أوائل الحلول اللي أخذت الشهادة دي. 
nearpay.io

❗ العيوب (بالعربية):

مش بوابة دفع "جاهزة للتاجر" زي HyperPay؛ محتاجة PSP / بنك / منصة تستخدمها وتقدّم المنتج للتاجر. 
IBS Intelligence
+4
nearpay.io
+4
nearpay.io
+4

مفيش تسعير علني واضح؛ لازم تروح عن طريق شريك أو عقد B2B. 
nearpay.io
+2
nearpay.io
+2

دورها الأساسي في in-person payments؛ مش حل شامل لوحده لـ Online/E-commerce بدون PSP فوقه. 
Markets and Data
+3
nearpay.io
+3
nearpay.io
+3

⭐ المميزات (بالإنجليزية – للـ Docs):

Payment Infrastructure as a Service focused on SoftPOS / Tap-to-Phone for KSA. 
IBS Intelligence
+4
nearpay.io
+4
nearpay.io
+4

Certified for major schemes (Visa, MasterCard, Amex, Mada) with full kernel + security certifications. 
nearpay.io
+4
وَمْضَة
+4
nearpay.io
+4

Enables PSPs/MSPs/banks to launch in-person NFC payments quickly without building infra from scratch. 
nearpay.io
+4
nearpay.io
+4
nearpay.io
+4

❗ العيوب (بالإنجليزية):

Not a direct merchant-facing PSP; pricing and offering depend on partners. 
Markets and Data
+4
nearpay.io
+4
nearpay.io
+4

Public documentation is good but not as rich as global giants like Stripe/Adyen. 
docs.nearpay.io
+2
nearpay.io
+2

================================================================================
القسم 12: ملاحظات خاصة بـ PayGate Optimizer

NearPay ما تدخلش في مقارنة "مين أرخص بوابة مدى أونلاين"
بل في خانة:
"هل البوابة عندها SoftPOS/Tap-to-Phone قوي مبني على NearPay أو ما يعادلها؟"

اقتراح حقل:

"softpos": {
  "poweredByNearpay": true,
  "note": "SoftPOS / Tap-to-Phone infrastructure provided by NearPay via partners (DigitalPay, PayTabs, banks, etc.)"
}


في واجهة المقارنة للتاجر:

لو بوابة عندها SoftPOS مبني على NearPay →
تديها Boost لـ:

تجار التوصيل

المحلات اللي عايزة تستغنى عن POS Hardware

المشاريع اللي عندها فريق ميداني / مناديب.

Last Updated:
2025-12-09