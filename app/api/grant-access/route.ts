import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  const { adminToken, targetEmail, action, daysOrMonths, unit, note } = await req.json();

  if (!adminToken || !targetEmail || !action) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  let callerUid: string;
  try {
    const decoded = await adminAuth.verifyIdToken(adminToken);
    callerUid = decoded.uid;
  } catch {
    return NextResponse.json({ error: 'Invalid admin token' }, { status: 401 });
  }

  const callerSnap = await adminDb.collection('users').doc(callerUid).get();
  if (!callerSnap.exists || callerSnap.data()?.role !== 'admin') {
    return NextResponse.json({ error: 'Not authorised' }, { status: 403 });
  }

  let targetUid: string;
  try {
    const targetUser = await adminAuth.getUserByEmail(targetEmail);
    targetUid = targetUser.uid;
  } catch {
    return NextResponse.json({ error: 'No user found with that email' }, { status: 404 });
  }

  const userRef = adminDb.collection('users').doc(targetUid);

  if (action === 'revoke') {
    await userRef.update({ manualAccess: false, manualAccessNote: '', manualAccessExpiresAt: null });
    return NextResponse.json({ success: true, message: `Access revoked for ${targetEmail}` });
  }

  if (action === 'permanent') {
    await userRef.update({ manualAccess: true, manualAccessNote: note || '', manualAccessExpiresAt: null });
    return NextResponse.json({ success: true, message: `Permanent access granted to ${targetEmail}` });
  }

  const amount = parseInt(daysOrMonths, 10);
  if (!amount || amount < 1) return NextResponse.json({ error: 'Invalid duration' }, { status: 400 });

  let baseDate = new Date();
  if (action === 'extend') {
    const snap = await userRef.get();
    if (snap.exists) {
      const existing = snap.data()?.manualAccessExpiresAt;
      if (existing) { const d = new Date(existing); if (d > baseDate) baseDate = d; }
    }
  }

  const expiresAt = new Date(baseDate);
  if (unit === 'months') expiresAt.setMonth(expiresAt.getMonth() + amount);
  else expiresAt.setTime(expiresAt.getTime() + amount * 24 * 60 * 60 * 1000);

  await userRef.update({ manualAccess: true, manualAccessNote: note || '', manualAccessExpiresAt: expiresAt.toISOString() });

  return NextResponse.json({
    success: true,
    message: `Access granted to ${targetEmail} until ${expiresAt.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}`,
  });
}
