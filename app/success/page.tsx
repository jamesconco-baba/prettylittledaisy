import Link from "next/link";
import ClearCart from "@/components/ClearCart";
export default function Success() {
  return (
    <main className="mx-auto max-w-xl px-5 py-24 text-center">
      <ClearCart />
      <p className="font-script text-5xl text-rose">Thank you</p>
      <h1 className="mt-4 font-display text-4xl">Your order is confirmed</h1>
      <p className="mt-4 text-cocoa/80">A confirmation email is on its way. We will email again when your parcel ships.</p>
      <Link href="/shop" className="mt-8 inline-block rounded-full bg-rose px-8 py-4 text-white">Keep shopping</Link>
    </main>
  );
}
