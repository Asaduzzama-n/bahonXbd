export interface User {
  _id?: string
  name: string
  email: string
  password: string
  phone?: string
  profile?: string
  role: 'user' | 'admin'
  isEmailVerified: boolean
  verificationCode?: string
  verificationExpiry?: Date
  resetPasswordToken?: string
  resetPasswordExpiry?: Date
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Bike {
  _id?: string
  title: string
  description: string
  brand: string
  model: string
  year: number
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  mileage: number
  price: number
  myShare: number
  partners: {
    partnerId: Partner | string
    percentage: number
  }[]
  images: string[]
  features: string[]
  availableDocs: string[]
  specifications: {
    engine?: string
    transmission?: string
    fuelType?: string
    displacement?: string
    maxPower?: string
    maxTorque?: string
    topSpeed?: string
    fuelTank?: string
    weight?: string
    [key: string]: string | undefined
  }
  serviceHistory: {
    date: string
    description: string
    cost: number
  }[]
  status: 'active' | 'sold' | 'pending' | 'inactive' | 'available'
  isFeatured: boolean
  views: number
  createdAt: Date
  updatedAt: Date
}

export interface PurchaseOrder {
  _id?: string
  bikeId: Bike | string
  buyerName: string
  buyerPhone: string
  buyerEmail?: string
  buyerAddress?: string
  buyerDocs: {
    nid: string
    drivingLicense: string
    proofOfAddress?: string
  }
  amount: number
  profit: number
  partnersProfit: {
    partnerId: Partner | string
    profit: number
  }[]
  status: 'pending' | 'confirmed' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'partial' | 'failed' | 'refunded'
  paymentMethod: 'Bkash' | 'Cash' | 'Bank Transfer'
  dueAmount?: number
  dueDate?: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface BikeWashLocation {
  _id?: string
  location: string
  map: string
  price: number
  features: string[]
  status: 'active' | 'inactive'
  createdAt: Date
  updatedAt: Date
}


export interface Expenses {
  _id?: string
  bikeId?: string
  partnerId?: Partner | string
  type: 'repair' | 'maintenance' | 'transportation' | 'other'
  amount: number
  date: Date
  createdAt: Date
  updatedAt: Date
}


export interface Partner {
  _id?: string
   name: string
   phone: string
   email: string
   address: string
   documents: {
    nid: string
    drivingLicense: string
    proofOfAddress?: string
   }
   profile?: string
   isActive: boolean
   createdAt: Date
   updatedAt: Date
}


export interface PublicInfo {
  phone: string[]
  email: string
  availableTimes: string[]
  location: string
  map: string

}


export interface PlatformStats {
  totalUsers: number
  activeUsers: number
  totalBikes: number
  availableBikes: number
  soldBikes: number
  pendingBikes: number
  inactiveBikes: number
  totalOrders: number
  confirmedOrders: number
  cancelledOrders: number
  totalProfit: number
  totalExpenses: number
  totalPayments: number
  totalRefunds: number
  totalRevenue: number
  pendingOrders: number
}