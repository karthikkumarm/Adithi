'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Bell,
  X,
  Check,
  AlertTriangle,
  CreditCard,
  Users,
  IndianRupee,
  Settings,
  Clock,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info' | 'payment';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  data?: any;
}

const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    title: 'Payment Received',
    message: 'New payment of $1,250.00 processed successfully',
    type: 'payment',
    isRead: false,
    createdAt: '2024-01-20T10:30:00Z',
    data: { amount: 1250.00, transactionId: 'TXN-001' }
  },
  {
    id: 'notif-002',
    title: 'New Retailer Registered',
    message: 'TechMart Electronics has joined your network',
    type: 'info',
    isRead: false,
    createdAt: '2024-01-20T09:15:00Z',
    actionUrl: '/retailers'
  },
  {
    id: 'notif-003',
    title: 'Payout Request',
    message: 'Fashion Hub requested payout of $2,450.75',
    type: 'warning',
    isRead: true,
    createdAt: '2024-01-19T16:45:00Z',
    actionUrl: '/payouts'
  },
  {
    id: 'notif-004',
    title: 'System Maintenance',
    message: 'Scheduled maintenance tonight from 2:00 AM - 4:00 AM EST',
    type: 'info',
    isRead: false,
    createdAt: '2024-01-19T14:20:00Z'
  },
  {
    id: 'notif-005',
    title: 'Transaction Failed',
    message: 'Payment of $89.99 failed due to insufficient funds',
    type: 'error',
    isRead: true,
    createdAt: '2024-01-19T11:30:00Z',
    data: { amount: 89.99, reason: 'Insufficient funds' }
  }
];

export function NotificationCenter({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-accent-neon" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-accent-orange" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'payment': return <CreditCard className="w-5 h-5 text-accent-cyan" />;
      default: return <Info className="w-5 h-5 text-accent-purple" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Notification Panel */}
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-96 bg-background-secondary border-l border-border-primary z-50 overflow-hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-border-primary">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-text-primary">Notifications</h2>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Filter & Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={filter === 'all' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setFilter('all')}
                      className={filter === 'all' ? 'btn-primary' : ''}
                    >
                      All ({notifications.length})
                    </Button>
                    <Button
                      variant={filter === 'unread' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setFilter('unread')}
                      className={filter === 'unread' ? 'btn-primary' : ''}
                    >
                      Unread ({unreadCount})
                    </Button>
                  </div>

                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                      <Check className="w-4 h-4 mr-1" />
                      Mark all read
                    </Button>
                  )}
                </div>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {filteredNotifications.length > 0 ? (
                  <div className="space-y-0">
                    {filteredNotifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 border-b border-border-primary/30 hover:bg-surface-1 transition-colors cursor-pointer ${
                          !notification.isRead ? 'bg-surface-1/50' : ''
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="mt-1">
                            {getIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-sm font-medium text-text-primary truncate">
                                {notification.title}
                              </h4>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-accent-cyan rounded-full ml-2" />
                              )}
                            </div>
                            
                            <p className="text-sm text-text-secondary mb-2">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-text-tertiary">
                                {formatDate(notification.createdAt, 'MMM dd, HH:mm')}
                              </span>
                              
                              {notification.actionUrl && (
                                <Button variant="ghost" size="sm" className="text-accent-cyan">
                                  View
                                </Button>
                              )}
                            </div>

                            {/* Additional Data */}
                            {notification.data && notification.type === 'payment' && (
                              <div className="mt-2 p-2 bg-accent-cyan/10 rounded border border-accent-cyan/20">
                                <div className="flex justify-between text-sm">
                                  <span className="text-text-secondary">Amount:</span>
                                  <span className="text-accent-cyan font-medium">
                                    {formatCurrency(notification.data.amount)}
                                  </span>
                                </div>
                                {notification.data.transactionId && (
                                  <div className="flex justify-between text-sm">
                                    <span className="text-text-secondary">ID:</span>
                                    <span className="text-text-primary font-mono text-xs">
                                      {notification.data.transactionId}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-center">
                      <Bell className="w-8 h-8 text-text-tertiary mx-auto mb-2" />
                      <p className="text-text-secondary">
                        {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border-primary">
                <Button variant="outline" className="w-full btn-secondary">
                  <Settings className="w-4 h-4 mr-2" />
                  Notification Settings
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}