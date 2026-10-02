import Stripe from "stripe";
import { NextResponse } from "next/server";
import { db } from "@/lib/supabase";
const gbp = (p: number) => `£${(p / 100).toFixed(2)}`;
export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const body = await req.text();
  let event: Stripe.Event;
  try { event = stripe.webhooks.constructEvent(body, req.headers.get("stripe-signature")!, process.env.STRIPE_WEBHOOK_SECRET!); }
  catch { return NextResponse.json({ error: "Bad signature" }, { status: 400 }); }
  if (event.type !== "checkout.session.completed") return NextResponse.json({ ok: true });
  const s = event.data.object as Stripe.Checkout.Session; const sb = db();
  const { data: existing } = await sb.from("orders").select("id").eq("stripe_session_id", s.id).maybeSingle();
  if (existing) return NextResponse.json({ ok: true });
  const ship = s.shipping_details; const email = s.customer_details?.email ?? "";
  const { data: order } = await sb.from("orders").insert({
    stripe_session_id: s.id, email, shipping: { name: ship?.name, phone: s.customer_details?.phone, address: ship?.address },
    subtotal_pence: s.amount_subtotal, shipping_pence: s.total_details?.amount_shipping ?? 0, discount_pence: s.total_details?.amount_discount ?? 0,
    total_pence: s.amount_total, gift_message: s.custom_fields?.find((f) => f.key === "gift_message")?.text?.value ?? null,
  }).select("id").single();
  const rows: string[] = [];
  for (const part of (s.metadata?.items ?? "").split(";").filter(Boolean)) {
    const [slug, size, q] = part.split("|"); const qty = +q;
    const { data: p } = await sb.from("products").select("id,name,price_pence").eq("slug", slug).maybeSingle();
    if (!p) continue;
    const { data: v } = await sb.from("variants").select("id,stock").eq("product_id", p.id).eq("size", size).maybeSingle();
    if (v) await sb.from("variants").update({ stock: Math.max(v.stock - qty, 0) }).eq("id", v.id);
    await sb.from("order_items").insert({ order_id: order?.id, variant_id: v?.id, name: p.name, size, qty, unit_pence: p.price_pence });
    rows.push(`<tr><td>${p.name} (${size}) x ${qty}</td><td align="right">${gbp(p.price_pence * qty)}</td></tr>`);
  }
  if (s.metadata?.code) { const { data: c } = await sb.from("discount_codes").select("uses").eq("code", s.metadata.code).maybeSingle(); if (c) await sb.from("discount_codes").update({ uses: c.uses + 1 }).eq("code", s.metadata.code); }
  if (process.env.RESEND_API_KEY && email) {
    await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({
      from: process.env.EMAIL_FROM || "Pretty little Daisy <onboarding@resend.dev>", to: email, subject: "Your Pretty little Daisy order is confirmed",
      html: `<div style="font-family:Georgia,serif;color:#5A4137;max-width:480px"><h2 style="color:#C26B77">Thank you for your order</h2><table width="100%">${rows.join("")}</table><p>Total paid: <b>${gbp(s.amount_total ?? 0)}</b></p><p>We will email you again when it ships.</p></div>` }) });
  }
  return NextResponse.json({ ok: true });
}
