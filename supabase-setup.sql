-- ==========================================
-- Ruleta FIRE Festival — Supabase Setup SQL
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ==========================================

-- Tabla: spins
CREATE TABLE IF NOT EXISTS public.spins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  prize_name text NOT NULL,
  is_winner boolean NOT NULL DEFAULT false,
  session_date date DEFAULT current_date
);

-- Tabla: winners_feed
CREATE TABLE IF NOT EXISTS public.winners_feed (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  display_name text NOT NULL,
  prize_name text NOT NULL,
  session_date date DEFAULT current_date
);

-- Habilitar Row Level Security
ALTER TABLE public.spins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.winners_feed ENABLE ROW LEVEL SECURITY;

-- Políticas para spins (instalación pública de quiosco)
CREATE POLICY "anon_insert_spins" ON public.spins
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_select_spins" ON public.spins
  FOR SELECT TO anon USING (true);

-- Políticas para winners_feed
CREATE POLICY "anon_insert_winners_feed" ON public.winners_feed
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_select_winners_feed" ON public.winners_feed
  FOR SELECT TO anon USING (true);

-- Habilitar Realtime en ambas tablas
-- (También se puede hacer desde el dashboard en Database > Replication)
ALTER PUBLICATION supabase_realtime ADD TABLE public.spins;
ALTER PUBLICATION supabase_realtime ADD TABLE public.winners_feed;

-- Índices para performance
CREATE INDEX IF NOT EXISTS spins_session_date_idx ON public.spins (session_date);
CREATE INDEX IF NOT EXISTS spins_session_date_winner_idx ON public.spins (session_date, is_winner);
CREATE INDEX IF NOT EXISTS winners_feed_session_date_idx ON public.winners_feed (session_date);
CREATE INDEX IF NOT EXISTS winners_feed_created_at_idx ON public.winners_feed (created_at DESC);
