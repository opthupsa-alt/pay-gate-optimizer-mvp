import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, CheckCircle, CreditCard, Shield, Zap } from "lucide-react"
import Link from "next/link"
import { cookies } from "next/headers"

export default async function HomePage() {
  const cookieStore = await cookies()
  const locale = (cookieStore.get("locale")?.value as "ar" | "en") || "ar"
  const isRTL = locale === "ar"

  const t = {
    ar: {
      hero: {
        badge: "منصة مقارنة بوابات الدفع الأولى في السعودية",
        title: "اعثر على بوابة الدفع المثالية لعملك",
        subtitle: "قارن أسعار ومميزات أفضل بوابات الدفع في المملكة واحصل على توصيات مخصصة لاحتياجات نشاطك التجاري",
        cta: "ابدأ المقارنة المجانية",
        secondary: "تعرف على المزيد",
      },
      features: {
        title: "لماذا تختارنا؟",
        subtitle: "نساعدك على اتخاذ القرار الصحيح في اختيار بوابة الدفع",
        items: [
          {
            icon: Zap,
            title: "تحليل سريع وذكي",
            description: "احصل على توصيات مخصصة في دقائق بناءً على حجم أعمالك ومتطلباتك",
          },
          {
            icon: Shield,
            title: "مقارنة شفافة",
            description: "نعرض لك جميع الرسوم والتكاليف بشكل واضح دون أي مفاجآت",
          },
          {
            icon: CheckCircle,
            title: "توصيات موثوقة",
            description: "نحلل أكثر من 20 معياراً لضمان حصولك على أفضل توصية",
          },
        ],
      },
      howItWorks: {
        title: "كيف تعمل المنصة؟",
        steps: [
          { number: "1", title: "أدخل بيانات نشاطك", description: "أجب على 7 أسئلة بسيطة عن نشاطك التجاري" },
          { number: "2", title: "نحلل المتطلبات", description: "نقارن جميع البوابات المتاحة بناءً على احتياجاتك" },
          { number: "3", title: "احصل على التوصيات", description: "نعرض لك أفضل 3 خيارات مع تفاصيل التكاليف" },
        ],
      },
      cta: {
        title: "جاهز للبدء؟",
        subtitle: "احصل على توصيتك المجانية الآن",
        button: "ابدأ المقارنة",
      },
    },
    en: {
      hero: {
        badge: "Saudi Arabia's Leading Payment Gateway Comparison Platform",
        title: "Find the Perfect Payment Gateway for Your Business",
        subtitle:
          "Compare prices and features of the best payment gateways in the Kingdom and get personalized recommendations for your business needs",
        cta: "Start Free Comparison",
        secondary: "Learn More",
      },
      features: {
        title: "Why Choose Us?",
        subtitle: "We help you make the right decision in choosing a payment gateway",
        items: [
          {
            icon: Zap,
            title: "Fast & Smart Analysis",
            description: "Get personalized recommendations in minutes based on your business size and requirements",
          },
          {
            icon: Shield,
            title: "Transparent Comparison",
            description: "We show you all fees and costs clearly with no surprises",
          },
          {
            icon: CheckCircle,
            title: "Reliable Recommendations",
            description: "We analyze over 20 criteria to ensure you get the best recommendation",
          },
        ],
      },
      howItWorks: {
        title: "How Does It Work?",
        steps: [
          {
            number: "1",
            title: "Enter Your Business Data",
            description: "Answer 7 simple questions about your business",
          },
          {
            number: "2",
            title: "We Analyze Requirements",
            description: "We compare all available gateways based on your needs",
          },
          { number: "3", title: "Get Recommendations", description: "We show you the top 3 options with cost details" },
        ],
      },
      cta: {
        title: "Ready to Get Started?",
        subtitle: "Get your free recommendation now",
        button: "Start Comparison",
      },
    },
  }[locale]

  const Arrow = isRTL ? ArrowLeft : ArrowRight

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-20 md:py-32">
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-1.5 text-sm backdrop-blur">
              <CreditCard className="h-4 w-4 text-primary" />
              <span>{t.hero.badge}</span>
            </div>
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              {t.hero.title}
            </h1>
            <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl">{t.hero.subtitle}</p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="gap-2">
                <Link href="/wizard">
                  {t.hero.cta}
                  <Arrow className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#how-it-works">{t.hero.secondary}</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold">{t.features.title}</h2>
            <p className="text-muted-foreground">{t.features.subtitle}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {t.features.items.map((feature, index) => (
              <Card key={index} className="border-0 bg-muted/30">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-muted/30 py-20">
        <div className="container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold">{t.howItWorks.title}</h2>
          </div>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            {t.howItWorks.steps.map((step, index) => (
              <div key={index} className="relative text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  {step.number}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
                {/* Arrow between steps - appears AFTER current step toward next step */}
                {index < 2 && (
                  <div 
                    className="absolute top-8 hidden -translate-y-1/2 md:block"
                    style={{
                      // In RTL: arrow on LEFT side (toward next step which is on the left)
                      // In LTR: arrow on RIGHT side (toward next step which is on the right)
                      ...(isRTL 
                        ? { left: 0, transform: 'translate(-50%, -50%)' }
                        : { right: 0, transform: 'translate(50%, -50%)' }
                      )
                    }}
                  >
                    <Arrow className="h-6 w-6 text-muted-foreground/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold">{t.cta.title}</h2>
            <p className="mb-8 text-muted-foreground">{t.cta.subtitle}</p>
            <Button asChild size="lg" className="gap-2">
              <Link href="/wizard">
                {t.cta.button}
                <Arrow className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
