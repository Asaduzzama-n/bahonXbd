"use client"

import { useEffect, useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { AdminDataTable, createSortableHeader } from "@/components/admin-data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Download, Upload, Filter } from "lucide-react"
import { Expense } from "@/lib/models"
import { format } from "date-fns"

export default function ExpensesManagement() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    try {
      const response = await fetch('/api/admin/expenses')
      if (response.ok) {
        const data = await response.json()
        setExpenses(data.data?.expenses || [])
      }
    } catch (error) {
      console.error('Failed to fetch expenses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleView = (expense: Expense) => {
    // Navigate to expense details
    window.location.href = `/admin/expenses/${expense._id}`
  }

  const handleEdit = (expense: Expense) => {
    // Navigate to edit page
    window.location.href = `/admin/expenses/${expense._id}/edit`
  }

  const handleDelete = async (expense: Expense) => {
    if (confirm('Are you sure you want to delete this expense? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/admin/expenses/${expense._id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          setExpenses(expenses.filter(e => e._id !== expense._id))
        }
      } catch (error) {
        console.error('Failed to delete expense:', error)
      }
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'maintenance': return 'bg-blue-100 text-blue-800'
      case 'repair': return 'bg-red-100 text-red-800'
      case 'upgrade': return 'bg-green-100 text-green-800'
      case 'insurance': return 'bg-purple-100 text-purple-800'
      case 'registration': return 'bg-orange-100 text-orange-800'
      case 'fuel': return 'bg-yellow-100 text-yellow-800'
      case 'accessories': return 'bg-indigo-100 text-indigo-800'
      case 'other': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const columns: ColumnDef<Expense>[] = [
    {
      accessorKey: "title",
      header: createSortableHeader("Title"),
      cell: ({ row }) => (
        <div className="max-w-[200px]">
          <div className="font-medium truncate">{row.getValue("title")}</div>
          <div className="text-sm text-muted-foreground truncate">
            {row.original.description}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type") as string
        return (
          <Badge className={getTypeColor(type)}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Badge>
        )
      },
    },
    {
      accessorKey: "amount",
      header: createSortableHeader("Amount"),
      cell: ({ row }) => (
        <div className="font-medium">
          ৳{(row.getValue("amount") as number).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "bikeId",
      header: "Bike",
      cell: ({ row }) => {
        const bike = row.original.bikeId as any
        return (
          <div className="max-w-[150px]">
            <div className="font-medium truncate">
              {bike?.title || 'Unknown Bike'}
            </div>
            <div className="text-sm text-muted-foreground">
              {bike?.brand} {bike?.model}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "partnerId",
      header: "Partner",
      cell: ({ row }) => {
        const partner = row.original.partnerId as any
        return partner ? (
          <div className="text-sm">
            {partner.name}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">No partner</div>
        )
      },
    },
    {
      accessorKey: "adjustBikePrice",
      header: "Price Adj.",
      cell: ({ row }) => (
        <Badge variant={row.getValue("adjustBikePrice") ? "default" : "outline"}>
          {row.getValue("adjustBikePrice") ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      accessorKey: "adjustPartnerShares",
      header: "Share Adj.",
      cell: ({ row }) => (
        <Badge variant={row.getValue("adjustPartnerShares") ? "default" : "outline"}>
          {row.getValue("adjustPartnerShares") ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      accessorKey: "date",
      header: createSortableHeader("Date"),
      cell: ({ row }) => (
        <div className="text-sm">
          {format(new Date(row.getValue("date")), "MMM dd, yyyy")}
        </div>
      ),
    },
  ]

  const stats = {
    total: Array.isArray(expenses) ? expenses.length : 0,
    totalAmount: Array.isArray(expenses) ? expenses.reduce((sum, expense) => sum + expense.amount, 0) : 0,
    maintenance: Array.isArray(expenses) ? expenses.filter(e => e.type === 'maintenance').length : 0,
    repairs: Array.isArray(expenses) ? expenses.filter(e => e.type === 'repair').length : 0,
    withPriceAdjustment: Array.isArray(expenses) ? expenses.filter(e => e.adjustBikePrice).length : 0,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expenses Management</h1>
          <p className="text-muted-foreground">
            Track and manage all bike-related expenses, maintenance, and service history.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button onClick={() => window.location.href = '/admin/expenses/add'}>
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              All recorded expenses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ৳{stats.totalAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total spent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.maintenance}</div>
            <p className="text-xs text-muted-foreground">
              Maintenance records
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Repairs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.repairs}</div>
            <p className="text-xs text-muted-foreground">
              Repair records
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Price Adjustments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.withPriceAdjustment}</div>
            <p className="text-xs text-muted-foreground">
              Affecting bike price
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Expenses</CardTitle>
          <CardDescription>
            Comprehensive list of all expenses with management options and adjustment tracking.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminDataTable
            columns={columns}
            data={expenses}
            searchKey="title"
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  )
}