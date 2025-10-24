import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase, BikeModel, PurchaseOrderModel, UserModel } from '@/lib/database'
import { PlatformStats } from '@/lib/models'

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    
    // Get current date for monthly calculations
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    // Get bike statistics
    const totalBikes = await BikeModel.countDocuments()
    const activeBikes = await BikeModel.countDocuments({ status: 'active' })
    const soldBikes = await BikeModel.countDocuments({ status: 'sold' })
    
    // Get average price of active bikes
    const avgPriceResult = await BikeModel.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: null, avgPrice: { $avg: '$price' } } }
    ])
    const averagePrice = avgPriceResult[0]?.avgPrice || 0

    // Get top selling brand
    const topBrandResult = await BikeModel.aggregate([
      { $match: { status: { $in: ['active', 'sold'] } } },
      { $group: { _id: '$brand', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ])
    const topSellingBrand = topBrandResult[0]?._id || 'N/A'

    // Get order statistics
    const totalOrders = await PurchaseOrderModel.countDocuments()
    const pendingOrders = await PurchaseOrderModel.countDocuments({ status: 'pending' })
    const completedOrders = await PurchaseOrderModel.countDocuments({ status: 'confirmed' })
    
    // Get revenue statistics
    const revenueResult = await PurchaseOrderModel.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ])
    const totalRevenue = revenueResult[0]?.total || 0

    const monthlyRevenueResult = await PurchaseOrderModel.aggregate([
      { 
        $match: { 
          status: 'confirmed',
          createdAt: { $gte: firstDayOfMonth }
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ])
    const monthlyRevenue = monthlyRevenueResult[0]?.total || 0

    // Get user statistics
    const totalUsers = await UserModel.countDocuments()
    const activeUsers = await UserModel.countDocuments({ 
      updatedAt: { $gte: firstDayOfLastMonth }
    })

    const stats: PlatformStats = {
      totalBikes,
      activeBikes,
      soldBikes,
      totalRevenue,
      monthlyRevenue,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalUsers,
      activeUsers,
      averagePrice,
      topSellingBrand
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}