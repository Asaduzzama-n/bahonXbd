import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'
import { AuthUtils } from '@/lib/auth'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bike-platform'

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify token
    const decoded = AuthUtils.verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    const db = client.db()
    const bikesCollection = db.collection('bikes')
    const ordersCollection = db.collection('orders')

    const userId = decoded.userId

    // Get bike statistics
    const totalListings = await bikesCollection.countDocuments({ 
      sellerId: userId 
    })

    const activeBikes = await bikesCollection.countDocuments({ 
      sellerId: userId,
      status: 'active',
      isActive: true
    })

    const soldBikes = await bikesCollection.countDocuments({ 
      sellerId: userId,
      status: 'sold'
    })

    // Get order statistics (as buyer)
    const totalOrders = await ordersCollection.countDocuments({ 
      buyerId: userId 
    })

    // Calculate total earnings (as seller)
    const earningsResult = await ordersCollection.aggregate([
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
    ]).toArray()

    const totalEarnings = earningsResult.length > 0 ? earningsResult[0].totalEarnings : 0

    await client.close()

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