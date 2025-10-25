import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import { PurchaseOrderModel, BikeModel, PartnerModel } from '@/lib/database';
import { checkPermission } from '@/lib/auth';
import { sendSuccessResponse, sendErrorResponse } from '@/lib/api-utils';
import { purchaseOrderCreateSchema, purchaseOrderQuerySchema } from '@/lib/validations';

// GET - Fetch all purchase orders with filtering and pagination
export async function GET(request: NextRequest) {
  try {
     await checkPermission(request);


    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const queryData = {
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10',
      status: searchParams.get('status') || undefined,
      partnerId: searchParams.get('partnerId') || undefined,
      bikeId: searchParams.get('bikeId') || undefined,
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: searchParams.get('sortOrder') || 'desc',
    };

    const validatedQuery = purchaseOrderQuerySchema.parse(queryData);
    
    const page = parseInt(validatedQuery.page);
    const limit = parseInt(validatedQuery.limit);
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};
    if (validatedQuery.status) filter.status = validatedQuery.status;
    if (validatedQuery.paymentStatus) filter.paymentStatus = validatedQuery.paymentStatus;
    if (validatedQuery.bikeId) filter.bikeId = validatedQuery.bikeId;

    // Build sort object
    const sort: any = {};
    sort[validatedQuery.sortBy] = validatedQuery.sortOrder === 'asc' ? 1 : -1;

    const [purchaseOrders, total] = await Promise.all([
      PurchaseOrderModel.find(filter)
        .populate('bikeId', 'make model year price')
        .populate('partnersProfit.partnerId', 'name email phone')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      PurchaseOrderModel.countDocuments(filter)
    ]);

    // Calculate total partner profit for each purchase order
    const purchaseOrdersWithCalculations = purchaseOrders.map(order => {
      const totalPartnerProfit = order.partnersProfit?.reduce((sum: number, partner: any) => sum + (partner.profit || 0), 0) || 0;
      const netProfit = order.profit - totalPartnerProfit;

      return {
        ...order,
        totalPartnerProfit,
        netProfit
      };
    });

    const totalPages = Math.ceil(total / limit);

    return sendSuccessResponse({
      purchaseOrders: purchaseOrdersWithCalculations,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    return sendErrorResponse('Failed to fetch purchase orders', 500);
  }
}

// POST - Create new purchase order
export async function POST(request: NextRequest) {
  try {
     await checkPermission(request);


    await connectToDatabase();

    const body = await request.json();
    const validatedData = purchaseOrderCreateSchema.parse(body);

    // Verify bike exists and get its details
    const bike = await BikeModel.findById(validatedData.bikeId);
    if (!bike) {
      return sendErrorResponse('Bike not found', 404);
    }

    // Verify partners exist if partnersProfit is provided
    if (validatedData.partnersProfit && validatedData.partnersProfit.length > 0) {
      for (const partnerProfit of validatedData.partnersProfit) {
        const partner = await PartnerModel.findById(partnerProfit.partnerId);
        if (!partner) {
          return sendErrorResponse(`Partner with ID ${partnerProfit.partnerId} not found`, 404);
        }
      }
    }

    // Create purchase order
    const purchaseOrder = new PurchaseOrderModel({
      ...validatedData,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await purchaseOrder.save();

    // Populate the created purchase order
    const populatedPurchaseOrder = await PurchaseOrderModel.findById(purchaseOrder._id)
      .populate('bikeId', 'make model year price')
      .populate('partnersProfit.partnerId', 'name email phone')
      .lean();

    return sendSuccessResponse({
      message: 'Purchase order created successfully',
      purchaseOrder: populatedPurchaseOrder
    }, 201);

  } catch (error) {
    console.error('Error creating purchase order:', error);
    if (error.name === 'ZodError') {
      return sendErrorResponse('Validation failed: ' + error.errors.map((e: any) => e.message).join(', '), 400);
    }
    return sendErrorResponse('Failed to create purchase order', 500);
  }
}