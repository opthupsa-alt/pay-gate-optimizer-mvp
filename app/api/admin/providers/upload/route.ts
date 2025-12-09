import { NextRequest, NextResponse } from "next/server"
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Supabase client for storage
function getSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase configuration')
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

const BUCKET_NAME = 'provider-images'

// Ensure bucket exists
async function ensureBucketExists(supabase: SupabaseClient) {
  const { data: buckets } = await supabase.storage.listBuckets()
  const bucketExists = buckets?.some(b => b.name === BUCKET_NAME)
  
  if (!bucketExists) {
    const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
      fileSizeLimit: 5 * 1024 * 1024, // 5MB
    })
    if (error && !error.message.includes('already exists')) {
      console.error('Error creating bucket:', error)
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const type = formData.get("type") as string
    const slug = formData.get("slug") as string

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPG, PNG, WebP, SVG" },
        { status: 400 }
      )
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size: 5MB" },
        { status: 400 }
      )
    }

    const supabase = getSupabaseClient()
    
    // Ensure bucket exists
    await ensureBucketExists(supabase)

    // Generate filename
    const ext = file.name.split(".").pop() || "png"
    const timestamp = Date.now()
    const filePath = `${slug || 'uploads'}/${type}-${timestamp}.${ext}`

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '31536000', // 1 year cache
        upsert: true,
      })

    if (error) {
      console.error("Supabase upload error:", error)
      return NextResponse.json(
        { error: `Upload failed: ${error.message}` },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath)

    if (!urlData?.publicUrl) {
      return NextResponse.json(
        { error: "Failed to get public URL" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      filename: filePath,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload file" },
      { status: 500 }
    )
  }
}

// Route segment config for file uploads
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
