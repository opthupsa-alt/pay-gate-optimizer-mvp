"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { Logo } from "@/components/ui/logo"
import { Menu, X, User, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NavbarProps {
  locale: "ar" | "en"
}

export function Navbar({ locale }: NavbarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { data: session, status } = useSession()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const translations = {
    ar: {
      home: "الرئيسية",
      compare: "قارن الآن",
      providers: "المزودين",
      about: "من نحن",
      contact: "اتصل بنا",
      login: "تسجيل الدخول",
      admin: "لوحة التحكم",
      profile: "الملف الشخصي",
      logout: "تسجيل الخروج",
    },
    en: {
      home: "Home",
      compare: "Compare Now",
      providers: "Providers",
      about: "About",
      contact: "Contact",
      login: "Login",
      admin: "Admin",
      profile: "Profile",
      logout: "Logout",
    },
  }

  const t = translations[locale]
  const isRTL = locale === "ar"

  const navLinks = [
    { href: "/", label: t.home },
    { href: "/wizard", label: t.compare },
    { href: "/providers", label: t.providers },
    { href: "/about", label: t.about },
    { href: "/contact", label: t.contact },
  ]

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <Logo size="sm" showText={true} />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(link.href) ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageToggle currentLocale={locale} />

          {/* Auth Button / User Menu */}
          {mounted && (
            <>
              {status === "loading" ? (
                <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
              ) : session?.user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align={isRTL ? "start" : "end"}>
                    <div className="px-2 py-1.5 text-sm font-medium">
                      {session.user.name || session.user.email}
                    </div>
                    <DropdownMenuSeparator />
                    {(session.user as { role?: string }).role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin">{t.admin}</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/profile">{t.profile}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 me-2" />
                      {t.logout}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                  <Link href="/auth/login">{t.login}</Link>
                </Button>
              )}
            </>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-10 w-10"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t md:hidden bg-background/95 backdrop-blur">
          <div className="container py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block py-3 px-3 text-base font-medium rounded-lg transition-colors",
                  "hover:bg-accent active:bg-accent/80",
                  isActive(link.href) ? "text-primary bg-primary/5" : "text-foreground"
                )}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {mounted && !session && (
              <Link
                href="/auth/login"
                className="block py-3 px-3 text-base font-medium text-primary bg-primary/5 rounded-lg mt-2"
                onClick={() => setIsOpen(false)}
              >
                {t.login}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
