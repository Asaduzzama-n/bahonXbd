import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import { BikeWashLocationModel } from '@/lib/database'
import { 
  withErrorHandler, 
  sendSuccessResponse
} from '@/lib'

// GET - Fetch public bike wash locations
const getPublicBikeWashLocations = async (request: NextRequest) => {
  await connectToDatabase()
  
  // Only return active locations
  const locations = await BikeWashLocationModel
    .find({ status: 'active' })
    .select({
      location: 1,
      map: 1,
      price: 1,
      features: 1,
      status: 1,
      createdAt: 1,
      updatedAt: 1
    })
    .sort({ createdAt: -1 })
    .lean()

  return sendSuccessResponse({data: locations, message: 'Bike wash locations retrieved successfully', statusCode: 200})
}

export const GET = withErrorHandler(getPublicBikeWashLocations)