"use client"

import { useState } from "react"
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Gauge } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Bike {
  _id: string
  title?: string
  brand: string
  model: string
  year: number
  price: number
  images: string[]
  mileage: string
  location: string
}

interface FeaturedBikesProps {
  featuredBikes: Bike[]
  loading?: boolean
}

export function FeaturedBikes({ featuredBikes, loading = false }: FeaturedBikesProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerView = 3
  const maxIndex = Math.max(0, featuredBikes.length - itemsPerView)

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  return (
    <section className="pt-8 pb-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Featured Bikes</h2>
            <p className="text-muted-foreground">Handpicked premium motorcycles for you</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className="border-border hover:bg-muted h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextSlide}
                disabled={currentIndex >= maxIndex}
                className="border-border hover:bg-muted h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm" className="border-border hover:bg-muted text-sm px-3 py-1.5">
              View All
              <ArrowRight className="ml-2 h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          {loading ? (
            <div className="flex gap-6">
              {[...Array(itemsPerView)].map((_, index) => (
                <div key={index} className="flex-shrink-0" style={{ width: `calc(${100 / itemsPerView}% - 1rem)` }}>
                  <Card className="border-border bg-card overflow-hidden h-full">
                    <div className="relative overflow-hidden">
                      <div className="w-full h-48 bg-muted animate-pulse" />
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="h-4 bg-muted animate-pulse rounded" />
                        <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
                        <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                        <div className="flex justify-between items-center">
                          <div className="h-6 bg-muted animate-pulse rounded w-20" />
                          <div className="h-8 bg-muted animate-pulse rounded w-24" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="flex transition-transform duration-300 ease-in-out gap-6"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
            >
              {featuredBikes.map((bike) => (
                <div key={bike._id} className="flex-shrink-0" style={{ width: `calc(${100 / itemsPerView}% - 1rem)` }}>
                  <Card className="group hover:shadow-lg transition-all duration-300 border-border py-0!  bg-card overflow-hidden h-full">
                    <div className="relative overflow-hidden">
                      <img
                        src={bike.images?.[0] || '/placeholder-bike.jpg'}
                        alt={bike.title || `${bike.brand} ${bike.model}`}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                        Featured
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                          {bike.title || `${bike.brand} ${bike.model}`}
                        </h3>
                        <span className="text-sm text-muted-foreground">{bike.year}</span>
                      </div>

                      <div className="space-y-1 mb-4">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{bike.location}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Gauge className="h-3 w-3" />
                          <span>{bike.mileage}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-primary">৳{bike.price?.toLocaleString()}</span>
                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}