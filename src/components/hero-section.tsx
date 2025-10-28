import Link from "next/link"
import { ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrustElements } from "./trust-elements"

interface PlatformStats {
  totalBikesSold: number
  happyClients: number
  yearsInBusiness: number
  averageRating: number
}

interface HeroSectionProps {
  platformStats: PlatformStats
}

export function HeroSection({ platformStats }: HeroSectionProps) {
  return (
    <section className="relative bg-muted/30 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Main Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2 text-sm font-medium">
                🏆 Bangladesh's Trusted Bike Dealer
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Premium <span className="text-primary">Second-Hand</span> Motorcycles
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Your trusted partner for quality pre-owned motorcycles. Every bike is personally inspected, 
                verified, and comes with our guarantee of authenticity and performance.
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-card border border-border rounded-lg">
                <div className="text-3xl font-bold text-primary">{platformStats.totalBikesSold}+</div>
                <div className="text-sm text-muted-foreground">Bikes Sold</div>
              </div>
              <div className="text-center p-4 bg-card border border-border rounded-lg">
                <div className="text-3xl font-bold text-primary">{platformStats.yearsInBusiness}</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
              <div className="text-center p-4 bg-card border border-border rounded-lg">
                <div className="text-3xl font-bold text-primary">{platformStats.averageRating}/5</div>
                <div className="text-sm text-muted-foreground">Customer Rating</div>
              </div>
              <div className="text-center p-4 bg-card border border-border rounded-lg">
                <div className="text-3xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Verified Bikes</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4 text-lg">
                <Link href="/listings" className="flex items-center gap-2">
                  Browse Available Bikes <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-8 py-4 text-lg">
                <Link href="/about">Why Choose Us</Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Personally Inspected</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Transparent Pricing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Professional Service</span>
              </div>
            </div>
          </div>

          {/* Right Column - Trust Elements */}
          <TrustElements platformStats={platformStats} />
        </div>
      </div>
    </section>
  )
}