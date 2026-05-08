'use client';

import { useGoldStore } from '@/store/goldStore';
import { formatPrice, formatDelta } from '@/lib/chart-helpers';
import { Skeleton } from '@/components/ui/Skeleton';

export default function PriceHero() {
  const { data, isDemo, lastUpdated } = useGoldStore();

  if (!data) {
    return (
      <div style={{ padding: '24px 20px 16px', textAlign: 'center' }}>
        <Skeleton width="200px" height="48px" />
      </div>
    );
  }

  const isUp = data.ch >= 0;

  return (
    <div style={{ padding: '24px 20px 16px', textAlign: 'center' }}>
      <div
        style={{
          fontSize: 11,
          color: 'var(--txt-2)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-space-mono)',
          marginBottom: 6,
        }}
      >
        SPOT GOLD · XAU/USD · TROY OZ
      </div>
      <div
        style={{
          fontFamily: 'var(--font-space-mono)',
          fontSize: 48,
          fontWeight: 700,
          color: 'var(--txt-1)',
          letterSpacing: -1,
          lineHeight: 1,
        }}
      >
        <span style={{ fontSize: 24, color: 'var(--txt-2)', verticalAlign: 'super' }}>$</span>
        {formatPrice(data.price)}
      </div>
      <div style={{ marginTop: 10 }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 14px',
            borderRadius: 20,
            fontFamily: 'var(--font-space-mono)',
            fontSize: 13,
            fontWeight: 700,
            background: isUp ? 'var(--green-dim)' : 'var(--red-dim)',
            color: isUp ? 'var(--green)' : 'var(--red)',
          }}
        >
          {isUp ? '▲' : '▼'} {isUp ? '+' : ''}{formatDelta(data.ch)} ({isUp ? '+' : ''}{data.chp.toFixed(2)}%)
        </span>
      </div>
      <div
        style={{
          textAlign: 'center',
          fontSize: 10,
          color: 'var(--txt-3)',
          fontFamily: 'var(--font-space-mono)',
          padding: '4px 0 8px',
        }}
      >
        {isDemo ? '⚠ Demo · ' : ''}
        Updated {lastUpdated?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </div>
    </div>
  );
}
