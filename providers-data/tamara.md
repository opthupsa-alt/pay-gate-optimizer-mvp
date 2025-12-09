# Tamara – بيانات مزود الـ BNPL (2025-12-09)

================================================================================
القسم 1: المعلومات الأساسية
================================================================================

**المعرّف (slug):**  
tamara

**الاسم بالعربية:**  
تمارا

**الاسم بالإنجليزية:**  
Tamara

**الوصف المختصر:**  
مزود "اشتر الآن وادفع لاحقاً" (BNPL) سعودي، متوافق مع الشريعة،  
يسمح للعميل بالدفع لاحقًا أو التقسيط حتى 24 شهرًا بدون رسوم تأخير،  
ويستهدف السعودية ودول المنطقة. :contentReference[oaicite:0]{index=0}  

**الموقع الرسمي (المستخدمين – السعودية):**  
https://tamara.co/en-sa :contentReference[oaicite:1]{index=1}  

**صفحة الأعمال (Tamara for Business – KSA):**  
https://tamara.co/en-sa/partners :contentReference[oaicite:2]{index=2}  

**التصنيف في النظام:**  
bnpl_provider / payment_method

**الحالة:**  
active

================================================================================
القسم 2: نموذج العمل والتسعير – نظرة عامة
================================================================================

### أولاً: للعميل (المستخدم النهائي في السعودية)

- تمارا تعلن بوضوح:  
  - **"No late fees, Sharia compliant"** (بدون رسوم تأخير، متوافقة مع الشريعة). :contentReference[oaicite:3]{index=3}  
- يمكن للعميل:
  - الدفع لاحقًا أو على أقساط حتى 24 شهرًا. :contentReference[oaicite:4]{index=4}  

**رسوم المعالجة على العميل (Processing Fees – KSA):**

- حسب صفحة الدعم: في السعودية، عند اختيار خطة دفع مقسّمة،  
  يمكن أن تُطبق **رسوم معالجة تصل إلى 1% من إجمالي الطلب، بحد أقصى 50 ر.س**. :contentReference[oaicite:5]{index=5}  
- تمارا توضّح أيضًا أن أرباحها تأتي أساسًا من الرسوم التي تحصل عليها من المتاجر،  
  وقد تُضاف رسوم خدمة بسيطة في بعض الحالات، مع الاستمرار بعدم فرض فوائد أو رسوم تأخير. :contentReference[oaicite:6]{index=6}  

### ثانيًا: للتاجر (Merchant)

- تمارا تربح من **الرسوم المفروضة على المتاجر** (عمولة على كل عملية)،  
  وإن لم تُعلن أرقامًا ثابتة للعامة. :contentReference[oaicite:7]{index=7}  
- النموذج الشائع لباقي مزودي BNPL في السوق:  
  - نسبة من قيمة العملية (مثلاً 3–7%) تختلف حسب القطاع وحجم التاجر ومدة التقسيط.  
- لذلك في نظامك:
  - **لا تضع رقم ثابت**، بل خزّنها كـ `null` مع ملاحظة "يحتاج عرض سعر من Tamara".

================================================================================
القسم 3: منتجات تمارا (BNPL Products)
================================================================================

من موقع تمارا وصفحات المتاجر الشريكة: :contentReference[oaicite:8]{index=8}  

1. **Pay Later / Pay in 30 days:**
   - الدفع بعد فترة (حتى 30 يوم) بدون فوائد وبدون رسوم تأخير.

2. **Pay in Installments (up to 24 months):**
   - تقسيط قيمة الفاتورة على عدة أشهر (من 3 أو 4 حتى 24 شهرًا)  
   - لا توجد فوائد، لكن في بعض الخطط تطبق **processing fee** كما في KSA (حتى 1% بحد أقصى 50 ر.س). :contentReference[oaicite:9]{index=9}  

3. **Pay in Full with Tamara:**
   - دفع كامل من خلال تمارا مع مزايا Deals / Cashback في بعض المنتجات مثل Tamara Smart. :contentReference[oaicite:10]{index=10}  

4. **Tamara Smart / Smart+:**
   - برامج ولاء / Cashback وميزات إضافية للمستخدم، باشتراك شهري بسيط. :contentReference[oaicite:11]{index=11}  

================================================================================
القسم 4: العمليات والتسوية (Ops)
================================================================================

**من منظور التاجر:**

- تمارا تعلن:  
  - "Customers split purchases into up to 24 months. **You get paid upfront, every time.**" :contentReference[oaicite:12]{index=12}  
- أي أن التاجر يستلم كامل قيمة الفاتورة من تمارا (أو من خلال بوابة الدفع المتكاملة معها) في وقت قريب من عملية الشراء، وتمارا تتولى تحصيل الأقساط من العميل.

**التسوية (Settlement) للتاجر:**

- عادةً:  
  - تسوية أسبوعية أو شبه فورية حسب العقد (مش مذكور رقم واضح، لكن كثير من الكيس ستادي تشير أن التسوية تكون ضمن دورة شبه أسبوعية).  
- في نظامك يمكنك وضع:
  - `settlementDaysMin = 1`  
  - `settlementDaysMax = 7`  
  - مع ملاحظة "حسب العقد / طريقة التكامل".

**وقت التفعيل (Activation):**

- التاجر يحتاج:
  - فتح حساب Merchant مع Tamara  
  - إرفاق بيانات الشركة والـ KYC  
  - الموافقة على النشاط والـ Risk  
- docs وplugins توضح أن التاجر لا يستطيع تفعيل إضافة تمارا إلا بعد إنشاء حساب تاجر واعتماده. :contentReference[oaicite:13]{index=13}  

================================================================================
القسم 5: الدعم الفني والتوثيق
================================================================================

**بوابة التوثيق (Developers):**  
https://docs.tamara.co :contentReference[oaicite:14]{index=14}  

تقدم:

- Direct API integration (checkout, orders, webhooks، إلخ). :contentReference[oaicite:15]{index=15}  
- In-store checkout (POS / QR). :contentReference[oaicite:16]{index=16}  
- تكاملات جاهزة مع Shopify, WooCommerce, Magento, Zid, SFCC، وغيرها. :contentReference[oaicite:17]{index=17}  

**Base URLs للـ API:** :contentReference[oaicite:18]{index=18}  

- Sandbox: `https://api-sandbox.tamara.co`  
- Production: `https://api.tamara.co`

**الدعم للتاجر:**

- Email / Tickets من خلال Tamara Business Portal  
- Merchant Kit + Integration Guide + Merchant Success / Account Managers للتجّار الكبار. :contentReference[oaicite:19]{index=19}  

================================================================================
القسم 6: التقييمات (0–100) – كـ Payment Method
================================================================================

> هذه أرقام داخلية لمحرّك المقارنات عندك، يمكن تعديلها لاحقاً إذا جمعت Data حقيقية.

**adoptionScore (انتشار بين العملاء في السعودية):** 88  
**uxScore (سهولة الاستخدام للعميل):** 85  
**trustScore (ثقة السوق):** 85  

**impactOnConversionScore:** 88  
> BNPL بشكل عام يقلل الكاش عند التسليم ويزيد متوسط قيمة السلة ويقلل المرتجعات لبعض القطاعات. :contentReference[oaicite:20]{index=20}  

**onboardingScore (للتجار):** 80  
**supportScore:** 80  
**docsScore:** 85  

================================================================================
القسم 7: علاقة تمارا بوسائل الدفع الأساسية
================================================================================

تمارا ليست Card Scheme، بل طبقة تقسيط فوق وسائل دفع أخرى:

- البطاقات البنكية (Mada عبر البوابات، Visa, MasterCard). :contentReference[oaicite:21]{index=21}  
- Apple Pay / Mada / Saved Cards عبر التكامل مع البوابات ومنصة تمارا نفسها. :contentReference[oaicite:22]{index=22}  

في JSON عندك يمكنك تمثيل:

```json
"underlyingPaymentMethods": [
  "mada",
  "visa",
  "mastercard",
  "apple_pay"
]
================================================================================
القسم 8: القطاعات المدعومة

من الكيس ستادي والمتاجر المتكاملة مع تمارا: 
Akurateco
+3
ردسي
+3
femi9.com
+3

Fashion & Apparel — قوي جدًا

Beauty & Cosmetics — قوي

Electronics & Appliances — قوي

Furniture & Home — قوي

Travel & Airlines / Hotels — مدعوم لبعض الشركاء

Education / School Fees — موجود في بعض الحملات (Back to school) 
tamara.co

Groceries — في شراكات معينة

High-risk / Adult / Gambling / Crypto — غير مدعوم

في جدول القطاعات في نظامك:

ecommerce — مدعوم

retail — مدعوم

services — مدعوم جزئياً (عيادات، صالونات، بعض الخدمات)

saas — أقل شيوعًا لكن ممكن لبعض B2C

healthcare — مقيد بحسب النشاط

travel — مدعوم لأنشطة مختارة

gaming / betting / adult — مرفوض أو شديد التقييد

================================================================================
القسم 9: التكاملات (Integrations)

Plugins رسمية / موثقة: 
tamara.co
+4
تمارا
+4
تمارا
+4

Shopify:

Tamara Payment App في Shopify App Store

دعم Site Messaging / Widgets و Logo في الفوتر.

WooCommerce (WordPress):

Plugin رسمي "Tamara Gateway" مع إعدادات Basic و Advanced.

Magento:

Tamara Magento Extension لتمكين الدفع بالكامل أو بالتقسيط حتى 24 شهر بدون رسوم تأخير.

Zid (زد):

تكامل رسمي: "Boost your Zid store with Tamara’s flexible payment options" (الدفع كامل أو حتى 24 شهر بدون رسوم تأخير مع استلام المبلغ كاملًا مقدمًا). 
tamara.co

Salesforce Commerce Cloud (SFCC):

Cartridge رسمي مع إعدادات Tamara Payment و API endpoint. 
تمارا

تكامل مباشر عبر API: 
تمارا
+2
تمارا
+2

REST API

Webhooks (order events, capture, refund, cancel…)

Sandbox + Production environments

في JSON عندك:

"availableThroughPlatforms": [
  "shopify",
  "woocommerce",
  "magento",
  "zid",
  "sfcc",
  "custom_api"
]

================================================================================
القسم 10: المميزات والعيوب
⭐ المميزات للتاجر (بالعربية):

شريعة – بدون فوائد وبدون رسوم تأخير: نقطة تسويق قوية جدًا في السعودية، ترفع ثقة العميل. 
femi9.com
+4
tamara.co
+4
tamara.co
+4

مرونة عالية في الدفع: دفع لاحق أو تقسيط حتى 24 شهر، مع إمكانية دمجها في المتجر أو تطبيقك أو Zid / WooCommerce / Shopify / Magento. 
tamara.co
+4
tamara.co
+4
tamara.co
+4

تزيد المبيعات وتقلل الـ Cash on Delivery وتخفض الـ Refunds حسب دراسات الشركاء. 
tamara.com
+1

المتجر يحصل على كامل المبلغ مقدمًا، وتمارا تتحمل تحصيل الأقساط ومخاطر التأخير. 
tamara.co
+2
tamara.co
+2

❗ العيوب للتاجر (بالعربية):

عمولة تمارا على التاجر أعلى من عمولة الكروت العادية؛
وبالتالي غير مناسبة للهوامش الربحية الضعيفة جدًا. 
tamara.co
+2
femi9.com
+2

ليست PSP مستقل؛ تحتاج تكامل معها مباشرة أو عبر بوابة، وتظل في كل الحالات طريقة دفع إضافية وليست بديلًا عن Mada/بطاقات. 
tamara.com
+5
تمارا
+5
تمارا
+5

تحتاج توافق نشاط التاجر مع سياسة Tamara للقطاعات والمخاطر.

⭐ المميزات بالإنجليزية (for docs):

Sharia-compliant BNPL with no late fees and no interest, which is crucial in KSA. 
femi9.com
+4
tamara.co
+4
tamara.co
+4

Flexible plans: Pay later, split in installments up to 24 months, pay in full, and more. 
tamara.com
+3
tamara.co
+3
tamara.co
+3

Strong ecosystem: Shopify, WooCommerce, Magento, Zid, SFCC, plus direct API. 
تمارا
+5
تمارا
+5
تمارا
+5

❗ العيوب بالإنجليزية:

Merchant commission is typically higher than standard card processing fees. 
tamara.co
+2
femi9.com
+2

Not a standalone PSP; always an add-on payment method. 
tamara.com
+5
تمارا
+5
تمارا
+5

Sector eligibility and risk policies can exclude some businesses.

================================================================================
القسم 11: ملاحظات خاصة بـ PayGate Optimizer

في واجهة المقارنات، تمارا يجب أن تظهر كـ Boost فوق البوابة، مش بديل عنها:

أي بوابة تدعم Tamara + نشاط B2C / تجزئة = نقطة قوة كبيرة للتاجر السعودي.

UI Ideas:

Badge:

"يدعم تمارا (تقسيط حتى 24 شهر بدون رسوم تأخير)"

Tooltip يوضح: "في السعودية قد تُضاف رسوم معالجة حتى 1% (بحد أقصى 50 ر.س) على بعض خطط التقسيط – بدون فوائد أو رسوم تأخير." 
tamara.co
+3
support.tamara.co
+3
إكسترا
+3

JSON Example:

"bnpl": {
  "tamara": {
    "supported": true,
    "integration_type": "via_plugin_or_direct",
    "notes": "Sharia-compliant BNPL with no late fees; merchant fees negotiated per contract."
  }
}


Last Updated:
2025-12-09