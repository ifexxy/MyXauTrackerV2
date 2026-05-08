'use client';

import { formatPrice } from '@/lib/chart-helpers';

interface Props {
  levels: { r2: number; r1: number; current: number; s1: number; s2: number };
}

export default function KeyLevels({ levels }: Props) {
  const rows = [
    { name: 'Strong Resistance', value: levels.r2, badge: 'R2', style: { background: 'var(--red-dim)', color: 'var(--red)' } },
    { name: 'Resistance', value: levels.r1, badge: 'R1', style: { background: 'var(--red-dim)', color: 'var(--red)' } },
    { name: 'Current Price', value: levels.current, badge: 'NOW', style: { background: 'var(--gold-glow)', color: 'var(--gold)' }, highlight: true },
    { name: 'Support', value: levels.s1, badge: 'S1', style: { background: 'var(--green-dim)', color: 'var(--green)' } },
    { name: 'Strong Support', value: levels.s2, badge: 'S2', style: { background: 'var(--green-dim)', color: 'var(--green)' } },
  ];

  return (
    <div style={{ margin: '0 16px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
      <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--txt-1)', marginBottom: 14 }}>Key Price Levels</h3>
      {rows.map((r, i) => (
        <div
          key={r.badge}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: r.highlight ? '8px 6px' : '9px 0',
            borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none',
            background: r.highlight ? 'rgba(212,167,44,0.04)' : 'transparent',
            borderRadius: r.highlight ? 8 : 0,
          }}
        >
          <span style={{ fontSize: 12, color: r.highlight ? 'var(--txt-1)' : 'var(--txt-2)', fontWeight: r.highlight ? 700 : 400 }}>{r.name}</span>
          <span style={{ fontFamily: 'var(--font-space-mono)', fontSize: 13, fontWeight: 700, color: r.highlight ? 'var(--gold)' : 'var(--txt-1)' }}>
            ${formatPrice(r.value)}
          </span>
          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, ...r.style }}>{r.badge}</span>
        </div>
      ))}
    </div>
  );
}
