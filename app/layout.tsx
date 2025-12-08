import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { IBM_Plex_Sans_Arabic } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { cookies } from 'next/headers'
import { ThemeProvider } from '@/components/theme-provider'
import { SessionProvider } from '@/components/providers/session-provider'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const geist = Geist({ 
  subsets: ["latin"],
  variable: "--font-geist",
});

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
});

export const metadata: Metadata = {
  title: {
    default: 'PayGate Optimizer - مقارنة بوابات الدفع في السعودية',
    template: '%s | PayGate Optimizer',
  },
  description: 'قارن أسعار ومميزات بوابات الدفع في السعودية مثل ميسر وتاب وهايبر باي واحصل على توصيات مخصصة لنشاطك التجاري. مجاني وسريع.',
  keywords: [
    'بوابات الدفع',
    'مقارنة بوابات الدفع',
    'ميسر',
    'تاب',
    'هايبر باي',
    'باي فورت',
    'تابي',
    'تمارا',
    'الدفع الإلكتروني',
    'السعودية',
    'payment gateway',
    'moyasar',
    'tap payments',
    'hyperpay',
  ],
  authors: [{ name: 'PayGate Optimizer' }],
  creator: 'PayGate Optimizer',
  publisher: 'PayGate Optimizer',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://paygate-optimizer.com'),
  alternates: {
    canonical: '/',
    languages: {
      'ar-SA': '/',
      'en-US': '/',
    },
  },
  openGraph: {
    title: 'PayGate Optimizer - مقارنة بوابات الدفع في السعودية',
    description: 'قارن أسعار ومميزات بوابات الدفع في السعودية واحصل على توصيات مخصصة لنشاطك التجاري',
    url: '/',
    siteName: 'PayGate Optimizer',
    locale: 'ar_SA',
    type: 'website',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'PayGate Optimizer - مقارنة بوابات الدفع',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PayGate Optimizer - مقارنة بوابات الدفع',
    description: 'قارن أسعار ومميزات بوابات الدفع في السعودية',
    images: ['/og-image.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/icon.svg',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const locale = (cookieStore.get("locale")?.value as "ar" | "en") || "ar"
  const isRTL = locale === "ar"

  return (
    <html 
      lang={locale} 
      dir={isRTL ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <body 
        className={`
          ${geist.variable} 
          ${geistMono.variable} 
          ${ibmPlexArabic.variable}
          ${isRTL ? 'font-arabic' : 'font-sans'}
          antialiased
          min-h-screen
          flex
          flex-col
        `}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar locale={locale} />
            <main className="flex-1">
              {children}
            </main>
            <Footer locale={locale} />
            <Toaster position={isRTL ? "top-left" : "top-right"} />
          </ThemeProvider>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  )
}
