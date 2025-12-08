import { type NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { 
  getSettingsByGroup, 
  updateSettings, 
  getPublicSettings,
  initializeSettings,
  defaultSettings,
  type SettingsMap 
} from "@/lib/settings"

// Only admins can access site settings
async function isAdmin(request: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) {
    console.error("NEXTAUTH_SECRET is not configured - denying access")
    return false
  }
  
  const token = await getToken({ req: request, secret })
  if (!token) return false
  return token.role === "admin"
}

/**
 * GET /api/admin/site-settings
 * 
 * Get all site settings grouped by category
 * Admin only
 */
export async function GET(request: NextRequest) {
  try {
    // Check for public query param (for client-side settings)
    const { searchParams } = new URL(request.url)
    const publicOnly = searchParams.get("public") === "true"
    
    if (publicOnly) {
      // Public settings don't require auth
      const settings = await getPublicSettings()
      return NextResponse.json({ settings })
    }
    
    // Admin check for full settings
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const groupedSettings = await getSettingsByGroup()
    
    // Get group labels
    const groupLabels: Record<string, string> = {
      branding: "العلامة التجارية",
      seo: "تحسين محركات البحث",
      whatsapp: "إعدادات الواتساب",
      contact: "بيانات التواصل",
      social: "السوشيال ميديا",
      general: "إعدادات عامة",
    }
    
    return NextResponse.json({ 
      settings: groupedSettings,
      groupLabels,
    })
  } catch (error) {
    console.error("Error fetching site settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch site settings" }, 
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/site-settings
 * 
 * Update site settings
 * Admin only
 */
export async function PUT(request: NextRequest) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { settings } = body as { settings: SettingsMap }
    
    if (!settings || typeof settings !== "object") {
      return NextResponse.json(
        { error: "Invalid settings format" }, 
        { status: 400 }
      )
    }
    
    // Validate keys
    const validKeys = Object.keys(defaultSettings)
    const invalidKeys = Object.keys(settings).filter(k => !validKeys.includes(k))
    
    if (invalidKeys.length > 0) {
      return NextResponse.json(
        { error: `Invalid setting keys: ${invalidKeys.join(", ")}` }, 
        { status: 400 }
      )
    }
    
    // Update settings
    const updated = await updateSettings(settings)
    
    // Fetch updated settings
    const groupedSettings = await getSettingsByGroup()
    
    return NextResponse.json({ 
      updated,
      settings: groupedSettings,
      message: "تم حفظ الإعدادات بنجاح"
    })
  } catch (error) {
    console.error("Error updating site settings:", error)
    return NextResponse.json(
      { error: "Failed to update site settings" }, 
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/site-settings
 * 
 * Initialize default site settings
 * Admin only - run once on setup
 */
export async function POST(request: NextRequest) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const created = await initializeSettings()
    
    return NextResponse.json({ 
      created,
      message: `تم تهيئة ${created} إعداد`
    })
  } catch (error) {
    console.error("Error initializing site settings:", error)
    return NextResponse.json(
      { error: "Failed to initialize site settings" }, 
      { status: 500 }
    )
  }
}
