import { MongoClient, Db } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bike-platform'

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

interface GlobalMongo {
  conn: MongoClient | null
  promise: Promise<MongoClient> | null
}

declare global {
  var __mongo: GlobalMongo | undefined
}

let cached = global.__mongo

if (!cached) {
  cached = global.__mongo = { conn: null, promise: null }
}

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cached!.conn) {
    return { client: cached!.conn, db: cached!.conn.db() }
  }

  if (!cached!.promise) {
    const opts = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }

    cached!.promise = MongoClient.connect(MONGODB_URI, opts)
  }

  try {
    cached!.conn = await cached!.promise
  } catch (e) {
    cached!.promise = null
    throw e
  }

  return { client: cached!.conn, db: cached!.conn.db() }
}

// Database schemas and types
export interface User {
  _id?: string
  name: string
  email: string
  password: string
  phone?: string
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
  location: string
  images: string[]
  features: string[]
  specifications: {
    engine: string
    transmission: string
    fuelType: string
    displacement: string
    maxPower: string
    maxTorque: string
    topSpeed: string
    fuelTank: string
    weight: string
    [key: string]: string
  }
  serviceHistory: {
    date: string
    description: string
    cost: number
  }[]
  sellerId: string
  sellerName: string
  sellerPhone: string
  sellerEmail: string
  status: 'active' | 'sold' | 'pending' | 'inactive'
  isVerified: boolean
  isFeatured: boolean
  isActive: boolean
  views: number
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  _id?: string
  bikeId: string
  buyerId: string
  sellerId: string
  amount: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentMethod: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface BikeWashBooking {
  _id?: string
  userId: string
  userName: string
  userPhone: string
  userEmail: string
  serviceType: string
  location: string
  scheduledDate: Date
  scheduledTime: string
  bikeDetails: {
    brand: string
    model: string
    year: number
  }
  price: number
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  BIKES: 'bikes',
  ORDERS: 'orders',
  BIKE_WASH_BOOKINGS: 'bikeWashBookings',
} as const

// Database utilities
export class DatabaseUtils {
  static async createIndexes() {
    const { db } = await connectToDatabase()

    // Users collection indexes
    await db.collection(COLLECTIONS.USERS).createIndex({ email: 1 }, { unique: true })
    await db.collection(COLLECTIONS.USERS).createIndex({ verificationCode: 1 })
    await db.collection(COLLECTIONS.USERS).createIndex({ resetPasswordToken: 1 })

    // Bikes collection indexes
    await db.collection(COLLECTIONS.BIKES).createIndex({ sellerId: 1 })
    await db.collection(COLLECTIONS.BIKES).createIndex({ brand: 1 })
    await db.collection(COLLECTIONS.BIKES).createIndex({ condition: 1 })
    await db.collection(COLLECTIONS.BIKES).createIndex({ price: 1 })
    await db.collection(COLLECTIONS.BIKES).createIndex({ location: 1 })
    await db.collection(COLLECTIONS.BIKES).createIndex({ status: 1 })
    await db.collection(COLLECTIONS.BIKES).createIndex({ isActive: 1 })
    await db.collection(COLLECTIONS.BIKES).createIndex({ isFeatured: 1 })
    await db.collection(COLLECTIONS.BIKES).createIndex({ createdAt: -1 })

    // Orders collection indexes
    await db.collection(COLLECTIONS.ORDERS).createIndex({ buyerId: 1 })
    await db.collection(COLLECTIONS.ORDERS).createIndex({ sellerId: 1 })
    await db.collection(COLLECTIONS.ORDERS).createIndex({ bikeId: 1 })
    await db.collection(COLLECTIONS.ORDERS).createIndex({ status: 1 })

    // Bike wash bookings collection indexes
    await db.collection(COLLECTIONS.BIKE_WASH_BOOKINGS).createIndex({ userId: 1 })
    await db.collection(COLLECTIONS.BIKE_WASH_BOOKINGS).createIndex({ scheduledDate: 1 })
    await db.collection(COLLECTIONS.BIKE_WASH_BOOKINGS).createIndex({ status: 1 })
  }

  static async seedData() {
    const { db } = await connectToDatabase()

    // Check if admin user exists
    const adminExists = await db.collection(COLLECTIONS.USERS).findOne({ 
      email: 'admin@bahonxbd.com' 
    })

    if (!adminExists) {
      // Create admin user
      const bcrypt = require('bcryptjs')
      const hashedPassword = await bcrypt.hash('admin123', 12)

      await db.collection(COLLECTIONS.USERS).insertOne({
        name: 'Admin User',
        email: 'admin@bahonxbd.com',
        password: hashedPassword,
        role: 'admin',
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      console.log('Admin user created: admin@bahonxbd.com / admin123')
    }
  }
}