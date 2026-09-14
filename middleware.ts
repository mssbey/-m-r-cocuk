import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, isSessionValid } from "@/lib/admin/auth";

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

const PUBLIC_PATHS = new Set(["/admin/login", "/api/admin/login"]);

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const normalized = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  if (PUBLIC_PATHS.has(normalized)) return NextResponse.next();

  const cookie = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const valid = await isSessionValid(cookie);
  if (valid) return NextResponse.next();

  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", req.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}
