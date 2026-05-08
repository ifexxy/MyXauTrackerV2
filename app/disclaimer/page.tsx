export default function DisclaimerPage() {
  const clauses = [
    'Trading gold involves high financial risk and you could lose your investment. Past price movements are not indicative of future results.',
    'XAU Tracker is not liable for any loss incurred due to the use of this website, its predictions, data, or any content found on it.',
    'XAU Tracker is not entitled to any profits made due to the use of this website.',
    'The contents found on this website are for educational purposes only and do not constitute financial advice.',
    'Users are solely responsible for their use of this website and any trading decisions made based on the information provided here.',
  ];

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '28px 20px 60px' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(255,69,97,0.08)', border: '1px solid rgba(255,69,97,0.2)', color: 'var(--red)', fontSize: 11, padding: '5px 13px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
        ⚠ Disclaimer
      </div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', lineHeight: 1.25, marginBottom: 6 }}>Risk Disclaimer</h1>
      <p style={{ fontSize: 13, color: 'var(--txt-2)', marginBottom: 28, lineHeight: 1.5 }}>Please read this carefully before using XAU Tracker.</p>
      <div style={{ height: 1, background: 'var(--border)', marginBottom: 28 }} />

      <div style={{ background: 'rgba(255,69,97,0.06)', border: '1px solid rgba(255,69,97,0.18)', borderRadius: 14, padding: 18, display: 'flex', gap: 14, marginBottom: 24 }}>
        <p style={{ fontSize: 14, color: '#fff', lineHeight: 1.75 }}>
          Trading gold involves high financial risk and you could lose your entire investment.
        </p>
      </div>

      {clauses.map((c, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 0', borderBottom: i < clauses.length - 1 ? '1px solid var(--border)' : 'none' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,69,97,0.1)', border: '1px solid rgba(255,69,97,0.2)', color: 'var(--red)', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'var(--font-space-mono)' }}>
            {String(i + 1).padStart(2, '0')}
          </div>
          <p style={{ fontSize: 14, color: '#fff', lineHeight: 1.75, flex: 1 }}>{c}</p>
        </div>
      ))}
      <p style={{ fontSize: 11, color: 'var(--txt-3)', fontFamily: 'var(--font-space-mono)', marginTop: 28 }}>Last updated: May 2026</p>
    </div>
  );
}
