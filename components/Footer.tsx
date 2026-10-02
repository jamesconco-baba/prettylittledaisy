export default function Footer() {
  return (
    <footer className="mt-24 bg-blush">
      <div className="mx-auto max-w-6xl px-5 py-12 text-center">
        <p className="font-script text-4xl text-rose">Thank you for being part of her story</p>
        <p className="mt-4 text-sm text-cocoa/70">Free UK delivery over £60. Easy 30 day returns.</p>
        <p className="mt-6 text-xs text-cocoa/50">© {new Date().getFullYear()} Pretty little Daisy. All rights reserved.</p>
      </div>
    </footer>
  );
}
