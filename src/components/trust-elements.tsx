import { Star, Shield, Award, Users, Phone, MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PlatformStats {
  totalBikesSold: number
  happyClients: number
  yearsInBusiness: number
  averageRating: number
}

interface TrustElementsProps {
  platformStats: PlatformStats
}

export function TrustElements({ platformStats }: TrustElementsProps) {
  return (
    <div className="space-y-6">
      {/* Main Trust Card - Single unified design */}
      <Card className="bg-card border border-border">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-lg font-semibold">Verified Dealer</div>
              <div className="text-sm text-muted-foreground">Licensed & Trusted</div>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Contact Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Dhaka, Bangladesh</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Phone className="h-4 w-4 text-primary" />
              <span>+880 1XXX-XXXXXX</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {platformStats.averageRating}/5 from {platformStats.happyClients}+ customers
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* Service Guarantees - Integrated into single card */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground mb-3">Our Guarantees</h4>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-foreground">Quality Guarantee</div>
                  <div className="text-sm text-muted-foreground">
                    Every bike undergoes thorough inspection and comes with our quality assurance.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Award className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-foreground">Expert Service</div>
                  <div className="text-sm text-muted-foreground">
                    Professional guidance from purchase to paperwork completion.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-foreground">Customer First</div>
                  <div className="text-sm text-muted-foreground">
                    Transparent deals and honest communication throughout your journey.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
            <div className="text-sm font-medium text-primary">✓ Verified Business</div>
            <div className="text-xs text-muted-foreground mt-1">
              Licensed motorcycle dealer with {platformStats.yearsInBusiness} years of trusted service
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}