// Add these imports at the top

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@components/providers/AuthProvider';
import { useRouter, usePathname } from 'next/navigation';
import { 
  CreditCard, 
  BarChart3, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Search,
  Home,
  Wallet,
  FileText,
  TrendingUp,
  UserCheck,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  roles: ('owner' | 'retailer')[];
  badge?: string;
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['owner', 'retailer'] },
  { name: 'Payments', href: '/payments', icon: CreditCard, roles: ['retailer'] },
  { name: 'Transactions', href: '/transactions', icon: FileText, roles: ['owner', 'retailer'] },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, roles: ['owner', 'retailer'] },
  { name: 'Retailers', href: '/retailers', icon: Users, roles: ['owner'] },
  { name: 'Payouts', href: '/payouts', icon: Wallet, roles: ['owner', 'retailer'] },
  { name: 'Performance', href: '/performance', icon: TrendingUp, roles: ['owner'] },
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['owner', 'retailer'] },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role as 'owner' | 'retailer')
  );

  return (
    <div className="min-h-screen bg-nexus-gradient cyber-grid">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : -320,
        }}
        className="fixed inset-y-0 left-0 z-50 w-80 lg:translate-x-0 lg:static lg:inset-auto"
      >
        <div className="flex h-full flex-col glass-strong border-r border-border-primary">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-border-primary">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-accent-cyan to-accent-neon rounded-xl flex items-center justify-center neon-glow">
                <CreditCard className="w-6 h-6 text-background-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-text-primary neon-text">PayFlow</h1>
                <p className="text-xs text-text-tertiary uppercase tracking-wider">
                  {user?.role} Portal
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* User Profile */}
          <div className="px-6 py-4 border-b border-border-primary">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-accent-purple to-accent-pink rounded-full flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-text-secondary truncate">
                  {user?.email}
                </p>
                {user?.businessName && (
                  <p className="text-xs text-accent-cyan truncate">
                    {user.businessName}
                  </p>
                )}
              </div>
              <div className={cn(
                'w-3 h-3 rounded-full',
                user?.status === 'active' ? 'status-online' : 'status-offline'
              )} />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 py-4 space-y-2">
            {filteredNavigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <motion.a
                  key={item.name}
                  href={item.href}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-accent-cyan/20 to-accent-neon/20 text-accent-cyan border border-accent-cyan/30 neon-glow'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-1'
                  )}
                >
                  <item.icon className={cn('w-5 h-5', isActive && 'text-accent-cyan')} />
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="ml-auto bg-accent-orange text-background-primary text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </motion.a>
              );
            })}
          </nav>

          {/* System Status */}
          <div className="px-6 py-4 border-t border-border-primary">
            <Card className="cyber-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-text-primary">System Status</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-accent-neon rounded-full status-online" />
                  <span className="text-xs text-text-secondary">Online</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-text-secondary">API Response</span>
                  <span className="text-accent-neon">120ms</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-secondary">Gateway Status</span>
                  <span className="text-accent-neon">Operational</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Logout */}
          <div className="px-6 py-4 border-t border-border-primary">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start space-x-3 text-text-secondary hover:text-red-400 hover:bg-red-400/10"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="lg:pl-80">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 glass-strong border-b border-border-primary">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                <Input
                  placeholder="Search transactions, retailers..."
                  className="w-64 pl-10 cyber-input"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Live Indicator */}
              <div className="flex items-center space-x-2 px-3 py-1 bg-accent-neon/10 rounded-full border border-accent-neon/20">
                <div className="w-2 h-2 bg-accent-neon rounded-full animate-pulse" />
                <span className="text-xs font-medium text-accent-neon">LIVE</span>
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-orange text-background-primary text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </Button>

              {/* Activity Indicator */}
              <div className="flex items-center space-x-2 text-sm text-text-secondary">
                <Activity className="w-4 h-4 text-accent-cyan" />
                <span>12 active</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
import { NotificationCenter } from './NotificationCenter';

// Add state for notifications
const [showNotifications, setShowNotifications] = useState(false);

// Replace the notification button in the top bar with:
<Button 
  variant="ghost" 
  size="icon" 
  className="relative"
  onClick={() => setShowNotifications(true)}
>
  <Bell className="w-5 h-5" />
  {notifications > 0 && (
    <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-orange text-background-primary text-xs rounded-full flex items-center justify-center">
      {notifications}
    </span>
  )}
</Button>

// Add the NotificationCenter component before the closing div of DashboardLayout:
<NotificationCenter 
  isOpen={showNotifications} 
  onClose={() => setShowNotifications(false)} 
/>