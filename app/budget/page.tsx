"use client";

import { useEffect, useState } from "react";
import BudgetForm from "@/components/budget/BudgetForm";
import BudgetSummary from "@/components/budget/BudgetSummary";
import {
  getBudget,
  type BudgetData,
} from "@/lib/budgetApi";

function getCurrentMonth() {
  const now = new Date();

  const year = now.getFullYear();

  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");

  return `${year}-${month}`;
}

function formatMonth(month: string) {
  const [year, monthNumber] =
    month.split("-");

  const date = new Date(
    Number(year),
    Number(monthNumber) - 1,
    1
  );

  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export default function BudgetPage() {
  const [selectedMonth, setSelectedMonth] =
    useState(getCurrentMonth());

  const [budgetData, setBudgetData] =
    useState<BudgetData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadBudget(month: string) {
    setLoading(true);
    setError("");

    try {
      const data = await getBudget(month);

      setBudgetData(data);
    } catch (error) {
      setBudgetData(null);

      setError(
        error instanceof Error
          ? error.message
          : "Gagal mengambil data budget."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBudget(selectedMonth);
  }, [selectedMonth]);

  function handleSaved() {
    loadBudget(selectedMonth);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-sm font-semibold text-slate-500">
            SALDOO
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Budget Bulanan
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Atur batas pengeluaran bulanan dan
            pantau pemakaian budget tanpa reload
            halaman.
          </p>
        </header>

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <label
            htmlFor="budget-month"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Pilih Bulan
          </label>

          <input
            id="budget-month"
            type="month"
            value={selectedMonth}
            onChange={(event) =>
              setSelectedMonth(
                event.target.value
              )
            }
            className="w-full max-w-xs rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          />

          <p className="mt-2 text-sm text-slate-500">
            Menampilkan data untuk{" "}
            <span className="font-semibold text-slate-700">
              {formatMonth(
                selectedMonth
              )}
            </span>
            .
          </p>
        </section>

        {loading && (
          <section
            role="status"
            aria-live="polite"
            className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"
          >
            <p className="font-medium text-slate-700">
              Memuat data budget...
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Sedang mengambil budget dan
              pengeluaran bulan ini.
            </p>
          </section>
        )}

        {!loading && error && (
          <section
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-6"
          >
            <p className="font-semibold text-red-700">
              Gagal memuat data budget
            </p>

            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                loadBudget(selectedMonth)
              }
              className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
              Coba Lagi
            </button>
          </section>
        )}

        {!loading &&
          !error &&
          budgetData && (
            <div className="grid gap-6 lg:grid-cols-2">
              <BudgetForm
                month={selectedMonth}
                currentAmount={
                  budgetData.budget
                }
                onSaved={handleSaved}
              />

              <BudgetSummary
                budget={budgetData.budget}
                totalExpense={
                  budgetData.totalExpense
                }
                remaining={
                  budgetData.remaining
                }
                percentage={
                  budgetData.percentage
                }
                status={budgetData.status}
              />
            </div>
          )}
      </div>
    </main>
  );
}