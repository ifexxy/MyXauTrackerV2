'use client';

import { useEffect, useRef, useState } from 'react';
import { useGoldStore } from '@/store/goldStore';
import { buildHistory, buildLabels } from '@/lib/chart-helpers';

type Range = '1D' | '1W' | '1M';

export default function PriceChart() {
  const { data } = useGoldStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);
  const [range, setRange] = useState<Range>('1D');

  useEffect(() => {
    if (!data || !canvasRef.current) return;

    async function draw() {
      const { Chart, registerables } = await import('chart.js');
      Chart.register(...registerables);

      if (chartRef.current) chartRef.current.destroy();

      const days = range === '1D' ? 1 : range === '1W' ? 7 : 30;
      const volatility = range === '1D' ? 3 : range === '1W' ? 10 : 18;
      const points = buildHistory(data!.price, days, volatility);
      const labels = buildLabels(days, points.length);
      const color = points[points.length - 1] >= points[0] ? '#00d48f' : '#ff4561';

      const ctx = canvasRef.current!.getContext('2d')!;
      const grad = ctx.createLinearGradient(0, 0, 0, 200);
      grad.addColorStop(0, color + '44');
      grad.addColorStop(1, color + '00');

      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{ data: points, borderColor: color, borderWidth: 2, fill: true, backgroundColor: grad, pointRadius: 0, tension: 0.4 }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0e1622',
              borderColor: 'rgba(255,255,255,0.08)',
              borderWidth: 1,
              callbacks: {
                title: () => 'XAU/USD',
                label: (ctx) => ' $' + ctx.parsed.y.toLocaleString('en-US', { minimumFractionDigits: 2 }),
              },
            },
          },
          scales: {
            x: { display: false },
            y: {
              display: true,
              position: 'right',
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: { color: '#3a4a60', font: { size: 10 }, callback: (v) => '$' + Number(v).toLocaleString() },
            },
          },
        },
      });
    }

    draw();
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [data, range]);

  const ranges: Range[] = ['1D', '1W', '1M'];

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontSize: 12, color: 'var(--txt-2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Price Chart
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              style={{
                padding: '3px 9px',
                borderRadius: 20,
                fontSize: 11,
                cursor: 'pointer',
                border: '1px solid var(--border)',
                background: range === r ? 'var(--gold)' : 'transparent',
                color: range === r ? '#000' : 'var(--txt-2)',
                fontFamily: 'var(--font-space-mono)',
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <canvas ref={canvasRef} height={160} />
    </div>
  );
}
