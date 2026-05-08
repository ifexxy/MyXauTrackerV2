'use client';

import { useEffect, useCallback } from 'react';
import { useGoldStore, DEMO_DATA } from '@/store/goldStore';
import type { GoldPrice } from '@/types';

export async function fetchGoldPrice(): Promise<GoldPrice> {
  const res = await fetch('/api/price');
  if (!res.ok) throw new Error('price API ' + res.status);
  return res.json();
}

export function useGoldPrice(intervalMs: number = 60000) {
  const { setData } = useGoldStore();

  const load = useCallback(async () => {
    try {
      const data = await fetchGoldPrice();
      setData(data, false);
    } catch {
      setData(DEMO_DATA, true);
    }
  }, [setData]);

  useEffect(() => {
    load();
    const interval = setInterval(load, intervalMs);
    return () => clearInterval(interval);
  }, [load, intervalMs]);

  return { refresh: load };
}
