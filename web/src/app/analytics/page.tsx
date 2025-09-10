'use client';

import React, { useState, useEffect, useCallback, memo, FC, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Users,
  CreditCard,
  PieChart as PieChartIcon,
  BarChart3,
  Download,
  Smartphone,
  MapPin,
  Clock,
  IndianRupee
} from 'lucide-react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

// --- Placeholder Components and Utilities to resolve import errors ---

const formatCurrency = (value: number | undefined | null): string => {
  if (value === null || typeof value === 'undefined') return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatNumber = (value: number | undefined | null): string => {
  if (value === null || typeof value === 'undefined') return '0';
  return new Intl.NumberFormat('en-IN').format(value);
};

const DummyCard: FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`border rounded-lg shadow-md bg-gray-800 border-gray-700 ${className}`}>
    {children}
  </div>
);

const Card = DummyCard;
const CardHeader: FC<{ children: ReactNode; className?: string }> = ({ children, className }) => <div className={`p-4 border-b border-gray-700 ${className}`}>{children}</div>;
const CardTitle: FC<{ children: ReactNode; className?: string }> = ({ children, className }) => <h3 className={`text-lg font-semibold text-white ${className}`}>{children}</h3>;
const CardContent: FC<{ children: ReactNode }> = ({ children }) => <div className="p-4">{children}</div>;

const Button: FC<{ children: ReactNode; variant?: string; size?: string; onClick?: () => void; className?: string }> = ({ children, onClick, className }) => (
    <button onClick={onClick} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${className}`}>
        {children}
    </button>
);

const DashboardLayout: FC<{ children: ReactNode }> = ({ children }) => <div className="p-4 md:p-6 bg-gray-900 text-white min-h-screen">{children}</div>;

const MetricCard: FC<any> = ({ title, value, description, icon: Icon, isLoading, format, previousValue, color }) => {
    const getPercentageChange = () => {
        if (!previousValue || previousValue === 0) return 0;
        return ((value - previousValue) / previousValue) * 100;
    };
    const change = getPercentageChange();
    
    const formatValue = (val: number) => {
        if (format === 'currency') return formatCurrency(val);
        if (format === 'percentage') return `${val.toFixed(1)}%`;
        return formatNumber(val);
    }

    if (isLoading) {
        return <div className="cyber-card p-4 h-40 bg-surface-1 rounded-lg animate-pulse"></div>
    }

    return (
        <Card className="cyber-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-text-secondary">{title}</CardTitle>
                <Icon className={`h-5 w-5 text-${color}-400`} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-text-primary">{formatValue(value)}</div>
                <p className="text-xs text-text-tertiary">{description}</p>
                <div className={`text-xs mt-2 ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {change >= 0 ? '▲' : '▼'} {Math.abs(change).toFixed(1)}% from last period
                </div>
            </CardContent>
        </Card>
    );
};

const RevenueChart: FC<any> = ({ title, isLoading, data }) => {
    if (isLoading) {
        return <div className="cyber-card p-4 h-80 w-full bg-surface-1 rounded-lg animate-pulse"></div>
    }
    return (
        <Card className="cyber-card">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                 <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={data}>
                         <defs>
                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis dataKey="month" stroke="#A0A3A9" fontSize={12} tick={{ fill: '#A0A3A9' }} />
                        <YAxis stroke="#A0A3A9" fontSize={12} tick={{ fill: '#A0A3A9' }} tickFormatter={(value) => `₹${Number(value) / 1000}k`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#revenueGradient)" />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
};


// --- TYPE DEFINITION for robust data handling ---
type AnalyticsData = {
  overview: {
    totalRevenue: number;
    previousRevenue: number;
    totalTransactions: number;
    previousTransactions: number;
    averageOrderValue: number;
    previousAOV: number;
    conversionRate: number;
    previousConversion: number;
  };
  revenueChart: { month: string; revenue: number; transactions: number; commission: number; refunds: number; }[];
  paymentMethods: { name: string; value: number; amount: number; color: string; }[];
  topRetailers: { name: string; revenue: number; growth: number; transactions: number; }[];
  deviceBreakdown: { device: string; percentage: number; sessions: number; }[];
  geographicData: { location: string; revenue: number; transactions: number; }[];
  hourlyData: { hour: string; transactions: number; }[];
};

// --- MOCK DATA (ensure it matches the AnalyticsData type) ---
const mockAnalyticsData: AnalyticsData = {
  overview: {
    totalRevenue: 2847592,
    previousRevenue: 2634871,
    totalTransactions: 15647,
    previousTransactions: 14523,
    averageOrderValue: 182.5,
    previousAOV: 173.2,
    conversionRate: 3.2,
    previousConversion: 2.8
  },
  revenueChart: [
    { month: 'Jan', revenue: 234000, transactions: 1250, commission: 8190, refunds: 1200 },
    { month: 'Feb', revenue: 267000, transactions: 1456, commission: 9345, refunds: 890 },
    { month: 'Mar', revenue: 312000, transactions: 1678, commission: 10920, refunds: 1340 },
    { month: 'Apr', revenue: 289000, transactions: 1534, commission: 10115, refunds: 1100 },
    { month: 'May', revenue: 356000, transactions: 1890, commission: 12460, refunds: 950 },
    { month: 'Jun', revenue: 398000, transactions: 2134, commission: 13930, refunds: 1200 },
    { month: 'Jul', revenue: 421000, transactions: 2301, commission: 14735, refunds: 1050 },
    { month: 'Aug', revenue: 445000, transactions: 2456, commission: 15575, refunds: 1150 },
  ],
  paymentMethods: [
    { name: 'Credit Card', value: 45, amount: 1280000, color: '#00D4FF' },
    { name: 'UPI', value: 30, amount: 854000, color: '#00FF88' },
    { name: 'Digital Wallet', value: 20, amount: 569000, color: '#8B5CF6' },
    { name: 'Bank Transfer', value: 5, amount: 144000, color: '#FF8C42' },
  ],
  topRetailers: [
    { name: 'TechMart Electronics', revenue: 145600, growth: 12.5, transactions: 856 },
    { name: 'Fashion Hub', revenue: 132400, growth: 8.7, transactions: 743 },
    { name: 'Sports Central', revenue: 118900, growth: -2.1, transactions: 652 },
    { name: 'Book Haven', revenue: 98700, growth: 15.3, transactions: 587 },
    { name: 'Gadget Zone', revenue: 87500, growth: 5.6, transactions: 534 },
  ],
  deviceBreakdown: [
    { device: 'Mobile', percentage: 68, sessions: 12450 },
    { device: 'Desktop', percentage: 22, sessions: 4030 },
    { device: 'Tablet', percentage: 10, sessions: 1832 },
  ],
  geographicData: [
    { location: 'New York', revenue: 456000, transactions: 2340 },
    { location: 'California', revenue: 398000, transactions: 2120 },
    { location: 'Texas', revenue: 334000, transactions: 1890 },
    { location: 'Florida', revenue: 289000, transactions: 1567 },
    { location: 'Illinois', revenue: 234000, transactions: 1290 },
  ],
  hourlyData: [
    { hour: '00', transactions: 45 }, { hour: '01', transactions: 23 }, { hour: '02', transactions: 12 }, { hour: '03', transactions: 8 }, { hour: '04', transactions: 15 }, { hour: '05', transactions: 34 }, { hour: '06', transactions: 67 }, { hour: '07', transactions: 98 }, { hour: '08', transactions: 145 }, { hour: '09', transactions: 234 }, { hour: '10', transactions: 289 }, { hour: '11', transactions: 312 }, { hour: '12', transactions: 345 }, { hour: '13', transactions: 356 }, { hour: '14', transactions: 334 }, { hour: '15', transactions: 298 }, { hour: '16', transactions: 267 }, { hour: '17', transactions: 234 }, { hour: '18', transactions: 198 }, { hour: '19', transactions: 156 }, { hour: '20', transactions: 123 }, { hour: '21', transactions: 89 }, { hour: '22', transactions: 67 }, { hour: '23', transactions: 45 },
  ]
};

// --- INITIAL STATE for safe rendering before data fetch ---
const initialState: AnalyticsData = {
  overview: { totalRevenue: 0, previousRevenue: 0, totalTransactions: 0, previousTransactions: 0, averageOrderValue: 0, previousAOV: 0, conversionRate: 0, previousConversion: 0 },
  revenueChart: [],
  paymentMethods: [],
  topRetailers: [],
  deviceBreakdown: [],
  geographicData: [],
  hourlyData: []
};

// --- ANIMATION VARIANTS for a cleaner, staggered effect ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

// --- MEMOIZED TOOLTIP for performance optimization ---
const CustomTooltip = memo(({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="cyber-card p-4 border border-accent-cyan/20 backdrop-blur-xl rounded-lg shadow-lg bg-gray-800/80">
        <p className="text-text-primary font-medium mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`tooltip-item-${index}`} className="text-sm" style={{ color: entry.stroke || entry.payload.fill || entry.color }}>
            {entry.name}: {
              entry.name.toLowerCase().includes('revenue') || entry.name.toLowerCase().includes('commission')
                ? formatCurrency(entry.value)
                : entry.value.toLocaleString()
            }
          </p>
        ))}
      </div>
    );
  }
  return null;
});
CustomTooltip.displayName = 'CustomTooltip';


export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>(initialState);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  // --- useCallback for performance ---
  const fetchAnalyticsData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      setData(mockAnalyticsData);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array as it doesn't depend on props/state

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange, fetchAnalyticsData]);

  return (
    <DashboardLayout>
      <motion.div 
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div className="flex flex-col lg:flex-row lg:items-center lg:justify-between" variants={itemVariants}>
            <div>
              <h1 className="text-3xl font-bold text-text-primary neon-text mb-2">
                Business Analytics
              </h1>
              <p className="text-text-secondary">
                Comprehensive insights into your payment ecosystem
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <div className="relative flex items-center space-x-1 bg-surface-1 rounded-lg p-1">
                {['7d', '30d', '90d', '1y'].map((period) => (
                  <Button
                    key={period}
                    variant={'ghost'}
                    size="sm"
                    onClick={() => setTimeRange(period)}
                    className="relative z-10 transition-colors duration-300"
                  >
                    <span className={timeRange === period ? 'text-black' : 'text-white'}>{period}</span>
                  </Button>
                ))}
                 <motion.div
                    className="absolute h-full bg-cyan-400 rounded-md"
                    layoutId="active-period-indicator"
                    initial={false}
                    animate={{ 
                        x: ['7d', '30d', '90d', '1y'].indexOf(timeRange) * (100 / 4) + '%',
                        width: '25%'
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
              </div>
              <Button variant="outline" className="btn-secondary">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={itemVariants}
        >
          <MetricCard title="Total Revenue" value={data.overview.totalRevenue} previousValue={data.overview.previousRevenue} icon={IndianRupee} color="cyan" format="currency" description="Gross payment volume" isLoading={isLoading} />
          <MetricCard title="Total Transactions" value={data.overview.totalTransactions} previousValue={data.overview.previousTransactions} icon={CreditCard} color="neon" format="number" description="Successful payments" isLoading={isLoading} />
          <MetricCard title="Average Order Value" value={data.overview.averageOrderValue} previousValue={data.overview.previousAOV} icon={TrendingUp} color="purple" format="currency" description="Per transaction" isLoading={isLoading} />
          <MetricCard title="Conversion Rate" value={data.overview.conversionRate} previousValue={data.overview.previousConversion} icon={BarChart3} color="orange" format="percentage" description="Payment success rate" isLoading={isLoading} />
        </motion.div>

        {/* Revenue Trends */}
        <motion.div variants={itemVariants}>
          <RevenueChart data={data.revenueChart} type="composed" title="Revenue, Transactions & Refunds Trend" isLoading={isLoading} />
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Methods Breakdown */}
          <motion.div variants={itemVariants}>
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="text-text-primary flex items-center">
                  <PieChartIcon className="w-5 h-5 mr-2 text-accent-cyan" />
                  Payment Methods Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnimatePresence>
                  {isLoading ? (
                    <div className="h-[28rem] lg:h-64 flex items-center justify-center">
                      <div className="w-48 h-48 border-4 border-dashed border-gray-600 rounded-full animate-spin"></div>
                    </div>
                  ) : (
                  <div className="flex flex-col lg:flex-row items-center">
                    <div className="w-full lg:w-1/2 h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie data={data.paymentMethods} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                            {data.paymentMethods.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip content={
                              ({ active, payload }: { active?: boolean, payload?: any[] }) => {
                                if (active && payload && payload.length) {
                                  const item = payload[0].payload;
                                  return (
                                    <div className="cyber-card p-3 border border-cyan-400/20 bg-gray-800/80 rounded-md">
                                      <p className="font-medium text-white">{item.name}</p>
                                      <p className="text-cyan-400">{item.value}% ({formatCurrency(item.amount)})</p>
                                    </div>
                                  );
                                }
                                return null;
                              }
                            }
                          />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="w-full lg:w-1/2 space-y-3 mt-4 lg:mt-0">
                      {data.paymentMethods.map((method) => (
                        <motion.div key={method.name} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg" whileHover={{ scale: 1.03, backgroundColor: '#2A2D36' }}>
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: method.color }} />
                            <span className="text-white">{method.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-white">{method.value}%</div>
                            <div className="text-sm text-gray-400">{formatCurrency(method.amount)}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Hourly Transaction Pattern */}
          <motion.div variants={itemVariants}>
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="text-text-primary flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-accent-neon" />
                  Transaction Pattern (24h)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                   <AnimatePresence>
                    {isLoading ? (
                      <div className="w-full h-full bg-gray-800/50 rounded-lg animate-pulse"></div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.hourlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="hourlyGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#00FF88" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#00FF88" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                          <XAxis dataKey="hour" stroke="#A0A3A9" fontSize={12} tick={{ fill: '#A0A3A9' }} />
                          <YAxis stroke="#A0A3A9" fontSize={12} tick={{ fill: '#A0A3A9' }} />
                          <Tooltip content={<CustomTooltip />} />
                          <Area type="monotone" dataKey="transactions" stroke="#00FF88" strokeWidth={2} fillOpacity={1} fill="url(#hourlyGradient)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Performing Retailers */}
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="text-text-primary flex items-center">
                  <Users className="w-5 h-5 mr-2 text-accent-purple" />
                  Top Performing Retailers
                </CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="space-y-4">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="h-20 w-full bg-gray-800/50 rounded-lg animate-pulse"></div>
                    ))
                  ) : (
                    data.topRetailers.map((retailer, index) => (
                      <motion.div key={index} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg transition-colors" whileHover={{ scale: 1.02, backgroundColor: '#2A2D36' }}>
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="font-bold text-white">#{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium text-white">{retailer.name}</p>
                            <p className="text-sm text-gray-400">{retailer.transactions} transactions</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-white">{formatCurrency(retailer.revenue)}</p>
                          <p className={`text-sm ${retailer.growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {retailer.growth >= 0 ? '↑' : '↓'} {Math.abs(retailer.growth)}%
                          </p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Geographic & Device Breakdown */}
          <motion.div className="space-y-6" variants={itemVariants}>
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="text-text-primary flex items-center">
                  <Smartphone className="w-5 h-5 mr-2 text-orange-400" />
                  Device Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {isLoading ? (
                     Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="h-12 w-full bg-gray-800/50 rounded-lg animate-pulse"></div>
                    ))
                  ) : (
                  data.deviceBreakdown.map((device, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-white">{device.device}</span>
                        <span className="text-gray-400">{device.percentage}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-gray-700">
                        <motion.div
                          className="bg-orange-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${device.percentage}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {formatNumber(device.sessions)} sessions
                      </div>
                    </div>
                  )))}
                </div>
              </CardContent>
            </Card>

            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="text-text-primary flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-pink-400" />
                  Top Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {isLoading ? (
                     Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="h-8 w-full bg-gray-800/50 rounded-lg animate-pulse"></div>
                    ))
                  ) : (
                  data.geographicData.slice(0, 5).map((location, index) => (
                    <motion.div key={index} className="flex items-center justify-between" whileHover={{ scale: 1.03 }}>
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-pink-500/20 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-pink-400">{index + 1}</span>
                        </div>
                        <span className="text-white">{location.location}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-white">
                          {formatCurrency(location.revenue)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatNumber(location.transactions)} txns
                        </div>
                      </div>
                    </motion.div>
                  )))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}

