"use server";

import { cookies } from "next/headers";

export async function saveTransactionFilter(formData: FormData) {
  const selectedType = formData.get("type");

  if (
    selectedType !== "all" &&
    selectedType !== "income" &&
    selectedType !== "expense"
  ) {
    return;
  }

  const cookieStore = await cookies();

  cookieStore.set("transaction_filter", selectedType, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}