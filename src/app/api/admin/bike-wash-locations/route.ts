import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import { BikeWashLocationModel } from '@/lib/database'
import { AuthUtils, checkPermission } from '@/lib/auth'
import { bikeWashLocationQuerySchema, bikeWashLocationCreateSchema, type BikeWashLocationQuery, type BikeWashLocationCreate } from '@/lib/validations'
import { sendSuccessResponse, sendErrorResponse } from '@/lib/utils/responseUtils'

// GET /api/admin/bike-wash-locations - Get all bike wash locations with search and filtering
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    await checkPermission(request)

    await connectToDatabase()

    // Parse and validate query parameters
    const url = new URL(request.url)
    const queryParams = Object.fromEntries(url.searchParams.entries())
    
    const validationResult = bikeWashLocationQuerySchema.safeParse(queryParams)
    if (!validationResult.success) {
      return sendErrorResponse({ message: 'Invalid query parameters', statusCode: 400 })
    }
    
    const queryData = validationResult.data
    const { search, status, sortBy, sortOrder } = queryData as BikeWashLocationQuery

    // Build search filter
    const filter: any = {}
    
    if (search) {
      filter.$or = [
        { location: { $regex: search, $options: 'i' } },
        { features: { $in: [new RegExp(search, 'i')] } }
      ]
    }

    if (status) {
      filter.status = status
    }

    // Create sort object
    const sortObj: Record<string, 1 | -1> = {
      [sortBy || 'createdAt']: sortOrder === 'asc' ? 1 : -1
    }

    // Fetch all bike wash locations without pagination (as requested)
    const bikeWashLocations = await BikeWashLocationModel.find(filter)
      .sort(sortObj)
      .lean()

    return sendSuccessResponse({
      message: 'Bike wash locations retrieved successfully',
      data: {
        bikeWashLocations,
        total: bikeWashLocations.length
      }
    })

  } catch (error: any) {
    console.error('Error fetching bike wash locations:', error)
    return sendErrorResponse({
      message: error.name === 'ZodError' 
        ? `Validation error: ${error.errors.map((e: any) => e.message).join(', ')}`
        : 'Failed to fetch bike wash locations',
      statusCode: error.name === 'ZodError' ? 400 : 500
    })
  }
}

// POST /api/admin/bike-wash-locations - Create new bike wash location
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    await checkPermission(request)

    await connectToDatabase()

    // Parse and validate request body
    const body = await request.json()
    const validatedData = bikeWashLocationCreateSchema.parse(body) as BikeWashLocationCreate

    // Check if bike wash location with same location already exists
    const existingLocation = await BikeWashLocationModel.findOne({
      location: { $regex: new RegExp(`^${validatedData.location}$`, 'i') }
    })

    if (existingLocation) {
      return sendErrorResponse({ message: 'Bike wash location with this location already exists', statusCode: 409 })
    }

    // Create new bike wash location
    const newBikeWashLocation = new BikeWashLocationModel({
      ...validatedData,
      status: validatedData.status || 'active'
    })

    await newBikeWashLocation.save()

    return sendSuccessResponse({
      message: 'Bike wash location created successfully',
      data: newBikeWashLocation,
      statusCode: 201
    })

  } catch (error: any) {
    console.error('Error creating bike wash location:', error)
    return sendErrorResponse({
      message: error.name === 'ZodError' 
        ? `Validation error: ${error.errors.map((e: any) => e.message).join(', ')}`
        : 'Failed to create bike wash location',
      statusCode: error.name === 'ZodError' ? 400 : 500
    })
  }
}