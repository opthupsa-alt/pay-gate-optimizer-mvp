/**
 * Site Settings Library
 * 
 * مكتبة إدارة إعدادات الموقع
 * توفر وظائف للقراءة والتحديث والتخزين المؤقت للإعدادات
 */

import { prisma } from "@/lib/db"
import type { SettingType } from "@prisma/client"

// ==================== Types ====================

export interface SiteSetting {
  id: string
  key: string
  value: string
  type: SettingType
  group: string
  label: string
  description: string | null
  isPublic: boolean
  isEditable: boolean
  sortOrder: number
}

export interface SettingsMap {
  [key: string]: string | number | boolean | object
}

// ==================== Default Settings ====================

/**
 * الإعدادات الافتراضية للموقع
 * يتم استخدامها عند عدم وجود قيمة في قاعدة البيانات
 */
export const defaultSettings: Record<string, { value: string; type: SettingType; group: string; label: string; description: string; isPublic: boolean; sortOrder: number }> = {
  // Branding - العلامة التجارية
  "site.name": {
    value: "PayGate Optimizer",
    type: "string",
    group: "branding",
    label: "اسم المنصة",
    description: "اسم المنصة الذي يظهر في الـ Header والـ Footer",
    isPublic: true,
    sortOrder: 1,
  },
  "site.name_ar": {
    value: "محسّن بوابات الدفع",
    type: "string",
    group: "branding",
    label: "اسم المنصة (عربي)",
    description: "اسم المنصة بالعربية",
    isPublic: true,
    sortOrder: 2,
  },
  "site.tagline": {
    value: "قارن بوابات الدفع واختر الأنسب لنشاطك",
    type: "string",
    group: "branding",
    label: "الشعار",
    description: "الشعار الذي يظهر تحت اسم المنصة",
    isPublic: true,
    sortOrder: 3,
  },
  "site.logo": {
    value: "/logo.svg",
    type: "image",
    group: "branding",
    label: "شعار المنصة",
    description: "رابط شعار المنصة (SVG أو PNG)",
    isPublic: true,
    sortOrder: 4,
  },
  "site.favicon": {
    value: "/favicon.ico",
    type: "image",
    group: "branding",
    label: "أيقونة المنصة",
    description: "أيقونة التبويب (Favicon)",
    isPublic: true,
    sortOrder: 5,
  },
  "site.og_image": {
    value: "/og-image.png",
    type: "image",
    group: "branding",
    label: "صورة المشاركة",
    description: "الصورة التي تظهر عند مشاركة الموقع على السوشيال ميديا (1200x630)",
    isPublic: true,
    sortOrder: 6,
  },
  "site.primary_color": {
    value: "#10b981",
    type: "color",
    group: "branding",
    label: "اللون الأساسي",
    description: "اللون الأساسي للمنصة",
    isPublic: true,
    sortOrder: 7,
  },

  // SEO - تحسين محركات البحث
  "seo.title": {
    value: "PayGate Optimizer - مقارنة بوابات الدفع السعودية",
    type: "string",
    group: "seo",
    label: "عنوان الصفحة",
    description: "العنوان الذي يظهر في محركات البحث",
    isPublic: true,
    sortOrder: 10,
  },
  "seo.description": {
    value: "قارن بين بوابات الدفع الإلكتروني في السعودية واختر الأنسب لنشاطك التجاري. احصل على تقرير مفصّل بأفضل الخيارات والتكاليف.",
    type: "string",
    group: "seo",
    label: "وصف الصفحة",
    description: "الوصف الذي يظهر في محركات البحث (Meta Description)",
    isPublic: true,
    sortOrder: 11,
  },
  "seo.keywords": {
    value: "بوابات الدفع, الدفع الإلكتروني, السعودية, مقارنة, ميسر, تاب, هايبرباي",
    type: "string",
    group: "seo",
    label: "الكلمات المفتاحية",
    description: "الكلمات المفتاحية للصفحة",
    isPublic: true,
    sortOrder: 12,
  },

  // WhatsApp - إعدادات الواتساب
  "whatsapp.api_base_url": {
    value: "https://wa.washeej.com",
    type: "string",
    group: "whatsapp",
    label: "رابط API الواتساب",
    description: "رابط منصة الطرف الثالث للواتساب",
    isPublic: false,
    sortOrder: 20,
  },
  "whatsapp.from_number": {
    value: "966565740429",
    type: "string",
    group: "whatsapp",
    label: "رقم الإرسال",
    description: "رقم الواتساب الذي يتم الإرسال منه (بدون +)",
    isPublic: false,
    sortOrder: 21,
  },
  "whatsapp.enabled": {
    value: "true",
    type: "boolean",
    group: "whatsapp",
    label: "تفعيل الواتساب",
    description: "تفعيل أو تعطيل إرسال الرسائل عبر الواتساب",
    isPublic: false,
    sortOrder: 22,
  },

  // Contact - بيانات التواصل
  "contact.email": {
    value: "info@paygate-optimizer.com",
    type: "string",
    group: "contact",
    label: "البريد الإلكتروني",
    description: "البريد الإلكتروني للتواصل",
    isPublic: true,
    sortOrder: 30,
  },
  "contact.phone": {
    value: "+966500000000",
    type: "string",
    group: "contact",
    label: "رقم الهاتف",
    description: "رقم الهاتف للتواصل",
    isPublic: true,
    sortOrder: 31,
  },
  "contact.whatsapp": {
    value: "+966500000000",
    type: "string",
    group: "contact",
    label: "رقم الواتساب للدعم",
    description: "رقم الواتساب للدعم الفني",
    isPublic: true,
    sortOrder: 32,
  },

  // Social - السوشيال ميديا
  "social.twitter": {
    value: "",
    type: "string",
    group: "social",
    label: "حساب تويتر/X",
    description: "رابط حساب تويتر",
    isPublic: true,
    sortOrder: 40,
  },
  "social.linkedin": {
    value: "",
    type: "string",
    group: "social",
    label: "حساب لينكد إن",
    description: "رابط صفحة لينكد إن",
    isPublic: true,
    sortOrder: 41,
  },

  // General - عام
  "general.maintenance_mode": {
    value: "false",
    type: "boolean",
    group: "general",
    label: "وضع الصيانة",
    description: "تفعيل وضع الصيانة لإيقاف الموقع مؤقتاً",
    isPublic: false,
    sortOrder: 50,
  },
  "general.demo_mode": {
    value: "false",
    type: "boolean",
    group: "general",
    label: "وضع العرض",
    description: "تفعيل وضع العرض التجريبي",
    isPublic: false,
    sortOrder: 51,
  },
}

// ==================== Cache ====================

let settingsCache: SettingsMap | null = null
let cacheTimestamp: number = 0
const CACHE_TTL = 60 * 1000 // 1 minute

// ==================== Functions ====================

/**
 * Parse setting value based on type
 */
function parseValue(value: string, type: SettingType): string | number | boolean | object {
  switch (type) {
    case "number":
      return parseFloat(value) || 0
    case "boolean":
      return value === "true" || value === "1"
    case "json":
      try {
        return JSON.parse(value)
      } catch {
        return {}
      }
    default:
      return value
  }
}

/**
 * Stringify value for storage
 */
function stringifyValue(value: unknown, type: SettingType): string {
  switch (type) {
    case "number":
      return String(value)
    case "boolean":
      return value ? "true" : "false"
    case "json":
      return JSON.stringify(value)
    default:
      return String(value)
  }
}

/**
 * Get all settings from database (with caching)
 */
export async function getAllSettings(forceRefresh = false): Promise<SettingsMap> {
  const now = Date.now()
  
  // Return cached if valid
  if (!forceRefresh && settingsCache && (now - cacheTimestamp) < CACHE_TTL) {
    return settingsCache
  }

  try {
    const dbSettings = await prisma.siteSetting.findMany()
    
    const settings: SettingsMap = {}
    
    // First, apply defaults
    for (const [key, def] of Object.entries(defaultSettings)) {
      settings[key] = parseValue(def.value, def.type)
    }
    
    // Then, override with DB values
    for (const setting of dbSettings) {
      settings[setting.key] = parseValue(setting.value, setting.type)
    }
    
    // Update cache
    settingsCache = settings
    cacheTimestamp = now
    
    return settings
  } catch (error) {
    console.error("Error fetching settings:", error)
    // Return defaults on error
    const settings: SettingsMap = {}
    for (const [key, def] of Object.entries(defaultSettings)) {
      settings[key] = parseValue(def.value, def.type)
    }
    return settings
  }
}

/**
 * Get public settings only (safe for client-side)
 */
export async function getPublicSettings(): Promise<SettingsMap> {
  const all = await getAllSettings()
  const publicSettings: SettingsMap = {}
  
  for (const [key, def] of Object.entries(defaultSettings)) {
    if (def.isPublic) {
      publicSettings[key] = all[key]
    }
  }
  
  return publicSettings
}

/**
 * Get a single setting value
 */
export async function getSetting<T = string>(key: string): Promise<T> {
  const settings = await getAllSettings()
  return settings[key] as T ?? (parseValue(defaultSettings[key]?.value ?? "", defaultSettings[key]?.type ?? "string") as T)
}

/**
 * Update a setting value
 */
export async function updateSetting(key: string, value: unknown): Promise<SiteSetting | null> {
  const def = defaultSettings[key]
  if (!def) {
    console.error(`Unknown setting key: ${key}`)
    return null
  }
  
  const stringValue = stringifyValue(value, def.type)
  
  try {
    const setting = await prisma.siteSetting.upsert({
      where: { key },
      create: {
        key,
        value: stringValue,
        type: def.type,
        group: def.group,
        label: def.label,
        description: def.description,
        isPublic: def.isPublic,
        sortOrder: def.sortOrder,
      },
      update: {
        value: stringValue,
      },
    })
    
    // Invalidate cache
    settingsCache = null
    
    return setting as SiteSetting
  } catch (error) {
    console.error(`Error updating setting ${key}:`, error)
    return null
  }
}

/**
 * Update multiple settings at once
 */
export async function updateSettings(updates: Record<string, unknown>): Promise<number> {
  let updated = 0
  
  for (const [key, value] of Object.entries(updates)) {
    const result = await updateSetting(key, value)
    if (result) updated++
  }
  
  return updated
}

/**
 * Get settings grouped by category
 */
export async function getSettingsByGroup(): Promise<Record<string, SiteSetting[]>> {
  const dbSettings = await prisma.siteSetting.findMany({
    orderBy: [{ group: "asc" }, { sortOrder: "asc" }],
  })
  
  // Create full list with defaults + DB values
  const fullSettings: SiteSetting[] = []
  const dbMap = new Map(dbSettings.map(s => [s.key, s]))
  
  for (const [key, def] of Object.entries(defaultSettings)) {
    const dbSetting = dbMap.get(key)
    fullSettings.push({
      id: dbSetting?.id ?? key,
      key,
      value: dbSetting?.value ?? def.value,
      type: def.type,
      group: def.group,
      label: def.label,
      description: def.description,
      isPublic: def.isPublic,
      isEditable: true,
      sortOrder: def.sortOrder,
    })
  }
  
  // Group by category
  const grouped: Record<string, SiteSetting[]> = {}
  for (const setting of fullSettings) {
    if (!grouped[setting.group]) {
      grouped[setting.group] = []
    }
    grouped[setting.group].push(setting)
  }
  
  // Sort within groups
  for (const group of Object.keys(grouped)) {
    grouped[group].sort((a, b) => a.sortOrder - b.sortOrder)
  }
  
  return grouped
}

/**
 * Initialize settings in database (run once on setup)
 */
export async function initializeSettings(): Promise<number> {
  let created = 0
  
  for (const [key, def] of Object.entries(defaultSettings)) {
    try {
      await prisma.siteSetting.upsert({
        where: { key },
        create: {
          key,
          value: def.value,
          type: def.type,
          group: def.group,
          label: def.label,
          description: def.description,
          isPublic: def.isPublic,
          sortOrder: def.sortOrder,
        },
        update: {}, // Don't update if exists
      })
      created++
    } catch (error) {
      console.error(`Error initializing setting ${key}:`, error)
    }
  }
  
  return created
}

/**
 * Clear settings cache (use after bulk updates)
 */
export function clearSettingsCache(): void {
  settingsCache = null
  cacheTimestamp = 0
}

// ==================== WhatsApp specific helpers ====================

/**
 * Get WhatsApp settings (for use in whatsapp.ts)
 */
export async function getWhatsAppSettings(): Promise<{
  apiBaseUrl: string
  fromNumber: string
  enabled: boolean
}> {
  const settings = await getAllSettings()
  
  return {
    apiBaseUrl: (settings["whatsapp.api_base_url"] as string) || "https://wa.washeej.com",
    fromNumber: (settings["whatsapp.from_number"] as string) || "966565740429",
    enabled: (settings["whatsapp.enabled"] as boolean) ?? true,
  }
}

// ==================== Branding specific helpers ====================

/**
 * Get branding settings
 */
export async function getBrandingSettings(): Promise<{
  siteName: string
  siteNameAr: string
  tagline: string
  logo: string
  favicon: string
  ogImage: string
  primaryColor: string
}> {
  const settings = await getAllSettings()
  
  return {
    siteName: (settings["site.name"] as string) || "PayGate Optimizer",
    siteNameAr: (settings["site.name_ar"] as string) || "محسّن بوابات الدفع",
    tagline: (settings["site.tagline"] as string) || "",
    logo: (settings["site.logo"] as string) || "/logo.svg",
    favicon: (settings["site.favicon"] as string) || "/favicon.ico",
    ogImage: (settings["site.og_image"] as string) || "/og-image.png",
    primaryColor: (settings["site.primary_color"] as string) || "#10b981",
  }
}

/**
 * Get SEO settings
 */
export async function getSeoSettings(): Promise<{
  title: string
  description: string
  keywords: string
}> {
  const settings = await getAllSettings()
  
  return {
    title: (settings["seo.title"] as string) || "PayGate Optimizer",
    description: (settings["seo.description"] as string) || "",
    keywords: (settings["seo.keywords"] as string) || "",
  }
}
