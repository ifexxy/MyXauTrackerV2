'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Post } from '@/types';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function PostPage() {
  const params = useParams();
  const id = params.id as string;
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDoc(doc(db, 'posts', id));
        if (!snap.exists() || !snap.data().published) { setError('Post not found.'); return; }
        setPost({ id: snap.id, ...snap.data() } as Post);
      } catch { setError('Failed to load post.'); }
    }
    load();
  }, [id]);

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <p style={{ fontSize: 13, color: 'var(--txt-2)', marginBottom: 20 }}>{error}</p>
        <Link href="/news" style={{ color: 'var(--gold)', textDecoration: 'none' }}>← Back to News</Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ padding: 20 }}>
        <div className="skeleton" style={{ height: 220 }} />
        <div style={{ padding: 20 }}>
          <div className="skeleton" style={{ height: 28, width: '85%', marginBottom: 10 }} />
          <div className="skeleton" style={{ height: 14, marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 14, width: '80%' }} />
        </div>
      </div>
    );
  }

  const date = post.createdAt?.toDate?.()?.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) || '';
  const postUrl = `https://www.xautracker.com/post/${post.id}`;
  const bodyHtml = post.body.split(/\n\n+/).map((p) => p.trim()).join('\n\n');

  return (
    <div>
      {post.imageUrl && <img src={post.imageUrl} alt={post.title} style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }} />}
      <div style={{ padding: '20px 20px 100px', maxWidth: 680, margin: '0 auto' }}>
        <Link href="/news" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'var(--txt-2)', textDecoration: 'none', marginBottom: 16 }}>
          ← Back to News
        </Link>
        <div style={{ fontSize: 10, color: 'var(--gold)', background: 'var(--gold-glow)', padding: '3px 10px', borderRadius: 10, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'inline-block', marginBottom: 12 }}>
          {post.category || 'Update'}
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.3, color: 'var(--txt-1)', marginBottom: 14 }}>{post.title}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 24, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: 'var(--txt-2)', fontFamily: 'var(--font-space-mono)' }}>📅 {date}</span>
          {post.readTime && <span style={{ fontSize: 11, color: 'var(--txt-2)', fontFamily: 'var(--font-space-mono)' }}>🕐 {post.readTime}</span>}
          <span style={{ fontSize: 11, color: 'var(--txt-2)', fontFamily: 'var(--font-space-mono)' }}>⬡ XAU Tracker</span>
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.85, color: 'var(--txt-2)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{bodyHtml}</div>
        {post.link && (
          <a href={post.link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 24, padding: '10px 18px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13, color: 'var(--gold)', textDecoration: 'none' }}>
            ↗ Read original source
          </a>
        )}
        {post.tags?.length ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
            {post.tags.map((t) => (
              <span key={t} style={{ fontSize: 11, padding: '3px 10px', background: 'var(--gold-glow)', color: 'var(--gold)', borderRadius: 10 }}>#{t}</span>
            ))}
          </div>
        ) : null}
        <div style={{ display: 'flex', gap: 10, marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
          <button onClick={() => navigator.clipboard.writeText(postUrl)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 10, fontSize: 12, cursor: 'pointer', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--txt-2)' }}>
            🔗 Copy Link
          </button>
          <a href={`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + postUrl)}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 10, fontSize: 12, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--txt-2)', textDecoration: 'none' }}>
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
