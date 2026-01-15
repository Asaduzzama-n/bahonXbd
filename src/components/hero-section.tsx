import Link from "next/link"
import { ArrowRight, CheckCircle, Shield, Award, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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
    <section className="relative bg-gradient-to-br from-background via-background to-muted/20 pt-16 lg:pt-24 pb-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="flex justify-center animate-fade-in">
            <Badge className="bg-primary/10 text-primary border-primary/20 px-6 py-3 text-sm font-semibold hover:bg-primary/20 transition-colors">
              <Award className="h-4 w-4 mr-2" />
              Bangladesh&apos;s Most Trusted Bike Dealer
            </Badge>
          </div>

          {/* Main Heading */}
          <div className="space-y-5 animate-fade-in-up">
            <h1 className="text-5xl lg:text-7xl font-bold text-foreground leading-tight tracking-tight">
              Premium Quality
              <span className="block mt-2 text-primary bg-clip-text">
                Second-Hand Motorcycles
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto font-normal">
              Your trusted partner for quality pre-owned bikes. Every motorcycle is personally inspected,
              verified, and backed by our guarantee of authenticity and performance.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8 py-3 text-base rounded-lg transition-colors duration-200"
            >
              <Link href="/listings" className="flex items-center gap-2">
                Browse All Bikes
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary/5 font-medium px-8 py-3 text-base rounded-lg transition-colors duration-200"
            >
              <Link href="/about">Why Choose Us</Link>
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 animate-fade-in-up">
            <div className="text-center p-6 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
              <div className="text-3xl font-bold text-primary group-hover:scale-110 transition-transform">
                {platformStats.totalBikesSold}+
              </div>
              <div className="text-sm text-muted-foreground font-medium mt-2">Bikes Sold</div>
            </div>
            <div className="text-center p-6 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
              <div className="text-3xl font-bold text-primary group-hover:scale-110 transition-transform">
                {platformStats.yearsInBusiness}+
              </div>
              <div className="text-sm text-muted-foreground font-medium mt-2">Years Experience</div>
            </div>
            <div className="text-center p-6 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
              <div className="text-3xl font-bold text-primary group-hover:scale-110 transition-transform">
                {platformStats.averageRating}/5
              </div>
              <div className="text-sm text-muted-foreground font-medium mt-2">Customer Rating</div>
            </div>
            <div className="text-center p-6 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
              <div className="text-3xl font-bold text-primary group-hover:scale-110 transition-transform">
                100%
              </div>
              <div className="text-sm text-muted-foreground font-medium mt-2">Verified Bikes</div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground pt-4 animate-fade-in-up">
            <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span className="font-medium">Personally Inspected</span>
            </div>
            <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
              <Shield className="h-4 w-4 text-primary" />
              <span className="font-medium">Transparent Pricing</span>
            </div>
            <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="font-medium">Professional Service</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }

        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px);
          background-size: 4rem 4rem;
        }
      `}</style>
    </section>
  )
}