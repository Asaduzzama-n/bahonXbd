import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import { ExpensesModel, BikeModel, PartnerModel } from '@/lib/database'
import { checkPermission } from '@/lib/auth'
import { expenseQuerySchema, expenseCreateSchema, type ExpenseQuery, type ExpenseCreate } from '@/lib/validations'
import { sendSuccessResponse, sendErrorResponse } from '@/lib/api-utils/responseUtils'

// GET /api/admin/expenses - Get all expenses with search and pagination
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    await checkPermission(request)
    
    await connectToDatabase()

    // Parse and validate query parameters
    const url = new URL(request.url)
    const queryParams = Object.fromEntries(url.searchParams.entries())
    
    const validationResult = expenseQuerySchema.safeParse(queryParams)
    if (!validationResult.success) {
      return sendErrorResponse({ message: 'Invalid query parameters', statusCode: 400 })
    }
    
    const queryData = validationResult.data
    const { search, bikeId, type, sortBy, sortOrder, page, limit } = queryData as ExpenseQuery

    // Build search filter
    const filter: any = {}
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ]
    }

    if (bikeId) {
      filter.bikeId = bikeId
    }

    if (type) {
      filter.type = type
    }

    // Create sort object
    const sortObj: Record<string, 1 | -1> = {
      [sortBy || 'date']: sortOrder === 'asc' ? 1 : -1
    }

    // Calculate pagination
    const pageNum = page || 1
    const limitNum = limit || 10
    const skip = (pageNum - 1) * limitNum

    // Get expenses with pagination
    const expenses = await ExpensesModel.find(filter)
      .populate('bikeId', 'title brand model year')
      .populate('partnerId', 'name')
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .lean()

    // Get total count for pagination
    const total = await ExpensesModel.countDocuments(filter)

    return sendSuccessResponse({
      message: 'Expenses retrieved successfully',
      data: {
        expenses,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    })

  } catch (error: any) {
    console.error('Error fetching expenses:', error)
    return sendErrorResponse({
      message: 'Failed to fetch expenses',
      statusCode: 500
    })
  }
}

// POST /api/admin/expenses - Create new expense
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    await checkPermission(request)
    
    await connectToDatabase()

    // Parse and validate request body
    const body = await request.json()
    const validatedData = expenseCreateSchema.parse(body) as ExpenseCreate

    // Verify bike exists
    const bike = await BikeModel.findById(validatedData.bikeId)
    if (!bike) {
      return sendErrorResponse({ message: 'Bike not found', statusCode: 404 })
    }

    // Verify partner exists if partnerId is provided
    if (validatedData.partnerId) {
      const partner = await PartnerModel.findById(validatedData.partnerId)
      if (!partner) {
        return sendErrorResponse({ message: 'Partner not found', statusCode: 404 })
      }

      // Check if partner has share in this bike
      const hasShare = bike.partners.some((p:any) => p.partnerId.toString() === validatedData.partnerId)
      if (!hasShare) {
        return sendErrorResponse({ message: 'Partner does not have share in this bike', statusCode: 400 })
      }
    }

    // Create new expense
    const newExpense = new ExpensesModel(validatedData)
    await newExpense.save()

    // Add expense to bike's service history
    await BikeModel.findByIdAndUpdate(
      validatedData.bikeId,
      { $push: { serviceHistory: newExpense._id } }
    )

    // Handle bike price adjustment
    if (validatedData.adjustBikePrice) {
      await BikeModel.findByIdAndUpdate(
        validatedData.bikeId,
        { $inc: { purchasePrice: validatedData.amount } }
      )
    }

    // Handle partner share adjustment
    if (validatedData.adjustPartnerShares && validatedData.partnerId) {
      // Get updated bike data
      const updatedBike = await BikeModel.findById(validatedData.bikeId)
      if (updatedBike) {
        // Find the partner and adjust their share amount
        const partnerIndex = updatedBike.partners.findIndex((p:any) => p.partnerId.toString() === validatedData.partnerId)
        if (partnerIndex !== -1) {
          const partnerPercentage = updatedBike.partners[partnerIndex].percentage
          const shareAmount = (validatedData.amount * partnerPercentage) / 100
          
          // This would require updating partner's total investment/share amount
          // For now, we'll just log this - you might want to add a field to track this
          console.log(`Partner share adjustment: ${shareAmount} for partner ${validatedData.partnerId}`)
        }
      }
    }

    // Populate the created expense
    const populatedExpense = await ExpensesModel.findById(newExpense._id)
      .populate('bikeId', 'title brand model year')
      .populate('partnerId', 'name')

    return sendSuccessResponse({
      message: 'Expense created successfully',
      data: populatedExpense,
      statusCode: 201
    })

  } catch (error: any) {
    console.error('Error creating expense:', error)
    return sendErrorResponse({
      message: error.name === 'ZodError' 
        ? `Validation error: ${error.errors.map((e: any) => e.message).join(', ')}`
        : 'Failed to create expense',
      statusCode: error.name === 'ZodError' ? 400 : 500
    })
  }
}