'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { 
  CreditCard, 
  Smartphone, 
  Shield, 
  TrendingUp, 
  Users, 
  Zap,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: CreditCard,
    title: 'Advanced Payment Processing',
    description: 'Accept all major credit cards, digital wallets, and contactless payments with industry-leading security.',
    color: 'accent-cyan'
  },
  {
    icon: Smartphone,
    title: 'Mobile-First Design',
    description: 'Optimized for mobile devices with native apps for iOS and Android. Process payments anywhere.',
    color: 'accent-neon'
  },
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    description: 'PCI DSS compliant with end-to-end encryption and real-time fraud detection.',
    color: 'accent-purple'
  },
  {
    icon: TrendingUp,
    title: 'Real-Time Analytics',
    description: 'Comprehensive dashboards with live insights, performance metrics, and business intelligence.',
    color: 'accent-orange'
  },
  {
    icon: Users,
    title: 'Multi-User Management',
    description: 'Role-based access control for owners and retailers with granular permission settings.',
    color: 'accent-pink'
  },
  {
    icon: Zap,
    title: 'Instant Settlements',
    description: 'Fast payouts with next-day deposits and transparent commission tracking.',
    color: 'accent-cyan'
  }
];

const stats = [
  { value: '99.9%', label: 'Uptime', suffix: '' },
  { value: '2.4', label: 'Processing Time', suffix: 's' },
  { value: '150+', label: 'Supported Countries', suffix: '' },
  { value: '24/7', label: 'Support', suffix: '' },
];

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push(user.role === 'owner' ? '/dashboard/owner' : '/dashboard/retailer');
    }
  }, [isAuthenticated, user, router]);

  if (isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-nexus-gradient cyber-grid">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-strong border-b border-border-primary">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-accent-cyan to-accent-neon rounded-xl flex items-center justify-center neon-glow">
                <CreditCard className="w-6 h-6 text-background-primary" />
              </div>
              <span className="text-2xl font-bold text-text-primary neon-text">
                PayFlow
              </span>
            </motion.div>

            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Link href="/login">
                <Button variant="ghost" className="text-text-secondary hover:text-text-primary">
                  Sign In
                </Button>
              </Link>
              <Link href="/login">
                <Button className="btn-primary">
                  Get Started
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <motion.div
            className="text-center max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 rounded-full glass mb-8 border border-accent-cyan/20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-accent-cyan text-sm font-medium">
                🚀 Next-Gen Payment Processing Platform
              </span>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8">
              <span className="bg-gradient-to-r from-accent-cyan via-accent-neon to-accent-purple bg-clip-text text-transparent neon-text">
                Payment Processing
              </span>
              <br />
              <span className="text-text-primary">
                Redefined
              </span>
            </h1>
            
            <p className="text-xl text-text-secondary mb-12 max-w-3xl mx-auto leading-relaxed">
              Empower your business with the most advanced credit card processing platform. 
              Built for modern retailers and business owners with real-time analytics, 
              seamless integrations, and enterprise-grade security.
            </p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link href="/login">
                <Button size="lg" className="btn-primary group px-8 py-4 text-lg">
                  Start Processing Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="ghost" className="btn-secondary px-8 py-4 text-lg">
                Watch Demo
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {stats.map((stat, index) => (
                <Card key={index} className="cyber-card text-center p-6">
                  <div className="text-3xl font-bold text-accent-cyan mb-2">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-text-secondary text-sm">
                    {stat.label}
                  </div>
                </Card>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              Built for the Future of{' '}
              <span className="text-accent-cyan neon-text">Commerce</span>
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Advanced features designed to scale with your business and exceed customer expectations.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="cyber-card cyber-hover p-8 h-full">
                  <div className={`w-12 h-12 bg-gradient-to-r from-${feature.color} to-accent-neon rounded-xl flex items-center justify-center mb-6 neon-glow`}>
                    <feature.icon className="w-6 h-6 text-background-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-text-primary">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="cyber-card max-w-4xl mx-auto p-12 neon-border">
              <h2 className="text-4xl font-bold text-text-primary mb-6">
                Ready to Transform Your{' '}
                <span className="text-accent-neon neon-text">Payment Experience?</span>
              </h2>
              <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of businesses already using PayFlow to process payments, 
                manage commissions, and grow their revenue.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/login">
                  <Button size="lg" className="btn-primary px-8 py-4 text-lg">
                    Start Free Trial
                  </Button>
                </Link>
                <Button size="lg" variant="ghost" className="btn-secondary px-8 py-4 text-lg">
                  Contact Sales
                </Button>
              </div>
              
              <div className="flex items-center justify-center mt-8 space-x-6 text-sm text-text-secondary">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-accent-neon mr-2" />
                  No setup fees
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-accent-neon mr-2" />
                  24/7 support
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-accent-neon mr-2" />
                  Enterprise security
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border-primary">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-accent-cyan to-accent-neon rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-background-primary" />
              </div>
              <span className="text-lg font-semibold text-text-primary">PayFlow</span>
            </div>
            <div className="text-sm text-text-secondary">
              © 2025 AdithiVault. All rights reserved. Built with ❤️ for modern needs.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}