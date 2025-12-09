/**
 * PDF Upload Service - Supabase Storage
 * 
 * خدمة رفع ملفات PDF إلى Supabase Storage
 * للحصول على روابط عامة لإرسالها عبر WhatsApp
 * 
 * السيناريو:
 * 1. توليد PDF
 * 2. رفعه إلى Supabase Storage
 * 3. الحصول على رابط عام
 * 4. إرسال الرابط لـ WhatsApp API (وشيج)
 * 5. حذف الملف بعد نجاح الإرسال
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'

// ==================== Types ====================

export interface UploadResult {
  success: boolean
  publicUrl?: string
  filePath?: string
  error?: string
}

// ==================== Supabase Client ====================

let supabaseClient: SupabaseClient | null = null

/**
 * Get Supabase client with service role (for storage operations)
 */
function getSupabaseClient(): SupabaseClient {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase configuration (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)')
  }

  supabaseClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  return supabaseClient
}

// ==================== Constants ====================

const BUCKET_NAME = 'pdf-reports'
const PDF_EXPIRY_HOURS = 24 // Delete files older than this

// ==================== Public API ====================

/**
 * Upload PDF buffer to Supabase Storage and get public URL
 * 
 * @param pdfBuffer - PDF file as Buffer
 * @param fileName - Desired filename (without path)
 * @returns UploadResult with public URL
 */
export async function uploadPDFToStorage(
  pdfBuffer: Buffer,
  fileName: string
): Promise<UploadResult> {
  try {
    const supabase = getSupabaseClient()

    // Ensure bucket exists
    await ensureBucketExists(supabase)

    // Generate unique file path
    const timestamp = Date.now()
    const filePath = `reports/${timestamp}-${fileName}`

    // Upload file
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, pdfBuffer, {
        contentType: 'application/pdf',
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('Supabase upload error:', error)
      return { success: false, error: error.message }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath)

    if (!urlData?.publicUrl) {
      return { success: false, error: 'Failed to get public URL' }
    }

    console.log('PDF uploaded successfully:', urlData.publicUrl)

    return {
      success: true,
      publicUrl: urlData.publicUrl,
      filePath: filePath,
    }
  } catch (error) {
    console.error('PDF upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    }
  }
}

/**
 * Delete PDF from Supabase Storage
 * Call this after successful WhatsApp delivery
 * 
 * @param filePath - File path in storage (from UploadResult)
 */
export async function deletePDFFromStorage(filePath: string): Promise<boolean> {
  try {
    const supabase = getSupabaseClient()

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath])

    if (error) {
      console.error('Failed to delete PDF:', error)
      return false
    }

    console.log('PDF deleted successfully:', filePath)
    return true
  } catch (error) {
    console.error('PDF delete error:', error)
    return false
  }
}

/**
 * Clean up old PDF files (older than PDF_EXPIRY_HOURS)
 * Can be called periodically via cron job
 */
export async function cleanupOldPDFs(): Promise<{ deleted: number; errors: number }> {
  try {
    const supabase = getSupabaseClient()

    // List all files in reports folder
    const { data: files, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list('reports', {
        limit: 1000,
      })

    if (error || !files) {
      console.error('Failed to list PDFs for cleanup:', error)
      return { deleted: 0, errors: 1 }
    }

    const cutoffTime = Date.now() - (PDF_EXPIRY_HOURS * 60 * 60 * 1000)
    const oldFiles: string[] = []

    for (const file of files) {
      // Extract timestamp from filename (format: {timestamp}-{name}.pdf)
      const match = file.name.match(/^(\d+)-/)
      if (match) {
        const fileTimestamp = parseInt(match[1], 10)
        if (fileTimestamp < cutoffTime) {
          oldFiles.push(`reports/${file.name}`)
        }
      }
    }

    if (oldFiles.length === 0) {
      return { deleted: 0, errors: 0 }
    }

    // Delete old files
    const { error: deleteError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove(oldFiles)

    if (deleteError) {
      console.error('Failed to delete old PDFs:', deleteError)
      return { deleted: 0, errors: oldFiles.length }
    }

    console.log(`Cleaned up ${oldFiles.length} old PDF files`)
    return { deleted: oldFiles.length, errors: 0 }
  } catch (error) {
    console.error('PDF cleanup error:', error)
    return { deleted: 0, errors: 1 }
  }
}

// ==================== Private Helpers ====================

/**
 * Ensure the PDF reports bucket exists and is public
 */
async function ensureBucketExists(supabase: SupabaseClient): Promise<void> {
  try {
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets()
    
    const bucketExists = buckets?.some(b => b.name === BUCKET_NAME)
    
    if (!bucketExists) {
      // Create bucket with public access
      const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 10 * 1024 * 1024, // 10MB max
        allowedMimeTypes: ['application/pdf'],
      })
      
      if (error && !error.message.includes('already exists')) {
        console.error('Failed to create bucket:', error)
        throw error
      }
      
      console.log('Created PDF reports bucket')
    }
  } catch (error) {
    // Bucket might already exist, that's fine
    console.log('Bucket check/create:', error instanceof Error ? error.message : 'OK')
  }
}
