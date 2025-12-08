"use client"

import { useState } from "react"
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
  Download
} from "lucide-react"

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  company: string
  sector: string
  status: "new" | "contacted" | "qualified" | "won" | "lost"
  monthlyGmv: number
  createdAt: string
}

const mockLeads: Lead[] = [
  {
    id: "1",
    name: "أحمد محمد الشمري",
    email: "ahmed@example.com",
    phone: "0501234567",
    company: "شركة التقنية المتقدمة",
    sector: "التجارة الإلكترونية",
    status: "new",
    monthlyGmv: 150000,
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "2",
    name: "سارة العلي",
    email: "sara@example.com",
    phone: "0559876543",
    company: "مطعم الذواقة",
    sector: "المطاعم",
    status: "contacted",
    monthlyGmv: 75000,
    createdAt: "2024-01-14T14:20:00Z"
  },
  {
    id: "3",
    name: "خالد السعيد",
    email: "khaled@example.com",
    phone: "0541112222",
    company: "عيادات الصحة",
    sector: "الخدمات الطبية",
    status: "qualified",
    monthlyGmv: 200000,
    createdAt: "2024-01-13T09:15:00Z"
  },
  {
    id: "4",
    name: "نورة القحطاني",
    email: "noura@example.com",
    phone: "0533334444",
    company: "متجر الأناقة",
    sector: "تجارة التجزئة",
    status: "won",
    monthlyGmv: 50000,
    createdAt: "2024-01-12T16:45:00Z"
  },
  {
    id: "5",
    name: "فهد العتيبي",
    email: "fahad@example.com",
    phone: "0525556666",
    company: "شركة البرمجيات",
    sector: "البرمجيات",
    status: "lost",
    monthlyGmv: 300000,
    createdAt: "2024-01-10T11:00:00Z"
  },
]

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [leads, setLeads] = useState(mockLeads)

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter
    
    return matchesSearch && matchesStatus
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
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {lead.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{lead.company}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{lead.sector}</Badge>
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {formatCurrency(lead.monthlyGmv)}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusConfig[lead.status].color}>
                      {statusConfig[lead.status].label}
                    </Badge>
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

