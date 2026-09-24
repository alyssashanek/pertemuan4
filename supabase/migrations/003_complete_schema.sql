-- ============================================================
-- COMPLETE DATABASE SCHEMA
-- Saldoo — Expense Tracker Mahasiswa
-- ============================================================
-- Versi   : 1.0
-- Sesuai  : SRS v1.0 Section 5 (Database Design)
-- Tabel   : profiles, transactions
--
-- File ini bersifat IDEMPOTENT — aman dijalankan berulang kali.
-- Jalankan di Supabase SQL Editor secara berurutan.
-- ============================================================


-- ============================================================
-- SECTION 1: TRIGGER FUNCTION
-- Otomatis update kolom updated_at setiap kali baris diubah.
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
   SECURITY INVOKER   -- aman: tidak bypass RLS
   SET search_path = '';


-- ============================================================
-- SECTION 2: TABEL profiles
-- Menyimpan nama user yang diperlukan aplikasi.
-- id = referensi ke Supabase Auth (auth.users).
-- SRS Section 5.1
-- ============================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id         UUID         PRIMARY KEY
                          REFERENCES auth.users(id) ON DELETE CASCADE,
  name       VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Trigger updated_at
DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();


-- ============================================================
-- SECTION 3: TABEL transactions
-- Menyimpan seluruh transaksi keuangan user.
-- Setiap transaksi wajib memiliki user_id milik user yang login.
-- SRS Section 5.2, FR-05
-- ============================================================

CREATE TABLE IF NOT EXISTS public.transactions (
  id               UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID           NOT NULL
                                  REFERENCES auth.users(id) ON DELETE CASCADE,
  type             VARCHAR(20)    NOT NULL
                                  CHECK (type IN ('income', 'expense')),
  title            VARCHAR(150)   NOT NULL,
  amount           NUMERIC(15, 2) NOT NULL
                                  CHECK (amount > 0),
  transaction_date DATE           NOT NULL,
  note             TEXT,
  created_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- Trigger updated_at
DROP TRIGGER IF EXISTS transactions_updated_at ON public.transactions;
CREATE TRIGGER transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();


-- ============================================================
-- SECTION 4: INDEXES
-- Mendukung query transaksi per user secara efisien.
-- SRS NFR-03
-- ============================================================

-- Index untuk filter per user
CREATE INDEX IF NOT EXISTS idx_transactions_user_id
  ON public.transactions (user_id);

-- Index untuk sorting terbaru per user (dashboard & transaction list)
CREATE INDEX IF NOT EXISTS idx_transactions_user_date
  ON public.transactions (user_id, transaction_date DESC);


-- ============================================================
-- SECTION 5: ROW LEVEL SECURITY
-- Aktifkan RLS pada semua tabel publik.
-- SRS FR-08, SRS-19, SRS-20
-- ============================================================

ALTER TABLE public.profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions  ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- SECTION 6: GRANTS (Supabase Data API)
-- Agar Supabase JS client (PostgREST) bisa mengakses tabel.
-- RLS tetap yang mengontrol baris mana yang boleh diakses.
-- ============================================================

-- profiles: authenticated user bisa INSERT (register) dan SELECT/UPDATE profil sendiri
GRANT SELECT, INSERT, UPDATE ON public.profiles     TO authenticated;

-- transactions: authenticated user bisa CRUD transaksi
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transactions TO authenticated;


-- ============================================================
-- SECTION 7: RLS POLICIES — profiles
--
-- Aturan:
-- - User hanya bisa melihat profil milik sendiri
-- - User hanya bisa insert profil untuk dirinya sendiri (saat register)
-- - User hanya bisa update profil milik sendiri
-- - Tidak ada DELETE policy — profil dihapus otomatis via ON DELETE CASCADE
--
-- Catatan: DROP IF EXISTS sebelum CREATE agar idempotent.
-- Menggunakan (SELECT auth.uid()) — best practice Supabase untuk performa
-- (mencegah re-evaluasi auth.uid() per baris).
-- ============================================================

-- Bersihkan semua policy profiles yang ada (termasuk duplikat bawaan)
DROP POLICY IF EXISTS "Users can view their own profile"   ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own"                ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own"                ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own"                ON public.profiles;

-- SELECT: user hanya bisa melihat profil sendiri
CREATE POLICY "profiles_select_own"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = id);

-- INSERT: user hanya bisa membuat profil untuk dirinya sendiri
CREATE POLICY "profiles_insert_own"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = id);

-- UPDATE: user hanya bisa mengubah profil sendiri
CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING  ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);


-- ============================================================
-- SECTION 8: RLS POLICIES — transactions
--
-- Aturan (SRS FR-08, SRS-19, SRS-20):
-- - SELECT : hanya transaksi milik user yang login
-- - INSERT : user_id harus = user yang login (tidak bisa milik orang lain)
-- - UPDATE : hanya transaksi milik sendiri, user_id tidak bisa diubah
-- - DELETE : hanya transaksi milik sendiri
-- ============================================================

-- Bersihkan semua policy transactions yang ada
DROP POLICY IF EXISTS "transactions_select_own" ON public.transactions;
DROP POLICY IF EXISTS "transactions_insert_own" ON public.transactions;
DROP POLICY IF EXISTS "transactions_update_own" ON public.transactions;
DROP POLICY IF EXISTS "transactions_delete_own" ON public.transactions;

-- SELECT (SRS-19): hanya bisa melihat transaksi milik sendiri
CREATE POLICY "transactions_select_own"
  ON public.transactions
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- INSERT (SRS-18): user_id harus berasal dari user yang login
CREATE POLICY "transactions_insert_own"
  ON public.transactions
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- UPDATE (SRS-20): hanya bisa mengubah transaksi sendiri
-- WITH CHECK memastikan user_id tidak bisa diubah ke user lain
CREATE POLICY "transactions_update_own"
  ON public.transactions
  FOR UPDATE
  TO authenticated
  USING  ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- DELETE (SRS-20): hanya bisa menghapus transaksi sendiri
CREATE POLICY "transactions_delete_own"
  ON public.transactions
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);


-- ============================================================
-- VERIFIKASI (opsional, jalankan setelah schema di atas)
-- ============================================================

-- Cek tabel dan status RLS
-- SELECT tablename, rowsecurity FROM pg_tables
--   WHERE schemaname = 'public';

-- Cek semua RLS policies
-- SELECT tablename, policyname, roles, cmd, qual, with_check
--   FROM pg_policies WHERE schemaname = 'public'
--   ORDER BY tablename, cmd;

-- Cek indexes
-- SELECT indexname, tablename, indexdef
--   FROM pg_indexes WHERE schemaname = 'public'
--   ORDER BY tablename;
