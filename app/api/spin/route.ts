import { NextResponse } from 'next/server';
import { selectPrize } from '@/lib/prizes';
import { createServerClient } from '@/lib/supabase-server';

const PRIZE_TO_SEGMENT: Record<string, number> = {
  "85% OFF primer mes + Asesoría": 0,
  "Configuración LiveCake": 2,
  "Certificación Gratuita": 4,
  "Hora de asesoría": 6,
  "Libro digital Mauricio Cuevas": 8,
  "Sigue intentando": 10,
};

const DISPLAY_NAMES = [
  'Carlos G.', 'María L.', 'Juan P.', 'Ana M.', 'Luis R.',
  'Sofía V.', 'Diego H.', 'Paula S.', 'Andrés C.', 'Valentina T.',
];

export async function POST() {
  try {
    const prize = selectPrize();
    const supabase = createServerClient();

    await supabase.from('spins').insert({
      prize_name: prize.name,
      is_winner: prize.isWinner,
    });

    if (prize.isWinner) {
      const display_name = DISPLAY_NAMES[Math.floor(Math.random() * DISPLAY_NAMES.length)];
      await supabase.from('winners_feed').insert({
        display_name,
        prize_name: prize.name,
      });
    }

    const target_segment = PRIZE_TO_SEGMENT[prize.name] ?? 10;

    return NextResponse.json({
      prize_name: prize.name,
      emoji: prize.emoji,
      color: prize.color,
      is_winner: prize.isWinner,
      description: prize.description,
      target_segment,
    });
  } catch (error) {
    console.error('Spin error:', error);
    return NextResponse.json({ error: 'Error al procesar el giro' }, { status: 500 });
  }
}
