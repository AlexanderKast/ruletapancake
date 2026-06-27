import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function POST(req: Request) {
  try {
    const { nombre, email, whatsapp, prize_name } = await req.json();

    if (!nombre?.trim() || !email?.trim() || !whatsapp?.trim() || !prize_name) {
      return NextResponse.json({ error: 'Campos incompletos' }, { status: 400 });
    }

    const supabase = createServerClient();
    const { error } = await supabase.from('leads').insert({
      nombre: nombre.trim(),
      email: email.trim().toLowerCase(),
      whatsapp: whatsapp.trim(),
      prize_name,
    });

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Lead error:', error);
    return NextResponse.json({ error: 'Error al guardar los datos' }, { status: 500 });
  }
}
