"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Search, 
  MoreHorizontal,
  Mail,
  Phone,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  MessageCircle,
  RefreshCw,
  Send,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"

type WhatsappStatus = "pending" | "sending" | "sent" | "failed"

interface Lead {
  id: string
  name: string
  email: string | null
  phone: string | null
  phoneNormalized: string | null
  company: string | null
  sector: string | null
  status: "new" | "contacted" | "qualified" | "won" | "lost"
  whatsappStatus: WhatsappStatus | null
  whatsappSentAt: string | null
  lastError: string | null
  wizardRunId: string | null
  monthlyGmv: number
  createdAt: string
}

const mockLeads: Lead[] = [
  {
    id: "1",
    name: "أحمد محمد الشمري",
    email: "ahmed@example.com",
    phone: "0501234567",
    phoneNormalized: "966501234567",
    company: "شركة التقنية المتقدمة",
    sector: "التجارة الإلكترونية",
    status: "new",
    whatsappStatus: "sent",
    whatsappSentAt: "2024-01-15T11:00:00Z",
    lastError: null,
    wizardRunId: "wr_1",
    monthlyGmv: 150000,
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "2",
    name: "سارة العلي",
    email: "sara@example.com",
    phone: "0559876543",
    phoneNormalized: "966559876543",
    company: "مطعم الذواقة",
    sector: "المطاعم",
    status: "contacted",
    whatsappStatus: "failed",
    whatsappSentAt: null,
    lastError: "Connection timeout",
    wizardRunId: "wr_2",
    monthlyGmv: 75000,
    createdAt: "2024-01-14T14:20:00Z"
  },
  {
    id: "3",
    name: "خالد السعيد",
    email: "khaled@example.com",
    phone: "0541112222",
    phoneNormalized: "966541112222",
    company: "عيادات الصحة",
    sector: "الخدمات الطبية",
    status: "qualified",
    whatsappStatus: "pending",
    whatsappSentAt: null,
    lastError: null,
    wizardRunId: "wr_3",
    monthlyGmv: 200000,
    createdAt: "2024-01-13T09:15:00Z"
  },
  {
    id: "4",
    name: "نورة القحطاني",
    email: "noura@example.com",
    phone: "0533334444",
    phoneNormalized: "966533334444",
    company: "متجر الأناقة",
    sector: "تجارة التجزئة",
    status: "won",
    whatsappStatus: "sent",
    whatsappSentAt: "2024-01-12T17:00:00Z",
    lastError: null,
    wizardRunId: "wr_4",
    monthlyGmv: 50000,
    createdAt: "2024-01-12T16:45:00Z"
  },
  {
    id: "5",
    name: "فهد العتيبي",
    email: "fahad@example.com",
    phone: "0525556666",
    phoneNormalized: "966525556666",
    company: "شركة البرمجيات",
    sector: "البرمجيات",
    status: "lost",
    whatsappStatus: null,
    whatsappSentAt: null,
    lastError: null,
    wizardRunId: null,
    monthlyGmv: 300000,
    createdAt: "2024-01-10T11:00:00Z"
  },
]

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [whatsappFilter, setWhatsappFilter] = useState<string>("all")
  const [leads, setLeads] = useState(mockLeads)
  const [sendingWhatsapp, setSendingWhatsapp] = useState<string | null>(null)

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.email?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (lead.company?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter
    const matchesWhatsapp = whatsappFilter === "all" || lead.whatsappStatus === whatsappFilter
    
    return matchesSearch && matchesStatus && matchesWhatsapp
  })

  const updateLeadStatus = (id: string, status: Lead["status"]) => {
    setLeads(leads.map(lead => 
      lead.id === id ? { ...lead, status } : lead
    ))
  }

  const statusConfig: Record<Lead["status"], { label: string; color: string; icon: typeof CheckCircle }> = {
    new: { label: "جديد", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400", icon: Clock },
    contacted: { label: "تم التواصل", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", icon: Phone },
    qualified: { label: "مؤهل", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400", icon: CheckCircle },
    won: { label: "تم الفوز", color: "bg-emerald-200 text-emerald-900 dark:bg-emerald-800/30 dark:text-emerald-300", icon: CheckCircle },
    lost: { label: "خسارة", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", icon: XCircle },
  }

  const whatsappStatusConfig: Record<WhatsappStatus, { label: string; color: string; icon: typeof CheckCircle }> = {
    pending: { label: "في الانتظار", color: "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400", icon: Clock },
    sending: { label: "جاري الإرسال", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", icon: Loader2 },
    sent: { label: "تم الإرسال", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle },
    failed: { label: "فشل", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", icon: XCircle },
  }

  const resendWhatsApp = async (lead: Lead) => {
    if (!lead.wizardRunId || !lead.phoneNormalized) {
      toast.error("لا يمكن إعادة الإرسال - بيانات غير مكتملة")
      return
    }

    setSendingWhatsapp(lead.id)
    try {
      const response = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wizardRunId: lead.wizardRunId,
          phoneNumber: lead.phoneNormalized,
          customerName: lead.name,
        }),
      })

      if (response.ok) {
        setLeads(leads.map(l => 
          l.id === lead.id 
            ? { ...l, whatsappStatus: "sent" as WhatsappStatus, whatsappSentAt: new Date().toISOString(), lastError: null }
            : l
        ))
        toast.success("تم إرسال الرسالة بنجاح")
      } else {
        const data = await response.json()
        setLeads(leads.map(l => 
          l.id === lead.id 
            ? { ...l, whatsappStatus: "failed" as WhatsappStatus, lastError: data.error }
            : l
        ))
        toast.error(`فشل الإرسال: ${data.error}`)
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الإرسال")
    } finally {
      setSendingWhatsapp(null)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">العملاء المحتملين</h1>
          <p className="text-muted-foreground">إدارة ومتابعة العملاء المحتملين</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 me-2" />
          تصدير CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-5">
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = leads.filter(l => l.status === status).length
          return (
            <Card key={status} className="cursor-pointer hover:bg-muted/50" onClick={() => setStatusFilter(status)}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{config.label}</span>
                  <config.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold mt-1">{count}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* WhatsApp Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {Object.entries(whatsappStatusConfig).map(([status, config]) => {
          const count = leads.filter(l => l.whatsappStatus === status).length
          return (
            <Card key={status} className="cursor-pointer hover:bg-muted/50" onClick={() => setWhatsappFilter(status)}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    {config.label}
                  </span>
                  <config.icon className={`h-4 w-4 ${status === 'sending' ? 'animate-spin' : ''}`} />
                </div>
                <p className="text-2xl font-bold mt-1">{count}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="البحث بالاسم أو البريد أو الشركة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                {Object.entries(statusConfig).map(([value, { label }]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={whatsappFilter} onValueChange={setWhatsappFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="حالة الواتساب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع حالات الواتساب</SelectItem>
                {Object.entries(whatsappStatusConfig).map(([value, { label }]) => (
                  <SelectItem key={value} value={value}>
                    <span className="flex items-center gap-2">
                      <MessageCircle className="h-3 w-3" />
                      {label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>العميل</TableHead>
                <TableHead>الشركة</TableHead>
                <TableHead>القطاع</TableHead>
                <TableHead>حجم المبيعات</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الواتساب</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead className="text-end">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{lead.name}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        {lead.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {lead.email}
                          </span>
                        )}
                        {lead.phone && (
                          <span className="flex items-center gap-1 dir-ltr" dir="ltr">
                            <Phone className="h-3 w-3" />
                            {lead.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{lead.company || "-"}</TableCell>
                  <TableCell>
                    {lead.sector ? (
                      <Badge variant="outline">{lead.sector}</Badge>
                    ) : "-"}
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {formatCurrency(lead.monthlyGmv)}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusConfig[lead.status].color}>
                      {statusConfig[lead.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {lead.whatsappStatus ? (
                      (() => {
                        const WhatsAppIcon = whatsappStatusConfig[lead.whatsappStatus].icon
                        return (
                          <div className="flex flex-col gap-1">
                            <Badge className={whatsappStatusConfig[lead.whatsappStatus].color}>
                              <WhatsAppIcon 
                                className={`h-3 w-3 me-1 ${lead.whatsappStatus === 'sending' ? 'animate-spin' : ''}`} 
                              />
                              {whatsappStatusConfig[lead.whatsappStatus].label}
                            </Badge>
                            {lead.whatsappSentAt && (
                              <span className="text-xs text-muted-foreground">
                                {formatDate(lead.whatsappSentAt)}
                              </span>
                            )}
                            {lead.lastError && (
                              <span className="text-xs text-red-500" title={lead.lastError}>
                                {lead.lastError.substring(0, 20)}...
                              </span>
                            )}
                          </div>
                        )
                      })()
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(lead.createdAt)}
                  </TableCell>
                  <TableCell className="text-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 me-2" />
                          عرض التفاصيل
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="h-4 w-4 me-2" />
                          إرسال بريد
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Phone className="h-4 w-4 me-2" />
                          اتصال
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>واتساب</DropdownMenuLabel>
                        <DropdownMenuItem 
                          onClick={() => resendWhatsApp(lead)}
                          disabled={sendingWhatsapp === lead.id || !lead.wizardRunId}
                        >
                          {sendingWhatsapp === lead.id ? (
                            <Loader2 className="h-4 w-4 me-2 animate-spin" />
                          ) : lead.whatsappStatus === "sent" ? (
                            <RefreshCw className="h-4 w-4 me-2" />
                          ) : (
                            <Send className="h-4 w-4 me-2" />
                          )}
                          {lead.whatsappStatus === "sent" ? "إعادة الإرسال" : "إرسال الآن"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>تغيير الحالة</DropdownMenuLabel>
                        {Object.entries(statusConfig).map(([status, { label }]) => (
                          <DropdownMenuItem 
                            key={status}
                            onClick={() => updateLeadStatus(lead.id, status as Lead["status"])}
                          >
                            {label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

