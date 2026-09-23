import Link from "next/link";
import { cookies } from "next/headers";
import { saveTransactionFilter } from "./actions";

type Transaction = {
  id: string;
  name: string;
  type: "income" | "expense";
  amount: number;
  date: string;
};

const transactions: Transaction[] = [
  {
    id: "1",
    name: "Uang bulanan",
    type: "income",
    amount: 2000000,
    date: "2026-09-01",
  },
  {
    id: "2",
    name: "Makan siang",
    type: "expense",
    amount: 25000,
    date: "2026-09-02",
  },
  {
    id: "3",
    name: "Transportasi",
    type: "expense",
    amount: 50000,
    date: "2026-09-03",
  },
  {
    id: "4",
    name: "Pendapatan freelance",
    type: "income",
    amount: 500000,
    date: "2026-09-04",
  },
];

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function TransactionsPage() {
  const cookieStore = await cookies();
  const savedFilter = cookieStore.get("transaction_filter")?.value;

  const selectedType =
    savedFilter === "income" || savedFilter === "expense"
      ? savedFilter
      : "all";

  const filteredTransactions = transactions
    .filter(
      (transaction) =>
        selectedType === "all" || transaction.type === selectedType,
    )
    .sort((first, second) => second.date.localeCompare(first.date));

  const filters = [
    { value: "all", label: "Semua" },
    { value: "income", label: "Pemasukan" },
    { value: "expense", label: "Pengeluaran" },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/dashboard"
          className="text-sm font-medium text-emerald-700 hover:underline"
        >
          ← Kembali ke Dashboard
        </Link>

        <header className="mb-8 mt-6">
          <p className="text-sm font-semibold text-emerald-700">
            EXPENSE TRACKER
          </p>
          <h1 className="mt-2 text-3xl font-bold">Riwayat Transaksi</h1>
          <p className="mt-2 text-slate-600">
            Lihat seluruh catatan pemasukan dan pengeluaran kamu.
          </p>
        </header>

        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          # masih pake data dummy
        </div>

        <section
          aria-label="Daftar transaksi"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <form action={saveTransactionFilter}>
            <fieldset>
              <legend className="mb-3 text-sm font-medium text-slate-700">
                Filter jenis transaksi
              </legend>

              <div className="flex flex-wrap gap-3">
                {filters.map((filter) => (
                  <button
                    key={filter.value}
                    type="submit"
                    name="type"
                    value={filter.value}
                    aria-pressed={selectedType === filter.value}
                    className={
                      selectedType === filter.value
                        ? "cursor-pointer rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white"
                        : "cursor-pointer rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200"
                    }
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </fieldset>
          </form>

          <p className="mt-4 text-sm text-slate-500">
            Menampilkan {filteredTransactions.length} transaksi
          </p>

          {filteredTransactions.length === 0 ? (
            <p className="py-12 text-center text-slate-500">
              Tidak ada transaksi untuk filter ini.
            </p>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 text-slate-500">
                  <tr>
                    <th scope="col" className="px-3 py-3 font-medium">
                      Nama Transaksi
                    </th>
                    <th scope="col" className="px-3 py-3 font-medium">
                      Tanggal
                    </th>
                    <th scope="col" className="px-3 py-3 font-medium">
                      Jenis
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-right font-medium"
                    >
                      Nominal
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-3 py-4 font-medium">
                        {transaction.name}
                      </td>

                      <td className="whitespace-nowrap px-3 py-4 text-slate-600">
                        {transaction.date.split("-").reverse().join("/")}
                      </td>

                      <td className="px-3 py-4">
                        <span
                          className={
                            transaction.type === "income"
                              ? "inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                              : "inline-block rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700"
                          }
                        >
                          {transaction.type === "income"
                            ? "Pemasukan"
                            : "Pengeluaran"}
                        </span>
                      </td>

                      <td
                        className={
                          transaction.type === "income"
                            ? "whitespace-nowrap px-3 py-4 text-right font-semibold text-emerald-700"
                            : "whitespace-nowrap px-3 py-4 text-right font-semibold text-rose-700"
                        }
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatRupiah(transaction.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}