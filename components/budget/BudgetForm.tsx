"use client";

import { FormEvent, useEffect, useState } from "react";
import { saveBudget } from "@/lib/budgetApi";

type BudgetFormProps = {
  month: string;
  currentAmount: number | null;
  onSaved: () => void;
};

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function BudgetForm({
  month,
  currentAmount,
  onSaved,
}: BudgetFormProps) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (currentAmount !== null) {
      setAmount(String(currentAmount));
    } else {
      setAmount("");
    }

    setError("");
    setSuccess("");
  }, [currentAmount, month]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const numericAmount = Number(amount);

    if (!amount.trim()) {
      setError("Nominal budget wajib diisi.");
      return;
    }

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      setError("Nominal budget harus lebih dari 0.");
      return;
    }

    setLoading(true);

    try {
      await saveBudget(month, numericAmount);

      setSuccess(
        currentAmount === null
          ? "Budget berhasil ditetapkan."
          : "Budget berhasil diperbarui."
      );

      onSaved();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menyimpan budget."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">
          {currentAmount === null
            ? "Tetapkan Budget"
            : "Ubah Budget"}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Tentukan batas pengeluaran untuk bulan{" "}
          <span className="font-medium text-slate-700">
            {month}
          </span>
          .
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="budget-amount"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Nominal Budget
          </label>

          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">
              Rp
            </span>

            <input
              id="budget-amount"
              type="number"
              min="1"
              step="0.01"
              value={amount}
              onChange={(event) =>
                setAmount(event.target.value)
              }
              disabled={loading}
              placeholder="Contoh: 2000000"
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </div>

          <p className="mt-2 text-xs text-slate-500">
            Masukkan nominal lebih dari Rp0.
          </p>
        </div>

        {amount &&
          Number.isFinite(Number(amount)) &&
          Number(amount) > 0 && (
            <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
              Budget:{" "}
              <span className="font-semibold text-slate-900">
                {formatRupiah(Number(amount))}
              </span>
            </div>
          )}

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Menyimpan..."
            : currentAmount === null
              ? "Tetapkan Budget"
              : "Perbarui Budget"}
        </button>
      </form>
    </section>
  );
}