'use client';
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase';
import type { WinnerFeedItem } from '@/types';

const FOMO_MESSAGES = [
  '🔥 Solo disponible para asistentes del FIRE Festival',
  '⚡ ¡Próxima ronda disponible ahora mismo!',
  '🎯 Más de 200 personas han girado hoy — ¿y tú?',
  '🚀 Premios exclusivos, tiempo limitado',
  '💥 El FIRE Festival 2026 está en su punto más ALTO',
];

function buildTickerItems(winners: WinnerFeedItem[]): string[] {
  const winnerMessages = winners.map(w => `🏆 ${w.display_name} ganó: ${w.prize_name}`);
  const items: string[] = [];
  let wi = 0;
  for (let i = 0; i < 10; i++) {
    if (wi < winnerMessages.length) {
      items.push(winnerMessages[wi++]);
    }
    items.push(FOMO_MESSAGES[i % FOMO_MESSAGES.length]);
  }
  return items;
}

export default function FomoTicker() {
  const [items, setItems] = useState<string[]>(FOMO_MESSAGES);
  const clientRef = useRef(createClient());

  useEffect(() => {
    const supabase = clientRef.current;

    async function loadWinners() {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('winners_feed')
        .select('*')
        .eq('session_date', today)
        .order('created_at', { ascending: false })
        .limit(10);
      if (data && data.length > 0) {
        setItems(buildTickerItems(data as WinnerFeedItem[]));
      }
    }

    loadWinners();

    const channel = supabase
      .channel('winners_feed_ticker')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'winners_feed' }, () => {
        loadWinners();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const tickerText = items.join('   ·   ') + '   ·   ';

  return (
    <div className="w-full overflow-hidden py-2 relative z-10" style={{ background: 'linear-gradient(90deg, #1565C0, #1E88E5, #2196F3, #1E88E5, #1565C0)' }}>
      <div
        className="flex whitespace-nowrap text-white font-semibold text-sm"
        style={{ animation: 'ticker-scroll 30s linear infinite' }}
      >
        <span className="shrink-0">{tickerText}</span>
        <span className="shrink-0">{tickerText}</span>
      </div>
    </div>
  );
}
