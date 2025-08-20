'use client'

import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Award, 
  Shield, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Star,
  CheckCircle,
  Heart,
  Target,
  Zap
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const teamMembers = [
  {
    name: 'Ahmed Rahman',
    role: 'Founder & CEO',
    image: '/api/placeholder/300/300',
    description: 'Passionate bike enthusiast with 15+ years in the automotive industry.'
  },
  {
    name: 'Fatima Khan',
    role: 'Head of Operations',
    image: '/api/placeholder/300/300',
    description: 'Expert in logistics and customer service with a focus on quality assurance.'
  },
  {
    name: 'Mohammad Ali',
    role: 'Technical Lead',
    image: '/api/placeholder/300/300',
    description: 'Motorcycle mechanic and technical expert ensuring all bikes meet our standards.'
  },
  {
    name: 'Rashida Begum',
    role: 'Customer Relations',
    image: '/api/placeholder/300/300',
    description: 'Dedicated to providing exceptional customer experience and support.'
  }
]

const achievements = [
  {
    icon: Users,
    title: '10,000+',
    description: 'Happy Customers',
    color: 'brand-orange'
  },
  {
    icon: Award,
    title: '5,000+',
    description: 'Bikes Sold',
    color: 'brand-orange'
  },
  {
    icon: Shield,
    title: '99.8%',
    description: 'Customer Satisfaction',
    color: 'brand-orange'
  },
  {
    icon: Clock,
    title: '5+',
    description: 'Years of Excellence',
    color: 'brand-orange'
  }
]

const values = [
  {
    icon: Shield,
    title: 'Trust & Transparency',
    description: 'We believe in honest dealings and transparent processes. Every bike is thoroughly inspected and verified before listing.'
  },
  {
    icon: Heart,
    title: 'Customer First',
    description: 'Our customers are at the heart of everything we do. We strive to exceed expectations in every interaction.'
  },
  {
    icon: Target,
    title: 'Quality Assurance',
    description: 'We maintain the highest standards of quality in our bike selection and services to ensure customer satisfaction.'
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'We continuously innovate our platform and services to provide the best bike buying experience in Bangladesh.'
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-20 hero-gradient text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 bg-white/20 text-white border-white/30">
                About BahonXBD
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Your Trusted Partner in
                <span className="text-white block">Bike Trading</span>
              </h1>
              <p className="text-xl text-orange-100 mb-8 leading-relaxed">
                We're revolutionizing the bike marketplace in Bangladesh by connecting buyers and sellers 
                through a trusted, transparent, and efficient platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 font-semibold button-height">
                  <Link href="/listings">
                    Browse Bikes
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 font-semibold button-height">
                  <Link href="/bike-wash">
                    Our Services
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {achievements.map((achievement, index) => {
                const IconComponent = achievement.icon
                return (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900 shadow-lg mb-4">
                      <IconComponent className={`h-8 w-8 ${achievement.color}`} />
                    </div>
                    <div className="text-3xl font-bold mb-2 brand-orange">{achievement.title}</div>
                    <div className="text-muted-foreground">{achievement.description}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 border-orange-200 dark:border-orange-800">
                  Our Story
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Building Bangladesh's Premier Bike Marketplace
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Founded in 2019, BahonXBD started with a simple vision: to create a trustworthy 
                    platform where bike enthusiasts could buy and sell motorcycles with confidence. 
                    What began as a small initiative has grown into Bangladesh's most trusted bike marketplace.
                  </p>
                  <p>
                    Our journey started when our founder, Ahmed Rahman, experienced the challenges of 
                    buying a used motorcycle. The lack of transparency, unreliable information, and 
                    limited options motivated him to create a solution that would benefit the entire 
                    motorcycle community in Bangladesh.
                  </p>
                  <p>
                    Today, we're proud to have facilitated thousands of successful bike transactions, 
                    helped countless families find their perfect ride, and built a community of 
                    satisfied customers who trust us with their most important purchases.
                  </p>
                </div>
                <div className="mt-8">
                  <Button className="bg-brand-orange hover-brand-orange button-height" asChild>
                    <Link href="/listings">
                      Start Your Journey
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="relative z-10">
                  <Image
                    src="/api/placeholder/600/400"
                    alt="BahonXBD Story"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-2xl"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-full h-full bg-orange-100 dark:bg-orange-900/30 rounded-lg -z-10"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 border-orange-200 dark:border-orange-800">
                Our Values
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                What Drives Us Forward
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our core values shape every decision we make and every service we provide.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon
                return (
                  <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                          <IconComponent className="h-6 w-6 brand-orange" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 border-orange-200 dark:border-orange-800">
                Our Team
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Meet the People Behind BahonXBD
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our dedicated team of professionals is committed to providing you with the best bike buying experience.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="text-center overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={300}
                      height={300}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                    <Badge className="mb-3 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">{member.role}</Badge>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 border-orange-200 dark:border-orange-800">
                Why Choose Us
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                The BahonXBD Advantage
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 brand-orange" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Verified Listings</h3>
                <p className="text-muted-foreground">
                  Every bike on our platform is thoroughly inspected and verified for authenticity and condition.
                </p>
              </Card>
              
              <Card className="p-6 text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 brand-orange" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Secure Transactions</h3>
                <p className="text-muted-foreground">
                  Our secure platform ensures safe and transparent transactions for both buyers and sellers.
                </p>
              </Card>
              
              <Card className="p-6 text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 brand-orange" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Expert Support</h3>
                <p className="text-muted-foreground">
                  Our team of motorcycle experts is always ready to help you make the right choice.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <Badge className="mb-4 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 border-orange-200 dark:border-orange-800">
                  Get in Touch
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Ready to Start Your Journey?
                </h2>
                <p className="text-xl text-muted-foreground">
                  Have questions? We're here to help you find the perfect bike.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="p-6 text-center">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-6 w-6 brand-orange" />
                  </div>
                  <h3 className="font-semibold mb-2">Visit Us</h3>
                  <p className="text-muted-foreground text-sm">
                    123 Bike Street<br />
                    Dhanmondi, Dhaka 1205<br />
                    Bangladesh
                  </p>
                </Card>
                
                <Card className="p-6 text-center">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-6 w-6 brand-orange" />
                  </div>
                  <h3 className="font-semibold mb-2">Call Us</h3>
                  <p className="text-muted-foreground text-sm">
                    +880 1700-000000<br />
                    +880 2-9876543<br />
                    9 AM - 9 PM (Daily)
                  </p>
                </Card>
                
                <Card className="p-6 text-center">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-6 w-6 brand-orange" />
                  </div>
                  <h3 className="font-semibold mb-2">Email Us</h3>
                  <p className="text-muted-foreground text-sm">
                    info@bahonxbd.com<br />
                    support@bahonxbd.com<br />
                    We reply within 24 hours
                  </p>
                </Card>
              </div>
              
              <div className="text-center mt-12">
                <Button size="lg" className="bg-brand-orange hover-brand-orange button-height" asChild>
                  <Link href="/listings">
                    Start Browsing Bikes
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}