import { z } from 'zod'

// Partner validation schema
export const partnerSchema = z.object({
  partnerId: z.string().min(1, 'Partner ID is required'),
  percentage: z.number().min(0, 'Percentage must be at least 0').max(100, 'Percentage cannot exceed 100')
})

// Service history validation schema
export const serviceHistorySchema = z.object({
  date: z.string().min(1, 'Date is required'),
  description: z.string().min(1, 'Description is required'),
  cost: z.number().min(0, 'Cost must be at least 0')
})

// Specifications validation schema
export const specificationsSchema = z.object({
  engine: z.string().optional(),
  transmission: z.string().optional(),
  fuelType: z.string().optional(),
  displacement: z.string().optional(),
  maxPower: z.string().optional(),
  maxTorque: z.string().optional(),
  topSpeed: z.string().optional(),
  fuelTank: z.string().optional(),
  weight: z.string().optional()
})

// Main bike validation schema
export const bikeSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description cannot exceed 2000 characters'),
  
  brand: z.string()
    .min(2, 'Brand must be at least 2 characters')
    .max(50, 'Brand cannot exceed 50 characters'),
  
  model: z.string()
    .min(1, 'Model is required')
    .max(50, 'Model cannot exceed 50 characters'),
  
  year: z.number()
    .int('Year must be an integer')
    .min(1900, 'Year must be at least 1900')
    .max(new Date().getFullYear() + 1, 'Year cannot be in the future'),
  
  condition: z.enum(['excellent', 'good', 'fair', 'poor'], {
    message: 'Condition must be excellent, good, fair, or poor'
  }),
  
  mileage: z.number()
    .min(0, 'Mileage must be at least 0')
    .max(1000000, 'Mileage seems unrealistic'),
  
  price: z.number()
    .min(1, 'Price must be at least 1')
    .max(10000000, 'Price seems unrealistic'),
  
  myShare: z.number()
    .min(0, 'My share must be at least 0')
    .optional(),
  
  partners: z.array(partnerSchema)
    .optional()
    .default([])
    .refine((partners) => {
      const totalPercentage = partners.reduce((sum, partner) => sum + partner.percentage, 0)
      return totalPercentage <= 100
    }, {
      message: 'Total partner percentage cannot exceed 100%'
    }),
  
  images: z.array(z.string().url('Invalid image URL'))
    .optional()
    .default([]),
  
  features: z.array(z.string().min(1, 'Feature cannot be empty'))
    .optional()
    .default([]),
  
  availableDocs: z.array(z.string().min(1, 'Document name cannot be empty'))
    .optional()
    .default([]),
  
  specifications: specificationsSchema
    .optional()
    .default({}),
  
  serviceHistory: z.array(serviceHistorySchema)
    .optional()
    .default([]),
  
  status: z.enum(['active', 'sold', 'pending', 'inactive', 'available']).optional().default('active'),
  
  isFeatured: z.boolean()
    .optional()
    .default(false)
})

// Bike update schema (all fields optional except ID)
export const bikeUpdateSchema = bikeSchema.partial()

// Bike query parameters schema
export const bikeQuerySchema = z.object({
  page: z.string().optional().transform((val) => val ? parseInt(val) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val) : 12),
  brand: z.string().optional(),
  condition: z.string().optional().refine((val) => 
    !val || ['excellent', 'good', 'fair', 'poor'].includes(val), 
    { message: 'Invalid condition value' }
  ),
  minPrice: z.string().optional().transform((val) => val ? parseInt(val) : undefined),
  maxPrice: z.string().optional().transform((val) => val ? parseInt(val) : undefined),
  search: z.string().optional(),
  sortBy: z.string().optional().refine((val) => 
    !val || ['createdAt', 'updatedAt', 'price', 'year', 'mileage', 'title', 'brand', 'model'].includes(val), 
    { message: 'Invalid sortBy field' }
  ).transform((val) => val || 'createdAt'),
  sortOrder: z.string().optional().refine((val) => 
    !val || ['asc', 'desc'].includes(val), 
    { message: 'Invalid sortOrder value' }
  ).transform((val) => (val as 'asc' | 'desc') || 'desc'),
  status: z.string().optional().refine((val) => 
    !val || ['active', 'sold', 'pending', 'inactive', 'available'].includes(val), 
    { message: 'Invalid status value' }
  )
})

// Admin bike query schema (includes additional filters)
export const adminBikeQuerySchema = bikeQuerySchema.extend({
  limit: z.string().optional().transform((val) => val ? parseInt(val) : 50)
})

// Partner management validation schemas
export const partnerQuerySchema = z.object({
  search: z.string().optional(),
  isActive: z.string().optional().transform((val) => val === 'true' ? true : val === 'false' ? false : undefined),
  sortBy: z.string().optional().refine((val) => 
    !val || ['createdAt', 'updatedAt', 'name', 'phone', 'email'].includes(val), 
    { message: 'Invalid sortBy field' }
  ).transform((val) => val || 'createdAt'),
  sortOrder: z.string().optional().refine((val) => 
    !val || ['asc', 'desc'].includes(val), 
    { message: 'Invalid sortOrder value' }
  ).transform((val) => (val as 'asc' | 'desc') || 'desc')
})

export const partnerToggleActiveSchema = z.object({
  isActive: z.boolean()
})

export const partnerCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  phone: z.string().min(10, 'Phone must be at least 10 characters').max(15, 'Phone cannot exceed 15 characters'),
  email: z.string().email('Invalid email format'),
  address: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'Zip code is required'),
    country: z.string().min(1, 'Country is required')
  }),
  documents: z.object({
    nid: z.string().optional(),
    drivingLicense: z.string().optional(),
    proofOfAddress: z.string().optional()
  }).optional(),
  profile: z.object({
    bio: z.string().optional(),
    experience: z.string().optional(),
    specialization: z.string().optional()
  }).optional()
})

export const partnerUpdateSchema = partnerCreateSchema.partial()

export type BikeInput = z.infer<typeof bikeSchema>
export type BikeUpdateInput = z.infer<typeof bikeUpdateSchema>
export type BikeQuery = z.infer<typeof bikeQuerySchema>
export type AdminBikeQuery = z.infer<typeof adminBikeQuerySchema>
export type PartnerQuery = z.infer<typeof partnerQuerySchema>
export type PartnerToggleActive = z.infer<typeof partnerToggleActiveSchema>
export type PartnerCreate = z.infer<typeof partnerCreateSchema>
export type PartnerUpdate = z.infer<typeof partnerUpdateSchema>