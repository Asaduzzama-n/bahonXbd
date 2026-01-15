import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import { BikeModel } from '@/lib/database'
import {
  withErrorHandler,
  sendSuccessResponse
} from '@/lib'

// GET - Fetch featured bikes (no sensitive data)
const getFeaturedBikes = async (request: NextRequest) => {
  await connectToDatabase()

  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '6')

  // Find featured bikes that are active
  const bikes = await BikeModel
    .find({
      isFeatured: true,
      status: { $in: ['active', 'available'] }
    })
    .select({
      // Exclude sensitive fields only (MongoDB doesn't allow mixing inclusion and exclusion)
      purchasePrice: 0,
      purchaseDate: 0,
      myShare: 0,
      partners: 0,
      sellerInfo: 0,
      sellerAvailableDocs: 0,
      bikeAvailableDocs: 0,
      serviceHistory: 0
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean()

  return sendSuccessResponse({ data: bikes, message: 'Featured bikes retrieved successfully', statusCode: 200 })
}

export const GET = withErrorHandler(getFeaturedBikes)