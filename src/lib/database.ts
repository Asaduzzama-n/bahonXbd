import mongoose from 'mongoose'
import { User, Bike, PurchaseOrder, BikeWashLocation, Expenses, Partner } from './models'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bike-platform'

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

interface GlobalMongoose {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var __mongoose: GlobalMongoose | undefined
}

let cached = global.__mongoose

if (!cached) {
  cached = global.__mongoose = { conn: null, promise: null }
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached!.conn) {
    return cached!.conn
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }

    cached!.promise = mongoose.connect(MONGODB_URI, opts)
  }

  try {
    cached!.conn = await cached!.promise
  } catch (e) {
    cached!.promise = null
    throw e
  }

  return cached!.conn
}

// User Schema
const userSchema = new mongoose.Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  profile: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isEmailVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
  verificationExpiry: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpiry: { type: Date },
  lastLogin: { type: Date },
}, {
  timestamps: true
})

// Bike Schema
const bikeSchema = new mongoose.Schema<Bike>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number },
  condition: { type: String, enum: ['excellent', 'good', 'fair', 'poor'], required: true },
  mileage: { type: Number, required: true },
  price: { type: Number, required: true },
  myShare: { type: Number, required: true },
  partners: [{
    partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner',required: true },
    percentage: { type: Number,required: true }
  }],
  images: [{ type: String }],
  features: [{ type: String }],
  availableDocs: [{ type: String }],
  specifications: {
    engine: { type: String },
    transmission: { type: String },
    fuelType: { type: String },
    displacement: { type: String },
    maxPower: { type: String },
    maxTorque: { type: String },
    topSpeed: { type: String },
    fuelTank: { type: String },
    weight: { type: String }
  },
  serviceHistory: [{
    date: { type: String,required: true },
    description: { type: String,required: true },
    cost: { type: Number,required: true }
  }],
  status: { type: String, enum: ['active', 'sold', 'pending', 'inactive', 'available'], default: 'active' },
  isFeatured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
}, {
  timestamps: true
})

// Purchase Order Schema
const purchaseOrderSchema = new mongoose.Schema<PurchaseOrder>({
  bikeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bike', required: true },
  buyerName: { type: String, required: true },
  buyerPhone: { type: String, required: true },
  buyerEmail: { type: String },
  buyerAddress: { type: String },
  buyerDocs: {
    nid: { type: String, required: true },
    drivingLicense: { type: String, required: true },
    proofOfAddress: { type: String }
  },
  amount: { type: Number, required: true },
  profit: { type: Number, required: true },
  partnersProfit: [
    {
      partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner', required: true },
      profit: { type: Number, required: true }
    }
  ],
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'partial', 'failed', 'refunded'], default: 'pending' },
  paymentMethod: { type: String, enum: ['Bkash', 'Cash', 'Bank Transfer'], required: true },
  dueAmount: { type: Number },
  dueDate: { type: Date },
  notes: { type: String },
}, {
  timestamps: true
})

// Bike Wash Location Schema
const bikeWashLocationSchema = new mongoose.Schema<BikeWashLocation>({
  location: { type: String, required: true },
  map: { type: String, required: true },
  price: { type: Number, required: true },
  features: [{ type: String }],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, {
  timestamps: true
})

// Expenses Schema
const expensesSchema = new mongoose.Schema<Expenses>({
  bikeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bike' },
  type: { type: String, enum: ['repair', 'maintenance', 'transportation', 'other'], required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
}, {
  timestamps: true
})

// Partner Schema
const partnerSchema = new mongoose.Schema<Partner>({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  documents: {
    nid: { type: String, required: true },
    drivingLicense: { type: String, required: true },
    proofOfAddress: { type: String }
  },
  profile: { type: String },
}, {
  timestamps: true
})

// Create indexes
userSchema.index({ email: 1 })
bikeSchema.index({ brand: 1, model: 1 })
bikeSchema.index({ price: 1 })
bikeSchema.index({ status: 1 })
bikeSchema.index({ isFeatured: 1 })
purchaseOrderSchema.index({ bikeId: 1 })
purchaseOrderSchema.index({ status: 1 })

// Export models
export const UserModel = mongoose.models.User || mongoose.model<User>('User', userSchema)
export const BikeModel = mongoose.models.Bike || mongoose.model<Bike>('Bike', bikeSchema)
export const PurchaseOrderModel = mongoose.models.PurchaseOrder || mongoose.model<PurchaseOrder>('PurchaseOrder', purchaseOrderSchema)
export const BikeWashLocationModel = mongoose.models.BikeWashLocation || mongoose.model<BikeWashLocation>('BikeWashLocation', bikeWashLocationSchema)
export const ExpensesModel = mongoose.models.Expenses || mongoose.model<Expenses>('Expenses', expensesSchema)
export const PartnerModel = mongoose.models.Partner || mongoose.model<Partner>('Partner', partnerSchema)

// Database utilities
export class DatabaseUtils {
  static async createIndexes() {
    await connectToDatabase()
    // Indexes are automatically created by Mongoose schemas
    console.log('Database indexes created successfully')
  }

  static async seedData() {
    await connectToDatabase()
    
    // Check if admin user exists
    const adminExists = await UserModel.findOne({ email: 'admin@bikeplatform.com' })
    
    if (!adminExists) {
      const bcrypt = require('bcryptjs')
      const hashedPassword = await bcrypt.hash('admin123', 12)
      
      await UserModel.create({
        name: 'Admin User',
        email: 'admin@bikeplatform.com',
        password: hashedPassword,
        role: 'admin',
        isEmailVerified: true,
      })
      
      console.log('Admin user created successfully')
    }
    
    console.log('Database seeded successfully')
  }
}

export default mongoose