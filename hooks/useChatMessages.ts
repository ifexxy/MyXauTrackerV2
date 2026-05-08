'use client';

import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ChatMessage } from '@/types';

export function useChatMessages(maxMessages: number = 80) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'chatMessages'),
      orderBy('createdAt', 'desc'),
      limit(maxMessages)
    );

    const unsub = onSnapshot(q, (snap) => {
      const msgs: ChatMessage[] = [];
      snap.forEach((d) => msgs.push({ id: d.id, ...d.data() } as ChatMessage));

      msgs.sort((a, b) => {
        const ta = a.createdAt?.toMillis?.() ?? Number.MAX_SAFE_INTEGER;
        const tb = b.createdAt?.toMillis?.() ?? Number.MAX_SAFE_INTEGER;
        return tb - ta;
      });

      setMessages(msgs);
      setLoading(false);
    });

    return unsub;
  }, [maxMessages]);

  return { messages, loading };
}
