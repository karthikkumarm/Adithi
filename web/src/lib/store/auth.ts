import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { authAPI } from '@/lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email: string, password: string, role: string) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.login({ email, password, role });
          const { user, token } = response.data;
          
          localStorage.setItem('payflow_token', token);
          localStorage.setItem('payflow_user', JSON.stringify(user));
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('payflow_token');
        localStorage.removeItem('payflow_user');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      updateProfile: async (data: Partial<User>) => {
        try {
          const response = await authAPI.updateProfile(data);
          const updatedUser = response.data.user;
          
          localStorage.setItem('payflow_user', JSON.stringify(updatedUser));
          set({ user: updatedUser });
        } catch (error) {
          throw error;
        }
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'payflow-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);