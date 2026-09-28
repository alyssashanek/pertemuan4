"use client";

import type { BudgetStatus } from "@/lib/budgetApi";

type BudgetSummaryProps = {
  budget: number | null;
  totalExpense: number;
  remaining: number | null;
  percentage: number | null;
  status: BudgetStatus;
};

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

const STATUS_CONFIG: Record<
  BudgetStatus,
  {
    label: string;
    description: string;
    className: string;
  }
> = {
  aman: {
    label: "Aman",
    description:
      "Pengeluaran masih kurang dari 80% budget.",
    className:
      "border-green-200 bg-green-50 text-green-700",
  },

  hampir_habis: {
    label: "Hampir Habis",
    description:
      "Pengeluaran sudah mencapai 80% tetapi belum 100% budget.",
    className:
      "border-yellow-200 bg-yellow-50 text-yellow-700",
  },

  terlampaui: {
    label: "Terlampaui",
    description:
      "Pengeluaran sudah mencapai atau melebihi budget.",
    className:
      "border-red-200 bg-red-50 text-red-700",
  },

  belum_ditetapkan: {
    label: "Belum Ditetapkan",
    description:
      "Belum ada budget yang ditetapkan untuk bulan ini.",
    className:
      "border-slate-200 bg-slate-50 text-slate-700",
  },
};

export default function BudgetSummary({
  budget,
  totalExpense,
  remaining,
  percentage,
  status,
}: BudgetSummaryProps) {
  const config = STATUS_CONFIG[status];

  const progress =
    percentage === null
      ? 0
      : Math.min(Math.max(percentage, 0), 100);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">
          Ringkasan Budget
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Ringkasan pengeluaran berdasarkan bulan yang dipilih.
        </p>
      </div>

      {status === "belum_ditetapkan" ? (
        <div>
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
            <p className="font-semibold text-slate-900">
              Budget belum ditetapkan
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Tetapkan budget untuk bulan ini agar
              persentase penggunaan dan sisa budget dapat
              dihitung.
            </p>
          </div>

          <div className="mt-5 rounded-xl bg-red-50 p-4">
            <p className="text-xs font-medium text-red-600">
              Total Pengeluaran
            </p>

            <p className="mt-2 text-xl font-bold text-red-700">
              {formatRupiah(totalExpense)}
            </p>
          </div>

          <div
            className={`mt-5 rounded-xl border px-4 py-4 ${config.className}`}
          >
            <p className="font-bold">
              Status: {config.label}
            </p>

            <p className="mt-1 text-sm">
              {config.description}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-500">
                Budget
              </p>

              <p className="mt-2 break-words text-lg font-bold text-slate-900">
                {formatRupiah(budget ?? 0)}
              </p>
            </div>

            <div className="rounded-xl bg-red-50 p-4">
              <p className="text-xs font-medium text-red-600">
                Pengeluaran
              </p>

              <p className="mt-2 break-words text-lg font-bold text-red-700">
                {formatRupiah(totalExpense)}
              </p>
            </div>

            <div className="rounded-xl bg-green-50 p-4">
              <p className="text-xs font-medium text-green-600">
                Sisa Budget
              </p>

              <p
                className={`mt-2 break-words text-lg font-bold ${
                  (remaining ?? 0) < 0
                    ? "text-red-700"
                    : "text-green-700"
                }`}
              >
                {formatRupiah(remaining ?? 0)}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-700">
                Pemakaian Budget
              </p>

              <p className="text-sm font-bold text-slate-900">
                {(percentage ?? 0).toFixed(1)}%
              </p>
            </div>

            <div
              className="h-3 overflow-hidden rounded-full bg-slate-100"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percentage ?? 0}
              aria-label="Persentase pemakaian budget"
            >
              <div
                className="h-full rounded-full bg-slate-900 transition-all duration-300"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            {percentage !== null && percentage >= 100 && (
              <p className="mt-2 text-xs text-red-600">
                Pengeluaran telah melebihi budget.
              </p>
            )}
          </div>

          <div
            className={`mt-6 rounded-xl border px-4 py-4 ${config.className}`}
          >
            <p className="font-bold">
              Status: {config.label}
            </p>

            <p className="mt-1 text-sm">
              {config.description}
            </p>
          </div>
        </>
      )}
    </section>
  );
}