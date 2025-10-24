import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import { PartnerModel, BikeModel } from '@/lib/database'
import { AuthUtils, checkPermission } from '@/lib/auth'
import { sendSuccessResponse, sendErrorResponse } from '@/lib/utils/responseUtils'
import { isValidObjectId } from 'mongoose'
import { Partner } from '@/lib/models'

// GET /api/admin/partners/[id]/analytics - Get partner earnings and analytics
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    await checkPermission(request)

    await connectToDatabase()

    const { id } = params

    // Validate ObjectId
    if (!isValidObjectId(id)) {
      return sendErrorResponse({ message: 'Invalid partner ID', statusCode: 400 })
    }

    // Find partner
    const partner = await PartnerModel.findById(id).select('-__v').lean() as Partner | null

    if (!partner) {
      return sendErrorResponse({ message: 'Partner not found', statusCode: 404 })
    }

    // Find all bikes where this partner has a share
    const bikesWithPartner = await BikeModel.find({
      'partners.partnerId': id
    }).select('title brand model year price status partners createdAt updatedAt').populate('partners.partnerId').lean()

    // Calculate analytics
    let totalEarnings = 0
    let totalBikes = bikesWithPartner.length
    let soldBikes = 0
    let activeBikes = 0
    let totalInvestment = 0

    const bikeAnalytics = bikesWithPartner.map(bike => {
      // Find this partner's share in the bike
      const partnerShare = bike.partners?.find((p: { partnerId: Partner }) => p.partnerId.toString() === id)
      const sharePercentage = partnerShare?.percentage || 0
      const shareAmount = (bike.price * sharePercentage) / 100

      // Calculate earnings based on bike status
      let earnings = 0
      if (bike.status === 'sold') {
        earnings = shareAmount
        soldBikes++
      } else if (bike.status === 'active' || bike.status === 'available') {
        activeBikes++
      }

      totalEarnings += earnings
      totalInvestment += shareAmount

      return {
        bikeId: bike._id,
        title: bike.title,
        brand: bike.brand,
        model: bike.model,
        year: bike.year,
        price: bike.price,
        status: bike.status,
        sharePercentage,
        shareAmount,
        earnings,
        createdAt: bike.createdAt,
        updatedAt: bike.updatedAt
      }
    })

    // Calculate additional metrics
    const averageSharePercentage = totalBikes > 0 
      ? bikeAnalytics.reduce((sum, bike) => sum + bike.sharePercentage, 0) / totalBikes 
      : 0

    const averageEarningsPerBike = soldBikes > 0 ? totalEarnings / soldBikes : 0

    // Calculate monthly earnings (last 12 months)
    const monthlyEarnings = []
    const currentDate = new Date()
    
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0)
      
      const monthlyBikes = bikeAnalytics.filter(bike => {
        const bikeDate = new Date(bike.updatedAt)
        return bike.status === 'sold' && bikeDate >= monthStart && bikeDate <= monthEnd
      })

      const monthlyTotal = monthlyBikes.reduce((sum, bike) => sum + bike.earnings, 0)

      monthlyEarnings.push({
        month: monthStart.toISOString().substring(0, 7), // YYYY-MM format
        earnings: monthlyTotal,
        bikesSold: monthlyBikes.length
      })
    }

    // Calculate brand-wise analytics
    const brandAnalytics = bikeAnalytics.reduce((acc, bike) => {
      if (!acc[bike.brand]) {
        acc[bike.brand] = {
          brand: bike.brand,
          totalBikes: 0,
          soldBikes: 0,
          activeBikes: 0,
          totalEarnings: 0,
          totalInvestment: 0
        }
      }

      acc[bike.brand].totalBikes++
      acc[bike.brand].totalEarnings += bike.earnings
      acc[bike.brand].totalInvestment += bike.shareAmount

      if (bike.status === 'sold') {
        acc[bike.brand].soldBikes++
      } else if (bike.status === 'active' || bike.status === 'available') {
        acc[bike.brand].activeBikes++
      }

      return acc
    }, {} as Record<string, any>)

    const analytics = {
      partner: {
        id: partner?._id,
        name: partner?.name,
        phone: partner?.phone,
        email: partner?.email,
        isActive: partner?.isActive
      },
      summary: {
        totalBikes,
        soldBikes,
        activeBikes,
        totalEarnings,
        totalInvestment,
        averageSharePercentage: Math.round(averageSharePercentage * 100) / 100,
        averageEarningsPerBike: Math.round(averageEarningsPerBike * 100) / 100,
        profitMargin: totalInvestment > 0 ? Math.round((totalEarnings / totalInvestment) * 10000) / 100 : 0
      },
      monthlyEarnings,
      brandAnalytics: Object.values(brandAnalytics),
      bikeAnalytics: bikeAnalytics.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    return sendSuccessResponse({
      message: 'Partner analytics retrieved successfully',
      data: analytics
    })

  } catch (error: any) {
    console.error('Error fetching partner analytics:', error)
    return sendErrorResponse({ message: 'Failed to fetch partner analytics', statusCode: 500 })
  }
}