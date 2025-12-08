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
import { 
  Save, 
  Loader2,
  Settings,
  Scale,
  Bell,
  RefreshCw
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

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
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

  const totalWeight = costWeight + fitWeight + opsWeight + riskWeight
  const isWeightValid = totalWeight === 100

  // Fetch settings from API
  const fetchSettings = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/settings")
      if (!response.ok) {
        throw new Error("Failed to fetch settings")
      }
      const data = await response.json()
      
      // Set weights from API
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
      
      // Set general settings from API
      if (data.settings) {
        setSettings(data.settings)
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast.error("فشل في جلب الإعدادات")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">الإعدادات</h1>
          <p className="text-muted-foreground">إدارة إعدادات المنصة وأوزان التقييم</p>
        </div>
        <Button variant="outline" onClick={fetchSettings} disabled={isLoading}>
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
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ) : (
      <Tabs defaultValue="scoring" className="space-y-6">
        <TabsList>
          <TabsTrigger value="scoring" className="gap-2">
            <Scale className="h-4 w-4" />
            أوزان التقييم
          </TabsTrigger>
          <TabsTrigger value="general" className="gap-2">
            <Settings className="h-4 w-4" />
            الإعدادات العامة
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            الإشعارات
          </TabsTrigger>
        </TabsList>

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
                  <p className={`text-sm ${isWeightValid ? 'text-green-600' : 'text-red-600'}`}>
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

