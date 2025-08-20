import Link from "next/link"
import { Star, Users, Award, Clock, Search, Filter, ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

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
    price: 485000,
    image: "/api/placeholder/400/300",
    condition: "Excellent",
    engineSize: 155,
    color: "Racing Blue"
  },
  {
    id: 2,
    brand: "Honda",
    model: "CBR 150R",
    year: 2022,
    price: 420000,
    image: "/api/placeholder/400/300",
    condition: "Good",
    engineSize: 149,
    color: "Pearl White"
  },
  {
    id: 3,
    brand: "Suzuki",
    model: "Gixxer SF",
    year: 2023,
    price: 395000,
    image: "/api/placeholder/400/300",
    condition: "Excellent",
    engineSize: 155,
    color: "Metallic Black"
  }
]

const soldBikes = [
  { brand: "KTM", model: "Duke 200", price: 380000, soldDate: "2024-01-15" },
  { brand: "Bajaj", model: "Pulsar NS200", price: 295000, soldDate: "2024-01-10" },
  { brand: "TVS", model: "Apache RTR 200", price: 285000, soldDate: "2024-01-08" }
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
      <section className="relative hero-gradient text-white py-20 lg:py-32">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your Trusted <span className="text-white">Bike Platform</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-orange-100">
              Quality motorcycles, transparent deals, and professional service you can trust
            </p>
            
            {/* Trust Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">{platformStats.totalBikesSold}+</div>
                <div className="text-sm md:text-base text-orange-100">Bikes Sold</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">{platformStats.happyClients}+</div>
                <div className="text-sm md:text-base text-orange-100">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">{platformStats.yearsInBusiness}</div>
                <div className="text-sm md:text-base text-orange-100">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">{platformStats.averageRating}/5</div>
                <div className="text-sm md:text-base text-orange-100">Average Rating</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 font-semibold">
                <Link href="/listings" className="flex items-center gap-2">
                  Browse Bikes <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 font-semibold">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Search */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Find Your Perfect Bike</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input 
                  placeholder="Search by brand, model, or keyword..." 
                  className="h-12 text-lg"
                />
              </div>
              <Button size="lg" className="md:w-auto bg-brand-orange hover-brand-orange">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button size="lg" variant="outline" className="md:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Bikes */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Bikes</h2>
            <Link href="/listings">
              <Button variant="outline">View All <ArrowRight className="h-4 w-4 ml-2" /></Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBikes.map((bike) => (
              <Card key={bike.id} className="bike-card flex flex-col h-full">
                <CardHeader className="p-0">
                  <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                    <div className="text-muted-foreground">Bike Image</div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{bike.brand} {bike.model}</CardTitle>
                    <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">{bike.condition}</Badge>
                  </div>
                  <CardDescription className="mb-3">
                    {bike.year} • {bike.engineSize}CC • {bike.color}
                  </CardDescription>
                  <div className="text-2xl font-bold brand-orange mb-3">
                    ৳{bike.price.toLocaleString()}
                  </div>
                  <div className="mt-auto">
                    <div className="flex gap-2 w-full">
                      <Button className="flex-1 bg-brand-orange hover-brand-orange">View Details</Button>
                      <Button variant="outline" className="flex-1 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white">Contact</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Sold */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Recently Sold Bikes</h2>
            <Button variant="outline" className="border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white">
              View All Sold <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {soldBikes.map((bike, index) => (
              <Card key={index} className="bike-card flex flex-col h-full">
                <CardHeader className="p-0">
                  <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center relative">
                    <div className="text-muted-foreground">Bike Image</div>
                    <Badge className="absolute top-2 right-2 bg-brand-orange text-white">
                      Sold
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{bike.brand} {bike.model}</CardTitle>
                    <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Sold
                    </Badge>
                  </div>
                  <CardDescription className="mb-3">
                    Sold on {new Date(bike.soldDate).toLocaleDateString()}
                  </CardDescription>
                  <div className="text-2xl font-bold brand-orange mb-3">
                    ৳{bike.price.toLocaleString()}
                  </div>
                  <div className="mt-auto">
                    <div className="flex gap-2 w-full">
                      <Button className="flex-1 bg-brand-orange hover-brand-orange">View Similar</Button>
                      <Button variant="outline" className="flex-1 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white">Get Alert</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-muted-foreground mb-4">Join hundreds of satisfied customers who found their perfect bike</p>
            <Button className="bg-brand-orange hover-brand-orange">
              <Link href="/listings">Find Your Bike Today</Link>
            </Button>
          </div>
        </div>
      </section>

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
      <section className="py-16 bg-muted/50">
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
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg">
              Ready to Find Your Perfect Bike?
            </h2>
            <p className="text-xl md:text-2xl mb-10 text-orange-50 leading-relaxed">
              Browse our extensive collection of quality motorcycles or get personalized assistance from our experts
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Link href="/listings" className="flex items-center gap-2">
                  Browse All Bikes <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-orange-600 font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Link href="/bike-wash">Bike Wash Services</Link>
              </Button>
            </div>
            <div className="mt-8 flex justify-center items-center gap-6 text-orange-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Quality Assured</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Expert Support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Trusted Platform</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
