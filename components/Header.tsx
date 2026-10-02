import Link from "next/link";
import CartLink from "./CartLink";
export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-petal/60 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" aria-label="Pretty little Daisy home" className="leading-none">
          <span className="font-display text-2xl text-taupe">Pretty little </span>
          <span className="font-script text-3xl text-rose">Daisy</span>
        </Link>
        <nav className="flex gap-6 text-sm text-cocoa/80">
          <Link href="/shop" className="hover:text-rose">Shop</Link>
          <Link href="/shop#size-guide" className="hover:text-rose">Size guide</Link>
          <CartLink />
        </nav>
      </div>
    </header>
  );
}
