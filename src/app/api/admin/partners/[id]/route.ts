import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import { PartnerModel } from '@/lib/database'
import { AuthUtils, checkPermission } from '@/lib/auth'
import { partnerToggleActiveSchema, partnerUpdateSchema, type PartnerToggleActive, type PartnerUpdate } from '@/lib/validations'
import { sendSuccessResponse, sendErrorResponse } from '@/lib/utils/responseUtils'
import { isValidObjectId } from 'mongoose'

// GET /api/admin/partners/[id] - Get single partner details
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
      return sendErrorResponse({ message: 'Invalid partner ID', statusCode: 400 })
    }

    // Find partner
    const partner = await PartnerModel.findById(id).select('-__v').lean()

    if (!partner) {
      return sendErrorResponse({ message: 'Partner not found', statusCode: 404 })
    }

    return sendSuccessResponse({
      message: 'Partner retrieved successfully',
      data: partner
    })

  } catch (error: any) {
    console.error('Error fetching partner:', error)
    return sendErrorResponse({ message: 'Failed to fetch partner', statusCode: 500 })
  }
}

// PATCH /api/admin/partners/[id] - Update partner (including toggle isActive)
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
      return sendErrorResponse({ message: 'Invalid partner ID', statusCode: 400 })
    }

    // Parse and validate request body
    const body = await request.json()
    
    // Check if this is just a toggle active request or full update
    let validatedData: PartnerToggleActive | PartnerUpdate
    
    if (Object.keys(body).length === 1 && 'isActive' in body) {
      // Simple toggle active request
      validatedData = partnerToggleActiveSchema.parse(body) as PartnerToggleActive
    } else {
      // Full update request
      validatedData = partnerUpdateSchema.parse(body) as PartnerUpdate
      
      // If updating email or phone, check for duplicates
      if (validatedData.email || validatedData.phone) {
        const duplicateFilter: any = { _id: { $ne: id } }
        
        if (validatedData.email || validatedData.phone) {
          duplicateFilter.$or = []
          if (validatedData.email) {
            duplicateFilter.$or.push({ email: validatedData.email })
          }
          if (validatedData.phone) {
            duplicateFilter.$or.push({ phone: validatedData.phone })
          }
        }

        const existingPartner = await PartnerModel.findOne(duplicateFilter)
        if (existingPartner) {
          return sendErrorResponse({ message: 'Partner with this email or phone already exists', statusCode: 409 })
        }
      }
    }

    // Update partner
    const updatedPartner = await PartnerModel.findByIdAndUpdate(
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

    if (!updatedPartner) {
      return sendErrorResponse({ message: 'Partner not found', statusCode: 404 })
    }

    return sendSuccessResponse({
      message: 'Partner updated successfully',
      data: updatedPartner
    })

  } catch (error: any) {
    console.error('Error updating partner:', error)
    return sendErrorResponse({
      message: error.name === 'ZodError' 
        ? `Validation error: ${error.errors.map((e: any) => e.message).join(', ')}`
        : 'Failed to update partner',
      statusCode: error.name === 'ZodError' ? 400 : 500
    })
  }
}

// DELETE /api/admin/partners/[id] - Delete partner (soft delete by setting isActive to false)
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
      return sendErrorResponse({ message: 'Invalid partner ID', statusCode: 400 })
    }

    // Soft delete by setting isActive to false
    const deletedPartner = await PartnerModel.findByIdAndUpdate(
      id,
      { 
        isActive: false,
        updatedAt: new Date()
      },
      { 
        new: true 
      }
    ).select('-__v').lean()

    if (!deletedPartner) {
      return sendErrorResponse({ message: 'Partner not found', statusCode: 404 })
    }

    return sendSuccessResponse({
      message: 'Partner deactivated successfully',
      data: deletedPartner
    })

  } catch (error: any) {
    console.error('Error deleting partner:', error)
    return sendErrorResponse({ message: 'Failed to delete partner', statusCode: 500 })
  }
}