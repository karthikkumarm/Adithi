'use client';

import { motion } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  ComposedChart,
  Line,
  LineChart
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';

interface RevenueChartProps {
  data: Array<{
    date: string;
    revenue: number;
    transactions: number;
    commission: number;
  }>;
  type?: 'area' | 'bar' | 'line' | 'composed';
  title?: string;
  isLoading?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="cyber-card p-4 border border-accent-cyan/20 backdrop-blur-xl">
        <p className="text-text-primary font-medium mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
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
};

export function RevenueChart({ 
  data, 
  type = 'area', 
  title = 'Revenue Overview',
  isLoading = false 
}: RevenueChartProps) {
  if (isLoading) {
    return (
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="text-text-primary">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-surface-1 rounded-lg animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    };

    switch (type) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="commissionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00FF88" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00FF88" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 45, 54, 0.5)" />
            <XAxis 
              dataKey="date" 
              stroke="#A0A3A9"
              fontSize={12}
            />
            <YAxis 
              stroke="#A0A3A9"
              fontSize={12}
              tickFormatter={(value) => formatCurrency(value, 'USD')}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#00D4FF"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#revenueGradient)"
              name="Revenue"
            />
            <Area
              type="monotone"
              dataKey="commission"
              stroke="#00FF88"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#commissionGradient)"
              name="Commission"
            />
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 45, 54, 0.5)" />
            <XAxis dataKey="date" stroke="#A0A3A9" fontSize={12} />
            <YAxis stroke="#A0A3A9" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="revenue" fill="#00D4FF" radius={[4, 4, 0, 0]} name="Revenue" />
            <Bar dataKey="commission" fill="#00FF88" radius={[4, 4, 0, 0]} name="Commission" />
          </BarChart>
        );

      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 45, 54, 0.5)" />
            <XAxis dataKey="date" stroke="#A0A3A9" fontSize={12} />
            <YAxis stroke="#A0A3A9" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#00D4FF" 
              strokeWidth={3}
              dot={{ fill: '#00D4FF', strokeWidth: 2, r: 4 }}
              name="Revenue"
            />
            <Line 
              type="monotone" 
              dataKey="commission" 
              stroke="#00FF88" 
              strokeWidth={3}
              dot={{ fill: '#00FF88', strokeWidth: 2, r: 4 }}
              name="Commission"
            />
          </LineChart>
        );

      case 'composed':
        return (
          <ComposedChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 45, 54, 0.5)" />
            <XAxis dataKey="date" stroke="#A0A3A9" fontSize={12} />
            <YAxis stroke="#A0A3A9" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="transactions" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Transactions" />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#00D4FF" 
              strokeWidth={3}
              name="Revenue"
            />
          </ComposedChart>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="cyber-card">
        <CardHeader className="border-b border-border-primary">
          <CardTitle className="text-text-primary flex items-center justify-between">
            {title}
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-accent-cyan rounded-full" />
              <span className="text-sm text-text-secondary">Revenue</span>
              <div className="w-3 h-3 bg-accent-neon rounded-full ml-4" />
              <span className="text-sm text-text-secondary">Commission</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}