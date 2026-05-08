export default function AboutPage() {
  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '28px 20px 60px' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'var(--gold-glow)', border: '1px solid var(--gold-dim)', color: 'var(--gold)', fontSize: 11, padding: '5px 13px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
        ℹ About
      </div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', lineHeight: 1.25, marginBottom: 6 }}>About XAU Tracker</h1>
      <p style={{ fontSize: 13, color: 'var(--txt-2)', marginBottom: 28, lineHeight: 1.5 }}>What we are, how we work, and where our data comes from.</p>
      <div style={{ height: 1, background: 'var(--border)', marginBottom: 28 }} />

      {[
        {
          title: 'What is XAU Tracker?',
          body: 'XAU Tracker is a web-based app that tracks the real-time price movement of gold. It uses the ATR × √1440 model to predict price movement in a certain timeframe.',
        },
        {
          title: 'Algorithm',
          body: 'ATR stands for Average True Range — a measure of how much gold typically moves in a single day. We multiply it by the square root of time to produce realistic price predictions across different timeframes.',
          formula: 'ATR × √( t / 1440 )',
          formulaDesc: 'ATR = Average True Range · t = minutes ahead · 1440 = minutes in a day',
        },
        {
          title: 'Data Source',
          body: 'Live gold prices are fetched from the Metals.Dev API with Twelve Data as a fallback — both provide real-time data for trading assets globally.',
        },
      ].map((s) => (
        <div key={s.title} style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>{s.title}</div>
          <p style={{ fontSize: 14, color: '#fff', lineHeight: 1.8 }}>{s.body}</p>
          {s.formula && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px', marginTop: 14 }}>
              <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: 18, fontWeight: 700, color: 'var(--gold)', textAlign: 'center', padding: '12px 0' }}>{s.formula}</div>
              <div style={{ fontSize: 12, color: 'var(--txt-2)', textAlign: 'center', marginTop: 6, lineHeight: 1.6 }}>{s.formulaDesc}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
