'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Heart, Eye, Calendar, Gauge, Fuel, Users } from 'lucide-react'
import { Bike } from '@/lib/models'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from "@/lib/utils"

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
  const [sortBy, setSortBy] = useState('Latest')
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


      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Sidebar - Filters & Search */}
          <aside className={cn(
            "space-y-6 lg:block",
            showFilters ? "block" : "hidden"
          )}>
            <div className="space-y-6 sticky top-24">
              {/* Search Bar */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground uppercase tracking-wider">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary h-4 w-4" />
                  <Input
                    placeholder="Search bikes..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10 h-8 rounded-full border-primary/20 focus-visible:ring-primary/20 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Brand Filter */}
              <div>
                <label className="text-sm font-semibold mb-3 block text-foreground uppercase tracking-wider">Brand</label>
                <div className="flex flex-wrap gap-2">
                  {brands.map(brand => (
                    <button
                      key={brand}
                      onClick={() => handleBrandFilter(brand)}
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs  transition-all duration-300 border",
                        filters.brand === brand
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-primary"
                      )}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition Filter */}
              <div>
                <label className="text-sm font-semibold mb-3 block text-foreground uppercase tracking-wider">Condition</label>
                <div className="flex flex-wrap gap-2">
                  {conditions.map(condition => (
                    <button
                      key={condition}
                      onClick={() => handleConditionFilter(condition)}
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs transition-all duration-300 border",
                        filters.condition === condition
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-primary"
                      )}
                    >
                      {condition.charAt(0).toUpperCase() + condition.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <label className="text-sm font-semibold mb-3 block text-foreground uppercase tracking-wider">Location</label>
                <div className="flex flex-wrap gap-2">
                  {locations.map(location => (
                    <button
                      key={location}
                      onClick={() => handleLocationFilter(location)}
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs transition-all duration-300 border",
                        filters.location === location
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-primary"
                      )}
                    >
                      {location}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Filter */}
              <div>
                <label className="text-sm font-semibold mb-3 block text-foreground uppercase tracking-wider">Sort By</label>
                <div className="flex flex-wrap gap-2">
                  {sortOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => handleSort(option)}
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs  transition-all duration-300 border",
                        sortBy === option
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-primary"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-4 pt-4 border-t border-border">
                <div>
                  <label className="text-sm font-semibold mb-2 block text-foreground uppercase tracking-wider">Min Price (BDT)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="h-8 rounded-full border-primary/20 focus-visible:ring-primary/20 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block text-foreground uppercase tracking-wider">Max Price (BDT)</label>
                  <Input
                    type="number"
                    placeholder="1000000"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="h-8 rounded-full border-primary/20 focus-visible:ring-primary/20 transition-all duration-300"
                  />
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full h-11 rounded-full border-primary/20 hover:border-primary hover:bg-primary/10 text-primary transition-all duration-300"
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
          </aside>

          {/* Main Content Area */}
          <div className="space-y-6">
            {/* Header / Mobile Toggle */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center md:hidden gap-4 bg-card/50 p-4 rounded-2xl border border-border/50 backdrop-blur-sm">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 h-8 rounded-full border-primary/20 hover:border-primary hover:bg-primary/10 text-primary transition-all duration-300"
                >
                  <Filter className="h-4 w-4" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
                {/* <div className="flex flex-col">
                  <h2 className="text-xl font-bold text-foreground">
                    {totalBikes} {totalBikes === 1 ? 'Bike' : 'Bikes'} Available
                  </h2>
                  <p className="text-sm text-muted-foreground">Find your perfect ride</p>
                </div> */}
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading bikes...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold mb-2">Error loading bikes</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button className="h-11 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 transition-all duration-300" onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            )}

            {/* Bike Grid */}
            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bikes.map((bike) => (
                  <Card key={bike._id} className="bike-card py-0! overflow-hidden flex flex-col h-full">
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

                    <CardContent className="space-y-3 flex-1 flex flex-col pb-4">
                      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {bike.year}
                        </div>
                        {bike.mileage && (
                          <div className="flex items-center gap-1">
                            <Gauge className="h-4 w-4" />
                            {bike.mileage.toLocaleString()} km
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Fuel className="h-4 w-4" />
                          {bike.brand} Engine
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                        {bike.description}
                      </p>

                      <div className="mt-auto">
                        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                          <Link href={`/listings/${bike._id}`} className="flex items-center justify-center">
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
                  className="rounded-full border-primary/20 hover:border-primary hover:bg-primary/10 text-primary transition-all duration-300"
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
                        className={currentPage === page
                          ? "bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-10 w-10 p-0"
                          : "rounded-full border-primary/20 hover:border-primary hover:bg-primary/10 text-primary h-10 w-10 p-0"}
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
                  className="rounded-full border-primary/20 hover:border-primary hover:bg-primary/10 text-primary transition-all duration-300"
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
                  className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 transition-all duration-300"
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
          </div>
        </div>
      </main>
    </div>
  )
}