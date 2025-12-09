"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLocale } from "@/hooks/use-locale"

const translations = {
  ar: {
    title: "سياسة الخصوصية",
    lastUpdated: "آخر تحديث: ديسمبر 2025",
    sections: [
      {
        title: "مقدمة",
        content: "نحن في PayGate Optimizer نلتزم بحماية خصوصيتك. توضح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك الشخصية عند استخدام منصتنا."
      },
      {
        title: "المعلومات التي نجمعها",
        content: "نقوم بجمع المعلومات التالية:\n• معلومات الحساب: الاسم، البريد الإلكتروني، كلمة المرور المشفرة\n• معلومات العمل: نوع النشاط التجاري، حجم المبيعات المتوقع، القطاع\n• بيانات الاستخدام: تفضيلات البحث، نتائج المقارنات، التوصيات المحفوظة\n• معلومات تقنية: عنوان IP، نوع المتصفح، نظام التشغيل"
      },
      {
        title: "كيف نستخدم معلوماتك",
        content: "نستخدم معلوماتك لـ:\n• تقديم توصيات مخصصة لبوابات الدفع\n• تحسين تجربة المستخدم والخدمات\n• إرسال تحديثات مهمة عن المنصة (باختيارك)\n• تحليل الاتجاهات وتحسين خوارزميات التوصية\n• الامتثال للمتطلبات القانونية"
      },
      {
        title: "مشاركة المعلومات",
        content: "لا نبيع معلوماتك الشخصية. قد نشارك بيانات مجمعة وغير محددة الهوية مع:\n• مزودي بوابات الدفع لتحسين عروضهم\n• شركاء التحليلات لتحسين الخدمة\n• السلطات القانونية عند الضرورة"
      },
      {
        title: "أمان البيانات",
        content: "نستخدم تقنيات تشفير متقدمة لحماية بياناتك:\n• تشفير SSL/TLS لجميع الاتصالات\n• تشفير كلمات المرور باستخدام bcrypt\n• مراجعات أمنية دورية\n• التحكم في الوصول للموظفين"
      },
      {
        title: "حقوقك",
        content: "لديك الحق في:\n• الوصول إلى بياناتك الشخصية\n• تصحيح أو تحديث معلوماتك\n• حذف حسابك وبياناتك\n• الاعتراض على معالجة بياناتك\n• نقل بياناتك لخدمة أخرى"
      },
      {
        title: "ملفات تعريف الارتباط (Cookies)",
        content: "نستخدم ملفات تعريف الارتباط لـ:\n• تذكر تفضيلاتك (اللغة، الوضع الليلي)\n• تحليل استخدام الموقع\n• تحسين الأداء والتجربة\n\nيمكنك التحكم في ملفات تعريف الارتباط من إعدادات متصفحك."
      },
      {
        title: "التواصل معنا",
        content: "لأي استفسارات حول سياسة الخصوصية، تواصل معنا:\n• البريد الإلكتروني: privacy@paygate-optimizer.com\n• نموذج التواصل على الموقع"
      }
    ]
  },
  en: {
    title: "Privacy Policy",
    lastUpdated: "Last Updated: December 2025",
    sections: [
      {
        title: "Introduction",
        content: "At PayGate Optimizer, we are committed to protecting your privacy. This policy explains how we collect, use, and protect your personal information when using our platform."
      },
      {
        title: "Information We Collect",
        content: "We collect the following information:\n• Account Information: Name, email, encrypted password\n• Business Information: Business type, expected sales volume, sector\n• Usage Data: Search preferences, comparison results, saved recommendations\n• Technical Information: IP address, browser type, operating system"
      },
      {
        title: "How We Use Your Information",
        content: "We use your information to:\n• Provide personalized payment gateway recommendations\n• Improve user experience and services\n• Send important platform updates (by your choice)\n• Analyze trends and improve recommendation algorithms\n• Comply with legal requirements"
      },
      {
        title: "Information Sharing",
        content: "We do not sell your personal information. We may share aggregated, non-identifying data with:\n• Payment gateway providers to improve their offerings\n• Analytics partners to enhance service\n• Legal authorities when necessary"
      },
      {
        title: "Data Security",
        content: "We use advanced encryption technologies to protect your data:\n• SSL/TLS encryption for all communications\n• Password encryption using bcrypt\n• Regular security audits\n• Employee access controls"
      },
      {
        title: "Your Rights",
        content: "You have the right to:\n• Access your personal data\n• Correct or update your information\n• Delete your account and data\n• Object to data processing\n• Transfer your data to another service"
      },
      {
        title: "Cookies",
        content: "We use cookies to:\n• Remember your preferences (language, dark mode)\n• Analyze website usage\n• Improve performance and experience\n\nYou can control cookies from your browser settings."
      },
      {
        title: "Contact Us",
        content: "For any privacy policy inquiries, contact us:\n• Email: privacy@paygate-optimizer.com\n• Contact form on the website"
      }
    ]
  }
}

export default function PrivacyPage() {
  const locale = useLocale()
  const t = translations[locale]

  return (
    <div className="container py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">{t.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">{t.lastUpdated}</p>
          </CardHeader>
          <CardContent className="space-y-8">
            {t.sections.map((section, index) => (
              <div key={index} className="space-y-3">
                <h2 className="text-xl font-semibold">{section.title}</h2>
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
