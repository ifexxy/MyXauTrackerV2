import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  const { transaction_id, userToken } = await req.json();

  if (!transaction_id || !userToken) {
    return NextResponse.json({ error: 'Missing transaction_id or userToken' }, { status: 400 });
  }

  let uid: string;
  try {
    const decoded = await adminAuth.verifyIdToken(userToken);
    uid = decoded.uid;
  } catch {
    return NextResponse.json({ error: 'Invalid user token' }, { status: 401 });
  }

  const flwRes = await fetch(`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`, {
    headers: { Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`, 'Content-Type': 'application/json' },
  });
  const flwData = await flwRes.json();

  if (flwData.status !== 'success' || flwData.data?.status !== 'successful' || flwData.data?.amount < 9900 || flwData.data?.currency !== 'NGN') {
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
  }

  const currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  await adminDb.collection('users').doc(uid).update({
    subscriptionStatus: 'active',
    currentPeriodEnd,
    lastPaymentAt: new Date().toISOString(),
    lastPaymentAmount: flwData.data.amount,
    flutterwaveTxId: String(transaction_id),
    flutterwaveTxRef: flwData.data.tx_ref,
  });

  return NextResponse.json({ success: true, currentPeriodEnd });
}
