import { revalidatePath } from "next/cache";
import { db } from "@/lib/supabase";
import { gbp } from "@/lib/products";
async function update(fd: FormData) {
  "use server";
  const id = String(fd.get("id")); const status = String(fd.get("status")); const tracking = String(fd.get("tracking") || "") || null;
  const sb = db(); const { data: o } = await sb.from("orders").select("email,status").eq("id", id).single();
  await sb.from("orders").update({ status, tracking_number: tracking }).eq("id", id);
  if (status === "shipped" && o?.status !== "shipped" && process.env.RESEND_API_KEY && o?.email) {
    await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: process.env.EMAIL_FROM || "Pretty little Daisy <onboarding@resend.dev>", to: o.email, subject: "Your Pretty little Daisy order has shipped", html: `<p style="font-family:Georgia,serif;color:#5A4137">Your order is on its way.${tracking ? ` Tracking number: <b>${tracking}</b>.` : ""}</p>` }) });
  }
  revalidatePath("/admin/orders");
}
export default async function Orders() {
  const { data } = await db().from("orders").select("*, order_items(name,size,qty)").order("created_at", { ascending: false }).limit(100);
  return (
    <>
      <h1 className="font-display text-4xl text-taupe">Orders</h1>
      <div className="mt-6 space-y-4">
        {(data ?? []).map((o: any) => (
          <form key={o.id} action={update} className="rounded-2xl bg-white p-5 shadow-sm">
            <input type="hidden" name="id" value={o.id} />
            <div className="flex flex-wrap justify-between gap-2 text-sm"><b>{o.shipping?.name} · {o.email}</b><span>{new Date(o.created_at).toLocaleDateString("en-GB")} · {gbp((o.total_pence ?? 0) / 100)}</span></div>
            <p className="mt-2 text-sm text-cocoa/70">{o.order_items?.map((i: any) => `${i.name} (${i.size}) x ${i.qty}`).join(", ")}</p>
            <p className="mt-1 text-sm text-cocoa/70">{[o.shipping?.address?.line1, o.shipping?.address?.line2, o.shipping?.address?.city, o.shipping?.address?.postal_code].filter(Boolean).join(", ")}</p>
            {o.gift_message && <p className="mt-1 text-sm">Gift message: {o.gift_message}</p>}
            <div className="mt-3 flex flex-wrap gap-3">
              <select name="status" defaultValue={o.status} className="rounded-full border border-taupe/40 px-4 py-2">{["paid", "packed", "shipped", "delivered", "refunded"].map((s) => <option key={s}>{s}</option>)}</select>
              <input name="tracking" defaultValue={o.tracking_number ?? ""} placeholder="Tracking number" className="rounded-full border border-taupe/40 px-4 py-2" />
              <button className="rounded-full bg-rose px-5 py-2 text-white">Save</button>
            </div>
          </form>
        ))}
        {!data?.length && <p>No orders yet.</p>}
      </div>
    </>
  );
}
