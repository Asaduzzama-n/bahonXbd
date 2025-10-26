"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Edit,
  Settings,
  ExternalLink
} from "lucide-react"
import { BikeWashLocation } from "@/lib/models"
import { format } from "date-fns"
import { toast } from "sonner"

export default function BikeWashLocationDetails() {
  const params = useParams()
  const router = useRouter()
  const [location, setLocation] = useState<BikeWashLocation | null>(null)
  const [loading, setLoading] = useState(true)

  const locationId = params.id as string

  useEffect(() => {
    if (locationId) {
      fetchLocation()
    }
  }, [locationId])

  const fetchLocation = async () => {
    try {
      const response = await fetch(`/api/admin/bike-wash-locations/${locationId}`)
      if (response.ok) {
        const data = await response.json()
        setLocation(data.data)
      } else {
        toast.error('Failed to fetch bike wash location details')
        router.push('/admin/bike-wash')
      }
    } catch (error) {
      console.error('Failed to fetch bike wash location:', error)
      toast.error('Failed to fetch bike wash location details')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusToggle = async (newStatus: boolean) => {
    if (!location) return

    try {
      const response = await fetch(`/api/admin/bike-wash-locations/${locationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus ? 'active' : 'inactive'
        }),
      })

      if (response.ok) {
        setLocation(prev => prev ? { ...prev, status: newStatus ? 'active' : 'inactive' } : null)
        toast.success(`Location ${newStatus ? 'activated' : 'deactivated'} successfully`)
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to update location status')
      }
    } catch (error) {
      console.error('Failed to update location status:', error)
      toast.error('Failed to update location status')
    }
  }

  const handleEdit = () => {
    router.push(`/admin/bike-wash/${locationId}/edit`)
  }

  const handleBack = () => {
    router.push('/admin/bike-wash')
  }

  const openMapLocation = () => {
    if (location?.map) {
      // Check if it's a URL or just an address
      if (location.map.startsWith('http')) {
        window.open(location.map, '_blank')
      } else {
        // Create a Google Maps search URL
        const searchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.map)}`
        window.open(searchUrl, '_blank')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!location) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Bike wash location not found</p>
      </div>
    )
  }

  return (
    <div className=" mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{location.location}</h1>
            <p className="text-muted-foreground">Bike wash location details</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Location Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location Name</p>
                  <p className="text-lg font-semibold">{location.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Price</p>
                  <p className="text-lg font-semibold flex items-center">
                    <span className="mr-1">৳</span>
                    {location.price}
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">Map/Address</p>
                  <Button variant="outline" size="sm" onClick={openMapLocation}>
                    <ExternalLink className="mr-1 h-3 w-3" />
                    Open Map
                  </Button>
                </div>
                <p className="text-sm bg-muted p-3 rounded-md">{location.map}</p>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Features & Services
              </CardTitle>
              <CardDescription>
                Available services at this location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {location.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {feature}
                  </Badge>
                ))}
              </div>
              {location.features.length === 0 && (
                <p className="text-muted-foreground text-sm">No features listed</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Location Status</p>
                  <p className="text-sm text-muted-foreground">
                    Toggle to activate or deactivate
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={location.status === 'active'}
                    onCheckedChange={handleStatusToggle}
                  />
                  <Badge variant={location.status === 'active' ? 'default' : 'secondary'}>
                    {location.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Location ID</p>
                <p className="text-sm font-mono bg-muted p-2 rounded">{location._id}</p>
              </div>
              
              {location.createdAt && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created</p>
                  <p className="text-sm">{format(new Date(location.createdAt), 'PPP')}</p>
                </div>
              )}
              
              {location.updatedAt && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                  <p className="text-sm">{format(new Date(location.updatedAt), 'PPP')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}