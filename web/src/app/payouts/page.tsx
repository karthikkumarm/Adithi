'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Wallet,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  IndianRupee,
  TrendingUp,
  Calendar,
  Filter,
  Download,
  Eye,
  RefreshCw,
  AlertTriangle,
  CreditCard,
  Building,
  User
} from 'lucide-react';
import { formatCurrency, formatDate, getStatusBadgeColor } from '@/lib/utils';
import { payoutAPI } from '@/lib/api';
import { useAuth } from '@/components/providers/AuthProvider';
import { toast } from 'sonner';

// Mock payout data
const mockPayouts = [
  {
    id: 'PO-2024-001',
    amount: 2450.75,
    status: 'completed',
    requestedAt: '2024-01-20T10:30:00Z',
    processedAt: '2024-01-21T15:45:00Z',
    bankDetails: {
      accountNumber: '****1234',
      bankName: 'Chase Bank',
      routingNumber: '****5678'
    },
    retailerId: 'RTL-001',
    retailerName: 'TechMart Electronics',
    transactionCount: 45,
    commissionEarned: 2450.75,
    processingFee: 5.50,
    netAmount: 2445.25,
    reference: 'TXF-789456123'
  },
  {
    id: 'PO-2024-002',
    amount: 1876.30,
    status: 'pending',
    requestedAt: '2024-01-19T14:20:00Z',
    processedAt: null,
    bankDetails: {
      accountNumber: '****5678',
      bankName: 'Bank of America',
      routingNumber: '****9012'
    },
    retailerId: 'RTL-002',
    retailerName: 'Fashion Hub',
    transactionCount: 32,
    commissionEarned: 1876.30,
    processingFee: 4.20,
    netAmount: 1872.10,
    reference: null
  },
  {
    id: 'PO-2024-003',
    amount: 945.60,
    status: 'rejected',
    requestedAt: '2024-01-18T09:15:00Z',
    processedAt: '2024-01-18T16:30:00Z',
    bankDetails: {
      accountNumber: '****9012',
      bankName: 'Wells Fargo',
      routingNumber: '****3456'
    },
    retailerId: 'RTL-003',
    retailerName: 'Sports Central',
    transactionCount: 18,
    commissionEarned: 945.60,
    processingFee: 2.85,
    netAmount: 942.75,
    reference: null,
    rejectionReason: 'Invalid bank account information'
  }
];

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState(mockPayouts);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestAmount, setRequestAmount] = useState('');
  
  const { user } = useAuth();

  useEffect(() => {
    fetchPayouts();
  }, [statusFilter]);

  const fetchPayouts = async () => {
    setIsLoading(true);
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setPayouts(mockPayouts);
    } catch (error) {
      console.error('Failed to fetch payouts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestPayout = async () => {
    try {
      if (!requestAmount || parseFloat(requestAmount) <= 0) {
        toast.error('Please enter a valid amount');
        return;
      }

      // await payoutAPI.createPayout({ amount: parseFloat(requestAmount) });
      toast.success('Payout request submitted successfully');
      setShowRequestModal(false);
      setRequestAmount('');
      fetchPayouts();
    } catch (error) {
      toast.error('Failed to submit payout request');
    }
  };

  const handleApprove = async (payoutId: string) => {
    try {
      // await payoutAPI.updatePayoutStatus(payoutId, 'approved');
      toast.success('Payout approved successfully');
      fetchPayouts();
    } catch (error) {
      toast.error('Failed to approve payout');
    }
  };

  const filteredPayouts = payouts.filter(payout => 
    user?.role === 'owner' || payout.retailerId === user?.id
  ).filter(payout =>
    statusFilter === 'all' || payout.status === statusFilter
  );

  const stats = {
    totalRequested: filteredPayouts.reduce((sum, p) => sum + p.amount, 0),
    pendingAmount: filteredPayouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    completedAmount: filteredPayouts.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    availableBalance: 5234.50, // Mock available balance
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
              Payout Management
            </h1>
            <p className="text-text-secondary">
              {user?.role === 'owner' 
                ? 'Manage retailer payout requests and approvals'
                : 'Request and track your commission payouts'
              }
            </p>
          </motion.div>

          <motion.div
            className="flex items-center space-x-3 mt-4 lg:mt-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {user?.role === 'retailer' && (
              <Button
                onClick={() => setShowRequestModal(true)}
                className="btn-primary neon-glow"
              >
                <Plus className="w-5 h-5 mr-2" />
                Request Payout
              </Button>
            )}
            <Button
              variant="outline"
              onClick={fetchPayouts}
              disabled={isLoading}
              className="btn-secondary"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="cyber-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">Available Balance</p>
                  <p className="text-2xl font-bold text-accent-neon">
                    {formatCurrency(stats.availableBalance)}
                  </p>
                </div>
                <Wallet className="w-6 h-6 text-accent-neon" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">Pending Payouts</p>
                  <p className="text-2xl font-bold text-accent-orange">
                    {formatCurrency(stats.pendingAmount)}
                  </p>
                </div>
                <Clock className="w-6 h-6 text-accent-orange" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">Completed Payouts</p>
                  <p className="text-2xl font-bold text-accent-cyan">
                    {formatCurrency(stats.completedAmount)}
                  </p>
                </div>
                <CheckCircle className="w-6 h-6 text-accent-cyan" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">Total Requested</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {formatCurrency(stats.totalRequested)}
                  </p>
                </div>
                <TrendingUp className="w-6 h-6 text-accent-purple" />
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
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="cyber-input h-12 min-w-[200px]"
                >
                  <option value="all">All Payouts</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>

                <div className="flex items-center space-x-2 ml-auto">
                  <Button variant="outline" className="btn-secondary">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" className="btn-secondary">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Payouts List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="text-text-primary">Payout Requests</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {isLoading ? (
                  // Loading skeletons
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="p-6 border-b border-border-primary/30">
                      <div className="animate-pulse space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-surface-1 rounded-full" />
                            <div className="space-y-2">
                              <div className="h-4 bg-surface-1 rounded w-32" />
                              <div className="h-3 bg-surface-1 rounded w-24" />
                            </div>
                          </div>
                          <div className="h-6 bg-surface-1 rounded w-20" />
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                          <div className="h-3 bg-surface-1 rounded" />
                          <div className="h-3 bg-surface-1 rounded" />
                          <div className="h-3 bg-surface-1 rounded" />
                          <div className="h-3 bg-surface-1 rounded" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : filteredPayouts.length > 0 ? (
                  filteredPayouts.map((payout) => (
                    <div key={payout.id} className="p-6 border-b border-border-primary/30 hover:bg-surface-1 transition-colors">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            payout.status === 'completed' ? 'bg-accent-neon/10' :
                            payout.status === 'pending' ? 'bg-accent-orange/10' :
                            'bg-red-500/10'
                          }`}>
                            {payout.status === 'completed' ? (
                              <CheckCircle className="w-6 h-6 text-accent-neon" />
                            ) : payout.status === 'pending' ? (
                              <Clock className="w-6 h-6 text-accent-orange" />
                            ) : (
                              <XCircle className="w-6 h-6 text-red-400" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-text-primary">{payout.id}</h3>
                            {user?.role === 'owner' && (
                              <p className="text-sm text-text-secondary">{payout.retailerName}</p>
                            )}
                            <p className="text-xs text-text-tertiary">
                              Requested {formatDate(payout.requestedAt)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-2xl font-bold text-text-primary">
                            {formatCurrency(payout.amount)}
                          </p>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${
                            getStatusBadgeColor(payout.status)
                          }`}>
                            {payout.status}
                          </span>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="bg-surface-1 p-3 rounded-lg">
                          <p className="text-xs text-text-tertiary mb-1">Commission Earned</p>
                          <p className="font-medium text-text-primary">
                            {formatCurrency(payout.commissionEarned)}
                          </p>
                        </div>
                        
                        <div className="bg-surface-1 p-3 rounded-lg">
                          <p className="text-xs text-text-tertiary mb-1">Processing Fee</p>
                          <p className="font-medium text-text-primary">
                            -{formatCurrency(payout.processingFee)}
                          </p>
                        </div>
                        
                        <div className="bg-surface-1 p-3 rounded-lg">
                          <p className="text-xs text-text-tertiary mb-1">Net Amount</p>
                          <p className="font-medium text-accent-neon">
                            {formatCurrency(payout.netAmount)}
                          </p>
                        </div>
                        
                        <div className="bg-surface-1 p-3 rounded-lg">
                          <p className="text-xs text-text-tertiary mb-1">Transactions</p>
                          <p className="font-medium text-text-primary">
                            {payout.transactionCount}
                          </p>
                        </div>
                      </div>

                      {/* Bank Details */}
                      <div className="bg-surface-1 p-4 rounded-lg mb-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <Building className="w-4 h-4 text-text-tertiary" />
                          <span className="text-sm font-medium text-text-primary">Bank Details</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-text-tertiary">Bank: </span>
                            <span className="text-text-primary">{payout.bankDetails.bankName}</span>
                          </div>
                          <div>
                            <span className="text-text-tertiary">Account: </span>
                            <span className="text-text-primary">{payout.bankDetails.accountNumber}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions & Status */}
                      <div className="flex items-center justify-between">
                        <div>
                          {payout.status === 'completed' && payout.processedAt && (
                            <p className="text-sm text-text-secondary">
                              Processed on {formatDate(payout.processedAt)}
                            </p>
                          )}
                          {payout.status === 'rejected' && payout.rejectionReason && (
                            <div className="flex items-center space-x-2 text-red-400">
                              <AlertTriangle className="w-4 h-4" />
                              <span className="text-sm">{payout.rejectionReason}</span>
                            </div>
                          )}
                          {payout.reference && (
                            <p className="text-xs text-text-tertiary">
                              Reference: {payout.reference}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                          
                          {user?.role === 'owner' && payout.status === 'pending' && (
                            <>
                              <Button
                                onClick={() => handleApprove(payout.id)}
                                size="sm"
                                className="btn-primary"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <Wallet className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
                    <p className="text-text-secondary">No payout requests found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Payout Request Modal */}
        {showRequestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md"
            >
              <Card className="cyber-card neon-border">
                <CardHeader>
                  <CardTitle className="text-text-primary">Request Payout</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-text-primary mb-2 block">
                      Available Balance
                    </label>
                    <div className="text-2xl font-bold text-accent-neon">
                      {formatCurrency(stats.availableBalance)}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-text-primary mb-2 block">
                      Payout Amount
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={requestAmount}
                      onChange={(e) => setRequestAmount(e.target.value)}
                      className="cyber-input text-xl font-bold"
                    />
                  </div>

                  <div className="bg-surface-1 p-4 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Processing Fee (0.3%)</span>
                      <span className="text-text-primary">
                        -{formatCurrency((parseFloat(requestAmount) || 0) * 0.003)}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-medium border-t border-border-primary mt-2 pt-2">
                      <span className="text-text-primary">Net Amount</span>
                      <span className="text-accent-neon">
                        {formatCurrency((parseFloat(requestAmount) || 0) * 0.997)}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowRequestModal(false)}
                      className="flex-1 btn-secondary"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleRequestPayout}
                      className="flex-1 btn-primary"
                    >
                      Request Payout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}