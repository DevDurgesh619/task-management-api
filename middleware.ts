import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow auth routes
  if (pathname.startsWith("/api/v1/auth")) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get("accessToken")?.value;

  if (!accessToken) {
    if (pathname.startsWith("/api/v1")) {
       console.log("middleware sending 401 ")
      return new NextResponse("Unauthorized", { status: 401 });
    }
       console.log("middleware redirectig ")
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }
 console.log("middleware passed ")
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/user-dashboard/:path*",
    "/admin-dashboard/:path*",
    "/api/v1/:path*"
  ],
};
