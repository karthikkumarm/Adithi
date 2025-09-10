'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/providers/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CreditCard, Eye, EyeOff, Loader2, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'owner' | 'retailer'>('retailer');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password, role);
      toast.success('Welcome back! Redirecting to your dashboard...');
      
      // Redirect based on role
      router.push(role === 'owner' ? '/dashboard/owner' : '/dashboard/retailer');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const demoCredentials = {
    owner: { email: 'owner@payflow.com', password: 'demo123' },
    retailer: { email: 'retailer@payflow.com', password: 'demo123' }
  };

  return (
    <div className="min-h-screen bg-nexus-gradient cyber-grid flex items-center justify-center p-6">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-accent-cyan to-accent-neon rounded-2xl flex items-center justify-center neon-glow">
              <CreditCard className="w-8 h-8 text-background-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-text-primary neon-text mb-2">
            Welcome Back
          </h1>
          <p className="text-text-secondary">
            Sign in to your PayFlow account
          </p>
        </motion.div>

        <Card className="glass-strong neon-border">
          <CardContent className="p-6">
            {/* Demo Credentials Banner */}
            <motion.div
              className="mb-6 p-4 bg-gradient-to-r from-accent-cyan/10 to-accent-neon/10 rounded-lg border border-accent-cyan/20"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center mb-2">
                <Zap className="w-4 h-4 text-accent-cyan mr-2" />
                <span className="text-sm font-medium text-accent-cyan">Demo Credentials</span>
              </div>
              <div className="text-xs text-text-secondary space-y-1">
                <div>Owner: {demoCredentials.owner.email} / {demoCredentials.owner.password}</div>
                <div>Retailer: {demoCredentials.retailer.email} / {demoCredentials.retailer.password}</div>
              </div>
            </motion.div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Role Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="text-sm font-medium text-text-primary mb-3 block">
                  Select Role
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-background-secondary rounded-lg border border-border-primary">
                  {(['retailer', 'owner'] as const).map((roleOption) => (
                    <button
                      key={roleOption}
                      type="button"
                      onClick={() => setRole(roleOption)}
                      className={`py-3 px-4 rounded-md text-sm font-medium transition-all ${
                        role === roleOption
                          ? 'bg-accent-cyan text-background-primary shadow-lg'
                          : 'text-text-secondary hover:text-text-primary hover:bg-background-tertiary'
                      }`}
                    >
                      {roleOption === 'retailer' ? (
                        <div className="flex items-center justify-center">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Retailer
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Shield className="w-4 h-4 mr-2" />
                          Owner
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label htmlFor="email" className="text-sm font-medium text-text-primary mb-2 block">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="cyber-input"
                />
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label htmlFor="password" className="text-sm font-medium text-text-primary mb-2 block">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="cyber-input pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Quick Fill Buttons */}
              <motion.div
                className="flex gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEmail(demoCredentials.owner.email);
                    setPassword(demoCredentials.owner.password);
                    setRole('owner');
                  }}
                  className="text-xs"
                >
                  Fill Owner
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEmail(demoCredentials.retailer.email);
                    setPassword(demoCredentials.retailer.password);
                    setRole('retailer');
                  }}
                  className="text-xs"
                >
                  Fill Retailer
                </Button>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary h-12 text-lg neon-glow"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In to PayFlow'
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Footer */}
            <motion.div
              className="text-center mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p className="text-sm text-text-secondary">
                Need help?{' '}
                <Link href="/support" className="text-accent-cyan hover:text-accent-neon transition-colors">
                  Contact Support
                </Link>
              </p>
            </motion.div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <Link 
            href="/"
            className="text-sm text-text-tertiary hover:text-text-primary transition-colors inline-flex items-center"
          >
            ← Back to home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}