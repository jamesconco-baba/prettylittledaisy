"use client";
import { createContext, useContext, useEffect, useState } from "react";
export type Line = { slug: string; name: string; price: number; size: string; qty: number; tint: string };
const Ctx = createContext<{ lines: Line[]; add: (l: Line) => void; remove: (slug: string, size: string) => void; clear: () => void }>({ lines: [], add() {}, remove() {}, clear() {} });
export const useCart = () => useContext(Ctx);
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  useEffect(() => { try { setLines(JSON.parse(localStorage.getItem("pld-cart") || "[]")); } catch {} }, []);
  const save = (n: Line[]) => { setLines(n); try { localStorage.setItem("pld-cart", JSON.stringify(n)); } catch {} };
  const add = (l: Line) => {
    const hit = lines.find((x) => x.slug === l.slug && x.size === l.size);
    save(hit ? lines.map((x) => (x === hit ? { ...x, qty: Math.min(x.qty + 1, 10) } : x)) : [...lines, l]);
  };
  const remove = (slug: string, size: string) => save(lines.filter((x) => !(x.slug === slug && x.size === size)));
  return <Ctx.Provider value={{ lines, add, remove, clear: () => save([]) }}>{children}</Ctx.Provider>;
}
