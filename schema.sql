-- Types personnalisés
CREATE TYPE user_role AS ENUM ('user', 'moderator', 'admin', 'owner');
CREATE TYPE asset_category AS ENUM ('script', 'model', 'ui', 'map', 'system', 'plugin', 'vfx', 'other');
CREATE TYPE report_reason AS ENUM ('stolen_leaking', 'copyright', 'malware', 'scam', 'forbidden_content', 'misleading', 'other');

-- 1. Table Profils
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role user_role DEFAULT 'user',
  is_suspended BOOLEAN DEFAULT FALSE,
  suspended_at TIMESTAMP WITH TIME ZONE,
  suspension_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table Assets
CREATE TABLE public.assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  category asset_category NOT NULL,
  price DECIMAL(10, 2) DEFAULT 0.00 CHECK (price >= 0),
  currency TEXT DEFAULT 'EUR',
  is_active BOOLEAN DEFAULT TRUE,
  version TEXT DEFAULT '1.0.0',
  file_path TEXT NOT NULL,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Active la sécurité RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Assets actifs visibles publiquement" ON public.assets FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Profils visibles publiquement" ON public.profiles FOR SELECT USING (TRUE);