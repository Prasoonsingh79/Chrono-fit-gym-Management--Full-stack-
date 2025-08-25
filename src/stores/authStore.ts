import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserSettings } from '@/types';
import { loginUser, registerUser, verifyToken, getUserById, getUserSettings } from '@/lib/database';

interface AuthState {
  user: User | null;
  settings: UserSettings | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  initializeAuth: () => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      settings: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const { user, token } = await loginUser(email, password);
          const settings = getUserSettings(user.id);
          
          set({
            user,
            settings,
            token,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true });
        try {
          const { user, token } = await registerUser(email, password, name);
          const settings = getUserSettings(user.id);
          
          set({
            user,
            settings,
            token,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          settings: null,
          token: null,
          isAuthenticated: false,
          isLoading: false
        });
      },

      initializeAuth: () => {
        const { token } = get();
        if (token) {
          try {
            const { userId } = verifyToken(token);
            const user = getUserById(userId);
            const settings = getUserSettings(userId);
            
            if (user) {
              set({
                user,
                settings,
                isAuthenticated: true
              });
            } else {
              set({
                user: null,
                settings: null,
                token: null,
                isAuthenticated: false
              });
            }
          } catch {
            set({
              user: null,
              settings: null,
              token: null,
              isAuthenticated: false
            });
          }
        }
      },

      updateSettings: (newSettings: Partial<UserSettings>) => {
        const { settings } = get();
        if (settings) {
          const updatedSettings = { ...settings, ...newSettings };
          set({ settings: updatedSettings });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token })
    }
  )
);
