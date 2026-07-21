import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "GENESIS — Product architecture before production",
  description: "Turn a vague product idea into a risk-aware, dependency-ordered implementation blueprint.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
