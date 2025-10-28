import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import { PurchaseOrderModel, BikeModel, PartnerModel } from '@/lib/database';
import { checkPermission } from '@/lib/auth';
import { sendSuccessResponse, sendErrorResponse } from '@/lib/api-utils/responseUtils';
import { purchaseOrderCreateSchema, purchaseOrderQuerySchema } from '@/lib/validations';

// GET - Fetch all purchase orders with filtering and pagination
export async function GET(request: NextRequest) {
  try {
     await checkPermission(request);


    await connectToDatabase();

    const { searchParams } = new URL(request.url);

    // Parse known query params via Zod
    const validatedQuery = purchaseOrderQuerySchema.parse({
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '50',
      search: searchParams.get('search') || undefined,
      status: searchParams.get('status') || undefined,
      paymentStatus: searchParams.get('paymentStatus') || undefined,
      paymentMethod: searchParams.get('paymentMethod') || undefined,
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: searchParams.get('sortOrder') || 'desc',
    });

    // Extra filters not covered by schema
    const bikeId = searchParams.get('bikeId') || undefined;
    const partnerId = searchParams.get('partnerId') || undefined;

    const page = validatedQuery.page as number;
    const limit = validatedQuery.limit as number;
    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = {};

    if (validatedQuery.status) filter.status = validatedQuery.status;
    if (validatedQuery.paymentStatus) filter.paymentStatus = validatedQuery.paymentStatus;
    if (validatedQuery.paymentMethod) filter.paymentMethod = validatedQuery.paymentMethod;
    if (bikeId) filter.bikeId = bikeId;
    if (partnerId) filter['partnersProfit.partnerId'] = partnerId;

    if (validatedQuery.search) {
      const s = validatedQuery.search;
      filter.$or = [
        { buyerName: { $regex: s, $options: 'i' } },
        { buyerPhone: { $regex: s, $options: 'i' } },
        { buyerEmail: { $regex: s, $options: 'i' } },
        { buyerAddress: { $regex: s, $options: 'i' } },
        { notes: { $regex: s, $options: 'i' } },
      ];
    }

    // Sort
    const sort: Record<string, 1 | -1> = {
      [validatedQuery.sortBy]: validatedQuery.sortOrder === 'asc' ? 1 : -1,
    };

    const [purchaseOrders, total] = await Promise.all([
      PurchaseOrderModel.find(filter)
        .populate('bikeId', 'brand model year price')
        .populate('partnersProfit.partnerId', 'name email phone')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      PurchaseOrderModel.countDocuments(filter),
    ]);

    const purchaseOrdersWithCalculations = purchaseOrders.map(order => {
      const totalPartnerProfit = Array.isArray(order.partnersProfit)
        ? order.partnersProfit.reduce((sum: number, p: any) => sum + (p.profit || 0), 0)
        : 0;
      const netProfit = (order.profit || 0) - totalPartnerProfit;

      return {
        ...order,
        totalPartnerProfit,
        netProfit,
      };
    });

    const totalPages = Math.ceil(total / limit);

    return sendSuccessResponse({
      statusCode: 200,
      message: 'Purchase orders fetched successfully',
      data: {
        purchaseOrders: purchaseOrdersWithCalculations,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });

  } catch (error: any) {
    console.error('Error fetching purchase orders:', error);
    return sendErrorResponse({
      statusCode: error?.name === 'ZodError' ? 400 : 500,
      message:
        error?.name === 'ZodError'
          ? `Validation error: ${error.errors?.map((e: any) => e.message).join(', ')}`
          : 'Failed to fetch purchase orders',
    });
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
      return sendErrorResponse({
        statusCode: 404,
        message: 'Bike not found',
      });
    }

    // Verify partners exist if partnersProfit is provided
    if (validatedData.partnersProfit && validatedData.partnersProfit.length > 0) {
      for (const partnerProfit of validatedData.partnersProfit) {
        const partner = await PartnerModel.findById(partnerProfit.partnerId);
        if (!partner) {
          return sendErrorResponse({
            statusCode: 404,
            message: `Partner with ID ${partnerProfit.partnerId} not found`
          });
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
      statusCode: 201,
      message: 'Purchase order created successfully',
      data: {...populatedPurchaseOrder}
    });

  } catch (error: unknown) {
    console.error('Error creating purchase order:', error);
    if (error instanceof Error && error.name === 'ZodError') {
      return sendErrorResponse({
        statusCode: 400,
        message: 'Validation failed: ' + (error as any).errors.map((e: any) => e.message).join(', '),
      });
    }
    return sendErrorResponse({
      statusCode: 500,
      message: 'Failed to create purchase order',
    });
  }
}