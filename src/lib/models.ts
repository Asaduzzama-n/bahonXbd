export interface Bike {
  _id: string
  title: string
  brand: string
  model: string
  year: number
  price: number
  mileage: number
  condition: 'excellent' | 'good' | 'fair'
  engineCapacity: number
  fuelType: 'petrol' | 'diesel' | 'electric'
  transmission: 'manual' | 'automatic'
  color: string
  location: string
  description: string
  images: string[]
  features: string[]
  isVerified: boolean
  isFeatured: boolean
  status: 'available' | 'sold' | 'pending'
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  _id: string
  bikeId: string
  buyerName: string
  buyerEmail: string
  buyerPhone: string
  status: 'pending' | 'completed' | 'cancelled'
  totalAmount: number
  createdAt: Date
  updatedAt: Date
}

export interface PlatformStats {
  totalBikes: number
  activeBikes: number
  soldBikes: number
  totalRevenue: number
  monthlyRevenue: number
  totalOrders: number
  pendingOrders: number
  completedOrders: number
  totalUsers: number
  activeUsers: number
  averagePrice: number
  topSellingBrand: string
}

export interface User {
  _id: string
  name: string
  email: string
  phone?: string
  role: 'user' | 'admin'
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface BikeWashBooking {
  _id: string
  customerName: string
  customerPhone: string
  bikeModel: string
  serviceType: string
  preferredDate: Date
  preferredTime: string
  specialInstructions?: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  totalAmount: number
  createdAt: Date
  updatedAt: Date
}