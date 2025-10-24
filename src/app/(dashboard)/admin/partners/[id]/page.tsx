"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  Bike,
  DollarSign,
  BarChart3,
  Edit,
  FileText
} from "lucide-react"
import { Partner } from "@/lib/models"
import { format } from "date-fns"
import { toast } from "sonner"
import Image from "next/image"

interface PartnerAnalytics {
  partner: {
    id: string
    name: string
    phone: string
    email: string
    isActive: boolean
  }
  summary: {
    totalBikes: number
    soldBikes: number
    activeBikes: number
    totalEarnings: number
    totalInvestment: number
    averageSharePercentage: number
    averageEarningsPerBike: number
    profitMargin: number
  }
  monthlyEarnings: Array<{
    month: string
    earnings: number
    bikesSold: number
  }>
  brandAnalytics: Array<{
    brand: string
    totalBikes: number
    soldBikes: number
    activeBikes: number
    totalEarnings: number
    totalInvestment: number
  }>
  bikeAnalytics: Array<{
    bikeId: string
    title: string
    brand: string
    model: string
    year: number
    price: number
    status: string
    sharePercentage: number
    shareAmount: number
    earnings: number
    createdAt: string
    updatedAt: string
  }>
}

export default function PartnerDetails() {
  const params = useParams()
  const router = useRouter()
  const [partner, setPartner] = useState<Partner | null>(null)
  const [analytics, setAnalytics] = useState<PartnerAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)

  const partnerId = params.id as string

  useEffect(() => {
    if (partnerId) {
      fetchPartner()
      fetchAnalytics()
    }
  }, [partnerId])

  const fetchPartner = async () => {
    try {
      const response = await fetch(`/api/admin/partners/${partnerId}`)
      if (response.ok) {
        const data = await response.json()
        setPartner(data.data)
      } else {
        toast.error('Failed to fetch partner details')
        router.push('/admin/partners')
      }
    } catch (error) {
      console.error('Failed to fetch partner:', error)
      toast.error('Failed to fetch partner details')
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/partners/${partnerId}/analytics`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data.data)
      } else {
        console.error('Failed to fetch analytics')
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setAnalyticsLoading(false)
    }
  }

  const handleToggleActive = async () => {
    if (!partner) return

    try {
      const response = await fetch(`/api/admin/partners/${partnerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isActive: !partner.isActive
        })
      })

      if (response.ok) {
        const data = await response.json()
        setPartner({ ...partner, isActive: data.data.isActive })
        toast.success(`Partner ${data.data.isActive ? 'activated' : 'deactivated'} successfully`)
      } else {
        toast.error('Failed to update partner status')
      }
    } catch (error) {
      console.error('Failed to toggle partner status:', error)
      toast.error('Failed to update partner status')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!partner) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <h2 className="text-2xl font-bold">Partner Not Found</h2>
        <Button onClick={() => router.push('/admin/partners')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Partners
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/admin/partners')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{partner.name}</h1>
            <p className="text-muted-foreground">Partner Details & Analytics</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/partners/${partnerId}/analytics`)}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Full Analytics
          </Button>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Partner
          </Button>
        </div>
      </div>

      {/* Partner Information */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Partner Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status</span>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={partner.isActive}
                  onCheckedChange={handleToggleActive}
                  // size="sm"
                />
                <Badge variant={partner.isActive ? "default" : "secondary"}>
                  {partner.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono text-sm">{partner.phone}</span>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{partner.email}</span>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="text-sm">
                  <div>{partner.address}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Joined {format(new Date(partner.createdAt), "MMMM dd, yyyy")}
                </span>
              </div>
            </div>

            {partner.profile && (
              <>
                <Separator />
                <Image
                  src={partner.profile}
                  alt={partner.name}
                  className="w-16 h-16 rounded-full"
                />
              </>
            )}
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent>
            {partner.documents ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">National ID</span>
                  <Badge variant={partner.documents.nid ? "default" : "outline"}>
                    {partner.documents.nid ? "Provided" : "Missing"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Driving License</span>
                  <Badge variant={partner.documents.drivingLicense ? "default" : "outline"}>
                    {partner.documents.drivingLicense ? "Provided" : "Missing"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Proof of Address</span>
                  <Badge variant={partner.documents.proofOfAddress ? "default" : "outline"}>
                    {partner.documents.proofOfAddress ? "Provided" : "Missing"}
                  </Badge>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No documents uploaded</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Analytics Summary */}
      {analyticsLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </CardContent>
        </Card>
      ) : analytics ? (
        <>
          {/* Summary Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bikes</CardTitle>
                <Bike className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.summary.totalBikes}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.summary.activeBikes} active, {analytics.summary.soldBikes} sold
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">৳{analytics.summary.totalEarnings.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  From {analytics.summary.soldBikes} sold bikes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Investment</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">৳{analytics.summary.totalInvestment.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Avg. {analytics.summary.averageSharePercentage.toFixed(1)}% share
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {analytics.summary.profitMargin.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  ৳{analytics.summary.averageEarningsPerBike.toLocaleString()} avg/bike
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Bikes */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Bike Partnerships</CardTitle>
              <CardDescription>
                Latest bikes where this partner has a share
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.bikeAnalytics.slice(0, 5).map((bike) => (
                  <div key={bike.bikeId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{bike.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {bike.brand} {bike.model} ({bike.year})
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-sm font-medium">
                        {bike.sharePercentage}% share
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ৳{bike.shareAmount.toLocaleString()}
                      </div>
                      <Badge variant={
                        bike.status === 'sold' ? 'default' : 
                        bike.status === 'active' ? 'secondary' : 'outline'
                      }>
                        {bike.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {analytics.bikeAnalytics.length > 5 && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => router.push(`/admin/partners/${partnerId}/analytics`)}
                  >
                    View All {analytics.bikeAnalytics.length} Bikes
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">No analytics data available</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}