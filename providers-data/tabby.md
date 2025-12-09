# Tabby – بيانات مزود الـ BNPL (2025-12-09)

================================================================================
القسم 1: المعلومات الأساسية
================================================================================

**المعرّف (slug):**  
tabby

**الاسم بالعربية:**  
تابي

**الاسم بالإنجليزية:**  
Tabby

**الوصف المختصر:**  
مزود "اشتر الآن وادفع لاحقاً" (BNPL) في السعودية والإمارات،  
يسمح للعملاء بتقسيم المدفوعات على 3 أو 4 دفعات بدون فوائد،  
أو حتى خطط أطول تصل لـ 12 شهر، مع بطاقة Tabby Card وخدمات تقسيط إضافية. :contentReference[oaicite:1]{index=1}  

**الموقع الرسمي (مستوى المستهلك):**  
https://tabby.ai

**صفحة السعودية للمستهلك:**  
https://tabby.ai/en-SA :contentReference[oaicite:2]{index=2}  

**صفحة الأعمال (للتجار):**  
https://tabby.ai/en-AE/business :contentReference[oaicite:3]{index=3}  

**الفئة في النظام:**  
bnpl_provider / payment_method

**الحالة:**  
active

================================================================================
القسم 2: نموذج العمل والتسعير (نظرة عامة)
================================================================================

**للعميل (المستخدم النهائي في السعودية):**

- Pay in 3:  
  - **بدون فوائد** وبدون رسوم إضافية. :contentReference[oaicite:4]{index=4}  
- Pay in 4 في السعودية:  
  - **1% رسوم معالجة (processing fee)** على الطلبات Pay in 4، اعتباراً من 18 أغسطس 2025. :contentReference[oaicite:5]{index=5}  
- لا توجد رسوم تأخير / collection fees على طلبات KSA  
  (تم إلغاء رسوم التأخير من ديسمبر 2023، وما زالت السياسة أن لا توجد collection fees، مع إمكانية رسوم "legal processing" في حالات حساب سيئ جداً في بعض المنتجات طويلة الأجل). :contentReference[oaicite:6]{index=6}  

**للتاجر (Merchant):**

- Tabby تأخذ عمولة من التاجر (Percentage + أحياناً مبلغ ثابت) لكل عملية BNPL.  
- الأرقام الدقيقة **لا يتم نشرها علناً**؛ يتم تحديدها حسب القطاع وحجم المبيعات.  
- غالباً النطاق يكون قريب من:  
  - 3–7% من قيمة السلّة (حسب القطاع وفترة التقسيط)،  
  - بدون رسوم إعداد أو اشتراك شهري في معظم الحالات،  
  - التاجر يحصل على كامل المبلغ مقدمًا، والعميل يدفع لتابي بالتقسيط. :contentReference[oaicite:7]{index=7}  

> في نموذجك انت:  
> **ما تحطش أرقام كلية على التاجر إلا لو جبت عقد حقيقي**؛  
> خليه `null` أو `range` مع ملاحظة "يحتاج عرض سعر من Tabby".

================================================================================
القسم 3: خصائص المنتج (BNPL Product)
================================================================================

Tabby بتقدم أكتر من موديل: :contentReference[oaicite:8]{index=8}  

1. **Pay in 3 / Pay in 4 (Short-term BNPL):**
   - تقسيط الفاتورة على 3 أو 4 دفعات شهرية.  
   - بدون فوائد.  
   - في السعودية:  
     - Pay in 3: بدون رسوم إضافية.  
     - Pay in 4: 1% processing fee على العميل (KSA فقط).  

2. **Long-term financing (حتى 12 شهر):**
   - خطط تقسيط أطول (حتى 12 شهر) لبعض المتاجر والقطاعات. :contentReference[oaicite:9]{index=9}  

3. **Tabby Card:**
   - بطاقة فيزا افتراضية/حقيقية،  
   - تسمح بالشراء من أي تاجر يقبل Visa،  
   - يتم تجميع المشتريات في كشف شهري، ويمكن الدفع حتى 40 يوم لاحقاً. :contentReference[oaicite:10]{index=10}  

4. **Tabby Payment Links:**
   - تقدر تبعت للعميل لينك دفع (SMS/Push) يكمل منه طلب Tabby بدون ما يكون checkout مدمج. :contentReference[oaicite:11]{index=11}  

================================================================================
القسم 4: العمليات والتسوية (Ops)
================================================================================

**من منظور التاجر:**

- التاجر يستلم كامل قيمة الفاتورة من Tabby (أو من الشريك مثل PayTabs/Geidea/Tap) أثناء أو بعد إتمام العملية بفترة قصيرة. :contentReference[oaicite:12]{index=12}  
- Tabby تتحمّل مخاطر تحصيل الأقساط من العميل.  

**التسوية (Settlement) للتاجر:**

- تختلف حسب الشراكة (مباشر / عبر بوابة)، لكن غالباً:  
  - settlement يومي أو كل بضعة أيام،  
  - بنفس جدول تسوية البوابة (لو Tabby مفعّلة من خلالها).

**وقت التفعيل (Activation):**

- يحتاج التاجر:  
  - فتح حساب Merchant مع Tabby،  
  - تقديم بيانات الشركة،  
  - التقييم والموافقة. :contentReference[oaicite:13]{index=13}  
- في العادة من 1 إلى 5 أيام عمل (تقديري).

================================================================================
القسم 5: الدعم الفني والتوثيق
================================================================================

**Documentation / API:**

- Tabby عندها API Docs واضح للمطورين: Checkout, Payments, Webhooks, Disputes. :contentReference[oaicite:14]{index=14}  

**Platforms & Guides:**

- **Shopify:** Plugin رسمي + خطوات تثبيت في docs. :contentReference[oaicite:15]{index=15}  
- **WooCommerce:** Plugin + guides، مع استخدام API keys من لوحة Tabby. :contentReference[oaicite:16]{index=16}  
- **Self-hosted / Custom:** تكامل مباشر عبر API + Webhooks. :contentReference[oaicite:17]{index=17}  

**الدعم للتاجر:**

- Email / Ticket عبر Tabby Business Portal.  
- Account Manager للتجّار الكبار.  

================================================================================
القسم 6: التقييمات (0–100) – في سياق "طريقة دفع"
================================================================================

**adoptionScore (انتشار بين العملاء في KSA/UAE):** 90  
**uxScore (سهولة الاستخدام للعميل):** 88  
**trustScore (ثقة السوق):** 85  

**impactOnConversionScore (تأثيرها على الـ Conversion):** 90  
> BNPL عموماً ترفع متوسط قيمة السلة وتقلل الـ Cart Abandonment. :contentReference[oaicite:18]{index=18}  

**onboardingScore (للتجار):** 80  
**supportScore:** 80  
**docsScore:** 85  

================================================================================
القسم 7: طرق الدفع التي تعتمد عليها Tabby
================================================================================

Tabby نفسها ليست Card Scheme؛ هي **طبقة تقسيط فوق وسائل دفع أخرى**:

- بطاقات خصم/ائتمان (Visa / MasterCard) مربوطة بحساب العميل. :contentReference[oaicite:19]{index=19}  
- Tabby Card نفسها تعمل كـ Visa. :contentReference[oaicite:20]{index=20}  

في نموذج البيانات عندك ممكن تختصر كده:

```json
"underlyingPaymentMethods": [
  "visa",
  "mastercard",
  "tabby_card"
]
================================================================================
القسم 8: القطاعات المدعومة

Tabby تستهدف تقريبًا كل قطاعات الـ Retail & E-commerce المسموح بها قانونيًا:

fashion & apparel — قوي جداً

electronics & gadgets — قوي

beauty & cosmetics — قوي

furniture & home — قوي

travel & tickets — مدعوم لبعض الشركاء

groceries — محدود / شراكات معينة

high-risk / adult / gambling / crypto — غير مدعوم

في نموذجك:

ecommerce — مدعوم بقوة

retail — مدعوم بقوة

services — مدعوم جزئياً (مثلاً عيادات، صالونات…)

saas — أقل شيوعاً، لكن ممكن في حالات B2C

healthcare — مدعوم في حدود وأنشطة مسموحة

gaming / betting / adult — مرفوض أو مقيّد

================================================================================
القسم 9: التكاملات (Integrations)

تكامل مباشر (Official Integrations & Plugins):

Shopify

WooCommerce

Magento (بعض الـ Plugins)

Self-hosted (Laravel/Node/… عبر API) 
Brand Leaps Technologies LLC
+4
docs.tabby.ai
+4
docs.tabby.ai
+4

تكامل عبر بوابات دفع (Gateways):

Tabby متكاملة مع عدد كبير من البوابات والـ Orchestration layers:

Geidea: دعم Tabby في الإمارات والسعودية كـ Payment Method. 
Geidea

PayTabs: Tabby كـ BNPL ضمن طرق الدفع في PayTabs. 
PayTabs Support Portal

Telr: Telr + Tabby partnership لـ BNPL في KSA/UAE. 
telr.com

Tap: دعم Tabby ضمن Payment Methods الخاصة بـ Tap. 
tap.company

MoneyHash (Orchestration): شراكة لتمكين Tabby عبر Unified API في KSA/UAE (2025). 
وَمْضَة

Fatora, Others: Integrations توفر Tabby عبر API. 
fatora.io

في JSON ممكن تمثيل:

"availableThroughProviders": [
  "geidea",
  "paytabs",
  "telr",
  "tap",
  "moneyhash",
  "fatora",
  "direct_api"
]

================================================================================
القسم 10: المميزات والعيوب
⭐ المميزات للتاجر (بالعربية):

تأثير قوي على المبيعات: يرفع متوسط قيمة السلة ويقلل الـ Cart Abandonment. 
Geidea
+2
tabby.ai
+2

مرن جداً: Pay in 3 / 4، وخطط أطول تصل إلى 12 شهر لأصناف / تذاكر / منتجات كبيرة. 
أمازون
+3
tabby.ai
+3
tabby.ai
+3

شغال أونلاين وفي نقاط البيع POS، مع Tabby Card وPayment Links. 
tabby.ai
+2
docs.tabby.ai
+2

تكامل جاهز مع Shopify / WooCommerce / Geidea / PayTabs / Tap / Telr… إلخ، ما يقلل مجهود التطوير. 
tap.company
+4
docs.tabby.ai
+4
Geidea
+4

متوافق مع الشريعة في السعودية: بدون فوائد، ورسوم واضحة ومعلنة (1% Processing على Pay in 4 فقط، بدون رسوم تأخير). 
support.tabby.ai
+3
tabby.ai
+3
tabby.ai
+3

❗ العيوب للتاجر (بالعربية):

عمولة Tabby على التاجر عادةً أعلى من عمولة بوابة الدفع العادية (3–7%)، فلا تناسب هوامش الربح الضعيفة جداً.

ليست وسيلة دفع أساسية لوحدها؛ لازم تكون مضافة مع Visa/Master/Mada من بوابة دفع أخرى.

تحتاج توافق القطاع مع سياسة Tabby؛ مش كل النشاطات مقبولة.

⭐ المميزات بالإنجليزية (for your docs):

Improves conversion rates and average order value significantly. 
Geidea
+2
tabby.ai
+2

Offers multiple plans (Pay in 3/4, longer-term financing, Tabby Card, payment links). 
docs.tabby.ai
+4
tabby.ai
+4
tabby.ai
+4

Strong ecosystem of integrations with major PSPs and e-commerce platforms. 
tap.company
+4
docs.tabby.ai
+4
Geidea
+4

❗ العيوب بالإنجليزية:

Merchant commission is relatively high compared to standard card acquiring.

Not a standalone PSP; relies on other gateways or direct integration.

Sector eligibility and risk policies may reject certain merchants.

================================================================================
القسم 11: ملاحظات خاصة بـ PayGate Optimizer

في واجهة المقارنات، Tabby لازم تظهر كـ ميزة إضافية فوق البوابة، مش كبديل كامل.

مثال منطق القرار:

إذا التاجر يستهدف:

Fashion / E-commerce B2C

Average order value فوق 200–300 ريال

ومعاه بوابة تدعم Tabby، تعطيه Boost قوي في النتيجة.

UI Suggestions (front-end):

Badge:

"يدعم تابي (تقسيط حتى 4 دفعات بدون فوائد)"

لو السعودية: "في السعودية: Pay in 3 بدون رسوم، Pay in 4 برسوم 1% على العميل."

في الـ JSON الرئيسي للبوابات:

"bnpl": {
  "tabby": {
    "supported": true,
    "integration_type": "via_gateway_or_direct",
    "notes": "Requires Tabby merchant account; fees are merchant-specific and not public."
  }
}


Last Updated:
2025-12-09