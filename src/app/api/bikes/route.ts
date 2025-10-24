import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import { BikeModel, PartnerModel } from '@/lib/database'
import { bikeSchema, bikeUpdateSchema, bikeQuerySchema } from '@/lib/validations'

import { 
  withErrorHandler, 
  sendSuccessResponse, 
  sendPaginatedResponse,
  validateQueryParams,
  validateRequestBody,
  ApiError,
  paginationHelper
} from '@/lib'
import { IBikeFilter } from '@/lib/interfaces/filters'
import { Bike } from '@/lib/models'


// GET - Fetch bikes with filtering and pagination
const getBikes = async (request: NextRequest) => {
  await connectToDatabase()
  const { searchParams } = new URL(request.url)
  
  // Validate query parameters
  const queryData = validateQueryParams(searchParams, bikeQuerySchema)
  const { page, limit, brand, minPrice, maxPrice, search, sortBy, sortOrder, condition } = queryData as IBikeFilter

    // Build filter query
    const filter: any = { isActive: true }

    if (brand) filter.brand = { $regex: brand, $options: 'i' }
    if (condition) filter.condition = condition
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = minPrice
      if (maxPrice) filter.price.$lte = maxPrice
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

  // Calculate pagination
  const { page: validatedPage, skip, sortBy: validatedSortBy, sortOrder: validatedSortOrder, limit: validatedLimit } = paginationHelper.calculatePagination({ 
    page, 
    limit, 
    sortBy, 
    sortOrder: sortOrder as 'asc' | 'desc'
  })

  // Execute query with pagination
  const sortObj = { [validatedSortBy]: validatedSortOrder === 'asc' ? 1 : -1 }
  const [bikes, total] = await Promise.all([
    BikeModel
      .find(filter)
      .populate('partners.partnerId', 'name email')
      .sort(sortObj as { [key: string]: 'asc' | 'desc' | 1 | -1 })
      .skip(skip)
      .limit(validatedLimit)
      .lean(),
      BikeModel.countDocuments(filter)
  ])

  // Get total count for pagination


  return sendPaginatedResponse(
    bikes,
    total,
    validatedPage,
    validatedLimit,
    'Bikes retrieved successfully'
  )
}

export const GET = withErrorHandler(getBikes)

// POST - Create new bike listing
const createBike = async (request: NextRequest) => {
  await connectToDatabase()
  
  // Validate request body
  const bikeData:Bike = await validateRequestBody(request, bikeSchema) as Bike

  // Validate partner IDs if provided
  if (bikeData.partners && bikeData.partners.length > 0) {
    const partnerIds = bikeData.partners.map(p => p.partnerId)
    const existingPartners = await PartnerModel.find({ _id: { $in: partnerIds } })
    
    if (existingPartners.length !== partnerIds.length) {
      throw new ApiError(400, 'One or more partner IDs are invalid')
    }
  }

  // Calculate myShare if not provided
  if (bikeData.partners && bikeData.partners.length > 0) {
    const totalPartnerPercentage = bikeData.partners.reduce((sum, partner) => sum + partner.percentage, 0)
    const myPercentage = Math.max(0, 100 - totalPartnerPercentage)
    bikeData.myShare = Math.round((bikeData.price * myPercentage) / 100)
  } else {
    bikeData.myShare = bikeData.price
  }

  // Create bike document using Mongoose
  const newBike = new BikeModel({
    ...bikeData,
    isActive: true,
    isVerified: false,
    isFeatured: false,
    views: 0,
  })

  const savedBike = await newBike.save()

  return sendSuccessResponse({
    data: savedBike,
    message: 'Bike listing created successfully',
    statusCode: 201
  })
}

export const POST = withErrorHandler(createBike)

// PUT - Update bike listing
const updateBike = async (request: NextRequest) => {
  await connectToDatabase()
  const body = await request.json()
  const { id, ...updateData } = body

  if (!id) {
    throw new ApiError(400, 'Bike ID is required')
  }

  // Validate update data using Zod directly
  const validation = bikeUpdateSchema.safeParse(updateData)
  if (!validation.success) {
    throw new ApiError(400, 'Invalid update data')
  }
  const validatedData = validation.data

  // Check if bike exists
  const bike = await BikeModel.findById(id)
  if (!bike) {
    throw new ApiError(404, 'Bike not found')
  }

  // Validate partner IDs if provided
  if (validatedData.partners && validatedData.partners.length > 0) {
    const partnerIds = validatedData.partners.map(p => p.partnerId)
    const existingPartners = await PartnerModel.find({ _id: { $in: partnerIds } })
    
    if (existingPartners.length !== partnerIds.length) {
      throw new ApiError(400, 'One or more partner IDs are invalid')
    }
  }

  // Calculate myShare if partners or price are being updated
  if (validatedData.partners !== undefined || validatedData.price !== undefined) {
    const partners = validatedData.partners || bike.partners
    const price = validatedData.price || bike.price
    
    if (partners && partners.length > 0) {
      const totalPartnerPercentage = partners.reduce((sum:number, partner:{partnerId:string,percentage:number}) => sum + partner.percentage, 0)
      const myPercentage = Math.max(0, 100 - totalPartnerPercentage)
      validatedData.myShare = Math.round((price * myPercentage) / 100)
    } else {
      validatedData.myShare = price
    }
  }

  // Update bike using Mongoose
  const updatedBike = await BikeModel.findByIdAndUpdate(
    id,
    { 
      ...validatedData,
      updatedAt: new Date()
    },
    { new: true, runValidators: true }
  ).populate('partners.partnerId', 'name email')

  return sendSuccessResponse({
    data: updatedBike,
    message: 'Bike updated successfully'
  })
}

export const PUT = withErrorHandler(updateBike)

// DELETE - Delete bike listing
const deleteBike = async (request: NextRequest) => {
  await connectToDatabase()
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    throw new ApiError(400, 'Bike ID is required')
  }

  const deletedBike = await BikeModel.findByIdAndDelete(id)

  if (!deletedBike) {
    throw new ApiError(404, 'Bike not found')
  }

  return sendSuccessResponse({
    data: null,
    message: 'Bike deleted successfully'
  })
}

export const DELETE = withErrorHandler(deleteBike)