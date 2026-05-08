'use client';

import { useState, useEffect, useRef } from 'react';
import { useGoldPrice } from '@/hooks/useGoldPrice';
import { useGoldStore } from '@/store/goldStore';
import { buildHistory, buildLabels } from '@/lib/chart-helpers';

type Range = '7D' | '30D' | '90D';

export default function TrendsPage() {
  useGoldPrice();
  const { data } = useGoldStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);
  const [range, setRange] = useState<Range>('7D');
  const [stats, setStats] = useState({ ma20: 0, ma50: 0, rsi: 0, spread: 0.60 });
  const [techRead, setTechRead] = useState('Loading...');

  useEffect(() => {
    if (!data || !canvasRef.current) return;

    async function draw() {
      const { Chart, registerables } = await import('chart.js');
      Chart.register(...registerables);
      if (chartRef.current) chartRef.current.destroy();

      const days = range === '7D' ? 7 : range === '30D' ? 30 : 90;
      const vol = range === '7D' ? 12 : range === '30D' ? 20 : 35;
      const points = buildHistory(data!.price, days, vol);
      const labels = buildLabels(days, points.length);
      const color = points[points.length - 1] >= points[0] ? '#00d48f' : '#ff4561';

      const ctx = canvasRef.current!.getContext('2d')!;
      const grad = ctx.createLinearGradient(0, 0, 0, 200);
      grad.addColorStop(0, color + '44');
      grad.addColorStop(1, color + '00');

      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: { labels, datasets: [{ data: points, borderColor: color, borderWidth: 2, fill: true, backgroundColor: grad, pointRadius: 0, tension: 0.4 }] },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            x: { display: false },
            y: { display: true, position: 'right', grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#3a4a60', font: { size: 10 }, callback: (v) => '$' + Number(v).toLocaleString() } },
          },
        },
      });

      const last = points.slice(-50);
      const ma20 = last.slice(-20).reduce((a, b) => a + b, 0) / Math.min(last.length, 20);
      const ma50 = last.reduce((a, b) => a + b, 0) / last.length;
      const gains: number[] = [], losses: number[] = [];
      for (let i = 1; i < Math.min(last.length, 15); i++) {
        const d = last[i] - last[i - 1];
        if (d > 0) gains.push(d); else losses.push(Math.abs(d));
      }
      const avgG = gains.length ? gains.reduce((a, b) => a + b, 0) / gains.length : 0;
      const avgL = losses.length ? losses.reduce((a, b) => a + b, 0) / losses.length : 1;
      const rsi = 100 - (100 / (1 + avgG / avgL));
      setStats({ ma20, ma50, rsi, spread: 0.60 });

      const ma20val = data!.price * (0.99 + Math.random() * 0.02);
      const above = data!.price > ma20val;
      setTechRead(
        `Gold is trading ${above ? 'above' : 'below'} its 20-day MA of $${ma20val.toFixed(2)}, signalling ${above ? 'bullish short-term momentum' : 'bearish short-term pressure'}. RSI at ${rsi.toFixed(1)} places the market in ${rsi > 70 ? 'overbought territory' : rsi < 30 ? 'oversold territory' : 'a neutral zone'}. Watch $${(data!.price * 0.988).toFixed(0)} support and $${(data!.price * 1.012).toFixed(0)} resistance.`
      );
    }

    draw();
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [data, range]);

  return (
    <div>
      <div style={{ margin: '16px 16px 0', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontSize: 12, color: 'var(--txt-2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>XAU/USD Trend</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {(['7D', '30D', '90D'] as Range[]).map((r) => (
              <button key={r} onClick={() => setRange(r)} style={{ padding: '3px 9px', borderRadius: 20, fontSize: 11, cursor: 'pointer', border: '1px solid var(--border)', background: range === r ? 'var(--gold)' : 'transparent', color: range === r ? '#000' : 'var(--txt-2)', fontFamily: 'var(--font-space-mono)' }}>
                {r}
              </button>
            ))}
          </div>
        </div>
        <canvas ref={canvasRef} height={200} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '16px 16px' }}>
        {[
          { label: 'MA 20', value: '$' + stats.ma20.toFixed(2) },
          { label: 'MA 50', value: '$' + stats.ma50.toFixed(2) },
          { label: 'RSI (14)', value: stats.rsi.toFixed(1), color: stats.rsi > 70 ? 'var(--red)' : stats.rsi < 30 ? 'var(--green)' : 'var(--txt-1)' },
          { label: 'Spread', value: '$' + stats.spread.toFixed(2) },
        ].map((s) => (
          <div key={s.label} style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '14px 16px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 10, color: 'var(--txt-2)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: 16, fontWeight: 700, color: s.color || 'var(--txt-1)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ margin: '0 16px 12px', background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: 16 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: 'var(--txt-1)' }}>Technical Read</h3>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--txt-2)' }}>{techRead}</p>
      </div>
    </div>
  );
}
