'use client';

import { useState, useRef } from 'react';
import { doc, setDoc, getDocs, collection, query, where, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import type { User } from 'firebase/auth';
import type { ChatProfile } from '@/types';

interface Props {
  user: User;
  onComplete: (profile: ChatProfile) => void;
}

export default function SetupScreen({ user, onComplete }: Props) {
  const [username, setUsername] = useState('');
  const [avatarDataUrl, setAvatarDataUrl] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { alert('Image must be under 3MB'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarDataUrl(ev.target!.result as string);
    reader.readAsDataURL(file);
  };

  const register = async () => {
    setErr('');
    if (!username || username.length < 3) { setErr('Username must be at least 3 characters.'); return; }
    setLoading(true);
    try {
      const taken = await getDocs(query(collection(db, 'chatUsernames'), where('usernameLower', '==', username.toLowerCase())));
      if (!taken.empty) { setErr('That username is already taken.'); setLoading(false); return; }

      let photoURL: string | null = null;
      if (avatarDataUrl) {
        const blob = await fetch(avatarDataUrl).then((r) => r.blob());
        const imgRef = ref(storage, `chatAvatars/${user.uid}`);
        await uploadBytes(imgRef, blob);
        photoURL = await getDownloadURL(imgRef);
      }

      await setDoc(doc(db, 'chatUsernames', username.toLowerCase()), { uid: user.uid, username, usernameLower: username.toLowerCase(), createdAt: serverTimestamp() });
      await setDoc(doc(db, 'chatProfiles', user.uid), { uid: user.uid, username, photoURL, createdAt: serverTimestamp() });

      onComplete({ uid: user.uid, username, photoURL: photoURL || undefined, createdAt: null });
    } catch (e: any) {
      setErr('Error: ' + e.message);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '28px 24px' }}>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Pick Your Username</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
          <div onClick={() => fileRef.current?.click()} style={{ width: 88, height: 88, borderRadius: '50%', background: 'var(--bg-muted)', border: '2px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer', marginBottom: 8 }}>
            {avatarDataUrl ? <img src={avatarDataUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 32, color: 'var(--txt-3)' }}>📷</span>}
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
          <div style={{ fontSize: 11, color: 'var(--txt-3)' }}>Tap to add profile photo (optional)</div>
        </div>
        <input
          type="text"
          placeholder="your_username"
          maxLength={20}
          value={username}
          onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
          style={{ display: 'block', width: '100%', background: 'var(--bg-muted)', border: '2px solid var(--border)', borderRadius: 14, color: 'var(--txt-1)', fontFamily: 'var(--font-syne)', fontSize: 16, padding: '14px 16px', outline: 'none', marginBottom: 8 }}
        />
        <div style={{ fontSize: 11, color: 'var(--txt-3)', marginBottom: 16 }}>Letters, numbers and underscores only · 3–20 characters</div>
        {err && <p style={{ color: 'var(--red)', fontSize: 13, marginBottom: 12 }}>{err}</p>}
        <button disabled={loading} onClick={register} style={{ width: '100%', padding: 16, background: 'var(--gold)', color: '#000', border: 'none', borderRadius: 14, fontFamily: 'var(--font-syne)', fontSize: 16, fontWeight: 800, cursor: 'pointer' }}>
          {loading ? 'Setting up...' : 'Set Username'}
        </button>
      </div>
    </div>
  );
}
