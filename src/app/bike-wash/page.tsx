'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Clock, Star, Phone, Droplets, Sparkles, Shield } from 'lucide-react'

// Sample data based on actual BikeWashLocation schema
const washLocations = [
  {
    id: 1,
    location: "Dhanmondi, Dhaka",
    map: "https://maps.google.com/?q=Dhanmondi,Dhaka",
    price: 200,
    features: ["Eco-friendly products", "Quick service", "Professional staff", "Quality guarantee"],
    status: "active"
  },
  {
    id: 2,
    location: "Gulshan, Dhaka", 
    map: "https://maps.google.com/?q=Gulshan,Dhaka",
    price: 180,
    features: ["Express service", "Mobile app booking", "Loyalty rewards", "Free pickup"],
    status: "active"
  },
  {
    id: 3,
    location: "Uttara, Dhaka",
    map: "https://maps.google.com/?q=Uttara,Dhaka", 
    price: 250,
    features: ["24/7 service", "Advanced equipment", "Trained technicians", "Insurance coverage"],
    status: "active"
  },
  {
    id: 4,
    location: "Banani, Dhaka",
    map: "https://maps.google.com/?q=Banani,Dhaka",
    price: 190,
    features: ["Premium products", "VIP treatment", "Complimentary tea", "Waiting lounge"],
    status: "active"
  }
]



import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

export default function BikeWashPage() {

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Bike Wash Partners
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              Trusted <span className="text-primary">Wash Service Partners</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              I've personally verified and partnered with the best bike wash services across Dhaka. 
              Get your bike professionally cleaned at convenient locations with my quality guarantee and direct support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <MapPin className="mr-2 h-5 w-5" />
                View Locations
              </Button>
              <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-muted">
                <Phone className="mr-2 h-5 w-5" />
                Contact Me
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Partners Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Trusted Partners
            </Badge>
            <h2 className="text-3xl font-bold mb-4 text-foreground">My Wash Service Partners</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              I've partnered with the best bike wash centers across Dhaka to ensure your bike gets professional care. Each location is personally verified for quality and reliability.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow bg-card border-border">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl text-foreground">Quality Assured</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Personally verified partners
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                    Professional staff
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                    Quality guarantee
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                    Eco-friendly products
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow bg-card border-border">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl text-foreground">Convenient Locations</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Multiple areas across Dhaka
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                    Dhanmondi
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                    Gulshan
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                    Uttara & Banani
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow bg-card border-border">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl text-foreground">Trusted Service</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Recommended by me personally
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                    Personal recommendation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                    Competitive pricing
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                    Reliable service
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow bg-card border-border">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl text-foreground">Direct Support</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Contact me for assistance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                    Personal assistance
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                    Location guidance
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                    Service coordination
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>



      {/* Partner Locations */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Verified Partners
            </Badge>
            <h2 className="text-3xl font-bold mb-4 text-foreground">Wash Service Locations</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              I've personally verified each of these wash service partners to ensure they meet my quality standards for your bike care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {washLocations.filter(location => location.status === 'active').map((location) => (
              <Card key={location.id} className="overflow-hidden border-border bg-card">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">
                        Verified Partner
                      </Badge>
                      <h3 className="text-xl font-semibold text-foreground mb-2">{location.location}</h3>
                      <div className="flex items-center text-muted-foreground mb-4">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="text-sm">{location.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">৳{location.price}</div>
                      <div className="text-sm text-muted-foreground">Starting from</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-foreground mb-3">Features</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {location.features.map((feature, index) => (
                        <div key={index} className="flex items-center p-2 bg-muted rounded-lg">
                          <Sparkles className="h-4 w-4 text-primary mr-2" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button 
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={() => window.open(`tel:+8801712345678`, '_self')}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Call Me
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 border-border text-foreground hover:bg-muted"
                      onClick={() => window.open(location.map, '_blank')}
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      View Location
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose My Partners */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              My Guarantee
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Why Trust My Wash Partners?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              I've personally selected and verified each wash center to ensure they meet my quality standards. Your bike deserves the best care.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Personally Verified</h3>
              <p className="text-muted-foreground">
                I've personally inspected each location and tested their services to ensure they meet my quality standards.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Droplets className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Eco-Friendly Approach</h3>
              <p className="text-muted-foreground">
                All my partner locations use environmentally safe products that protect your bike and our planet.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Phone className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Direct Support</h3>
              <p className="text-muted-foreground">
                Contact me directly for recommendations, directions, or if you have any issues with the service.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}