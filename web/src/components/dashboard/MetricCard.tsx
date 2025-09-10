'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatNumber, calculatePercentageChange } from '@/lib/utils';
import CountUp from 'react-countup';

interface MetricCardProps {
  title: string;
  value: number;
  previousValue?: number;
  currency?: string;
  icon: React.ElementType;
  color: 'cyan' | 'neon' | 'purple' | 'orange' | 'pink';
  format?: 'currency' | 'number' | 'percentage';
  description?: string;
  isLoading?: boolean;
}

const colorClasses = {
  cyan: {
    bg: 'from-accent-cyan/20 to-accent-cyan/5',
    icon: 'text-accent-cyan',
    glow: 'shadow-accent-cyan/20',
    border: 'border-accent-cyan/30'
  },
  neon: {
    bg: 'from-accent-neon/20 to-accent-neon/5',
    icon: 'text-accent-neon',
    glow: 'shadow-accent-neon/20',
    border: 'border-accent-neon/30'
  },
  purple: {
    bg: 'from-accent-purple/20 to-accent-purple/5',
    icon: 'text-accent-purple',
    glow: 'shadow-accent-purple/20',
    border: 'border-accent-purple/30'
  },
  orange: {
    bg: 'from-accent-orange/20 to-accent-orange/5',
    icon: 'text-accent-orange',
    glow: 'shadow-accent-orange/20',
    border: 'border-accent-orange/30'
  },
  pink: {
    bg: 'from-accent-pink/20 to-accent-pink/5',
    icon: 'text-accent-pink',
    glow: 'shadow-accent-pink/20',
    border: 'border-accent-pink/30'
  }
};

export function MetricCard({
  title,
  value,
  previousValue,
  currency = 'USD',
  icon: Icon,
  color,
  format = 'number',
  description,
  isLoading = false
}: MetricCardProps) {
  const colorClass = colorClasses[color];
  const percentageChange = previousValue !== undefined 
    ? calculatePercentageChange(value, previousValue) 
    : null;

  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return formatCurrency(val, currency);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      default:
        return formatNumber(val);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`cyber-card cyber-hover p-6 border ${colorClass.border} ${colorClass.glow}`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
              <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClass.bg}`}>
                <Icon className={`w-5 h-5 ${colorClass.icon}`} />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-3xl font-bold text-text-primary">
                {isLoading ? (
                  <div className="h-8 w-24 bg-surface-1 rounded animate-pulse" />
                ) : (
                  <CountUp
                    end={value}
                    duration={1.5}
                    preserveValue
                    formattingFn={formatValue}
                  />
                )}
              </div>
              
              {percentageChange !== null && !isLoading && (
                <div className="flex items-center space-x-1">
                  {percentageChange >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-accent-neon" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  <span className={`text-sm font-medium ${
                    percentageChange >= 0 ? 'text-accent-neon' : 'text-red-400'
                  }`}>
                    {Math.abs(percentageChange).toFixed(1)}%
                  </span>
                  <span className="text-sm text-text-tertiary">vs last period</span>
                </div>
              )}
              
              {description && (
                <p className="text-xs text-text-tertiary">{description}</p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}