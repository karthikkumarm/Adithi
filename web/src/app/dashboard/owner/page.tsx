'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  IndianRupee,
  Users,
  CreditCard,
  TrendingUp,
  Activity,
  Eye,
  Download,
  Filter,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle
} from 'lucide-react';
import { formatCurrency, formatDate, getStatusBadgeColor } from '@/lib/utils';
import { analyticsAPI, retailersAPI } from '@/lib/api';

// Mock data - replace with actual API calls
const mockDashboardData = {
  totalRevenue: 2847592,
  previousRevenue: 2634871,
  totalTransactions: 15647,
  previousTransactions: 14523,
  activeRetailers: 342,
  previousRetailers: 318,
  averageTransaction: 182.5,
  previousAverage: 173.2,
  revenueChart: [
    { date: 'Jan', revenue: 234000, transactions: 1250, commission: 8190 },
    { date: 'Feb', revenue: 267000, transactions: 1456, commission: 9345 },
    { date: 'Mar', revenue: 312000, transactions: 1678, commission: 10920 },
    { date: 'Apr', revenue: 289000, transactions: 1534, commission: 10115 },
    { date: 'May', revenue: 356000, transactions: 1890, commission: 12460 },
    { date: 'Jun', revenue: 398000, transactions: 2134, commission: 13930 },
  ],
  topRetailers: [
    { id: '1', name: 'TechMart Electronics', revenue: 45600, transactions: 234, growth: 12.5, status: 'active' },
    { id: '2', name: 'Fashion Hub', revenue: 38900, transactions: 189, growth: -2.1, status: 'active' },
    { id: '3', name: 'Sports Central', revenue: 34200, transactions: 167, growth: 8.7, status: 'active' },
    { id: '4', name: 'Book Haven', revenue: 28700, transactions: 134, growth: 15.3, status: 'active' },
    { id: '5', name: 'Gadget Zone', revenue: 25100, transactions: 121, growth: 5.6, status: 'pending' },
  ],
  recentActivity: [
    { id: '1', type: 'payment', message: 'New payment processed by TechMart', amount: 1250, time: '2 min ago' },
    { id: '2', type: 'retailer', message: 'Fashion Hub requested payout', amount: 5600, time: '5 min ago' },
    { id: '3', type: 'alert', message: 'High volume detected - Sports Central', amount: 8900, time: '8 min ago' },
    { id: '4', type: 'payment', message: 'Refund issued for transaction #TXN789', amount: -340, time: '12 min ago' },
  ]
};

export default function OwnerDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('7d');
  const [dashboardData, setDashboardData] = useState(mockDashboardData);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Replace with actual API calls
        // const [stats, revenue, retailers] = await Promise.all([
        //   analyticsAPI.getDashboardStats(),
        //   analyticsAPI.getRevenueChart(timeframe),
        //   retailersAPI.getRetailers({ limit: 5, sortBy: 'revenue' })
        // ]);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDashboardData(mockDashboardData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeframe]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl font-bold text-text-primary neon-text mb-2">
              Business Overview
            </h1>
            <p className="text-text-secondary">
              Welcome back! Here's what's happening with your payment network.
            </p>
          </motion.div>

          <motion.div
            className="flex items-center space-x-3 mt-4 lg:mt-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center space-x-1 bg-surface-1 rounded-lg p-1">
              {['24h', '7d', '30d', '90d'].map((period) => (
                <Button
                  key={period}
                  variant={timeframe === period ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setTimeframe(period)}
                  className={timeframe === period ? 'btn-primary' : ''}
                >
                  {period}
                </Button>
              ))}
            </div>
            <Button variant="outline" className="btn-secondary">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </motion.div>
        </div>

        {/* Metrics Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <MetricCard
            title="Total Revenue"
            value={dashboardData.totalRevenue}
            previousValue={dashboardData.previousRevenue}
            icon={IndianRupee}
            color="cyan"
            format="currency"
            description="Gross payment volume"
            isLoading={isLoading}
          />
          <MetricCard
            title="Total Transactions"
            value={dashboardData.totalTransactions}
            previousValue={dashboardData.previousTransactions}
            icon={CreditCard}
            color="neon"
            format="number"
            description="Successful payments"
            isLoading={isLoading}
          />
          <MetricCard
            title="Active Retailers"
            value={dashboardData.activeRetailers}
            previousValue={dashboardData.previousRetailers}
            icon={Users}
            color="purple"
            format="number"
            description="Verified merchants"
            isLoading={isLoading}
          />
          <MetricCard
            title="Average Transaction"
            value={dashboardData.averageTransaction}
            previousValue={dashboardData.previousAverage}
            icon={TrendingUp}
            color="orange"
            format="currency"
            description="Per transaction value"
            isLoading={isLoading}
          />
        </motion.div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <RevenueChart
              data={dashboardData.revenueChart}
              type="area"
              title="Revenue & Commission Trends"
              isLoading={isLoading}
            />
          </motion.div>

          {/* Transaction Volume */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <RevenueChart
              data={dashboardData.revenueChart}
              type="composed"
              title="Transaction Volume Analysis"
              isLoading={isLoading}
            />
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Retailers */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="cyber-card">
              <CardHeader className="border-b border-border-primary">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-text-primary">Top Performing Retailers</CardTitle>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="data-table">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border-primary">
                        <th className="text-left p-4 text-sm font-medium text-text-secondary">Retailer</th>
                        <th className="text-left p-4 text-sm font-medium text-text-secondary">Revenue</th>
                        <th className="text-left p-4 text-sm font-medium text-text-secondary">Transactions</th>
                        <th className="text-left p-4 text-sm font-medium text-text-secondary">Growth</th>
                        <th className="text-left p-4 text-sm font-medium text-text-secondary">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.topRetailers.map((retailer) => (
                        <tr key={retailer.id} className="border-b border-border-primary/50 hover:bg-surface-1 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-accent-purple to-accent-pink rounded-full flex items-center justify-center">
                                <span className="text-white font-medium text-sm">
                                  {retailer.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-text-primary">{retailer.name}</p>
                                <p className="text-sm text-text-tertiary">ID: {retailer.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium text-text-primary">
                              {formatCurrency(retailer.revenue)}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-text-secondary">
                              {retailer.transactions.toLocaleString()}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className={`flex items-center space-x-1 ${
                              retailer.growth >= 0 ? 'text-accent-neon' : 'text-red-400'
                            }`}>
                              {retailer.growth >= 0 ? (
                                <ArrowUpRight className="w-4 h-4" />
                              ) : (
                                <ArrowDownRight className="w-4 h-4" />
                              )}
                              <span>{Math.abs(retailer.growth)}%</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${
                              getStatusBadgeColor(retailer.status)
                            }`}>
                              {retailer.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="cyber-card">
              <CardHeader className="border-b border-border-primary">
                <CardTitle className="text-text-primary flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-accent-cyan" />
                  Live Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {dashboardData.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-surface-1 hover:bg-surface-2 transition-colors">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'payment' ? 'bg-accent-neon' :
                        activity.type === 'retailer' ? 'bg-accent-cyan' :
                        'bg-accent-orange'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-text-primary mb-1">
                          {activity.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${
                            activity.amount >= 0 ? 'text-accent-neon' : 'text-red-400'
                          }`}>
                            {activity.amount >= 0 ? '+' : ''}
                            {formatCurrency(activity.amount)}
                          </span>
                          <span className="text-xs text-text-tertiary">
                            {activity.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button variant="ghost" className="w-full mt-4 text-accent-cyan hover:text-accent-neon">
                  View All Activity
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="text-text-primary flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-accent-neon" />
                  System Health & Performance
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-accent-neon rounded-full animate-pulse" />
                  <span className="text-sm text-accent-neon">All Systems Operational</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-neon mb-1">99.9%</div>
                  <div className="text-sm text-text-secondary">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-cyan mb-1">2.4s</div>
                  <div className="text-sm text-text-secondary">Avg Response</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-purple mb-1">1,247</div>
                  <div className="text-sm text-text-secondary">Active Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-orange mb-1">23</div>
                  <div className="text-sm text-text-secondary">Processing Queue</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}