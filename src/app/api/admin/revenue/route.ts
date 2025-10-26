import { NextRequest } from 'next/server'
import { connectToDatabase, PurchaseOrderModel } from '@/lib/database'
import { checkPermission } from '@/lib/auth'
import { sendErrorResponse, sendSuccessResponse } from '@/lib/api-utils/responseUtils'

// GET /api/admin/revenue?year=YYYY
// Returns 12 months of data for the given year with orders, total revenue, and admin profit
export async function GET(request: NextRequest) {
  try {
    await checkPermission(request)
    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const yearParam = searchParams.get('year')
    const now = new Date()
    const year = yearParam ? parseInt(yearParam, 10) : now.getFullYear()
    if (isNaN(year) || year < 1970 || year > 3000) {
      return sendErrorResponse({ statusCode: 400, message: 'Invalid year parameter' })
    }

    const yearStart = new Date(year, 0, 1)
    const yearEnd = new Date(year + 1, 0, 1)

    // Use confirmed orders to reflect actual sales and realized revenue/profit
    const orders = await PurchaseOrderModel.find({
      createdAt: { $gte: yearStart, $lt: yearEnd },
      status: 'confirmed',
    }).lean()

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    const months = Array.from({ length: 12 }, (_, m) => {
      const monthStart = new Date(year, m, 1)
      const monthEnd = new Date(year, m + 1, 1)

      const monthOrders = orders.filter((o: any) => {
        const d = new Date(o.createdAt)
        return d >= monthStart && d < monthEnd
      })

      const stats = monthOrders.reduce(
        (acc: { orders: number; revenue: number; adminProfit: number }, order: any) => {
          const amount = order.amount || 0
          const profit = order.profit || 0
          const totalPartnerProfit = (order.partnersProfit || []).reduce(
            (sum: number, partner: any) => sum + (partner.profit || 0),
            0
          )
          const adminProfit = profit - totalPartnerProfit

          acc.orders += 1
          acc.revenue += amount
          acc.adminProfit += adminProfit
          return acc
        },
        { orders: 0, revenue: 0, adminProfit: 0 }
      )

      return {
        month: monthNames[m],
        ...stats,
      }
    })

    return sendSuccessResponse({
      statusCode: 200,
      message: 'Yearly revenue data fetched successfully',
      data: { year, months },
    })
  } catch (error) {
    console.error('Error fetching yearly revenue:', error)
    return sendErrorResponse({ statusCode: 500, message: 'Failed to fetch yearly revenue data' })
  }
}