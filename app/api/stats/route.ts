import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = createServerClient();
    const today = new Date().toISOString().split('T')[0];

    const { count: spins_today } = await supabase
      .from('spins')
      .select('*', { count: 'exact', head: true })
      .eq('session_date', today);

    const { count: winners_today } = await supabase
      .from('spins')
      .select('*', { count: 'exact', head: true })
      .eq('session_date', today)
      .eq('is_winner', true);

    return NextResponse.json({
      spins_today: spins_today ?? 0,
      winners_today: winners_today ?? 0,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ spins_today: 0, winners_today: 0 });
  }
}
