"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email dan kata sandi wajib diisi.");
      return;
    }

    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (authError) {
      setError(authError.message || "Gagal masuk. Periksa kembali email dan kata sandi.");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <span className="w-7 h-7 rounded-lg bg-[#FF0000] flex items-center justify-center text-white font-bold text-sm">
            S
          </span>
          <span className="text-[#0F0F0F] font-bold text-lg">Saldoo</span>
        </div>

        <h1 className="text-[20px] font-bold text-[#0F0F0F] mb-1">
          Masuk ke Akun
        </h1>
        <p className="text-[14px] text-[#606060] mb-6">
          Kelola transaksi dan pantau saldo keuangan mahasiswa Anda.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-[#FFF0F0] border border-[#FF0000]/20 rounded-lg text-[13px] text-[#CC0000]">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-[12px] font-medium text-[#0F0F0F] mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@kampus.ac.id"
              required
              className="w-full h-10 px-3 text-[14px] bg-[#FFFFFF] border border-[#E5E5E5] rounded-lg focus-visible:outline-none focus-visible:border-[#0F0F0F] text-[#0F0F0F]"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-[12px] font-medium text-[#0F0F0F] mb-1"
            >
              Kata Sandi
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              required
              className="w-full h-10 px-3 text-[14px] bg-[#FFFFFF] border border-[#E5E5E5] rounded-lg focus-visible:outline-none focus-visible:border-[#0F0F0F] text-[#0F0F0F]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 px-4 mt-2 text-[14px] font-medium text-white bg-[#0F0F0F] hover:bg-[#272727] disabled:opacity-50 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-[#0F0F0F] focus-visible:outline-none"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="mt-6 text-center text-[13px] text-[#606060]">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="text-[#065FD4] font-medium hover:underline"
          >
            Daftar sekarang
          </Link>
        </p>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-[12px] text-[#606060] hover:text-[#0F0F0F]"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
