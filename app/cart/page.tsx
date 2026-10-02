"use client";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { gbp } from "@/lib/products";
import { shippingFor } from "@/lib/shipping";
export default function Cart() {
  const { lines, remove } = useCart();
  const [code, setCode] = useState(""); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const sub = lines.reduce((a, l) => a + l.price * 100 * l.qty, 0);
  const ship = shippingFor(sub);
  async function checkout() {
    setBusy(true); setErr("");
    const r = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: lines.map((l) => ({ slug: l.slug, size: l.size, qty: l.qty })), code }) });
    const d = await r.json();
    if (d.url) window.location.href = d.url; else { setErr(d.error || "Checkout failed. Please try again."); setBusy(false); }
  }
  if (!lines.length) return <main className="mx-auto max-w-2xl px-5 py-24 text-center"><h1 className="font-display text-4xl">Your bag is empty</h1><Link href="/shop" className="mt-6 inline-block rounded-full bg-rose px-8 py-4 text-white">Shop dresses</Link></main>;
  return (
    <main className="mx-auto max-w-2xl px-5 py-14">
      <h1 className="font-display text-5xl text-taupe">Your bag</h1>
      <ul className="mt-8 divide-y divide-petal">
        {lines.map((l) => (
          <li key={l.slug + l.size} className="flex items-center gap-4 py-4">
            <div className="h-20 w-16 rounded-t-full rounded-b-md" style={{ background: l.tint }} />
            <div className="flex-1"><p className="font-display text-xl">{l.name}</p><p className="text-sm text-cocoa/70">Size {l.size} · Qty {l.qty}</p></div>
            <p>{gbp(l.price * l.qty)}</p>
            <button onClick={() => remove(l.slug, l.size)} className="text-sm text-rose underline">Remove</button>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex gap-3">
        <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Discount code" aria-label="Discount code" className="flex-1 rounded-full border border-taupe/40 bg-white px-5 py-3" />
      </div>
      <dl className="mt-6 space-y-2 text-sm">
        <div className="flex justify-between"><dt>Subtotal</dt><dd>{gbp(sub / 100)}</dd></div>
        <div className="flex justify-between"><dt>UK delivery</dt><dd>{ship ? gbp(ship / 100) : "Free"}</dd></div>
      </dl>
      {err && <p role="alert" className="mt-4 text-sm text-rose">{err}</p>}
      <button onClick={checkout} disabled={busy} className="mt-6 w-full rounded-full bg-rose py-4 text-white transition hover:bg-cocoa disabled:opacity-50">{busy ? "Redirecting to secure payment" : "Pay securely with Stripe"}</button>
      <p className="mt-3 text-center text-xs text-cocoa/60">Discounts are applied at payment. Delivery to the UK only.</p>
    </main>
  );
}
