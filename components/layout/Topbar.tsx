'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function Topbar() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 20px 10px',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div ref={wrapRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setOpen((p) => !p)}
            style={{
              background: 'none',
              border: 'none',
              color: open ? 'var(--gold)' : 'var(--txt-2)',
              cursor: 'pointer',
              width: 32,
              height: 32,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 15,
              backgroundColor: open ? 'var(--bg-muted)' : 'transparent',
            }}
          >
            ☰
          </button>
          {open && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                padding: 6,
                minWidth: 190,
                zIndex: 500,
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              <div style={{ height: 1, background: 'var(--border)', margin: '5px 6px' }} />
              {[
                { href: '/about', label: 'About' },
                { href: '/disclaimer', label: 'Disclaimer' },
                { href: '/contact', label: 'Contact Us' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 12px',
                    borderRadius: 9,
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#fff',
                    textDecoration: 'none',
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            width: 30,
            height: 30,
            background: 'var(--gold)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            color: '#000',
          }}
        >
          ⬡
        </div>
        <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: '0.04em' }}>
          XAU<span style={{ color: 'var(--gold)' }}>/USD</span>
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          fontSize: 11,
          color: 'var(--green)',
          fontFamily: 'var(--font-space-mono)',
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'var(--green)',
            animation: 'pulse 1.5s ease-in-out infinite',
            display: 'inline-block',
          }}
        />
        LIVE
      </div>
    </div>
  );
}
