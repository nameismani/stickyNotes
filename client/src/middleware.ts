import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  const isAuthenticated = !!token;

  //   console.log(pathname, "path name in middelware");

  if (!token && pathname === "/home") {
    return NextResponse.redirect(new URL("/auth", req.nextUrl));
  }

  if (token && (pathname === "/" || pathname === "/auth")) {
    return NextResponse.redirect(new URL("/home", req.nextUrl));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/", "/auth", "/home/:path*"],
};

export default middleware;
