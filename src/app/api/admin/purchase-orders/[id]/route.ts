import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import { PurchaseOrderModel, BikeModel, PartnerModel } from '@/lib/database';
import { checkPermission } from '@/lib/auth';
import { sendSuccessResponse, sendErrorResponse } from '@/lib/api-utils';
import { purchaseOrderUpdateSchema, purchaseOrderStatusUpdateSchema, purchaseOrderPaymentUpdateSchema } from '@/lib/validations';

// GET - Fetch single purchase order by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const permissionCheck = await checkPermission(request);
    if (!permissionCheck.success) {
      return sendErrorResponse(permissionCheck.message, 401);
    }

    await connectToDatabase();

    const purchaseOrder = await PurchaseOrderModel.findById(params.id)
      .populate('bikeId', 'make model year price specifications images')
      .populate('partnersProfit.partnerId', 'name email phone address')
      .lean();

    if (!purchaseOrder) {
      return sendErrorResponse('Purchase order not found', 404);
    }

    // Calculate total partner profit
    const totalPartnerProfit = purchaseOrder.partnersProfit?.reduce((sum: number, partner: any) => sum + (partner.profit || 0), 0) || 0;
    const netProfit = purchaseOrder.profit - totalPartnerProfit;

    const purchaseOrderWithCalculations = {
      ...purchaseOrder,
      totalPartnerProfit,
      netProfit
    };

    return sendSuccessResponse({ purchaseOrder: purchaseOrderWithCalculations });

  } catch (error) {
    console.error('Error fetching purchase order:', error);
    return sendErrorResponse('Failed to fetch purchase order', 500);
  }
}

// PUT - Update purchase order
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const permissionCheck = await checkPermission(request);
    if (!permissionCheck.success) {
      return sendErrorResponse(permissionCheck.message, 401);
    }

    await connectToDatabase();

    const body = await request.json();
    const { updateType, ...updateData } = body;

    let validatedData;
    
    // Handle different types of updates
    if (updateType === 'status') {
      validatedData = purchaseOrderStatusUpdateSchema.parse(updateData);
    } else if (updateType === 'payment') {
      validatedData = purchaseOrderPaymentUpdateSchema.parse(updateData);
    } else {
      validatedData = purchaseOrderUpdateSchema.parse(updateData);
    }

    // Check if purchase order exists
    const existingPurchaseOrder = await PurchaseOrderModel.findById(params.id);
    if (!existingPurchaseOrder) {
      return sendErrorResponse('Purchase order not found', 404);
    }

    // If updating bikeId, verify it exists
    if (validatedData.bikeId && validatedData.bikeId !== existingPurchaseOrder.bikeId?.toString()) {
      const bike = await BikeModel.findById(validatedData.bikeId);
      if (!bike) {
        return sendErrorResponse('Bike not found', 404);
      }
    }

    // If updating partnersProfit, verify partners exist
    if (validatedData.partnersProfit && validatedData.partnersProfit.length > 0) {
      for (const partnerProfit of validatedData.partnersProfit) {
        const partner = await PartnerModel.findById(partnerProfit.partnerId);
        if (!partner) {
          return sendErrorResponse(`Partner with ID ${partnerProfit.partnerId} not found`, 404);
        }
      }
    }

    // Update purchase order
    const updateObject = {
      ...validatedData,
      updatedAt: new Date()
    };

    const updatedPurchaseOrder = await PurchaseOrderModel.findByIdAndUpdate(
      params.id,
      updateObject,
      { new: true, runValidators: true }
    )
      .populate('bikeId', 'make model year price')
      .populate('partnersProfit.partnerId', 'name email phone')
      .lean();

    return sendSuccessResponse({
      message: 'Purchase order updated successfully',
      purchaseOrder: updatedPurchaseOrder
    });

  } catch (error) {
    console.error('Error updating purchase order:', error);
    if (error.name === 'ZodError') {
      return sendErrorResponse('Validation failed: ' + error.errors.map(e => e.message).join(', '), 400);
    }
    return sendErrorResponse('Failed to update purchase order', 500);
  }
}

// DELETE - Delete purchase order
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const permissionCheck = await checkPermission(request);
    if (!permissionCheck.success) {
      return sendErrorResponse(permissionCheck.message, 401);
    }

    await connectToDatabase();

    const purchaseOrder = await PurchaseOrderModel.findById(params.id);
    if (!purchaseOrder) {
      return sendErrorResponse('Purchase order not found', 404);
    }

    // Check if purchase order can be deleted (e.g., not if it's completed)
    if (purchaseOrder.status === 'completed') {
      return sendErrorResponse('Cannot delete completed purchase order', 400);
    }

    await PurchaseOrderModel.findByIdAndDelete(params.id);

    return sendSuccessResponse({
      message: 'Purchase order deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting purchase order:', error);
    return sendErrorResponse('Failed to delete purchase order', 500);
  }
}