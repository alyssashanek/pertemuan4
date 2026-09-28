"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

type RecentTransaction = {
  id: string;
  title: string;
  type: "income" | "expense";
  amount: number;
  transaction_date: string;
};

export type DashboardData = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
  recentTransactions: RecentTransaction[];
};

type DashboardResult =
  | { success: true; data: DashboardData }
  | { success: false; error: string };

export async function getDashboardData(): Promise<DashboardResult> {
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

    let incomeCents = 0;
    let expenseCents = 0;
    let transactionCount = 0;
    let offset = 0;

    const pageSize = 500;
    const recentTransactions: RecentTransaction[] = [];

    // Ambil bertahap agar total tidak hanya menghitung halaman pertama.
    while (true) {
      const { data, error } = await supabase
        .from("transactions")
        .select("id, title, type, amount, transaction_date")
        .eq("user_id", user.id)
        .order("transaction_date", { ascending: false })
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
        .range(offset, offset + pageSize - 1);

      if (error) {
        console.error("[getDashboardData]", error.message);

        return {
          success: false,
          error: "Gagal mengambil data dashboard. Coba lagi.",
        };
      }

      const rows = data ?? [];

      if (rows.length === 0) {
        break;
      }

      for (const row of rows) {
        const amount = Number(row.amount);

        if (
          !Number.isFinite(amount) ||
          amount <= 0 ||
          (row.type !== "income" && row.type !== "expense")
        ) {
          return {
            success: false,
            error: "Ada data transaksi yang tidak valid. Periksa data transaksi.",
          };
        }

        const amountCents = Math.round(amount * 100);

        if (row.type === "income") {
          incomeCents += amountCents;
        } else {
          expenseCents += amountCents;
        }

        if (
          !Number.isSafeInteger(incomeCents) ||
          !Number.isSafeInteger(expenseCents)
        ) {
          return {
            success: false,
            error: "Total transaksi terlalu besar untuk dihitung dengan aman.",
          };
        }

        if (recentTransactions.length < 5) {
          recentTransactions.push({
            id: row.id,
            title: row.title,
            type: row.type,
            amount,
            transaction_date: row.transaction_date,
          });
        }
      }

      transactionCount += rows.length;
      offset += rows.length;
    }

    return {
      success: true,
      data: {
        totalIncome: incomeCents / 100,
        totalExpense: expenseCents / 100,
        balance: (incomeCents - expenseCents) / 100,
        transactionCount,
        recentTransactions,
      },
    };
  } catch (error) {
    console.error("[getDashboardData]", error);

    return {
      success: false,
      error: "Dashboard belum bisa dimuat. Periksa koneksi dan coba lagi.",
    };
  }
}