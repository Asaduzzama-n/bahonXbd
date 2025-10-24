import { NextRequest } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import { BikeModel, PartnerModel } from '@/lib/database'
import { bikeSchema, adminBikeQuerySchema } from '@/lib/validations'
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

const getAdminBikes = async (request: NextRequest) => {
  await connectToDatabase()
  const { searchParams } = new URL(request.url)
  
  // Validate query parameters
  const queryData = validateQueryParams(searchParams, adminBikeQuerySchema)
  const { page, limit, status, brand, search, sortBy, sortOrder } = queryData as IBikeFilter
    
    // Build filter object
    const filter: any = {}
    
    if (status) {
      filter.status = status
    }
    
    if (brand) {
      filter.brand = { $regex: brand, $options: 'i' }
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }
    
  // Calculate pagination
  const {page: validatedPage, limit: validatedLimit, skip, sortBy: validatedSortBy, sortOrder: validatedSortOrder } = paginationHelper.calculatePagination({ page, limit, sortBy, sortOrder: sortOrder as 'asc' | 'desc' })

  // Execute query with pagination
  const sortObj = { [validatedSortBy]: validatedSortOrder === 'asc' ? 1 : -1 }
  const [bikes, total] = await Promise.all([
    BikeModel
      .find(filter)
      .populate('partners.partnerId', 'name email')
      .sort(sortObj as { [key: string]: 1 | -1 })
      .skip(skip)
      .limit(validatedLimit)
      .lean(),
    BikeModel.countDocuments(filter)
  ])

  return sendPaginatedResponse(
    bikes,
    total,
    validatedPage,
    validatedLimit,
    'Admin bikes retrieved successfully'
  )
}

export const GET = withErrorHandler(getAdminBikes)

const createAdminBike = async (request: NextRequest) => {
  await connectToDatabase()
  
  // Validate request body
  const bikeData = await validateRequestBody(request, bikeSchema) as Bike

  // Validate partner IDs if provided
  if (bikeData.partners && bikeData.partners.length > 0) {
    const partnerIds = bikeData.partners.map(p => p.partnerId)
    const existingPartners = await PartnerModel.find({ _id: { $in: partnerIds } })
    
    if (existingPartners.length !== partnerIds.length) {
      throw new ApiError(400, 'One or more partner IDs are invalid')
    }
  }

  // Calculate myShare if not provided
  if (!bikeData.myShare && bikeData.partners && bikeData.partners.length > 0) {
    const totalPartnerPercentage = bikeData.partners.reduce((sum, partner) => sum + partner.percentage, 0)
    bikeData.myShare = bikeData.price * (100 - totalPartnerPercentage) / 100
  } else if (!bikeData.myShare) {
    bikeData.myShare = bikeData.price
  }

  // Set initial views to 0
  const bikeToCreate = {
    ...bikeData,
    views: 0
  }

  const bike = new BikeModel(bikeToCreate)
  await bike.save()

  return sendSuccessResponse({
    data: bike,
    message: 'Bike created successfully',
    statusCode: 201
  })
}

export const POST = withErrorHandler(createAdminBike)