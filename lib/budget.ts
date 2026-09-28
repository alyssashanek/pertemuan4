export type BudgetStatus =
  | "aman_banget"
  | "hampir_habis"
  | "udah_melebihi"
  | "belum_ditetapkan";

export type BudgetSummary = {
  budget: number | null;
  totalExpense: number;
  remaining: number | null;
  percentage: number | null;
  status: BudgetStatus;
};

export function isValidBudgetMonth(month: string) {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(month);
}

export function monthToDate(month: string) {
  if (!isValidBudgetMonth(month)) {
    throw new Error("Format bulan harus YYYY-MM.");
  }

  return `${month}-01`;
}

export function calculateBudgetStatus(
  budget: number | null,
  totalExpense: number,
): BudgetSummary {
  if (budget === null) {
    return {
      budget: null,
      totalExpense,
      remaining: null,
      percentage: null,
      status: "belum_ditetapkan",
    };
  }

  const remaining = budget - totalExpense;

  const percentage =
    budget === 0 ? 0 : (totalExpense / budget) * 100;

  let status: BudgetStatus;

  if (percentage < 80) {
    status = "aman_banget";
  } else if (percentage < 100) {
    status = "hampir_habis";
  } else {
    status = "udah_melebihi";
  }

  return {
    budget,
    totalExpense,
    remaining,
    percentage,
    status,
  };
}