import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import { PartnerModel } from '@/lib/database'
import { AuthUtils, checkPermission } from '@/lib/auth'
import { partnerQuerySchema, partnerCreateSchema, type PartnerQuery, type PartnerCreate } from '@/lib/validations'
import { sendSuccessResponse, sendErrorResponse } from '@/lib/utils/responseUtils'

// GET /api/admin/partners - Get all partners with search and pagination
export async function GET(request: NextRequest) {
  try {

    // Verify admin authentication
    await checkPermission(request)
  

    await connectToDatabase()

    // Parse and validate query parameters
    const url = new URL(request.url)
    const queryParams = Object.fromEntries(url.searchParams.entries())
    
    const validationResult = partnerQuerySchema.safeParse(queryParams)
    if (!validationResult.success) {
      return sendErrorResponse({ message: 'Invalid query parameters', statusCode: 400 })
    }
    
    const queryData = validationResult.data
    
    const { search, isActive, sortBy, sortOrder } = queryData as PartnerQuery

    // Build search filter
    const filter: any = {}
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'address': { $regex: search, $options: 'i' } },
      ]
    }

    if (isActive !== undefined) {
      filter.isActive = isActive
    }

    // Create sort object
    const sortObj: Record<string, 1 | -1> = {
      [sortBy || 'createdAt']: sortOrder === 'asc' ? 1 : -1
    }

    // Fetch all partners without pagination
    const partners = await PartnerModel.find(filter)
      .sort(sortObj)
      .lean()

    return sendSuccessResponse({
      message: 'Partners retrieved successfully',
      data: {
        partners,
        total: partners.length
      }
    })

  } catch (error: any) {
    console.error('Error fetching partners:', error)
    return sendErrorResponse({
      message: error.name === 'ZodError' 
        ? `Validation error: ${error.errors.map((e: any) => e.message).join(', ')}`
        : 'Failed to fetch partners',
      statusCode: error.name === 'ZodError' ? 400 : 500
    })
  }
}

// POST /api/admin/partners - Create new partner
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    await checkPermission(request)
    

    await connectToDatabase()

    // Parse and validate request body
    const body = await request.json()
    const validatedData = partnerCreateSchema.parse(body) as PartnerCreate

    // Check if partner with email or phone already exists
    const existingPartner = await PartnerModel.findOne({
      $or: [
        { email: validatedData.email },
        { phone: validatedData.phone }
      ]
    })

    if (existingPartner) {
      return sendErrorResponse({ message: 'Partner with this email or phone already exists', statusCode: 409 })
    }

    // Create new partner
    const newPartner = new PartnerModel({
      ...validatedData,
      isActive: true
    })

    await newPartner.save()

    return sendSuccessResponse({
      message: 'Partner created successfully',
      data: newPartner,
      statusCode: 201
    })

  } catch (error: any) {
    console.error('Error creating partner:', error)
    return sendErrorResponse({
      message: error.name === 'ZodError' 
        ? `Validation error: ${error.errors.map((e: any) => e.message).join(', ')}`
        : 'Failed to create partner',
      statusCode: error.name === 'ZodError' ? 400 : 500
    })
  }
}