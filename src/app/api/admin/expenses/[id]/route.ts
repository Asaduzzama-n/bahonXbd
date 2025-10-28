import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import { ExpensesModel, BikeModel, PartnerModel } from '@/lib/database'
import { checkPermission } from '@/lib/auth'
import { expenseUpdateSchema, type ExpenseUpdate } from '@/lib/validations'
import { sendSuccessResponse, sendErrorResponse } from '@/lib/api-utils/responseUtils'

// GET /api/admin/expenses/[id] - Get single expense
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    await checkPermission(request)
    
    await connectToDatabase()

    const expense = await ExpensesModel.findById(params.id)
      .populate('bikeId', 'title brand model year')
      .populate('partnerId', 'name')

    if (!expense) {
      return sendErrorResponse({ message: 'Expense not found', statusCode: 404 })
    }

    return sendSuccessResponse({
      message: 'Expense retrieved successfully',
      data: expense
    })

  } catch (error: any) {
    console.error('Error fetching expense:', error)
    return sendErrorResponse({
      message: 'Failed to fetch expense',
      statusCode: 500
    })
  }
}

// PUT /api/admin/expenses/[id] - Update expense
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    await checkPermission(request)
    
    await connectToDatabase()

    // Check if expense exists
    const existingExpense = await ExpensesModel.findById(params.id)
    if (!existingExpense) {
      return sendErrorResponse({ message: 'Expense not found', statusCode: 404 })
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = expenseUpdateSchema.parse(body) as ExpenseUpdate

    // If bikeId is being changed, verify new bike exists
    if (validatedData.bikeId && validatedData.bikeId !== existingExpense.bikeId.toString()) {
      const bike = await BikeModel.findById(validatedData.bikeId)
      if (!bike) {
        return sendErrorResponse({ message: 'Bike not found', statusCode: 404 })
      }

      // Remove expense from old bike's service history
      await BikeModel.findByIdAndUpdate(
        existingExpense.bikeId,
        { $pull: { serviceHistory: params.id } }
      )

      // Add expense to new bike's service history
      await BikeModel.findByIdAndUpdate(
        validatedData.bikeId,
        { $push: { serviceHistory: params.id } }
      )
    }

    // Verify partner exists if partnerId is provided
    if (validatedData.partnerId) {
      const partner = await PartnerModel.findById(validatedData.partnerId)
      if (!partner) {
        return sendErrorResponse({ message: 'Partner not found', statusCode: 404 })
      }

      // Check if partner has share in the bike
      const bikeId = validatedData.bikeId || existingExpense.bikeId
      const bike = await BikeModel.findById(bikeId)
      if (bike) {
        const hasShare = bike.partners.some((p:any) => p.partnerId.toString() === validatedData.partnerId)
        if (!hasShare) {
          return sendErrorResponse({ message: 'Partner does not have share in this bike', statusCode: 400 })
        }
      }
    }

    // Handle bike price adjustment changes
    if (validatedData.adjustBikePrice !== undefined) {
      const bikeId = validatedData.bikeId || existingExpense.bikeId
      const amount = validatedData.amount || existingExpense.amount

      if (validatedData.adjustBikePrice && !existingExpense.adjustBikePrice) {
        // Adding price adjustment
        await BikeModel.findByIdAndUpdate(
          bikeId,
          { $inc: { purchasePrice: amount } }
        )
      } else if (!validatedData.adjustBikePrice && existingExpense.adjustBikePrice) {
        // Removing price adjustment
        await BikeModel.findByIdAndUpdate(
          bikeId,
          { $inc: { purchasePrice: -existingExpense.amount } }
        )
      } else if (validatedData.adjustBikePrice && existingExpense.adjustBikePrice && validatedData.amount !== existingExpense.amount) {
        // Adjusting the amount
        const difference = amount - existingExpense.amount
        await BikeModel.findByIdAndUpdate(
          bikeId,
          { $inc: { purchasePrice: difference } }
        )
      }
    }

    // Update expense
    const updatedExpense = await ExpensesModel.findByIdAndUpdate(
      params.id,
      validatedData,
      { new: true }
    ).populate('bikeId', 'title brand model year')
     .populate('partnerId', 'name')

    return sendSuccessResponse({
      message: 'Expense updated successfully',
      data: updatedExpense
    })

  } catch (error: any) {
    console.error('Error updating expense:', error)
    return sendErrorResponse({
      message: error.name === 'ZodError' 
        ? `Validation error: ${error.errors.map((e: any) => e.message).join(', ')}`
        : 'Failed to update expense',
      statusCode: error.name === 'ZodError' ? 400 : 500
    })
  }
}

// DELETE /api/admin/expenses/[id] - Delete expense
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    await checkPermission(request)
    
    await connectToDatabase()

    // Check if expense exists
    const expense = await ExpensesModel.findById(params.id)
    if (!expense) {
      return sendErrorResponse({ message: 'Expense not found', statusCode: 404 })
    }

    // Remove expense from bike's service history
    await BikeModel.findByIdAndUpdate(
      expense.bikeId,
      { $pull: { serviceHistory: params.id } }
    )

    // Reverse bike price adjustment if it was applied
    if (expense.adjustBikePrice) {
      await BikeModel.findByIdAndUpdate(
        expense.bikeId,
        { $inc: { purchasePrice: -expense.amount } }
      )
    }

    // Delete expense
    await ExpensesModel.findByIdAndDelete(params.id)

    return sendSuccessResponse({
      message: 'Expense deleted successfully'
    })

  } catch (error: any) {
    console.error('Error deleting expense:', error)
    return sendErrorResponse({
      message: 'Failed to delete expense',
      statusCode: 500
    })
  }
}