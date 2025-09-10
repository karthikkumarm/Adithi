'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  CreditCard,
  Smartphone,
  QrCode,
  Nfc,
  User,
  IndianRupee,
  Receipt,
  Check,
  ArrowLeft,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { paymentsAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import QRCode from 'react-qr-code';
import Confetti from 'react-confetti';

const paymentSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  customerName: z.string().min(1, 'Customer name is required'),
  customerEmail: z.string().email().optional().or(z.literal('')),
  customerPhone: z.string().optional(),
  description: z.string().optional(),
  paymentMethod: z.enum(['card', 'upi', 'wallet', 'cash']),
  gateway: z.enum(['stripe', 'razorpay']),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

export default function NewPaymentPage() {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: 'card',
      gateway: 'stripe',
    }
  });

  const watchedAmount = watch('amount');
  const watchedPaymentMethod = watch('paymentMethod');
  const watchedGateway = watch('gateway');

  const calculateCommission = (amount: number) => {
    return amount * 0.007; // 0.7% commission
  };

  const onSubmit = async (data: PaymentFormData) => {
    setIsProcessing(true);
    
    try {
      if (data.paymentMethod === 'upi') {
        // Generate QR Code for UPI payments
        const upiString = `upi://pay?pa=merchant@paytm&pn=${encodeURIComponent(data.customerName)}&am=${data.amount}&cu=INR&tn=${encodeURIComponent(data.description || 'Payment')}`;
        setQrCodeData(upiString);
        setStep(3); // Show QR code step
        setIsProcessing(false);
        return;
      }

      const response = await paymentsAPI.processPayment({
        ...data,
        currency: 'USD',
        customerDetails: {
          name: data.customerName,
          email: data.customerEmail,
          phone: data.customerPhone,
        }
      });

      setPaymentResult(response.data);
      setShowConfetti(true);
      setStep(4); // Success step
      
      toast.success('Payment processed successfully!');
      
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);

    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewPayment = () => {
    setStep(1);
    setPaymentResult(null);
    setQrCodeData('');
  };

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, color: 'cyan', description: 'Visa, Mastercard, Amex' },
    { id: 'upi', name: 'UPI Payment', icon: QrCode, color: 'neon', description: 'Instant bank transfer' },
    { id: 'wallet', name: 'Digital Wallet', icon: Smartphone, color: 'purple', description: 'PayPal, Apple Pay' },
    { id: 'cash', name: 'Cash Payment', icon: IndianRupee, color: 'orange', description: 'Record cash transaction' },
  ];

  const gateways = [
    { id: 'stripe', name: 'Stripe', fee: '2.9%', logo: '💳' },
    { id: 'razorpay', name: 'Razorpay', fee: '2.0%', logo: '🏦' },
  ];

  return (
    <DashboardLayout>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            <Button
              variant="ghost"
              onClick={() => step > 1 ? setStep(step - 1) : router.back()}
              className="btn-secondary"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-text-primary neon-text">
                Process Payment
              </h1>
              <p className="text-text-secondary">
                Step {step} of 4 - {
                  step === 1 ? 'Payment Details' :
                  step === 2 ? 'Payment Method' :
                  step === 3 ? 'QR Code Payment' :
                  'Payment Complete'
                }
              </p>
            </div>
          </motion.div>

          {/* Progress Indicator */}
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`w-3 h-3 rounded-full transition-all ${
                i <= step ? 'bg-accent-cyan neon-glow' : 'bg-surface-2'
              }`} />
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1: Payment Details */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Payment Form */}
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle className="text-text-primary flex items-center">
                    <Receipt className="w-6 h-6 mr-2 text-accent-cyan" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Amount */}
                  <div>
                    <label className="text-sm font-medium text-text-primary mb-2 block">
                      Amount *
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-10 cyber-input text-xl font-bold"
                        {...register('amount', { valueAsNumber: true })}
                      />
                    </div>
                    {errors.amount && (
                      <p className="text-red-400 text-sm mt-1">{errors.amount.message}</p>
                    )}
                  </div>

                  {/* Customer Name */}
                  <div>
                    <label className="text-sm font-medium text-text-primary mb-2 block">
                      Customer Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                      <Input
                        placeholder="JKarthi M"
                        className="pl-10 cyber-input"
                        {...register('customerName')}
                      />
                    </div>
                    {errors.customerName && (
                      <p className="text-red-400 text-sm mt-1">{errors.customerName.message}</p>
                    )}
                  </div>

                  {/* Customer Email */}
                  <div>
                    <label className="text-sm font-medium text-text-primary mb-2 block">
                      Email (Optional)
                    </label>
                    <Input
                      type="email"
                      placeholder="Karthi@example.com"
                      className="cyber-input"
                      {...register('customerEmail')}
                    />
                  </div>

                  {/* Customer Phone */}
                  <div>
                    <label className="text-sm font-medium text-text-primary mb-2 block">
                      Phone (Optional)
                    </label>
                    <Input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className="cyber-input"
                      {...register('customerPhone')}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-sm font-medium text-text-primary mb-2 block">
                      Description (Optional)
                    </label>
                    <Input
                      placeholder="Payment for services"
                      className="cyber-input"
                      {...register('description')}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Summary */}
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle className="text-text-primary">Payment Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b border-border-primary">
                      <span className="text-text-secondary">Subtotal</span>
                      <span className="text-text-primary font-medium">
                        {watchedAmount ? formatCurrency(watchedAmount) : '$0.00'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between py-3 border-b border-border-primary">
                      <span className="text-text-secondary">Processing Fee</span>
                      <span className="text-text-secondary">
                        {watchedAmount ? formatCurrency(calculateCommission(watchedAmount)) : '$0.00'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between py-3">
                      <span className="text-lg font-semibold text-text-primary">Total</span>
                      <span className="text-lg font-bold text-accent-cyan">
                        {watchedAmount ? formatCurrency(watchedAmount + calculateCommission(watchedAmount)) : '$0.00'}
                      </span>
                    </div>

                    <Button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={!watchedAmount || watchedAmount <= 0}
                      className="w-full btn-primary h-12 neon-glow"
                    >
                      Continue to Payment Method
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Payment Method Selection */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              {/* Payment Methods */}
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle className="text-text-primary">Choose Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {paymentMethods.map((method) => (
                      <motion.div
                        key={method.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setValue('paymentMethod', method.id as any)}
                          className={`w-full h-32 flex-col space-y-3 p-4 ${
                            watchedPaymentMethod === method.id
                              ? `border-accent-${method.color} bg-accent-${method.color}/10`
                              : 'border-border-primary hover:border-border-secondary'
                          }`}
                        >
                          <method.icon className={`w-8 h-8 ${
                            watchedPaymentMethod === method.id
                              ? `text-accent-${method.color}`
                              : 'text-text-secondary'
                          }`} />
                          <div className="text-center">
                            <div className="font-medium text-text-primary">{method.name}</div>
                            <div className="text-xs text-text-tertiary">{method.description}</div>
                          </div>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Gateway Selection (for card payments) */}
              {watchedPaymentMethod === 'card' && (
                <Card className="cyber-card">
                  <CardHeader>
                    <CardTitle className="text-text-primary">Payment Gateway</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {gateways.map((gateway) => (
                        <Button
                          key={gateway.id}
                          type="button"
                          variant="outline"
                          onClick={() => setValue('gateway', gateway.id as any)}
                          className={`h-20 justify-between p-4 ${
                            watchedGateway === gateway.id
                              ? 'border-accent-cyan bg-accent-cyan/10'
                              : 'border-border-primary'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{gateway.logo}</span>
                            <div className="text-left">
                              <div className="font-medium">{gateway.name}</div>
                              <div className="text-sm text-text-tertiary">Fee: {gateway.fee}</div>
                            </div>
                          </div>
                          {watchedGateway === gateway.id && (
                            <Check className="w-5 h-5 text-accent-cyan" />
                          )}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Process Button */}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={isProcessing || !isValid}
                  className="btn-primary h-12 px-8 neon-glow"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    `Process ${formatCurrency(watchedAmount || 0)} Payment`
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: QR Code Payment */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-center"
            >
              <Card className="cyber-card max-w-md">
                <CardHeader>
                  <CardTitle className="text-text-primary text-center">
                    Scan QR Code to Pay
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-center">
                    <div className="p-4 bg-white rounded-xl">
                      <QRCode value={qrCodeData} size={200} />
                    </div>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <p className="text-text-primary font-medium">
                      Amount: {formatCurrency(watchedAmount || 0)}
                    </p>
                    <p className="text-text-secondary text-sm">
                      Use any UPI app to scan and pay
                    </p>
                  </div>

                  <Button
                    type="button"
                    onClick={() => setStep(4)}
                    className="w-full btn-primary"
                  >
                    Payment Received
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-center"
            >
              <Card className="cyber-card max-w-lg neon-border">
                <CardContent className="p-8 text-center space-y-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-20 h-20 bg-gradient-to-r from-accent-neon to-accent-cyan rounded-full flex items-center justify-center mx-auto"
                  >
                    <Check className="w-10 h-10 text-background-primary" />
                  </motion.div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary neon-text mb-2">
                      Payment Successful!
                    </h2>
                    <p className="text-text-secondary">
                      Transaction has been processed successfully
                    </p>
                  </div>

                  {paymentResult && (
                    <div className="bg-surface-1 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Transaction ID:</span>
                        <span className="text-text-primary font-mono">{paymentResult.transaction?.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Amount:</span>
                        <span className="text-text-primary font-medium">
                          {formatCurrency(paymentResult.transaction?.amount || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Commission:</span>
                        <span className="text-accent-neon">
                          {formatCurrency(paymentResult.transaction?.commission || 0)}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      type="button"
                      onClick={handleNewPayment}
                      className="btn-primary flex-1"
                    >
                      New Payment
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="btn-secondary flex-1"
                    >
                      <Receipt className="w-4 h-4 mr-2" />
                      Print Receipt
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </form>
      </div>
    </DashboardLayout>
  );
}