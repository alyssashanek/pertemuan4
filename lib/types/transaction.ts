/**
 * TypeScript types untuk modul Transaction (P3).
 * Digunakan bersama oleh server actions (P3) dan komponen UI (P2).
 *
 * Sesuai skema SRS Section 5.2 dan FR-05.
 */

/** Jenis transaksi — hanya dua nilai yang valid (SRS-17) */
export type TransactionType = 'income' | 'expense'

/** Representasi lengkap satu baris dari tabel `transactions` */
export interface Transaction {
  id: string
  user_id: string
  type: TransactionType
  title: string
  amount: number
  transaction_date: string // format ISO date: "YYYY-MM-DD"
  note: string | null
  created_at: string
  updated_at: string
}

/**
 * Input untuk membuat transaksi baru (SRS-14, SRS-17).
 * `user_id` tidak disertakan — akan diambil dari session di server action.
 */
export interface CreateTransactionInput {
  type: TransactionType
  title: string
  amount: number
  transaction_date: string
  note?: string
}

/**
 * Input untuk mengubah transaksi yang sudah ada (SRS-15, SRS-17).
 * `user_id` tidak boleh diubah oleh user (SRS-20, FR-05.3).
 */
export interface UpdateTransactionInput {
  type?: TransactionType
  title?: string
  amount?: number
  transaction_date?: string
  note?: string | null
}

/** Filter untuk daftar transaksi (digunakan P2 — FR-06) */
export type TransactionFilter = 'all' | 'income' | 'expense'

/** Struktur return value standar dari semua server actions */
export interface ActionResult<T = null> {
  success: boolean
  data?: T
  error?: string
}
