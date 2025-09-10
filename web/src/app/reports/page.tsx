'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  TrendingUp,
  BarChart3,
  PieChart,
  Users,
  CreditCard,
  DollarSign,
  Clock,
  RefreshCw,
  Mail,
  Share,
  Eye
} from 'lucide-react';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { formatCurrency, formatDate, downloadAsCSV } from '@/lib/utils';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const reportTemplates = [
  {
    id: 'revenue-summary',
    name: 'Revenue Summary',
    description: 'Comprehensive revenue analysis with trends and breakdowns',
    icon: DollarSign,
    color: 'cyan',
    frequency: ['daily', 'weekly', 'monthly', 'quarterly'],
    formats: ['pdf', 'csv', 'excel']
  },
  {
    id: 'transaction-details',
    name: 'Transaction Report',
    description: 'Detailed transaction data with customer and retailer information',
    icon: CreditCard,
    color: 'neon',
    frequency: ['daily', 'weekly', 'monthly'],
    formats: ['csv', 'excel', 'json']
  },
  {
    id: 'retailer-performance',
    name: 'Retailer Performance',
    description: 'Individual retailer metrics and performance analysis',
    icon: Users,
    color: 'purple',
    frequency: ['weekly', 'monthly', 'quarterly'],
    formats: ['pdf', 'excel']
  },
  {
    id: 'commission-breakdown',
    name: 'Commission Analysis',
    description: 'Commission calculations and payout summaries',
    icon: TrendingUp,
    color: 'orange',
    frequency: ['monthly', 'quarterly', 'yearly'],
    formats: ['pdf', 'csv', 'excel']
  },
  {
    id: 'financial-statement',
    name: 'Financial Statement',
    description: 'Complete financial overview for accounting purposes',
    icon: FileText,
    color: 'pink',
    frequency: ['monthly', 'quarterly', 'yearly'],
    formats: ['pdf']
  }
];

const scheduledReports = [
  {
    id: 'sched-001',
    template: 'Revenue Summary',
    frequency: 'Monthly',
    nextRun: '2024-02-01T09:00:00Z',
    lastRun: '2024-01-01T09:00:00Z',
    recipients: ['owner@company.com', 'finance@company.com'],
    format: 'PDF',
    status: 'active'
  },
  {
    id: 'sched-002',
    template: 'Transaction Report',
    frequency: 'Weekly',
    nextRun: '2024-01-22T09:00:00Z',
    lastRun: '2024-01-15T09:00:00Z',
    recipients: ['operations@company.com'],
    format: 'CSV',
    status: 'active'
  }
];

export default function ReportsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [selectedFormat, setSelectedFormat] = useState<string>('pdf');
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock data for preview
  const previewData = {
    totalRevenue: 2847592,
    totalTransactions: 15647,
    totalCommission: 199330,
    averageTransaction: 182.5,
    topRetailers: [
      { name: 'TechMart Electronics', revenue: 456789, transactions: 1247 },
      { name: 'Fashion Hub', revenue: 234567, transactions: 987 },
      { name: 'Sports Central', revenue: 189432, transactions: 756 }
    ],
    dailyRevenue: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      revenue: Math.floor(Math.random() * 50000) + 20000,
      transactions: Math.floor(Math.random() * 200) + 100
    }))
  };

  const generateReport = async () => {
    if (!selectedTemplate) {
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const template = reportTemplates.find(t => t.id === selectedTemplate);
      const reportData = {
        template: template?.name,
        dateRange: `${formatDate(startDate, 'MMM dd, yyyy')} - ${formatDate(endDate, 'MMM dd, yyyy')}`,
        generatedAt: new Date().toISOString(),
        data: previewData
      };

      if (selectedFormat === 'csv') {
        downloadAsCSV([reportData], `${template?.name}-${formatDate(new Date(), 'yyyy-MM-dd')}`);
      } else {
        // For PDF/Excel, we would typically call an API
        console.log('Generated report:', reportData);
      }
      
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setIsLoading(false);
    }
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
              Reports & Analytics
            </h1>
            <p className="text-text-secondary">
              Generate detailed reports and export business insights
            </p>
          </motion.div>

          <motion.div
            className="flex items-center space-x-3 mt-4 lg:mt-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button variant="outline" className="btn-secondary">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Report
            </Button>
            <Button className="btn-primary">
              <Download className="w-4 h-4 mr-2" />
              Quick Export
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Report Templates */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle className="text-text-primary">Report Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reportTemplates.map((template) => (
                      <motion.div
                        key={template.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant="outline"
                          onClick={() => setSelectedTemplate(template.id)}
                          className={`w-full h-auto p-4 flex-col space-y-3 ${
                            selectedTemplate === template.id
                              ? `border-accent-${template.color} bg-accent-${template.color}/10`
                              : 'border-border-primary hover:border-border-secondary'
                          }`}
                        >
                          <template.icon className={`w-8 h-8 ${
                            selectedTemplate === template.id
                              ? `text-accent-${template.color}`
                              : 'text-text-secondary'
                          }`} />
                          <div className="text-center">
                            <div className="font-medium text-text-primary mb-1">
                              {template.name}
                            </div>
                            <div className="text-xs text-text-tertiary">
                              {template.description}
                            </div>
                          </div>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Report Configuration */}
            {selectedTemplate && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="cyber-card">
                  <CardHeader>
                    <CardTitle className="text-text-primary">Report Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Date Range */}
                    <div>
                      <label className="text-sm font-medium text-text-primary mb-3 block">
                        Date Range
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-text-tertiary mb-1 block">Start Date</label>
                          <DatePicker
                            selected={startDate}
                            onChange={(date: Date) => setStartDate(date)}
                            className="cyber-input w-full"
                            placeholderText="Select start date"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-text-tertiary mb-1 block">End Date</label>
                          <DatePicker
                            selected={endDate}
                            onChange={(date: Date) => setEndDate(date)}
                            className="cyber-input w-full"
                            placeholderText="Select end date"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Format Selection */}
                    <div>
                      <label className="text-sm font-medium text-text-primary mb-3 block">
                        Export Format
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {reportTemplates
                          .find(t => t.id === selectedTemplate)
                          ?.formats.map((format) => (
                            <Button
                              key={format}
                              variant={selectedFormat === format ? 'default' : 'outline'}
                              onClick={() => setSelectedFormat(format)}
                              className={selectedFormat === format ? 'btn-primary' : 'btn-secondary'}
                            >
                              {format.toUpperCase()}
                            </Button>
                          ))}
                      </div>
                    </div>

                    {/* Generate Button */}
                    <Button
                      onClick={generateReport}
                      disabled={isGenerating}
                      className="w-full btn-primary h-12 neon-glow"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                          Generating Report...
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5 mr-2" />
                          Generate Report
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Preview & Scheduled Reports */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle className="text-text-primary">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-surface-1 rounded-lg">
                      <div className="text-lg font-bold text-text-primary">
                        {formatCurrency(previewData.totalRevenue)}
                      </div>
                      <div className="text-xs text-text-secondary">Total Revenue</div>
                    </div>
                    
                    <div className="text-center p-3 bg-surface-1 rounded-lg">
                      <div className="text-lg font-bold text-text-primary">
                        {previewData.totalTransactions.toLocaleString()}
                      </div>
                      <div className="text-xs text-text-secondary">Transactions</div>
                    </div>
                    
                    <div className="text-center p-3 bg-surface-1 rounded-lg">
                      <div className="text-lg font-bold text-accent-neon">
                        {formatCurrency(previewData.totalCommission)}
                      </div>
                      <div className="text-xs text-text-secondary">Commission</div>
                    </div>
                    
                    <div className="text-center p-3 bg-surface-1 rounded-lg">
                      <div className="text-lg font-bold text-text-primary">
                        {formatCurrency(previewData.averageTransaction)}
                      </div>
                      <div className="text-xs text-text-secondary">Avg Transaction</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Scheduled Reports */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle className="text-text-primary flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-accent-orange" />
                    Scheduled Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {scheduledReports.map((report) => (
                      <div key={report.id} className="p-3 bg-surface-1 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-text-primary text-sm">
                            {report.template}
                          </h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            report.status === 'active' 
                              ? 'bg-accent-neon/10 text-accent-neon'
                              : 'bg-surface-2 text-text-tertiary'
                          }`}>
                            {report.status}
                          </span>
                        </div>
                        
                        <div className="text-xs text-text-secondary space-y-1">
                          <div>Frequency: {report.frequency}</div>
                          <div>Next: {formatDate(report.nextRun, 'MMM dd, HH:mm')}</div>
                          <div>Format: {report.format}</div>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-text-tertiary">
                            {report.recipients.length} recipient(s)
                          </span>
                          <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Mail className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full mt-4 btn-secondary">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Schedule
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}