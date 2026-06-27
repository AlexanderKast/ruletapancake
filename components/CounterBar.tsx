'use client';
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase';

interface Props {
  initialSpins: number;
  initialWinners: number;
}

export default function CounterBar({ initialSpins, initialWinners }: Props) {
  const [spins, setSpins] = useState(initialSpins);
  const [winners, setWinners] = useState(initialWinners);
  const clientRef = useRef(createClient());

  useEffect(() => {
    const supabase = clientRef.current;
    const channel = supabase
      .channel('spins_counter')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'spins' },
        (payload) => {
          setSpins(s => s + 1);
          if (payload.new?.is_winner) {
            setWinners(w => w + 1);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="flex gap-3 justify-center z-10">
      <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-center">
        <div className="text-2xl font-black text-[#FA4616]">{spins}</div>
        <div className="text-xs text-white/60 font-medium">Girando hoy</div>
      </div>
      <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-center">
        <div className="text-2xl font-black text-[#25E366]">{winners}</div>
        <div className="text-xs text-white/60 font-medium">Ganadores hoy</div>
      </div>
    </div>
  );
}
