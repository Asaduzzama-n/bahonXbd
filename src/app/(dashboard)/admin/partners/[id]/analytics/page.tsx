"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  TrendingUp, 
  Bike,
  DollarSign,
  BarChart3,
  Calendar,
  Target,
  PieChart
} from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

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

export default function PartnerAnalytics() {
  const params = useParams()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<PartnerAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  const partnerId = params.id as string

  useEffect(() => {
    if (partnerId) {
      fetchAnalytics()
    }
  }, [partnerId])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/partners/${partnerId}/analytics`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data.data)
      } else {
        toast.error('Failed to fetch analytics')
        router.push('/admin/partners')
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      toast.error('Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <h2 className="text-2xl font-bold">Analytics Not Available</h2>
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
            onClick={() => router.push(`/admin/partners/${partnerId}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {analytics.partner.name} - Analytics
            </h1>
            <p className="text-muted-foreground">
              Comprehensive earnings and performance analysis
            </p>
          </div>
        </div>
      </div>

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
            <div className="text-2xl font-bold text-green-600">
              ৳{analytics.summary.totalEarnings.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              From {analytics.summary.soldBikes} sold bikes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳{analytics.summary.totalInvestment.toLocaleString()}
            </div>
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

      {/* Detailed Analytics */}
      <Tabs defaultValue="monthly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="monthly">Monthly Earnings</TabsTrigger>
          <TabsTrigger value="brands">Brand Analysis</TabsTrigger>
          <TabsTrigger value="bikes">Bike Details</TabsTrigger>
        </TabsList>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Monthly Earnings Trend
              </CardTitle>
              <CardDescription>
                Earnings breakdown over the last 12 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.monthlyEarnings.map((month) => (
                  <div key={month.month} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">
                        {format(new Date(month.month + '-01'), 'MMMM yyyy')}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {month.bikesSold} bikes sold
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        ৳{month.earnings.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="brands" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="mr-2 h-5 w-5" />
                Brand-wise Performance
              </CardTitle>
              <CardDescription>
                Earnings and investment breakdown by bike brands
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.brandAnalytics.map((brand) => {
                  const profitMargin = brand.totalInvestment > 0 
                    ? ((brand.totalEarnings / brand.totalInvestment) * 100) 
                    : 0

                  return (
                    <div key={brand.brand} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-lg">{brand.brand}</h4>
                        <Badge variant="outline">
                          {brand.totalBikes} bikes
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Total Bikes</div>
                          <div className="font-medium">{brand.totalBikes}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Sold</div>
                          <div className="font-medium text-green-600">{brand.soldBikes}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Earnings</div>
                          <div className="font-medium">৳{brand.totalEarnings.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Profit Margin</div>
                          <div className="font-medium text-green-600">{profitMargin.toFixed(1)}%</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bikes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5" />
                Individual Bike Performance
              </CardTitle>
              <CardDescription>
                Detailed breakdown of each bike partnership
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.bikeAnalytics.map((bike) => (
                  <div key={bike.bikeId} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium">{bike.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {bike.brand} {bike.model} ({bike.year})
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Added {format(new Date(bike.createdAt), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={
                          bike.status === 'sold' ? 'default' : 
                          bike.status === 'active' ? 'secondary' : 'outline'
                        }>
                          {bike.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Bike Price</div>
                        <div className="font-medium">৳{bike.price.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Share %</div>
                        <div className="font-medium">{bike.sharePercentage}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Investment</div>
                        <div className="font-medium">৳{bike.shareAmount.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Earnings</div>
                        <div className={`font-medium ${bike.earnings > 0 ? 'text-green-600' : 'text-muted-foreground'}`}>
                          {bike.earnings > 0 ? `৳${bike.earnings.toLocaleString()}` : 'Pending'}
                        </div>
                      </div>
                    </div>

                    {bike.status === 'sold' && bike.earnings > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Profit: </span>
                          <span className="font-medium text-green-600">
                            ৳{(bike.earnings - bike.shareAmount).toLocaleString()} 
                            ({(((bike.earnings - bike.shareAmount) / bike.shareAmount) * 100).toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}