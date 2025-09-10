import { NextRequest, NextResponse } from 'next/server';
// Import the Transaction type from your shared types file
import type { Transaction } from '@/types';

// A more complete mock data generator that adheres to the Transaction interface
const demoTransactions: Transaction[] = Array.from({ length: 12 }).map((_, i) => {
  const amount = 50000 + i * 3750;
  const commission = Math.round(amount * 0.03); // 3% commission
  
  // Cycle through all possible statuses and payment methods for more varied mock data
  const statusCycle: Transaction['status'][] = ['completed', 'pending', 'failed', 'refunded', 'cancelled'];
  const paymentMethodCycle: Transaction['paymentMethod'][] = ['card', 'upi', 'wallet', 'bank_transfer'];
  
  return {
    id: `tx_${i + 1}`,
    retailerId: i % 2 === 0 ? 'u_retailer' : 'u_owner_mock', // Using a mock owner ID
    retailerName: i % 2 === 0 ? "Raj's Retail Emporium" : "Adithi's Business",
    amount: amount,
    commission: commission,
    netAmount: amount - commission,
    currency: 'INR',
    customerDetails: {
      name: `Customer ${i + 1}`,
      email: `customer${i+1}@example.com`,
      cardLast4: String(1111 + i).slice(-4),
    },
    gateway: i % 2 === 0 ? 'razorpay' : 'stripe',
    gatewayTransactionId: `pi_${Math.random().toString(36).slice(2, 26)}`,
    status: statusCycle[i % statusCycle.length],
    paymentMethod: paymentMethodCycle[i % paymentMethodCycle.length],
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - i * 86400000).toISOString(),
  };
});

// GET handler to fetch all transactions
export async function GET(_req: NextRequest) {
  // In a real app, you would add pagination and filtering here
  return NextResponse.json({ transactions: demoTransactions }, { status: 200, headers: { 'Cache-Control': 'no-store' } });
}

// Define a type for the POST request payload for clarity and safety
interface CreateTransactionPayload {
    amount: number;
    customerName: string;
    cardLast4: string;
    retailerId: string;
}

// POST handler to create a new transaction
export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as CreateTransactionPayload;

    // Basic validation
    if (!payload.amount || !payload.customerName || !payload.cardLast4 || !payload.retailerId) {
        return NextResponse.json({ error: 'Missing required fields for transaction.' }, { status: 400 });
    }

    const commission = Math.round(payload.amount * 0.03); // 3% commission

    const createdTransaction: Transaction = {
      id: `tx_${Math.random().toString(36).slice(2, 8)}`,
      amount: payload.amount,
      commission: commission,
      netAmount: payload.amount - commission,
      currency: 'INR',
      retailerId: payload.retailerId,
      retailerName: "Raj's Retail Emporium", // Mocked for simplicity
      customerDetails: {
        name: payload.customerName,
        cardLast4: payload.cardLast4,
      },
      gateway: 'stripe',
      gatewayTransactionId: `pi_new_${Math.random().toString(36).slice(2, 24)}`,
      // Corrected status from 'succeeded' to 'completed'
      status: 'completed',
      paymentMethod: 'card',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ transaction: createdTransaction }, { status: 201 });
  } catch(error) {
    console.error("Create Transaction Error:", error);
    return NextResponse.json({ error: "Failed to create transaction." }, { status: 500 });
  }
}

