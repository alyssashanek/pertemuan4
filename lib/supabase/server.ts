import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Membuat Supabase client untuk digunakan di Server Components,
 * Server Actions, dan Route Handlers.
 *
 * Client ini membaca session cookie user yang login
 * sehingga RLS berjalan atas nama user tersebut.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // setAll dipanggil dari Server Component — cookies tidak bisa
            // di-set, tapi ini aman diabaikan jika ada middleware yang
                        // menangani refresh session.
          }
        },
      },
    }
  )
}
