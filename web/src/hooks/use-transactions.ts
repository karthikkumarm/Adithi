"use client";
import * as React from 'react';
import type { Transaction } from '@/types';

export function useTransactions() {
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [isLoading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchAll = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/transactions', { cache: 'no-store' });
      const data = (await res.json()) as { transactions: Transaction[] };
      setTransactions(data.transactions);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { transactions, isLoading, error, refetch: fetchAll };
}

