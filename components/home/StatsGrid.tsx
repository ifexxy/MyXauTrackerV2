'use client';

import { useGoldStore } from '@/store/goldStore';
import { formatPrice } from '@/lib/chart-helpers';

export default function StatsGrid() {
  const { data } = useGoldStore();

  const stats = data
    ? [
        { label: 'Day High', value: '$' + formatPrice(data.high), color: 'var(--green)' },
        { label: 'Day Low', value: '$' + formatPrice(data.low), color: 'var(--red)' },
        { label: 'Open', value: '$' + formatPrice(data.open), color: 'var(--gold)' },
        {
          label: '24h Change',
          value: (data.ch >= 0 ? '+' : '') + data.ch.toFixed(2),
          color: data.ch >= 0 ? 'var(--green)' : 'var(--red)',
        },
      ]
    : [];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 10,
        padding: '0 16px 16px',
      }}
    >
      {stats.map((s) => (
        <div
          key={s.label}
          style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius)',
            padding: '14px 16px',
            border: '1px solid var(--border)',
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: 'var(--txt-2)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 6,
            }}
          >
            {s.label}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-space-mono)',
              fontSize: 16,
              fontWeight: 700,
              color: s.color,
            }}
          >
            {s.value}
          </div>
        </div>
      ))}

      {data && (
        <>
          <div
            style={{
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius)',
              padding: '14px 16px',
              border: '1px solid rgba(0,212,143,0.2)',
            }}
          >
            <div style={{ fontSize: 10, color: 'var(--txt-2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Bid</div>
            <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: 16, fontWeight: 700, color: 'var(--green)' }}>
              ${formatPrice(data.bid)}
            </div>
          </div>
          <div
            style={{
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius)',
              padding: '14px 16px',
              border: '1px solid rgba(255,69,97,0.2)',
            }}
          >
            <div style={{ fontSize: 10, color: 'var(--txt-2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Ask</div>
            <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: 16, fontWeight: 700, color: 'var(--red)' }}>
              ${formatPrice(data.ask)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
