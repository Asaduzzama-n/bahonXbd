import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import { BikeModel } from '@/lib/database'
import {
  withErrorHandler,
  sendSuccessResponse,
  ApiError
} from '@/lib'

// GET - Fetch single public bike by ID (no sensitive data)
const getPublicBike = async (request: NextRequest, { params }: { params: { id: string } }) => {
  await connectToDatabase()

  const { id } = params

  if (!id) {
    throw new ApiError(400, 'Bike ID is required')
  }

  // Find bike and only select public fields
  const bike = await BikeModel
    .findOne({
      _id: id,
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
    .lean()

  if (!bike) {
    throw new ApiError(404, 'Bike not found')
  }

  // Increment view count (without exposing it in response)
  await BikeModel.findByIdAndUpdate(id, { $inc: { views: 1 } })

  return sendSuccessResponse({ data: bike, message: 'Bike details retrieved successfully', statusCode: 200 })
}

export const GET = withErrorHandler(getPublicBike)