"use client";
import Link from "next/link";
import { useCart } from "@/lib/cart";
export default function CartLink() {
  const n = useCart().lines.reduce((a, l) => a + l.qty, 0);
  return <Link href="/cart" className="hover:text-rose">Bag{n ? ` (${n})` : ""}</Link>;
}
