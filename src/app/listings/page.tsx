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

// API function to fetch bikes
const fetchBikes = async (params: {
  page?: number
  limit?: number
  brand?: string
  condition?: string
  location?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  sortBy?: string
  sortOrder?: string
}) => {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== 'All Brands' && value !== 'All Conditions' && value !== 'All Locations') {
      searchParams.append(key, value.toString())
    }
  })

  const response = await fetch(`/api/public/bikes?${searchParams.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch bikes')
  }
  return response.json()
}

const brands = ['All Brands', 'Yamaha', 'Honda', 'Suzuki', 'TVS', 'Hero', 'Bajaj']
const conditions = ['All Conditions', 'excellent', 'good', 'fair']
const locations = ['All Locations', 'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal']
const sortOptions = ['Latest', 'Price: Low to High', 'Price: High to Low', 'Mileage: Low to High', 'Year: Newest First']

export default function ListingsPage() {
  const [bikes, setBikes] = useState<Bike[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalBikes, setTotalBikes] = useState(0)
  const [filters, setFilters] = useState({
    brand: 'All Brands',
    condition: 'All Conditions',
    location: 'All Locations',
    minPrice: '',
    maxPrice: '',
    search: ''
  })
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)

  const bikesPerPage = 12

  // Filter handlers
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleBrandFilter = (brand: string) => {
    handleFilterChange('brand', brand)
  }

  const handleConditionFilter = (condition: string) => {
    handleFilterChange('condition', condition)
  }

  const handleLocationFilter = (location: string) => {
    handleFilterChange('location', location)
  }

  const handleSort = (sortOption: string) => {
    setSortBy(sortOption)
    setCurrentPage(1)
  }

  // Fetch bikes data from API
  useEffect(() => {
    const loadBikes = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const sortMapping: { [key: string]: { sortBy: string; sortOrder: string } } = {
          'Latest': { sortBy: 'createdAt', sortOrder: 'desc' },
          'Price: Low to High': { sortBy: 'price', sortOrder: 'asc' },
          'Price: High to Low': { sortBy: 'price', sortOrder: 'desc' },
          'Mileage: Low to High': { sortBy: 'mileage', sortOrder: 'asc' },
          'Year: Newest First': { sortBy: 'year', sortOrder: 'desc' }
        }

        const sort = sortMapping[sortBy] || sortMapping['Latest']
        
        const params = {
          page: currentPage,
          limit: bikesPerPage,
          brand: filters.brand !== 'All Brands' ? filters.brand : undefined,
          condition: filters.condition !== 'All Conditions' ? filters.condition.toLowerCase() : undefined,
          location: filters.location !== 'All Locations' ? filters.location : undefined,
          minPrice: filters.minPrice ? parseInt(filters.minPrice) : undefined,
          maxPrice: filters.maxPrice ? parseInt(filters.maxPrice) : undefined,
          search: filters.search || undefined,
          sortBy: sort.sortBy,
          sortOrder: sort.sortOrder
        }

        const data = await fetchBikes(params)
        setBikes(data.data)
        setTotalPages(data.totalPages)
        setTotalBikes(data.total)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch bikes')
      } finally {
        setLoading(false)
      }
    }

    loadBikes()
  }, [currentPage, filters, sortBy])

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
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
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
                {totalBikes} bikes found
              </span>
              <Select value={sortBy} onValueChange={handleSort}>
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
                  <Select value={filters.brand} onValueChange={handleBrandFilter}>
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
                  <Select value={filters.condition} onValueChange={handleConditionFilter}>
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
                  <Select value={filters.location} onValueChange={handleLocationFilter}>
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
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Max Price (BDT)</label>
                  <Input
                    type="number"
                    placeholder="1000000"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilters({
                      brand: 'All Brands',
                      condition: 'All Conditions',
                      location: 'All Locations',
                      minPrice: '',
                      maxPrice: '',
                      search: ''
                    })
                    setSortBy('Latest')
                    setCurrentPage(1)
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading bikes...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold mb-2">Error loading bikes</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        )}

        {/* Bike Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bikes.map((bike) => (
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
                    {bike.brand} Engine
                  </div>
                  {/* <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {bike.}
                  </div> */}
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
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page ? "bg-brand-orange hover-brand-orange" : ""}
                  >
                    {page}
                  </Button>
                )
              })}
            </div>
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && bikes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No bikes found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button
              onClick={() => {
                setFilters({
                  brand: 'All Brands',
                  condition: 'All Conditions',
                  location: 'All Locations',
                  minPrice: '',
                  maxPrice: '',
                  search: ''
                })
                setSortBy('Latest')
                setCurrentPage(1)
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