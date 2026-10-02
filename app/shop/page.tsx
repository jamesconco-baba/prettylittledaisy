import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/catalog";
export const revalidate = 60;
const guide = [["1-2Y", "80-92"], ["2-3Y", "92-98"], ["3-4Y", "98-104"], ["4-5Y", "104-110"], ["5-6Y", "110-116"], ["6-7Y", "116-122"]];
export default async function Shop() {
  const products = await getProducts();
  return (
    <main className="mx-auto max-w-6xl px-5 py-14">
      <h1 className="font-display text-5xl text-taupe">Shop dresses</h1>
      <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
        {products.map((p) => <ProductCard key={p.slug} p={p} />)}
      </div>
      <section id="size-guide" className="mt-24 max-w-md scroll-mt-24">
        <h2 className="font-display text-3xl">Size guide</h2>
        <table className="mt-4 w-full text-left text-sm">
          <thead><tr className="border-b border-petal"><th className="py-2">Age</th><th>Height (cm)</th></tr></thead>
          <tbody>{guide.map(([a, h]) => <tr key={a} className="border-b border-petal/50"><td className="py-2">{a}</td><td>{h}</td></tr>)}</tbody>
        </table>
        <p className="mt-3 text-xs text-cocoa/60">Placeholder measurements. Replace with final size chart.</p>
      </section>
    </main>
  );
}
