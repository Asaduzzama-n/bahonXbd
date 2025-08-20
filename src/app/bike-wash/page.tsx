'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MapPin, Clock, Star, Phone, Calendar, Droplets, Sparkles, Shield, Zap } from 'lucide-react'

// Mock data for bike wash locations
const washLocations = [
  {
    id: 1,
    name: "Premium Wash Center - Dhanmondi",
    address: "House 15, Road 7, Dhanmondi, Dhaka",
    phone: "+880 1712-345678",
    rating: 4.8,
    reviews: 156,
    services: ["Basic Wash", "Premium Wash", "Engine Cleaning", "Chain Lubrication"],
    pricing: {
      basic: 150,
      premium: 300,
      engine: 200,
      chain: 100
    },
    openHours: "8:00 AM - 8:00 PM",
    image: "/api/placeholder/400/250",
    features: ["Eco-friendly products", "Quick service", "Professional staff", "Quality guarantee"]
  },
  {
    id: 2,
    name: "Express Bike Care - Gulshan",
    address: "Plot 45, Road 11, Gulshan-2, Dhaka",
    phone: "+880 1798-765432",
    rating: 4.6,
    reviews: 89,
    services: ["Basic Wash", "Premium Wash", "Detailing", "Wax Polish"],
    pricing: {
      basic: 120,
      premium: 280,
      detailing: 500,
      wax: 250
    },
    openHours: "9:00 AM - 9:00 PM",
    image: "/api/placeholder/400/250",
    features: ["Express service", "Mobile app booking", "Loyalty rewards", "Free pickup"]
  },
  {
    id: 3,
    name: "Sparkle Bike Wash - Uttara",
    address: "Sector 7, Road 12, Uttara, Dhaka",
    phone: "+880 1634-987654",
    rating: 4.7,
    reviews: 203,
    services: ["Basic Wash", "Premium Wash", "Engine Cleaning", "Interior Cleaning"],
    pricing: {
      basic: 140,
      premium: 320,
      engine: 180,
      interior: 150
    },
    openHours: "7:00 AM - 10:00 PM",
    image: "/api/placeholder/400/250",
    features: ["24/7 service", "Advanced equipment", "Trained technicians", "Insurance coverage"]
  },
  {
    id: 4,
    name: "Royal Bike Spa - Banani",
    address: "House 78, Road 5, Banani, Dhaka",
    phone: "+880 1556-123789",
    rating: 4.9,
    reviews: 312,
    services: ["Basic Wash", "Premium Wash", "Full Detailing", "Paint Protection"],
    pricing: {
      basic: 180,
      premium: 350,
      detailing: 600,
      protection: 400
    },
    openHours: "8:00 AM - 7:00 PM",
    image: "/api/placeholder/400/250",
    features: ["Premium products", "VIP treatment", "Complimentary tea", "Waiting lounge"]
  }
]

const servicePackages = [
  {
    name: "Basic Wash",
    price: "৳120 - ৳180",
    duration: "30 mins",
    icon: <Droplets className="h-6 w-6" />,
    features: ["Exterior wash", "Tire cleaning", "Basic drying", "Quick inspection"]
  },
  {
    name: "Premium Wash",
    price: "৳280 - ৳350",
    duration: "45 mins",
    icon: <Sparkles className="h-6 w-6" />,
    features: ["Complete exterior wash", "Engine bay cleaning", "Chain lubrication", "Polish application", "Interior wipe down"]
  },
  {
    name: "Full Detailing",
    price: "৳500 - ৳600",
    duration: "90 mins",
    icon: <Shield className="h-6 w-6" />,
    features: ["Deep cleaning", "Engine detailing", "Paint correction", "Wax protection", "Interior deep clean", "Quality check"]
  },
  {
    name: "Express Service",
    price: "৳100 - ৳150",
    duration: "15 mins",
    icon: <Zap className="h-6 w-6" />,
    features: ["Quick rinse", "Spot cleaning", "Fast dry", "Basic inspection"]
  }
]

import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

export default function BikeWashPage() {
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedService, setSelectedService] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [selectedWashCenter, setSelectedWashCenter] = useState<any>(null)

  const filteredLocations = washLocations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.address.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleBooking = (location: any) => {
    setSelectedWashCenter(location)
    setIsBookingOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 hero-gradient text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Professional Bike Wash Services
          </h1>
          <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
            Keep your bike sparkling clean with our premium wash services. Professional care, eco-friendly products, and convenient location in Dhaka.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 font-semibold">
              View Our Location
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 font-semibold">
              Book Now
            </Button>
          </div>
        </div>
      </section>

      {/* Service Packages */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Service Packages</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from our range of professional bike wash services designed to keep your motorcycle in pristine condition.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicePackages.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-orange-100 dark:bg-orange-900 rounded-full w-fit">
                    <div className="brand-orange">{service.icon}</div>
                  </div>
                  <CardTitle className="text-xl">{service.name}</CardTitle>
                  <CardDescription className="text-2xl font-bold brand-orange">
                    {service.price}
                  </CardDescription>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {service.duration}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-brand-orange rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>



      {/* Our Location */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Location</h2>
            <p className="text-muted-foreground">
              Visit our premium bike wash center in Dhanmondi, Dhaka
            </p>
          </div>

          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-muted relative">
              <img
                src={washLocations[0].image}
                alt={washLocations[0].name}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-4 right-4 bg-brand-orange">
                Open Now
              </Badge>
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl mb-3">{washLocations[0].name}</CardTitle>
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <MapPin className="h-5 w-5 brand-orange" />
                    <span className="text-lg">{washLocations[0].address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Phone className="h-5 w-5 brand-orange" />
                    <span className="text-lg">{washLocations[0].phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-5 w-5 brand-orange" />
                    <span className="text-lg">{washLocations[0].openHours}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="h-5 w-5 fill-orange-400 text-orange-400" />
                    <span className="font-semibold text-xl">{washLocations[0].rating}</span>
                  </div>
                  <div className="text-muted-foreground">
                    {washLocations[0].reviews} reviews
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-lg">Services & Pricing:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(washLocations[0].pricing).map(([service, price]) => (
                    <div key={service} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="capitalize font-medium">{service} Wash:</span>
                      <span className="font-bold text-lg brand-orange">৳{price}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-lg">Features:</h4>
                <div className="flex flex-wrap gap-2">
                  {washLocations[0].features.map((feature, idx) => (
                    <Badge key={idx} className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  size="lg"
                  className="flex-1 bg-brand-orange hover-brand-orange"
                  onClick={() => handleBooking(washLocations[0])}
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Book Now
                </Button>
                <Button variant="outline" size="lg" className="border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white">
                  <Phone className="h-5 w-5 mr-2" />
                  Call Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book Bike Wash Service</DialogTitle>
            <DialogDescription>
              {selectedWashCenter?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="service">Select Service</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose service type" />
                </SelectTrigger>
                <SelectContent>
                  {selectedWashCenter?.services.map((service: string, idx: number) => (
                    <SelectItem key={idx} value={service.toLowerCase()}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="date">Preferred Date</Label>
              <Input type="date" id="date" />
            </div>
            
            <div>
              <Label htmlFor="time">Preferred Time</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9:00">9:00 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM</SelectItem>
                  <SelectItem value="14:00">2:00 PM</SelectItem>
                  <SelectItem value="15:00">3:00 PM</SelectItem>
                  <SelectItem value="16:00">4:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="+880 1XXX-XXXXXX" />
            </div>
            
            <div>
              <Label htmlFor="notes">Special Instructions (Optional)</Label>
              <Textarea id="notes" placeholder="Any special requirements..." />
            </div>
            
            <div className="flex gap-2">
              <Button className="flex-1">Confirm Booking</Button>
              <Button variant="outline" onClick={() => setIsBookingOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Why Choose Us */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Why Choose Our Bike Wash Services?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 brand-orange" />
              </div>
              <h3 className="text-xl font-semibold">Professional Quality</h3>
              <p className="text-muted-foreground">
                Trained technicians using premium products and advanced equipment for the best results.
              </p>
            </div>
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                <Droplets className="h-8 w-8 brand-orange" />
              </div>
              <h3 className="text-xl font-semibold">Eco-Friendly</h3>
              <p className="text-muted-foreground">
                Environmentally safe cleaning products that protect your bike and the planet.
              </p>
            </div>
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                <Zap className="h-8 w-8 brand-orange" />
              </div>
              <h3 className="text-xl font-semibold">Quick & Convenient</h3>
              <p className="text-muted-foreground">
                Fast service with online booking at our convenient Dhanmondi location.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}