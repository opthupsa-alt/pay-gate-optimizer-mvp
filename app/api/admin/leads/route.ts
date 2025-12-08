import { type NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import prisma from "@/lib/db"
import { LeadStatus } from "@prisma/client"
import { checkRateLimit, getClientIP, RateLimitPresets, createRateLimitHeaders } from "@/lib/rate-limit"

// Check if user has access to leads (admin or analyst role)
async function hasLeadsAccess(request: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) return true // Allow in demo mode if no auth configured
  
  const token = await getToken({ req: request, secret })
  if (!token) return false
  
  return token.role === "admin" || token.role === "analyst"
}

// Mock leads for demo when database is not configured
const mockLeads = [
  {
    id: "1",
    wizardRunId: "mock-1",
    name: "أحمد محمد الشمري",
    email: "ahmed@example.com",
    phone: "0501234567",
    companyName: "شركة التقنية المتقدمة",
    city: "الرياض",
    preferredContact: "email",
    notes: null,
    status: "new" as LeadStatus,
    ownerUserId: null,
    createdAt: new Date("2024-01-15T10:30:00Z"),
    updatedAt: new Date("2024-01-15T10:30:00Z"),
    wizardRun: {
      monthlyGmv: 50000,
      txCount: 500,
      sector: { nameAr: "تجارة إلكترونية", nameEn: "E-commerce" }
    },
    owner: null
  },
  {
    id: "2",
    wizardRunId: "mock-2",
    name: "سارة العلي",
    email: "sara@example.com",
    phone: "0559876543",
    companyName: "مطعم الذواقة",
    city: "جدة",
    preferredContact: "phone",
    notes: "مهتمة بالدفع المتكرر",
    status: "contacted" as LeadStatus,
    ownerUserId: null,
    createdAt: new Date("2024-01-14T14:20:00Z"),
    updatedAt: new Date("2024-01-14T16:00:00Z"),
    wizardRun: {
      monthlyGmv: 30000,
      txCount: 300,
      sector: { nameAr: "مطاعم", nameEn: "Restaurants" }
    },
    owner: null
  },
]

// Check if database is configured
function isDatabaseConfigured() {
  const dbUrl = process.env.DATABASE_URL
  return dbUrl && !dbUrl.includes("localhost:3306/your_database")
}

// GET - List all leads
export async function GET(request: NextRequest) {
  try {
    if (!(await hasLeadsAccess(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")

    // Return mock data if database not configured
    if (!isDatabaseConfigured()) {
      let filtered = mockLeads
      if (status && status !== "all") {
        filtered = mockLeads.filter(l => l.status === status)
      }
      return NextResponse.json({ 
        leads: filtered,
        total: filtered.length 
      })
    }

    // Build where clause
    const where: { status?: LeadStatus } = {}
    if (status && status !== "all") {
      where.status = status as LeadStatus
    }

    // Get total count
    const total = await prisma.lead.count({ where })

    // Fetch leads with relations
    const leads = await prisma.lead.findMany({
      where,
      include: {
        wizardRun: {
          select: {
            monthlyGmv: true,
            txCount: true,
            sector: {
              select: {
                nameAr: true,
                nameEn: true,
              },
            },
          },
        },
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
    })

    return NextResponse.json({ leads, total })
  } catch (error) {
    console.error("Error fetching leads:", error)
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 })
  }
}

// POST - Create new lead (public endpoint for contact form)
export async function POST(request: NextRequest) {
  try {
    // Rate limiting for public endpoint
    const clientIP = getClientIP(request)
    const rateLimitResult = checkRateLimit(clientIP, RateLimitPresets.public)
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: "تم تجاوز الحد الأقصى للطلبات. يرجى المحاولة بعد قليل.",
          retryAfter: rateLimitResult.resetIn
        },
        { 
          status: 429,
          headers: createRateLimitHeaders(rateLimitResult)
        }
      )
    }

    const body = await request.json()
    
    const { name, email, phone, company_name, wizard_run_id, notes, preferred_contact, city } = body

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    // Return mock response if database not configured
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ 
        lead: { 
          id: `mock-${Date.now()}`, 
          name,
          email,
          phone,
          companyName: company_name,
          city,
          wizardRunId: wizard_run_id,
          notes,
          preferredContact: preferred_contact || "email",
          status: "new" 
        },
        message: "Lead created (mock mode)" 
      })
    }

    const lead = await prisma.lead.create({
      data: {
        wizardRunId: wizard_run_id || null,
        name,
        email,
        phone: phone || null,
        companyName: company_name || null,
        city: city || null,
        notes: notes || null,
        preferredContact: preferred_contact || "email",
        status: "new",
      },
    })

    return NextResponse.json({ lead })
  } catch (error) {
    console.error("Error creating lead:", error)
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 })
  }
}

// PATCH - Update lead status
export async function PATCH(request: NextRequest) {
  try {
    if (!(await hasLeadsAccess(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id, status, notes, owner_user_id } = body

    if (!id) {
      return NextResponse.json({ error: "Lead ID is required" }, { status: 400 })
    }

    // Return mock response if database not configured
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ 
        lead: { id, status, notes },
        message: "Lead updated (mock mode)" 
      })
    }

    const updateData: {
      status?: LeadStatus
      notes?: string | null
      ownerUserId?: string | null
    } = {}
    
    if (status) updateData.status = status as LeadStatus
    if (notes !== undefined) updateData.notes = notes
    if (owner_user_id !== undefined) updateData.ownerUserId = owner_user_id

    const lead = await prisma.lead.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ lead })
  } catch (error) {
    console.error("Error updating lead:", error)
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 })
  }
}

// DELETE - Delete lead
export async function DELETE(request: NextRequest) {
  try {
    if (!(await hasLeadsAccess(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Lead ID is required" }, { status: 400 })
    }

    // Return mock response if database not configured
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ message: "Lead deleted (mock mode)" })
    }

    await prisma.lead.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Lead deleted successfully" })
  } catch (error) {
    console.error("Error deleting lead:", error)
    return NextResponse.json({ error: "Failed to delete lead" }, { status: 500 })
  }
}

