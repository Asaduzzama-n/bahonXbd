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
import { Plus, Download, Search, Filter, Eye, Edit, MapPin } from "lucide-react"
import { BikeWashLocation } from "@/lib/models"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function BikeWashLocationsManagement() {
  const [bikeWashLocations, setBikeWashLocations] = useState<BikeWashLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const router = useRouter()

  useEffect(() => {
    fetchBikeWashLocations()
  }, [searchTerm, statusFilter])

  const fetchBikeWashLocations = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      if (searchTerm) {
        params.append('search', searchTerm)
      }

      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }

      const response = await fetch(`/api/admin/bike-wash-locations?${params}`)
      if (response.ok) {
        const data = await response.json()
        setBikeWashLocations(data.data.bikeWashLocations || [])
      } else {
        toast.error('Failed to fetch bike wash locations')
      }
    } catch (error) {
      console.error('Failed to fetch bike wash locations:', error)
      toast.error('Failed to fetch bike wash locations')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (location: BikeWashLocation) => {
    try {
      const response = await fetch(`/api/admin/bike-wash-locations/${location._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: location.status === 'active' ? 'inactive' : 'active'
        })
      })

      if (response.ok) {
        const data = await response.json()
        setBikeWashLocations(bikeWashLocations.map(l => 
          l._id === location._id ? { ...l, status: data.data.status } : l
        ))
        toast.success(`Location ${data.data.status === 'active' ? 'activated' : 'deactivated'} successfully`)
      } else {
        toast.error('Failed to update location status')
      }
    } catch (error) {
      console.error('Failed to toggle location status:', error)
      toast.error('Failed to update location status')
    }
  }

  const handleView = (location: BikeWashLocation) => {
    router.push(`/admin/bike-wash/${location._id}`)
  }

  const handleEdit = (location: BikeWashLocation) => {
    router.push(`/admin/bike-wash/${location._id}/edit`)
  }

  const handleDelete = async (location: BikeWashLocation) => {
    if (confirm('Are you sure you want to deactivate this bike wash location?')) {
      try {
        const response = await fetch(`/api/admin/bike-wash-locations/${location._id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          setBikeWashLocations(bikeWashLocations.map(l => 
            l._id === location._id ? { ...l, status: 'inactive' } : l
          ))
          toast.success('Location deactivated successfully')
        } else {
          toast.error('Failed to deactivate location')
        }
      } catch (error) {
        console.error('Failed to deactivate location:', error)
        toast.error('Failed to deactivate location')
      }
    }
  }

  const columns: ColumnDef<BikeWashLocation>[] = [
    {
      accessorKey: "location",
      header: createSortableHeader("Location"),
      cell: ({ row }) => (
        <div className="max-w-[250px]">
          <div className="font-medium truncate flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            {row.getValue("location")}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: createSortableHeader("Price"),
      cell: ({ row }) => (
      <div className="flex items-center">
        <span className="text-green-600 mr-1 ">৳</span>
        {row.getValue("price")}
      </div>
    ),
    },
    {
      accessorKey: "features",
      header: "Features",
      cell: ({ row }) => {
        const features = row.getValue("features") as string[]
        return (
          <div className="flex flex-wrap gap-1 max-w-[200px]">
            {features && features.length > 0 ? (
              features.slice(0, 2).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground text-sm">No features</span>
            )}
            {features && features.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{features.length - 2} more
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const location = row.original
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={location.status === 'active'}
              onCheckedChange={() => handleToggleStatus(location)}
            />
            <Badge variant={location.status === 'active' ? "default" : "secondary"}>
              {location.status === 'active' ? "Active" : "Inactive"}
            </Badge>
          </div>
        )
      },
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



  if (loading && bikeWashLocations.length === 0) {
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
          <h1 className="text-3xl font-bold tracking-tight">Bike Wash Locations</h1>
          <p className="text-muted-foreground">
            Manage bike wash locations, pricing, and service features.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => router.push('/admin/bike-wash/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Location
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      {/* <Card>
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
                  placeholder="Search by location or features..."
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
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Inactive Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* Stats Cards */}
      {/* <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              All registered locations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Locations</CardTitle>
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
            <CardTitle className="text-sm font-medium">Inactive Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.inactive}</div>
            <p className="text-xs text-muted-foreground">
              Currently inactive
            </p>
          </CardContent>
        </Card>
      </div> */}

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Bike Wash Locations</CardTitle>
          <CardDescription>
            Comprehensive list of all bike wash locations with management options.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminDataTable
            columns={columns}
            data={bikeWashLocations}
            searchKey="location"
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  )
}