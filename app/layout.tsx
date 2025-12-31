"use client";

import "./globals.css";
import { ReactNode } from "react";
import { Inter, Source_Sans_3 } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap"
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sourceSans.variable}`}>
      <body>
        <AnimatePresence mode="wait">
          <motion.main
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </body>
    </html>
  );
}
