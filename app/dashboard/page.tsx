"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getDashboardData } from "./actions";
import type { DashboardData } from "./actions";
import BudgetSummary from "./budget-summary";

type DashboardState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: DashboardData };

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(date: string) {
  return date.split("-").reverse().join("/");
}

export default function DashboardPage() {
  const [state, setState] = useState<DashboardState>({
    status: "loading",
  });
  const [refreshNumber, setRefreshNumber] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const result = await getDashboardData();

        if (!active) {
          return;
        }

        if (!result.success) {
          setState({
            status: "error",
            message: result.error,
          });
          return;
        }

        setState({
          status: "success",
          data: result.data,
        });
      } catch {
        if (active) {
          setState({
            status: "error",
            message: "Tidak bisa terhubung ke server. Coba lagi.",
          });
        }
      }
    }

    void loadDashboard();

    return () => {
      active = false;
    };
  }, [refreshNumber]);

  useEffect(() => {
    function refreshDashboard() {
      setState({ status: "loading" });
      setRefreshNumber((number) => number + 1);
    }

    // Ambil ulang saat kembali ke tab atau ada pemberitahuan perubahan.
    window.addEventListener("focus", refreshDashboard);
    window.addEventListener("transactions-updated", refreshDashboard);

    return () => {
      window.removeEventListener("focus", refreshDashboard);
      window.removeEventListener("transactions-updated", refreshDashboard);
    };
  }, []);

  function handleRefresh() {
    setState({ status: "loading" });
    setRefreshNumber((number) => number + 1);
  }

  const loading = state.status === "loading";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-emerald-700">
              SALDOO
            </p>

            <h1 className="mt-2 text-3xl font-bold">Dashboard</h1>

            <p className="mt-2 text-slate-600">
              Pantau pemasukan, pengeluaran, dan saldo kamu.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-wait disabled:opacity-60"
          >
            {loading ? "Memuat..." : "Perbarui"}
          </button>
        </header>

        <div role="status" className="mb-4 text-sm text-slate-600">
          {loading
            ? "Sedang mengambil data dashboard..."
            : state.status === "success"
              ? `Data berhasil dimuat. Ada ${state.data.transactionCount} transaksi.`
              : ""}
        </div>

        {state.status === "error" && (
          <div
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-rose-800"
          >
            <p>{state.message}</p>

            <div className="mt-4 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={handleRefresh}
                className="rounded font-semibold underline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Coba lagi
              </button>

              <Link
                href="/login"
                className="rounded font-semibold underline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Ke halaman login
              </Link>
            </div>
          </div>
        )}

        <div aria-busy={loading}>
          {loading && (
            <section
              aria-label="Memuat ringkasan keuangan"
              className="grid gap-4 md:grid-cols-3"
            >
              {["Saldo Total", "Total Pemasukan", "Total Pengeluaran"].map(
                (title) => (
                  <article
                    key={title}
                    className="rounded-2xl border border-slate-200 bg-white p-6"
                  >
                    <h2 className="text-sm text-slate-600">{title}</h2>
                    <div
                      aria-hidden="true"
                      className="mt-4 h-9 w-3/4 rounded bg-slate-100 motion-safe:animate-pulse"
                    />
                  </article>
                ),
              )}
            </section>
          )}

          {state.status === "success" && (
            <>
              <section
                aria-label="Ringkasan keuangan"
                className="grid gap-4 md:grid-cols-3"
              >
                <article className="min-w-0 rounded-2xl bg-slate-900 p-6 text-white shadow-sm">
                  <h2 className="text-sm font-medium text-slate-300">
                    Saldo Total
                  </h2>
                  <p className="mt-4 break-words text-3xl font-bold">
                    {formatRupiah(state.data.balance)}
                  </p>
                  <p className="mt-3 text-sm text-slate-300">
                    Total pemasukan dikurangi pengeluaran
                  </p>
                </article>

                <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-sm font-medium text-slate-600">
                    Total Pemasukan
                  </h2>
                  <p className="mt-4 break-words text-3xl font-bold text-emerald-700">
                    {formatRupiah(state.data.totalIncome)}
                  </p>
                  <p className="mt-3 text-sm text-slate-500">
                    Seluruh pemasukan yang tercatat
                  </p>
                </article>

                <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-sm font-medium text-slate-600">
                    Total Pengeluaran
                  </h2>
                  <p className="mt-4 break-words text-3xl font-bold text-rose-700">
                    {formatRupiah(state.data.totalExpense)}
                  </p>
                  <p className="mt-3 text-sm text-slate-500">
                    Seluruh pengeluaran yang tercatat
                  </p>
                </article>
              </section>

              <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                <h2 className="text-xl font-bold">Transaksi Terbaru</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Maksimal lima transaksi berdasarkan tanggal terbaru.
                </p>

                {state.data.recentTransactions.length === 0 ? (
                  <div className="py-10 text-center">
                    <p className="font-medium">Belum ada transaksi.</p>
                    <p className="mt-2 text-sm text-slate-500">
                      Transaksi yang kamu catat akan muncul di sini.
                    </p>
                  </div>
                ) : (
                  <ul className="mt-5 divide-y divide-slate-100">
                    {state.data.recentTransactions.map((transaction) => {
                      const isIncome = transaction.type === "income";

                      return (
                        <li
                          key={transaction.id}
                          className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="min-w-0">
                            <p className="break-words font-semibold">
                              {transaction.title}
                            </p>

                            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                              <span className="text-slate-500">
                                {formatDate(transaction.transaction_date)}
                              </span>

                              <span
                                className={`rounded-full px-3 py-1 text-xs font-medium ${
                                  isIncome
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-rose-50 text-rose-700"
                                }`}
                              >
                                {isIncome ? "Pemasukan" : "Pengeluaran"}
                              </span>
                            </div>
                          </div>

                          <p
                            className={`break-words font-semibold ${
                              isIncome
                                ? "text-emerald-700"
                                : "text-rose-700"
                            }`}
                          >
                            {isIncome ? "+" : "-"}
                            {formatRupiah(transaction.amount)}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            </>
          )}
        </div>

        <BudgetSummary />
      </div>
    </main>
  );
}