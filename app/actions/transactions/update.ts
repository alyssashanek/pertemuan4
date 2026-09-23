'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type {
  UpdateTransactionInput,
  ActionResult,
  Transaction,
} from '@/lib/types/transaction'

/**
 * Server Action: Ubah transaksi yang sudah ada.
 *
 * SRS-15 — User dapat mengubah transaksi yang sudah ada.
 * SRS-17 — Field yang bisa diubah: nama, jenis, nominal, tanggal, catatan.
 * SRS-20 — User hanya bisa mengubah transaksi miliknya sendiri.
 *           user_id tidak bisa diubah (FR-05.3).
 *
 * @param id    - ID transaksi yang akan diubah
 * @param input - Data baru dari form
 * @returns ActionResult berisi transaksi yang sudah diupdate, atau pesan error
 */
export async function updateTransaction(
  id: string,
  input: UpdateTransactionInput
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

  if (!id) {
    return { success: false, error: 'ID transaksi tidak valid.' }
  }

  // Validasi field yang diubah (SRS-17, Section 15)
  if (input.title !== undefined && input.title.trim() === '') {
    return { success: false, error: 'Nama transaksi wajib diisi.' }
  }

  if (
    input.type !== undefined &&
    !['income', 'expense'].includes(input.type)
  ) {
    return { success: false, error: 'Jenis transaksi tidak valid.' }
  }

  if (input.amount !== undefined && input.amount <= 0) {
    return { success: false, error: 'Nominal harus lebih dari 0.' }
  }

  // Bangun objek update — hanya field yang dikirim
  const updateData: Record<string, unknown> = {}
  if (input.title !== undefined) updateData.title = input.title.trim()
  if (input.type !== undefined) updateData.type = input.type
  if (input.amount !== undefined) updateData.amount = input.amount
  if (input.transaction_date !== undefined)
    updateData.transaction_date = input.transaction_date
  if (input.note !== undefined)
    updateData.note = input.note?.trim() || null

  if (Object.keys(updateData).length === 0) {
    return { success: false, error: 'Tidak ada data yang diubah.' }
  }

  // Update dengan filter user_id sebagai double-check ownership (SRS-20)
  // RLS UPDATE policy juga memblokir di level database
  const { data, error } = await supabase
    .from('transactions')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.id) // aplikasi-level guard selain RLS
    .select()
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // Row tidak ditemukan atau bukan milik user ini
      return {
        success: false,
        error: 'Anda tidak memiliki akses ke transaksi ini.',
      }
    }
    console.error('[updateTransaction]', error.message)
    return { success: false, error: 'Gagal mengubah transaksi.' }
  }

  revalidatePath('/dashboard')
  revalidatePath('/transactions')

  return { success: true, data: data as Transaction }
}
