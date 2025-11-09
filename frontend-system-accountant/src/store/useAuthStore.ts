import { create } from 'zustand';
import type { AuthState } from '../interface/interfaceAuth';

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  login: (token) => set({ token }),
  logout: () => set({ token: null }),
}));
