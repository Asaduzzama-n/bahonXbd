"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, Trash2, Eye, Star, Calendar, Mail, Phone } from "lucide-react"
import { Bike } from "@/lib/models"
import { format } from "date-fns"
import { toast } from "sonner"

export default function BikeDetailsPage() {
  const [bike, setBike] = useState<Bike | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const bikeId = params.id as string

  useEffect(() => {
    fetchBike()
  }, [bikeId])

  const fetchBike = async () => {
    try {
      const response = await fetch(`/api/bikes/${bikeId}`)
      if (response.ok) {
        const data = await response.json()
        setBike(data.data || null)
      } else {
        toast.error('Failed to load bike details')
        router.push('/admin/bikes')
      }
    } catch (error) {
      console.error('Error fetching bike:', error)
      toast.error('An error occurred while loading the bike')
      router.push('/admin/bikes')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    router.push(`/admin/bikes/${bikeId}/edit`)
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this bike listing?')) {
      try {
        const response = await fetch(`/api/bikes/${bikeId}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          toast.success('Bike deleted successfully!')
          router.push('/admin/bikes')
        } else {
          toast.error('Failed to delete bike')
        }
      } catch (error) {
        console.error('Error deleting bike:', error)
        toast.error('An error occurred while deleting the bike')
      }
    }
  }

  const handleBack = () => {
    router.push('/admin/bikes')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!bike) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Bike not found</p>
      </div>
    )
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'bg-green-100 text-green-800'
      case 'good': return 'bg-blue-100 text-blue-800'
      case 'fair': return 'bg-yellow-100 text-yellow-800'
      case 'poor': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'sold': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const totalPartnerPercentage = bike.partners?.reduce((sum, partner) => sum + partner.percentage, 0) || 0
  const myPercentage = Math.max(0, 100 - totalPartnerPercentage)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bikes
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{bike.title}</h1>
            <p className="text-muted-foreground">
              {bike.brand} {bike.model} • {bike.year}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex items-center space-x-2">
        <Badge className={getStatusColor(bike.status)}>
          {bike.status.charAt(0).toUpperCase() + bike.status.slice(1)}
        </Badge>
        <Badge className={getConditionColor(bike.condition)}>
          {bike.condition.charAt(0).toUpperCase() + bike.condition.slice(1)}
        </Badge>
        {bike.isFeatured && (
          <Badge className="bg-purple-100 text-purple-800">
            <Star className="mr-1 h-3 w-3" />
            Featured
          </Badge>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Images and Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent>
              {bike.images && bike.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {bike.images.map((image, index) => (
                    <div key={index} className="aspect-square">
                      <img
                        src={image}
                        alt={`${bike.title} - Image ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => window.open(image, '_blank')}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-image.jpg'
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No images available</p>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{bike.description}</p>
            </CardContent>
          </Card>

          {/* Detailed Information */}
          <Tabs defaultValue="specifications" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="service">Service History</TabsTrigger>
            </TabsList>

            <TabsContent value="specifications">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bike.specifications && Object.entries(bike.specifications).map(([key, value]) => (
                      value && (
                        <div key={key} className="flex justify-between py-2 border-b">
                          <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                          <span className="text-muted-foreground">{value}</span>
                        </div>
                      )
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features">
              <Card>
                <CardHeader>
                  <CardTitle>Features</CardTitle>
                </CardHeader>
                <CardContent>
                  {bike.features && bike.features.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {bike.features.map((feature, index) => (
                        <Badge key={index} variant="secondary">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No features listed</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Available Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  {bike.availableDocs && bike.availableDocs.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {bike.availableDocs.map((doc, index) => (
                        <Badge key={index} variant="outline">
                          {doc}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No documents listed</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="service">
              <Card>
                <CardHeader>
                  <CardTitle>Service History</CardTitle>
                </CardHeader>
                <CardContent>
                  {bike.serviceHistory && bike.serviceHistory.length > 0 ? (
                    <div className="space-y-4">
                      {bike.serviceHistory.map((record, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{record.description}</p>
                              <p className="text-sm text-muted-foreground flex items-center">
                                <Calendar className="mr-1 h-3 w-3" />
                                {format(new Date(record.date), "MMM dd, yyyy")}
                              </p>
                            </div>
                            <Badge variant="outline">৳{record.cost.toLocaleString()}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No service history available</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Pricing and Partners */}
        <div className="space-y-6">
          {/* Pricing Information */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">৳{bike.price.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Asking Price</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">My Share ({myPercentage}%):</span>
                  <span className="font-medium">৳{bike.myShare.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Partner Share ({totalPartnerPercentage}%):</span>
                  <span className="font-medium">৳{(bike.price - bike.myShare).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Details */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Mileage:</span>
                <span className="font-medium">{bike.mileage.toLocaleString()} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Views:</span>
                <span className="font-medium flex items-center">
                  <Eye className="mr-1 h-3 w-3" />
                  {bike.views}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Listed:</span>
                <span className="font-medium">{format(new Date(bike.createdAt), "MMM dd, yyyy")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Updated:</span>
                <span className="font-medium">{format(new Date(bike.updatedAt), "MMM dd, yyyy")}</span>
              </div>
            </CardContent>
          </Card>

          {/* Partners */}
          <Card>
            <CardHeader>
              <CardTitle>Partners</CardTitle>
            </CardHeader>
            <CardContent>
              {bike.partners && bike.partners.length > 0 ? (
                <div className="space-y-3">
                  {bike.partners.map((partner, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{typeof partner.partnerId === 'string' ? partner.partnerId : partner.partnerId.name}</p>
                          <p className="text-sm text-muted-foreground flex items-center">
                            <Mail className="mr-1 h-3 w-3" />
                            {typeof partner.partnerId === 'string' ? partner.partnerId : partner.partnerId.email}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center">
                            <Phone className="mr-1 h-3 w-3" />
                            {typeof partner.partnerId === 'string' ? partner.partnerId : partner.partnerId.phone}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary">{partner.percentage}%</Badge>
                          <p className="text-sm font-medium">৳{((bike.price * partner.percentage) / 100).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No partners assigned</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}