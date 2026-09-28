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

-- RLS policies, triggers, dan indexes didefinisikan secara idempoten
-- di migration 003_complete_schema.sql menggunakan DROP IF EXISTS.
-- Tidak perlu didefinisikan ulang di sini untuk menghindari konflik duplikasi.
