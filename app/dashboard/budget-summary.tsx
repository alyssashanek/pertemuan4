"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function getCurrentMonth() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}

function formatMonth(value: string) {
  if (!value) {
    return "";
  }

  const [year, month] = value.split("-").map(Number);
  const date = new Date(year, month - 1, 1);

  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export default function BudgetSummary() {
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    // Ambil bulan sesuai waktu lokal browser setelah halaman siap.
    const timer = window.setTimeout(() => {
      setSelectedMonth(getCurrentMonth());
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const validMonth = /^[1-9]\d{3}-(0[1-9]|1[0-2])$/.test(selectedMonth);

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
            Pantau batas pengeluaran untuk bulan yang kamu pilih.
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
            min="1000-01"
            max="9999-12"
            required
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(event.target.value)}
            aria-describedby="budget-month-help"
            className="mt-2 block w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 sm:w-48"
          />

          <p
            id="budget-month-help"
            className="mt-1 text-xs text-slate-500"
          >
            Pilih bulan dan tahun budget.
          </p>
        </div>
      </div>

      <div
        role="status"
        className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5"
      >
        <p className="font-semibold text-slate-800">
          Fitur budget sedang disiapkan
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          {validMonth
            ? `Ringkasan ${formatMonth(selectedMonth)} akan tersedia setelah layanan budget terhubung.`
            : "Pilih bulan yang valid untuk ringkasan budget."}
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Nominal budget, pengeluaran bulan terpilih, sisa budget, dan
          status pemakaian belum tersedia.
        </p>
      </div>

      <Link
        href="/budget"
        className="mt-5 inline-flex rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
      >
        Atur Budget Bulanan
      </Link>
    </section>
  );
}