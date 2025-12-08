import { CreditCard } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface FooterProps {
  locale: "ar" | "en"
}

export function Footer({ locale }: FooterProps) {
  const isRTL = locale === "ar"
  
  const t = {
    ar: {
      brand: "PayGate Optimizer",
      description: "منصة مقارنة بوابات الدفع الرائدة في المملكة العربية السعودية",
      disclaimer: "التوصيات استرشادية فقط. يرجى التحقق من الأسعار والشروط النهائية مباشرة مع مزودي الخدمة.",
      links: "روابط سريعة",
      home: "الرئيسية",
      wizard: "مقارنة البوابات",
      about: "عن المنصة",
      contact: "تواصل معنا",
      rights: "جميع الحقوق محفوظة",
    },
    en: {
      brand: "PayGate Optimizer",
      description: "Leading payment gateway comparison platform in Saudi Arabia",
      disclaimer: "Recommendations are indicative only. Please verify final pricing and terms directly with providers.",
      links: "Quick Links",
      home: "Home",
      wizard: "Compare Gateways",
      about: "About",
      contact: "Contact Us",
      rights: "All rights reserved",
    },
  }[locale]

  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-8 sm:py-12">
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-3 sm:space-y-4">
            <div className={cn(
              "flex items-center gap-2 font-semibold text-sm sm:text-base",
              isRTL && "font-arabic"
            )}>
              <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-primary shrink-0" />
              <span>{t.brand}</span>
            </div>
            <p className={cn(
              "text-xs sm:text-sm text-muted-foreground leading-relaxed",
              isRTL && "font-arabic"
            )}>{t.description}</p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className={cn(
              "font-semibold text-sm sm:text-base",
              isRTL && "font-arabic"
            )}>{t.links}</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li>
                <Link 
                  href="/" 
                  className={cn(
                    "text-muted-foreground hover:text-foreground transition-colors",
                    isRTL && "font-arabic"
                  )}
                >
                  {t.home}
                </Link>
              </li>
              <li>
                <Link 
                  href="/wizard" 
                  className={cn(
                    "text-muted-foreground hover:text-foreground transition-colors",
                    isRTL && "font-arabic"
                  )}
                >
                  {t.wizard}
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className={cn(
                    "text-muted-foreground hover:text-foreground transition-colors",
                    isRTL && "font-arabic"
                  )}
                >
                  {t.about}
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className={cn(
                    "text-muted-foreground hover:text-foreground transition-colors",
                    isRTL && "font-arabic"
                  )}
                >
                  {t.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="sm:col-span-2">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 sm:p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
              <p className={cn(
                "text-xs sm:text-sm text-amber-800 dark:text-amber-200 leading-relaxed",
                isRTL && "font-arabic"
              )}>
                <span className="me-1">⚠️</span> 
                {t.disclaimer}
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className={cn(
          "mt-6 sm:mt-8 border-t pt-6 sm:pt-8 text-center text-xs sm:text-sm text-muted-foreground",
          isRTL && "font-arabic"
        )}>
          © {currentYear} {t.brand}. {t.rights}.
        </div>
      </div>
    </footer>
  )
}
