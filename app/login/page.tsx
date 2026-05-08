'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get('from') || '/predict';

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const signIn = async () => {
    setErr('');
    if (!email || !pass) { setErr('Enter your email and password.'); return; }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      router.replace(from);
    } catch (e: any) {
      const msg =
        e.code === 'auth/user-not-found' ? 'No account found with this email.' :
        e.code === 'auth/wrong-password' ? 'Incorrect password.' :
        e.code === 'auth/too-many-requests' ? 'Too many attempts. Try again later.' :
        'Sign in failed. Check your details.';
      setErr(msg);
    } finally { setLoading(false); }
  };

  const resetPass = async () => {
    if (!email) { setErr('Enter your email address.'); return; }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch { setErr('Failed to send reset link.'); }
    finally { setLoading(false); }
  };

  const inputStyle = {
    display: 'block', width: '100%', background: 'var(--bg-muted)', border: '1px solid var(--border)',
    borderRadius: 10, color: 'var(--txt-1)', fontFamily: 'var(--font-syne)', fontSize: 14,
    padding: '11px 14px', outline: 'none', marginBottom: 14,
  } as React.CSSProperties;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: 20 }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '36px 28px', width: '100%', maxWidth: 380 }}>
        <div style={{ width: 52, height: 52, background: 'var(--gold)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#000', margin: '0 auto 16px' }}>⬡</div>
        <div style={{ textAlign: 'center', fontSize: 22, fontWeight: 800, marginBottom: 4 }}>XAU Tracker</div>
        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--txt-2)', marginBottom: 22 }}>
          {showReset ? 'Enter your email to reset your password.' : 'Sign in to access gold price predictions'}
        </p>

        {!showReset ? (
          <>
            <input style={inputStyle} type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input style={inputStyle} type="password" placeholder="••••••••" value={pass} onChange={(e) => setPass(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && signIn()} />
            {err && <p style={{ color: 'var(--red)', fontSize: 12, marginBottom: 12 }}>{err}</p>}
            <button disabled={loading} onClick={signIn} style={{ width: '100%', padding: 13, background: 'var(--gold)', color: '#000', border: 'none', borderRadius: 10, fontFamily: 'var(--font-syne)', fontSize: 14, fontWeight: 800, cursor: 'pointer', marginBottom: 10 }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <Link href="/signup" style={{ display: 'block', width: '100%', padding: 12, textAlign: 'center', background: 'transparent', color: 'var(--txt-2)', border: '1px solid var(--border)', borderRadius: 10, fontFamily: 'var(--font-syne)', fontSize: 14, fontWeight: 600, textDecoration: 'none', marginBottom: 12 }}>
              Create Account — 7 Days Free
            </Link>
            <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--txt-2)' }}>
              <span style={{ color: 'var(--gold)', cursor: 'pointer' }} onClick={() => setShowReset(true)}>Forgot password?</span>
            </p>
          </>
        ) : (
          <>
            <input style={inputStyle} type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            {err && <p style={{ color: 'var(--red)', fontSize: 12, marginBottom: 12 }}>{err}</p>}
            {resetSent && <p style={{ color: 'var(--green)', fontSize: 12, marginBottom: 12 }}>Reset link sent — check your inbox.</p>}
            <button disabled={loading} onClick={resetPass} style={{ width: '100%', padding: 13, background: 'var(--gold)', color: '#000', border: 'none', borderRadius: 10, fontFamily: 'var(--font-syne)', fontSize: 14, fontWeight: 800, cursor: 'pointer', marginBottom: 10 }}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--txt-2)' }}>
              <span style={{ color: 'var(--gold)', cursor: 'pointer' }} onClick={() => setShowReset(false)}>Back to sign in</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
