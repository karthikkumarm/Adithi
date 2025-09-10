'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Mail,
  Phone,
  MapPin,
  Calendar,
  IndianRupee,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { formatCurrency, formatDate, getStatusBadgeColor } from '@/lib/utils';
import { retailersAPI } from '@/lib/api';
import { useAuth } from '@/components/providers/AuthProvider';

// Mock retailer data
const mockRetailers = [
  {
    id: 'RTL-001',
    name: 'John Martinez',
    businessName: 'TechMart Electronics',
    email: 'john.martinez@techmart.com',
    phone: '+1-555-0123',
    address: '123 Tech Street, New York, NY 10001',
    status: 'active',
    kycStatus: 'verified',
    commissionRate: 0.7,
    isVerified: true,
    twoFactorEnabled: true,
    createdAt: '2024-01-15T10:30:00Z',
    lastLoginAt: '2024-01-20T14:22:00Z',
    stats: {
      totalTransactions: 1247,
      totalVolume: 456789.50,
      totalCommission: 3197.53,
      averageTransaction: 366.42,
      successRate: 98.5
    },
    bankDetails: {
      accountNumber: '****1234',
      bankName: 'Chase Bank',
      ifscCode: 'CHAS0001'
    }
  },
  {
    id: 'RTL-002',
    name: 'Sarah Chen',
    businessName: 'Fashion Hub',
    email: 'sarah.chen@fashionhub.com',
    phone: '+1-555-0124',
    address: '456 Fashion Ave, Los Angeles, CA 90210',
    status: 'active',
    kycStatus: 'verified',
    commissionRate: 0.7,
    isVerified: true,
    twoFactorEnabled: false,
    createdAt: '2024-01-10T09:15:00Z',
    lastLoginAt: '2024-01-20T11:45:00Z',
    stats: {
      totalTransactions: 987,
      totalVolume: 234567.89,
      totalCommission: 1641.98,
      averageTransaction: 237.68,
      successRate: 97.2
    },
    bankDetails: {
      accountNumber: '****5678',
      bankName: 'Bank of America',
      ifscCode: 'BOFA0001'
    }
  },
  {
    id: 'RTL-003',
    name: 'Michael Torres',
    businessName: 'Sports Central',
    email: 'michael.torres@sportscentral.com',
    phone: '+1-555-0125',
    address: '789 Sports Blvd, Chicago, IL 60601',
    status: 'pending',
    kycStatus: 'pending',
    commissionRate: 0.7,
    isVerified: false,
    twoFactorEnabled: false,
    createdAt: '2024-01-18T16:20:00Z',
    lastLoginAt: null,
    stats: {
      totalTransactions: 0,
      totalVolume: 0,
      totalCommission: 0,
      averageTransaction: 0,
      successRate: 0
    },
    bankDetails: null
  },
  {
    id: 'RTL-004',
    name: 'Emily Rodriguez',
    businessName: 'Book Haven',
    email: 'emily.rodriguez@bookhaven.com',
    phone: '+1-555-0126',
    address: '321 Literary Lane, Austin, TX 73301',
    status: 'suspended',
    kycStatus: 'rejected',
    commissionRate: 0.7,
    isVerified: false,
    twoFactorEnabled: true,
    createdAt: '2024-01-05T12:00:00Z',
    lastLoginAt: '2024-01-15T09:30:00Z',
    stats: {
      totalTransactions: 456,
      totalVolume: 87654.32,
      totalCommission: 613.58,
      averageTransaction: 192.22,
      successRate: 94.8
    },
    bankDetails: {
      accountNumber: '****9012',
      bankName: 'Wells Fargo',
      ifscCode: 'WELL0001'
    }
  }
];

export default function RetailersPage() {
  const [retailers, setRetailers] = useState(mockRetailers);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRetailer, setSelectedRetailer] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const { user } = useAuth();

  // Redirect if not owner
  if (user?.role !== 'owner') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="cyber-card max-w-md">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="w-12 h-12 text-accent-orange mx-auto mb-4" />
              <h2 className="text-xl font-bold text-text-primary mb-2">Access Denied</h2>
              <p className="text-text-secondary">
                This page is only accessible to business owners.
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  useEffect(() => {
    fetchRetailers();
  }, [statusFilter]);

  const fetchRetailers = async () => {
    setIsLoading(true);
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setRetailers(mockRetailers);
    } catch (error) {
      console.error('Failed to fetch retailers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRetailers = retailers.filter(retailer =>
    (statusFilter === 'all' || retailer.status === statusFilter) &&
    (searchTerm === '' ||
      retailer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      retailer.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      retailer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleStatusChange = async (retailerId: string, newStatus: string) => {
    try {
      // await retailersAPI.updateRetailer(retailerId, { status: newStatus });
      setRetailers(prev => 
        prev.map(retailer => 
          retailer.id === retailerId 
            ? { ...retailer, status: newStatus }
            : retailer
        )
      );
    } catch (error) {
      console.error('Failed to update retailer status:', error);
    }
  };

  const stats = {
    total: retailers.length,
    active: retailers.filter(r => r.status === 'active').length,
    pending: retailers.filter(r => r.status === 'pending').length,
    suspended: retailers.filter(r => r.status === 'suspended').length,
    verified: retailers.filter(r => r.kycStatus === 'verified').length,
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
              Retailer Management
            </h1>
            <p className="text-text-secondary">
              Manage and monitor your retail partners
            </p>
          </motion.div>

          <motion.div
            className="flex items-center space-x-3 mt-4 lg:mt-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button
              onClick={() => setShowAddModal(true)}
              className="btn-primary neon-glow"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Retailer
            </Button>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-5 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="cyber-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">Total Retailers</p>
                  <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
                </div>
                <Users className="w-6 h-6 text-accent-cyan" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">Active</p>
                  <p className="text-2xl font-bold text-accent-neon">{stats.active}</p>
                </div>
                <CheckCircle className="w-6 h-6 text-accent-neon" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">Pending</p>
                  <p className="text-2xl font-bold text-accent-orange">{stats.pending}</p>
                </div>
                <Clock className="w-6 h-6 text-accent-orange" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">Suspended</p>
                  <p className="text-2xl font-bold text-red-400">{stats.suspended}</p>
                </div>
                <UserX className="w-6 h-6 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">Verified</p>
                  <p className="text-2xl font-bold text-accent-purple">{stats.verified}</p>
                </div>
                <UserCheck className="w-6 h-6 text-accent-purple" />
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
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                    <Input
                      placeholder="Search retailers by name, business, or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 cyber-input"
                    />
                  </div>
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="cyber-input h-12 min-w-[150px]"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>

                <Button variant="outline" className="btn-secondary min-w-[100px]">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Retailers Grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="cyber-card">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-surface-1 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-surface-1 rounded w-3/4" />
                        <div className="h-3 bg-surface-1 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-surface-1 rounded" />
                      <div className="h-3 bg-surface-1 rounded w-2/3" />
                    </div>
                    <div className="flex justify-between">
                      <div className="h-8 bg-surface-1 rounded w-20" />
                      <div className="h-8 bg-surface-1 rounded w-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredRetailers.length > 0 ? (
            filteredRetailers.map((retailer) => (
              <motion.div
                key={retailer.id}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="cyber-card cyber-hover">
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-accent-purple to-accent-pink rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {retailer.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-text-primary">{retailer.name}</h3>
                          <p className="text-sm text-text-secondary">{retailer.businessName}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${
                          getStatusBadgeColor(retailer.status)
                        }`}>
                          {retailer.status}
                        </span>
                        <Button variant="ghost" size="icon" className="w-8 h-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="w-4 h-4 text-text-tertiary" />
                        <span className="text-text-secondary truncate">{retailer.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="w-4 h-4 text-text-tertiary" />
                        <span className="text-text-secondary">{retailer.phone}</span>
                      </div>
                      {retailer.address && (
                        <div className="flex items-center space-x-2 text-sm">
                          <MapPin className="w-4 h-4 text-text-tertiary" />
                          <span className="text-text-secondary truncate">{retailer.address}</span>
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-surface-1 rounded-lg">
                      <div>
                        <p className="text-xs text-text-tertiary">Revenue</p>
                        <p className="font-medium text-text-primary">
                          {formatCurrency(retailer.stats.totalVolume)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-text-tertiary">Transactions</p>
                        <p className="font-medium text-text-primary">
                          {retailer.stats.totalTransactions.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-text-tertiary">Success Rate</p>
                        <p className="font-medium text-accent-neon">
                          {retailer.stats.successRate}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-text-tertiary">Commission</p>
                        <p className="font-medium text-accent-cyan">
                          {formatCurrency(retailer.stats.totalCommission)}
                        </p>
                      </div>
                    </div>

                    {/* KYC & Security Status */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${
                          getStatusBadgeColor(retailer.kycStatus)
                        }`}>
                          KYC: {retailer.kycStatus}
                        </span>
                        {retailer.twoFactorEnabled && (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full border border-accent-neon/20 bg-accent-neon/10 text-accent-neon">
                            2FA
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-border-primary">
                      <div className="text-xs text-text-tertiary">
                        Joined {formatDate(retailer.createdAt, 'MMM dd, yyyy')}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        {retailer.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusChange(retailer.id, 'active')}
                            className="text-accent-neon hover:text-accent-neon"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center py-12">
              <div className="text-center">
                <Users className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
                <p className="text-text-secondary">No retailers found</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}