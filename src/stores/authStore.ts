import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          // Simulate API call - in production, replace with actual API
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Mock validation
          if (!email || !password) {
            return { success: false, error: 'Email and password are required' };
          }

          // Mock successful login
          const mockUser = {
            id: 1,
            email,
            name: email.split('@')[0],
          };
          const mockToken = 'jwt-token-' + Date.now();

          set({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
          });

          return { success: true };
        } catch (error) {
          return { success: false, error: 'Login failed. Please try again.' };
        }
      },

      register: async (name: string, email: string, password: string) => {
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 800));

          // Mock validation
          if (!name || !email || !password) {
            return { success: false, error: 'All fields are required' };
          }

          if (password.length < 6) {
            return { success: false, error: 'Password must be at least 6 characters' };
          }

          // Mock successful registration
          const mockUser = {
            id: Date.now(),
            email,
            name,
          };
          const mockToken = 'mock-jwt-token-' + Date.now();

          set({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
          });

          return { success: true };
        } catch (error) {
          return { success: false, error: 'Registration failed. Please try again.' };
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      checkAuth: () => {
        return get().isAuthenticated;
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
