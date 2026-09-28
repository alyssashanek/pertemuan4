import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function isValidMonth(month: string) {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(month);
}

function monthToDate(month: string) {
  return `${month}-01`;
}

function calculateStatus(
  budget: number | null,
  totalExpense: number
) {
  if (budget === null) {
    return {
      budget: null,
      totalExpense,
      remaining: null,
      percentage: null,
      status: "belum_ditetapkan" as const,
    };
  }

  const remaining = budget - totalExpense;

  const percentage =
    budget > 0
      ? (totalExpense / budget) * 100
      : 0;

  let status:
    | "aman"
    | "hampir_habis"
    | "terlampaui";

  if (percentage < 80) {
    status = "aman";
  } else if (percentage < 100) {
    status = "hampir_habis";
  } else {
    status = "terlampaui";
  }

  return {
    budget,
    totalExpense,
    remaining,
    percentage,
    status,
  };
}

function getMonthRange(month: string) {
  const [yearText, monthText] = month.split("-");

  const year = Number(yearText);
  const monthNumber = Number(monthText);

  const firstDay = `${yearText}-${monthText}-01`;

  const lastDayDate = new Date(
    year,
    monthNumber,
    0
  );

  const lastDay = `${lastDayDate.getFullYear()}-${String(
    lastDayDate.getMonth() + 1
  ).padStart(2, "0")}-${String(
    lastDayDate.getDate()
  ).padStart(2, "0")}`;

  return {
    firstDay,
    lastDay,
  };
}

export async function GET(request: NextRequest) {
  try {
    const supabase =
      await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const month =
      request.nextUrl.searchParams.get("month");

    if (!month || !isValidMonth(month)) {
      return NextResponse.json(
        {
          error:
            "Bulan wajib diisi dengan format YYYY-MM.",
        },
        { status: 400 }
      );
    }

    const budgetDate = monthToDate(month);
    const { firstDay, lastDay } =
      getMonthRange(month);

    const { data: budget, error: budgetError } =
      await supabase
        .from("monthly_budgets")
        .select("id, budget_month, amount")
        .eq("user_id", user.id)
        .eq("budget_month", budgetDate)
        .maybeSingle();

    if (budgetError) {
      return NextResponse.json(
        { error: budgetError.message },
        { status: 500 }
      );
    }

    const {
      data: expenses,
      error: expenseError,
    } = await supabase
      .from("transactions")
      .select("amount")
      .eq("user_id", user.id)
      .eq("type", "expense")
      .gte("transaction_date", firstDay)
      .lte("transaction_date", lastDay);

    if (expenseError) {
      return NextResponse.json(
        { error: expenseError.message },
        { status: 500 }
      );
    }

    const totalExpense =
      (expenses ?? []).reduce(
        (total, transaction) =>
          total + Number(transaction.amount),
        0
      );

    const summary = calculateStatus(
      budget ? Number(budget.amount) : null,
      totalExpense
    );

    return NextResponse.json({
      month,
      ...summary,
    });
  } catch (error) {
    console.error("GET /api/budget error:", error);

    return NextResponse.json(
      {
        error:
          "Terjadi kesalahan pada server.",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const supabase =
      await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const month = body?.month;
    const amount = Number(body?.amount);

    if (
      typeof month !== "string" ||
      !isValidMonth(month)
    ) {
      return NextResponse.json(
        {
          error:
            "Bulan wajib diisi dengan format YYYY-MM.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Nominal budget harus lebih dari 0.",
        },
        { status: 400 }
      );
    }

    const budgetDate = monthToDate(month);

    const {
      data: budget,
      error: budgetError,
    } = await supabase
      .from("monthly_budgets")
      .upsert(
        {
          user_id: user.id,
          budget_month: budgetDate,
          amount,
        },
        {
          onConflict:
            "user_id,budget_month",
        }
      )
      .select()
      .single();

    if (budgetError) {
      return NextResponse.json(
        { error: budgetError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message:
        "Budget berhasil disimpan.",
      budget,
    });
  } catch (error) {
    console.error("POST /api/budget error:", error);

    return NextResponse.json(
      {
        error:
          "Terjadi kesalahan pada server.",
      },
      { status: 500 }
    );
  }
}