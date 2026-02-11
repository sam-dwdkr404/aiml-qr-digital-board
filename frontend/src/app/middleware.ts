import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname;

  // Allow home page and admin login without token
  if (path === "/" || path.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Allow other public pages
  const publicPages = ["/login", "/authorities", "/feedback", "/internals", "/labs", "/timetable", "/subjects"];
  if (publicPages.some((page) => path.startsWith(page))) {
    return NextResponse.next();
  }

  // Block everything else if no token
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
