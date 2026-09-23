'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type {
  CreateTransactionInput,
  ActionResult,
  Transaction,
} from '@/lib/types/transaction'

/**
 * Server Action: Tambah transaksi baru.
 *
 * SRS-14 — User dapat menambahkan transaksi pemasukan atau pengeluaran.
 * SRS-17 — Input: nama, jenis, nominal, tanggal, dan catatan.
 * SRS-18 — user_id otomatis diambil dari session (bukan dari input user).
 *
 * @param input - Data transaksi dari form
 * @returns ActionResult berisi transaksi yang baru dibuat, atau pesan error
 */
export async function createTransaction(
  input: CreateTransactionInput
): Promise<ActionResult<Transaction>> {
  const supabase = await createSupabaseServerClient()

  // Ambil user yang sedang login dari session
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false, error: 'Sesi tidak valid. Silakan login kembali.' }
  }

  // Validasi field wajib (SRS-17, FR-05.1, Section 15)
  if (!input.title || input.title.trim() === '') {
    return { success: false, error: 'Nama transaksi wajib diisi.' }
  }

  if (!input.type || !['income', 'expense'].includes(input.type)) {
    return { success: false, error: 'Jenis transaksi tidak valid.' }
  }

  if (!input.amount || input.amount <= 0) {
    return { success: false, error: 'Nominal harus lebih dari 0.' }
  }

  if (!input.transaction_date) {
    return { success: false, error: 'Tanggal transaksi wajib diisi.' }
  }

  // Insert ke database — user_id dari session, bukan dari input (SRS-18)
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: user.id,
      type: input.type,
      title: input.title.trim(),
      amount: input.amount,
      transaction_date: input.transaction_date,
      note: input.note?.trim() || null,
    })
    .select()
    .single()

  if (error) {
    console.error('[createTransaction]', error.message)
    return { success: false, error: 'Gagal menyimpan transaksi.' }
  }

  // Revalidasi cache halaman yang menampilkan transaksi
  revalidatePath('/dashboard')
  revalidatePath('/transactions')

  return { success: true, data: data as Transaction }
}
