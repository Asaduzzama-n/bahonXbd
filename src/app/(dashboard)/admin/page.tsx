"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from "recharts"
import {
  Bike,
  Users,
  ShoppingCart,

  Plus,
  Eye,

  DollarSign,

  UserCheck,
  Calendar,

} from "lucide-react"
import { PlatformStats } from "@/lib/models"

// Sample data for charts
const monthlyRevenue = [
  { month: "Jan", revenue: 45000, orders: 23 },
  { month: "Feb", revenue: 52000, orders: 28 },
  { month: "Mar", revenue: 48000, orders: 25 },
  { month: "Apr", revenue: 61000, orders: 32 },
  { month: "May", revenue: 55000, orders: 29 },
  { month: "Jun", revenue: 67000, orders: 35 }
]

const bikesByBrand = [
  { name: "Yamaha", value: 35, color: "#FF6600" },
  { name: "Honda", value: 28, color: "#8b5cf6" },
  { name: "Suzuki", value: 20, color: "#06b6d4" },
  { name: "KTM", value: 12, color: "#f59e0b" },
  { name: "Others", value: 5, color: "#6b7280" }
]

const recentActivity = [
  { id: 1, type: "order", message: "New order for Yamaha R15 V4", time: "2 minutes ago", status: "pending" },
  { id: 2, type: "bike", message: "Honda CBR 150R listing approved", time: "15 minutes ago", status: "approved" },
  { id: 3, type: "user", message: "New user registration: Ahmed Rahman", time: "1 hour ago", status: "new" },
  { id: 4, type: "wash", message: "Bike wash booking confirmed", time: "2 hours ago", status: "confirmed" },
  { id: 5, type: "order", message: "Order completed: Suzuki Gixxer SF", time: "3 hours ago", status: "completed" }
]

export default function AdminDashboard() {
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    {
      title: "Add New Bike",
      description: "List a new bike for sale",
      icon: Plus,
      href: "/admin/bikes/new",
      color: "bg-blue-500"
    },
    {
      title: "View Orders",
      description: "Manage pending orders",
      icon: Eye,
      href: "/admin/orders",
      color: "bg-green-500"
    },
    {
      title: "User Management",
      description: "Manage user accounts",
      icon: UserCheck,
      href: "/admin/users",
      color: "bg-purple-500"
    },
    {
      title: "Analytics",
      description: "View detailed reports",
      icon: BarChart,
      href: "/admin/analytics",
      color: "bg-orange-500"
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your platform.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Quick Add
          </Button>
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
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳{(stats?.totalRevenue || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingOrders || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-orange-600">+3</span> new today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>Revenue and order trends over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'revenue' ? `৳${value.toLocaleString()}` : value,
                    name === 'revenue' ? 'Revenue' : 'Orders'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#FF6600" 
                  fill="#FF6600" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bikes by Brand */}
        <Card>
          <CardHeader>
            <CardTitle>Bikes by Brand</CardTitle>
            <CardDescription>Distribution of bikes by manufacturer</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bikesByBrand}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {bikesByBrand.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {bikesByBrand.map((brand) => (
                <div key={brand.name} className="flex items-center space-x-2">
                  <div 
                    className="h-3 w-3 rounded-full" 
                    style={{ backgroundColor: brand.color }}
                  />
                  <span className="text-sm">{brand.name}</span>
                  <span className="text-sm text-muted-foreground">{brand.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Quick Actions */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => (
              <Button
                key={action.title}
                variant="outline"
                className="w-full justify-start h-auto p-4"
                asChild
              >
                <a href={action.href}>
                  <div className={`mr-3 rounded-lg p-2 ${action.color}`}>
                    <action.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                </a>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform activities and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {activity.type === 'order' && (
                      <ShoppingCart className="h-5 w-5 text-blue-500" />
                    )}
                    {activity.type === 'bike' && (
                      <Bike className="h-5 w-5 text-green-500" />
                    )}
                    {activity.type === 'user' && (
                      <Users className="h-5 w-5 text-purple-500" />
                    )}
                    {activity.type === 'wash' && (
                      <Calendar className="h-5 w-5 text-orange-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <Badge 
                      variant={
                        activity.status === 'completed' ? 'default' :
                        activity.status === 'pending' ? 'secondary' :
                        activity.status === 'approved' ? 'default' : 'outline'
                      }
                    >
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}