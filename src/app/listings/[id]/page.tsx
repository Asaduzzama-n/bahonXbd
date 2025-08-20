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

// Mock bike data - in real app this would come from API
const mockBike: Bike = {
  _id: '1',
  title: 'Yamaha R15 V4',
  brand: 'Yamaha',
  model: 'R15 V4',
  year: 2023,
  price: 285000,
  mileage: 2500,
  condition: 'excellent',
  engineCapacity: 155,
  fuelType: 'petrol',
  transmission: 'manual',
  color: 'Racing Blue',
  location: 'Dhaka',
  description: 'Well-maintained Yamaha R15 V4 with all original parts and service records. This bike has been garage-kept and serviced regularly. Perfect for both city commuting and weekend rides. All documents are clear and ready for transfer.',
  images: ['/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600'],
  features: ['ABS', 'LED Headlight', 'Digital Display', 'Slipper Clutch', 'USD Forks', 'Dual Channel ABS'],
  isVerified: true,
  isFeatured: true,
  status: 'available',
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15')
}

export default function BikeDetailsPage() {
  const params = useParams()
  const [bike, setBike] = useState<Bike | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBike(mockBike)
      setIsLoading(false)
    }, 500)
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
              <Image
                src={bike.images[selectedImage]}
                alt={bike.title}
                fill
                className="object-cover"
              />
              {bike.isFeatured && (
                <Badge className="absolute top-4 left-4 bg-orange-500 text-white">
                  Featured
                </Badge>
              )}
              {bike.isVerified && (
                <Badge className="absolute top-4 right-4 bg-green-500 text-white">
                  Verified
                </Badge>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="flex gap-2 overflow-x-auto">
              {bike.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-orange-500' : 'border-muted'
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
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
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

            {/* Key Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Key Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Year: {bike.year}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Mileage: {bike.mileage.toLocaleString()} km</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Fuel className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Engine: {bike.engineCapacity}cc</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Transmission: {bike.transmission}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Location: {bike.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-muted-foreground"></span>
                    <span className="text-sm">Color: {bike.color}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {bike.features.map((feature, index) => (
                    <Badge key={index} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Actions */}
            <div className="space-y-3">
              <Button size="lg" className="w-full bg-brand-orange hover-brand-orange">
                <Phone className="h-4 w-4 mr-2" />
                Call Seller
              </Button>
              <Button size="lg" variant="outline" className="w-full border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white">
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

        {/* Seller Information */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Seller Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">BahonXBD Verified Dealer</h3>
                <p className="text-sm text-muted-foreground">Professional bike dealer with 8+ years experience</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm text-muted-foreground">📍 Dhanmondi, Dhaka</span>
                  <span className="text-sm text-muted-foreground">⭐ 4.8/5 (156 reviews)</span>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                Verified Seller
              </Badge>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}