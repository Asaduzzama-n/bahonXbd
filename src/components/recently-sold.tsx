"use client"

import { useState } from "react"
import { CheckCircle, ChevronLeft, ChevronRight, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SoldBike {
  id: number
  brand: string
  model: string
  year: number
  price: string
  image: string
  soldDate: string
  location: string
}

interface RecentlySoldProps {
  soldBikes: SoldBike[]
}

function formatSoldDate(dateString: string): string {
  const soldDate = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - soldDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return "1 day ago"
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
  return `${Math.ceil(diffDays / 30)} months ago`
}

export function RecentlySold({ soldBikes }: RecentlySoldProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerView = 3
  const maxIndex = Math.max(0, soldBikes.length - itemsPerView)

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Recently Sold</h2>
            <p className="text-muted-foreground">See what bikes are selling in your area</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="border-border hover:bg-muted"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={nextSlide}
              disabled={currentIndex >= maxIndex}
              className="border-border hover:bg-muted"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out gap-6"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
          >
            {soldBikes.map((bike) => (
              <div key={bike.id} className="flex-shrink-0" style={{ width: `calc(${100 / itemsPerView}% - 1rem)` }}>
                <Card className="group hover:shadow-lg transition-all duration-300 border-border bg-card overflow-hidden h-full">
                  <div className="relative overflow-hidden">
                    <img 
                      src={bike.image} 
                      alt={`${bike.brand} ${bike.model}`}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 left-3 bg-green-600 text-white">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Sold
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg text-foreground">
                        {bike.brand} {bike.model}
                      </h3>
                      <span className="text-sm text-muted-foreground">{bike.year}</span>
                    </div>
                    
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{bike.location}</span>
                      </div>
                      <p className="text-sm text-green-600 font-medium">
                        Sold {formatSoldDate(bike.soldDate)}
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-foreground">{bike.price}</span>
                      <div className="flex items-center text-sm text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Verified Sale
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}