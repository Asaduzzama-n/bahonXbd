"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import { Bike, ShoppingCart, DollarSign, Package } from "lucide-react"
import { PlatformStats } from "@/lib/models"

export default function AdminDashboard() {
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [loading, setLoading] = useState(true)

  // Year-based revenue chart data
  const currentYear = useMemo(() => new Date().getFullYear(), [])
  const [selectedYear, setSelectedYear] = useState<number>(currentYear)
  const [revenueMonths, setRevenueMonths] = useState<
    { month: string; orders: number; revenue: number; adminProfit: number }[]
  >([])
  const [revenueLoading, setRevenueLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  useEffect(() => {
    fetchRevenueData(selectedYear)
  }, [selectedYear])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRevenueData = async (year: number) => {
    setRevenueLoading(true)
    try {
      const response = await fetch(`/api/admin/revenue?year=${year}`)
      if (response.ok) {
        const json = await response.json()
        const data = json?.data ?? json
        setRevenueMonths(data.months || [])
      }
    } catch (error) {
      console.error("Failed to fetch revenue data:", error)
    } finally {
      setRevenueLoading(false)
    }
  }



  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here’s your current platform overview.</p>
        </div>

      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bikes</CardTitle>
            <Bike className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalBikes || 0}</div>
            <p className="text-xs text-muted-foreground">Real-time total bike listings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{(stats?.totalRevenue || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Confirmed orders revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sells</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.confirmedOrders || 0}</div>
            <p className="text-xs text-muted-foreground">Confirmed purchase orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining Bikes</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.availableBikes || 0}</div>
            <p className="text-xs text-muted-foreground">Available for sale</p>
          </CardContent>
        </Card>
      </div>

      {/* Full-width Revenue Chart with Year Filter */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>Orders, revenue, and admin profit for {selectedYear}</CardDescription>
          </div>
          <div data-slot="card-action">
            <Select value={String(selectedYear)} onValueChange={(val) => setSelectedYear(parseInt(val, 10))}>
              <SelectTrigger aria-label="Select year">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[360px]">
            {revenueLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueMonths}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      if (name === "revenue" || name === "adminProfit") return [`৳${value.toLocaleString()}`, name === "revenue" ? "Revenue" : "Admin Profit"]
                      return [value, "Orders"]
                    }}
                  />
                  <Area type="monotone" dataKey="orders" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} />
                  <Area type="monotone" dataKey="revenue" stroke="#FF6600" fill="#FF6600" fillOpacity={0.25} />
                  <Area type="monotone" dataKey="adminProfit" stroke="#16a34a" fill="#16a34a" fillOpacity={0.25} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>


    </div>
  )
}