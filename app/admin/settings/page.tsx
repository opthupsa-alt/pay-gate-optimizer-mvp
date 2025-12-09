"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { 
  Save, 
  Loader2,
  Settings,
  Scale,
  Bell,
  RefreshCw,
  Palette,
  Globe,
  MessageCircle,
  Phone,
  Share2,
  FileText,
} from "lucide-react"
import { toast } from "sonner"

interface ScoringWeight {
  factor: string
  weight: number
  description?: string
}

interface GeneralSettings {
  maxRecommendations: number
  minGmv: number
  minTransactions: number
  enableNotifications: boolean
  enableAnalytics: boolean
  maintenanceMode: boolean
}

interface SiteSetting {
  id: string
  key: string
  value: string
  type: string
  group: string
  label: string
  description: string | null
}

type SiteSettingsMap = Record<string, SiteSetting[]>

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("site")
  
  // Scoring weights
  const [costWeight, setCostWeight] = useState(50)
  const [fitWeight, setFitWeight] = useState(25)
  const [opsWeight, setOpsWeight] = useState(15)
  const [riskWeight, setRiskWeight] = useState(10)

  // General settings
  const [settings, setSettings] = useState<GeneralSettings>({
    maxRecommendations: 3,
    minGmv: 1000,
    minTransactions: 10,
    enableNotifications: true,
    enableAnalytics: true,
    maintenanceMode: false,
  })

  // Site settings
  const [siteSettings, setSiteSettings] = useState<SiteSettingsMap>({})
  const [siteSettingsValues, setSiteSettingsValues] = useState<Record<string, string>>({})
  const [groupLabels, setGroupLabels] = useState<Record<string, string>>({})

  const totalWeight = costWeight + fitWeight + opsWeight + riskWeight
  const isWeightValid = totalWeight === 100

  // Fetch scoring settings
  const fetchScoringSettings = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/settings")
      if (!response.ok) throw new Error("Failed to fetch settings")
      const data = await response.json()
      
      if (data.weights && Array.isArray(data.weights)) {
        const weightMap: Record<string, number> = {}
        data.weights.forEach((w: ScoringWeight) => {
          weightMap[w.factor] = w.weight
        })
        setCostWeight(weightMap.cost ?? 50)
        setFitWeight(weightMap.fit ?? 25)
        setOpsWeight(weightMap.ops ?? 15)
        setRiskWeight(weightMap.risk ?? 10)
      }
      
      if (data.settings) {
        setSettings(data.settings)
      }
    } catch (error) {
      console.error("Error fetching scoring settings:", error)
    }
  }, [])

  // Fetch site settings
  const fetchSiteSettings = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/site-settings")
      if (!response.ok) throw new Error("Failed to fetch site settings")
      const data = await response.json()
      
      if (data.settings) {
        setSiteSettings(data.settings)
        // Build values map
        const values: Record<string, string> = {}
        Object.values(data.settings as SiteSettingsMap).flat().forEach((s) => {
          values[s.key] = s.value
        })
        setSiteSettingsValues(values)
      }
      
      if (data.groupLabels) {
        setGroupLabels(data.groupLabels)
      }
    } catch (error) {
      console.error("Error fetching site settings:", error)
    }
  }, [])

  // Fetch all settings
  const fetchAllSettings = useCallback(async () => {
    setIsLoading(true)
    try {
      await Promise.all([fetchScoringSettings(), fetchSiteSettings()])
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast.error("فشل في جلب الإعدادات")
    } finally {
      setIsLoading(false)
    }
  }, [fetchScoringSettings, fetchSiteSettings])

  useEffect(() => {
    fetchAllSettings()
  }, [fetchAllSettings])

  const handleSaveWeights = async () => {
    if (!isWeightValid) {
      toast.error("مجموع الأوزان يجب أن يساوي 100%")
      return
    }
    
    setIsSaving(true)
    try {
      const weights: ScoringWeight[] = [
        { factor: "cost", weight: costWeight, description: "وزن التكلفة الإجمالية في التقييم" },
        { factor: "fit", weight: fitWeight, description: "وزن توافق المميزات مع احتياجات التاجر" },
        { factor: "ops", weight: opsWeight, description: "وزن جودة الدعم والتفعيل والتوثيق" },
        { factor: "risk", weight: riskWeight, description: "وزن عوامل المخاطر والاستقرار" },
      ]

      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weights }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save weights")
      }

      toast.success("تم حفظ أوزان التقييم بنجاح")
    } catch (error) {
      console.error("Error saving weights:", error)
      toast.error(error instanceof Error ? error.message : "فشل في حفظ الأوزان")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save settings")
      }

      toast.success("تم حفظ الإعدادات بنجاح")
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error(error instanceof Error ? error.message : "فشل في حفظ الإعدادات")
    } finally {
      setIsSaving(false)
    }
  }

  // Handle site setting value change
  const handleSiteSettingChange = (key: string, value: string) => {
    setSiteSettingsValues(prev => ({ ...prev, [key]: value }))
  }

  // Save site settings for a specific group
  const handleSaveSiteSettings = async (group: string) => {
    setIsSaving(true)
    try {
      // Get settings for this group
      const groupSettings = siteSettings[group] || []
      const settingsToUpdate: Record<string, string> = {}
      
      for (const setting of groupSettings) {
        if (siteSettingsValues[setting.key] !== undefined) {
          settingsToUpdate[setting.key] = siteSettingsValues[setting.key]
        }
      }

      const response = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: settingsToUpdate }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save site settings")
      }

      toast.success("تم حفظ الإعدادات بنجاح")
    } catch (error) {
      console.error("Error saving site settings:", error)
      toast.error(error instanceof Error ? error.message : "فشل في حفظ الإعدادات")
    } finally {
      setIsSaving(false)
    }
  }

  // Render setting input based on type
  const renderSettingInput = (setting: SiteSetting) => {
    const value = siteSettingsValues[setting.key] ?? setting.value

    switch (setting.type) {
      case "boolean":
        return (
          <Switch
            checked={value === "true"}
            onCheckedChange={(v) => handleSiteSettingChange(setting.key, v ? "true" : "false")}
          />
        )
      case "color":
        return (
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={value}
              onChange={(e) => handleSiteSettingChange(setting.key, e.target.value)}
              className="h-10 w-16 cursor-pointer rounded border"
            />
            <Input
              value={value}
              onChange={(e) => handleSiteSettingChange(setting.key, e.target.value)}
              dir="ltr"
              className="flex-1"
            />
          </div>
        )
      case "number":
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleSiteSettingChange(setting.key, e.target.value)}
            dir="ltr"
          />
        )
      case "image":
        return (
          <Input
            value={value}
            onChange={(e) => handleSiteSettingChange(setting.key, e.target.value)}
            placeholder="/path/to/image.png"
            dir="ltr"
          />
        )
      default:
        // Check if it's a long text
        if (value.length > 100 || setting.key.includes("description")) {
          return (
            <Textarea
              value={value}
              onChange={(e) => handleSiteSettingChange(setting.key, e.target.value)}
              rows={3}
            />
          )
        }
        return (
          <Input
            value={value}
            onChange={(e) => handleSiteSettingChange(setting.key, e.target.value)}
            dir={setting.key.includes("_ar") || setting.group === "seo" ? "rtl" : "ltr"}
          />
        )
    }
  }

  // Get icon for group
  const getGroupIcon = (group: string) => {
    switch (group) {
      case "branding": return <Palette className="h-4 w-4" />
      case "seo": return <Globe className="h-4 w-4" />
      case "whatsapp": return <MessageCircle className="h-4 w-4" />
      case "contact": return <Phone className="h-4 w-4" />
      case "social": return <Share2 className="h-4 w-4" />
      case "pdf": return <FileText className="h-4 w-4" />
      default: return <Settings className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">الإعدادات</h1>
          <p className="text-muted-foreground">إدارة إعدادات المنصة والعلامة التجارية والواتساب</p>
        </div>
        <Button variant="outline" onClick={fetchAllSettings} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 me-2 ${isLoading ? 'animate-spin' : ''}`} />
          تحديث
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ) : (
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="site" className="gap-2">
            <Palette className="h-4 w-4" />
            العلامة التجارية
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            الواتساب
          </TabsTrigger>
          <TabsTrigger value="pdf" className="gap-2">
            <FileText className="h-4 w-4" />
            PDF
          </TabsTrigger>
          <TabsTrigger value="seo" className="gap-2">
            <Globe className="h-4 w-4" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="scoring" className="gap-2">
            <Scale className="h-4 w-4" />
            أوزان التقييم
          </TabsTrigger>
          <TabsTrigger value="general" className="gap-2">
            <Settings className="h-4 w-4" />
            عام
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            الإشعارات
          </TabsTrigger>
        </TabsList>

        {/* Site Branding Settings */}
        <TabsContent value="site">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                العلامة التجارية
              </CardTitle>
              <CardDescription>
                إعدادات اسم المنصة والشعار والألوان
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {siteSettings.branding?.map((setting) => (
                <div key={setting.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{setting.label}</Label>
                    {setting.type === "boolean" && renderSettingInput(setting)}
                  </div>
                  {setting.type !== "boolean" && renderSettingInput(setting)}
                  {setting.description && (
                    <p className="text-xs text-muted-foreground">{setting.description}</p>
                  )}
                </div>
              ))}

              <Separator />

              <Button onClick={() => handleSaveSiteSettings("branding")} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin me-2" />
                ) : (
                  <Save className="h-4 w-4 me-2" />
                )}
                حفظ إعدادات العلامة التجارية
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* WhatsApp Settings */}
        <TabsContent value="whatsapp">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                إعدادات الواتساب
              </CardTitle>
              <CardDescription>
                إعدادات إرسال الرسائل عبر الواتساب
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {siteSettings.whatsapp?.map((setting) => (
                <div key={setting.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{setting.label}</Label>
                    {setting.type === "boolean" && renderSettingInput(setting)}
                  </div>
                  {setting.type !== "boolean" && renderSettingInput(setting)}
                  {setting.description && (
                    <p className="text-xs text-muted-foreground">{setting.description}</p>
                  )}
                </div>
              ))}

              <Separator />

              <Button onClick={() => handleSaveSiteSettings("whatsapp")} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin me-2" />
                ) : (
                  <Save className="h-4 w-4 me-2" />
                )}
                حفظ إعدادات الواتساب
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PDF Settings */}
        <TabsContent value="pdf">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                إعدادات توليد PDF
              </CardTitle>
              <CardDescription>
                إعدادات توليد ملفات PDF الاحترافية للنتائج
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {siteSettings.pdf?.map((setting) => (
                <div key={setting.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{setting.label}</Label>
                    {setting.type === "boolean" && renderSettingInput(setting)}
                  </div>
                  {setting.type !== "boolean" && (
                    <>
                      {renderSettingInput(setting)}
                      {setting.key.includes("api_key") && (
                        <p className="text-xs text-amber-600 dark:text-amber-400">
                          ⚠️ مفتاح API حساس - لا يظهر للمستخدمين
                        </p>
                      )}
                    </>
                  )}
                  {setting.description && (
                    <p className="text-xs text-muted-foreground">{setting.description}</p>
                  )}
                </div>
              ))}

              {(!siteSettings.pdf || siteSettings.pdf.length === 0) && (
                <div className="text-center py-6 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>لم يتم العثور على إعدادات PDF</p>
                  <p className="text-sm">سيتم إنشاؤها تلقائياً عند أول استخدام</p>
                </div>
              )}

              <Separator />

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h4 className="font-medium">ملاحظات:</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li><strong>PDFShift:</strong> جودة عالية، مجاني 50 ملف/شهر - <a href="https://pdfshift.io" target="_blank" className="text-primary hover:underline">pdfshift.io</a></li>
                  <li><strong>HTML2PDF:</strong> بديل جيد، مجاني 100 ملف/شهر - <a href="https://html2pdf.app" target="_blank" className="text-primary hover:underline">html2pdf.app</a></li>
                  <li>إذا لم يتوفر مزود، سيتم إرسال رابط النتائج بدلاً من PDF</li>
                </ul>
              </div>

              <Button onClick={() => handleSaveSiteSettings("pdf")} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin me-2" />
                ) : (
                  <Save className="h-4 w-4 me-2" />
                )}
                حفظ إعدادات PDF
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Settings */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                تحسين محركات البحث (SEO)
              </CardTitle>
              <CardDescription>
                إعدادات العنوان والوصف للظهور في محركات البحث
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {siteSettings.seo?.map((setting) => (
                <div key={setting.key} className="space-y-2">
                  <Label>{setting.label}</Label>
                  {renderSettingInput(setting)}
                  {setting.description && (
                    <p className="text-xs text-muted-foreground">{setting.description}</p>
                  )}
                </div>
              ))}

              <Separator />

              <Button onClick={() => handleSaveSiteSettings("seo")} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin me-2" />
                ) : (
                  <Save className="h-4 w-4 me-2" />
                )}
                حفظ إعدادات SEO
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scoring Weights */}
        <TabsContent value="scoring">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                أوزان التقييم
              </CardTitle>
              <CardDescription>
                حدد أوزان المعايير المختلفة في حساب التقييم الإجمالي (المجموع = 100%)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Cost Weight */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>التكلفة (Cost)</Label>
                  <span className="text-sm font-medium">{costWeight}%</span>
                </div>
                <Slider
                  value={[costWeight]}
                  onValueChange={([v]) => setCostWeight(v)}
                  max={100}
                  step={5}
                />
                <p className="text-xs text-muted-foreground">
                  وزن التكلفة الإجمالية في التقييم
                </p>
              </div>

              {/* Fit Weight */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>التوافق (Fit)</Label>
                  <span className="text-sm font-medium">{fitWeight}%</span>
                </div>
                <Slider
                  value={[fitWeight]}
                  onValueChange={([v]) => setFitWeight(v)}
                  max={100}
                  step={5}
                />
                <p className="text-xs text-muted-foreground">
                  وزن توافق المميزات مع احتياجات التاجر
                </p>
              </div>

              {/* Ops Weight */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>العمليات (Operations)</Label>
                  <span className="text-sm font-medium">{opsWeight}%</span>
                </div>
                <Slider
                  value={[opsWeight]}
                  onValueChange={([v]) => setOpsWeight(v)}
                  max={100}
                  step={5}
                />
                <p className="text-xs text-muted-foreground">
                  وزن جودة الدعم والتفعيل والتوثيق
                </p>
              </div>

              {/* Risk Weight */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>المخاطر (Risk)</Label>
                  <span className="text-sm font-medium">{riskWeight}%</span>
                </div>
                <Slider
                  value={[riskWeight]}
                  onValueChange={([v]) => setRiskWeight(v)}
                  max={100}
                  step={5}
                />
                <p className="text-xs text-muted-foreground">
                  وزن عوامل المخاطر والاستقرار
                </p>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">المجموع الإجمالي</p>
                  <p className={`text-sm ${isWeightValid ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600'}`}>
                    {totalWeight}% {isWeightValid ? '✓' : '(يجب أن يساوي 100%)'}
                  </p>
                </div>
                <Button onClick={handleSaveWeights} disabled={isSaving || !isWeightValid}>
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin me-2" />
                  ) : (
                    <Save className="h-4 w-4 me-2" />
                  )}
                  حفظ الأوزان
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                الإعدادات العامة
              </CardTitle>
              <CardDescription>
                إعدادات عامة للمنصة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>عدد التوصيات القصوى</Label>
                  <Input
                    type="number"
                    value={settings.maxRecommendations}
                    onChange={(e) => setSettings({ ...settings, maxRecommendations: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>الحد الأدنى للمبيعات (ريال)</Label>
                  <Input
                    type="number"
                    value={settings.minGmv}
                    onChange={(e) => setSettings({ ...settings, minGmv: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>الحد الأدنى لعدد العمليات</Label>
                  <Input
                    type="number"
                    value={settings.minTransactions}
                    onChange={(e) => setSettings({ ...settings, minTransactions: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">تفعيل التحليلات</p>
                    <p className="text-sm text-muted-foreground">جمع بيانات الاستخدام للتحسين</p>
                  </div>
                  <Switch
                    checked={settings.enableAnalytics}
                    onCheckedChange={(v) => setSettings({ ...settings, enableAnalytics: v })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">وضع الصيانة</p>
                    <p className="text-sm text-muted-foreground">إيقاف الموقع مؤقتاً للصيانة</p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(v) => setSettings({ ...settings, maintenanceMode: v })}
                  />
                </div>
              </div>

              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin me-2" />
                ) : (
                  <Save className="h-4 w-4 me-2" />
                )}
                حفظ الإعدادات
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                إعدادات الإشعارات
              </CardTitle>
              <CardDescription>
                إدارة إشعارات البريد الإلكتروني
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">إشعارات العملاء الجدد</p>
                  <p className="text-sm text-muted-foreground">استلام بريد عند تسجيل عميل جديد</p>
                </div>
                <Switch
                  checked={settings.enableNotifications}
                  onCheckedChange={(v) => setSettings({ ...settings, enableNotifications: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">تقرير يومي</p>
                  <p className="text-sm text-muted-foreground">استلام تقرير يومي بالإحصائيات</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">تنبيهات الأخطاء</p>
                  <p className="text-sm text-muted-foreground">إشعار فوري عند حدوث أخطاء</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>البريد الإلكتروني للإشعارات</Label>
                <Input
                  type="email"
                  placeholder="admin@example.com"
                  dir="ltr"
                />
              </div>

              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin me-2" />
                ) : (
                  <Save className="h-4 w-4 me-2" />
                )}
                حفظ الإعدادات
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      )}
    </div>
  )
}

