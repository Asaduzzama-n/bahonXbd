import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase, BikeModel, PurchaseOrderModel } from '@/lib/database'
import { AuthUtils } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify token
    const decoded = await AuthUtils.verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    await connectToDatabase()

    const userId = decoded.userId

    // Get bike statistics using Mongoose
    const totalListings = await BikeModel.countDocuments({ 
      sellerId: userId 
    })

    const activeBikes = await BikeModel.countDocuments({ 
      sellerId: userId,
      status: 'active',
      isActive: true
    })

    const soldBikes = await BikeModel.countDocuments({ 
      sellerId: userId,
      status: 'sold'
    })

    // Get order statistics (as buyer) using Mongoose
    const totalOrders = await PurchaseOrderModel.countDocuments({ 
      buyerId: userId 
    })

    // Calculate total earnings (as seller) using Mongoose
    const earningsResult = await PurchaseOrderModel.aggregate([
      {
        $match: {
          sellerId: userId,
          status: 'completed',
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: '$amount' }
        }
      }
    ])

    const totalEarnings = earningsResult.length > 0 ? earningsResult[0].totalEarnings : 0

    const stats = {
      totalListings,
      activeBikes,
      soldBikes,
      totalOrders,
      totalEarnings
    }

    return NextResponse.json(stats, { status: 200 })

  } catch (error) {
    console.error('Get user stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}