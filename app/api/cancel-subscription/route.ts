import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  const { userToken } = await req.json();
  if (!userToken) return NextResponse.json({ error: 'Missing userToken' }, { status: 400 });

  let uid: string;
  try {
    const decoded = await adminAuth.verifyIdToken(userToken);
    uid = decoded.uid;
  } catch {
    return NextResponse.json({ error: 'Invalid user token' }, { status: 401 });
  }

  await adminDb.collection('users').doc(uid).update({ subscriptionStatus: 'cancelled' });

  return NextResponse.json({ success: true, message: 'Subscription cancelled. You keep access until your current period ends.' });
}
