import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  const signature = req.headers.get('verif-hash');
  if (!signature || signature !== process.env.FLW_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
  }

  const event = await req.json();

  if (event.event === 'charge.completed' && event.data.status === 'successful') {
    const { tx_ref, amount, currency } = event.data;
    if (amount < 9900 || currency !== 'NGN') {
      return NextResponse.json({ error: 'Invalid amount or currency' }, { status: 400 });
    }

    const parts = tx_ref.split('-');
    const uid = parts.slice(2).join('-');
    if (!uid) return NextResponse.json({ error: 'Could not extract UID' }, { status: 400 });

    const currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    await adminDb.collection('users').doc(uid).update({
      subscriptionStatus: 'active',
      currentPeriodEnd,
      lastPaymentAt: new Date().toISOString(),
      lastPaymentAmount: amount,
      flutterwaveTxId: String(event.data.id),
      flutterwaveTxRef: tx_ref,
    });
  }

  return NextResponse.json({ received: true });
}
