import { create } from 'zustand';
import { createUser, getUserByEmail } from '../services/userService';
import type { User } from '../types/Users';

interface UserStore {
  user: User | null;
  registerUser: (newUser: Omit<User, 'id_usuario' | 'createdAt'>) => Promise<void>;
  fetchUserByEmail: (email: string) => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,

  registerUser: async (newUser) => {
    try {
      const createdUser = await createUser(newUser);
      set({ user: createdUser });
    } catch (error) {
      console.error('Error registering user in store:', error);
    }
  },

  fetchUserByEmail: async (email: string) => {
    try {
      const user = await getUserByEmail(email);
      set({ user });
    } catch (error) {
      console.error('Error fetching user by email in store:', error);
    }
  }
}));
