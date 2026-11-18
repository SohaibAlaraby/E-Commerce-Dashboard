import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "cn";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata:Metadata = {
  title: "SalesVista",
  description:"High-performance dashboard built with Next.js & Tailwind CSS",
  icons:{
    icon: '/logo.png',
  }

};

export default function RootLayout({ children }: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body 
      className="min-h-dvh" //flex flex-col
      suppressHydrationWarning
      >{children}</body>
    </html>
  );
}
