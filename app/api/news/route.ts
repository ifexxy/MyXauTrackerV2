import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const url = `https://gnews.io/api/v4/search?q=gold+XAU+USD&lang=en&max=15&sortby=publishedAt&apikey=${process.env.GNEWS_KEY}`;
    const res = await fetch(url, { next: { revalidate: 600 } });
    const data = await res.json();
    if (!data.articles?.length) throw new Error('No articles');
    return NextResponse.json(data.articles);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
