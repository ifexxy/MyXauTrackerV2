import { NextResponse } from 'next/server';

function toNumber(value: any): number | null {
  const num = Number.parseFloat(value);
  return Number.isFinite(num) ? num : null;
}

function round(value: any, decimals = 2): number | null {
  const num = toNumber(value);
  if (num === null) return null;
  return Number(num.toFixed(decimals));
}

async function fetchMetalsDevPrice() {
  if (!process.env.METALS_DEV_KEY) throw new Error('Missing METALS_DEV_KEY');

  const params = new URLSearchParams({ api_key: process.env.METALS_DEV_KEY, metal: 'gold', currency: 'USD' });
  const res = await fetch(`https://api.metals.dev/v1/metal/spot?${params}`);
  const data = await res.json();

  if (data?.status !== 'success' || !data?.rate) throw new Error('Bad Metals.Dev response');

  const rate = data.rate;
  const price = round(rate.price)!;
  const ch = round(rate.change) ?? 0;
  const chp = round(rate.change_percent) ?? 0;
  const open = round(rate.open) ?? round(rate.open_price) ?? round(price - ch)!;

  return {
    price,
    open,
    high: round(rate.high) ?? Math.max(price, open),
    low: round(rate.low) ?? Math.min(price, open),
    bid: round(rate.bid) ?? round(price - 0.30)!,
    ask: round(rate.ask) ?? round(price + 0.30)!,
    ch,
    chp,
    source: 'Metals.Dev',
    updatedAt: data.timestamp || null,
  };
}

async function fetchTwelveDataPrice() {
  if (!process.env.TWELVE_DATA_KEY) throw new Error('Missing TWELVE_DATA_KEY');

  const params = new URLSearchParams({ symbol: 'XAU/USD', apikey: process.env.TWELVE_DATA_KEY });
  const res = await fetch(`https://api.twelvedata.com/quote?${params}`);
  const data = await res.json();

  if (data?.status === 'error' || !data?.close) throw new Error(data?.message || 'Bad Twelve Data response');

  const price = round(data.close)!;
  return {
    price,
    open: round(data.open),
    high: round(data.high),
    low: round(data.low),
    bid: round(data.bid) ?? round(price - 0.30),
    ask: round(data.ask) ?? round(price + 0.30),
    ch: round(data.change),
    chp: round(data.percent_change),
    source: 'Twelve Data',
  };
}

export async function GET() {
  try {
    const result = await fetchMetalsDevPrice();
    return NextResponse.json(result, { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=120' } });
  } catch (primaryError: any) {
    try {
      const fallback = await fetchTwelveDataPrice();
      return NextResponse.json({ ...fallback, fallback: true }, { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=120' } });
    } catch (fallbackError: any) {
      return NextResponse.json({ error: 'Both price APIs failed', primary: primaryError.message, fallback: fallbackError.message }, { status: 500 });
    }
  }
}
