import { Logo } from "@/components/ui/logo"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { prisma } from "@/lib/db"

interface FooterProps {
  locale: "ar" | "en"
}

// Fallback static menus if database is not available
const fallbackMenus = {
  ar: [
    {
      title: "روابط سريعة",
      links: [
        { label: "الرئيسية", href: "/", isExternal: false, openInNewTab: false },
        { label: "مقارنة البوابات", href: "/wizard", isExternal: false, openInNewTab: false },
        { label: "عن المنصة", href: "/about", isExternal: false, openInNewTab: false },
        { label: "تواصل معنا", href: "/contact", isExternal: false, openInNewTab: false },
      ]
    },
    {
      title: "قانونية",
      links: [
        { label: "سياسة الخصوصية", href: "/privacy", isExternal: false, openInNewTab: false },
        { label: "شروط الاستخدام", href: "/terms", isExternal: false, openInNewTab: false },
      ]
    }
  ],
  en: [
    {
      title: "Quick Links",
      links: [
        { label: "Home", href: "/", isExternal: false, openInNewTab: false },
        { label: "Compare Gateways", href: "/wizard", isExternal: false, openInNewTab: false },
        { label: "About", href: "/about", isExternal: false, openInNewTab: false },
        { label: "Contact Us", href: "/contact", isExternal: false, openInNewTab: false },
      ]
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy", isExternal: false, openInNewTab: false },
        { label: "Terms of Use", href: "/terms", isExternal: false, openInNewTab: false },
      ]
    }
  ]
}

async function getFooterMenus() {
  try {
    const menus = await prisma.footerMenu.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        links: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    })
    return menus
  } catch {
    return null
  }
}

export async function Footer({ locale }: FooterProps) {
  const isRTL = locale === "ar"
  
  const t = {
    ar: {
      brand: "PayGate Optimizer",
      description: "منصة مقارنة بوابات الدفع الرائدة في المملكة العربية السعودية",
      disclaimer: "التوصيات استرشادية فقط. يرجى التحقق من الأسعار والشروط النهائية مباشرة مع مزودي الخدمة.",
      rights: "جميع الحقوق محفوظة",
    },
    en: {
      brand: "PayGate Optimizer",
      description: "Leading payment gateway comparison platform in Saudi Arabia",
      disclaimer: "Recommendations are indicative only. Please verify final pricing and terms directly with providers.",
      rights: "All rights reserved",
    },
  }[locale]

  const currentYear = new Date().getFullYear()
  
  // Try to get menus from database, fallback to static
  const dbMenus = await getFooterMenus()
  const menus = dbMenus && dbMenus.length > 0
    ? dbMenus.map(menu => ({
        title: locale === "ar" ? menu.titleAr : menu.titleEn,
        links: menu.links.map(link => ({
          label: locale === "ar" ? link.labelAr : link.labelEn,
          href: link.href,
          isExternal: link.isExternal,
          openInNewTab: link.openInNewTab,
        }))
      }))
    : fallbackMenus[locale]

  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-8 sm:py-12">
        {/* Main Footer Content */}
        <div className={cn(
          "grid gap-6 sm:gap-8",
          menus.length === 1 
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
            : menus.length === 2 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
        )}>
          {/* Brand Section */}
          <div className="space-y-3 sm:space-y-4 sm:col-span-2 lg:col-span-1">
            <Logo size="md" showText={true} />
            <p className={cn(
              "text-xs sm:text-sm text-muted-foreground leading-relaxed",
              isRTL && "font-arabic"
            )}>{t.description}</p>
          </div>

          {/* Dynamic Menu Columns */}
          {menus.map((menu, menuIndex) => (
            <div key={menuIndex} className="space-y-3 sm:space-y-4">
              <h4 className={cn(
                "font-semibold text-sm sm:text-base",
                isRTL && "font-arabic"
              )}>{menu.title}</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                {menu.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      href={link.href}
                      target={link.openInNewTab ? "_blank" : undefined}
                      rel={link.isExternal ? "noopener noreferrer" : undefined}
                      className={cn(
                        "text-muted-foreground hover:text-foreground transition-colors",
                        isRTL && "font-arabic"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Empty Placeholder Column for additional menus */}
          <div className="space-y-3 sm:space-y-4">
            {/* This column will be used when you add more menus from the database */}
          </div>
        </div>

        {/* Disclaimer - Full Width at Bottom */}
        <div className="mt-6 sm:mt-8">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 sm:p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
            <p className={cn(
              "text-xs sm:text-sm text-amber-800 dark:text-amber-200 leading-relaxed text-center",
              isRTL && "font-arabic"
            )}>
              <span className="me-1">⚠️</span> 
              {t.disclaimer}
            </p>
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
