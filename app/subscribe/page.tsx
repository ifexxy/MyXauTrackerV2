'use client';

import { useAuthContext } from '@/context/AuthProvider';
import { useAccess } from '@/hooks/useAccess';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function SubscribePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthContext();
  const { access, loading: accessLoading } = useAccess(user);

  useEffect(() => {
    if (authLoading || accessLoading) return;
    if (!user) { router.replace('/login'); return; }
    if (access?.hasAccess) { router.replace('/predict'); }
  }, [user, access, authLoading, accessLoading, router]);

  const startPayment = async () => {
    if (!user) return;
    const token = await user.getIdToken();
    const FlutterwaveCheckout = (window as any).FlutterwaveCheckout;
    if (!FlutterwaveCheckout) { alert('Payment service not loaded. Please refresh.'); return; }

    FlutterwaveCheckout({
      public_key: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY,
      tx_ref: 'xau-' + Date.now() + '-' + user.uid.slice(0, 8),
      amount: 9900,
      currency: 'NGN',
      payment_options: 'card,banktransfer,ussd',
      customer: { email: user.email, name: user.displayName || user.email },
      customizations: { title: 'XAU Tracker', description: 'Monthly Predict Access — ₦9,900' },
      callback: async (response: any) => {
        if (response.status === 'successful') {
          const res = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transaction_id: response.transaction_id, userToken: token }),
          });
          const data = await res.json();
          if (data.success) router.replace('/predict');
        }
      },
      onclose: () => {},
    });
  };

  return (
    <>
      <script src="https://checkout.flutterwave.com/v3.js" async />
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '28px 20px 60px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'var(--gold-glow)', border: '1px solid var(--gold-dim)', color: 'var(--gold)', fontSize: 11, padding: '5px 13px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
          XauTracker Pro
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.25, marginBottom: 6 }}>Unlock Gold Real-time Forecast</h1>
        <p style={{ fontSize: 13, color: 'var(--txt-2)', marginBottom: 24, lineHeight: 1.6 }}>
          ATR-based price forecasts, key levels, gold signals and sentiment, updated live.
        </p>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--gold-dim)', borderRadius: 16, padding: 22, marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Monthly Plan</div>
          <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: 36, fontWeight: 700, marginBottom: 4 }}>
            ₦9,900<span style={{ fontSize: 16, color: 'var(--txt-2)' }}>/mo</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--txt-2)', marginBottom: 18 }}>Billed monthly · Cancel anytime</div>
          {['Real-time XAU/USD price forecasts', '5m, 10m, 15m, 1h, 6h & 24h timeline', 'ATR-based volatility model', 'Key support & resistance levels', 'Market sentiment & signals'].map((f) => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--txt-1)', padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--green)', fontSize: 12 }}>✓</span> {f}
            </div>
          ))}
          <button onClick={startPayment} style={{ width: '100%', padding: 15, marginTop: 20, background: 'var(--gold)', color: '#000', border: 'none', borderRadius: 12, fontFamily: 'var(--font-syne)', fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>
            Subscribe — ₦9,900/month
          </button>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 22, marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Pay with Bank Transfer</div>
          <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: 36, fontWeight: 700, marginBottom: 16 }}>₦9,900</div>
          {['Transfer ₦9,900 to OPAY — 6518823532', 'Include your email in the transfer narration', 'Account will be activated after confirmation'].map((s) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--txt-1)', padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--green)', fontSize: 12 }}>✓</span> {s}
            </div>
          ))}
        </div>

        <button onClick={() => { signOut(auth); router.replace('/login'); }} style={{ width: '100%', padding: 12, marginTop: 12, background: 'transparent', color: 'var(--txt-2)', border: '1px solid var(--border)', borderRadius: 12, fontFamily: 'var(--font-syne)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          Sign Out
        </button>
      </div>
    </>
  );
}
