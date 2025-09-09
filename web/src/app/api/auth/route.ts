import { NextRequest, NextResponse } from 'next/server';
import type { UserRole, AuthUser } from '@/types';

const DEMO_PASSWORD = 'demo123';

const demoUsers: Record<UserRole, AuthUser> = {
  owner: { id: 'u_owner', name: 'Adithi Owner', email: 'owner@demo.com', role: 'owner' },
  retailer: { id: 'u_retailer', name: 'Retailer Raj', email: 'retailer@demo.com', role: 'retailer' }
};

export async function POST(req: NextRequest) {
  const { email, password, role } = (await req.json()) as {
    email: string;
    password: string;
    role: UserRole;
  };

  const match = Object.values(demoUsers).find((u) => u.email === email && u.role === role);
  if (!match || password !== DEMO_PASSWORD) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = Buffer.from(`${match.id}:${Date.now()}`).toString('base64');
  return NextResponse.json({ token, user: match }, { status: 200 });
}

