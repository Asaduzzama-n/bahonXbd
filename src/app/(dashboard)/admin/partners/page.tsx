"use client"

import { useEffect, useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { AdminDataTable, createSortableHeader } from "@/components/admin-data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Download, Search, Filter, Eye, BarChart3 } from "lucide-react"
import { Partner } from "@/lib/models"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function PartnersManagement() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
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
    fetchPartners()
  }, [searchTerm, statusFilter])

  const fetchPartners = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      if (searchTerm) {
        params.append('search', searchTerm)
      }

      if (statusFilter !== 'all') {
        params.append('isActive', statusFilter)
      }

      const response = await fetch(`/api/admin/partners?${params}`)
      if (response.ok) {
        const data = await response.json()
        setPartners(data.data.partners || [])
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalCount: data.data.total || 0,
          hasNextPage: false,
          hasPrevPage: false,
          limit: data.data.total || 0
        })
      } else {
        toast.error('Failed to fetch partners')
      }
    } catch (error) {
      console.error('Failed to fetch partners:', error)
      toast.error('Failed to fetch partners')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (partner: Partner) => {
    try {
      const response = await fetch(`/api/admin/partners/${partner._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isActive: !partner.isActive
        })
      })

      if (response.ok) {
        const data = await response.json()
        setPartners(partners.map(p => 
          p._id === partner._id ? { ...p, isActive: data.data.isActive } : p
        ))
        toast.success(`Partner ${data.data.isActive ? 'activated' : 'deactivated'} successfully`)
      } else {
        toast.error('Failed to update partner status')
      }
    } catch (error) {
      console.error('Failed to toggle partner status:', error)
      toast.error('Failed to update partner status')
    }
  }

  const handleView = (partner: Partner) => {
    router.push(`/admin/partners/${partner._id}`)
  }

  const handleViewAnalytics = (partner: Partner) => {
    router.push(`/admin/partners/${partner._id}/analytics`)
  }

  const handleEdit = (partner: Partner) => {
    // For now, we'll use the view page for editing
    router.push(`/admin/partners/${partner._id}`)
  }

  const handleDelete = async (partner: Partner) => {
    if (confirm('Are you sure you want to deactivate this partner?')) {
      try {
        const response = await fetch(`/api/admin/partners/${partner._id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          setPartners(partners.map(p => 
            p._id === partner._id ? { ...p, isActive: false } : p
          ))
          toast.success('Partner deactivated successfully')
        } else {
          toast.error('Failed to deactivate partner')
        }
      } catch (error) {
        console.error('Failed to deactivate partner:', error)
        toast.error('Failed to deactivate partner')
      }
    }
  }

  const columns: ColumnDef<Partner>[] = [
    {
      accessorKey: "name",
      header: createSortableHeader("Name"),
      cell: ({ row }) => (
        <div className="max-w-[200px]">
          <div className="font-medium truncate">{row.getValue("name")}</div>
          <div className="text-sm text-muted-foreground truncate">
            {row.original.email}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.getValue("phone")}</div>
      ),
    },
    {
      accessorKey: "address",
      header: "Location",
      cell: ({ row }) => {
        const address = row.getValue("address") as any
        return (
          <div className="text-sm">
            {address?.city}, {address?.state}
          </div>
        )
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const partner = row.original
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={partner.isActive}
              onCheckedChange={() => handleToggleActive(partner)}
              // size="sm"
            />
            <Badge variant={partner.isActive ? "default" : "secondary"}>
              {partner.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: createSortableHeader("Joined"),
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
        const partner = row.original
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleView(partner)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewAnalytics(partner)}
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  const stats = {
    total: pagination.totalCount,
    active: Array.isArray(partners) ? partners.filter(p => p.isActive).length : 0,
    inactive: Array.isArray(partners) ? partners.filter(p => !p.isActive).length : 0,
  }

  if (loading && partners.length === 0) {
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
          <h1 className="text-3xl font-bold tracking-tight">Partners Management</h1>
          <p className="text-muted-foreground">
            Manage partner relationships, track earnings, and monitor performance.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => router.push('/admin/partners/add')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Partner
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, phone, email, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Partners</SelectItem>
                  <SelectItem value="true">Active Only</SelectItem>
                  <SelectItem value="false">Inactive Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Partners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              All registered partners
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Partners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Partners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.inactive}</div>
            <p className="text-xs text-muted-foreground">
              Currently inactive
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Partners</CardTitle>
          <CardDescription>
            Comprehensive list of all partners with management options.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminDataTable
            columns={columns}
            data={partners}
            searchKey="name"
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            
          />
        </CardContent>
      </Card>
    </div>
  )
}