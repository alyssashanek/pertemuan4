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

-- RLS policies, triggers, dan indexes didefinisikan secara idempoten
-- di migration 003_complete_schema.sql menggunakan DROP IF EXISTS.
-- Tidak perlu didefinisikan ulang di sini untuk menghindari konflik duplikasi.
