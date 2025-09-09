export type UserRole = 'owner' | 'retailer';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Transaction {
  id: string;
  amount: number; // in cents
  fee: number; // in cents
  date: string; // ISO
  cardLast4: string;
  retailerId: string;
  status: 'succeeded' | 'pending' | 'failed';
}

export interface Metric {
  label: string;
  value: number;
  delta?: number;
  color?: 'blue' | 'green' | 'orange' | 'red';
  icon?: string;
}

