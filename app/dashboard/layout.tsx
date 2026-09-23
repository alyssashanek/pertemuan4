import Link from "next/link";
import type { ReactNode } from "react";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav
        aria-label="Navigasi dashboard"
        className="border-b border-slate-200 bg-white px-6 py-4"
      >
        <div className="mx-auto flex max-w-6xl justify-end">
          <Link
            href="/transactions"
            className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
          >
            Lihat Riwayat Transaksi
          </Link>
        </div>
      </nav>

      {children}
    </div>
  );
}