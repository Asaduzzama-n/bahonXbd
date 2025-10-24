import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import { BikeWashLocationModel } from '@/lib/database'
import { AuthUtils, checkPermission } from '@/lib/auth'
import { bikeWashLocationToggleStatusSchema, bikeWashLocationUpdateSchema, type BikeWashLocationToggleStatus, type BikeWashLocationUpdate } from '@/lib/validations'
import { sendSuccessResponse, sendErrorResponse } from '@/lib/utils/responseUtils'
import { isValidObjectId } from 'mongoose'

// GET /api/admin/bike-wash-locations/[id] - Get single bike wash location details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    await checkPermission(request)

    await connectToDatabase()

    const { id } = params

    // Validate ObjectId
    if (!isValidObjectId(id)) {
      return sendErrorResponse({ message: 'Invalid bike wash location ID', statusCode: 400 })
    }

    // Find bike wash location
    const bikeWashLocation = await BikeWashLocationModel.findById(id).select('-__v').lean()

    if (!bikeWashLocation) {
      return sendErrorResponse({ message: 'Bike wash location not found', statusCode: 404 })
    }

    return sendSuccessResponse({
      message: 'Bike wash location retrieved successfully',
      data: bikeWashLocation
    })

  } catch (error: any) {
    console.error('Error fetching bike wash location:', error)
    return sendErrorResponse({ message: 'Failed to fetch bike wash location', statusCode: 500 })
  }
}

// PATCH /api/admin/bike-wash-locations/[id] - Update bike wash location (including toggle status)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    await checkPermission(request)

    await connectToDatabase()

    const { id } = params

    // Validate ObjectId
    if (!isValidObjectId(id)) {
      return sendErrorResponse({ message: 'Invalid bike wash location ID', statusCode: 400 })
    }

    // Parse and validate request body
    const body = await request.json()
    
    // Check if this is just a toggle status request or full update
    let validatedData: BikeWashLocationToggleStatus | BikeWashLocationUpdate
    
    if (Object.keys(body).length === 1 && 'status' in body) {
      // Simple toggle status request
      validatedData = bikeWashLocationToggleStatusSchema.parse(body) as BikeWashLocationToggleStatus
    } else {
      // Full update request
      validatedData = bikeWashLocationUpdateSchema.parse(body) as BikeWashLocationUpdate
      
      // If updating location, check for duplicates
      if (validatedData.location) {
        const existingLocation = await BikeWashLocationModel.findOne({
          _id: { $ne: id },
          location: { $regex: new RegExp(`^${validatedData.location}$`, 'i') }
        })
        
        if (existingLocation) {
          return sendErrorResponse({ message: 'Bike wash location with this location already exists', statusCode: 409 })
        }
      }
    }

    // Update bike wash location
    const updatedBikeWashLocation = await BikeWashLocationModel.findByIdAndUpdate(
      id,
      { 
        ...validatedData,
        updatedAt: new Date()
      },
      { 
        new: true, 
        runValidators: true 
      }
    ).select('-__v').lean()

    if (!updatedBikeWashLocation) {
      return sendErrorResponse({ message: 'Bike wash location not found', statusCode: 404 })
    }

    return sendSuccessResponse({
      message: 'Bike wash location updated successfully',
      data: updatedBikeWashLocation
    })

  } catch (error: any) {
    console.error('Error updating bike wash location:', error)
    return sendErrorResponse({
      message: error.name === 'ZodError' 
        ? `Validation error: ${error.errors.map((e: any) => e.message).join(', ')}`
        : 'Failed to update bike wash location',
      statusCode: error.name === 'ZodError' ? 400 : 500
    })
  }
}

// DELETE /api/admin/bike-wash-locations/[id] - Delete bike wash location (soft delete by setting status to inactive)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    await checkPermission(request)

    await connectToDatabase()

    const { id } = params

    // Validate ObjectId
    if (!isValidObjectId(id)) {
      return sendErrorResponse({ message: 'Invalid bike wash location ID', statusCode: 400 })
    }

    // Soft delete by setting status to inactive
    const deletedBikeWashLocation = await BikeWashLocationModel.findByIdAndUpdate(
      id,
      { 
        status: 'inactive',
        updatedAt: new Date()
      },
      { 
        new: true 
      }
    ).select('-__v').lean()

    if (!deletedBikeWashLocation) {
      return sendErrorResponse({ message: 'Bike wash location not found', statusCode: 404 })
    }

    return sendSuccessResponse({
      message: 'Bike wash location deactivated successfully',
      data: deletedBikeWashLocation
    })

  } catch (error: any) {
    console.error('Error deleting bike wash location:', error)
    return sendErrorResponse({ message: 'Failed to delete bike wash location', statusCode: 500 })
  }
}