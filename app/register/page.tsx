'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: fullName,
          updated_at: new Date().toISOString(),
        });

        if (profileError) {
          console.error('Gagal memperbarui profil:', profileError.message);
        }
      }

      router.push('/login?registered=true');
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat registrasi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4">
      <div className="w-full max-w-[460px] bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            S
          </div>
          <span className="text-xl font-bold text-black tracking-tight">Saldoo</span>
        </div>

        {/* Form Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-black mb-1">Daftar Akun Baru</h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Kelola transaksi dan pantau saldo keuangan mahasiswa Anda.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-xs font-semibold text-black mb-1.5">
              Nama Lengkap
            </label>
            <input
              id="fullName"
              type="text"
              placeholder="Masukkan nama lengkap"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-black mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="nama@kampus.ac.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-black mb-1.5">
              Kata Sandi
            </label>
            <input
              id="password"
              type="password"
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-black hover:bg-gray-800 text-white font-medium rounded-full text-sm transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500 space-y-4">
          <p>
            Sudah punya akun?{' '}
            <Link href="/login" className="text-blue-600 font-semibold hover:underline">
              Masuk
            </Link>
          </p>

          <div>
            <Link
              href="/"
              className="inline-flex items-center text-xs text-gray-500 hover:text-black transition"
            >
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}