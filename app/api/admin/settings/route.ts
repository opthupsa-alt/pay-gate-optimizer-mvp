import { type NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import prisma from "@/lib/db"

// Only admins can access settings
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

// Check if database is configured
function isDatabaseConfigured() {
  const dbUrl = process.env.DATABASE_URL
  return dbUrl && !dbUrl.includes("localhost:3306/your_database")
}

// Default weights for demo mode
const defaultWeights = [
  { factor: "cost", weight: 50, description: "وزن التكلفة الإجمالية في التقييم" },
  { factor: "fit", weight: 25, description: "وزن توافق المميزات مع احتياجات التاجر" },
  { factor: "ops", weight: 15, description: "وزن جودة الدعم والتفعيل والتوثيق" },
  { factor: "risk", weight: 10, description: "وزن مستوى المخاطر والاستقرار" },
]

// Default general settings for demo mode
const defaultSettings = {
  maxRecommendations: 3,
  minGmv: 1000,
  minTransactions: 10,
  enableNotifications: true,
  enableAnalytics: true,
  maintenanceMode: false,
}

// GET - Get all settings (weights and general settings)
export async function GET(request: NextRequest) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Return default data if database not configured
    if (!isDatabaseConfigured()) {
      return NextResponse.json({
        weights: defaultWeights,
        settings: defaultSettings,
        message: "Demo mode - using default settings"
      })
    }

    // Fetch scoring weights
    const weights = await prisma.scoringWeight.findMany({
      orderBy: { factor: "asc" },
    })

    // Fetch general settings from SystemConfig table if exists
    // For now, we'll use defaults since SystemConfig may not exist
    const settings = defaultSettings

    return NextResponse.json({ weights, settings })
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

// PUT - Update scoring weights
export async function PUT(request: NextRequest) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { weights, settings: generalSettings } = body

    // Validate weights if provided
    if (weights) {
      const totalWeight = weights.reduce((sum: number, w: { weight: number }) => sum + w.weight, 0)
      if (totalWeight !== 100) {
        return NextResponse.json({ 
          error: "مجموع الأوزان يجب أن يساوي 100%",
          totalWeight 
        }, { status: 400 })
      }
    }

    // Return mock response if database not configured
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ 
        weights: weights || defaultWeights,
        settings: generalSettings || defaultSettings,
        message: "Settings saved (mock mode)" 
      })
    }

    // Update weights in database
    if (weights && Array.isArray(weights)) {
      for (const w of weights) {
        await prisma.scoringWeight.upsert({
          where: { factor: w.factor },
          create: {
            factor: w.factor,
            weight: w.weight,
            description: w.description || null,
          },
          update: {
            weight: w.weight,
            description: w.description || null,
          },
        })
      }
    }

    // Fetch updated weights
    const updatedWeights = await prisma.scoringWeight.findMany({
      orderBy: { factor: "asc" },
    })

    return NextResponse.json({ 
      weights: updatedWeights,
      settings: generalSettings || defaultSettings,
      message: "تم حفظ الإعدادات بنجاح"
    })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}

// POST - Initialize default weights (first-time setup)
export async function POST(request: NextRequest) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Return mock response if database not configured
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ 
        weights: defaultWeights,
        message: "Weights initialized (mock mode)" 
      })
    }

    // Check if weights already exist
    const existingWeights = await prisma.scoringWeight.count()
    if (existingWeights > 0) {
      return NextResponse.json({ 
        error: "Weights already initialized",
        message: "Use PUT to update existing weights" 
      }, { status: 400 })
    }

    // Create default weights
    const createdWeights = await prisma.scoringWeight.createMany({
      data: defaultWeights.map(w => ({
        factor: w.factor,
        weight: w.weight,
        description: w.description,
      })),
    })

    return NextResponse.json({ 
      created: createdWeights.count,
      message: "Default weights initialized successfully" 
    })
  } catch (error) {
    console.error("Error initializing weights:", error)
    return NextResponse.json({ error: "Failed to initialize weights" }, { status: 500 })
  }
}
