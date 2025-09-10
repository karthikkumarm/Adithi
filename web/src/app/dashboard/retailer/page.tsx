'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  CreditCard,
  IndianRupee,
  TrendingUp,
  Clock,
  Plus,
  Eye,
  Download,
  Receipt,
  Smartphone,
  QrCode,
  Nfc,
  History
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';

// Mock data for retailer dashboard
const mockRetailerData = {
  todayRevenue: 3450,
  todayTransactions: 23,
  monthlyRevenue: 45600,
  monthlyTransactions: 342,
  pendingPayouts: 1250,
  commissionEarned: 319,
  recentTransactions: [
    { id: 'TXN001', amount: 125.50, customer: 'John Doe', time: '2 min ago', status: 'completed', method: 'card' },
    { id: 'TXN002', amount: 89.99, customer: 'Sarah Wilson', time: '15 min ago', status: 'completed', method: 'upi' },
    { id: 'TXN003', amount: 234.75, customer: 'Mike Johnson', time: '32 min ago', status: 'pending', method: 'card' },
    { id: 'TXN004', amount: 67.25, customer: 'Emily Davis', time: '1 hr ago', status: 'completed', method: 'wallet' },
    { id: 'TXN005', amount: 156.00, customer: 'Robert Brown', time: '2 hr ago', status: 'failed', method: 'card' },
  ],
  salesChart: [
    { date: 'Mon', revenue: 890, transactions: 12, commission: 6.23 },
    { date: 'Tue', revenue: 1250, transactions: 18, commission: 8.75 },
    { date: 'Wed', revenue: 980, transactions: 15, commission: 6.86 },
    { date: 'Thu', revenue: 1420, transactions: 21, commission: 9.94 },
    { date: 'Fri', revenue: 1680, transactions: 25, commission: 11.76 },
    { date: 'Sat', revenue: 2100, transactions: 32, commission: 14.70 },
    { date: 'Sun', revenue: 1890, transactions: 28, commission: 13.23 },
  ]
};

export default function RetailerDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(mockRetailerData);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setData(mockRetailerData);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleNewPayment = () => {
    router.push('/payments/new');
  };

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
              Payment Terminal
            </h1>
            <p className="text-text-secondary">
              Process payments and manage your transactions in real-time.
            </p>
          </motion.div>

          <motion.div
            className="flex items-center space-x-3 mt-4 lg:mt-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button
              onClick={handleNewPayment}
              className="btn-primary neon-glow"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Payment
            </Button>
            <Button variant="outline" className="btn-secondary">
              <QrCode className="w-5 h-5 mr-2" />
              QR Payment
            </Button>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <MetricCard
            title="Today's Sales"
            value={data.todayRevenue}
            icon={IndianRupee}
            color="cyan"
            format="currency"
            description={`${data.todayTransactions} transactions`}
            isLoading={isLoading}
          />
          <MetricCard
            title="Monthly Revenue"
            value={data.monthlyRevenue}
            icon={TrendingUp}
            color="neon"
            format="currency"
            description={`${data.monthlyTransactions} total transactions`}
            isLoading={isLoading}
          />
          <MetricCard
            title="Commission Earned"
            value={data.commissionEarned}
            icon={Receipt}
            color="purple"
            format="currency"
            description="This month"
            isLoading={isLoading}
          />
          <MetricCard
            title="Pending Payouts"
            value={data.pendingPayouts}
            icon={Clock}
            color="orange"
            format="currency"
            description="Available for withdrawal"
            isLoading={isLoading}
          />
        </motion.div>

        {/* Payment Methods Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="text-text-primary">Quick Payment Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleNewPayment}
                    variant="outline"
                    className="w-full h-24 flex-col space-y-2 border-accent-cyan/20 hover:border-accent-cyan/40 hover:bg-accent-cyan/5"
                  >
                    <CreditCard className="w-8 h-8 text-accent-cyan" />
                    <span className="text-text-primary">Card Payment</span>
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    className="w-full h-24 flex-col space-y-2 border-accent-neon/20 hover:border-accent-neon/40 hover:bg-accent-neon/5"
                  >
                    <Smartphone className="w-8 h-8 text-accent-neon" />
                    <span className="text-text-primary">Mobile Payment</span>
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    className="w-full h-24 flex-col space-y-2 border-accent-purple/20 hover:border-accent-purple/40 hover:bg-accent-purple/5"
                  >
                    <Nfc className="w-8 h-8 text-accent-purple" />
                    <span className="text-text-primary">Contactless</span>
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts and Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <RevenueChart
              data={data.salesChart}
              type="bar"
              title="7-Day Sales Performance"
              isLoading={isLoading}
            />
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="cyber-card">
              <CardHeader className="border-b border-border-primary">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-text-primary flex items-center">
                    <History className="w-5 h-5 mr-2 text-accent-cyan" />
                    Recent Transactions
                  </CardTitle>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {data.recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="p-4 border-b border-border-primary/30 hover:bg-surface-1 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-accent-cyan to-accent-neon rounded-full flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-background-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-text-primary">{transaction.customer}</p>
                            <p className="text-sm text-text-tertiary">ID: {transaction.id}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-text-primary">
                            {formatCurrency(transaction.amount)}
                          </p>
                          <p className="text-sm text-text-tertiary">{transaction.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${
                          transaction.status === 'completed' ? 'bg-accent-neon/10 text-accent-neon border-accent-neon/20' :
                          transaction.status === 'pending' ? 'bg-accent-orange/10 text-accent-orange border-accent-orange/20' :
                          'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                          {transaction.status}
                        </span>
                        <span className="text-xs text-text-tertiary uppercase">
                          {transaction.method}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}