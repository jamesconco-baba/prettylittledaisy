export const SIZES = ["1-2Y", "2-3Y", "3-4Y", "4-5Y", "5-6Y", "6-7Y"] as const;
export type Product = { slug: string; name: string; price: number; collection: string; blurb: string; tint: string; stock: Record<string, number> };
const stock = (n: number) => Object.fromEntries(SIZES.map((s, i) => [s, i === 5 ? 0 : n]));
export const products: Product[] = [
  { slug: "ballerina-tulle-dress", name: "Ballerina Tulle Dress", price: 54, collection: "Occasion", blurb: "Layered tulle skirt with a satin waist bow and ribbon ties at the shoulder.", tint: "#F9E4E1", stock: stock(6) },
  { slug: "blossom-party-dress", name: "Blossom Party Dress", price: 48, collection: "Party", blurb: "Soft rose dress with a gathered skirt, made for birthdays and twirling.", tint: "#F3CFCB", stock: stock(4) },
  { slug: "duckling-day-dress", name: "Duckling Day Dress", price: 36, collection: "Everyday", blurb: "Easy cotton dress in butter yellow with a pink bow detail.", tint: "#FBEFD2", stock: stock(8) },
  { slug: "princess-occasion-gown", name: "Princess Occasion Gown", price: 68, collection: "Occasion", blurb: "Floor-skimming ivory gown with a lined bodice and pearl buttons.", tint: "#FFF3EE", stock: stock(3) },
];
export const gbp = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 0 }).format(n);
