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
  purchasePrice: number
  purchaseDate: Date
  myShare: number
  partners: {
    partnerId: Partner | string
    percentage: number
  }[]
  images: string[]
  features: string[]
  sellerInfo: {
    name: string
    phone: string
    email?: string
    address?: string
  }
  sellerAvailableDocs: {
    nid: string
    drivingLicense: string
    proofOfAddress?: string
  }
  bikeAvailableDocs: {
    taxToken: string
    registration: string
    insurance?: string
    fitnessReport?: string
  }
  serviceHistory: (Expense | string)[]
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
    sharePercentage: number
  }[]
  status: 'pending' | 'confirmed' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'partial' | 'failed'
  paymentMethod: 'Bkash' | 'Cash' | 'Bank Transfer'
  dueAmount?: number
  dueDate?: Date
  duePaymentReceivingDate?: Date
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
  createdAt?: Date
  updatedAt?: Date
}


export interface Expense {
  _id?: string
  bikeId: Bike | string
  title: string
  description: string
  type: 'repair' | 'maintenance' | 'transportation' | 'fuel' | 'insurance' | 'registration' | 'other'
  amount: number
  date: Date
  adjustBikePrice: boolean
  adjustPartnerShares: boolean
  partnerId?: Partner | string // Only if adjustPartnerShares is true and partner is selected
  receiptImage?: string
  notes?: string
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