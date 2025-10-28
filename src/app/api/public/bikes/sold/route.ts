import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import { BikeModel } from '@/lib/database'
import { 
  withErrorHandler, 
  sendSuccessResponse
} from '@/lib'

// GET - Fetch recently sold bikes (no sensitive data)
const getRecentlySoldBikes = async (request: NextRequest) => {
  await connectToDatabase()
  
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '6')

  // Find recently sold bikes
  const bikes = await BikeModel
    .find({ 
      status: 'sold',
      isActive: true 
    })
    .select({
      // Include public fields
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
      location: 1,
      updatedAt: 1, // Use updatedAt as sold date
      // Exclude sensitive fields
      purchasePrice: 0,
      purchaseDate: 0,
      myShare: 0,
      partners: 0,
      sellerInfo: 0,
      sellerAvailableDocs: 0,
      bikeAvailableDocs: 0,
      serviceHistory: 0
    })
    .sort({ updatedAt: -1 }) // Most recently sold first
    .limit(limit)
    .lean()

  return sendSuccessResponse({data: bikes, message: 'Recently sold bikes retrieved successfully', statusCode: 200})
}

export const GET = withErrorHandler(getRecentlySoldBikes)