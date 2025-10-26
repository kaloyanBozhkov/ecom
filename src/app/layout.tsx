import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/molecules";
import { Footer, CartDrawer } from "@/components/organisms";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SafeHeat™ Propane Garage Heater - Powerful, Portable & Safe for Indoor Use",
  description: "Built for garages, workshops & basements — instant heat without smoke or smell. 9,000–18,000 BTU output with auto shut-off and oxygen sensor.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
