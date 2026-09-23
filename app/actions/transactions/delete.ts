'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { ActionResult } from '@/lib/types/transaction'

/**
 * Server Action: Hapus transaksi.
 *
 * SRS-16 — User dapat menghapus transaksi.
 * SRS-20 — User hanya bisa menghapus transaksi miliknya sendiri.
 *
 * Konfirmasi sebelum menghapus dilakukan di UI (FR-05.4).
 *
 * @param id - ID transaksi yang akan dihapus
 * @returns ActionResult sukses atau pesan error
 */
export async function deleteTransaction(
  id: string
): Promise<ActionResult> {
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

  // Hapus dengan filter user_id sebagai double-check ownership (SRS-20)
  // RLS DELETE policy juga memblokir di level database
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id) // aplikasi-level guard selain RLS

  if (error) {
    console.error('[deleteTransaction]', error.message)
    return { success: false, error: 'Gagal menghapus transaksi.' }
  }

  revalidatePath('/dashboard')
  revalidatePath('/transactions')

  return { success: true }
}
