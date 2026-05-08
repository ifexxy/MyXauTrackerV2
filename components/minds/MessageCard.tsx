'use client';

import type { ChatMessage } from '@/types';

interface Props {
  message: ChatMessage;
  isOwn: boolean;
}

function relTime(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 5) return 'just now';
  if (diff < 60) return diff + 's ago';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
}

function avatarColor(username: string): string {
  const palette = ['#d4a72c', '#00d48f', '#a080ff', '#ff6b35', '#00b4d8', '#ff4561'];
  return palette[username.charCodeAt(0) % palette.length];
}

function linkify(text: string): string {
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return escaped.replace(/(https?:\/\/[^\s<>"']+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:underline;word-break:break-all">$1</a>');
}

export default function MessageCard({ message, isOwn }: Props) {
  const time = message.createdAt?.toDate ? relTime(message.createdAt.toDate()) : 'just now';
  const color = avatarColor(message.username);

  return (
    <div
      style={{
        background: isOwn ? 'rgba(212,167,44,0.04)' : 'var(--bg-card)',
        border: `1px solid ${isOwn ? 'rgba(212,167,44,0.2)' : 'var(--border)'}`,
        borderRadius: 18,
        padding: 16,
        marginBottom: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{ width: 42, height: 42, borderRadius: '50%', background: color + '22', border: `2px solid ${color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 800, color, flexShrink: 0 }}>
          {message.photoURL ? <img src={message.photoURL} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : message.username[0].toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: isOwn ? 'var(--gold)' : 'var(--txt-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{message.username}</div>
          <div style={{ fontSize: 8, color: 'var(--txt-3)', fontFamily: 'var(--font-space-mono)', marginTop: 2 }}>{time}</div>
        </div>
        {isOwn && <span style={{ fontSize: 10, padding: '2px 8px', background: 'var(--gold-glow)', color: 'var(--gold)', borderRadius: 8, fontFamily: 'var(--font-space-mono)', flexShrink: 0 }}>You</span>}
      </div>
      <div style={{ fontSize: 15, color: 'var(--txt-1)', lineHeight: 1.7, wordBreak: 'break-word', whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: linkify(message.text) }} />
    </div>
  );
}
