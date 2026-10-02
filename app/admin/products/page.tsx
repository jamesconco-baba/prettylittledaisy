import { revalidatePath } from "next/cache";
import { db } from "@/lib/supabase";
import { SIZES } from "@/lib/products";
async function create(fd: FormData) {
  "use server";
  const sb = db();
  const { data: p } = await sb.from("products").insert({ name: String(fd.get("name")), slug: String(fd.get("slug")).toLowerCase().replace(/[^a-z0-9]+/g, "-"), collection: String(fd.get("collection")), description: String(fd.get("description")), price_pence: Math.round(parseFloat(String(fd.get("price"))) * 100) }).select("id").single();
  if (p) await sb.from("variants").insert(SIZES.map((size) => ({ product_id: p.id, size, stock: parseInt(String(fd.get("stock"))) || 0 })));
  revalidatePath("/admin/products");
}
async function save(fd: FormData) {
  "use server";
  const sb = db(); const id = String(fd.get("id"));
  await sb.from("products").update({ price_pence: Math.round(parseFloat(String(fd.get("price"))) * 100), active: fd.get("active") === "on" }).eq("id", id);
  for (const [k, v] of fd.entries()) if (k.startsWith("v_")) await sb.from("variants").update({ stock: Math.max(parseInt(String(v)) || 0, 0) }).eq("id", k.slice(2));
  revalidatePath("/admin/products"); revalidatePath("/shop");
}
export default async function Products() {
  const { data } = await db().from("products").select("*, variants(id,size,stock)").order("created_at");
  const inp = "rounded-full border border-taupe/40 px-4 py-2";
  return (
    <>
      <h1 className="font-display text-4xl text-taupe">Products and stock</h1>
      <form action={create} className="mt-6 grid gap-3 rounded-2xl bg-white p-5 shadow-sm md:grid-cols-3">
        <input name="name" required placeholder="Name" className={inp} /><input name="slug" required placeholder="url-slug" className={inp} /><input name="collection" placeholder="Collection" className={inp} />
        <input name="price" required type="number" step="0.01" placeholder="Price in £" className={inp} /><input name="stock" type="number" placeholder="Stock per size" className={inp} /><input name="description" placeholder="Description" className={inp} />
        <button className="rounded-full bg-rose px-5 py-2 text-white md:col-span-3">Add product with all sizes</button>
      </form>
      <div className="mt-8 space-y-4">
        {(data ?? []).map((p: any) => (
          <form key={p.id} action={save} className="rounded-2xl bg-white p-5 shadow-sm">
            <input type="hidden" name="id" value={p.id} />
            <div className="flex flex-wrap items-center gap-4"><b className="font-display text-xl">{p.name}</b>
              <label className="text-sm">£ <input name="price" defaultValue={(p.price_pence / 100).toFixed(2)} className="w-20 rounded-full border border-taupe/40 px-3 py-1" /></label>
              <label className="text-sm"><input type="checkbox" name="active" defaultChecked={p.active} /> Visible in shop</label></div>
            <div className="mt-3 grid grid-cols-3 gap-3 md:grid-cols-6">
              {SIZES.map((s) => { const v = p.variants.find((x: any) => x.size === s); return v ? <label key={s} className="text-sm">{s}<input name={`v_${v.id}`} type="number" min="0" defaultValue={v.stock} className="mt-1 w-full rounded-full border border-taupe/40 px-3 py-1" /></label> : null; })}
            </div>
            <button className="mt-4 rounded-full bg-rose px-5 py-2 text-white">Save changes</button>
          </form>
        ))}
      </div>
    </>
  );
}
