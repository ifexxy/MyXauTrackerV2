'use client';

import Link from 'next/link';
import { useAuthContext } from '@/context/AuthProvider';

export default function LandingSection() {
  const { user, loading } = useAuthContext();

  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '40px 22px 36px',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <p style={{ fontSize: 14, lineHeight: 1.75, color: 'rgba(255,255,255,0.65)', marginBottom: 28, textAlign: 'center' }}>
        <strong>Trade Gold with peace of mind</strong> — advanced ATR-based model predictions on the Forecast page.
      </p>

      <div
        style={{
          background: 'rgba(14,22,34,0.8)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: 20,
          marginBottom: 28,
        }}
      >
        <div style={{ fontSize: 10, color: 'var(--txt-2)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'var(--font-space-mono)', marginBottom: 10 }}>
          Your Account
        </div>

        {loading ? (
          <div className="skeleton" style={{ height: 48, borderRadius: 10 }} />
        ) : user ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--gold-glow)', border: '1px solid var(--gold-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', flexShrink: 0 }}>
                👤
              </div>
              <div>
                <div style={{ fontSize: 10, color: 'var(--green)', fontFamily: 'var(--font-space-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Logged in</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
              </div>
            </div>
            <Link
              href="/predict"
              style={{ display: 'block', width: '100%', textAlign: 'center', background: '#fff', color: '#000', fontFamily: 'var(--font-syne)', fontSize: 14, fontWeight: 800, padding: '14px 20px', borderRadius: 12, textDecoration: 'none' }}
            >
              Access XAUUSD Forecast
            </Link>
          </>
        ) : (
          <>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(0,212,143,0.1)', border: '1px solid rgba(0,212,143,0.2)', color: 'var(--green)', fontSize: 11, fontFamily: 'var(--font-space-mono)', padding: '4px 12px', borderRadius: 20, marginBottom: 16 }}>
              7 Days Free Trial · No Payment Required
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, marginBottom: 16 }}>
              Create an account in <strong style={{ color: '#fff' }}>two simple steps</strong> and get a <strong style={{ color: '#fff' }}>7-day trial</strong>.
            </p>
            <Link
              href="/signup"
              style={{ display: 'block', width: '100%', textAlign: 'center', background: '#fff', color: '#000', fontFamily: 'var(--font-syne)', fontSize: 14, fontWeight: 800, padding: '14px 20px', borderRadius: 12, textDecoration: 'none' }}
            >
              Create Account
            </Link>
          </>
        )}
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 22 }}>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 14, textAlign: 'center' }}>
          Got questions or enquiries? Reach us directly.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          
            href="https://wa.me/2348131560586"
            target="_blank"
            rel="noopener noreferrer"
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 14px', background: '#25D366', color: '#000', fontFamily: 'var(--font-syne)', fontSize: 13, fontWeight: 800, borderRadius: 12, textDecoration: 'none' }}
          >
            WhatsApp Us
          </a>
          <Link
            href="/contact"
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 14px', background: 'transparent', color: '#fff', fontFamily: 'var(--font-syne)', fontSize: 13, fontWeight: 700, borderRadius: 12, border: '1px solid rgba(255,255,255,0.18)', textDecoration: 'none' }}
          >
            Send a Mail
          </Link>
        </div>
      </div>
    </section>
  );
}
