"use client";
import { useAuthStore } from '@/providers/auth-provider';

export function useAuth() {
  const { user, token, isLoading, login, logout } = useAuthStore();
  const isAuthenticated = Boolean(user && token);
  return { user, token, isAuthenticated, isLoading, login, logout };
}

