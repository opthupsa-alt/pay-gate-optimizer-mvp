import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  CheckCircle, 
  Target, 
  Users, 
  Zap, 
  Shield, 
  TrendingUp,
  ArrowLeft,
  ArrowRight
} from "lucide-react"
import Link from "next/link"
import { cookies } from "next/headers"

export const metadata = {
  title: 'عن المنصة | PayGate Optimizer',
  description: 'تعرف على منصة PayGate Optimizer - منصة مقارنة بوابات الدفع الرائدة في السعودية',
}

export default async function AboutPage() {
  const cookieStore = await cookies()
  const locale = (cookieStore.get("locale")?.value as "ar" | "en") || "ar"
  const isRTL = locale === "ar"
  const Arrow = isRTL ? ArrowLeft : ArrowRight

  const t = {
    ar: {
      title: "عن PayGate Optimizer",
      subtitle: "منصة مقارنة بوابات الدفع الرائدة في المملكة العربية السعودية",
      mission: {
        title: "مهمتنا",
        description: "نسعى لتمكين التجار وأصحاب الأعمال من اتخاذ قرارات مستنيرة عند اختيار بوابة الدفع المناسبة لنشاطهم التجاري، من خلال توفير مقارنات شفافة وتوصيات مخصصة."
      },
      vision: {
        title: "رؤيتنا",
        description: "أن نكون المرجع الأول والأكثر موثوقية لمقارنة بوابات الدفع في منطقة الخليج العربي، ونساهم في تسريع التحول الرقمي للمدفوعات."
      },
      features: {
        title: "لماذا نحن؟",
        items: [
          {
            icon: Zap,
            title: "تحليل ذكي",
            description: "نستخدم خوارزميات متقدمة لتحليل احتياجاتك وتقديم توصيات دقيقة"
          },
          {
            icon: Shield,
            title: "شفافية كاملة",
            description: "نعرض جميع الرسوم والتكاليف بوضوح دون أي رسوم خفية"
          },
          {
            icon: TrendingUp,
            title: "بيانات محدثة",
            description: "نحدث بياناتنا باستمرار لضمان دقة المقارنات والتوصيات"
          },
          {
            icon: Users,
            title: "دعم متكامل",
            description: "فريق دعم متخصص لمساعدتك في اتخاذ القرار الأمثل"
          }
        ]
      },
      stats: {
        title: "إنجازاتنا",
        items: [
          { value: "6+", label: "بوابات دفع" },
          { value: "10+", label: "قطاعات تجارية" },
          { value: "1000+", label: "مقارنة شهرياً" },
          { value: "95%", label: "رضا العملاء" }
        ]
      },
      cta: {
        title: "جاهز للبدء؟",
        description: "ابدأ مقارنة بوابات الدفع الآن واحصل على توصيات مخصصة لنشاطك",
        button: "ابدأ المقارنة المجانية"
      }
    },
    en: {
      title: "About PayGate Optimizer",
      subtitle: "The leading payment gateway comparison platform in Saudi Arabia",
      mission: {
        title: "Our Mission",
        description: "We aim to empower merchants and business owners to make informed decisions when choosing the right payment gateway for their business, through transparent comparisons and personalized recommendations."
      },
      vision: {
        title: "Our Vision",
        description: "To be the most trusted reference for payment gateway comparison in the Gulf region, contributing to accelerating digital payment transformation."
      },
      features: {
        title: "Why Choose Us?",
        items: [
          {
            icon: Zap,
            title: "Smart Analysis",
            description: "We use advanced algorithms to analyze your needs and provide accurate recommendations"
          },
          {
            icon: Shield,
            title: "Full Transparency",
            description: "We display all fees and costs clearly with no hidden charges"
          },
          {
            icon: TrendingUp,
            title: "Updated Data",
            description: "We continuously update our data to ensure accurate comparisons and recommendations"
          },
          {
            icon: Users,
            title: "Integrated Support",
            description: "A specialized support team to help you make the optimal decision"
          }
        ]
      },
      stats: {
        title: "Our Achievements",
        items: [
          { value: "6+", label: "Payment Gateways" },
          { value: "10+", label: "Business Sectors" },
          { value: "1000+", label: "Monthly Comparisons" },
          { value: "95%", label: "Customer Satisfaction" }
        ]
      },
      cta: {
        title: "Ready to Start?",
        description: "Start comparing payment gateways now and get personalized recommendations for your business",
        button: "Start Free Comparison"
      }
    }
  }[locale]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">
              <Target className="h-3 w-3 me-1" />
              PayGate Optimizer
            </Badge>
            <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              {t.title}
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              {t.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  {t.mission.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {t.mission.description}
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  {t.vision.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {t.vision.description}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/30 py-16">
        <div className="container">
          <h2 className="mb-12 text-center text-2xl font-bold md:text-3xl">
            {t.features.title}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.features.items.map((feature, index) => (
              <Card key={index} className="border-0 bg-background">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="container">
          <h2 className="mb-12 text-center text-2xl font-bold md:text-3xl">
            {t.stats.title}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.stats.items.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl font-bold text-primary md:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary/5 py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">{t.cta.title}</h2>
            <p className="mb-8 text-muted-foreground">{t.cta.description}</p>
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

