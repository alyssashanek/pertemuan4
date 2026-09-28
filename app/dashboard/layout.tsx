import Link from "next/link";
import type { ReactNode } from "react";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const linkClass =
    "rounded-lg px-4 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700";

  return (
    <div className="min-h-screen bg-slate-50">
      <nav
        aria-label="Navigasi dashboard"
        className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6"
      >
        <div className="mx-auto flex max-w-6xl flex-wrap justify-end gap-3">
          <Link
            href="/budget"
            className={`${linkClass} border border-emerald-700 text-emerald-700 hover:bg-emerald-50`}
          >
            Atur Budget Bulanan
          </Link>

          <Link
            href="/transactions"
            className={`${linkClass} bg-emerald-700 text-white hover:bg-emerald-800`}
          >
            Lihat Riwayat Transaksi
          </Link>
        </div>
      </nav>

      {children}
    </div>
  );
}