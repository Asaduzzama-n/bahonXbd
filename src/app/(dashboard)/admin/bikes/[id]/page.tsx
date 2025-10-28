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
          <Tabs defaultValue="features" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2">
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="seller">Seller Info</TabsTrigger>
              <TabsTrigger value="service">Service History</TabsTrigger>
            </TabsList>

            <TabsContent value="features">
              <Card>
                <CardHeader>
                  <CardTitle>Features</CardTitle>
                </CardHeader>
                <CardContent>
                  {bike.features && bike.features.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {bike.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="break-words max-w-full">
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
              <div className="space-y-6">
                {/* Seller Documents */}
                <Card>
                  <CardHeader>
                    <CardTitle>Seller Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {bike.sellerAvailableDocs?.nid && (
                        <div className="p-3 border rounded-lg">
                          <p className="font-medium text-sm mb-2">NID</p>
                          <a 
                            href={bike.sellerAvailableDocs.nid} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm break-all"
                          >
                            View Document
                          </a>
                        </div>
                      )}
                      {bike.sellerAvailableDocs?.drivingLicense && (
                        <div className="p-3 border rounded-lg">
                          <p className="font-medium text-sm mb-2">Driving License</p>
                          <a 
                            href={bike.sellerAvailableDocs.drivingLicense} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm break-all"
                          >
                            View Document
                          </a>
                        </div>
                      )}
                      {bike.sellerAvailableDocs?.proofOfAddress && (
                        <div className="p-3 border rounded-lg">
                          <p className="font-medium text-sm mb-2">Proof of Address</p>
                          <a 
                            href={bike.sellerAvailableDocs.proofOfAddress} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm break-all"
                          >
                            View Document
                          </a>
                        </div>
                      )}
                    </div>
                    {!bike.sellerAvailableDocs?.nid && !bike.sellerAvailableDocs?.drivingLicense && !bike.sellerAvailableDocs?.proofOfAddress && (
                      <p className="text-muted-foreground">No seller documents available</p>
                    )}
                  </CardContent>
                </Card>

                {/* Bike Documents */}
                <Card>
                  <CardHeader>
                    <CardTitle>Bike Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {bike.bikeAvailableDocs?.taxToken && (
                        <div className="p-3 border rounded-lg">
                          <p className="font-medium text-sm mb-2">Tax Token</p>
                          <a 
                            href={bike.bikeAvailableDocs.taxToken} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm break-all"
                          >
                            View Document
                          </a>
                        </div>
                      )}
                      {bike.bikeAvailableDocs?.registration && (
                        <div className="p-3 border rounded-lg">
                          <p className="font-medium text-sm mb-2">Registration</p>
                          <a 
                            href={bike.bikeAvailableDocs.registration} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm break-all"
                          >
                            View Document
                          </a>
                        </div>
                      )}
                      {bike.bikeAvailableDocs?.insurance && (
                        <div className="p-3 border rounded-lg">
                          <p className="font-medium text-sm mb-2">Insurance</p>
                          <a 
                            href={bike.bikeAvailableDocs.insurance} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm break-all"
                          >
                            View Document
                          </a>
                        </div>
                      )}
                      {bike.bikeAvailableDocs?.fitnessReport && (
                        <div className="p-3 border rounded-lg">
                          <p className="font-medium text-sm mb-2">Fitness Report</p>
                          <a 
                            href={bike.bikeAvailableDocs.fitnessReport} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm break-all"
                          >
                            View Document
                          </a>
                        </div>
                      )}
                    </div>
                    {!bike.bikeAvailableDocs?.taxToken && !bike.bikeAvailableDocs?.registration && !bike.bikeAvailableDocs?.insurance && !bike.bikeAvailableDocs?.fitnessReport && (
                      <p className="text-muted-foreground">No bike documents available</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="seller">
              <Card>
                <CardHeader>
                  <CardTitle>Seller Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {bike.sellerInfo ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-medium">Name:</span>
                        <span className="text-muted-foreground">{bike.sellerInfo.name}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-medium">Phone:</span>
                        <span className="text-muted-foreground">{bike.sellerInfo.phone}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-medium">Email:</span>
                        <span className="text-muted-foreground">{bike.sellerInfo.email}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-medium">Address:</span>
                        <span className="text-muted-foreground">{bike.sellerInfo.address}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No seller information available</p>
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
              {bike.purchasePrice && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Purchase Price:</span>
                  <span className="font-medium">৳{bike.purchasePrice.toLocaleString()}</span>
                </div>
              )}
              {bike.purchaseDate && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Purchase Date:</span>
                  <span className="font-medium">{format(new Date(bike.purchaseDate), "MMM dd, yyyy")}</span>
                </div>
              )}
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
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div className="max-w-full">
                          <p className="font-medium break-words">{typeof partner.partnerId === 'string' ? partner.partnerId : partner.partnerId.name}</p>
                          <p className="text-sm text-muted-foreground flex items-center break-all">
                            <Mail className="mr-1 h-3 w-3" />
                            {typeof partner.partnerId === 'string' ? partner.partnerId : partner.partnerId.email}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center break-all">
                            <Phone className="mr-1 h-3 w-3" />
                            {typeof partner.partnerId === 'string' ? partner.partnerId : partner.partnerId.phone}
                          </p>
                        </div>
                        <div className="text-right sm:text-right">
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