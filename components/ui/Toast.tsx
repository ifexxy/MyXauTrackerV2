'use client';

import { useEffect, useState } from 'react';

let toastFn: ((msg: string) => void) | null = null;

export function showToast(msg: string) {
  if (toastFn) toastFn(msg);
}

export default function Toast() {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    toastFn = (msg: string) => {
      setMessage(msg);
      setVisible(true);
      setTimeout(() => setVisible(false), 2500);
    };
    return () => { toastFn = null; };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'calc(var(--nav-h) + 16px)',
        left: '50%',
        transform: visible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(20px)',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        color: 'var(--txt-1)',
        padding: '10px 20px',
        borderRadius: 20,
        fontSize: 13,
        opacity: visible ? 1 : 0,
        transition: 'all 0.3s',
        pointerEvents: 'none',
        zIndex: 200,
        whiteSpace: 'nowrap',
      }}
    >
      {message}
    </div>
  );
}
