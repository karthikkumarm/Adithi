import { NextRequest, NextResponse } from 'next/server';
// Import the User type from your shared types file
import type { User } from '@/types';

// Define UserRole locally for the Record key, based on the User interface
type UserRole = 'owner' | 'retailer';

const DEMO_PASSWORD = 'demo123';

// Update the demoUsers object to conform to the detailed User interface
const demoUsers: Record<UserRole, User> = {
  owner: {
    id: 'u_owner',
    name: 'Adithi Owner',
    email: 'owner@demo.com',
    role: 'owner',
    kycStatus: 'verified',
    commissionRate: 0,
    status: 'active',
    isVerified: true,
    twoFactorEnabled: true,
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-09-10T12:00:00Z',
    lastLoginAt: new Date().toISOString(),
    profileImage: 'https://i.pravatar.cc/150?u=owner@demo.com',
  },
  retailer: {
    id: 'u_retailer',
    name: 'Retailer Karthi',
    email: 'retailer@demo.com',
    role: 'retailer',
    businessName: "Karthi's Retail Emporium",
    kycStatus: 'verified',
    commissionRate: 3.5,
    status: 'active',
    isVerified: true,
    twoFactorEnabled: false,
    createdAt: '2023-02-20T11:30:00Z',
    updatedAt: '2023-09-09T18:45:00Z',
    lastLoginAt: new Date().toISOString(),
    profileImage: 'https://i.pravatar.cc/150?u=retailer@demo.com',
    bankDetails: {
      accountNumber: 'xxxx-xxxx-xxxx-1234',
      ifscCode: 'HDFC000123',
      bankName: 'HDFC Bank',
      accountHolderName: 'Retailer Karthi',
    },
    stats: {
        totalTransactions: 15647,
        totalVolume: 2847592,
        totalCommission: 99665.72,
        averageTransaction: 182.5,
        successRate: 98.2,
    }
  }
};

export async function POST(req: NextRequest) {
  try {
    const { email, password, role } = (await req.json()) as {
      email: string;
      password: string;
      role: UserRole;
    };

    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Missing email, password, or role' }, { status: 400 });
    }

    const match = Object.values(demoUsers).find((u) => u.email === email && u.role === role);
    // FIX: Corrected typo from DEMO-PASSWORD to DEMO_PASSWORD
    if (!match || password !== DEMO_PASSWORD) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // In a real application, you would generate a secure JWT here
    const token = Buffer.from(`${match.id}:${Date.now()}`).toString('base64');
    
    return NextResponse.json({ token, user: match }, { status: 200 });

  } catch (error) {
    console.error("Auth API Error:", error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}

