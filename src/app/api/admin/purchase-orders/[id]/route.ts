import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import { PurchaseOrderModel, BikeModel, PartnerModel } from '@/lib/database';
import { checkPermission } from '@/lib/auth';
import { sendSuccessResponse, sendErrorResponse } from '@/lib/api-utils/responseUtils';
import { purchaseOrderUpdateSchema, purchaseOrderStatusUpdateSchema, purchaseOrderPaymentUpdateSchema } from '@/lib/validations';
import { ZodError } from 'zod';
import handleZodError from '@/lib/errors/handleZodError';

// GET - Fetch single purchase order by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {


    await checkPermission(request);


    await connectToDatabase();

    const purchaseOrder = await PurchaseOrderModel.findById(params.id)
      .populate('bikeId', 'title brand model year price')
      .populate('partnersProfit.partnerId', 'name email phone address')
      .lean() as any;

    if (!purchaseOrder) {
      return sendErrorResponse({message: 'Purchase order not found', statusCode: 404});
    }

    // Calculate total partner profit
    const totalPartnerProfit = purchaseOrder.partnersProfit?.reduce((sum: number, partner: any) => sum + (partner.profit || 0), 0) || 0;
    const netProfit = purchaseOrder.profit - totalPartnerProfit;

    const purchaseOrderWithCalculations = {
      ...purchaseOrder,
      totalPartnerProfit,
      netProfit
    };

    return sendSuccessResponse({ data: purchaseOrderWithCalculations, message: 'Purchase order retrieved successfully', statusCode: 200 });

  } catch (error: unknown) {
    console.error('Error fetching purchase order:', error);
    return sendErrorResponse({message: 'Failed to fetch purchase order', statusCode: 500});
  }
}

// PUT - Update purchase order
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await checkPermission(request);
    
    await connectToDatabase();

    const body = await request.json();
    const { updateType, ...updateData } = body;

    let validatedData: any;
    
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
      return sendErrorResponse({message: 'Purchase order not found', statusCode: 404});
    }

    // If updating bikeId, verify it exists (only for full updates)
    if (updateType !== 'status' && updateType !== 'payment' && validatedData.bikeId && validatedData.bikeId !== existingPurchaseOrder.bikeId?.toString()) {
      const bike = await BikeModel.findById(validatedData.bikeId);
      if (!bike) {
        return sendErrorResponse({message: 'Bike not found', statusCode: 404});
      }
    }

    // If updating partnersProfit, verify partners exist (only for full updates)
    if (updateType !== 'status' && updateType !== 'payment' && validatedData.partnersProfit && validatedData.partnersProfit.length > 0) {
      for (const partnerProfit of validatedData.partnersProfit) {
        const partner = await PartnerModel.findById(partnerProfit.partnerId);
        if (!partner) {
          return sendErrorResponse({message: `Partner with ID ${partnerProfit.partnerId} not found`, statusCode: 404});
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
      .populate('bikeId', 'brand model year price')
      .populate('partnersProfit.partnerId', 'name email phone address')
      .lean();

    return sendSuccessResponse({
      message: 'Purchase order updated successfully',
      data: updatedPurchaseOrder,
      statusCode: 200
    });

  } catch (error: unknown) {
    console.error('Error updating purchase order:', error);
    if (error instanceof ZodError) {
      const zodErrorResponse = handleZodError(error);
      return sendErrorResponse({
        message: zodErrorResponse.message,
        statusCode: zodErrorResponse.statusCode
      });
    }
    return sendErrorResponse({message: 'Failed to update purchase order', statusCode: 500});
  }
}

// DELETE - Delete purchase order
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
     await checkPermission(request);


    await connectToDatabase();

    const purchaseOrder = await PurchaseOrderModel.findById(params.id);
    if (!purchaseOrder) {
      return sendErrorResponse({message: 'Purchase order not found', statusCode: 404});
    }

    // Check if purchase order can be deleted (e.g., not if it's completed)
    if (purchaseOrder.status === 'completed') {
      return sendErrorResponse({message: 'Cannot delete completed purchase order', statusCode: 400});
    }

    await PurchaseOrderModel.findByIdAndDelete(params.id);

    return sendSuccessResponse({
      message: 'Purchase order deleted successfully'
    });

  } catch (error: unknown) {
    console.error('Error deleting purchase order:', error);
    return sendErrorResponse({message: 'Failed to delete purchase order', statusCode: 500});
  }
}