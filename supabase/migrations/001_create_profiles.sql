-- Migration 001: Create profiles table
-- Menyimpan informasi profil user yang diperlukan aplikasi.
-- `id` merujuk ke user di Supabase Auth (auth.users).
--
-- SRS Section 5.1

CREATE TABLE IF NOT EXISTS profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name       VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Aktifkan RLS pada tabel profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- User hanya bisa melihat profil milik sendiri
CREATE POLICY "profiles_select_own"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- User hanya bisa insert profil untuk dirinya sendiri
CREATE POLICY "profiles_insert_own"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- User hanya bisa update profil milik sendiri
CREATE POLICY "profiles_update_own"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Trigger: otomatis update kolom updated_at setiap kali baris diubah
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
