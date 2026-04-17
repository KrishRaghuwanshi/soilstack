import { create } from 'zustand';
import type { Profile, Role } from '../lib/types';
import { MOCK_FARMER_PROFILE } from '../lib/mockData';

interface AuthState {
  user: any | null;
  profile: Profile | null;
  role: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: any) => void;
  setProfile: (profile: Profile) => void;
  setRole: (role: Role) => void;
  loginAsFarmer: () => void;
  loginAsValidator: () => void;
  loginAsBuyer: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  role: null,
  isAuthenticated: false,
  isLoading: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setProfile: (profile) => set({ profile, role: profile.role }),
  setRole: (role) => set({ role }),

  loginAsFarmer: () =>
    set({
      isAuthenticated: true,
      role: 'farmer',
      profile: MOCK_FARMER_PROFILE,
      user: { id: 'farmer-1' },
    }),

  loginAsValidator: () =>
    set({
      isAuthenticated: true,
      role: 'validator',
      profile: {
        id: 'validator-1',
        role: 'validator',
        phone: '+919876543211',
        name: 'Rajesh Kumar',
        language: 'en',
        avatar_url: null,
        created_at: '2025-02-01T00:00:00Z',
      },
      user: { id: 'validator-1' },
    }),

  loginAsBuyer: () =>
    set({
      isAuthenticated: true,
      role: 'buyer',
      profile: {
        id: 'buyer-1',
        role: 'buyer',
        phone: '+14155551234',
        name: 'GreenCore Capital',
        language: 'en',
        avatar_url: null,
        created_at: '2025-01-01T00:00:00Z',
      },
      user: { id: 'buyer-1' },
    }),

  logout: () =>
    set({
      user: null,
      profile: null,
      role: null,
      isAuthenticated: false,
    }),
}));
