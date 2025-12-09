# Spotii – بيانات مزود الـ BNPL (2025-12-09)

================================================================================
القسم 1: المعلومات الأساسية
================================================================================

**المعرّف (slug):**  
spotii

**الاسم بالعربية:**  
سبوتي

**الاسم بالإنجليزية:**  
Spotii

**الوصف المختصر بالعربية:**  
منصة "اشتر الآن وادفع لاحقًا" (BNPL) تأسست في الإمارات،  
تسمح للعملاء بتقسيم المشتريات على 4 دفعات بدون فوائد،  
وكانت نشِطة في الإمارات والسعودية، ثم استحوذت عليها Zip (أستراليا)،  
ولا حقًا استحوذت عليها NymCard كبنية تقنية للـ credit-on-demand. :contentReference[oaicite:0]{index=0}  

**الوصف المختصر بالإنجليزية:**  
A Middle East BNPL provider (UAE–KSA) that lets shoppers split purchases  
into four interest-free installments, initially acquired by Zip Co (Australia)  
and later bought by NymCard to power credit-on-demand products. :contentReference[oaicite:1]{index=1}  

**الموقع الرسمي:**  
https://www.spotii.com :contentReference[oaicite:2]{index=2}  

**الفئة في النظام:**  
bnpl_provider / payment_method

**الحالة الحالية:**  
`legacy_bnpl` – تعمل تاريخيًا كـ BNPL،  
لكن بعد استحواذ Zip ثم NymCard، وضع العلامة التجارية قد يتغير مستقبلاً  
(مهم تقلّل شوية من الـ futureProofScore في المقارنات). :contentReference[oaicite:3]{index=3}  

================================================================================
القسم 2: نموذج المنتج (Product Model)
================================================================================

من موقع Spotii ووصف التطبيق: :contentReference[oaicite:4]{index=4}  

1. **تقسيط على 4 دفعات (Pay in 4):**
   - دفع 25% وقت الشراء (الدفعة الأولى).  
   - 3 دفعات لاحقة متساوية.  
   - بدون فوائد وبدون تكلفة إضافية معلنة للعميل (“No Interest, No Cost”). :contentReference[oaicite:5]{index=5}  

2. **Shop Now, Pay Later (BNPL at checkout):**
   - يختار العميل "Spotii – Shop now, pay later" كطريقة دفع في صفحة الدفع،  
     ثم يتم تحويله لواجهة Spotii لتحديد خطة الدفعات والتسجيل. :contentReference[oaicite:6]{index=6}  

3. **الاعتماد على البطاقة البنكية:**
   - التسجيل يتطلب بريد إلكتروني ورقم جوال وبطاقة خصم/ائتمان سارية،  
     ويتم سحب الأقساط لاحقًا من البطاقة. :contentReference[oaicite:7]{index=7}  

في JSON عندك:

```json
"bnplModel": {
  "installmentsCount": 4,
  "firstPaymentPercent": 25,
  "interestFree": true,
  "customerFees": "none_advertised"
}
================================================================================
القسم 3: الرسوم والتسعير
للعميل (Shoppers)
Spotii تعلن للمستخدم النهائي: No Interest, No Cost
– بمعنى لا فوائد على التقسيط ولا رسوم إضافية ظاهرة للعميل. 
noonpayments.com
+1

للتاجر (Merchants)
مثل أغلب مزودي BNPL، الربح الأساسي من العمولة على التاجر (نسبة من قيمة العملية).

لا يوجد جدول أسعار عام؛ تسعير مخصص حسب القطاع وحجم التاجر.

بعد استحواذ Zip ثم NymCard، قد يتغير الموديل أو يُعاد دمجه في منتجاتهم. 
LinkedIn
+2
noon payments Blog
+2

في نظامك:

"merchantPricing": {
  "model": "revenue_share_on_txn",
  "rangePercent": null,
  "notes": "Custom merchant fees; brand now part of Zip/NymCard stack."
}
================================================================================
القسم 4: العمليات والتسوية (Ops)
من منظور التاجر:

التاجر يحصل على قيمة الطلب من Spotii (أو من شريك PSP)
بعد الموافقة على العملية، وSpotii تتولى تحصيل الأقساط من العميل. 
Technoheaven Consultancy
+2
LinkedIn
+2

التسوية (Settlement):

تعتمد على عقد التاجر/البوابة؛

غالبًا T+1 إلى T+7 أيام عمل مثل باقي مزودي BNPL.

في نموذجك:

"settlementDaysMin": 1,
"settlementDaysMax": 7,
"settlementNotes": "Depends on acquiring PSP / contract; typical BNPL settlement."
================================================================================
القسم 5: التكاملات (Integrations)
من صفحات “For Merchants / Developers” والمواقع المتعاملة مع Spotii: 
noonpayments.com
+2
noonpayments.com
+2

E-commerce platforms (قبل الاستحواذ):

Plugins أو تكاملات مخصّصة لـ WooCommerce, Magento, Shopify إلخ (حسب المتجر).

Merchant Integration Flow:

يضيف التاجر Spotii كخيار “BNPL” في صفحة الدفع.

عند اختيارها، يُعاد توجيه العميل لواجهة Spotii لاختيار خطة التقسيط.

بعد استحواذ Zip ونقل الأصول لنظام NymCard: 
noonpayments.com
+2
LinkedIn
+2

من المحتمل إعادة استخدام البنية كباك إند BNPL داخل حلول أخرى وليس كعلامة تجارية مستقلة جديدة.

لذلك اعتبر Spotii في نظامك كـ:

"integrationStatus": "legacy",
"recommendedForNewMerchants": false
(يعني: تظهر في المقارنات التاريخية، لكن المنصّة تقترح بدائل أحدث مثل Tabby/Tamara عندما يكون التاجر جديد.)

================================================================================
القسم 6: علاقة Spotii بوسائل الدفع
من طريقة التسجيل والدفع: 
noonpayments.com
+1

Spotii تعتمد على بطاقات الخصم والائتمان كأساس:

Visa

MasterCard

احتمال دعم Mada عبر البوابات الشريكة في السعودية (غير موثق رسميًا في الموقع، فاعتبره unknown).

في JSON:

"underlyingPaymentMethods": [
  "visa",
  "mastercard"
],
"madaSupport": "via_partner_psp_if_any"
================================================================================
القسم 7: التقييمات (0–100) – internal scoring
القيم دي لاستخدام PayGate Optimizer داخليًا، تقدر تعدّلها لاحقًا لو عندك Data حقيقية.

historicAdoptionKSAUAE: 75 (كانت لاعب BNPL ناشط في الإمارات والسعودية قبل الاستحواذ) 
LinkedIn
+2
noon payments Blog
+2

uxScore: 80 (4 دفعات، واجهة بسيطة، No cost للعميل) 
noonpayments.com
+1

merchantDocsScore: 65 (توثيق وتكامل أقل وضوحًا من Tabby/Tamara الآن). 
noonpayments.com
+1

futureProofScore: 40 (بسبب الاستحواذات المتتالية واحتمال ذوبان العلامة داخل منصات Zip/NymCard). 
noonpayments.com
+2
LinkedIn
+2

================================================================================
القسم 8: المميزات والعيوب
⭐ المميزات (بالعربية):
تجربة تقسيط بسيطة: 4 دفعات، 25% الآن والباقي لاحقًا، بدون فوائد ولا رسوم معلنة للعميل. 
noonpayments.com
+1

منتج BNPL موجه لمتاجر التجارة الإلكترونية في الخليج، خصوصًا الإمارات والسعودية. 
noonpayments.com
+2
Technoheaven Consultancy
+2

❗ العيوب (بالعربية):
تغيّر الملكية مرتين (Zip ثم NymCard)، ما يجعل مستقبل العلامة Spotii غير واضح للتجار الجدد. 
LinkedIn
+2
noon payments Blog
+2

لا توجد معلومات تسعير واضحة للتاجر ولا استراتيجية توسّع معلنة حالياً مثل Tabby/Tamara. 
noonpayments.com
+2
LinkedIn
+2

بوضع السوق الحالي في 2025، Tabby/Tamara أكثر حضورًا وانتشارًا في السعودية من Spotii.

⭐ Pros (English):
Simple, interest-free BNPL with 4 installments and no advertised shopper fees. 
noonpayments.com
+1

Historically active in UAE and KSA e-commerce, offering “Shop now, pay later” at checkout. 
noonpayments.com
+2
Technoheaven Consultancy
+2

❗ Cons (English):
Brand has gone through multiple acquisitions (Zip then NymCard); long-term roadmap as a standalone BNPL is uncertain. 
LinkedIn
+2
noon payments Blog
+2

No transparent merchant pricing; less visible ecosystem compared to Tabby/Tamara in 2025.

================================================================================
القسم 9: ملاحظات خاصة بـ PayGate Optimizer
Spotii مهم تظهر في النظام لأسباب تاريخية أو لو عندك عملاء قدام بيستخدموها فعلاً.

لكن في توصية البوابة للأعمال الجديدة في السعودية،
غالبًا Tabby/Tamara هتكون أعلى في الأولوية.

مثال JSON مختصر:

"spotii": {
  "category": "bnpl",
  "status": "legacy_bnpl",
  "recommendedForNewMerchants": false,
  "notes": "Acquired by Zip then NymCard; consider Tabby/Tamara for new KSA merchants."
}
Last Updated:
2025-12-09