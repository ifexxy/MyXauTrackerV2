'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { AccessStatus, UserProfile } from '@/types';
import type { User } from 'firebase/auth';

export function useAccess(user: User | null) {
  const [access, setAccess] = useState<AccessStatus | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setAccess({ hasAccess: false, trialActive: false, subscriptionActive: false, manualActive: false });
      setLoading(false);
      return;
    }

    async function check() {
      try {
        const snap = await getDoc(doc(db, 'users', user!.uid));
        if (!snap.exists()) {
          setAccess({ hasAccess: false, trialActive: false, subscriptionActive: false, manualActive: false });
          setLoading(false);
          return;
        }

        const d = snap.data() as UserProfile;
        setProfile(d);
        const now = Date.now();

        const trialActive = !!(d.trialEndsAt && new Date(d.trialEndsAt).getTime() > now);
        const subscriptionActive = !!(d.subscriptionStatus === 'active' && d.currentPeriodEnd && new Date(d.currentPeriodEnd).getTime() > now);
        const manualActive = !!(d.manualAccess && (!d.manualAccessExpiresAt || new Date(d.manualAccessExpiresAt).getTime() > now));

        setAccess({
          hasAccess: trialActive || subscriptionActive || manualActive,
          trialActive,
          subscriptionActive,
          manualActive,
          trialEndsAt: d.trialEndsAt ? new Date(d.trialEndsAt) : undefined,
          subscriptionEndsAt: d.currentPeriodEnd ? new Date(d.currentPeriodEnd) : undefined,
          manualEndsAt: d.manualAccessExpiresAt ? new Date(d.manualAccessExpiresAt) : undefined,
        });
      } catch {
        setAccess({ hasAccess: false, trialActive: false, subscriptionActive: false, manualActive: false });
      } finally {
        setLoading(false);
      }
    }

    check();
  }, [user]);

  return { access, profile, loading };
}
