"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { 
  Upload, 
  Download, 
  FileSpreadsheet, 
  Check, 
  X, 
  AlertTriangle,
  Loader2,
  Info,
  FileText,
} from "lucide-react"
import { toast } from "sonner"
import type { ImportResult } from "@/lib/types"

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<Record<string, unknown>[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setResult(null)

    // Preview CSV/JSON
    try {
      const text = await selectedFile.text()
      let data: Record<string, unknown>[]

      if (selectedFile.name.endsWith(".csv")) {
        data = parseCSV(text)
      } else if (selectedFile.name.endsWith(".json")) {
        data = JSON.parse(text)
        if (!Array.isArray(data)) data = [data]
      } else {
        toast.error("صيغة الملف غير مدعومة")
        return
      }

      setPreview(data.slice(0, 5))
    } catch (error) {
      toast.error("خطأ في قراءة الملف")
      console.error(error)
    }
  }

  // Parse CSV
  const parseCSV = (csvString: string): Record<string, unknown>[] => {
    const lines = csvString.split("\n").filter(line => line.trim())
    if (lines.length < 2) return []

    const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/"/g, ""))
    
    return lines.slice(1).map(line => {
      const values = line.split(",").map(v => v.trim().replace(/"/g, ""))
      const row: Record<string, unknown> = {}
      
      headers.forEach((header, index) => {
        const value = values[index]
        if (!isNaN(Number(value)) && value !== "") {
          row[header] = Number(value)
        } else if (value === "true" || value === "false") {
          row[header] = value === "true"
        } else {
          row[header] = value || null
        }
      })
      
      return row
    })
  }

  // Upload and import
  const handleImport = async () => {
    if (!file) return

    setIsUploading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/admin/import", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.result) {
        setResult(data.result)
        if (data.result.success) {
          toast.success(`تم استيراد ${data.result.imported} سجل بنجاح`)
        } else {
          toast.error(`فشل الاستيراد مع ${data.result.errors.length} خطأ`)
        }
      } else if (data.error) {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error("خطأ في الاستيراد")
      console.error(error)
    } finally {
      setIsUploading(false)
    }
  }

  // Download template
  const downloadTemplate = async () => {
    try {
      const response = await fetch("/api/admin/import")
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "provider_import_template.csv"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      toast.success("تم تحميل القالب")
    } catch (error) {
      toast.error("خطأ في تحميل القالب")
      console.error(error)
    }
  }

  // Reset
  const reset = () => {
    setFile(null)
    setPreview([])
    setResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">استيراد المزودين</h1>
        <p className="text-muted-foreground">
          استيراد بيانات المزودين من ملف CSV أو JSON
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              رفع الملف
            </CardTitle>
            <CardDescription>
              اختر ملف CSV أو JSON يحتوي على بيانات المزودين
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Template Download */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>قالب الاستيراد</AlertTitle>
              <AlertDescription className="flex items-center justify-between">
                <span>قم بتحميل القالب للتعرف على الصيغة المطلوبة</span>
                <Button variant="outline" size="sm" onClick={downloadTemplate}>
                  <Download className="h-4 w-4 me-2" />
                  تحميل القالب
                </Button>
              </AlertDescription>
            </Alert>

            {/* File Input */}
            <div className="space-y-2">
              <Label>الملف</Label>
              <div className="flex gap-2">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.json"
                  onChange={handleFileChange}
                  className="flex-1"
                />
                {file && (
                  <Button variant="ghost" size="icon" onClick={reset}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {file && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>{file.name}</span>
                  <Badge variant="secondary">{(file.size / 1024).toFixed(1)} KB</Badge>
                </div>
              )}
            </div>

            {/* Import Button */}
            <Button 
              onClick={handleImport} 
              disabled={!file || isUploading}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin me-2" />
                  جاري الاستيراد...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 me-2" />
                  استيراد البيانات
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              تعليمات الاستيراد
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="shrink-0">1</Badge>
                <span>قم بتحميل القالب واستخدمه كأساس لملفك</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="shrink-0">2</Badge>
                <span>الحقول المطلوبة: provider_slug، name_ar، name_en</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="shrink-0">3</Badge>
                <span>استخدم الفاصلة (,) لفصل الأعمدة في CSV</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="shrink-0">4</Badge>
                <span>استخدم الخط العمودي (|) لفصل القيم المتعددة (مثل العملات والتكاملات)</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="shrink-0">5</Badge>
                <span>المزودون الموجودون سيتم تحديثهم بناءً على provider_slug</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">الأعمدة المدعومة:</h4>
              <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                <span>• provider_slug</span>
                <span>• name_ar</span>
                <span>• name_en</span>
                <span>• website_url</span>
                <span>• setup_fee</span>
                <span>• monthly_fee</span>
                <span>• payment_method_code</span>
                <span>• fee_percent</span>
                <span>• fee_fixed</span>
                <span>• activation_min/max</span>
                <span>• settlement_min/max</span>
                <span>• currencies</span>
                <span>• integrations</span>
                <span>• rating_avg/count/source</span>
                <span>• official_pricing_url</span>
                <span>• docs_url</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview */}
      {preview.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>معاينة البيانات (أول 5 سجلات)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(preview[0]).map((key) => (
                      <TableHead key={key} className="whitespace-nowrap">
                        {key}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {preview.map((row, i) => (
                    <TableRow key={i}>
                      {Object.values(row).map((value, j) => (
                        <TableCell key={j} className="max-w-[200px] truncate">
                          {value === null ? "-" : String(value)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Result */}
      {result && (
        <Card className={result.success ? "border-emerald-500" : "border-red-500"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.success ? (
                <>
                  <Check className="h-5 w-5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">نجح الاستيراد</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span className="text-red-600">فشل الاستيراد</span>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{result.imported}</div>
                <div className="text-sm text-muted-foreground">تم استيرادهم</div>
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{result.skipped}</div>
                <div className="text-sm text-muted-foreground">تم تخطيهم</div>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{result.errors.length}</div>
                <div className="text-sm text-muted-foreground">أخطاء</div>
              </div>
            </div>

            {result.imported > 0 && (
              <Progress 
                value={(result.imported / (result.imported + result.skipped + result.errors.length)) * 100} 
                className="h-2"
              />
            )}

            {result.errors.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2 text-red-600">الأخطاء:</h4>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {result.errors.map((err, i) => (
                    <Alert key={i} variant="destructive">
                      <AlertDescription>
                        <span className="font-medium">صف {err.row}:</span> {err.error}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

