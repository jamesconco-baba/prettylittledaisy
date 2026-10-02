import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getProducts } from "@/lib/catalog";
import { db, hasDb } from "@/lib/supabase";
import { shippingFor } from "@/lib/shipping";
export async function POST(req: Request) {
  const { items, code } = await req.json();
  if (!Array.isArray(items) || !items.length) return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });
  const catalog = await getProducts();
  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = []; let sub = 0;
  for (const i of items) {
    const p = catalog.find((x) => x.slug === i.slug); const qty = Math.min(Math.max(+i.qty || 1, 1), 10);
    if (!p || (p.stock[i.size] ?? 0) < qty) return NextResponse.json({ error: `${p?.name ?? "An item"} in size ${i.size} is no longer available.` }, { status: 400 });
    sub += Math.round(p.price * 100) * qty;
    line_items.push({ quantity: qty, price_data: { currency: "gbp", unit_amount: Math.round(p.price * 100), product_data: { name: `${p.name} (${i.size})` } } });
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined;
  if (code) {
    if (!hasDb()) return NextResponse.json({ error: "Discount codes are not available yet." }, { status: 400 });
    const { data: d } = await db().from("discount_codes").select("*").eq("code", code).eq("active", true).maybeSingle();
    const valid = d && (!d.expires_at || new Date(d.expires_at) > new Date()) && (d.max_uses == null || d.uses < d.max_uses);
    if (!valid) return NextResponse.json({ error: "That discount code is not valid." }, { status: 400 });
    const coupon = await stripe.coupons.create(d.percent_off ? { percent_off: d.percent_off, duration: "once" } : { amount_off: d.amount_off_pence, currency: "gbp", duration: "once" });
    discounts = [{ coupon: coupon.id }];
  }
  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
  const session = await stripe.checkout.sessions.create({
    mode: "payment", line_items, discounts, currency: "gbp",
    shipping_address_collection: { allowed_countries: ["GB"] },
    shipping_options: [{ shipping_rate_data: { type: "fixed_amount", display_name: "UK delivery", fixed_amount: { amount: shippingFor(sub), currency: "gbp" } } }],
    phone_number_collection: { enabled: true },
    custom_fields: [{ key: "gift_message", label: { type: "custom", custom: "Gift message (optional)" }, type: "text", optional: true, text: { maximum_length: 150 } }],
    metadata: { items: items.map((i: any) => `${i.slug}|${i.size}|${Math.min(Math.max(+i.qty || 1, 1), 10)}`).join(";").slice(0, 490), code: code || "" },
    success_url: `${origin}/success`, cancel_url: `${origin}/cart`,
  });
  return NextResponse.json({ url: session.url });
}
