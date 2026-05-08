'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthProvider';
import { useAccess } from '@/hooks/useAccess';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthContext();
  const { access, loading: accessLoading } = useAccess(user);

  useEffect(() => {
    if (authLoading || accessLoading) return;
    if (!user) { router.replace('/login'); return; }
    if (access && !access.hasAccess) { router.replace('/subscribe'); }
  }, [user, access, authLoading, accessLoading, router]);

  if (authLoading || accessLoading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--txt-2)' }}>
        Loading...
      </div>
    );
  }

  if (!user || !access?.hasAccess) return null;

  return <>{children}</>;
}
