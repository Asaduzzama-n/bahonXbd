"use client"

import { useEffect, useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { AdminDataTable, createSortableHeader } from "@/components/admin-data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Download, Search, Filter, Eye, Edit, DollarSign, TrendingUp, ShoppingCart, Users } from "lucide-react"
import { PurchaseOrder } from "@/lib/models"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface PurchaseOrderWithProfit extends PurchaseOrder {
  calculatedProfit?: {
    netProfit: number
    profitMargin: number
    totalPartnerProfit: number
    amount: number
  }
}

export default function PurchaseOrdersManagement() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderWithProfit[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all")
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    totalRevenue: 0,
    totalProfit: 0,
    avgProfitMargin: 0
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 50
  })
  const router = useRouter()

  useEffect(() => {
    fetchPurchaseOrders()
    fetchStats()
  }, [searchTerm, statusFilter, paymentStatusFilter])

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      if (searchTerm) {
        params.append('search', searchTerm)
      }

      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }

      if (paymentStatusFilter !== 'all') {
        params.append('paymentStatus', paymentStatusFilter)
      }

      params.append('limit', '50')
      params.append('sortBy', 'createdAt')
      params.append('sortOrder', 'desc')

      const response = await fetch(`/api/admin/purchase-orders?${params}`)
      if (response.ok) {
        const data = await response.json()
        setPurchaseOrders(data.data.purchaseOrders || [])
        setPagination(data.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
          hasNextPage: false,
          hasPrevPage: false,
          limit: 50
        })
      } else {
        toast.error('Failed to fetch purchase orders')
      }
    } catch (error) {
      console.error('Failed to fetch purchase orders:', error)
      toast.error('Failed to fetch purchase orders')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/purchase-orders/stats')
      if (response.ok) {
        const data = await response.json()
        setStats({
          total: data.data.overview.totalPurchaseOrders,
          pending: data.data.overview.statusDistribution.pending || 0,
          confirmed: data.data.overview.statusDistribution.confirmed || 0,
          totalRevenue: data.data.financial.overall.totalRevenue,
          totalProfit: data.data.financial.overall.totalProfit,
          avgProfitMargin: data.data.financial.overall.profitMargin
        })
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const handleView = (purchaseOrder: PurchaseOrderWithProfit) => {
    router.push(`/admin/purchase-orders/${purchaseOrder._id}`)
  }

  const handleEdit = (purchaseOrder: PurchaseOrderWithProfit) => {
    router.push(`/admin/purchase-orders/${purchaseOrder._id}/edit`)
  }

  const handleDelete = async (purchaseOrder: PurchaseOrderWithProfit) => {
    if (confirm('Are you sure you want to delete this purchase order?')) {
      try {
        const response = await fetch(`/api/admin/purchase-orders/${purchaseOrder._id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          setPurchaseOrders(purchaseOrders.filter(po => po._id !== purchaseOrder._id))
          toast.success('Purchase order deleted successfully')
          fetchStats() // Refresh stats
        } else {
          const errorData = await response.json()
          toast.error(errorData.message || 'Failed to delete purchase order')
        }
      } catch (error) {
        console.error('Failed to delete purchase order:', error)
        toast.error('Failed to delete purchase order')
      }
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      processing: "secondary",
      confirmed: "default",
      cancelled: "destructive"
    }
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>
  }

  const getPaymentStatusBadge = (paymentStatus: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      partial: "secondary",
      paid: "default",
      refunded: "destructive"
    }
    return <Badge variant={variants[paymentStatus] || "outline"}>{paymentStatus}</Badge>
  }

  const columns: ColumnDef<PurchaseOrderWithProfit>[] = [
    {
      accessorKey: "_id",
      header: "Order ID",
      cell: ({ row }) => (
        <div className="font-mono text-sm">
          #{row.getValue("_id")?.toString().slice(-8)}
        </div>
      ),
    },
    {
      accessorKey: "bikeId",
      header: "Bike",
      cell: ({ row }) => {
        const bike = row.original.bikeId as any
        return (
          <div className="max-w-[200px]">
            <div className="font-medium truncate">
              {bike?.make} {bike?.model}
            </div>
            <div className="text-sm text-muted-foreground">
              {bike?.year} - ${bike?.price}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "partnersProfit",
      header: "Partners",
      cell: ({ row }) => {
        const partnersProfit = row.original.partnersProfit || []
        if (partnersProfit.length === 0) return <div className="text-muted-foreground">No partners</div>
        
        return (
          <div className="max-w-[150px]">
            {partnersProfit.slice(0, 2).map((partnerProfit: any, index: number) => (
              <div key={index} className="mb-1">
                <div className="font-medium truncate">{partnerProfit.partnerId?.name}</div>
                <div className="text-sm text-muted-foreground truncate">
                  ${partnerProfit.profit?.toFixed(2)}
                </div>
              </div>
            ))}
            {partnersProfit.length > 2 && (
              <div className="text-xs text-muted-foreground">
                +{partnersProfit.length - 2} more
              </div>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "buyerName",
      header: "Buyer",
      cell: ({ row }) => {
        const purchaseOrder = row.original
        return (
          <div className="max-w-[150px]">
            <div className="font-medium truncate">{purchaseOrder.buyerName}</div>
            <div className="text-sm text-muted-foreground truncate">
              {purchaseOrder.buyerPhone}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "amount",
      header: createSortableHeader("Amount"),
      cell: ({ row }) => (
        <div className="font-medium">
          ${row.getValue("amount")?.toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "calculatedProfit",
      header: "Profit",
      cell: ({ row }) => {
        const profit = row.original.calculatedProfit
        if (!profit) return <div className="text-muted-foreground">-</div>
        
        return (
          <div className="text-sm">
            <div className={`font-medium ${profit.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${profit.netProfit.toFixed(2)}
            </div>
            <div className="text-muted-foreground">
              {profit.profitMargin.toFixed(1)}%
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      accessorKey: "paymentStatus",
      header: "Payment",
      cell: ({ row }) => getPaymentStatusBadge(row.getValue("paymentStatus")),
    },
    {
      accessorKey: "createdAt",
      header: createSortableHeader("Created"),
      cell: ({ row }) => (
        <div className="text-sm">
          {format(new Date(row.getValue("createdAt")), "MMM dd, yyyy")}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const purchaseOrder = row.original
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleView(purchaseOrder)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(purchaseOrder)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Purchase Orders</h1>
          <p className="text-muted-foreground">
            Manage purchase orders created after bike sales
          </p>
        </div>
        <Button onClick={() => router.push('/admin/purchase-orders/create')}>
          <Plus className="mr-2 h-4 w-4" />
          Create Purchase Order
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pending} pending, {stats.confirmed} confirmed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From all purchase orders
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${stats.totalProfit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.avgProfitMargin.toFixed(1)}% avg margin
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Profit Margin</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgProfitMargin.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Across all orders
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filters
          </CardTitle>
          <CardDescription>
            Filter and search purchase orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by buyer name, phone, or order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders</CardTitle>
          <CardDescription>
            A list of all purchase orders with profit calculations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminDataTable
            columns={columns}
            data={purchaseOrders}
            // loading={loading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  )
}