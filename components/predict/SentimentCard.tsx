export default function SentimentCard({ emoji, label }: { emoji: string; label: string }) {
  return (
    <div style={{ margin: '0 16px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
      <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--txt-1)', marginBottom: 14 }}>Market Sentiment</h3>
      <div style={{ textAlign: 'center', padding: '10px 0 4px' }}>
        <div style={{ fontSize: 44, fontWeight: 800, lineHeight: 1 }}>{emoji}</div>
        <div style={{ fontSize: 12, color: 'var(--txt-2)', marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
      </div>
    </div>
  );
}
