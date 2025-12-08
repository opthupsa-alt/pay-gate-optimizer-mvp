import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { runCleanup, getCleanupStatus } from "@/lib/pdf-storage"

/**
 * Admin check
 */
async function isAdmin(request: NextRequest): Promise<boolean> {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) return false
  
  const token = await getToken({ req: request, secret })
  return token?.role === "admin"
}

/**
 * GET /api/admin/pdf-cleanup
 * 
 * Get PDF cleanup status and stats
 * Admin only
 */
export async function GET(request: NextRequest) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const status = getCleanupStatus()

    return NextResponse.json({
      success: true,
      ...status,
      stats: {
        ...status.stats,
        totalSizeMB: (status.stats.totalSize / 1024 / 1024).toFixed(2),
        oldestDate: status.stats.oldest?.toISOString() || null,
      },
    })

  } catch (error) {
    console.error("PDF cleanup status error:", error)
    return NextResponse.json(
      { error: "Failed to get cleanup status" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/pdf-cleanup
 * 
 * Run PDF cleanup manually
 * Admin only
 */
export async function POST(request: NextRequest) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const maxAgeHours = Number(body.maxAgeHours) || 24

    // Convert hours to milliseconds
    const maxAgeMs = maxAgeHours * 60 * 60 * 1000

    const result = runCleanup(maxAgeMs)

    return NextResponse.json({
      success: true,
      message: `تم حذف ${result.deleted} ملف`,
      deleted: result.deleted,
      remainingFiles: result.stats.count,
      remainingSizeMB: (result.stats.totalSize / 1024 / 1024).toFixed(2),
    })

  } catch (error) {
    console.error("PDF cleanup error:", error)
    return NextResponse.json(
      { error: "Failed to run cleanup" },
      { status: 500 }
    )
  }
}
