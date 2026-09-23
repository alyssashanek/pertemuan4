import { createBrowserClient } from '@supabase/ssr'

/**
 * Membuat Supabase client untuk digunakan di Client Components ('use client').
 * Gunakan ini untuk query yang tidak membutuhkan session server-side.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}
