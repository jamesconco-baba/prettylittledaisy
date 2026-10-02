"use client";
import { useState } from "react";
import { SIZES, Product } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useRouter } from "next/navigation";
export default function SizePicker({ p, price }: { p: Product; price: string }) {
  const stock = p.stock; const { add } = useCart(); const router = useRouter();
  const [size, setSize] = useState<string | null>(null);
  const left = size ? stock[size] : null;
  return (
    <div>
      <p className="mb-3 text-sm font-medium">Select size</p>
      <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Size">
        {SIZES.map((s) => (
          <button key={s} role="radio" aria-checked={size === s} disabled={(stock[s] ?? 0) === 0} onClick={() => setSize(s)}
            className={`rounded-full border px-4 py-3 text-sm transition ${size === s ? "border-rose bg-rose text-white" : "border-taupe/40 hover:border-rose"} disabled:cursor-not-allowed disabled:line-through disabled:opacity-40`}>
            {s}
          </button>
        ))}
      </div>
      <p className="mt-3 h-5 text-sm text-rose">{left !== null && left <= 3 ? `Only ${left} left in ${size}` : ""}</p>
      <button disabled={!size} onClick={() => { add({ slug: p.slug, name: p.name, price: p.price, size: size!, qty: 1, tint: p.tint }); router.push("/cart"); }} className="mt-4 w-full rounded-full bg-rose py-4 text-white transition hover:bg-cocoa disabled:bg-taupe/40">
        {size ? `Add to bag, ${price}` : "Choose a size"}
      </button>
    </div>
  );
}
