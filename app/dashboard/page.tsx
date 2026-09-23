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

export default function DashboardPage() {
  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalExpense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const balance = totalIncome - totalExpense;

  const recentTransactions = [...transactions]
    .sort((first, second) => second.date.localeCompare(first.date))
    .slice(0, 5);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-sm font-semibold text-emerald-700">
            EXPENSE TRACKER
          </p>
          <h1 className="mt-2 text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-slate-600">
            Pantau pemasukan, pengeluaran, dan saldo kamu.
          </p>
        </header>

        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          # masih pake data dummy
        </div>

        <section
          aria-label="Ringkasan keuangan"
          className="grid gap-6 md:grid-cols-3"
        >
          <article className="rounded-2xl bg-slate-900 p-6 text-white shadow-sm">
            <h2 className="text-sm font-medium text-slate-300">
              Saldo Total
            </h2>
            <p className="mt-4 break-words text-3xl font-bold">
              {formatRupiah(balance)}
            </p>
            <p className="mt-3 text-sm text-slate-300">
              Total pemasukan dikurangi pengeluaran
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-medium text-slate-600">
              Total Pemasukan
            </h2>
            <p className="mt-4 break-words text-3xl font-bold text-emerald-700">
              {formatRupiah(totalIncome)}
            </p>
            <p className="mt-3 text-sm text-slate-500">
              Seluruh pemasukan yang tercatat
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-medium text-slate-600">
              Total Pengeluaran
            </h2>
            <p className="mt-4 break-words text-3xl font-bold text-rose-700">
              {formatRupiah(totalExpense)}
            </p>
            <p className="mt-3 text-sm text-slate-500">
              Seluruh pengeluaran yang tercatat
            </p>
          </article>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Transaksi Terbaru</h2>
          <p className="mt-1 text-sm text-slate-500">
            Maksimal lima transaksi berdasarkan tanggal terbaru.
          </p>

          {recentTransactions.length === 0 ? (
            <p className="py-8 text-center text-slate-500">
              Belum ada transaksi.
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
                  {recentTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-3 py-4 font-medium">
                        {transaction.name}
                      </td>

                      <td className="whitespace-nowrap px-3 py-4 text-slate-600">
                        {transaction.date.split("-").reverse().join("/")}
                      </td>

                      <td className="px-3 py-4">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                            transaction.type === "income"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {transaction.type === "income"
                            ? "Pemasukan"
                            : "Pengeluaran"}
                        </span>
                      </td>

                      <td
                        className={`whitespace-nowrap px-3 py-4 text-right font-semibold ${
                          transaction.type === "income"
                            ? "text-emerald-700"
                            : "text-rose-700"
                        }`}
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