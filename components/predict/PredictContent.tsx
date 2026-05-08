'use client';

import { useGoldPrice } from '@/hooks/useGoldPrice';
import { useGoldStore } from '@/store/goldStore';
import { useMemo } from 'react';
import { buildPredictions, computeKeyLevels, computeSignals } from '@/lib/prediction-engine';
import { formatPrice, formatDelta } from '@/lib/chart-helpers';
import AccountDashboard from './AccountDashboard';
import PredictionTimeline from './PredictionTimeline';
import KeyLevels from './KeyLevels';
import SentimentCard from './SentimentCard';
import ModelInputs from './ModelInputs';
import SignalMeter from '@/components/home/SignalMeter';

export default function PredictContent() {
  const { refresh } = useGoldPrice(60000);
  const { data, isDemo } = useGoldStore();

  const pred = useMemo(() => {
    if (!data) return null;
    return buildPredictions(data.price, data.chp, data.high, data.low);
  }, [data]);

  const levels = useMemo(() => {
    if (!data) return null;
    return computeKeyLevels(data.high, data.low, data.price);
  }, [data]);

  const signals = useMemo(() => {
    if (!data) return null;
    return computeSignals(data.chp, data.ch);
  }, [data]);

  return (
    <div>
      <AccountDashboard />

      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ width: 38, height: 38, background: 'var(--gold-glow)', border: '1px solid var(--gold-dim)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontSize: 16 }}>🧠</div>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800 }}>Market Signals</h2>
            <p style={{ fontSize: 11, color: 'var(--txt-2)', marginTop: 2 }}>ATR-based forecast · Key levels · Sentiment</p>
          </div>
        </div>
      </div>

      <div style={{ margin: '0 16px 12px', padding: '10px 14px', background: 'rgba(212,167,44,0.05)', border: '1px solid rgba(212,167,44,0.12)', borderRadius: 10, fontSize: 11, color: 'var(--txt-2)', lineHeight: 1.6 }}>
        Forecasts use <strong style={{ color: 'var(--gold)' }}>ATR × √(t/1440)</strong> — the financial square-root-of-time volatility model.{' '}
        <strong style={{ color: 'var(--red)' }}>Not financial advice.</strong>
      </div>

      {data && (
        <div style={{ margin: '0 16px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div>
              <div style={{ fontSize: 10, color: 'var(--txt-2)', marginBottom: 3, fontFamily: 'var(--font-space-mono)' }}>XAU/USD SPOT</div>
              <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: 26, fontWeight: 700, color: 'var(--txt-1)' }}>
                <span style={{ fontSize: 14, color: 'var(--txt-2)', verticalAlign: 'super' }}>$</span>
                {formatPrice(data.price)}
              </div>
            </div>
            <span style={{ fontFamily: 'var(--font-space-mono)', fontSize: 12, padding: '4px 10px', borderRadius: 8, background: data.ch >= 0 ? 'var(--green-dim)' : 'var(--red-dim)', color: data.ch >= 0 ? 'var(--green)' : 'var(--red)' }}>
              {data.ch >= 0 ? '+' : ''}{formatDelta(data.ch)} ({formatDelta(data.chp)}%)
            </span>
          </div>
          <div style={{ fontSize: 10, color: 'var(--txt-3)', fontFamily: 'var(--font-space-mono)', textAlign: 'right' }}>
            <div>Daily ATR</div>
            <div style={{ color: 'var(--txt-1)', fontWeight: 700 }}>${pred?.atr.toFixed(2) ?? '—'}</div>
            <div style={{ marginTop: 4, fontSize: 9 }}>
              {isDemo ? '⚠ demo · ' : ''}Updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      )}

      {pred && data && <PredictionTimeline pred={pred} price={data.price} />}
      <SignalMeter />
      {signals && <SentimentCard emoji={signals.emoji} label={signals.label} />}
      {levels && <KeyLevels levels={levels} />}
      {pred && data && <ModelInputs pred={pred} data={data} />}

      <div style={{ margin: '0 16px 90px', padding: '10px 14px', background: 'rgba(255,69,97,0.06)', border: '1px solid rgba(255,69,97,0.15)', borderRadius: 10, fontSize: 11, color: 'var(--txt-2)', lineHeight: 1.5 }}>
        Not financial advice. Predictions are algorithmic estimates. XAU/USD carries significant market risk.
      </div>
    </div>
  );
}
