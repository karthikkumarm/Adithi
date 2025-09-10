export interface User {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'retailer';
  businessName?: string;
  phone?: string;
  address?: string;
  kycStatus: 'pending' | 'verified' | 'rejected';
  commissionRate: number;
  status: 'active' | 'pending' | 'suspended';
  isVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  profileImage?: string;
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    accountHolderName: string;
  };
  stats?: {
    totalTransactions: number;
    totalVolume: number;
    totalCommission: number;
    averageTransaction: number;
    successRate: number;
  };
}

export interface Transaction {
  id: string;
  retailerId: string;
  retailerName: string;
  amount: number;
  commission: number;
  netAmount: number;
  currency: string;
  customerDetails: {
    name: string;
    email?: string;
    phone?: string;
    cardLast4?: string;
  };
  description?: string;
  gateway: 'stripe' | 'razorpay';
  gatewayTransactionId: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  paymentMethod: 'card' | 'upi' | 'wallet' | 'bank_transfer';
  receiptUrl?: string;
  refundReason?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    location?: string;
    deviceId?: string;
    ipAddress?: string;
    userAgent?: string;
  };
}

export interface PayoutRequest {
  id: string;
  retailerId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  requestedAt: string;
  processedAt?: string;
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  notes?: string;
  rejectionReason?: string;
}

export interface Analytics {
  totalRevenue: number;
  totalTransactions: number;
  totalCommission: number;
  activeRetailers: number;
  revenueGrowth: number;
  transactionGrowth: number;
  averageTransactionValue: number;
  successRate: number;
  topRetailers: Array<{
    id: string;
    name: string;
    revenue: number;
    transactions: number;
  }>;
  revenueChart: Array<{
    date: string;
    revenue: number;
    transactions: number;
  }>;
  paymentMethods: Array<{
    method: string;
    percentage: number;
    amount: number;
  }>;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface Commission {
  retailerId: string;
  transactionId: string;
  amount: number;
  rate: number;
  calculatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardStats {
  today: {
    revenue: number;
    transactions: number;
    commission: number;
  };
  month: {
    revenue: number;
    transactions: number;
    commission: number;
  };
  growth: {
    revenue: number;
    transactions: number;
    commission: number;
  };
}

export interface PaymentFormData {
  amount: number;
  currency: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  description?: string;
  paymentMethod: 'card' | 'upi' | 'wallet';
  gateway: 'stripe' | 'razorpay';
}

export interface KYCDocument {
  id: string;
  type: 'aadhar' | 'pan' | 'gst' | 'bank_statement';
  url: string;
  status: 'pending' | 'verified' | 'rejected';
  uploadedAt: string;
  verifiedAt?: string;
  rejectionReason?: string;
}