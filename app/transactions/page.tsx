import { cookies } from "next/headers";
import TransactionsClient from "./transactions-client";
import type { TransactionFilter } from "@/lib/types/transaction";

export default async function TransactionsPage() {
  const cookieStore = await cookies();
  const savedFilter = cookieStore.get("transaction_filter")?.value;
  const initialFilter: TransactionFilter =
    savedFilter === "income" || savedFilter === "expense"
      ? savedFilter
      : "all";

  return <TransactionsClient initialFilter={initialFilter} />;
}
