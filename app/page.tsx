import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/catalog";
export const revalidate = 60;
export default async function Home() {
  const products = await getProducts();
  return (
    <main>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-2 md:py-20">
        <div>
          <h1 className="font-display text-5xl leading-[1.05] text-taupe md:text-7xl">Little dresses, <span className="font-script text-rose">big dreams</span></h1>
          <p className="mt-6 max-w-md text-lg text-cocoa/80">Princess dresses for little dreamers, sizes 1 to 7 years. Soft fabrics, careful finishing, made to be twirled in.</p>
          <Link href="/shop" className="mt-8 inline-block rounded-full bg-rose px-8 py-4 text-white transition hover:bg-cocoa">Shop dresses</Link>
        </div>
        <div className="overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_-30px_rgba(194,107,119,.5)]">
          <Image src="/brand.png" alt="Pretty little Daisy: a girl in a pink tulle dress followed by four ducklings" width={1254} height={1254} priority />
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5">
        <h2 className="font-display text-3xl">New arrivals</h2>
        <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
          {products.map((p) => <ProductCard key={p.slug} p={p} />)}
        </div>
      </section>
    </main>
  );
}
