import { products as placeholders, Product } from "./products";
import { db, hasDb } from "./supabase";
const tints = ["#F9E4E1", "#F3CFCB", "#FBEFD2", "#FFF3EE"];
export async function getProducts(): Promise<Product[]> {
  if (!hasDb()) return placeholders;
  const { data } = await db().from("products").select("slug,name,description,collection,price_pence,variants(size,stock)").eq("active", true).order("created_at");
  if (!data?.length) return placeholders;
  return data.map((r: any, i: number) => ({
    slug: r.slug, name: r.name, price: r.price_pence / 100, collection: r.collection ?? "Dresses", blurb: r.description ?? "", tint: tints[i % 4],
    stock: Object.fromEntries((r.variants ?? []).map((v: any) => [v.size, v.stock])),
  }));
}
