'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import type {
  Transaction,
  TransactionFilter,
  ActionResult,
} from '@/lib/types/transaction'

/**
 * Query helper: Ambil daftar transaksi milik user yang login.
 *
 * SRS-19 — User hanya dapat melihat transaksi milik sendiri.
 * FR-06   — Filter berdasarkan jenis: all | income | expense.
 *
 * Digunakan oleh:
 * - P2: halaman /transactions dan dashboard (recent transactions)
 * - P3: halaman /transactions/new dan /transactions/[id]/edit (validasi ownership)
 *
 * @param filter  - Filter jenis transaksi (default: 'all')
 * @param limit   - Batas jumlah hasil (opsional, untuk recent transactions di dashboard)
 * @returns ActionResult berisi array transaksi
 */
export async function getTransactions(
  filter: TransactionFilter = 'all',
  limit?: number
): Promise<ActionResult<Transaction[]>> {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false, error: 'Sesi tidak valid. Silakan login kembali.' }
  }

  // Base query — RLS SELECT policy memastikan hanya baris user ini yang keluar
  let query = supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('transaction_date', { ascending: false })
    .order('created_at', { ascending: false })

  // Terapkan filter jenis transaksi (FR-06, SRS-19)
  if (filter === 'income') {
    query = query.eq('type', 'income')
  } else if (filter === 'expense') {
    query = query.eq('type', 'expense')
  }
  // 'all' — tidak perlu filter tambahan

  // Batasi jumlah hasil jika limit diberikan (untuk recent transactions)
  if (limit !== undefined && limit > 0) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('[getTransactions]', error.message)
    return { success: false, error: 'Gagal mengambil data transaksi.' }
  }

  return { success: true, data: (data ?? []) as Transaction[] }
}

/**
 * Query helper: Ambil satu transaksi berdasarkan ID.
 *
 * SRS-19, SRS-20 — Hanya mengembalikan transaksi milik user yang login.
 * Digunakan di halaman /transactions/[id]/edit untuk prefill form.
 *
 * @param id - UUID transaksi
 * @returns ActionResult berisi transaksi, atau error jika tidak ditemukan/bukan milik user
 */
export async function getTransactionById(
  id: string
): Promise<ActionResult<Transaction>> {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false, error: 'Sesi tidak valid. Silakan login kembali.' }
  }

  if (!id) {
    return { success: false, error: 'ID transaksi tidak valid.' }
  }

  // Filter user_id secara eksplisit + RLS SELECT memblokir di level DB
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return {
        success: false,
        error: 'Transaksi tidak ditemukan.',
      }
    }
    console.error('[getTransactionById]', error.message)
    return { success: false, error: 'Gagal mengambil data transaksi.' }
  }

  return { success: true, data: data as Transaction }
}
