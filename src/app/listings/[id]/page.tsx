'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Gauge, Fuel, Users, MapPin, Phone, Mail, Heart, Share2, ArrowLeft } from 'lucide-react'
import { Bike } from '@/lib/models'
import Image from 'next/image'
import Link from 'next/link'

// API function to fetch bike details
const fetchBikeDetails = async (id: string) => {
  const response = await fetch(`/api/public/bikes/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch bike details')
  }
  return response.json()
}

export default function BikeDetailsPage() {
  const params = useParams()
  const [bike, setBike] = useState<Bike | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadBike = async () => {
      try {
        setIsLoading(true)
        const response = await fetchBikeDetails(params.id as string)
        // Extract data from API response - check both response.data and direct response
        const bikeData = response.data || response
        setBike(bikeData)
      } catch (error) {
        console.error('Error loading bike:', error)
        setBike(null)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      loadBike()
    }
  }, [params.id])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'good': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'fair': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-video bg-muted rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-6 bg-muted rounded w-1/2"></div>
                <div className="h-20 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!bike) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Bike Not Found</h1>
          <p className="text-muted-foreground mb-4">The bike you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/listings">Back to Listings</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/listings" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Listings
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-video relative overflow-hidden rounded-lg">
              {bike.images && bike.images.length > 0 ? (
                <Image
                  src={bike.images[selectedImage] || bike.images[0]}
                  alt={bike.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">No image available</span>
                </div>
              )}
              {bike.isFeatured && (
                <Badge className="absolute top-4 left-4 bg-orange-500 text-white">
                  Featured
                </Badge>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-2 overflow-x-auto">
              {bike.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index ? 'border-orange-500' : 'border-muted'
                    }`}
                >
                  <Image
                    src={image}
                    alt={`${bike.title} ${index + 1}`}
                    width={80}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Bike Details */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-3xl font-bold">{bike.title}</h1>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <Badge className={getConditionColor(bike.condition)}>
                  {bike.condition.charAt(0).toUpperCase() + bike.condition.slice(1)}
                </Badge>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{bike.brand} {bike.model}</span>
              </div>

              <div className="text-4xl font-bold brand-orange mb-6">
                {formatPrice(bike.price)}
              </div>
            </div>

            {/* Key Details */}
            <Card>
              <CardHeader>
                <CardTitle>Key Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Year: {bike.year}</span>
                  </div>
                  {
                    bike.mileage && (
                      <div className="flex items-center gap-2">
                        <Gauge className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Mileage: {bike.mileage.toLocaleString()} km</span>
                      </div>
                    )
                  }
                  <div className="flex items-center gap-2">
                    <Fuel className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Brand: {bike.brand}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Model: {bike.model}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Actions */}
            <div className="flex gap-3">
              <Button size="lg" className="flex-1 bg-primary hover:bg-primary/90">
                <Phone className="h-4 w-4 mr-2" />
                Call Now
              </Button>
              <Button size="lg" variant="outline" className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Mail className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </div>

        {/* Description */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {bike.description}
            </p>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}