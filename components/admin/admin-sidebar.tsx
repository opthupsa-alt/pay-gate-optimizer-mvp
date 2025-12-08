"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Settings, 
  CreditCard,
  BarChart3,
  Upload,
  Shield,
  DollarSign,
  Link2,
} from "lucide-react"

interface AdminSidebarProps {
  locale: "ar" | "en"
}

export function AdminSidebar({ locale }: AdminSidebarProps) {
  const pathname = usePathname()

  const t = {
    ar: {
      dashboard: "لوحة المعلومات",
      providers: "مزودي الخدمة",
      providerFees: "رسوم المزودين",
      integrations: "التكاملات",
      leads: "العملاء المحتملين",
      analytics: "التحليلات",
      dataQuality: "جودة البيانات",
      import: "استيراد البيانات",
      settings: "الإعدادات",
    },
    en: {
      dashboard: "Dashboard",
      providers: "Providers",
      providerFees: "Provider Fees",
      integrations: "Integrations",
      leads: "Leads",
      analytics: "Analytics",
      dataQuality: "Data Quality",
      import: "Import Data",
      settings: "Settings",
    }
  }[locale]

  const navItems = [
    { href: "/admin", icon: LayoutDashboard, label: t.dashboard, exact: true },
    { href: "/admin/providers", icon: Building2, label: t.providers },
    { href: "/admin/leads", icon: Users, label: t.leads },
    { href: "/admin/analytics", icon: BarChart3, label: t.analytics },
  ]

  const dataItems = [
    { href: "/admin/data-quality", icon: Shield, label: t.dataQuality },
    { href: "/admin/import", icon: Upload, label: t.import },
  ]

  const settingsItems = [
    { href: "/admin/settings", icon: Settings, label: t.settings },
  ]

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <aside className="hidden w-64 border-e bg-background md:block">
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/admin" className="flex items-center gap-2 font-semibold">
            <CreditCard className="h-5 w-5 text-primary" />
            <span className="text-sm">Admin Panel</span>
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Main Navigation */}
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive(item.href, item.exact) 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Data Management */}
          <div>
            <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {locale === "ar" ? "إدارة البيانات" : "Data Management"}
            </h3>
            <div className="space-y-1">
              {dataItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive(item.href) 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div>
            <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {locale === "ar" ? "الإعدادات" : "Configuration"}
            </h3>
            <div className="space-y-1">
              {settingsItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive(item.href) 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t p-4">
          <Link 
            href="/providers" 
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <Building2 className="h-3 w-3" />
            {locale === "ar" ? "عرض صفحة المزودين" : "View Providers Page"}
          </Link>
        </div>
      </div>
    </aside>
  )
}
