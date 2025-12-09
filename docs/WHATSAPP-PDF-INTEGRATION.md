# WhatsApp PDF Integration - Developer Documentation

> **Last Updated:** December 9, 2025  
> **Author:** AI Assistant (Claude)  
> **Status:** ✅ Working

## Overview

This document describes the complete integration for sending PDF reports via WhatsApp, including all problems encountered and their solutions.

---

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   PDF Generator │────▶│ Supabase Storage│────▶│  WhatsApp API   │
│  (Local/Remote) │     │   (Temporary)   │     │  (wa.washeej)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
   PDFKit (local)         Public URL              Document + Text
   PDFShift (API)         Auto-delete             Single Request
```

---

## Key Components

### 1. PDF Generation (`lib/pdf-generator-local.ts`)
- **Technology:** PDFKit (Node.js)
- **Font:** Tajawal (Arabic support)
- **Output:** ~12KB PDF files

### 2. PDF Storage (`lib/supabase/storage.ts`)
- **Bucket:** `pdf-reports`
- **Visibility:** Public (required for WhatsApp)
- **Cleanup:** Auto-delete after sending

### 3. WhatsApp API (`lib/whatsapp.ts`)
- **Provider:** wa.washeej.com
- **Protocol:** REST API
- **Auth:** Bearer Token (JWT)

---

## Problems & Solutions

### ❌ Problem 1: PDFShift `wait_for: 'fonts'` Error

**Symptoms:**
```
PDFShift API error: {"error": "invalid wait_for parameter"}
```

**Root Cause:**  
PDFShift API doesn't support `wait_for: 'fonts'` parameter.

**Solution:**  
Replace with `delay` parameter:
```typescript
// ❌ WRONG
const options = { wait_for: 'fonts' };

// ✅ CORRECT
const options = { delay: 2000 };  // 2 seconds delay
```

---

### ❌ Problem 2: WhatsApp Document Not Sending (HTTP 300)

**Symptoms:**
- Text messages work ✅
- Document messages fail ❌
- HTTP status code: 300 (Multiple Choices)

**Root Cause:**  
WhatsApp API requires `filename` parameter for document messages.

**Solution:**  
Add `filename` to the document payload:
```typescript
// ❌ WRONG - Missing filename
const payload = {
  to: phoneNumber,
  type: 'document',
  document: {
    url: pdfUrl,
    caption: 'Report'
  }
};

// ✅ CORRECT - Include filename
const payload = {
  to: phoneNumber,
  type: 'document',
  document: {
    url: pdfUrl,
    caption: 'Report',
    filename: 'report.pdf'  // ← REQUIRED!
  }
};
```

**Key Code Change in `lib/whatsapp.ts`:**
```typescript
interface WhatsAppDocumentMessage {
  to: string;
  type: 'document';
  document: {
    url: string;
    caption?: string;
    filename: string;  // ← ADD THIS
  };
}

export async function sendWhatsAppDocument(
  to: string,
  documentUrl: string,
  caption?: string,
  filename: string = 'paygate-report.pdf'  // ← ADD THIS
): Promise<WhatsAppApiResponse> {
  // ...
  document: {
    url: documentUrl,
    caption: caption,
    filename: filename  // ← ADD THIS
  }
}
```

---

### ❌ Problem 3: Arabic Text Appears Reversed/Corrupted

**Symptoms:**
- Arabic text appears as: `عفدلا تاباوب` instead of `بوابات الدفع`
- Characters are in wrong order
- Text is unreadable

**Root Cause:**  
PDFKit (local PDF generator) doesn't natively support RTL (Right-to-Left) text layout.

**Solution 1 (Recommended): Use PDFShift for Arabic**

PDFShift uses a real browser engine that fully supports Arabic/RTL:
```typescript
// In lib/pdf-service.ts
// For Arabic, use PDFShift first (better RTL support)
if (locale === 'ar' && settings.pdfshiftApiKey) {
  console.log('Using PDFShift for Arabic (better RTL support)...')
  const result = await generateWithPDFShift(finalHtml, locale, settings.pdfshiftApiKey)
  if (result.success) {
    return result
  }
}
```

**Why PDFShift works:**
- Uses Chrome/Chromium headless browser
- Full CSS RTL support with `direction: rtl`
- Native Arabic font rendering
- Larger PDF size (~250KB) but perfect quality

**Solution 2 (Fallback): bidi-js for PDFKit**

If you must use PDFKit, use `bidi-js` library:
```typescript
import bidiFactory from 'bidi-js'
const bidi = bidiFactory()

function processArabicText(text: string): string {
  const embeddingLevels = bidi.getEmbeddingLevels(text, 'rtl')
  const segments = bidi.getReorderSegments(text, embeddingLevels)
  // Apply reordering...
  return chars.reverse().join('')
}
```

**Note:** bidi-js approach is more complex and may still have issues with mixed Arabic-English text.

---

## Environment Variables

```env
# PDFShift (Remote PDF Generation)
PDFSHIFT_API_KEY=sk_xxxxxxxxxxxxx

# Supabase (PDF Storage)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxx

# WhatsApp API
WHATSAPP_QR_API_URL=https://wa.washeej.com/api/v1
WHATSAPP_QR_API_TOKEN=eyJxxxxx
WHATSAPP_FROM_NUMBER=966565740429
```

---

## API Endpoints

### Test PDF Generation + WhatsApp
```
GET /api/test/pdf?phone=966XXXXXXXXX
```

**Response:**
```json
{
  "success": true,
  "pdfMethod": "pdfshift",
  "pdfSize": 12293,
  "publicUrl": "https://xxx.supabase.co/storage/v1/object/public/pdf-reports/reports/xxx.pdf",
  "whatsappTest": {
    "textResult": { "success": true, "messageType": "text" },
    "docResult": { "success": true, "messageType": "document" }
  }
}
```

---

## Testing Checklist

- [ ] PDF generates without errors
- [ ] PDF uploads to Supabase successfully
- [ ] Public URL is accessible
- [ ] WhatsApp text message sends
- [ ] WhatsApp document sends (with filename!)
- [ ] Arabic text renders correctly (RTL)
- [ ] PDF is deleted after sending

---

## File Structure

```
lib/
├── whatsapp.ts              # WhatsApp API functions
├── pdf-export.ts            # HTML template for PDFShift
├── pdf-generator-local.ts   # Local PDFKit generator
├── pdf-service.ts           # Orchestration layer
└── supabase/
    └── storage.ts           # Supabase storage functions

app/api/
├── test/
│   ├── pdf/route.ts         # PDF + WhatsApp test endpoint
│   └── whatsapp/route.ts    # Direct WhatsApp test
└── wizard/
    └── results/
        └── route.ts         # Production results endpoint
```

---

## Common Debugging Commands

```powershell
# Test PDF generation + WhatsApp
Invoke-RestMethod "http://localhost:3000/api/test/pdf?phone=966XXXXXXXXX"

# Test WhatsApp directly
$body = @{
  to = "966XXXXXXXXX"
  from = "966565740429"
  type = "text"
  text = @{ body = "Test message" }
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://wa.washeej.com/api/v1/messages" `
  -Method POST `
  -Headers @{ Authorization = "Bearer $token" } `
  -ContentType "application/json" `
  -Body $body
```

---

## Key Lessons Learned

1. **Always include `filename`** when sending documents via WhatsApp API
2. **Use `delay` instead of `wait_for`** with PDFShift
3. **Arabic/RTL requires special handling** - Use PDFShift for Arabic, PDFKit for English
4. **Supabase URLs must be public** for WhatsApp to fetch documents
5. **Delete PDFs after sending** to avoid storage bloat
6. **Test incrementally** - text first, then document, then both

---

## PDF Generation Strategy

| Locale | Primary | Fallback | Notes |
|--------|---------|----------|-------|
| Arabic | PDFShift | PDFKit (local) | PDFShift has full RTL support |
| English | PDFKit (local) | PDFShift | Faster, no API needed |

**Current Priority Order:**
1. Arabic → PDFShift (browser-based, perfect RTL)
2. English → PDFKit (local, fast, free)
3. Fallback → HTML2PDF API

---

## Future Improvements

- [ ] Add retry logic for failed WhatsApp messages
- [ ] Implement queue for bulk sending
- [ ] Add webhook for delivery status
- [ ] Consider switching to WhatsApp Business API Cloud
- [ ] Add PDF caching for repeated requests

---

## Support

For issues with this integration:
1. Check the error logs in terminal
2. Verify all environment variables are set
3. Test each component independently
4. Check WhatsApp connection status at wa.washeej.com

---

*Documentation maintained by the development team*
*Last tested: December 9, 2025 - All systems working ✅*
