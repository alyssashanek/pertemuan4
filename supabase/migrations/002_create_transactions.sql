-- Migration 002: Create transactions table + RLS policies
-- Menyimpan seluruh data transaksi keuangan user.
-- Setiap baris dimiliki oleh satu user melalui kolom user_id.
--
-- SRS Section 5.2, FR-05, FR-08, SRS-18, SRS-19, SRS-20

CREATE TABLE IF NOT EXISTS transactions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type             VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
  title            VARCHAR(150) NOT NULL,
  amount           NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
  transaction_date DATE NOT NULL,
  note             TEXT,
  created_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Index untuk mendukung query per user (NFR-03, SRS Section 5.2)
CREATE INDEX IF NOT EXISTS idx_transactions_user_id
  ON transactions (user_id);

-- Index untuk sorting dan filter berdasarkan tanggal
CREATE INDEX IF NOT EXISTS idx_transactions_user_date
  ON transactions (user_id, transaction_date DESC);

-- Aktifkan RLS — WAJIB agar policy berlaku (FR-08, SRS-19, SRS-20)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────
-- RLS POLICIES
-- Semua policy menggunakan auth.uid() untuk memastikan
-- user hanya bisa mengakses data miliknya sendiri.
-- ─────────────────────────────────────────────

-- SELECT: user hanya bisa melihat transaksi miliknya (SRS-19)
CREATE POLICY "transactions_select_own"
  ON transactions
  FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: user hanya bisa membuat transaksi untuk dirinya sendiri (SRS-18)
CREATE POLICY "transactions_insert_own"
  ON transactions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: user hanya bisa mengubah transaksi miliknya (SRS-20)
-- WITH CHECK memastikan user_id tidak bisa diganti ke user lain
CREATE POLICY "transactions_update_own"
  ON transactions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: user hanya bisa menghapus transaksi miliknya (SRS-20)
CREATE POLICY "transactions_delete_own"
  ON transactions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger: otomatis update kolom updated_at setiap kali baris diubah
-- Reuse fungsi update_updated_at_column dari migration 001
CREATE TRIGGER transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
