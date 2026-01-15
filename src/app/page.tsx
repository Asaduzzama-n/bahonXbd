'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import { ArrowRight, Award, CheckCircle, Clock, Star, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { FeaturedBikes } from "@/components/featured-bikes"
import { RecentlySold } from "@/components/recently-sold"
import { CustomerTestimonials } from "@/components/customer-testimonials"

// Mock data for platform statistics (this would come from a separate API in a real app)
const platformStats = {
  totalBikesSold: 890,
  happyClients: 340,
  yearsInBusiness: 5,
  averageRating: 4.8
}

// API functions
const fetchFeaturedBikes = async () => {
  const response = await fetch('/api/public/bikes/featured?limit=6')
  if (!response.ok) {
    throw new Error('Failed to fetch featured bikes')
  }
  return response.json()
}

const fetchSoldBikes = async () => {
  const response = await fetch('/api/public/bikes/sold?limit=6')
  if (!response.ok) {
    throw new Error('Failed to fetch sold bikes')
  }
  return response.json()
}



const customerReviews = [
  {
    name: "Ahmed Rahman",
    rating: 5,
    review: "Excellent service! Got my dream bike at a great price. The team was very professional and transparent.",
    bike: "Yamaha R15 V3"
  },
  {
    name: "Fatima Khan",
    rating: 5,
    review: "Amazing experience. The bike was exactly as described and the paperwork was handled smoothly.",
    bike: "Honda CBR 150R"
  },
  {
    name: "Karim Hassan",
    rating: 4,
    review: "Great platform for buying bikes. Found exactly what I was looking for. Highly recommended!",
    bike: "Suzuki Gixxer"
  }
]

export default function Home() {
  const [featuredBikesData, setFeaturedBikesData] = useState([])
  const [soldBikesData, setSoldBikesData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [featuredResponse, soldResponse] = await Promise.all([
          fetchFeaturedBikes(),
          fetchSoldBikes()
        ])

        setFeaturedBikesData(featuredResponse.data || [])
        setSoldBikesData(soldResponse.data || [])
      } catch (error) {
        console.error('Error loading data:', error)
        // Set empty arrays on error
        setFeaturedBikesData([])
        setSoldBikesData([])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <HeroSection platformStats={platformStats} />

      {/* Featured Bikes */}
      <FeaturedBikes featuredBikes={featuredBikesData} loading={loading} />

      {/* Recently Sold */}
      <RecentlySold soldBikes={soldBikesData} loading={loading} />

      {/* Customer Testimonials */}
      <CustomerTestimonials />

      {/* Trust & Transparency Section */}
      {/* <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Why Choose BahonXBD?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 brand-orange" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
                <p className="text-muted-foreground">Every bike is thoroughly inspected and verified before listing</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 brand-orange" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Trusted by Thousands</h3>
                <p className="text-muted-foreground">Over 1000+ satisfied customers and growing</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 brand-orange" />
                </div>
                <h3 className="text-xl font-semibold mb-2">8 Years Experience</h3>
                <p className="text-muted-foreground">Established reputation in the motorcycle industry</p>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Ready to Find Your Perfect Bike?
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Browse our extensive collection of quality motorcycles or get personalized assistance from our experts
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4 text-lg">
                <Link href="/listings" className="flex items-center gap-2">
                  Browse All Bikes <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-8 py-4 text-lg">
                <Link href="/bike-wash">Bike Wash Services</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-card border border-border rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Quality Assured</h3>
                <p className="text-muted-foreground text-sm">Every bike thoroughly inspected and verified</p>
              </div>
              <div className="text-center p-6 bg-card border border-border rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Expert Support</h3>
                <p className="text-muted-foreground text-sm">Professional guidance from our experienced team</p>
              </div>
              <div className="text-center p-6 bg-card border border-border rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Trusted Platform</h3>
                <p className="text-muted-foreground text-sm">1000+ satisfied customers and growing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
