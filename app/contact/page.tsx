'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText('ifexxy9@gmail.com').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '28px 20px 60px' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'var(--green-dim)', border: '1px solid rgba(0,212,143,0.2)', color: 'var(--green)', fontSize: 11, padding: '5px 13px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
        ✉ Contact
      </div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', lineHeight: 1.25, marginBottom: 6 }}>Get in Touch</h1>
      <p style={{ fontSize: 13, color: 'var(--txt-2)', marginBottom: 28, lineHeight: 1.5 }}>We'd love to hear from you.</p>
      <div style={{ height: 1, background: 'var(--border)', marginBottom: 28 }} />

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 22 }}>
        <p style={{ fontSize: 15, color: '#fff', lineHeight: 1.75, marginBottom: 22 }}>
          Want to get in touch? Send us a mail and we'll get back to you as soon as we can.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--bg-muted)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px', marginBottom: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--green-dim)', border: '1px solid rgba(0,212,143,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green)', fontSize: 17, flexShrink: 0 }}>✉</div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--txt-2)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Email Address</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-space-mono)' }}>ifexxy9@gmail.com</div>
          </div>
        </div>
        <a href="mailto:ifexxy9@gmail.com" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', padding: 14, background: 'var(--gold)', color: '#000', border: 'none', borderRadius: 12, fontFamily: 'var(--font-syne)', fontSize: 14, fontWeight: 800, textDecoration: 'none', cursor: 'pointer', marginBottom: 10 }}>
          ✉ Send us a Mail
        </a>
        <button onClick={copyEmail} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: 12, background: 'transparent', color: copied ? 'var(--green)' : 'var(--txt-2)', border: '1px solid var(--border)', borderRadius: 12, fontFamily: 'var(--font-syne)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          {copied ? '✓ Copied!' : '⧉ Copy Email Address'}
        </button>
        <p style={{ fontSize: 12, color: 'var(--txt-2)', marginTop: 18, lineHeight: 1.5 }}>
          We typically respond within 24–48 hours on business days.
        </p>
      </div>
    </div>
  );
}
