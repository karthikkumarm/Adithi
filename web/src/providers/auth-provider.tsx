"use client";
import React from 'react';
import { create } from 'zustand';
import { AuthUser, UserRole } from '@/types';

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (payload: { email: string; password: string; role: UserRole }) => Promise<void>;
  logout: () => void;
};

const demoUsers: Record<UserRole, AuthUser> = {
  owner: { id: 'u_owner', name: 'Adithi Owner', email: 'owner@demo.com', role: 'owner' },
  retailer: { id: 'u_retailer', name: 'Retailer Raj', email: 'retailer@demo.com', role: 'retailer' }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  login: async ({ email, password, role }) => {
    set({ isLoading: true });
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    if (!res.ok) {
      set({ isLoading: false });
      throw new Error('Invalid credentials');
    }
    const data = (await res.json()) as { token: string; user: AuthUser };
    localStorage.setItem('adithi_token', data.token);
    localStorage.setItem('adithi_user', JSON.stringify(data.user));
    set({ user: data.user, token: data.token, isLoading: false });
  },
  logout: () => {
    localStorage.removeItem('adithi_token');
    localStorage.removeItem('adithi_user');
    set({ user: null, token: null });
  }
}));

export function AuthProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    const token = localStorage.getItem('adithi_token');
    const userRaw = localStorage.getItem('adithi_user');
    if (token && userRaw) {
      try {
        const user = JSON.parse(userRaw) as AuthUser;
        useAuthStore.setState({ token, user });
      } catch {}
    }
  }, []);
  return <>{children}</>;
}

