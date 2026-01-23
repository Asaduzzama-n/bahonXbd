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
  Zap,
  Bike,
  Calendar,
  FileCheck,
  Wrench,
  Eye,
  Handshake,
  FileText
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'



export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                About BahonXBD
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
                Your Trusted <span className="text-primary">Bike Partner</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Hi, I'm a passionate biker with over 6 years of experience in the second-hand bike business.
                As a rider myself, I understand what makes a great bike and I'm committed to helping you find
                the perfect ride with complete transparency and professional service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                  <Link href="/listings">
                    Browse Available Bikes
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-muted" asChild>
                  <Link href="#story">
                    My Story
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bike className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-primary mb-2">200+</h3>
                <p className="text-muted-foreground">Bikes Successfully Sold</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-primary mb-2">6+</h3>
                <p className="text-muted-foreground">Years of Experience</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-primary mb-2">100%</h3>
                <p className="text-muted-foreground">Document Verification</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section id="story" className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                  My Journey
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                  From Passion to Profession
                </h2>
                <p className="text-muted-foreground mb-6">
                  What started as a personal love for motorcycles has evolved into a trusted business
                  serving fellow bikers across Bangladesh. Over the past 6+ years, I've built my
                  reputation on honesty, transparency, and genuine care for every customer.
                </p>
                <p className="text-muted-foreground mb-6">
                  As a biker myself, I understand the importance of finding the right bike - one that
                  matches your needs, budget, and dreams. That's why I personally inspect every bike,
                  verify all documents, and ensure complete transparency in every transaction.
                </p>
                <p className="text-muted-foreground mb-8">
                  My partnerships with professional bike service providers mean you get not just a bike,
                  but complete peace of mind with proper documentation transfer and after-sale support.
                </p>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                  <Link href="/listings">
                    See Available Bikes
                  </Link>
                </Button>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 rounded-2xl transform rotate-3"></div>
                <Image
                  src="/logo.jpg"
                  alt="BahonXBD Owner"
                  width={500}
                  height={400}
                  className="relative rounded-2xl shadow-2xl object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                My Values
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                What I Stand For
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                These core principles guide every interaction and transaction in my business.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-8 text-center bg-card border-border hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Complete Transparency</h3>
                <p className="text-muted-foreground">
                  Every bike comes with full disclosure of its condition, history, and any issues.
                  No hidden problems, no surprises - just honest information.
                </p>
              </Card>

              <Card className="p-8 text-center bg-card border-border hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Document Verification</h3>
                <p className="text-muted-foreground">
                  I personally verify all documents and assist with proper transfer procedures.
                  Your legal ownership is guaranteed and hassle-free.
                </p>
              </Card>

              <Card className="p-8 text-center bg-card border-border hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Personal Service</h3>
                <p className="text-muted-foreground">
                  As a fellow biker, I understand your needs. You get personalized attention
                  and ongoing support even after your purchase.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Expertise Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                My Expertise
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                What Sets Me Apart
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                6+ years of hands-on experience and genuine passion for motorcycles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Wrench className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-foreground">Technical Knowledge</h3>
                <p className="text-muted-foreground">
                  Deep understanding of motorcycle mechanics, common issues, and maintenance requirements
                  from years of riding and dealing with bikes.
                </p>
              </Card>

              <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-foreground">Quality Inspection</h3>
                <p className="text-muted-foreground">
                  Every bike undergoes thorough inspection. I check engine condition, electrical systems,
                  brakes, and overall safety before listing.
                </p>
              </Card>

              <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Handshake className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-foreground">Professional Network</h3>
                <p className="text-muted-foreground">
                  Strong partnerships with trusted mechanics, parts suppliers, and service centers
                  for comprehensive after-sale support.
                </p>
              </Card>

              <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-foreground">Legal Expertise</h3>
                <p className="text-muted-foreground">
                  Complete knowledge of vehicle registration, transfer procedures, and legal requirements
                  in Bangladesh. Hassle-free documentation guaranteed.
                </p>
              </Card>

              <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-foreground">Genuine Passion</h3>
                <p className="text-muted-foreground">
                  This isn't just business for me - it's my passion. I treat every customer like a fellow
                  rider and every bike with the respect it deserves.
                </p>
              </Card>

              <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-foreground">Proven Track Record</h3>
                <p className="text-muted-foreground">
                  200+ successful sales, countless satisfied customers, and a reputation built on trust
                  and reliability over 6+ years in the business.
                </p>
              </Card>
            </div>
          </div>
        </section>



        {/* Why Choose Me Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                Why Choose Me
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                The BahonXBD Advantage
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Personal service, professional expertise, and genuine care for every customer.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 text-center bg-card border-border hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">Personal Inspection</h3>
                <p className="text-muted-foreground">
                  I personally inspect every bike, checking engine, brakes, electrical systems, and overall condition
                  before listing. No surprises, just honest assessment.
                </p>
              </Card>

              <Card className="p-6 text-center bg-card border-border hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">Document Guarantee</h3>
                <p className="text-muted-foreground">
                  Complete document verification and transfer assistance. I handle all paperwork and ensure
                  legal ownership transfer with zero hassle for you.
                </p>
              </Card>

              <Card className="p-6 text-center bg-card border-border hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">Ongoing Support</h3>
                <p className="text-muted-foreground">
                  My service doesn't end with the sale. Get ongoing support, maintenance advice, and access
                  to my network of trusted service providers.
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
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                  Get in Touch
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                  Ready to Start Your Journey?
                </h2>
                <p className="text-xl text-muted-foreground">
                  Have questions? We're here to help you find the perfect bike.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="p-6 text-center bg-card border-border hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2 text-foreground">Visit Us</h3>
                  <p className="text-muted-foreground text-sm">
                    123 Bike Street<br />
                    Dhanmondi, Dhaka 1205<br />
                    Bangladesh
                  </p>
                </Card>

                <Card className="p-6 text-center bg-card border-border hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2 text-foreground">Call Us</h3>
                  <p className="text-muted-foreground text-sm">
                    +880 1700-000000<br />
                    +880 2-9876543<br />
                    9 AM - 9 PM (Daily)
                  </p>
                </Card>

                <Card className="p-6 text-center bg-card border-border hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2 text-foreground">Email Us</h3>
                  <p className="text-muted-foreground text-sm">
                    info@bahonxbd.com<br />
                    support@bahonxbd.com<br />
                    We reply within 24 hours
                  </p>
                </Card>
              </div>

              <div className="text-center mt-12">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                  <Link href="/listings">
                    Start Browsing Bikes
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>


    </div>
  )
}