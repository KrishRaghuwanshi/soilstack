import { create } from 'zustand';
import { MOCK_GLOBAL_CO2 } from '../lib/mockData';

interface AppState {
  globalCO2Counter: number;
  lastMintEvent: {
    campaign: string;
    tonnes: number;
  } | null;
  isReady: boolean;

  incrementCO2: () => void;
  setReady: (val: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  globalCO2Counter: MOCK_GLOBAL_CO2,
  lastMintEvent: null,
  isReady: false,

  incrementCO2: () => {
    // Simulate slow counter tick-up
    set({ globalCO2Counter: get().globalCO2Counter + 0.01 });
  },

  setReady: (val) => set({ isReady: val }),
}));
