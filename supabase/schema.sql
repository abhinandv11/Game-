-- ==========================================================
-- Game കളിക്കാം — Complete Supabase Database Schema
-- ==========================================================

-- Enable pgcrypto for gen_random_uuid
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ROOMS TABLE
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_code TEXT UNIQUE NOT NULL,
    game_type TEXT NOT NULL DEFAULT 'stone-paper-pencil-scissors',
    rounds INTEGER NOT NULL DEFAULT 5,
    status TEXT NOT NULL DEFAULT 'waiting', -- 'waiting' | 'playing' | 'finished' | 'abandoned'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. PLAYERS TABLE
CREATE TABLE IF NOT EXISTS public.players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
    player_name TEXT NOT NULL,
    player_number INTEGER NOT NULL CHECK (player_number IN (1, 2)),
    connected BOOLEAN DEFAULT true NOT NULL,
    ready BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. GAME ROUNDS TABLE
CREATE TABLE IF NOT EXISTS public.game_rounds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
    round_number INTEGER NOT NULL,
    player1_choice TEXT,
    player2_choice TEXT,
    player1_locked BOOLEAN DEFAULT false NOT NULL,
    player2_locked BOOLEAN DEFAULT false NOT NULL,
    result TEXT CHECK (result IN ('player1', 'player2', 'draw')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_rooms_code ON public.rooms(room_code);
CREATE INDEX IF NOT EXISTS idx_players_room_id ON public.players(room_id);
CREATE INDEX IF NOT EXISTS idx_rounds_room_id ON public.game_rounds(room_id, round_number);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_rounds ENABLE ROW LEVEL SECURITY;

-- ANONYMOUS ACCESS POLICIES (No login required for Game കളിക്കാം v1)
DROP POLICY IF EXISTS "Public rooms access" ON public.rooms;
CREATE POLICY "Public rooms access" ON public.rooms FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public players access" ON public.players;
CREATE POLICY "Public players access" ON public.players FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public game_rounds access" ON public.game_rounds;
CREATE POLICY "Public game_rounds access" ON public.game_rounds FOR ALL USING (true) WITH CHECK (true);

-- ENABLE SUPABASE REALTIME REPLICATION (Idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'rooms'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'players'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.players;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'game_rounds'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.game_rounds;
  END IF;
END $$;
