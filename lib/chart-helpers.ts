export function buildHistory(basePrice: number, days: number, volatility: number = 18): number[] {
  const points: number[] = [];
  let p = basePrice * (1 - 0.03 * Math.random());
  const n = days * 8;
  for (let i = 0; i < n; i++) {
    p += (Math.random() - 0.492) * volatility;
    p = Math.max(p, basePrice * 0.85);
    points.push(parseFloat(p.toFixed(2)));
  }
  points.push(basePrice);
  return points;
}

export function buildLabels(days: number, count: number): string[] {
  const labels: string[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getTime() - (count - i) * (days * 86400000 / count));
    labels.push(
      days <= 1
        ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : d.toLocaleDateString([], { month: 'short', day: 'numeric' })
    );
  }
  return labels;
}

export function formatPrice(v: number): string {
  return v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatDelta(v: number): string {
  return (v >= 0 ? '+' : '') + v.toFixed(2);
}
