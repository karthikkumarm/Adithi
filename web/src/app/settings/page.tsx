'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  User,
  Building,
  Shield,
  Bell,
  CreditCard,
  Key,
  Globe,
  Smartphone,
  Mail,
  Phone,
  MapPin,
  Save,
  Edit,
  Eye,
  EyeOff,
  Upload,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Settings as SettingsIcon,
  Lock,
  Unlock,
  RefreshCw
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuth } from '@/components/providers/AuthProvider';
import { authAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  businessName: z.string().optional(),
  address: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const businessSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  businessType: z.string().min(1, 'Business type is required'),
  taxId: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  description: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;
type BusinessFormData = z.infer<typeof businessSchema>;

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: false,
  });

  const { user, updateProfile } = useAuth();

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      businessName: user?.businessName || '',
      address: user?.address || '',
    }
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const businessForm = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      businessName: user?.businessName || '',
      businessType: '',
      taxId: '',
      website: '',
      description: '',
    }
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      await updateProfile(data);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsLoading(true);
    try {
      // await authAPI.changePassword(data);
      toast.success('Password changed successfully');
      passwordForm.reset();
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const onBusinessSubmit = async (data: BusinessFormData) => {
    setIsLoading(true);
    try {
      // await authAPI.updateBusiness(data);
      toast.success('Business information updated successfully');
    } catch (error) {
      toast.error('Failed to update business information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle2FA = async () => {
    setIsLoading(true);
    try {
      // await authAPI.toggle2FA(!twoFactorEnabled);
      setTwoFactorEnabled(!twoFactorEnabled);
      toast.success(`Two-factor authentication ${!twoFactorEnabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error('Failed to update two-factor authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'business', name: 'Business', icon: Building },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'billing', name: 'Billing', icon: CreditCard },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-bold text-text-primary neon-text mb-2">
            Settings & Preferences
          </h1>
          <p className="text-text-secondary">
            Manage your account settings and business configuration
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="cyber-card">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${
                        activeTab === tab.id
                          ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20'
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface-1'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="cyber-card">
                  <CardHeader>
                    <CardTitle className="text-text-primary flex items-center">
                      <User className="w-6 h-6 mr-2 text-accent-cyan" />
                      Profile Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex items-center space-x-6">
                      <div className="w-24 h-24 bg-gradient-to-r from-accent-purple to-accent-pink rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">
                          {user?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <Button variant="outline" className="btn-secondary">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Picture
                        </Button>
                        <p className="text-text-tertiary text-sm">
                          JPG, PNG or GIF (max. 2MB)
                        </p>
                      </div>
                    </div>

                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-medium text-text-primary mb-2 block">
                            Full Name
                          </label>
                          <Input
                            {...profileForm.register('name')}
                            className="cyber-input"
                            error={profileForm.formState.errors.name?.message}
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-text-primary mb-2 block">
                            Email Address
                          </label>
                          <Input
                            {...profileForm.register('email')}
                            type="email"
                            className="cyber-input"
                            error={profileForm.formState.errors.email?.message}
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-text-primary mb-2 block">
                            Phone Number
                          </label>
                          <Input
                            {...profileForm.register('phone')}
                            type="tel"
                            className="cyber-input"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-text-primary mb-2 block">
                            Business Name
                          </label>
                          <Input
                            {...profileForm.register('businessName')}
                            className="cyber-input"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-text-primary mb-2 block">
                          Address
                        </label>
                        <Input
                          {...profileForm.register('address')}
                          className="cyber-input"
                          placeholder="Full business address"
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="btn-primary"
                        >
                          {isLoading ? (
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4 mr-2" />
                          )}
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Business Tab */}
            {activeTab === 'business' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <Card className="cyber-card">
                  <CardHeader>
                    <CardTitle className="text-text-primary flex items-center">
                      <Building className="w-6 h-6 mr-2 text-accent-neon" />
                      Business Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={businessForm.handleSubmit(onBusinessSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-medium text-text-primary mb-2 block">
                            Business Name
                          </label>
                          <Input
                            {...businessForm.register('businessName')}
                            className="cyber-input"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-text-primary mb-2 block">
                            Business Type
                          </label>
                          <select {...businessForm.register('businessType')} className="cyber-input w-full h-12">
                            <option value="">Select business type</option>
                            <option value="retail">Retail Store</option>
                            <option value="restaurant">Restaurant</option>
                            <option value="service">Service Provider</option>
                            <option value="ecommerce">E-commerce</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-text-primary mb-2 block">
                            Tax ID / EIN
                          </label>
                          <Input
                            {...businessForm.register('taxId')}
                            className="cyber-input"
                            placeholder="XX-XXXXXXX"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-text-primary mb-2 block">
                            Website
                          </label>
                          <Input
                            {...businessForm.register('website')}
                            type="url"
                            className="cyber-input"
                            placeholder="https://example.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-text-primary mb-2 block">
                          Business Description
                        </label>
                        <textarea
                          {...businessForm.register('description')}
                          rows={4}
                          className="cyber-input w-full resize-none"
                          placeholder="Describe your business..."
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button type="submit" disabled={isLoading} className="btn-primary">
                          <Save className="w-4 h-4 mr-2" />
                          Save Business Info
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                {/* Commission Settings (Owner only) */}
                {user?.role === 'owner' && (
                  <Card className="cyber-card">
                    <CardHeader>
                      <CardTitle className="text-text-primary">Commission Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-text-primary mb-2 block">
                          Default Commission Rate (%)
                        </label>
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          defaultValue="0.7"
                          className="cyber-input"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-text-primary mb-2 block">
                          Minimum Transaction Amount
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          defaultValue="1.00"
                          className="cyber-input"
                        />
                      </div>

                      <Button className="btn-primary">
                        <Save className="w-4 h-4 mr-2" />
                        Update Commission Settings
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                {/* Password Change */}
                <Card className="cyber-card">
                  <CardHeader>
                    <CardTitle className="text-text-primary flex items-center">
                      <Key className="w-6 h-6 mr-2 text-accent-purple" />
                      Change Password
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                      <div>
                        <label className="text-sm font-medium text-text-primary mb-2 block">
                          Current Password
                        </label>
                        <div className="relative">
                          <Input
                            {...passwordForm.register('currentPassword')}
                            type={showCurrentPassword ? 'text' : 'password'}
                            className="cyber-input pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
                          >
                            {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-text-primary mb-2 block">
                          New Password
                        </label>
                        <div className="relative">
                          <Input
                            {...passwordForm.register('newPassword')}
                            type={showNewPassword ? 'text' : 'password'}
                            className="cyber-input pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
                          >
                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-text-primary mb-2 block">
                          Confirm New Password
                        </label>
                        <Input
                          {...passwordForm.register('confirmPassword')}
                          type="password"
                          className="cyber-input"
                        />
                      </div>

                      <Button type="submit" disabled={isLoading} className="btn-primary">
                        <Lock className="w-4 h-4 mr-2" />
                        Change Password
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Two-Factor Authentication */}
                <Card className="cyber-card">
                  <CardHeader>
                    <CardTitle className="text-text-primary flex items-center">
                      <Shield className="w-6 h-6 mr-2 text-accent-orange" />
                      Two-Factor Authentication
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 bg-surface-1 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          twoFactorEnabled ? 'bg-accent-neon/10' : 'bg-surface-2'
                        }`}>
                          {twoFactorEnabled ? (
                            <CheckCircle className="w-6 h-6 text-accent-neon" />
                          ) : (
                            <AlertTriangle className="w-6 h-6 text-accent-orange" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-text-primary">
                            Two-Factor Authentication
                          </h4>
                          <p className="text-sm text-text-secondary">
                            {twoFactorEnabled 
                              ? 'Extra security is enabled for your account'
                              : 'Add an extra layer of security to your account'
                            }
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={handleToggle2FA}
                        disabled={isLoading}
                        variant={twoFactorEnabled ? 'destructive' : 'default'}
                        className={twoFactorEnabled ? '' : 'btn-primary'}
                      >
                        {twoFactorEnabled ? (
                          <>
                            <Unlock className="w-4 h-4 mr-2" />
                            Disable 2FA
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 mr-2" />
                            Enable 2FA
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Session Management */}
                <Card className="cyber-card">
                  <CardHeader>
                    <CardTitle className="text-text-primary">Active Sessions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { device: 'Chrome on MacOS', location: 'New York, USA', current: true, lastActive: '2 minutes ago' },
                        { device: 'Safari on iPhone', location: 'New York, USA', current: false, lastActive: '1 hour ago' },
                        { device: 'Chrome on Windows', location: 'California, USA', current: false, lastActive: '2 days ago' },
                      ].map((session, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-surface-1 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-accent-cyan/10 rounded-full flex items-center justify-center">
                              <Smartphone className="w-5 h-5 text-accent-cyan" />
                            </div>
                            <div>
                              <p className="font-medium text-text-primary">{session.device}</p>
                              <p className="text-sm text-text-secondary">{session.location}</p>
                              <p className="text-xs text-text-tertiary">Last active: {session.lastActive}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            {session.current && (
                              <span className="text-xs px-2 py-1 bg-accent-neon/10 text-accent-neon rounded-full">
                                Current
                              </span>
                            )}
                            {!session.current && (
                              <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="cyber-card">
                  <CardHeader>
                    <CardTitle className="text-text-primary flex items-center">
                      <Bell className="w-6 h-6 mr-2 text-accent-pink" />
                      Notification Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {[
                      {
                        key: 'email',
                        title: 'Email Notifications',
                        description: 'Receive transaction alerts and important updates via email',
                        icon: Mail,
                      },
                      {
                        key: 'sms',
                        title: 'SMS Notifications',
                        description: 'Get instant text messages for critical events',
                        icon: Phone,
                      },
                      {
                        key: 'push',
                        title: 'Push Notifications',
                        description: 'Browser push notifications for real-time updates',
                        icon: Bell,
                      },
                      {
                        key: 'marketing',
                        title: 'Marketing Communications',
                        description: 'Product updates, features, and promotional content',
                        icon: Globe,
                      },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-surface-1 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-accent-pink/10 rounded-full flex items-center justify-center">
                            <item.icon className="w-5 h-5 text-accent-pink" />
                          </div>
                          <div>
                            <h4 className="font-medium text-text-primary">{item.title}</h4>
                            <p className="text-sm text-text-secondary">{item.description}</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications[item.key as keyof typeof notifications]}
                            onChange={(e) => setNotifications(prev => ({
                              ...prev,
                              [item.key]: e.target.checked
                            }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-surface-2 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-cyan"></div>
                        </label>
                      </div>
                    ))}

                    <div className="flex justify-end pt-4">
                      <Button className="btn-primary">
                        <Save className="w-4 h-4 mr-2" />
                        Save Preferences
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                {/* Payment Methods */}
                <Card className="cyber-card">
                  <CardHeader>
                    <CardTitle className="text-text-primary flex items-center">
                      <CreditCard className="w-6 h-6 mr-2 text-accent-cyan" />
                      Payment Methods
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-surface-1 rounded-lg border border-accent-cyan/20">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-accent-cyan/10 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-accent-cyan" />
                          </div>
                          <div>
                            <p className="font-medium text-text-primary">•••• •••• •••• 4242</p>
                            <p className="text-sm text-text-secondary">Expires 12/2025 • Primary</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>

                      <Button variant="outline" className="w-full btn-secondary h-12">
                        <Plus className="w-5 h-5 mr-2" />
                        Add Payment Method
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Billing History */}
                <Card className="cyber-card">
                  <CardHeader>
                    <CardTitle className="text-text-primary">Billing History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { date: '2024-01-15', amount: '$29.99', status: 'paid', invoice: 'INV-001' },
                        { date: '2023-12-15', amount: '$29.99', status: 'paid', invoice: 'INV-002' },
                        { date: '2023-11-15', amount: '$29.99', status: 'paid', invoice: 'INV-003' },
                      ].map((bill, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-surface-1 rounded-lg">
                          <div>
                            <p className="font-medium text-text-primary">{bill.invoice}</p>
                            <p className="text-sm text-text-secondary">{formatDate(bill.date)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-text-primary">{bill.amount}</p>
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full border border-accent-neon/20 bg-accent-neon/10 text-accent-neon">
                              {bill.status}
                            </span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}