'use client';

import { useState, useRef } from 'react';
import { collection, addDoc, serverTimestamp, doc, setDoc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuthContext } from '@/context/AuthProvider';
import { useChatMessages } from '@/hooks/useChatMessages';
import MessageCard from './MessageCard';
import SetupScreen from './SetupScreen';
import type { ChatProfile } from '@/types';

export default function MindsContent() {
  const { user } = useAuthContext();
  const { messages, loading } = useChatMessages();
  const [profile, setProfile] = useState<ChatProfile | null>(null);
  const [profileChecked, setProfileChecked] = useState(false);
  const [setupDone, setSetupDone] = useState(false);
  const [text, setText] = useState('');
  const [cooldown, setCooldown] = useState(false);
  const [cooldownSecs, setCooldownSecs] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useState(() => {
    if (!user) return;
    getDoc(doc(db, 'chatProfiles', user.uid)).then((snap) => {
      if (snap.exists()) { setProfile(snap.data() as ChatProfile); setSetupDone(true); }
      setProfileChecked(true);
    });
  });

  const send = async () => {
    if (!text.trim() || cooldown || !user || !profile) return;
    const msg = text.trim();
    setText('');
    if (textareaRef.current) { textareaRef.current.style.height = 'auto'; }
    try {
      await addDoc(collection(db, 'chatMessages'), {
        uid: user.uid, username: profile.username,
        photoURL: profile.photoURL || null, text: msg, createdAt: serverTimestamp(),
      });
      startCooldown();
    } catch (e: any) { console.error(e); }
  };

  const startCooldown = () => {
    setCooldown(true);
    let secs = 15;
    setCooldownSecs(secs);
    const interval = setInterval(() => {
      secs--;
      setCooldownSecs(secs);
      if (secs <= 0) { clearInterval(interval); setCooldown(false); setCooldownSecs(0); }
    }, 1000);
  };

  if (!profileChecked) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'var(--txt-2)' }}>Loading...</div>;
  }

  if (!setupDone) {
    return (
      <SetupScreen
        user={user!}
        onComplete={(p) => { setProfile(p); setSetupDone(true); }}
      />
    );
  }

  return (
    <div>
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--txt-1)' }}>Minds</div>
        <div style={{ fontSize: 13, color: 'var(--txt-2)', marginTop: 4 }}>Share your mind on XAU/USD trading</div>
      </div>

      <div style={{ padding: '16px 16px 160px' }}>
        {loading ? (
          [1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 18, marginBottom: 12 }} />)
        ) : messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 40, color: 'var(--txt-3)', marginBottom: 14 }}>💬</div>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>No messages yet</div>
            <div style={{ fontSize: 13, color: 'var(--txt-2)' }}>Be the first to share your thoughts!</div>
          </div>
        ) : (
          messages.map((m) => <MessageCard key={m.id} message={m} isOwn={m.uid === user?.uid} />)
        )}
      </div>

      <div style={{ position: 'fixed', bottom: 'var(--nav-h)', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 480, background: 'rgba(7,12,18,0.96)', backdropFilter: 'blur(16px)', borderTop: '1px solid var(--border)', padding: '10px 16px 12px', zIndex: 90 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
            }}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="What's on your mind?"
            maxLength={300}
            rows={1}
            style={{ flex: 1, background: 'var(--bg-card)', border: '2px solid var(--border)', borderRadius: 16, color: 'var(--txt-1)', fontFamily: 'var(--font-syne)', fontSize: 15, padding: '12px 16px', outline: 'none', resize: 'none', lineHeight: 1.5, maxHeight: 100, overflowY: 'auto' }}
          />
          <button
            disabled={cooldown}
            onClick={send}
            style={{ width: 48, height: 48, background: cooldown ? 'var(--bg-muted)' : 'var(--gold)', color: cooldown ? 'var(--txt-3)' : '#000', border: 'none', borderRadius: 14, fontSize: 18, cursor: cooldown ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            {cooldown ? cooldownSecs : '➤'}
          </button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--txt-3)', fontFamily: 'var(--font-space-mono)' }}>{text.length} / 300</span>
        </div>
      </div>
    </div>
  );
}
