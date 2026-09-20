import type { Metadata } from "next";
import "./globals.css";


export default function RootLayout({ children }: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      title="E-Commerce Dashboard"
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
