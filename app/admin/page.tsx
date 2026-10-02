import { db } from "@/lib/supabase";
import { gbp } from "@/lib/products";
export default async function Overview() {
  const sb = db();
  const { data: orders } = await sb.from("orders").select("total_pence,status,created_at");
  const { data: low } = await sb.from("variants").select("size,stock,products(name)").lte("stock", 2).order("stock");
  const paid = (orders ?? []).filter((o) => o.status !== "refunded");
  const week = paid.filter((o) => Date.now() - new Date(o.created_at).getTime() < 7 * 864e5);
  const stat = (l: string, v: string) => <div className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm text-cocoa/60">{l}</p><p className="mt-1 font-display text-4xl">{v}</p></div>;
  return (
    <>
      <h1 className="font-display text-4xl text-taupe">Overview</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stat("Total revenue", gbp(paid.reduce((a, o) => a + (o.total_pence ?? 0), 0) / 100))}
        {stat("Orders", String(paid.length))}
        {stat("Last 7 days", gbp(week.reduce((a, o) => a + (o.total_pence ?? 0), 0) / 100))}
        {stat("To pack or ship", String(paid.filter((o) => o.status === "paid" || o.status === "packed").length))}
      </div>
      <h2 className="mt-10 font-display text-2xl">Low stock (2 or fewer)</h2>
      <ul className="mt-3 text-sm">{(low ?? []).length ? (low as any[]).map((v, i) => <li key={i} className="border-b border-petal/60 py-2">{v.products?.name} · {v.size} · {v.stock} left</li>) : <li>All sizes are well stocked.</li>}</ul>
    </>
  );
}
