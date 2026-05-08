'use client';

import { useState, useEffect, useRef } from 'react';
import { createUserWithEmailAndPassword, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDocs, collection, query, where, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [pass2, setPass2] = useState('');
  const [phone, setPhone] = useState('');
  const [dialCode, setDialCode] = useState('+234');
  const [otp, setOtp] = useState('');
  const [err, setErr] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);
  const confirmRef = useRef<any>(null);

  useEffect(() => {
    if (step === 2 && !recaptchaRef.current) {
      recaptchaRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'normal' });
      recaptchaRef.current.render();
    }
  }, [step]);

  const goStep2 = () => {
    setErr('');
    if (!email) { setErr('Enter your email.'); return; }
    if (pass.length < 6) { setErr('Password must be 6+ characters.'); return; }
    if (pass !== pass2) { setErr('Passwords do not match.'); return; }
    setStep(2);
  };

  const sendOTP = async () => {
    setErr('');
    const fullPhone = dialCode + phone.replace(/^0/, '');
    setLoading(true);
    try {
      const existing = await getDocs(query(collection(db, 'users'), where('phone', '==', fullPhone)));
      if (!existing.empty) { setErr('This phone number has already been used for a free trial.'); setLoading(false); return; }
      confirmRef.current = await signInWithPhoneNumber(auth, fullPhone, recaptchaRef.current!);
      setOtpSent(true);
    } catch (e: any) {
      setErr(e.code === 'auth/invalid-phone-number' ? 'Invalid phone number.' : e.code === 'auth/too-many-requests' ? 'Too many attempts.' : e.message);
    } finally { setLoading(false); }
  };

  const doSignup = async () => {
    setErr('');
    if (!otp || otp.length !== 6) { setErr('Enter the 6-digit code.'); return; }
    setLoading(true);
    try {
      PhoneAuthProvider.credential(confirmRef.current.verificationId, otp);
      const { user } = await createUserWithEmailAndPassword(auth, email, pass);
      const trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      await setDoc(doc(db, 'users', user.uid), {
        email, phone, createdAt: serverTimestamp(), trialEndsAt,
        subscriptionStatus: 'trial', manualAccess: false, manualAccessNote: '',
        manualAccessExpiresAt: null, flutterwaveTxRef: null, flutterwaveTxId: null,
        currentPeriodEnd: null, lastPaymentAt: null, lastPaymentAmount: null,
      });
      router.replace('/predict');
    } catch (e: any) {
      setErr(
        e.code === 'auth/invalid-verification-code' ? 'Incorrect code.' :
        e.code === 'auth/code-expired' ? 'Code expired. Resend.' :
        e.code === 'auth/email-already-in-use' ? 'Email already in use.' :
        e.message
      );
    } finally { setLoading(false); }
  };

  const inputStyle = { display: 'block', width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--txt-1)', fontFamily: 'var(--font-syne)', fontSize: 15, padding: '14px 16px', outline: 'none', marginBottom: 16 } as React.CSSProperties;

  return (
    <div style={{ padding: '32px 20px 100px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Create Account</h1>
      <p style={{ fontSize: 13, color: 'var(--txt-2)', marginBottom: 24 }}>Sign up to access gold price predictions.</p>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'var(--gold-glow)', border: '1px solid var(--gold-dim)', color: 'var(--gold)', fontSize: 11, fontFamily: 'var(--font-space-mono)', padding: '5px 13px', borderRadius: 20, marginBottom: 24 }}>
        7 Days Free Trial
      </div>

      {step === 1 ? (
        <>
          <input style={inputStyle} type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input style={inputStyle} type="password" placeholder="Minimum 6 characters" value={pass} onChange={(e) => setPass(e.target.value)} />
          <input style={inputStyle} type="password" placeholder="Repeat password" value={pass2} onChange={(e) => setPass2(e.target.value)} />
          {err && <p style={{ color: 'var(--red)', fontSize: 12, marginBottom: 12 }}>{err}</p>}
          <button onClick={goStep2} style={{ width: '100%', padding: 15, background: 'var(--gold)', color: '#000', border: 'none', borderRadius: 12, fontFamily: 'var(--font-syne)', fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>
            Continue
          </button>
          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--txt-2)', marginTop: 20 }}>
            Already have an account? <Link href="/login" style={{ color: 'var(--gold)', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </>
      ) : (
        <>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <select value={dialCode} onChange={(e) => setDialCode(e.target.value)} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--txt-1)', fontFamily: 'var(--font-syne)', fontSize: 14, padding: '14px 12px', outline: 'none', flexShrink: 0 }}>
              <option value="+234">🇳🇬 +234</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+44">🇬🇧 +44</option>
              <option value="+91">🇮🇳 +91</option>
              <option value="+27">🇿🇦 +27</option>
              <option value="+254">🇰🇪 +254</option>
              <option value="+233">🇬🇭 +233</option>
            </select>
            <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} type="tel" placeholder="8012345678" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          {err && <p style={{ color: 'var(--red)', fontSize: 12, marginBottom: 12 }}>{err}</p>}
          <div id="recaptcha-container" style={{ marginBottom: 16 }} />
          {!otpSent ? (
            <button disabled={loading} onClick={sendOTP} style={{ width: '100%', padding: 15, background: 'var(--gold)', color: '#000', border: 'none', borderRadius: 12, fontFamily: 'var(--font-syne)', fontSize: 15, fontWeight: 800, cursor: 'pointer', marginBottom: 10 }}>
              {loading ? 'Sending...' : 'Send Verification Code'}
            </button>
          ) : (
            <>
              <input style={inputStyle} type="number" placeholder="Enter 6-digit code" value={otp} onChange={(e) => setOtp(e.target.value)} />
              <button disabled={loading} onClick={doSignup} style={{ width: '100%', padding: 15, background: 'var(--gold)', color: '#000', border: 'none', borderRadius: 12, fontFamily: 'var(--font-syne)', fontSize: 15, fontWeight: 800, cursor: 'pointer', marginBottom: 10 }}>
                {loading ? 'Creating...' : 'Create Account'}
              </button>
              <button onClick={sendOTP} style={{ width: '100%', padding: 14, background: 'transparent', color: 'var(--txt-2)', border: '1px solid var(--border)', borderRadius: 12, fontFamily: 'var(--font-syne)', fontSize: 14, cursor: 'pointer', marginBottom: 10 }}>
                Resend Code
              </button>
            </>
          )}
          <button onClick={() => setStep(1)} style={{ width: '100%', padding: 14, background: 'transparent', color: 'var(--txt-2)', border: '1px solid var(--border)', borderRadius: 12, fontFamily: 'var(--font-syne)', fontSize: 14, cursor: 'pointer' }}>
            Back to Step 1
          </button>
        </>
      )}
    </div>
  );
}
