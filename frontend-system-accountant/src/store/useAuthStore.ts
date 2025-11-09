import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type AuthState = {
  token: string | null;
  user: { name: string; isAdmin: boolean } | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  logout: () => void;
};

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setToken: (token) => {
        set({
          token,
          isAuthenticated: true,
          user: { name: 'Admin User', isAdmin: true }, // Placeholder
        });
      },
      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);