'use client';

import { useGoldPrice } from '@/hooks/useGoldPrice';
import PriceHero from '@/components/home/PriceHero';
import StatsGrid from '@/components/home/StatsGrid';
import PriceChart from '@/components/home/PriceChart';
import SignalMeter from '@/components/home/SignalMeter';
import LandingSection from '@/components/home/LandingSection';

export default function HomePage() {
  useGoldPrice(10000);

  return (
    <>
      <LandingSection />
      <PriceHero />
      <StatsGrid />
      <PriceChart />
      <SignalMeter />
    </>
  );
}
