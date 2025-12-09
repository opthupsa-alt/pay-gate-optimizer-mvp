"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLocale } from "@/hooks/use-locale"

const translations = {
  ar: {
    title: "شروط الاستخدام",
    lastUpdated: "آخر تحديث: ديسمبر 2025",
    sections: [
      {
        title: "القبول بالشروط",
        content: "باستخدامك لمنصة PayGate Optimizer، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام المنصة."
      },
      {
        title: "وصف الخدمة",
        content: "PayGate Optimizer هي منصة مقارنة لبوابات الدفع في المملكة العربية السعودية. نقدم:\n• مقارنات بين مزودي بوابات الدفع\n• توصيات مخصصة بناءً على احتياجات عملك\n• معلومات عن الرسوم والميزات\n• تقارير وتحليلات"
      },
      {
        title: "حساب المستخدم",
        content: "• يجب أن تكون 18 عامًا أو أكثر لإنشاء حساب\n• أنت مسؤول عن الحفاظ على سرية بيانات تسجيل الدخول\n• يجب تقديم معلومات صحيحة ودقيقة\n• يحق لنا إيقاف أو حذف الحسابات التي تنتهك الشروط"
      },
      {
        title: "الاستخدام المقبول",
        content: "يُحظر عليك:\n• استخدام المنصة لأغراض غير قانونية\n• محاولة اختراق أو تعطيل الخدمة\n• نسخ أو إعادة توزيع المحتوى بدون إذن\n• انتحال شخصية مستخدمين آخرين\n• إرسال محتوى ضار أو مسيء"
      },
      {
        title: "إخلاء المسؤولية",
        content: "• المعلومات المقدمة استرشادية فقط وليست نصيحة مالية\n• الأسعار والشروط قابلة للتغيير من قبل مزودي الخدمة\n• يرجى التحقق مباشرة مع بوابات الدفع قبل اتخاذ القرار\n• لا نضمن دقة جميع المعلومات في كل الأوقات\n• لسنا طرفًا في أي عقد بينك وبين مزودي بوابات الدفع"
      },
      {
        title: "حقوق الملكية الفكرية",
        content: "جميع المحتويات على المنصة، بما في ذلك النصوص والرسومات والشعارات والتصميم، محمية بموجب قوانين حقوق الملكية الفكرية. لا يجوز نسخ أو تعديل أو توزيع أي محتوى بدون إذن كتابي مسبق."
      },
      {
        title: "تحديد المسؤولية",
        content: "لن تكون PayGate Optimizer مسؤولة عن:\n• أي خسائر مباشرة أو غير مباشرة ناتجة عن استخدام المنصة\n• قرارات العمل المبنية على توصياتنا\n• انقطاع الخدمة أو الأخطاء التقنية\n• أفعال أو إهمال مزودي بوابات الدفع"
      },
      {
        title: "التعديلات",
        content: "نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سنبلغ المستخدمين بالتغييرات الجوهرية عبر البريد الإلكتروني أو إشعار على المنصة. استمرارك في استخدام الخدمة يعني موافقتك على الشروط المحدثة."
      },
      {
        title: "القانون الحاكم",
        content: "تخضع هذه الشروط لقوانين المملكة العربية السعودية. أي نزاعات تُحل عبر المحاكم المختصة في المملكة العربية السعودية."
      },
      {
        title: "التواصل",
        content: "لأي استفسارات حول شروط الاستخدام:\n• البريد الإلكتروني: legal@paygate-optimizer.com\n• نموذج التواصل على الموقع"
      }
    ]
  },
  en: {
    title: "Terms of Use",
    lastUpdated: "Last Updated: December 2025",
    sections: [
      {
        title: "Acceptance of Terms",
        content: "By using the PayGate Optimizer platform, you agree to comply with these terms and conditions. If you do not agree to any of these terms, please do not use the platform."
      },
      {
        title: "Service Description",
        content: "PayGate Optimizer is a payment gateway comparison platform in Saudi Arabia. We provide:\n• Comparisons between payment gateway providers\n• Personalized recommendations based on your business needs\n• Information about fees and features\n• Reports and analytics"
      },
      {
        title: "User Account",
        content: "• You must be 18 years or older to create an account\n• You are responsible for maintaining the confidentiality of your login credentials\n• You must provide accurate and truthful information\n• We reserve the right to suspend or delete accounts that violate these terms"
      },
      {
        title: "Acceptable Use",
        content: "You are prohibited from:\n• Using the platform for illegal purposes\n• Attempting to hack or disrupt the service\n• Copying or redistributing content without permission\n• Impersonating other users\n• Sending harmful or offensive content"
      },
      {
        title: "Disclaimer",
        content: "• Information provided is for guidance only and is not financial advice\n• Prices and terms are subject to change by service providers\n• Please verify directly with payment gateways before making decisions\n• We do not guarantee the accuracy of all information at all times\n• We are not a party to any contract between you and payment gateway providers"
      },
      {
        title: "Intellectual Property Rights",
        content: "All content on the platform, including text, graphics, logos, and design, is protected by intellectual property laws. No content may be copied, modified, or distributed without prior written permission."
      },
      {
        title: "Limitation of Liability",
        content: "PayGate Optimizer shall not be liable for:\n• Any direct or indirect losses resulting from using the platform\n• Business decisions based on our recommendations\n• Service interruptions or technical errors\n• Actions or negligence of payment gateway providers"
      },
      {
        title: "Modifications",
        content: "We reserve the right to modify these terms at any time. We will notify users of material changes via email or platform notification. Your continued use of the service means you agree to the updated terms."
      },
      {
        title: "Governing Law",
        content: "These terms are governed by the laws of the Kingdom of Saudi Arabia. Any disputes shall be resolved through the competent courts in Saudi Arabia."
      },
      {
        title: "Contact",
        content: "For any inquiries about terms of use:\n• Email: legal@paygate-optimizer.com\n• Contact form on the website"
      }
    ]
  }
}

export default function TermsPage() {
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
