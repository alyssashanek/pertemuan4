import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

// Red Broadcast design system — Roboto sebagai font utama (semua elemen UI)
const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Saldoo — Expense Tracker Mahasiswa",
  description:
    "Kelola keuangan pribadi dengan mudah. Catat pemasukan dan pengeluaran, pantau saldo, dan buat keputusan finansial yang lebih baik.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${roboto.variable} h-full`}
    >
      <body className="min-h-full flex flex-col font-[var(--font-roboto)]">
        {children}
      </body>
    </html>
  );
}
