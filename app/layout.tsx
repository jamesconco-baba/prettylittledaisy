import type { Metadata } from "next";
import { Cormorant_Garamond, Jost, Allura } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/cart";
const display = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--f-display" });
const body = Jost({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--f-body" });
const script = Allura({ subsets: ["latin"], weight: "400", variable: "--f-script" });
export const metadata: Metadata = {
  title: "Pretty little Daisy | Princess dresses for little dreamers",
  description: "Handpicked princess dresses for girls aged 1 to 7. Designed in the UK.",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${display.variable} ${body.variable} ${script.variable}`}>
      <body><CartProvider><Header />{children}<Footer /></CartProvider></body>
    </html>
  );
}
