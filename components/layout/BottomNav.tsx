'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: '⌂' },
  { href: '/news', label: 'News', icon: '📰' },
  { href: '/trends', label: 'Trends', icon: '📈' },
  { href: '/predict', label: 'Forecast', icon: '🧠' },
  { href: '/minds', label: 'Minds', icon: '💬' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 480,
        height: 'var(--nav-h)',
        background: 'rgba(7,12,18,0.92)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        zIndex: 100,
      }}
    >
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              textDecoration: 'none',
              color: active ? 'var(--gold)' : 'var(--txt-3)',
              fontSize: 10,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              paddingBottom: 8,
              transition: 'color 0.2s',
            }}
          >
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
