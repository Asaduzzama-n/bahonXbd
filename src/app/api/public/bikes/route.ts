import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import { BikeModel } from '@/lib/database'
import { bikeQuerySchema } from '@/lib/validations'

import { 
  withErrorHandler, 
  sendPaginatedResponse,
  validateQueryParams,
  paginationHelper
} from '@/lib'
import { IBikeFilter } from '@/lib/interfaces/filters'

// GET - Fetch public bikes with filtering and pagination (no sensitive data)
const getPublicBikes = async (request: NextRequest) => {
  await connectToDatabase()
  const { searchParams } = new URL(request.url)
  
  // Validate query parameters
  const queryData = validateQueryParams(searchParams, bikeQuerySchema)
  const { page, limit, brand, minPrice, maxPrice, search, sortBy, sortOrder, condition } = queryData as IBikeFilter

  // Build filter query - only show active bikes
  const filter: any = { 
    status: { $in: ['active', 'available'] },
    isActive: true 
  }

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

  // Execute query with pagination - only select public fields
  const sortObj = { [validatedSortBy]: validatedSortOrder === 'asc' ? 1 : -1 }
  const [bikes, total] = await Promise.all([
    BikeModel
      .find(filter)
      .select({
        // Include only public fields (cannot mix inclusion and exclusion)
        title: 1,
        description: 1,
        brand: 1,
        model: 1,
        year: 1,
        condition: 1,
        mileage: 1,
        price: 1,
        images: 1,
        features: 1,
        status: 1,
        isFeatured: 1,
        views: 1,
        location: 1,
        createdAt: 1,
        updatedAt: 1
      })
      .sort(sortObj as { [key: string]: 'asc' | 'desc' | 1 | -1 })
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
    'Public bikes retrieved successfully'
  )
}

export const GET = withErrorHandler(getPublicBikes)