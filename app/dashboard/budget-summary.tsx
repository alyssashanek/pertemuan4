"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getBudgetSummary } from "./budget-actions";
import type { BudgetSummaryResult } from "./budget-actions";

function currentMonth() {
  const today = new Date();

  return `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}`;
}

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function BudgetSummary() {
  const [month, setMonth] = useState("");
  const [result, setResult] = useState<BudgetSummaryResult | null>(null);
  const [refreshNumber, setRefreshNumber] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMonth(currentMonth());
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!month) {
      return;
    }

    let active = true;

    async function loadBudget() {
      try {
        const response = await getBudgetSummary(month);

        if (active) {
          setResult(response);
        }
      } catch {
        if (active) {
          setResult({
            success: false,
            error: "Tidak bisa terhubung ke server. Coba lagi.",
          });
        }
      }
    }

    void loadBudget();

    return () => {
      active = false;
    };
  }, [month, refreshNumber]);

  useEffect(() => {
    function refreshBudget() {
      setResult(null);
      setRefreshNumber((value) => value + 1);
    }

    window.addEventListener("focus", refreshBudget);
    window.addEventListener("transactions-updated", refreshBudget);
    window.addEventListener("budget-updated", refreshBudget);

    return () => {
      window.removeEventListener("focus", refreshBudget);
      window.removeEventListener("transactions-updated", refreshBudget);
      window.removeEventListener("budget-updated", refreshBudget);
    };
  }, []);

  function handleRefresh() {
    setResult(null);
    setRefreshNumber((value) => value + 1);
  }

  const loading = Boolean(month) && result === null;
  const summary = result?.success ? result : null;

  const statusColor =
    summary?.status === "Terlampaui"
      ? "bg-rose-50 text-rose-700"
      : summary?.status === "Hampir Habis"
        ? "bg-amber-50 text-amber-800"
        : "bg-emerald-50 text-emerald-700";

  const progressColor =
    summary?.status === "Terlampaui"
      ? "bg-rose-600"
      : summary?.status === "Hampir Habis"
        ? "bg-amber-500"
        : "bg-emerald-600";

  const buttonClass =
    "rounded-lg px-4 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700";

  return (
    <section
      aria-labelledby="budget-heading"
      className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <h2 id="budget-heading" className="text-xl font-bold">
            Budget Bulanan
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Pantau pengeluaran berdasarkan bulan yang dipilih.
          </p>
        </div>

        <div className="w-full sm:w-auto">
          <label
            htmlFor="budget-month"
            className="block text-sm font-medium text-slate-700"
          >
            Pilih bulan
          </label>

          <input
            id="budget-month"
            type="month"
            required
            min="1000-01"
            max="9998-12"
            value={month}
            onChange={(event) => {
              setResult(null);
              setMonth(event.target.value);
            }}
            className="mt-2 block w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 sm:w-48"
          />
        </div>
      </div>

      <div className="mt-6" aria-busy={loading}>
        <p role="status" className="text-sm text-slate-600">
          {!month
            ? "Pilih bulan untuk melihat ringkasan."
            : loading
              ? "Sedang mengambil ringkasan budget..."
              : summary
                ? `Ringkasan bulan ${month} berhasil dimuat.`
                : ""}
        </p>

        {result && !result.success && (
          <div
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
          >
            {result.error}
          </div>
        )}

        {summary && (
          <>
            {summary.budget === null && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
                <p className="font-semibold">
                  Budget belum ditetapkan
                </p>
                <p className="mt-1 text-sm">
                  Atur budget untuk bulan {month} agar sisa dan
                  persentase pemakaian dapat dihitung.
                </p>
              </div>
            )}

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <article className="min-w-0 rounded-xl bg-slate-50 p-4">
                <h3 className="text-sm text-slate-600">
                  Budget Bulanan
                </h3>
                <p className="mt-3 break-words text-2xl font-bold">
                  {summary.budget === null
                    ? "Belum ditetapkan"
                    : formatRupiah(summary.budget)}
                </p>
              </article>

              <article className="min-w-0 rounded-xl bg-slate-50 p-4">
                <h3 className="text-sm text-slate-600">
                  Pengeluaran Bulan Ini
                </h3>
                <p className="mt-3 break-words text-2xl font-bold text-rose-700">
                  {formatRupiah(summary.totalExpense)}
                </p>
              </article>

              <article className="min-w-0 rounded-xl bg-slate-50 p-4">
                <h3 className="text-sm text-slate-600">
                  Sisa Budget
                </h3>
                <p
                  className={`mt-3 break-words text-2xl font-bold ${
                    summary.remaining !== null && summary.remaining < 0
                      ? "text-rose-700"
                      : "text-slate-900"
                  }`}
                >
                  {summary.remaining === null
                    ? "Belum tersedia"
                    : formatRupiah(summary.remaining)}
                </p>
              </article>
            </div>

            {summary.percentage !== null && (
              <div className="mt-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-medium">
                    Pemakaian budget:{" "}
                    {new Intl.NumberFormat("id-ID", {
                      maximumFractionDigits: 2,
                    }).format(summary.percentage)}
                    %
                  </p>

                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${statusColor}`}
                  >
                    {summary.status}
                  </span>
                </div>

                <div
                  role="progressbar"
                  aria-label="Pemakaian budget bulanan"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.min(summary.percentage, 100)}
                  aria-valuetext={`${summary.percentage.toFixed(2)} persen, ${summary.status}`}
                  className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100"
                >
                  <div
                    className={`h-full rounded-full ${progressColor}`}
                    style={{
                      width: `${Math.min(summary.percentage, 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/budget"
          className={`${buttonClass} bg-emerald-700 text-white hover:bg-emerald-800`}
        >
          Atur Budget Bulanan
        </Link>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading || !month}
          className={`${buttonClass} border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {loading ? "Memuat..." : "Perbarui Budget"}
        </button>
      </div>
    </section>
  );
}