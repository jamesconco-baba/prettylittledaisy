import { notFound } from "next/navigation";
import SizePicker from "@/components/SizePicker";
import { gbp } from "@/lib/products";
import { getProducts } from "@/lib/catalog";
export const revalidate = 60;
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = (await getProducts()).find((x) => x.slug === slug);
  if (!p) notFound();
  return (
    <main className="mx-auto grid max-w-6xl gap-12 px-5 py-14 md:grid-cols-2">
      <div className="flex aspect-[4/5] items-center justify-center rounded-t-[999px] rounded-b-2xl" style={{ background: p.tint }}>
        <span className="font-script text-7xl text-rose/70">Daisy</span>
      </div>
      <div className="self-center">
        <p className="text-sm text-taupe">{p.collection}</p>
        <h1 className="mt-1 font-display text-5xl">{p.name}</h1>
        <p className="mt-3 text-2xl">{gbp(p.price)}</p>
        <p className="mt-5 max-w-md text-cocoa/80">{p.blurb}</p>
        <div className="mt-8 max-w-md"><SizePicker p={p} price={gbp(p.price)} /></div>
        <p className="mt-6 text-sm text-cocoa/60">Free UK delivery over £60. Easy 30 day returns.</p>
      </div>
    </main>
  );
}
