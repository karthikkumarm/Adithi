'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Search,
  Filter,
  Download,
  Eye,
  RefreshCw,
  MoreVertical,
  Calendar,
  CreditCard,
  User,
  IndianRupee,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { formatCurrency, formatDate, getStatusBadgeColor, downloadAsCSV } from '@/lib/utils';
import { paymentsAPI } from '@/lib/api';
import { useAuth } from '@/components/providers/AuthProvider';

// Mock transaction data
const mockTransactions = [
  {
    id: 'TXN-2024-001',
    amount: 1250.00,
    commission: 8.75,
    netAmount: 1241.25,
    currency: 'USD',
    customerDetails: {
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1-555-0123',
      cardLast4: '4242'
    },
    retailerName: 'TechMart Electronics',
    status: 'completed',
    paymentMethod: 'card',
    gateway: 'stripe',
    gatewayTransactionId: 'pi_1234567890',
    description: 'MacBook Pro purchase',
    createdAt: '2024-01-15T10:30:00Z',
    metadata: {
      location: 'New York, NY',
      deviceId: 'POS-001'
    }
  },
  {
    id: 'TXN-2024-002',
    amount: 89.99,
    commission: 0.63,
    netAmount: 89.36,
    currency: 'USD',
    customerDetails: {
      name: 'Sarah Wilson',
      email: 'sarah.w@email.com',
      phone: '+1-555-0124'
    },
    retailerName: 'Fashion Hub',
    status: 'completed',
    paymentMethod: 'upi',
    gateway: 'razorpay',
    gatewayTransactionId: 'pay_ABC123DEF456',
    description: 'Clothing purchase',
    createdAt: '2024-01-15T09:15:00Z'
  },
  {
    id: 'TXN-2024-003',
    amount: 345.50,
    commission: 2.42,
    netAmount: 343.08,
    currency: 'USD',
    customerDetails: {
      name: 'Michael Brown',
      email: 'mike.brown@email.com',
      cardLast4: '8888'
    },
    retailerName: 'Sports Central',
    status: 'pending',
    paymentMethod: 'card',
    gateway: 'stripe',
    gatewayTransactionId: 'pi_0987654321',
    description: 'Sports equipment',
    createdAt: '2024-01-15T08:45:00Z'
  },
  // Add more mock data...
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('7d');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  
  const { user } = useAuth();
  const itemsPerPage = 10;

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, statusFilter, dateRange, sortField, sortDirection]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      // Replace with actual API call
      // const response = await paymentsAPI.getTransactions({
      //   page: currentPage,
      //   limit: itemsPerPage,
      //   status: statusFilter !== 'all' ? statusFilter : undefined,
      //   dateRange,
      //   sortBy: sortField,
      //   sortOrder: sortDirection
      // });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction =>
    (statusFilter === 'all' || transaction.status === statusFilter) &&
    (searchTerm === '' ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customerDetails.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.retailerName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleExport = () => {
    const exportData = filteredTransactions.map(transaction => ({
      'Transaction ID': transaction.id,
      'Date': formatDate(transaction.createdAt),
      'Customer': transaction.customerDetails.name,
      'Retailer': transaction.retailerName,
      'Amount': transaction.amount,
      'Commission': transaction.commission,
      'Net Amount': transaction.netAmount,
      'Status': transaction.status,
      'Payment Method': transaction.paymentMethod,
      'Gateway': transaction.gateway,
    }));
    
    downloadAsCSV(exportData, `transactions-${new Date().toISOString().split('T')[0]}`);
  };

  const stats = {
    total: filteredTransactions.length,
    completed: filteredTransactions.filter(t => t.status === 'completed').length,
    pending: filteredTransactions.filter(t => t.status === 'pending').length,
    failed: filteredTransactions.filter(t => t.status === 'failed').length,
    totalAmount: filteredTransactions.reduce((sum, t) => sum + t.amount, 0),
    totalCommission: filteredTransactions.reduce((sum, t) => sum + t.commission, 0),
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
              Transaction History
            </h1>
            <p className="text-text-secondary">
              View and manage all payment transactions
            </p>
          </motion.div>

          <motion.div
            className="flex items-center space-x-3 mt-4 lg:mt-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button
              variant="outline"
              onClick={fetchTransactions}
              disabled={isLoading}
              className="btn-secondary"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={handleExport}
              className="btn-secondary"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="cyber-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">Total Transactions</p>
                  <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-accent-cyan/10 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-accent-cyan" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">Total Volume</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {formatCurrency(stats.totalAmount)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-accent-neon/10 rounded-xl flex items-center justify-center">
                  <IndianRupee className="w-6 h-6 text-accent-neon" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">Total Commission</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {formatCurrency(stats.totalCommission)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-accent-purple/10 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-accent-purple" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">Success Rate</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {((stats.completed / stats.total) * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-accent-orange/10 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-accent-orange" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="cyber-card">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                    <Input
                      placeholder="Search transactions, customers, or IDs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 cyber-input"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="cyber-input h-12 min-w-[150px]"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>

                {/* Date Range */}
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="cyber-input h-12 min-w-[150px]"
                >
                  <option value="1d">Last 24 hours</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>

                <Button variant="outline" className="btn-secondary min-w-[100px]">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Transactions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="cyber-card">
            <CardHeader className="border-b border-border-primary">
              <CardTitle className="text-text-primary">Transactions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="data-table overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-primary">
                      <th className="text-left p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort('id')}
                          className="text-text-secondary hover:text-text-primary"
                        >
                          Transaction ID
                          <ArrowUpDown className="w-4 h-4 ml-1" />
                        </Button>
                      </th>
                      <th className="text-left p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort('createdAt')}
                          className="text-text-secondary hover:text-text-primary"
                        >
                          Date
                          <ArrowUpDown className="w-4 h-4 ml-1" />
                        </Button>
                      </th>
                      <th className="text-left p-4 text-text-secondary">Customer</th>
                      {user?.role === 'owner' && (
                        <th className="text-left p-4 text-text-secondary">Retailer</th>
                      )}
                      <th className="text-left p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort('amount')}
                          className="text-text-secondary hover:text-text-primary"
                        >
                          Amount
                          <ArrowUpDown className="w-4 h-4 ml-1" />
                        </Button>
                      </th>
                      <th className="text-left p-4 text-text-secondary">Commission</th>
                      <th className="text-left p-4 text-text-secondary">Status</th>
                      <th className="text-left p-4 text-text-secondary">Method</th>
                      <th className="text-left p-4 text-text-secondary">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      // Loading skeletons
                      Array.from({ length: 5 }).map((_, index) => (
                        <tr key={index} className="border-b border-border-primary/50">
                          <td className="p-4">
                            <div className="h-4 bg-surface-1 rounded animate-pulse" />
                          </td>
                          <td className="p-4">
                            <div className="h-4 bg-surface-1 rounded animate-pulse" />
                          </td>
                          <td className="p-4">
                            <div className="h-4 bg-surface-1 rounded animate-pulse" />
                          </td>
                          {user?.role === 'owner' && (
                            <td className="p-4">
                              <div className="h-4 bg-surface-1 rounded animate-pulse" />
                            </td>
                          )}
                          <td className="p-4">
                            <div className="h-4 bg-surface-1 rounded animate-pulse" />
                          </td>
                          <td className="p-4">
                            <div className="h-4 bg-surface-1 rounded animate-pulse" />
                          </td>
                          <td className="p-4">
                            <div className="h-6 w-16 bg-surface-1 rounded animate-pulse" />
                          </td>
                          <td className="p-4">
                            <div className="h-4 bg-surface-1 rounded animate-pulse" />
                          </td>
                          <td className="p-4">
                            <div className="h-8 w-8 bg-surface-1 rounded animate-pulse" />
                          </td>
                        </tr>
                      ))
                    ) : paginatedTransactions.length > 0 ? (
                      paginatedTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b border-border-primary/50 hover:bg-surface-1 transition-colors">
                          <td className="p-4">
                            <div>
                              <p className="font-mono text-text-primary">{transaction.id}</p>
                              {transaction.description && (
                                <p className="text-sm text-text-tertiary truncate max-w-[200px]">
                                  {transaction.description}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="text-text-primary">
                                {formatDate(transaction.createdAt, 'MMM dd, yyyy')}
                              </p>
                              <p className="text-sm text-text-tertiary">
                                {formatDate(transaction.createdAt, 'HH:mm')}
                              </p>
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-text-primary">
                                {transaction.customerDetails.name}
                              </p>
                              <p className="text-sm text-text-tertiary">
                                {transaction.customerDetails.email}
                              </p>
                              {transaction.customerDetails.cardLast4 && (
                                <p className="text-xs text-text-tertiary">
                                  •••• {transaction.customerDetails.cardLast4}
                                </p>
                              )}
                            </div>
                          </td>
                          {user?.role === 'owner' && (
                            <td className="p-4">
                              <p className="text-text-primary">{transaction.retailerName}</p>
                            </td>
                          )}
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-text-primary">
                                {formatCurrency(transaction.amount)}
                              </p>
                              <p className="text-sm text-text-tertiary">
                                Net: {formatCurrency(transaction.netAmount)}
                              </p>
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="text-accent-neon">
                              {formatCurrency(transaction.commission)}
                            </p>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${
                              getStatusBadgeColor(transaction.status)
                            }`}>
                              {transaction.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-text-secondary capitalize">
                                {transaction.paymentMethod}
                              </span>
                              <span className="text-xs text-text-tertiary">
                                via {transaction.gateway}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="icon" className="w-8 h-8">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="w-8 h-8">
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="w-8 h-8">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={user?.role === 'owner' ? 9 : 8} className="p-8 text-center">
                          <div className="text-text-secondary">
                            <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No transactions found</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between p-6 border-t border-border-primary">
                  <div className="text-text-secondary text-sm">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                    {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of{' '}
                    {filteredTransactions.length} transactions
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={currentPage === page ? 'btn-primary' : ''}
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}