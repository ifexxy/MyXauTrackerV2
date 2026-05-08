import { create } from 'zustand';
import type { GoldPrice } from '@/types';

interface GoldStore {
  data: GoldPrice | null;
  isDemo: boolean;
  lastUpdated: Date | null;
  setData: (data: GoldPrice, isDemo?: boolean) => void;
}

const DEMO_DATA: GoldPrice = {
  price: 3124.80,
  open: 3110.00,
  high: 3138.50,
  low: 3098.20,
  bid: 3124.50,
  ask: 3125.10,
  ch: 14.80,
  chp: 0.48,
  source: 'Demo',
};

export const useGoldStore = create<GoldStore>((set) => ({
  data: null,
  isDemo: false,
  lastUpdated: null,
  setData: (data, isDemo = false) =>
    set({ data, isDemo, lastUpdated: new Date() }),
}));

export { DEMO_DATA };
