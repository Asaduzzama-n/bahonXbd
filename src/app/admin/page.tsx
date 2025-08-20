'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  Bike,
  CheckCircle,
  AlertCircle,
  Upload,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'
import { Bike as BikeType, Order, PlatformStats } from '@/lib/models'
import Image from 'next/image'

// Mock data for admin dashboard
const mockStats: PlatformStats = {
  totalBikes: 156,
  activeBikes: 89,
  soldBikes: 67,
  totalRevenue: 12500000,
  monthlyRevenue: 2100000,
  totalOrders: 67,
  pendingOrders: 5,
  completedOrders: 62,
  totalUsers: 1250,
  activeUsers: 890,
  averagePrice: 186567,
  topSellingBrand: 'Yamaha'
}

const mockBikes: BikeType[] = [
  {
    _id: '1',
    title: 'Yamaha R15 V4',
    brand: 'Yamaha',
    model: 'R15 V4',
    year: 2023,
    price: 285000,
    mileage: 2500,
    condition: 'excellent',
    engineCapacity: 155,
    fuelType: 'petrol',
    transmission: 'manual',
    color: 'Racing Blue',
    location: 'Dhaka',
    description: 'Well-maintained Yamaha R15 V4',
    images: ['/api/placeholder/400/300'],
    features: ['ABS', 'LED Headlight'],
    isVerified: true,
    isFeatured: true,
    status: 'available',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    _id: '2',
    title: 'Honda CB Shine SP',
    brand: 'Honda',
    model: 'CB Shine SP',
    year: 2022,
    price: 95000,
    mileage: 8500,
    condition: 'good',
    engineCapacity: 125,
    fuelType: 'petrol',
    transmission: 'manual',
    color: 'Black',
    location: 'Chittagong',
    description: 'Reliable Honda CB Shine SP',
    images: ['/api/placeholder/400/300'],
    features: ['Electric Start'],
    isVerified: false,
    isFeatured: false,
    status: 'available',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  }
]

const mockOrders: Order[] = [
  {
    _id: '1',
    bikeId: '1',
    buyerName: 'John Doe',
    buyerEmail: 'john@example.com',
    buyerPhone: '+880 1712-345678',
    status: 'completed',
    totalAmount: 285000,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-22')
  },
  {
    _id: '2',
    bikeId: '2',
    buyerName: 'Jane Smith',
    buyerEmail: 'jane@example.com',
    buyerPhone: '+880 1812-345678',
    status: 'pending',
    totalAmount: 95000,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25')
  }
]

const mockRevenueData = [
  { month: 'Jan', revenue: 1800000 },
  { month: 'Feb', revenue: 2100000 },
  { month: 'Mar', revenue: 1950000 },
  { month: 'Apr', revenue: 2300000 },
  { month: 'May', revenue: 2100000 },
  { month: 'Jun', revenue: 2500000 }
]

export default function AdminDashboard() {
  const [stats, setStats] = useState<PlatformStats>(mockStats)
  const [bikes, setBikes] = useState<BikeType[]>(mockBikes)
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [isAddBikeOpen, setIsAddBikeOpen] = useState(false)
  const [selectedBike, setSelectedBike] = useState<BikeType | null>(null)

  // Bike Wash Financial Management State
  const [bikeWashStats, setBikeWashStats] = useState({
    dailyEarnings: 0,
    washesCompleted: 0,
    totalMonthlyEarnings: 45000,
    totalMonthlyWashes: 180,
    averagePerWash: 250
  })
  const [newEarnings, setNewEarnings] = useState({ earnings: '', washes: '' })
  const [washHistory, setWashHistory] = useState([
    { date: '2024-01-25', earnings: 1200, washes: 5 },
    { date: '2024-01-24', earnings: 800, washes: 3 },
    { date: '2024-01-23', earnings: 1500, washes: 6 },
    { date: '2024-01-22', earnings: 900, washes: 4 },
    { date: '2024-01-21', earnings: 1100, washes: 4 }
  ])
  const [newBike, setNewBike] = useState<Partial<BikeType>>({
    title: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    condition: 'good',
    engineCapacity: 0,
    fuelType: 'petrol',
    transmission: 'manual',
    color: '',
    location: '',
    description: '',
    features: [],
    isVerified: false,
    isFeatured: false,
    status: 'available'
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'sold': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const handleAddBike = () => {
    const bike: BikeType = {
      ...newBike,
      _id: Date.now().toString(),
      images: ['/api/placeholder/400/300'],
      createdAt: new Date(),
      updatedAt: new Date()
    } as BikeType

    setBikes([...bikes, bike])
    setIsAddBikeOpen(false)
    setNewBike({
      title: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      condition: 'good',
      engineCapacity: 0,
      fuelType: 'petrol',
      transmission: 'manual',
      color: '',
      location: '',
      description: '',
      features: [],
      isVerified: false,
      isFeatured: false,
      status: 'available'
    })
  }

  const handleDeleteBike = (bikeId: string) => {
    setBikes(bikes.filter(bike => bike._id !== bikeId))
  }

  const handleVerifyBike = (bikeId: string) => {
    setBikes(bikes.map(bike =>
      bike._id === bikeId ? { ...bike, isVerified: !bike.isVerified } : bike
    ))
  }

  const handleFeatureBike = (bikeId: string) => {
    setBikes(bikes.map(bike =>
      bike._id === bikeId ? { ...bike, isFeatured: !bike.isFeatured } : bike
    ))
  }

  const handleUpdateOrderStatus = (orderId: string, status: string) => {
    setOrders(orders.map(order =>
      order._id === orderId ? { ...order, status, updatedAt: new Date() } : order
    ))
  }

  const handleAddDailyWashData = () => {
    if (!newEarnings.earnings || !newEarnings.washes) return

    const earnings = parseInt(newEarnings.earnings)
    const washes = parseInt(newEarnings.washes)
    const today = new Date().toISOString().split('T')[0]

    // Update daily stats
    setBikeWashStats(prev => ({
      ...prev,
      dailyEarnings: earnings,
      washesCompleted: washes,
      totalMonthlyEarnings: prev.totalMonthlyEarnings + earnings,
      totalMonthlyWashes: prev.totalMonthlyWashes + washes,
      averagePerWash: Math.round((prev.totalMonthlyEarnings + earnings) / (prev.totalMonthlyWashes + washes))
    }))

    // Add to history
    setWashHistory(prev => [
      { date: today, earnings, washes },
      ...prev.slice(0, 9) // Keep only last 10 entries
    ])

    // Reset form
    setNewEarnings({ earnings: '', washes: '' })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Manage your bike platform and track performance
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bikes">Bikes</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="bike-wash">Bike Wash</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12.5% from last month
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Bikes</CardTitle>
                  <Bike className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalBikes}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.activeBikes} active, {stats.soldBikes} sold
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.pendingOrders} pending, {stats.completedOrders} completed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    of {stats.totalUsers} total users
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order._id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{order.buyerName}</div>
                          <div className="text-sm text-muted-foreground">{order.buyerEmail}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatPrice(order.totalAmount)}</div>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {mockRevenueData.map((data, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{data.month}</span>
                        <span className="font-semibold">{formatPrice(data.revenue)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bikes Management Tab */}
          <TabsContent value="bikes" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Bike Management</h2>
              <Dialog open={isAddBikeOpen} onOpenChange={setIsAddBikeOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Bike
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Bike</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newBike.title}
                        onChange={(e) => setNewBike({ ...newBike, title: e.target.value })}
                        placeholder="Bike title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="brand">Brand</Label>
                      <Select value={newBike.brand} onValueChange={(value) => setNewBike({ ...newBike, brand: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yamaha">Yamaha</SelectItem>
                          <SelectItem value="Honda">Honda</SelectItem>
                          <SelectItem value="Suzuki">Suzuki</SelectItem>
                          <SelectItem value="TVS">TVS</SelectItem>
                          <SelectItem value="Hero">Hero</SelectItem>
                          <SelectItem value="Bajaj">Bajaj</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="model">Model</Label>
                      <Input
                        id="model"
                        value={newBike.model}
                        onChange={(e) => setNewBike({ ...newBike, model: e.target.value })}
                        placeholder="Bike model"
                      />
                    </div>
                    <div>
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        type="number"
                        value={newBike.year}
                        onChange={(e) => setNewBike({ ...newBike, year: parseInt(e.target.value) })}
                        placeholder="Manufacturing year"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Price (BDT)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newBike.price}
                        onChange={(e) => setNewBike({ ...newBike, price: parseInt(e.target.value) })}
                        placeholder="Price in BDT"
                      />
                    </div>
                    <div>
                      <Label htmlFor="mileage">Mileage (km)</Label>
                      <Input
                        id="mileage"
                        type="number"
                        value={newBike.mileage}
                        onChange={(e) => setNewBike({ ...newBike, mileage: parseInt(e.target.value) })}
                        placeholder="Mileage in kilometers"
                      />
                    </div>
                    <div>
                      <Label htmlFor="condition">Condition</Label>
                      <Select value={newBike.condition} onValueChange={(value) => setNewBike({ ...newBike, condition: value as any })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">Excellent</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="engineCapacity">Engine Capacity (cc)</Label>
                      <Input
                        id="engineCapacity"
                        type="number"
                        value={newBike.engineCapacity}
                        onChange={(e) => setNewBike({ ...newBike, engineCapacity: parseInt(e.target.value) })}
                        placeholder="Engine capacity"
                      />
                    </div>
                    <div>
                      <Label htmlFor="color">Color</Label>
                      <Input
                        id="color"
                        value={newBike.color}
                        onChange={(e) => setNewBike({ ...newBike, color: e.target.value })}
                        placeholder="Bike color"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={newBike.location}
                        onChange={(e) => setNewBike({ ...newBike, location: e.target.value })}
                        placeholder="Location"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newBike.description}
                        onChange={(e) => setNewBike({ ...newBike, description: e.target.value })}
                        placeholder="Bike description"
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setIsAddBikeOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddBike}>Add Bike</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Bikes Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="p-4">Bike</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Verification</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bikes.map((bike) => (
                        <tr key={bike._id} className="border-b hover:bg-muted/50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Image
                                src={bike.images[0]}
                                alt={bike.title}
                                width={60}
                                height={45}
                                className="rounded object-cover"
                              />
                              <div>
                                <div className="font-medium">{bike.title}</div>
                                <div className="text-sm text-muted-foreground">
                                  {bike.year} • {bike.mileage.toLocaleString()} km
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 font-semibold">{formatPrice(bike.price)}</td>
                          <td className="p-4">
                            <Badge className={getStatusColor(bike.status)}>
                              {bike.status.charAt(0).toUpperCase() + bike.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {bike.isVerified ? (
                                <Badge className="bg-green-100 text-green-800">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              ) : (
                                <Badge variant="outline">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Pending
                                </Badge>
                              )}
                              {bike.isFeatured && (
                                <Badge className="bg-yellow-100 text-yellow-800">
                                  Featured
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleVerifyBike(bike._id)}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleFeatureBike(bike._id)}
                              >
                                ⭐
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteBike(bike._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <h2 className="text-2xl font-bold">Order Management</h2>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Buyer</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id} className="border-b hover:bg-muted/50">
                          <td className="p-4 font-mono text-sm">#{order._id}</td>
                          <td className="p-4">
                            <div>
                              <div className="font-medium">{order.buyerName}</div>
                              <div className="text-sm text-muted-foreground">{order.buyerEmail}</div>
                            </div>
                          </td>
                          <td className="p-4 font-semibold">{formatPrice(order.totalAmount)}</td>
                          <td className="p-4">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {order.createdAt.toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Select
                                value={order.status}
                                onValueChange={(value) => handleUpdateOrderStatus(order._id, value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bike Wash Financial Management Tab */}
          <TabsContent value="bike-wash" className="space-y-6">
            <h2 className="text-2xl font-bold">Bike Wash Financial Management</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatPrice(bikeWashStats.dailyEarnings)}</div>
                  <p className="text-xs text-muted-foreground">
                    {bikeWashStats.washesCompleted} washes completed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatPrice(bikeWashStats.totalMonthlyEarnings)}</div>
                  <p className="text-xs text-muted-foreground">
                    {bikeWashStats.totalMonthlyWashes} total washes
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average per Wash</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatPrice(bikeWashStats.averagePerWash)}</div>
                  <p className="text-xs text-muted-foreground">
                    Based on monthly data
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Daily Target</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatPrice(1500)}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className={bikeWashStats.dailyEarnings >= 1500 ? "text-green-600" : "text-orange-600"}>
                      {bikeWashStats.dailyEarnings >= 1500 ? "Target achieved!" : `${formatPrice(1500 - bikeWashStats.dailyEarnings)} remaining`}
                    </span>
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Add Daily Data Form */}
            <Card>
              <CardHeader>
                <CardTitle>Update Today's Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <Label htmlFor="earnings">Daily Earnings (BDT)</Label>
                    <Input
                      id="earnings"
                      type="number"
                      placeholder="Enter today's earnings"
                      value={newEarnings.earnings}
                      onChange={(e) => setNewEarnings(prev => ({ ...prev, earnings: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="washes">Number of Washes</Label>
                    <Input
                      id="washes"
                      type="number"
                      placeholder="Enter number of washes"
                      value={newEarnings.washes}
                      onChange={(e) => setNewEarnings(prev => ({ ...prev, washes: e.target.value }))}
                    />
                  </div>
                  <Button onClick={handleAddDailyWashData} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Update Data
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent History */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Daily Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {washHistory.map((day, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{new Date(day.date).toLocaleDateString()}</div>
                          <div className="text-sm text-muted-foreground">{day.washes} washes</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatPrice(day.earnings)}</div>
                          <div className="text-sm text-muted-foreground">
                            Avg: {formatPrice(Math.round(day.earnings / day.washes))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span>Total Earnings</span>
                      <span className="font-bold text-lg">{formatPrice(bikeWashStats.totalMonthlyEarnings)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span>Total Washes</span>
                      <span className="font-bold text-lg">{bikeWashStats.totalMonthlyWashes}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span>Average per Wash</span>
                      <span className="font-bold text-lg">{formatPrice(bikeWashStats.averagePerWash)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span>Days Active</span>
                      <span className="font-bold text-lg">{washHistory.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics & Reports</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Revenue Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockRevenueData.map((data, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span>{data.month}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${(data.revenue / 2500000) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{formatPrice(data.revenue)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Top Performing Brands
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Yamaha</span>
                      <span className="font-semibold">35%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Honda</span>
                      <span className="font-semibold">28%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Suzuki</span>
                      <span className="font-semibold">18%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Others</span>
                      <span className="font-semibold">19%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold">Platform Settings</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="platformName">Platform Name</Label>
                    <Input id="platformName" defaultValue="BahonXBD" />
                  </div>
                  <div>
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input id="contactEmail" defaultValue="admin@bahonxbd.com" />
                  </div>
                  <div>
                    <Label htmlFor="supportPhone">Support Phone</Label>
                    <Input id="supportPhone" defaultValue="+880 1700-000000" />
                  </div>
                  <Button>Save Settings</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Email Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input id="smtpHost" placeholder="smtp.gmail.com" />
                  </div>
                  <div>
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input id="smtpPort" placeholder="587" />
                  </div>
                  <div>
                    <Label htmlFor="smtpUser">SMTP Username</Label>
                    <Input id="smtpUser" placeholder="your-email@gmail.com" />
                  </div>
                  <Button>Update Email Settings</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}