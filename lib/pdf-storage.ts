/**
 * PDF Storage and Cleanup System
 * 
 * نظام تخزين وتنظيف ملفات PDF
 * - يخزن PDF كملفات مؤقتة
 * - يمسح الملفات القديمة (أكثر من 24 ساعة)
 * 
 * Note: Uses HTML-based PDF generation
 * For actual PDF generation, use client-side libraries or external services
 */

import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"

// ==================== Constants ====================

// Saudi Riyal Symbol - Unicode
export const SAR_SYMBOL = "﷼"

// Temp directory for PDF files
const TEMP_PDF_DIR = path.join(process.cwd(), "temp", "pdf")

// Ensure temp directory exists
function ensureTempDir() {
  if (!fs.existsSync(TEMP_PDF_DIR)) {
    fs.mkdirSync(TEMP_PDF_DIR, { recursive: true })
  }
}

// ==================== Types ====================

export interface GeneratedPDF {
  id: string
  filePath: string
  fileName: string
  url: string
  createdAt: Date
}

export interface PDFStats {
  count: number
  totalSize: number
  oldest: Date | null
}

// ==================== Public API ====================

/**
 * Save PDF buffer to temp directory
 */
export async function savePDF(buffer: Buffer): Promise<GeneratedPDF> {
  ensureTempDir()
  
  const id = uuidv4()
  const fileName = `report-${id}.pdf`
  const filePath = path.join(TEMP_PDF_DIR, fileName)

  await fs.promises.writeFile(filePath, buffer)

  return {
    id,
    filePath,
    fileName,
    url: `/api/pdf/${id}`,
    createdAt: new Date(),
  }
}

/**
 * Save HTML content as PDF-ready file
 */
export async function saveHTMLForPDF(htmlContent: string): Promise<GeneratedPDF> {
  ensureTempDir()
  
  const id = uuidv4()
  const fileName = `report-${id}.html`
  const filePath = path.join(TEMP_PDF_DIR, fileName)

  await fs.promises.writeFile(filePath, htmlContent, "utf8")

  return {
    id,
    filePath,
    fileName,
    url: `/api/pdf/${id}`,
    createdAt: new Date(),
  }
}

/**
 * Get PDF file path by ID
 */
export function getPDFPath(id: string): string | null {
  ensureTempDir()
  
  // Check for PDF first
  const pdfPath = path.join(TEMP_PDF_DIR, `report-${id}.pdf`)
  if (fs.existsSync(pdfPath)) {
    return pdfPath
  }
  
  // Check for HTML
  const htmlPath = path.join(TEMP_PDF_DIR, `report-${id}.html`)
  if (fs.existsSync(htmlPath)) {
    return htmlPath
  }
  
  return null
}

/**
 * Get file type (pdf or html)
 */
export function getPDFType(id: string): "pdf" | "html" | null {
  ensureTempDir()
  
  const pdfPath = path.join(TEMP_PDF_DIR, `report-${id}.pdf`)
  if (fs.existsSync(pdfPath)) {
    return "pdf"
  }
  
  const htmlPath = path.join(TEMP_PDF_DIR, `report-${id}.html`)
  if (fs.existsSync(htmlPath)) {
    return "html"
  }
  
  return null
}

/**
 * Delete PDF file
 */
export function deletePDF(id: string): boolean {
  const filePath = getPDFPath(id)
  if (filePath) {
    try {
      fs.unlinkSync(filePath)
      return true
    } catch {
      return false
    }
  }
  return false
}

/**
 * Clean up old PDF files (older than maxAge in milliseconds)
 * Default: 24 hours
 */
export function cleanupOldPDFs(maxAgeMs: number = 24 * 60 * 60 * 1000): number {
  ensureTempDir()
  
  let deleted = 0
  const now = Date.now()

  try {
    const files = fs.readdirSync(TEMP_PDF_DIR)

    for (const file of files) {
      if (!file.startsWith("report-")) continue

      const filePath = path.join(TEMP_PDF_DIR, file)
      const stats = fs.statSync(filePath)
      const age = now - stats.mtimeMs

      if (age > maxAgeMs) {
        fs.unlinkSync(filePath)
        deleted++
      }
    }
  } catch (error) {
    console.error("Error cleaning up PDFs:", error)
  }

  return deleted
}

/**
 * Get PDF file stats
 */
export function getPDFStats(): PDFStats {
  ensureTempDir()
  
  let count = 0
  let totalSize = 0
  let oldest: Date | null = null

  try {
    const files = fs.readdirSync(TEMP_PDF_DIR)

    for (const file of files) {
      if (!file.startsWith("report-")) continue

      const filePath = path.join(TEMP_PDF_DIR, file)
      const stats = fs.statSync(filePath)

      count++
      totalSize += stats.size

      const fileDate = new Date(stats.mtimeMs)
      if (!oldest || fileDate < oldest) {
        oldest = fileDate
      }
    }
  } catch (error) {
    console.error("Error getting PDF stats:", error)
  }

  return { count, totalSize, oldest }
}

/**
 * Get cleanup status
 */
export function getCleanupStatus(): {
  maxAgeHours: number
  stats: PDFStats
} {
  return {
    maxAgeHours: 24,
    stats: getPDFStats(),
  }
}

/**
 * Run cleanup (wrapper for use in API routes)
 */
export function runCleanup(maxAgeMs?: number): {
  deleted: number
  stats: PDFStats
} {
  const deleted = cleanupOldPDFs(maxAgeMs)
  const stats = getPDFStats()
  
  console.log(`[PDF Cleanup] Deleted ${deleted} files. Remaining: ${stats.count} files`)
  
  return { deleted, stats }
}
