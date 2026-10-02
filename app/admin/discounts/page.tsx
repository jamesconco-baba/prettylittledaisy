import { revalidatePath } from "next/cache";
import { db } from "@/lib/supabase";
async function create(fd: FormData) {
  "use server";
  const pct = parseInt(String(fd.get("percent"))) || null; const amt = Math.round(parseFloat(String(fd.get("amount"))) * 100) || null;
  await db().from("discount_codes").insert({ code: String(fd.get("code")).toUpperCase().trim(), percent_off: pct, amount_off_pence: pct ? null : amt, max_uses: parseInt(String(fd.get("max"))) || null });
  revalidatePath("/admin/discounts");
}
async function toggle(fd: FormData) {
  "use server";
  await db().from("discount_codes").update({ active: fd.get("active") !== "true" }).eq("code", String(fd.get("code")));
  revalidatePath("/admin/discounts");
}
export default async function Discounts() {
  const { data } = await db().from("discount_codes").select("*").order("code");
  const inp = "rounded-full border border-taupe/40 px-4 py-2";
  return (
    <>
      <h1 className="font-display text-4xl text-taupe">Discount codes</h1>
      <form action={create} className="mt-6 flex flex-wrap gap-3 rounded-2xl bg-white p-5 shadow-sm">
        <input name="code" required placeholder="CODE" className={inp} /><input name="percent" type="number" placeholder="% off" className={`${inp} w-28`} />
        <input name="amount" type="number" step="0.01" placeholder="or £ off" className={`${inp} w-28`} /><input name="max" type="number" placeholder="Max uses" className={`${inp} w-28`} />
        <button className="rounded-full bg-rose px-5 py-2 text-white">Create code</button>
      </form>
      <ul className="mt-6 text-sm">{(data ?? []).map((d: any) => (
        <li key={d.code} className="flex items-center justify-between border-b border-petal/60 py-3">
          <span><b>{d.code}</b> · {d.percent_off ? `${d.percent_off}% off` : `£${(d.amount_off_pence / 100).toFixed(2)} off`} · used {d.uses}{d.max_uses ? ` of ${d.max_uses}` : ""}</span>
          <form action={toggle}><input type="hidden" name="code" value={d.code} /><input type="hidden" name="active" value={String(d.active)} /><button className="text-rose underline">{d.active ? "Disable" : "Enable"}</button></form>
        </li>))}</ul>
    </>
  );
}
