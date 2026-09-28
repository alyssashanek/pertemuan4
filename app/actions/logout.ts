'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function logoutAction() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Mengakhiri session di Supabase
  await supabase.auth.signOut();

  // Redirect pengguna kembali ke halaman login
  redirect('/login');
}