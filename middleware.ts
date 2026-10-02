import { NextRequest, NextResponse } from "next/server";
export function middleware(req: NextRequest) {
  const pw = process.env.ADMIN_PASSWORD; const h = req.headers.get("authorization");
  if (pw && h?.startsWith("Basic ")) {
    const s = atob(h.slice(6)); const i = s.indexOf(":");
    if (s.slice(0, i) === (process.env.ADMIN_USER || "admin") && s.slice(i + 1) === pw) return NextResponse.next();
  }
  return new NextResponse("Authentication required", { status: 401, headers: { "WWW-Authenticate": 'Basic realm="Pretty little Daisy admin"' } });
}
export const config = { matcher: ["/admin/:path*"] };
