import type { Metadata } from "next";
import "./globals.css";

export const metadata:Metadata = {
  title: "E-Commerce Dashboard",
  description:"High-performance dashboard built with Next.js & Tailwind CSS"
};

export default function RootLayout({ children }: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
      suppressHydrationWarning
    >
      <body 
      className="min-h-full flex flex-col"
      suppressHydrationWarning
      >{children}</body>
    </html>
  );
}
