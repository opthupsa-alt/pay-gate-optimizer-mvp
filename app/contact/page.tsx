"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send,
  CheckCircle,
  Loader2
} from "lucide-react"
import { toast } from "sonner"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [locale] = useState<"ar" | "en">("ar")
  const isRTL = locale === "ar"

  const t = {
    ar: {
      title: "تواصل معنا",
      subtitle: "نحن هنا لمساعدتك. أرسل لنا رسالة وسنرد عليك في أقرب وقت",
      form: {
        name: "الاسم الكامل",
        email: "البريد الإلكتروني",
        phone: "رقم الجوال (اختياري)",
        subject: "الموضوع",
        message: "رسالتك",
        submit: "إرسال الرسالة",
        submitting: "جاري الإرسال...",
        success: "تم إرسال رسالتك بنجاح!",
        successDesc: "شكراً لتواصلك معنا. سنرد عليك خلال 24 ساعة.",
        error: "حدث خطأ أثناء إرسال الرسالة"
      },
      contact: {
        title: "معلومات التواصل",
        email: "البريد الإلكتروني",
        phone: "الهاتف",
        address: "العنوان",
        addressValue: "الرياض، المملكة العربية السعودية",
        hours: "ساعات العمل",
        hoursValue: "الأحد - الخميس: 9 ص - 6 م"
      },
      placeholders: {
        name: "أدخل اسمك الكامل",
        email: "example@domain.com",
        phone: "05xxxxxxxx",
        subject: "موضوع الرسالة",
        message: "اكتب رسالتك هنا..."
      }
    },
    en: {
      title: "Contact Us",
      subtitle: "We're here to help. Send us a message and we'll respond as soon as possible",
      form: {
        name: "Full Name",
        email: "Email Address",
        phone: "Phone Number (optional)",
        subject: "Subject",
        message: "Your Message",
        submit: "Send Message",
        submitting: "Sending...",
        success: "Message sent successfully!",
        successDesc: "Thank you for contacting us. We'll respond within 24 hours.",
        error: "Error sending message"
      },
      contact: {
        title: "Contact Information",
        email: "Email",
        phone: "Phone",
        address: "Address",
        addressValue: "Riyadh, Saudi Arabia",
        hours: "Working Hours",
        hoursValue: "Sunday - Thursday: 9 AM - 6 PM"
      },
      placeholders: {
        name: "Enter your full name",
        email: "example@domain.com",
        phone: "05xxxxxxxx",
        subject: "Message subject",
        message: "Write your message here..."
      }
    }
  }[locale]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
    toast.success(t.form.success)
  }

  if (isSubmitted) {
    return (
      <div className="container py-16">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="mb-4 text-2xl font-bold">{t.form.success}</h1>
          <p className="mb-8 text-muted-foreground">{t.form.successDesc}</p>
          <Button onClick={() => setIsSubmitted(false)} variant="outline">
            إرسال رسالة أخرى
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">{t.title}</h1>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-3">
        {/* Contact Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t.contact.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">{t.contact.email}</p>
                  <a 
                    href="mailto:support@paygate-optimizer.com" 
                    className="text-sm text-muted-foreground hover:text-primary"
                    dir="ltr"
                  >
                    support@paygate-optimizer.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">{t.contact.phone}</p>
                  <a 
                    href="tel:+966500000000" 
                    className="text-sm text-muted-foreground hover:text-primary"
                    dir="ltr"
                  >
                    +966 50 000 0000
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">{t.contact.address}</p>
                  <p className="text-sm text-muted-foreground">{t.contact.addressValue}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="font-medium text-sm mb-1">{t.contact.hours}</p>
              <p className="text-sm text-muted-foreground">{t.contact.hoursValue}</p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t.form.submit}</CardTitle>
            <CardDescription>
              {locale === "ar" ? "املأ النموذج أدناه وسنتواصل معك" : "Fill the form below and we'll get back to you"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">{t.form.name}</Label>
                  <Input 
                    id="name" 
                    placeholder={t.placeholders.name}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t.form.email}</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder={t.placeholders.email}
                    required 
                    dir="ltr"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">{t.form.phone}</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder={t.placeholders.phone}
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">{t.form.subject}</Label>
                  <Input 
                    id="subject" 
                    placeholder={t.placeholders.subject}
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">{t.form.message}</Label>
                <Textarea 
                  id="message" 
                  placeholder={t.placeholders.message}
                  rows={5}
                  required 
                />
              </div>
              <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin me-2" />
                    {t.form.submitting}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 me-2" />
                    {t.form.submit}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

