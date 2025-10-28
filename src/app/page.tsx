import Link from "next/link"
import { ArrowRight, Award, CheckCircle, Clock, Star, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { QuickSearch } from "@/components/quick-search"
import { FeaturedBikes } from "@/components/featured-bikes"
import { RecentlySold } from "@/components/recently-sold"

// Mock data - in real app this would come from database
const platformStats = {
  totalBikesSold: 1247,
  happyClients: 1180,
  yearsInBusiness: 8,
  averageRating: 4.8
}

const featuredBikes = [
  {
    id: 1,
    brand: "Yamaha",
    model: "R15 V4",
    year: 2023,
    price: "৳4,85,000",
    image: "/api/placeholder/400/300",
    mileage: "15,000 km",
    location: "Dhaka, Bangladesh"
  },
  {
    id: 2,
    brand: "Honda",
    model: "CBR 150R",
    year: 2022,
    price: "৳4,20,000",
    image: "/api/placeholder/400/300",
    mileage: "22,000 km",
    location: "Chittagong, Bangladesh"
  },
  {
    id: 3,
    brand: "Suzuki",
    model: "Gixxer SF",
    year: 2023,
    price: "৳3,95,000",
    image: "/api/placeholder/400/300",
    mileage: "8,500 km",
    location: "Sylhet, Bangladesh"
  },
  {
    id: 4,
    brand: "KTM",
    model: "Duke 390",
    year: 2023,
    price: "৳6,50,000",
    image: "/api/placeholder/400/300",
    mileage: "12,000 km",
    location: "Dhaka, Bangladesh"
  },
  {
    id: 5,
    brand: "Bajaj",
    model: "Dominar 400",
    year: 2022,
    price: "৳3,80,000",
    image: "/api/placeholder/400/300",
    mileage: "18,000 km",
    location: "Rajshahi, Bangladesh"
  }
]

const soldBikes = [
  { 
    id: 1, 
    brand: "KTM", 
    model: "Duke 200", 
    year: 2023,
    price: "৳3,80,000", 
    image: "/api/placeholder/400/300",
    soldDate: "2024-01-15",
    location: "Dhaka, Bangladesh"
  },
  { 
    id: 2, 
    brand: "Bajaj", 
    model: "Pulsar NS200", 
    year: 2022,
    price: "৳2,95,000", 
    image: "/api/placeholder/400/300",
    soldDate: "2024-01-10",
    location: "Chittagong, Bangladesh"
  },
  { 
    id: 3, 
    brand: "TVS", 
    model: "Apache RTR 200", 
    year: 2023,
    price: "৳2,85,000", 
    image: "/api/placeholder/400/300",
    soldDate: "2024-01-08",
    location: "Sylhet, Bangladesh"
  },
  { 
    id: 4, 
    brand: "Honda", 
    model: "CB Shine", 
    year: 2022,
    price: "৳1,85,000", 
    image: "/api/placeholder/400/300",
    soldDate: "2024-01-05",
    location: "Rajshahi, Bangladesh"
  },
  { 
    id: 5, 
    brand: "Yamaha", 
    model: "FZ-S", 
    year: 2023,
    price: "৳2,45,000", 
    image: "/api/placeholder/400/300",
    soldDate: "2024-01-03",
    location: "Khulna, Bangladesh"
  }
]

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
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection platformStats={platformStats} />

      {/* Quick Search */}
      <QuickSearch />

      {/* Featured Bikes */}
      <FeaturedBikes featuredBikes={featuredBikes} />

      {/* Recently Sold */}
      <RecentlySold soldBikes={soldBikes} />

      {/* Customer Reviews */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">What Our Customers Say</h2>
          <div className="overflow-hidden">
            <div className="flex animate-scroll hover:pause space-x-6">
              {[...customerReviews, ...customerReviews].map((review, index) => (
                <Card key={index} className="min-w-[350px] flex-shrink-0">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-3">
                      <div className="flex text-orange-400">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-muted-foreground">({review.rating}/5)</span>
                    </div>
                    <p className="text-muted-foreground mb-4 italic">"{review.review}"</p>
                    <div className="border-t pt-4">
                      <p className="font-semibold">{review.name}</p>
                      <p className="text-sm brand-orange">Purchased: {review.bike}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="text-center mt-8">
            <p className="text-muted-foreground mb-4">Over 1,000+ happy customers and counting</p>
            <div className="flex justify-center items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex text-orange-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <span className="font-semibold">4.8/5 Average Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

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
