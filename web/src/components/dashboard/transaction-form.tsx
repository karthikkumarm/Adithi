"use client";
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

type FormValues = {
  amount: number;
  cardLast4: string;
};

export function TransactionForm() {
  const { register, handleSubmit, formState, reset } = useForm<FormValues>({
    defaultValues: { amount: 100, cardLast4: '4242' }
  });
  const [message, setMessage] = React.useState<string | null>(null);

  const onSubmit = handleSubmit(async (values) => {
    setMessage(null);
    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Math.round(values.amount * 100), cardLast4: values.cardLast4, retailerId: 'u_retailer' })
    });
    if (res.ok) {
      setMessage('Transaction processed successfully.');
      reset();
    } else {
      setMessage('Failed to process transaction.');
    }
  });

  return (
    <Card className="mt-6">
      <CardHeader>
        <h3 className="font-semibold">Quick Charge</h3>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm">Amount (INR)</label>
            <Input type="number" step="0.01" min={0} {...register('amount', { required: true, min: 0.5 })} />
          </div>
          <div>
            <label className="text-sm">Card Last 4</label>
            <Input maxLength={4} {...register('cardLast4', { required: true, minLength: 4, maxLength: 4 })} />
          </div>
          {message && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-apple-gray-700">{message}</motion.p>
          )}
          <Button type="submit" isLoading={formState.isSubmitting}>Charge</Button>
        </form>
      </CardContent>
    </Card>
  );
}

