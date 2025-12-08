import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import { getPDFPath } from "@/lib/pdf-storage"

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/pdf/[id]
 * 
 * Serve a generated PDF/HTML report file by its ID
 */
export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const { id } = await context.params

    // Validate ID format (UUID)
    if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return NextResponse.json(
        { error: "Invalid report ID" },
        { status: 400 }
      )
    }

    const filePath = getPDFPath(id)

    if (!filePath) {
      return NextResponse.json(
        { error: "Report not found or expired" },
        { status: 404 }
      )
    }

    // Read file
    const fileBuffer = fs.readFileSync(filePath)
    
    // Determine content type based on file extension
    const isHTML = filePath.endsWith('.html')
    const contentType = isHTML ? 'text/html; charset=utf-8' : 'application/pdf'
    const fileName = isHTML ? `report-${id}.html` : `report-${id}.pdf`

    // Return file
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${fileName}"`,
        "Cache-Control": "private, max-age=3600",
        "Content-Length": fileBuffer.length.toString(),
      },
    })

  } catch (error) {
    console.error("PDF serve error:", error)
    return NextResponse.json(
      { error: "Failed to serve PDF" },
      { status: 500 }
    )
  }
}
