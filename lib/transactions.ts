export type Transaction = {
  id: string;
  user_id: string;
  type: "income" | "expense";
  title: string;
  amount: number;
  transaction_date: string;
  note: string | null;
  created_at: string;
  updated_at: string;
};

export const dummyTransactions: Transaction[] = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    user_id: "00000000-0000-4000-8000-000000000099",
    type: "income",
    title: "Uang bulanan",
    amount: 2000000,
    transaction_date: "2026-09-01",
    note: null,
    created_at: "2026-09-01T08:00:00",
    updated_at: "2026-09-01T08:00:00",
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    user_id: "00000000-0000-4000-8000-000000000099",
    type: "expense",
    title: "Makan siang",
    amount: 25000,
    transaction_date: "2026-09-02",
    note: null,
    created_at: "2026-09-02T12:00:00",
    updated_at: "2026-09-02T12:00:00",
  },
  {
    id: "00000000-0000-4000-8000-000000000003",
    user_id: "00000000-0000-4000-8000-000000000099",
    type: "expense",
    title: "Transportasi",
    amount: 50000,
    transaction_date: "2026-09-03",
    note: null,
    created_at: "2026-09-03T09:00:00",
    updated_at: "2026-09-03T09:00:00",
  },
  {
    id: "00000000-0000-4000-8000-000000000004",
    user_id: "00000000-0000-4000-8000-000000000099",
    type: "income",
    title: "Pendapatan freelance",
    amount: 500000,
    transaction_date: "2026-09-04",
    note: null,
    created_at: "2026-09-04T15:00:00",
    updated_at: "2026-09-04T15:00:00",
  },
];

export function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatTransactionDate(date: string) {
  return date.split("-").reverse().join("/");
}

export function sortTransactionsNewestFirst(
  transactions: Transaction[],
) {
  return [...transactions].sort(
    (first, second) =>
      second.transaction_date.localeCompare(first.transaction_date) ||
      second.created_at.localeCompare(first.created_at) ||
      second.id.localeCompare(first.id),
  );
}