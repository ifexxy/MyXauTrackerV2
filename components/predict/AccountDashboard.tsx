'use client';

import { useAuthContext } from '@/context/AuthProvider';
import { useAccess } from '@/hooks/useAccess';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function AccountDashboard() {
  const { user } = useAuthContext();
  const { access, profile } = useAccess(user);
  const router = useRouter();

  if (!user || !access) return null;

  const handleSignOut = async () => {
    await signOut(auth);
    router.replace('/login');
  };

  return (
    <div style={{ margin: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
      <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--txt-1)', marginBottom: 14 }}>My Account</h3>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--gold-glow)', border: '1px solid var(--gold-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontSize: 18, flexShrink: 0 }}>
          👤
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--txt-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
          <div style={{ marginTop: 4 }}>
            <span style={{ fontSize: 10, padding: '2px 10px', borderRadius: 10, background: access.trialActive ? 'var(--gold-glow)' : 'var(--green-dim)', color: access.trialActive ? 'var(--gold)' : 'var(--green)' }}>
              {access.trialActive ? 'TRIAL' : access.subscriptionActive ? 'ACTIVE' : 'GRANTED'}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Link
          href="/subscribe"
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: 11, background: 'var(--gold)', color: '#000', borderRadius: 10, fontFamily: 'var(--font-syne)', fontSize: 13, fontWeight: 800, textDecoration: 'none' }}
        >
          Subscribe
        </Link>
        <button
          onClick={handleSignOut}
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: 11, background: 'transparent', color: 'var(--txt-2)', border: '1px solid var(--border)', borderRadius: 10, fontFamily: 'var(--font-syne)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
