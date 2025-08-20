'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Heart, Eye, Calendar, Gauge, Fuel, Users } from 'lucide-react'
import { Bike } from '@/lib/models'
import Image from 'next/image'
import Link from 'next/link'

// Mock data for bike listings
const mockBikes: Bike[] = [
  {
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
    description: 'Well-maintained Yamaha R15 V4 with all original parts and service records.',
    images: ['/api/placeholder/400/300'],
    features: ['ABS', 'LED Headlight', 'Digital Display', 'Slipper Clutch'],
    isVerified: true,
    isFeatured: true,
    status: 'available',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    _id: '2',
    title: 'Honda CB Shine SP',
    brand: 'Honda',
    model: 'CB Shine SP',
    year: 2022,
    price: 95000,
    mileage: 8500,
    condition: 'good',
    engineCapacity: 125,
    fuelType: 'petrol',
    transmission: 'manual',
    color: 'Black',
    location: 'Chittagong',
    description: 'Reliable Honda CB Shine SP, perfect for daily commuting.',
    images: ['/api/placeholder/400/300'],
    features: ['Electric Start', 'Tubeless Tyres', 'LED Tail Light'],
    isVerified: true,
    isFeatured: false,
    status: 'available',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    _id: '3',
    title: 'Suzuki Gixxer SF 250',
    brand: 'Suzuki',
    model: 'Gixxer SF 250',
    year: 2023,
    price: 350000,
    mileage: 1200,
    condition: 'excellent',
    engineCapacity: 249,
    fuelType: 'petrol',
    transmission: 'manual',
    color: 'Metallic Triton Blue',
    location: 'Sylhet',
    description: 'Almost new Suzuki Gixxer SF 250 with minimal usage.',
    images: ['/api/placeholder/400/300'],
    features: ['ABS', 'LED Headlight', 'Digital Display', 'USD Forks'],
    isVerified: true,
    isFeatured: true,
    status: 'available',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    _id: '4',
    title: 'TVS Apache RTR 160 4V',
    brand: 'TVS',
    model: 'Apache RTR 160 4V',
    year: 2021,
    price: 145000,
    mileage: 15000,
    condition: 'good',
    engineCapacity: 159,
    fuelType: 'petrol',
    transmission: 'manual',
    color: 'Gloss Black',
    location: 'Rajshahi',
    description: 'Sporty TVS Apache with good performance and fuel efficiency.',
    images: ['/api/placeholder/400/300'],
    features: ['ABS', 'LED DRL', 'Digital Display', 'Race Tuned Suspension'],
    isVerified: false,
    isFeatured: false,
    status: 'available',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05')
  },
  {
    _id: '5',
    title: 'Hero Splendor Plus',
    brand: 'Hero',
    model: 'Splendor Plus',
    year: 2020,
    price: 65000,
    mileage: 25000,
    condition: 'fair',
    engineCapacity: 97,
    fuelType: 'petrol',
    transmission: 'manual',
    color: 'Red',
    location: 'Khulna',
    description: 'Economical Hero Splendor Plus, great for budget-conscious buyers.',
    images: ['/api/placeholder/400/300'],
    features: ['Electric Start', 'Kick Start', 'Fuel Gauge'],
    isVerified: true,
    isFeatured: false,
    status: 'available',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    _id: '6',
    title: 'Bajaj Pulsar NS200',
    brand: 'Bajaj',
    model: 'Pulsar NS200',
    year: 2022,
    price: 185000,
    mileage: 12000,
    condition: 'good',
    engineCapacity: 199,
    fuelType: 'petrol',
    transmission: 'manual',
    color: 'Burnt Orange',
    location: 'Barisal',
    description: 'Powerful Bajaj Pulsar NS200 with excellent build quality.',
    images: ['/api/placeholder/400/300'],
    features: ['ABS', 'LED Headlight', 'Digital Display', 'Perimeter Frame'],
    isVerified: true,
    isFeatured: false,
    status: 'available',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  }
]

const brands = ['All Brands', 'Yamaha', 'Honda', 'Suzuki', 'TVS', 'Hero', 'Bajaj']
const conditions = ['All Conditions', 'excellent', 'good', 'fair']
const locations = ['All Locations', 'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal']
const sortOptions = ['Latest', 'Price: Low to High', 'Price: High to Low', 'Mileage: Low to High', 'Year: Newest First']

export default function ListingsPage() {
  const [bikes, setBikes] = useState<Bike[]>(mockBikes)
  const [filteredBikes, setFilteredBikes] = useState<Bike[]>(mockBikes)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('All Brands')
  const [selectedCondition, setSelectedCondition] = useState('All Conditions')
  const [selectedLocation, setSelectedLocation] = useState('All Locations')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [sortBy, setSortBy] = useState('Latest')
  const [showFilters, setShowFilters] = useState(false)

  // Filter and sort bikes
  useEffect(() => {
    let filtered = bikes.filter(bike => {
      const matchesSearch = bike.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bike.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bike.model.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesBrand = selectedBrand === 'All Brands' || bike.brand === selectedBrand
      const matchesCondition = selectedCondition === 'All Conditions' || bike.condition === selectedCondition
      const matchesLocation = selectedLocation === 'All Locations' || bike.location === selectedLocation
      
      const matchesPrice = (!priceRange.min || bike.price >= parseInt(priceRange.min)) &&
                          (!priceRange.max || bike.price <= parseInt(priceRange.max))
      
      return matchesSearch && matchesBrand && matchesCondition && matchesLocation && matchesPrice
    })

    // Sort bikes
    switch (sortBy) {
      case 'Price: Low to High':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'Price: High to Low':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'Mileage: Low to High':
        filtered.sort((a, b) => a.mileage - b.mileage)
        break
      case 'Year: Newest First':
        filtered.sort((a, b) => b.year - a.year)
        break
      default: // Latest
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    setFilteredBikes(filtered)
  }, [bikes, searchTerm, selectedBrand, selectedCondition, selectedLocation, priceRange, sortBy])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
      case 'good': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'fair': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Bike Listings</h1>
          <p className="text-muted-foreground text-lg">
            Find your perfect bike from our verified collection
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search bikes by brand, model, or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {filteredBikes.length} bikes found
              </span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Brand</label>
                  <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map(brand => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Condition</label>
                  <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map(condition => (
                        <SelectItem key={condition} value={condition}>
                          {condition.charAt(0).toUpperCase() + condition.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map(location => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Min Price (BDT)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Max Price (BDT)</label>
                  <Input
                    type="number"
                    placeholder="1000000"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedBrand('All Brands')
                    setSelectedCondition('All Conditions')
                    setSelectedLocation('All Locations')
                    setPriceRange({ min: '', max: '' })
                    setSortBy('Latest')
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Bike Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBikes.map((bike) => (
            <Card key={bike._id} className="bike-card overflow-hidden flex flex-col h-full">
              <div className="relative">
                <Image
                  src={bike.images[0]}
                  alt={bike.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover"
                />
                {bike.isFeatured && (
                  <Badge className="absolute top-2 left-2 bg-orange-500 text-white">
                    Featured
                  </Badge>
                )}
                {bike.isVerified && (
                  <Badge className="absolute top-2 right-2 bg-brand-orange text-white">
                    Verified
                  </Badge>
                )}
                <div className="absolute bottom-2 right-2 flex gap-1">
                  <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{bike.title}</CardTitle>
                  <Badge className={getConditionColor(bike.condition)}>
                    {bike.condition.charAt(0).toUpperCase() + bike.condition.slice(1)}
                  </Badge>
                </div>
                <div className="text-2xl font-bold brand-orange">
                  {formatPrice(bike.price)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3 flex-1 flex flex-col">
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {bike.year}
                  </div>
                  <div className="flex items-center gap-1">
                    <Gauge className="h-4 w-4" />
                    {bike.mileage.toLocaleString()} km
                  </div>
                  <div className="flex items-center gap-1">
                    <Fuel className="h-4 w-4" />
                    {bike.engineCapacity}cc
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {bike.location}
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                  {bike.description}
                </p>
                
                <div className="mt-auto">
                  <Button asChild className="w-full bg-brand-orange hover-brand-orange">
                    <Link href={`/listings/${bike._id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredBikes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No bikes found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button
              onClick={() => {
                setSearchTerm('')
                setSelectedBrand('All Brands')
                setSelectedCondition('All Conditions')
                setSelectedLocation('All Locations')
                setPriceRange({ min: '', max: '' })
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}