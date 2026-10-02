import Link from "next/link";
export const dynamic = "force-dynamic";
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <nav className="mb-8 flex gap-6 border-b border-petal pb-4 text-sm">
        {[["/admin", "Overview"], ["/admin/orders", "Orders"], ["/admin/products", "Products and stock"], ["/admin/discounts", "Discount codes"]].map(([h, t]) => <Link key={h} href={h} className="hover:text-rose">{t}</Link>)}
      </nav>
      {children}
    </div>
  );
}
