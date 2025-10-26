import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase, PublicInfoModel } from '@/lib/database'
import { checkPermission } from '@/lib/auth'
import { sendSuccessResponse, sendErrorResponse } from '@/lib/api-utils/responseUtils'

// GET - Fetch admin profile
export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    await checkPermission(request)

    await connectToDatabase()

    // Get the first (and should be only) public info document
    const profile = await PublicInfoModel.findOne()

    return sendSuccessResponse({
      data: profile,
      message: profile ? 'Profile retrieved successfully' : 'No profile found'
    })

  } catch (error) {
    console.error('Error fetching admin profile:', error)
    return sendErrorResponse({ 
      message: 'Internal server error', 
      statusCode: 500 
    })
  }
}

// POST - Create admin profile (if doesn't exist)
export async function POST(request: NextRequest) {
  try {
    await checkPermission(request)

    const body = await request.json()
    const { phone, email, availableTimes, location, map } = body

    // Validation
    if (!phone || !Array.isArray(phone) || phone.length === 0) {
      return sendErrorResponse({
        message: 'At least one phone number is required',
        statusCode: 400
      })
    }

    if (!email || typeof email !== 'string') {
      return sendErrorResponse({
        message: 'Email is required',
        statusCode: 400
      })
    }

    if (!availableTimes || !Array.isArray(availableTimes) || availableTimes.length === 0) {
      return sendErrorResponse({
        message: 'At least one available time is required',
        statusCode: 400
      })
    }

    if (!location || typeof location !== 'string') {
      return sendErrorResponse({
        message: 'Location is required',
        statusCode: 400
      })
    }

    await connectToDatabase()

    // Check if profile already exists
    const existingProfile = await PublicInfoModel.findOne()
    
    if (existingProfile) {
      return sendErrorResponse({
        message: 'Profile already exists. Use PUT to update.',
        statusCode: 409
      })
    }

    // Create new profile
    const newProfile = new PublicInfoModel({
      phone: phone.filter((p: string) => p.trim()),
      email: email.trim(),
      availableTimes: availableTimes.filter((t: string) => t.trim()),
      location: location.trim(),
      map: map?.trim() || ''
    })

    await newProfile.save()

    return sendSuccessResponse({
      data: newProfile,
      message: 'Profile created successfully',
      statusCode: 201
    })

  } catch (error) {
    console.error('Error creating admin profile:', error)
    return sendErrorResponse({
      message: 'Internal server error',
      statusCode: 500
    })
  }
}

// PUT - Update admin profile
export async function PUT(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    await checkPermission(request)

    const body = await request.json()
    const { phone, email, availableTimes, location, map } = body

    // Validation
    if (!phone || !Array.isArray(phone) || phone.length === 0) {
      return sendErrorResponse({
        message: 'At least one phone number is required',
        statusCode: 400
      })
    }

    if (!email || typeof email !== 'string') {
      return sendErrorResponse({
        message: 'Email is required',
        statusCode: 400
      })
    }

    if (!availableTimes || !Array.isArray(availableTimes) || availableTimes.length === 0) {
      return sendErrorResponse({
        message: 'At least one available time is required',
        statusCode: 400
      })
    }

    if (!location || typeof location !== 'string') {
      return sendErrorResponse({
        message: 'Location is required',
        statusCode: 400
      })
    }

    await connectToDatabase()

    // Find and update the profile (there should be only one)
    const updatedProfile = await PublicInfoModel.findOneAndUpdate(
      {}, // Empty filter to find the first document
      {
        phone: phone.filter((p: string) => p.trim()),
        email: email.trim(),
        availableTimes: availableTimes.filter((t: string) => t.trim()),
        location: location.trim(),
        map: map?.trim() || ''
      },
      { 
        new: true, // Return the updated document
        upsert: true // Create if doesn't exist
      }
    )

    return sendSuccessResponse({
      data: updatedProfile,
      message: 'Profile updated successfully'
    })

  } catch (error) {
    console.error('Error updating admin profile:', error)
    return sendErrorResponse({
      message: 'Internal server error',
      statusCode: 500
    })
  }
}