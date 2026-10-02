import Link from "next/link";
import { Product, gbp } from "@/lib/products";
export default function ProductCard({ p }: { p: Product }) {
  return (
    <Link href={`/shop/${p.slug}`} className="group block">
      <div className="flex aspect-[4/5] items-center justify-center rounded-t-[999px] rounded-b-xl transition-transform group-hover:-translate-y-1" style={{ background: p.tint }}>
        <span className="font-script text-5xl text-rose/70">Daisy</span>
      </div>
      <h3 className="mt-4 font-display text-xl">{p.name}</h3>
      <p className="text-sm text-cocoa/70">{p.collection} · {gbp(p.price)}</p>
    </Link>
  );
}
