'use client';

import { useGoldStore } from '@/store/goldStore';
import { computeSignals } from '@/lib/prediction-engine';
import { useMemo } from 'react';

export default function SignalMeter() {
  const { data } = useGoldStore();

  const signals = useMemo(() => {
    if (!data) return null;
    return computeSignals(data.chp, data.ch);
  }, [data]);

  const rows = signals
    ? [
        { label: 'BUY', pct: signals.buy, color: 'var(--green)' },
        { label: 'HLD', pct: signals.hold, color: 'var(--gold)' },
        { label: 'SELL', pct: signals.sell, color: 'var(--red)' },
      ]
    : [];

  return (
    <div
      style={{
        margin: '0 16px 16px',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        padding: 16,
      }}
    >
      <div style={{ fontSize: 11, color: 'var(--txt-2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
        Market Signal
      </div>
      {rows.map((r) => (
        <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 12, color: r.color, width: 30 }}>{r.label}</span>
          <div style={{ flex: 1, height: 8, background: 'var(--bg-muted)', borderRadius: 4, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${r.pct}%`,
                background: r.color,
                borderRadius: 4,
                transition: 'width 0.8s ease',
              }}
            />
          </div>
          <span style={{ fontSize: 12, fontFamily: 'var(--font-space-mono)', width: 36, textAlign: 'right', color: r.color }}>
            {r.pct}%
          </span>
        </div>
      ))}
    </div>
  );
}
