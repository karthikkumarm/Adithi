"use client";
import { useAuthStore } from '@/components/providers/AuthProvider';

export function useAuth() {
  const { user, token, isLoading, login, logout } = useAuthStore();
  const isAuthenticated = Boolean(user && token);
  return { user, token, isAuthenticated, isLoading, login, logout };
}

