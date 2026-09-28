"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type BudgetSummaryResult =
  | {
      success: true;
      budget: number | null;
      totalExpense: number;
      remaining: number | null;
      percentage: number | null;
      status: "Belum ditetapkan" | "Aman" | "Hampir Habis" | "Terlampaui";
    }
  | {
      success: false;
      error: string;
    };

export async function getBudgetSummary(
  month: string,
): Promise<BudgetSummaryResult> {
  if (
    typeof month !== "string" ||
    !/^[1-9]\d{3}-(0[1-9]|1[0-2])$/.test(month)
  ) {
    return { success: false, error: "Bulan tidak valid." };
  }

  const [year, monthNumber] = month.split("-").map(Number);

  if (year > 9998) {
    return { success: false, error: "Tahun maksimal 9998." };
  }

  const startDate = `${month}-01`;
  const nextMonth =
    monthNumber === 12
      ? `${year + 1}-01-01`
      : `${year}-${String(monthNumber + 1).padStart(2, "0")}-01`;

  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "Sesi tidak valid. Silakan login kembali.",
      };
    }

    const { data: budgetRow, error: budgetError } = await supabase
      .from("monthly_budgets")
      .select("amount")
      .eq("user_id", user.id)
      .eq("budget_month", startDate)
      .maybeSingle();

    if (budgetError) {
      console.error("[getBudgetSummary]", budgetError.message);

      const unavailable =
        budgetError.code === "42P01" ||
        budgetError.code === "PGRST205";

      return {
        success: false,
        error: unavailable
          ? "Layanan budget belum tersedia."
          : "Gagal mengambil budget. Silakan coba lagi.",
      };
    }

    let expenseCents = 0;
    let offset = 0;

    while (true) {
      const { data, error } = await supabase
        .from("transactions")
        .select("id, amount")
        .eq("user_id", user.id)
        .eq("type", "expense")
        .gte("transaction_date", startDate)
        .lt("transaction_date", nextMonth)
        .order("id", { ascending: true })
        .range(offset, offset + 499);

      if (error) {
        console.error("[getBudgetSummary]", error.message);

        return {
          success: false,
          error: "Gagal menghitung pengeluaran bulan terpilih.",
        };
      }

      const rows = data ?? [];

      if (rows.length === 0) {
        break;
      }

      for (const transaction of rows) {
        const amount = Number(transaction.amount);

        if (!Number.isFinite(amount) || amount <= 0) {
          return {
            success: false,
            error: "Ada nominal transaksi yang tidak valid.",
          };
        }

        expenseCents += Math.round(amount * 100);

        if (!Number.isSafeInteger(expenseCents)) {
          return {
            success: false,
            error: "Total pengeluaran terlalu besar untuk dihitung.",
          };
        }
      }

      offset += rows.length;
    }

    const totalExpense = expenseCents / 100;

    if (!budgetRow) {
      return {
        success: true,
        budget: null,
        totalExpense,
        remaining: null,
        percentage: null,
        status: "Belum ditetapkan",
      };
    }

    const budget = Number(budgetRow.amount);
    const budgetCents = Math.round(budget * 100);

    if (
      !Number.isFinite(budget) ||
      budget <= 0 ||
      !Number.isSafeInteger(budgetCents) ||
      budgetCents <= 0
    ) {
      return {
        success: false,
        error: "Nominal budget tidak valid.",
      };
    }

    const percentage = (expenseCents / budgetCents) * 100;

    return {
      success: true,
      budget: budgetCents / 100,
      totalExpense,
      remaining: (budgetCents - expenseCents) / 100,
      percentage,
      status:
        percentage >= 100
          ? "Terlampaui"
          : percentage >= 80
            ? "Hampir Habis"
            : "Aman",
    };
  } catch (error) {
    console.error("[getBudgetSummary]", error);

    return {
      success: false,
      error: "Ringkasan budget gagal dimuat. Silakan coba lagi.",
    };
  }
}