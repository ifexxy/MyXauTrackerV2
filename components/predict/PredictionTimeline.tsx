'use client';

import { PredictionResult } from '@/types';
import { formatPrice, formatDelta } from '@/lib/chart-helpers';

interface Props {
  pred: PredictionResult;
  price: number;
}

interface RowProps {
  label: string;
  icon: string;
  target: number;
  base: number;
  bandLow: number;
  bandHigh: number;
  conf: number;
  threshold: number;
}

function TimelineRow({ label, icon, target, base, bandLow, bandHigh, conf, threshold }: RowProps) {
  const diff = target - base;
  const pct = (diff / base) * 100;
  const isUp = diff >= 0;
  const isBull = diff > threshold;
  const isBear = diff < -threshold;

  const badgeStyle = isBull
    ? { background: 'var(--green-dim)', color: 'var(--green)' }
    : isBear
    ? { background: 'var(--red-dim)', color: 'var(--red)' }
    : { background: 'var(--gold-glow)', color: 'var(--gold)' };

  const badgeText = isBull ? 'BULL' : isBear ? 'BEAR' : 'FLAT';

  const confColor = conf >= 80 ? 'var(--green)' : conf >= 55 ? 'var(--gold)' : 'var(--red)';

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '11px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 18, flexShrink: 0, paddingTop: 4 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid var(--gold)', background: 'var(--bg-deep)' }} />
        <div style={{ width: 2, flex: 1, minHeight: 16, background: 'var(--border)' }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, color: 'var(--txt-2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>
          {icon} {label}
        </div>
        <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: 18, fontWeight: 700, color: 'var(--txt-1)', lineHeight: 1.1 }}>
          ${formatPrice(target)}
        </div>
        <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: 11, marginTop: 2, color: isUp ? 'var(--green)' : 'var(--red)' }}>
          {isUp ? '+' : ''}{formatDelta(diff)} ({isUp ? '+' : ''}{pct.toFixed(2)}%)
        </div>
        <div style={{ fontSize: 10, color: 'var(--txt-3)', fontFamily: 'var(--font-space-mono)', marginTop: 2 }}>
          ±1σ band ${formatPrice(bandLow)} – ${formatPrice(bandHigh)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
          <div style={{ flex: 1, height: 3, background: 'var(--bg-muted)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${conf}%`, background: confColor, borderRadius: 2 }} />
          </div>
          <span style={{ fontSize: 10, color: 'var(--txt-3)', fontFamily: 'var(--font-space-mono)', whiteSpace: 'nowrap' }}>
            {conf}% conf.
          </span>
        </div>
      </div>
      <div style={{ flexShrink: 0, padding: '4px 9px', borderRadius: 8, fontSize: 10, fontFamily: 'var(--font-space-mono)', fontWeight: 700, marginTop: 2, textAlign: 'center', minWidth: 52, ...badgeStyle }}>
        {badgeText}
      </div>
    </div>
  );
}

export default function PredictionTimeline({ pred, price }: Props) {
  const rows = [
    { label: '5 Min Forecast', icon: '⚡', f: pred.f5m, threshold: 0.30 },
    { label: '10 Min Forecast', icon: '⏱', f: pred.f10m, threshold: 0.50 },
    { label: '15 Min Forecast', icon: '⏳', f: pred.f15m, threshold: 0.75 },
    { label: '1 Hour Forecast', icon: '🕐', f: pred.f1h, threshold: 1.50 },
    { label: '6 Hour Forecast', icon: '⏰', f: pred.f6h, threshold: 4.00 },
    { label: '24 Hour Forecast', icon: '📅', f: pred.f24h, threshold: 8.00 },
  ];

  return (
    <div style={{ margin: '0 16px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
      <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--txt-1)', marginBottom: 14 }}>Price Prediction Timeline</h3>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '11px 0', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 18, flexShrink: 0, paddingTop: 4 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--gold)', borderColor: 'var(--gold)', boxShadow: '0 0 8px var(--gold)' }} />
        </div>
        <div>
          <div style={{ fontSize: 10, color: 'var(--txt-2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>🟢 Live · Right Now</div>
          <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: 18, fontWeight: 700 }}>${formatPrice(price)}</div>
          <div style={{ fontSize: 10, color: 'var(--txt-3)', fontFamily: 'var(--font-space-mono)', marginTop: 2 }}>
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', padding: '4px 9px', borderRadius: 8, fontSize: 10, fontFamily: 'var(--font-space-mono)', fontWeight: 700, background: 'rgba(212,167,44,0.15)', color: 'var(--gold)' }}>LIVE</div>
      </div>

      {rows.map((r) => (
        <TimelineRow
          key={r.label}
          label={r.label}
          icon={r.icon}
          target={r.f.target}
          base={price}
          bandLow={r.f.bandLow}
          bandHigh={r.f.bandHigh}
          conf={r.f.conf}
          threshold={r.threshold}
        />
      ))}
    </div>
  );
}
