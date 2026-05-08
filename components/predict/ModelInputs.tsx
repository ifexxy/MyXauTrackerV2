'use client';

import type { PredictionResult } from '@/types';
import type { GoldPrice } from '@/types';

interface Props {
  pred: PredictionResult;
  data: GoldPrice;
}

export default function ModelInputs({ pred, data }: Props) {
  const { atr, session, mrStrength } = pred;
  const { chp, ch, high, low } = data;
  const isUp = ch >= 0;

  const atrCat = atr < 20 ? 'LOW' : atr < 35 ? 'NORMAL' : 'HIGH';
  const intradayRangePct = ((high - low) / atr * 100).toFixed(0);
  const volCat = Number(intradayRangePct) < 40 ? 'QUIET' : Number(intradayRangePct) < 80 ? 'NORMAL' : 'WIDE';
  const mrLabel = mrStrength < 0.2 ? 'LOW' : mrStrength < 0.5 ? 'MODERATE' : 'HIGH';

  const rows = [
    {
      icon: '📊', iconBg: 'var(--gold-glow)', iconColor: 'var(--gold)',
      name: 'Daily ATR',
      desc: `Daily range $${atr.toFixed(2)} — ${atrCat.toLowerCase()} volatility environment`,
      sig: '$' + atr.toFixed(2),
      sigStyle: { background: 'var(--gold-glow)', color: 'var(--gold)' },
    },
    {
      icon: '📈', iconBg: isUp ? 'var(--green-dim)' : 'var(--red-dim)', iconColor: isUp ? 'var(--green)' : 'var(--red)',
      name: 'Momentum',
      desc: `${isUp ? 'Positive' : 'Negative'} ${Math.abs(chp).toFixed(2)}% move today`,
      sig: (isUp ? '+' : '') + chp.toFixed(2) + '%',
      sigStyle: { background: isUp ? 'var(--green-dim)' : 'var(--red-dim)', color: isUp ? 'var(--green)' : 'var(--red)' },
    },
    {
      icon: '〰', iconBg: 'rgba(120,100,200,0.12)', iconColor: '#a080ff',
      name: 'Intraday Volatility',
      desc: `Today's range $${(high - low).toFixed(2)} = ${intradayRangePct}% of ATR`,
      sig: volCat,
      sigStyle: { background: 'rgba(120,100,200,0.12)', color: '#a080ff' },
    },
    {
      icon: '🔄', iconBg: 'var(--gold-glow)', iconColor: 'var(--gold)',
      name: 'Mean Reversion',
      desc: 'Counter-trend pull probability',
      sig: mrLabel,
      sigStyle: { background: 'var(--gold-glow)', color: 'var(--gold)' },
    },
    {
      icon: '🏛', iconBg: 'var(--red-dim)', iconColor: 'var(--red)',
      name: 'Market Session',
      desc: `${session.sessionLabel} session · ${session.volLabel.toLowerCase()} activity`,
      sig: `×${session.sessionMultiplier.toFixed(2)}`,
      sigStyle: {
        background: session.sessionMultiplier >= 1.2 ? 'var(--red-dim)' : session.sessionMultiplier >= 1.0 ? 'var(--gold-glow)' : 'var(--bg-muted)',
        color: session.sessionMultiplier >= 1.2 ? 'var(--red)' : session.sessionMultiplier >= 1.0 ? 'var(--gold)' : 'var(--txt-3)',
      },
    },
  ];

  return (
    <div style={{ margin: '0 16px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
      <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--txt-1)', marginBottom: 14 }}>Model Inputs</h3>
      {rows.map((r, i) => (
        <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none' }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0, background: r.iconBg, color: r.iconColor }}>
            {r.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--txt-1)' }}>{r.name}</div>
            <div style={{ fontSize: 11, color: 'var(--txt-2)', marginTop: 1 }}>{r.desc}</div>
          </div>
          <div style={{ fontSize: 10, padding: '3px 9px', borderRadius: 8, fontFamily: 'var(--font-space-mono)', fontWeight: 700, flexShrink: 0, ...r.sigStyle }}>
            {r.sig}
          </div>
        </div>
      ))}
    </div>
  );
}
