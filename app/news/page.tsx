'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Post } from '@/types';
import Link from 'next/link';

export default function NewsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const q = query(collection(db, 'posts'), where('published', '==', true), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Post)));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '16px' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton" style={{ height: 120, borderRadius: 14, marginBottom: 12 }} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div style={{ padding: '8px 20px 12px', fontSize: 11, color: 'var(--txt-2)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        Latest
      </div>
      {posts.map((p) => {
        const date = p.createdAt?.toDate?.()?.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) || '';
        const preview = (p.body || '').slice(0, 160) + (p.body?.length > 160 ? '...' : '');
        return (
          <Link key={p.id} href={`/post/${p.id}`} style={{ textDecoration: 'none' }}>
            <div style={{ margin: '0 16px 12px', background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden', cursor: 'pointer' }}>
              {p.imageUrl && (
                <img src={p.imageUrl} alt={p.title} style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />
              )}
              <div style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 10, color: 'var(--gold)', background: 'var(--gold-glow)', padding: '2px 8px', borderRadius: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {p.category || 'Update'}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--txt-2)', fontFamily: 'var(--font-space-mono)' }}>{date}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.45, color: 'var(--txt-1)', marginBottom: 8 }}>{p.title}</div>
                <div style={{ fontSize: 12, color: 'var(--txt-2)', lineHeight: 1.5 }}>{preview}</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 8, fontSize: 11, color: 'var(--gold)' }}>
                  → Read full post
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
