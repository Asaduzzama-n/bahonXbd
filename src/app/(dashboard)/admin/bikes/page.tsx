"use client"

import { useEffect, useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { AdminDataTable, createSortableHeader, createStatusBadge } from "@/components/admin-data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Download, Upload, Filter } from "lucide-react"
import { Bike } from "@/lib/models"
import { format } from "date-fns"

export default function BikesManagement() {
  const [bikes, setBikes] = useState<Bike[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBikes()
  }, [])

  const fetchBikes = async () => {
    try {
      const response = await fetch('/api/admin/bikes')
      if (response.ok) {
        const data = await response.json()
        setBikes(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch bikes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleView = (bike: Bike) => {
    // Navigate to bike details
    window.location.href = `/admin/bikes/${bike._id}`
  }

  const handleEdit = (bike: Bike) => {
    // Navigate to edit page
    window.location.href = `/admin/bikes/${bike._id}/edit`
  }

  const handleDelete = async (bike: Bike) => {
    if (confirm('Are you sure you want to delete this bike listing?')) {
      try {
        const response = await fetch(`/api/admin/bikes/${bike._id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          setBikes(bikes.filter(b => b._id !== bike._id))
        }
      } catch (error) {
        console.error('Failed to delete bike:', error)
      }
    }
  }

  const columns: ColumnDef<Bike>[] = [
    {
      accessorKey: "title",
      header: createSortableHeader("Title"),
      cell: ({ row }) => (
        <div className="max-w-[200px]">
          <div className="font-medium truncate">{row.getValue("title")}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.brand} {row.original.model}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "year",
      header: createSortableHeader("Year"),
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("year")}</div>
      ),
    },
    {
      accessorKey: "price",
      header: createSortableHeader("Price"),
      cell: ({ row }) => (
        <div className="font-medium">
          ৳{(row.getValue("price") as number).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "condition",
      header: "Condition",
      cell: ({ row }) => {
        const condition = row.getValue("condition") as string
        return (
          <Badge variant={
            condition === "excellent" ? "default" :
            condition === "good" ? "secondary" : "outline"
          }>
            {condition.charAt(0).toUpperCase() + condition.slice(1)}
          </Badge>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => createStatusBadge(row.getValue("status")),
    },
    {
      accessorKey: "mileage",
      header: createSortableHeader("Mileage"),
      cell: ({ row }) => (
        <div className="text-center">{(row.getValue("mileage") as number).toLocaleString()} km</div>
      ),
    },
    {
      accessorKey: "isFeatured",
      header: "Featured",
      cell: ({ row }) => (
        <Badge variant={row.getValue("isFeatured") ? "default" : "outline"}>
          {row.getValue("isFeatured") ? "Yes" : "No"}
        </Badge>
      ),
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
  ]

  const stats = {
    total: bikes.length,
    active: bikes.filter(b => b.status === 'active').length,
    sold: bikes.filter(b => b.status === 'sold').length,
    pending: bikes.filter(b => b.status === 'pending').length,
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
          <h1 className="text-3xl font-bold tracking-tight">Bikes Management</h1>
          <p className="text-muted-foreground">
            Manage all bike listings, verify submissions, and track inventory.
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
          <Button onClick={() => window.location.href = '/admin/bikes/add'}>
            <Plus className="mr-2 h-4 w-4" />
            Add Bike
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bikes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              All bike listings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              Ready for sale
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.sold}</div>
            <p className="text-xs text-muted-foreground">
              Successfully sold
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting verification
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Bikes</CardTitle>
          <CardDescription>
            Comprehensive list of all bike listings with management options.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminDataTable
            columns={columns}
            data={bikes}
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