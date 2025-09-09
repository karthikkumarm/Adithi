import { NextRequest, NextResponse } from 'next/server';
import type { Transaction } from '@/types';

const demoTransactions: Transaction[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `tx_${i + 1}`,
  amount: 50000 + i * 3750, // amounts in paise (~₹500+)
  fee: 1500 + (i % 3) * 100, // fees in paise
  date: new Date(Date.now() - i * 86400000).toISOString(),
  cardLast4: String(1111 + i).slice(-4),
  retailerId: i % 2 === 0 ? 'u_retailer' : 'u_owner',
  status: i % 4 === 0 ? 'pending' : 'succeeded'
}));

export async function GET(_req: NextRequest) {
  return NextResponse.json({ transactions: demoTransactions }, { status: 200, headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(req: NextRequest) {
  const payload = (await req.json()) as Pick<Transaction, 'amount' | 'cardLast4' | 'retailerId'>;
  const created: Transaction = {
    id: `tx_${Math.random().toString(36).slice(2, 8)}`,
    amount: payload.amount,
    fee: Math.round(payload.amount * 0.03),
    date: new Date().toISOString(),
    cardLast4: payload.cardLast4,
    retailerId: payload.retailerId,
    status: 'succeeded'
  };
  return NextResponse.json({ transaction: created }, { status: 201 });
}

