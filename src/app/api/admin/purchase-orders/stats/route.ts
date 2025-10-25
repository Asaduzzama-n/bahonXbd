import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import { PurchaseOrderModel } from '@/lib/database';
import { checkPermission } from '@/lib/auth';
import { sendSuccessResponse, sendErrorResponse } from '@/lib/api-utils';

// GET - Fetch purchase order statistics
export async function GET(request: NextRequest) {
  try {
     await checkPermission(request);


    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Get all purchase orders for calculations
    const allPurchaseOrders = await PurchaseOrderModel.find().lean();
    const recentPurchaseOrders = await PurchaseOrderModel.find({
      createdAt: { $gte: startDate }
    }).lean();

    // Calculate overall statistics
    const totalPurchaseOrders = allPurchaseOrders.length;
    const recentPurchaseOrdersCount = recentPurchaseOrders.length;

    // Status distribution
    const statusCounts = allPurchaseOrders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Financial calculations
    const financialStats = allPurchaseOrders.reduce((acc, order) => {
      const totalPartnerProfit = order.partnersProfit?.reduce((sum: number, partner: any) => sum + (partner.profit || 0), 0) || 0;
      const amount = order.amount || 0;
      const profit = order.profit || 0;
      const netProfit = profit - totalPartnerProfit;

      acc.totalRevenue += amount;
      acc.totalPartnerProfit += totalPartnerProfit;
      acc.totalProfit += profit;
      acc.totalNetProfit += netProfit;

      if (order.status === 'confirmed') {
        acc.confirmedRevenue += amount;
        acc.confirmedProfit += profit;
        acc.confirmedCount += 1;
      }

      return acc;
    }, {
      totalRevenue: 0,
      totalPartnerProfit: 0,
      totalProfit: 0,
      totalNetProfit: 0,
      confirmedRevenue: 0,
      confirmedProfit: 0,
      confirmedCount: 0
    });

    // Calculate profit margins
    const overallProfitMargin = financialStats.totalRevenue > 0 
      ? (financialStats.totalProfit / financialStats.totalRevenue) * 100 
      : 0;

    const confirmedProfitMargin = financialStats.confirmedRevenue > 0 
      ? (financialStats.confirmedProfit / financialStats.confirmedRevenue) * 100 
      : 0;

    // Recent period financial stats
    const recentFinancialStats = recentPurchaseOrders.reduce((acc, order) => {
      const totalPartnerProfit = order.partnersProfit?.reduce((sum: number, partner: any) => sum + (partner.profit || 0), 0) || 0;
      const amount = order.amount || 0;
      const profit = order.profit || 0;

      acc.revenue += amount;
      acc.partnerProfit += totalPartnerProfit;
      acc.profit += profit;

      return acc;
    }, { revenue: 0, partnerProfit: 0, profit: 0 });

    const recentProfitMargin = recentFinancialStats.revenue > 0 
      ? (recentFinancialStats.profit / recentFinancialStats.revenue) * 100 
      : 0;

    // Top performing partners (by profit)
    const partnerPerformance: Record<string, any> = {};
    
    allPurchaseOrders.forEach(order => {
      if (!order.partnersProfit || order.partnersProfit.length === 0) return;
      
      order.partnersProfit.forEach((partnerProfit: any) => {
        const partnerId = partnerProfit.partnerId.toString();
        
        if (!partnerPerformance[partnerId]) {
          partnerPerformance[partnerId] = {
            partnerId,
            totalOrders: 0,
            totalRevenue: 0,
            totalProfit: 0,
            confirmedOrders: 0
          };
        }

        partnerPerformance[partnerId].totalOrders += 1;
        partnerPerformance[partnerId].totalRevenue += order.amount || 0;
        partnerPerformance[partnerId].totalProfit += partnerProfit.profit || 0;

        if (order.status === 'confirmed') {
          partnerPerformance[partnerId].confirmedOrders += 1;
        }
      });
    });

    const topPartners = Object.values(partnerPerformance)
      .sort((a: any, b: any) => b.totalProfit - a.totalProfit)
      .slice(0, 5);

    // Monthly trends (last 6 months)
    const monthlyTrends = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date();
      monthStart.setMonth(monthStart.getMonth() - i);
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);

      const monthOrders = allPurchaseOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= monthStart && orderDate < monthEnd;
      });

      const monthStats = monthOrders.reduce((acc, order) => {
        const amount = order.amount || 0;
        const profit = order.profit || 0;

        acc.orders += 1;
        acc.revenue += amount;
        acc.profit += profit;

        return acc;
      }, { orders: 0, revenue: 0, profit: 0 });

      monthlyTrends.push({
        month: monthStart.toISOString().slice(0, 7), // YYYY-MM format
        ...monthStats
      });
    }

    return sendSuccessResponse({
      overview: {
        totalPurchaseOrders,
        recentPurchaseOrders: recentPurchaseOrdersCount,
        statusDistribution: statusCounts,
        period: `${period} days`
      },
      financial: {
        overall: {
          totalRevenue: Math.round(financialStats.totalRevenue * 100) / 100,
          totalPartnerProfit: Math.round(financialStats.totalPartnerProfit * 100) / 100,
          totalProfit: Math.round(financialStats.totalProfit * 100) / 100,
          totalNetProfit: Math.round(financialStats.totalNetProfit * 100) / 100,
          profitMargin: Math.round(overallProfitMargin * 100) / 100
        },
        confirmed: {
          count: financialStats.confirmedCount,
          revenue: Math.round(financialStats.confirmedRevenue * 100) / 100,
          profit: Math.round(financialStats.confirmedProfit * 100) / 100,
          profitMargin: Math.round(confirmedProfitMargin * 100) / 100
        },
        recent: {
          revenue: Math.round(recentFinancialStats.revenue * 100) / 100,
          partnerProfit: Math.round(recentFinancialStats.partnerProfit * 100) / 100,
          profit: Math.round(recentFinancialStats.profit * 100) / 100,
          profitMargin: Math.round(recentProfitMargin * 100) / 100
        }
      },
      topPartners,
      monthlyTrends
    });

  } catch (error) {
    console.error('Error fetching purchase order statistics:', error);
    return sendErrorResponse('Failed to fetch purchase order statistics', 500);
  }
}