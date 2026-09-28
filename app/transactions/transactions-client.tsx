"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { createTransaction } from "@/app/actions/transactions/create";
import { deleteTransaction } from "@/app/actions/transactions/delete";
import { getTransactions } from "@/app/actions/transactions/get";
import { updateTransaction } from "@/app/actions/transactions/update";
import { saveTransactionFilter } from "./actions";
import type {
  Transaction,
  TransactionFilter,
  TransactionType,
} from "@/lib/types/transaction";

type FormValues = {
  title: string;
  type: TransactionType;
  amount: string;
  transaction_date: string;
  note: string;
};

type ListState =
  | { status: "loading"; transactions: Transaction[] }
  | { status: "error"; transactions: Transaction[]; message: string }
  | { status: "success"; transactions: Transaction[] };

const filters: { value: TransactionFilter; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "income", label: "Pemasukan" },
  { value: "expense", label: "Pengeluaran" },
];

function currentDate() {
  return new Date().toISOString().slice(0, 10);
}

function emptyForm(): FormValues {
  return {
    title: "",
    type: "expense",
    amount: "",
    transaction_date: currentDate(),
    note: "",
  };
}

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

export default function TransactionsClient({
  initialFilter,
}: {
  initialFilter: TransactionFilter;
}) {
  const [selectedFilter, setSelectedFilter] =
    useState<TransactionFilter>(initialFilter);
  const [listState, setListState] = useState<ListState>({
    status: "loading",
    transactions: [],
  });
  const [formValues, setFormValues] = useState<FormValues>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formMessage, setFormMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadTransactions = useCallback(async (filter: TransactionFilter) => {
    try {
      const result = await getTransactions(filter);

      if (!result.success) {
        setListState((previous) => ({
          status: "error",
          transactions: previous.transactions,
          message: result.error ?? "Gagal memuat transaksi.",
        }));
        return;
      }

      setListState({
        status: "success",
        transactions: result.data ?? [],
      });
    } catch {
      setListState((previous) => ({
        status: "error",
        transactions: previous.transactions,
        message: "Tidak bisa terhubung ke server. Coba lagi.",
      }));
    }
  }, []);

  useEffect(() => {
    const requestTimer = window.setTimeout(() => {
      void loadTransactions(selectedFilter);
    }, 0);

    return () => {
      window.clearTimeout(requestTimer);
    };
  }, [loadTransactions, selectedFilter]);

  function resetForm() {
    setEditingId(null);
    setFormValues(emptyForm());
    setFormError("");
  }

  function notifyDashboard() {
    window.dispatchEvent(new Event("transactions-updated"));
  }

  function handleFilterChange(filter: TransactionFilter) {
    if (filter === selectedFilter) {
      return;
    }

    setListState((previous) => ({
      status: "loading",
      transactions: previous.transactions,
    }));
    setSelectedFilter(filter);
    setFormMessage("");

    const formData = new FormData();
    formData.set("type", filter);
    void saveTransactionFilter(formData);
  }

  function retryLoadingTransactions() {
    setListState((previous) => ({
      status: "loading",
      transactions: previous.transactions,
    }));
    void loadTransactions(selectedFilter);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setFormMessage("");

    const amount = Number(formValues.amount);

    if (!formValues.title.trim()) {
      setFormError("Nama transaksi wajib diisi.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setFormError("Nominal harus lebih dari 0.");
      return;
    }

    if (!formValues.transaction_date) {
      setFormError("Tanggal transaksi wajib diisi.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        title: formValues.title.trim(),
        type: formValues.type,
        amount,
        transaction_date: formValues.transaction_date,
        note: formValues.note,
      };
      const result = editingId
        ? await updateTransaction(editingId, payload)
        : await createTransaction(payload);

      if (!result.success) {
        setFormError(result.error ?? "Transaksi gagal disimpan.");
        return;
      }

      const wasEditing = editingId !== null;
      resetForm();
      setFormMessage(
        wasEditing
          ? "Transaksi berhasil diperbarui."
          : "Transaksi berhasil dicatat.",
      );
      notifyDashboard();
      await loadTransactions(selectedFilter);
    } catch {
      setFormError("Tidak bisa terhubung ke server. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  function startEditing(transaction: Transaction) {
    setEditingId(transaction.id);
    setFormValues({
      title: transaction.title,
      type: transaction.type,
      amount: String(transaction.amount),
      transaction_date: transaction.transaction_date,
      note: transaction.note ?? "",
    });
    setFormError("");
    setFormMessage("");
  }

  async function handleDelete(transaction: Transaction) {
    const confirmed = window.confirm(
      `Hapus transaksi \"${transaction.title}\"? Tindakan ini tidak dapat dibatalkan.`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(transaction.id);
    setFormMessage("");

    try {
      const result = await deleteTransaction(transaction.id);

      if (!result.success) {
        setFormError(result.error ?? "Transaksi gagal dihapus.");
        return;
      }

      if (editingId === transaction.id) {
        resetForm();
      }

      setFormMessage("Transaksi berhasil dihapus.");
      notifyDashboard();
      await loadTransactions(selectedFilter);
    } catch {
      setFormError("Tidak bisa terhubung ke server. Coba lagi.");
    } finally {
      setDeletingId(null);
    }
  }

  const transactions = listState.transactions;
  const isLoading = listState.status === "loading";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/dashboard"
          className="rounded text-sm font-semibold text-emerald-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        >
          Kembali ke Dashboard
        </Link>

        <header className="mb-8 mt-6">
          <p className="text-sm font-semibold text-emerald-700">SALDOO</p>
          <h1 className="mt-2 text-3xl font-bold">Riwayat Transaksi</h1>
          <p className="mt-2 text-slate-600">
            Catat dan periksa pemasukan maupun pengeluaran tanpa memuat ulang halaman.
          </p>
        </header>

        <section
          aria-labelledby="transaction-form-title"
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 id="transaction-form-title" className="text-xl font-bold">
                {editingId ? "Ubah transaksi" : "Catat transaksi"}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Isi informasi transaksi yang ingin disimpan.
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                disabled={submitting}
                className="min-h-11 rounded-lg px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 disabled:opacity-60"
              >
                Batal mengubah
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-semibold">
                Nama transaksi
              </label>
              <input
                id="title"
                value={formValues.title}
                onChange={(event) =>
                  setFormValues((previous) => ({
                    ...previous,
                    title: event.target.value,
                  }))
                }
                required
                maxLength={150}
                className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-semibold">
                Jenis
              </label>
              <select
                id="type"
                value={formValues.type}
                onChange={(event) =>
                  setFormValues((previous) => ({
                    ...previous,
                    type: event.target.value as TransactionType,
                  }))
                }
                className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
              >
                <option value="expense">Pengeluaran</option>
                <option value="income">Pemasukan</option>
              </select>
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-semibold">
                Nominal
              </label>
              <input
                id="amount"
                type="number"
                inputMode="decimal"
                min="1"
                step="0.01"
                value={formValues.amount}
                onChange={(event) =>
                  setFormValues((previous) => ({
                    ...previous,
                    amount: event.target.value,
                  }))
                }
                required
                className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
              />
            </div>

            <div>
              <label htmlFor="transaction-date" className="block text-sm font-semibold">
                Tanggal
              </label>
              <input
                id="transaction-date"
                type="date"
                value={formValues.transaction_date}
                onChange={(event) =>
                  setFormValues((previous) => ({
                    ...previous,
                    transaction_date: event.target.value,
                  }))
                }
                required
                className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
              />
            </div>

            <div>
              <label htmlFor="note" className="block text-sm font-semibold">
                Catatan <span className="font-normal text-slate-500">(opsional)</span>
              </label>
              <input
                id="note"
                value={formValues.note}
                onChange={(event) =>
                  setFormValues((previous) => ({
                    ...previous,
                    note: event.target.value,
                  }))
                }
                className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
              />
            </div>

            <div className="md:col-span-2">
              {formError && (
                <p role="alert" className="mb-3 rounded-lg bg-rose-50 p-3 text-sm text-rose-800">
                  {formError}
                </p>
              )}
              {formMessage && (
                <p role="status" className="mb-3 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
                  {formMessage}
                </p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="min-h-11 rounded-lg bg-emerald-700 px-4 text-sm font-semibold text-white hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-wait disabled:opacity-60"
              >
                {submitting
                  ? "Menyimpan..."
                  : editingId
                    ? "Simpan perubahan"
                    : "Simpan transaksi"}
              </button>
            </div>
          </form>
        </section>

        <section
          aria-labelledby="transaction-list-title"
          className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 id="transaction-list-title" className="text-xl font-bold">
                Daftar transaksi
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {isLoading
                  ? "Memuat transaksi..."
                  : `Menampilkan ${transactions.length} transaksi`}
              </p>
            </div>

            <div className="flex flex-wrap gap-2" aria-label="Filter jenis transaksi">
              {filters.map((filter) => {
                const active = selectedFilter === filter.value;

                return (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => handleFilterChange(filter.value)}
                    aria-pressed={active}
                    disabled={isLoading}
                    className={
                      active
                        ? "min-h-11 rounded-lg bg-emerald-700 px-4 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:opacity-60"
                        : "min-h-11 rounded-lg bg-slate-100 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 disabled:opacity-60"
                    }
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>

          {listState.status === "error" && (
            <div role="alert" className="mt-5 rounded-lg bg-rose-50 p-4 text-sm text-rose-800">
              <p>{listState.message}</p>
              <button
                type="button"
                onClick={retryLoadingTransactions}
                className="mt-3 rounded font-semibold underline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Coba lagi
              </button>
            </div>
          )}

          {isLoading && transactions.length === 0 && (
            <div role="status" className="py-12 text-center text-sm text-slate-600">
              Sedang mengambil transaksi...
            </div>
          )}

          {!isLoading && listState.status === "success" && transactions.length === 0 && (
            <div className="py-12 text-center">
              <p className="font-semibold">Belum ada transaksi untuk filter ini.</p>
              <p className="mt-2 text-sm text-slate-600">
                Gunakan formulir di atas untuk mencatat transaksi pertama.
              </p>
            </div>
          )}

          {transactions.length > 0 && (
            <ul className="mt-5 divide-y divide-slate-100" aria-busy={isLoading}>
              {transactions.map((transaction) => {
                const isIncome = transaction.type === "income";
                const isDeleting = deletingId === transaction.id;

                return (
                  <li
                    key={transaction.id}
                    className="flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="break-words font-semibold">{transaction.title}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                        <span className="text-slate-600">
                          {formatDate(transaction.transaction_date)}
                        </span>
                        <span
                          className={
                            isIncome
                              ? "rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                              : "rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700"
                          }
                        >
                          {isIncome ? "Pemasukan" : "Pengeluaran"}
                        </span>
                      </div>
                      {transaction.note && (
                        <p className="mt-2 break-words text-sm text-slate-600">
                          {transaction.note}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                      <p
                        className={
                          isIncome
                            ? "font-semibold text-emerald-700"
                            : "font-semibold text-rose-700"
                        }
                      >
                        {isIncome ? "+" : "-"}
                        {formatRupiah(Number(transaction.amount))}
                      </p>
                      <button
                        type="button"
                        onClick={() => startEditing(transaction)}
                        disabled={isDeleting || submitting}
                        className="min-h-11 rounded-lg px-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:opacity-60"
                      >
                        Ubah
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(transaction)}
                        disabled={isDeleting || submitting}
                        className="min-h-11 rounded-lg px-3 text-sm font-semibold text-rose-700 hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700 disabled:opacity-60"
                      >
                        {isDeleting ? "Menghapus..." : "Hapus"}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
