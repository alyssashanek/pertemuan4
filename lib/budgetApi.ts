// lib/budgetApi.ts

export type BudgetStatus =
  | "aman"
  | "hampir_habis"
  | "terlampaui"
  | "belum_ditetapkan";

export type BudgetData = {
  month: string;
  budget: number | null;
  totalExpense: number;
  remaining: number | null;
  percentage: number | null;
  status: BudgetStatus;
};

export async function getBudget(
  month: string
): Promise<BudgetData> {
  const response = await fetch(
    `/api/budget?month=${encodeURIComponent(month)}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Gagal mengambil data budget."
    );
  }

  return data;
}

export async function saveBudget(
  month: string,
  amount: number
) {
  const response = await fetch("/api/budget", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      month,
      amount,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Gagal menyimpan budget."
    );
  }

  return data;
}