"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ExternalLink,
  Building2,
  Loader2,
  RefreshCw,
  Upload,
  ImageIcon,
  Star,
  X
} from "lucide-react"
import { toast } from "sonner"

// Provider type based on Prisma schema
interface Provider {
  id: string
  slug: string
  nameAr: string
  nameEn: string
  websiteUrl: string | null
  logoPath: string | null
  logoUrl: string | null
  coverImageUrl: string | null
  ogImageUrl: string | null
  keywordsAr: string[]
  keywordsEn: string[]
  metaTitleAr: string | null
  metaTitleEn: string | null
  metaDescriptionAr: string | null
  metaDescriptionEn: string | null
  displayOrder: number
  isFeatured: boolean
  activationTimeDaysMin: number
  activationTimeDaysMax: number
  settlementDaysMin: number
  settlementDaysMax: number
  supportChannels: string[]
  notesAr: string | null
  notesEn: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Form state for creating/editing provider
interface ProviderFormData {
  slug: string
  name_ar: string
  name_en: string
  website_url: string
  logo_url: string
  cover_image_url: string
  og_image_url: string
  keywords_ar: string[]
  keywords_en: string[]
  meta_title_ar: string
  meta_title_en: string
  meta_description_ar: string
  meta_description_en: string
  display_order: number
  is_featured: boolean
  activation_time_days_min: number
  activation_time_days_max: number
  settlement_days_min: number
  settlement_days_max: number
  notes_ar: string
  notes_en: string
  is_active: boolean
}

const initialFormData: ProviderFormData = {
  slug: "",
  name_ar: "",
  name_en: "",
  website_url: "",
  logo_url: "",
  cover_image_url: "",
  og_image_url: "",
  keywords_ar: [],
  keywords_en: [],
  meta_title_ar: "",
  meta_title_en: "",
  meta_description_ar: "",
  meta_description_en: "",
  display_order: 0,
  is_featured: false,
  activation_time_days_min: 1,
  activation_time_days_max: 7,
  settlement_days_min: 1,
  settlement_days_max: 3,
  notes_ar: "",
  notes_en: "",
  is_active: true,
}

export default function ProvidersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [providers, setProviders] = useState<Provider[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  
  // Keyword input states
  const [keywordInputAr, setKeywordInputAr] = useState("")
  const [keywordInputEn, setKeywordInputEn] = useState("")
  
  // File input refs
  const logoInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)
  const ogInputRef = useRef<HTMLInputElement>(null)
  
  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null)
  const [deletingProvider, setDeletingProvider] = useState<Provider | null>(null)
  
  // Form state
  const [formData, setFormData] = useState<ProviderFormData>(initialFormData)

  // Generate slug from English name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  // Upload image handler
  const handleImageUpload = async (file: File, type: 'logo' | 'cover' | 'og') => {
    if (!file) return
    
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      toast.error("حجم الملف كبير جداً. الحد الأقصى 5MB")
      return
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      toast.error("نوع الملف غير مدعوم. استخدم JPG, PNG, WebP, أو SVG")
      return
    }

    setIsUploading(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)
      formDataUpload.append('type', type)
      formDataUpload.append('slug', formData.slug || generateSlug(formData.name_en) || 'temp')

      const response = await fetch('/api/admin/providers/upload', {
        method: 'POST',
        body: formDataUpload,
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const data = await response.json()
      
      if (type === 'logo') {
        setFormData(prev => ({ ...prev, logo_url: data.url }))
      } else if (type === 'cover') {
        setFormData(prev => ({ ...prev, cover_image_url: data.url }))
      } else if (type === 'og') {
        setFormData(prev => ({ ...prev, og_image_url: data.url }))
      }

      toast.success("تم رفع الصورة بنجاح")
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error("فشل في رفع الصورة")
    } finally {
      setIsUploading(false)
    }
  }

  // Add keyword
  const addKeyword = (lang: 'ar' | 'en') => {
    const keyword = lang === 'ar' ? keywordInputAr.trim() : keywordInputEn.trim()
    if (!keyword) return

    const field = lang === 'ar' ? 'keywords_ar' : 'keywords_en'
    const currentKeywords = formData[field]
    
    if (currentKeywords.includes(keyword)) {
      toast.error("الكلمة موجودة مسبقاً")
      return
    }

    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], keyword]
    }))

    if (lang === 'ar') {
      setKeywordInputAr("")
    } else {
      setKeywordInputEn("")
    }
  }

  // Remove keyword
  const removeKeyword = (lang: 'ar' | 'en', keyword: string) => {
    const field = lang === 'ar' ? 'keywords_ar' : 'keywords_en'
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(k => k !== keyword)
    }))
  }

  // Fetch providers from API
  const fetchProviders = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/providers")
      if (!response.ok) {
        throw new Error("Failed to fetch providers")
      }
      const data = await response.json()
      setProviders(data.providers || [])
    } catch (error) {
      console.error("Error fetching providers:", error)
      toast.error("فشل في جلب البيانات")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProviders()
  }, [fetchProviders])

  // Filter providers by search
  const filteredProviders = providers.filter(
    (p) =>
      p.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Open dialog for creating new provider
  const handleOpenCreate = () => {
    setEditingProvider(null)
    setFormData(initialFormData)
    setKeywordInputAr("")
    setKeywordInputEn("")
    setIsDialogOpen(true)
  }

  // Open dialog for editing provider
  const handleOpenEdit = (provider: Provider) => {
    setEditingProvider(provider)
    setFormData({
      slug: provider.slug,
      name_ar: provider.nameAr,
      name_en: provider.nameEn,
      website_url: provider.websiteUrl || "",
      logo_url: provider.logoUrl || provider.logoPath || "",
      cover_image_url: provider.coverImageUrl || "",
      og_image_url: provider.ogImageUrl || "",
      keywords_ar: Array.isArray(provider.keywordsAr) ? provider.keywordsAr : [],
      keywords_en: Array.isArray(provider.keywordsEn) ? provider.keywordsEn : [],
      meta_title_ar: provider.metaTitleAr || "",
      meta_title_en: provider.metaTitleEn || "",
      meta_description_ar: provider.metaDescriptionAr || "",
      meta_description_en: provider.metaDescriptionEn || "",
      display_order: provider.displayOrder || 0,
      is_featured: provider.isFeatured || false,
      activation_time_days_min: provider.activationTimeDaysMin,
      activation_time_days_max: provider.activationTimeDaysMax,
      settlement_days_min: provider.settlementDaysMin,
      settlement_days_max: provider.settlementDaysMax,
      notes_ar: provider.notesAr || "",
      notes_en: provider.notesEn || "",
      is_active: provider.isActive,
    })
    setKeywordInputAr("")
    setKeywordInputEn("")
    setIsDialogOpen(true)
  }

  // Open delete confirmation dialog
  const handleOpenDelete = (provider: Provider) => {
    setDeletingProvider(provider)
    setIsDeleteDialogOpen(true)
  }

  // Save provider (create or update)
  const handleSave = async () => {
    if (!formData.name_ar.trim() || !formData.name_en.trim()) {
      toast.error("الاسم بالعربية والإنجليزية مطلوب")
      return
    }

    const slug = formData.slug.trim() || generateSlug(formData.name_en)

    setIsSaving(true)
    try {
      const method = editingProvider ? "PUT" : "POST"
      const body = editingProvider 
        ? { id: editingProvider.id, ...formData, slug }
        : { ...formData, slug }

      const response = await fetch("/api/admin/providers", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save provider")
      }

      toast.success(editingProvider ? "تم تحديث المزود بنجاح" : "تم إضافة المزود بنجاح")
      setIsDialogOpen(false)
      fetchProviders()
    } catch (error) {
      console.error("Error saving provider:", error)
      toast.error(error instanceof Error ? error.message : "فشل في حفظ البيانات")
    } finally {
      setIsSaving(false)
    }
  }

  // Delete provider
  const handleDelete = async () => {
    if (!deletingProvider) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/providers?id=${deletingProvider.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete provider")
      }

      toast.success("تم حذف المزود بنجاح")
      setIsDeleteDialogOpen(false)
      setDeletingProvider(null)
      fetchProviders()
    } catch (error) {
      console.error("Error deleting provider:", error)
      toast.error(error instanceof Error ? error.message : "فشل في حذف المزود")
    } finally {
      setIsSaving(false)
    }
  }

  // Toggle provider active status
  const handleToggleActive = async (provider: Provider) => {
    try {
      const response = await fetch("/api/admin/providers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: provider.id,
          is_active: !provider.isActive,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update provider")
      }

      setProviders(providers.map(p => 
        p.id === provider.id ? { ...p, isActive: !p.isActive } : p
      ))
      toast.success(provider.isActive ? "تم تعطيل المزود" : "تم تفعيل المزود")
    } catch (error) {
      console.error("Error toggling provider:", error)
      toast.error("فشل في تحديث الحالة")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">مزودي الخدمة</h1>
          <p className="text-muted-foreground">إدارة بوابات الدفع ومعلوماتها</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchProviders} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 me-2 ${isLoading ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
          <Button onClick={handleOpenCreate}>
            <Plus className="h-4 w-4 me-2" />
            إضافة مزود
          </Button>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProvider ? "تعديل المزود" : "إضافة مزود جديد"}
            </DialogTitle>
            <DialogDescription>
              أدخل معلومات مزود الخدمة
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">المعلومات الأساسية</TabsTrigger>
              <TabsTrigger value="images">الصور</TabsTrigger>
              <TabsTrigger value="seo">SEO والكلمات المفتاحية</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name_ar">الاسم بالعربية *</Label>
                  <Input 
                    id="name_ar"
                    placeholder="مثال: ميسر" 
                    value={formData.name_ar}
                    onChange={(e) => setFormData({...formData, name_ar: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name_en">الاسم بالإنجليزية *</Label>
                  <Input 
                    id="name_en"
                    placeholder="e.g., Moyasar" 
                    dir="ltr"
                    value={formData.name_en}
                    onChange={(e) => setFormData({...formData, name_en: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slug">المعرف (Slug)</Label>
                  <Input 
                    id="slug"
                    placeholder="يُنشأ تلقائياً من الاسم الإنجليزي" 
                    dir="ltr"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website_url">الموقع الإلكتروني</Label>
                  <Input 
                    id="website_url"
                    placeholder="https://example.com" 
                    dir="ltr"
                    value={formData.website_url}
                    onChange={(e) => setFormData({...formData, website_url: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>وقت التفعيل (أيام)</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="number" 
                      placeholder="الحد الأدنى" 
                      min={1}
                      value={formData.activation_time_days_min}
                      onChange={(e) => setFormData({...formData, activation_time_days_min: parseInt(e.target.value) || 1})}
                    />
                    <Input 
                      type="number" 
                      placeholder="الحد الأقصى" 
                      min={1}
                      value={formData.activation_time_days_max}
                      onChange={(e) => setFormData({...formData, activation_time_days_max: parseInt(e.target.value) || 7})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>وقت التسوية (أيام)</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="number" 
                      placeholder="الحد الأدنى" 
                      min={1}
                      value={formData.settlement_days_min}
                      onChange={(e) => setFormData({...formData, settlement_days_min: parseInt(e.target.value) || 1})}
                    />
                    <Input 
                      type="number" 
                      placeholder="الحد الأقصى" 
                      min={1}
                      value={formData.settlement_days_max}
                      onChange={(e) => setFormData({...formData, settlement_days_max: parseInt(e.target.value) || 3})}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="notes_ar">ملاحظات بالعربية</Label>
                  <Input 
                    id="notes_ar"
                    placeholder="ملاحظات إضافية..." 
                    value={formData.notes_ar}
                    onChange={(e) => setFormData({...formData, notes_ar: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes_en">ملاحظات بالإنجليزية</Label>
                  <Input 
                    id="notes_en"
                    placeholder="Additional notes..." 
                    dir="ltr"
                    value={formData.notes_en}
                    onChange={(e) => setFormData({...formData, notes_en: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="display_order">ترتيب العرض</Label>
                  <Input 
                    id="display_order"
                    type="number"
                    min={0}
                    value={formData.display_order}
                    onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({...formData, is_featured: checked})}
                  />
                  <Label htmlFor="is_featured" className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-amber-500" />
                    مزود مميز
                  </Label>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                  />
                  <Label htmlFor="is_active">مزود نشط</Label>
                </div>
              </div>
            </TabsContent>

            {/* Images Tab */}
            <TabsContent value="images" className="space-y-6 mt-4">
              {/* Logo Upload */}
              <div className="space-y-3">
                <Label>الشعار (Logo)</Label>
                <div className="flex items-start gap-4">
                  <div className="relative w-24 h-24 border-2 border-dashed rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                    {formData.logo_url ? (
                      <Image
                        src={formData.logo_url}
                        alt="Logo preview"
                        fill
                        className="object-contain p-2"
                      />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="رابط الشعار أو ارفع صورة"
                        dir="ltr"
                        value={formData.logo_url}
                        onChange={(e) => setFormData({...formData, logo_url: e.target.value})}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => logoInputRef.current?.click()}
                        disabled={isUploading}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'logo')}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">الحجم المثالي: 200x200 بكسل. الصيغ المدعومة: PNG, JPG, WebP, SVG</p>
                  </div>
                </div>
              </div>

              {/* Cover Image Upload */}
              <div className="space-y-3">
                <Label>صورة الغلاف (Cover)</Label>
                <div className="space-y-2">
                  <div className="relative w-full h-32 border-2 border-dashed rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                    {formData.cover_image_url ? (
                      <Image
                        src={formData.cover_image_url}
                        alt="Cover preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="رابط صورة الغلاف أو ارفع صورة"
                      dir="ltr"
                      value={formData.cover_image_url}
                      onChange={(e) => setFormData({...formData, cover_image_url: e.target.value})}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => coverInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'cover')}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">الحجم المثالي: 1200x400 بكسل للغلاف العريض</p>
                </div>
              </div>

              {/* OG Image Upload */}
              <div className="space-y-3">
                <Label>صورة المشاركة (OG Image)</Label>
                <div className="space-y-2">
                  <div className="relative w-full h-40 border-2 border-dashed rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                    {formData.og_image_url ? (
                      <Image
                        src={formData.og_image_url}
                        alt="OG preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mt-2">تظهر عند مشاركة الرابط في واتساب وتويتر</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="رابط صورة المشاركة أو ارفع صورة"
                      dir="ltr"
                      value={formData.og_image_url}
                      onChange={(e) => setFormData({...formData, og_image_url: e.target.value})}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => ogInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                    <input
                      ref={ogInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'og')}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">الحجم المثالي: 1200x630 بكسل (نسبة 1.91:1)</p>
                </div>
              </div>
            </TabsContent>

            {/* SEO Tab */}
            <TabsContent value="seo" className="space-y-6 mt-4">
              {/* Meta Titles */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="meta_title_ar">عنوان الميتا بالعربية</Label>
                  <Input 
                    id="meta_title_ar"
                    placeholder="عنوان يظهر في نتائج البحث..."
                    value={formData.meta_title_ar}
                    onChange={(e) => setFormData({...formData, meta_title_ar: e.target.value})}
                  />
                  <p className="text-xs text-muted-foreground">{formData.meta_title_ar.length}/60 حرف</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meta_title_en">عنوان الميتا بالإنجليزية</Label>
                  <Input 
                    id="meta_title_en"
                    placeholder="Meta title for search engines..."
                    dir="ltr"
                    value={formData.meta_title_en}
                    onChange={(e) => setFormData({...formData, meta_title_en: e.target.value})}
                  />
                  <p className="text-xs text-muted-foreground">{formData.meta_title_en.length}/60 characters</p>
                </div>
              </div>

              {/* Meta Descriptions */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="meta_description_ar">وصف الميتا بالعربية</Label>
                  <Textarea 
                    id="meta_description_ar"
                    placeholder="وصف يظهر في نتائج البحث..."
                    rows={3}
                    value={formData.meta_description_ar}
                    onChange={(e) => setFormData({...formData, meta_description_ar: e.target.value})}
                  />
                  <p className="text-xs text-muted-foreground">{formData.meta_description_ar.length}/160 حرف</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meta_description_en">وصف الميتا بالإنجليزية</Label>
                  <Textarea 
                    id="meta_description_en"
                    placeholder="Meta description for search engines..."
                    dir="ltr"
                    rows={3}
                    value={formData.meta_description_en}
                    onChange={(e) => setFormData({...formData, meta_description_en: e.target.value})}
                  />
                  <p className="text-xs text-muted-foreground">{formData.meta_description_en.length}/160 characters</p>
                </div>
              </div>

              {/* Keywords Arabic */}
              <div className="space-y-2">
                <Label>الكلمات المفتاحية بالعربية</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="أضف كلمة مفتاحية..."
                    value={keywordInputAr}
                    onChange={(e) => setKeywordInputAr(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addKeyword('ar')
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={() => addKeyword('ar')}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.keywords_ar.map((keyword, i) => (
                    <Badge key={i} variant="secondary" className="gap-1">
                      {keyword}
                      <button type="button" onClick={() => removeKeyword('ar', keyword)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Keywords English */}
              <div className="space-y-2">
                <Label>الكلمات المفتاحية بالإنجليزية</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Add a keyword..."
                    dir="ltr"
                    value={keywordInputEn}
                    onChange={(e) => setKeywordInputEn(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addKeyword('en')
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={() => addKeyword('en')}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.keywords_en.map((keyword, i) => (
                    <Badge key={i} variant="secondary" className="gap-1">
                      {keyword}
                      <button type="button" onClick={() => removeKeyword('en', keyword)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving || isUploading}>
              إلغاء
            </Button>
            <Button onClick={handleSave} disabled={isSaving || isUploading}>
              {isSaving && <Loader2 className="h-4 w-4 me-2 animate-spin" />}
              {editingProvider ? "تحديث" : "إضافة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف المزود؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف المزود "{deletingProvider?.nameAr}" نهائياً. هذا الإجراء لا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSaving}>إلغاء</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={isSaving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSaving && <Loader2 className="h-4 w-4 me-2 animate-spin" />}
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="البحث عن مزود..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          ) : filteredProviders.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium">لا توجد نتائج</p>
              <p className="text-muted-foreground">
                {searchQuery ? "جرب البحث بكلمات أخرى" : "أضف مزود جديد للبدء"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المزود</TableHead>
                  <TableHead>الموقع</TableHead>
                  <TableHead>التفعيل</TableHead>
                  <TableHead>التسوية</TableHead>
                  <TableHead>مميز</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead className="text-end">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProviders.map((provider) => (
                  <TableRow key={provider.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-muted border flex items-center justify-center">
                          {(provider.logoUrl || provider.logoPath) ? (
                            <Image
                              src={provider.logoUrl || provider.logoPath || ""}
                              alt={provider.nameAr}
                              fill
                              className="object-contain p-1"
                            />
                          ) : (
                            <Building2 className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{provider.nameAr}</p>
                          <p className="text-sm text-muted-foreground">{provider.nameEn}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {provider.websiteUrl && (
                        <a 
                          href={provider.websiteUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          زيارة
                        </a>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {provider.activationTimeDaysMin}-{provider.activationTimeDaysMax} يوم
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {provider.settlementDaysMin}-{provider.settlementDaysMax} يوم
                      </span>
                    </TableCell>
                    <TableCell>
                      {provider.isFeatured && (
                        <Badge variant="default" className="bg-amber-500 text-white">
                          <Star className="h-3 w-3 me-1 fill-white" />
                          مميز
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={provider.isActive}
                          onCheckedChange={() => handleToggleActive(provider)}
                        />
                        <Badge variant={provider.isActive ? "default" : "secondary"}>
                          {provider.isActive ? "نشط" : "معطل"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-end">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(provider)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive"
                          onClick={() => handleOpenDelete(provider)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

