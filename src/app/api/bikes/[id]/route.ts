import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import { BikeModel, PartnerModel } from '@/lib/database'
import { bikeUpdateSchema } from '@/lib/validations'
import { z } from 'zod'
import {
  withErrorHandler,
  sendSuccessResponse,
  validateRequestBody,
  ApiError,
  mongoIdSchema
} from '@/lib'


const getBikeById = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await connectToDatabase()

  const { id } = await params

  // Validate the bike ID
  const validation = mongoIdSchema.safeParse(id)
  if (!validation.success) {
    throw new ApiError(400, 'Invalid bike ID format')
  }

  const bike = await BikeModel.findById(id)
    .populate('partners.partnerId', 'name email')
    .lean()

  if (!bike) {
    throw new ApiError(404, 'Bike not found')
  }

  // Increment views
  await BikeModel.findByIdAndUpdate(id, { $inc: { views: 1 } })

  return sendSuccessResponse({
    data: bike,
    message: 'Bike retrieved successfully'
  })
}

export const GET = withErrorHandler(getBikeById)

const patchBike = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await connectToDatabase()

  const { id } = await params

  // Validate the bike ID
  const validation = mongoIdSchema.safeParse(id)
  if (!validation.success) {
    throw new ApiError(400, 'Invalid bike ID format')
  }

  // Validate update data
  const updateData = await validateRequestBody(request, bikeUpdateSchema) as z.infer<typeof bikeUpdateSchema>

  // Validate partner IDs if provided
  if (updateData.partners && updateData.partners.length > 0) {
    const partnerIds = updateData.partners.map(p => p.partnerId)
    const existingPartners = await PartnerModel.find({ _id: { $in: partnerIds } })

    if (existingPartners.length !== partnerIds.length) {
      throw new ApiError(400, 'One or more partner IDs are invalid')
    }
  }

  // Get existing bike
  const bike = await BikeModel.findById(id)
  if (!bike) {
    throw new ApiError(404, 'Bike not found')
  }

  // Calculate myShare if partners or price are being updated
  if (updateData.partners || updateData.price) {
    const partners = updateData.partners || bike.partners
    const price = updateData.price || bike.price

    if (partners && partners.length > 0) {
      const totalPartnerPercentage = partners.reduce((sum: number, partner: { partnerId: string, percentage: number }) => sum + partner.percentage, 0)
      updateData.myShare = price * (100 - totalPartnerPercentage) / 100
    } else {
      updateData.myShare = price
    }
  }

  const updatedBike = await BikeModel.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).populate('partners.partnerId', 'name email')

  return sendSuccessResponse({
    data: updatedBike,
    message: 'Bike updated successfully'
  })
}

export const PATCH = withErrorHandler(patchBike)