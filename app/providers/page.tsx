import { Metadata } from "next"
import { Suspense } from "react"
import ProvidersClient from "./providers-client"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

// SEO Metadata
export const metadata: Metadata = {
  title: "مزودو خدمات الدفع في السعودية | PayGate Optimizer",
  description: "استعرض ومقارنة جميع مزودي خدمات الدفع الإلكتروني في السعودية. قارن بين بوابات الدفع مثل ميسر، هايبرباي، تاب، وغيرها من حيث الرسوم، المميزات، والتكاملات.",
  keywords: [
    "بوابات الدفع السعودية",
    "مزودو خدمات الدفع",
    "مقارنة بوابات الدفع",
    "ميسر",
    "هايبرباي",
    "تاب",
    "بيتابس",
    "payment gateway Saudi Arabia",
    "Moyasar",
    "HyperPay",
    "Tap",
    "PayTabs",
    "online payment KSA",
  ].join(", "),
  openGraph: {
    title: "مزودو خدمات الدفع في السعودية | PayGate Optimizer",
    description: "استعرض ومقارنة جميع مزودي خدمات الدفع الإلكتروني في السعودية",
    type: "website",
    locale: "ar_SA",
    url: "/providers",
    images: [
      {
        url: "/providers/default-og.svg",
        width: 1200,
        height: 630,
        alt: "مزودو خدمات الدفع",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "مزودو خدمات الدفع في السعودية",
    description: "استعرض ومقارنة جميع مزودي خدمات الدفع الإلكتروني في السعودية",
  },
  alternates: {
    canonical: "/providers",
  },
}

// JSON-LD for CollectionPage
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "مزودو خدمات الدفع في السعودية",
  description: "دليل شامل لجميع مزودي خدمات الدفع الإلكتروني في المملكة العربية السعودية",
  url: "https://paygate-optimizer.com/providers",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "بوابات الدفع",
        description: "بوابات الدفع الإلكتروني للمتاجر والشركات",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "مزودو خدمات الدفع (PSP)",
        description: "مزودو خدمات الدفع المتكاملة",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "اشتر الآن ادفع لاحقاً (BNPL)",
        description: "خدمات التقسيط والدفع المؤجل",
      },
    ],
  },
}

// Loading skeleton
function ProvidersLoading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>
      <div className="mb-6 flex gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-start gap-4">
                <Skeleton className="h-14 w-14 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function ProvidersPage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      
      {/* Client Component with Suspense */}
      <Suspense fallback={<ProvidersLoading />}>
        <ProvidersClient />
      </Suspense>
    </>
  )
}
