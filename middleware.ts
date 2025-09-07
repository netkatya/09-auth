import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { nextServer } from "./lib/api/api";

const PUBLIC_ROUTES = ["/sign-in", "/sign-up"];
const PRIVATE_ROUTES = ["/profile", "/notes"];

export async function middleware(req: NextRequest) {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const { pathname } = req.nextUrl;

  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
  const isPrivate = PRIVATE_ROUTES.some((route) => pathname.startsWith(route));

  if (!accessToken && refreshToken) {
    try {
      const { data, headers } = await nextServer.post("/auth/refresh", {
        refreshToken,
      });

      const res = NextResponse.next();

      if (headers["set-cookie"]) {
        headers["set-cookie"].forEach((cookie: string) => {
          res.headers.append("set-cookie", cookie);
        });
      }

      accessToken = data?.accessToken;
      return res;
    } catch {
      const res = NextResponse.redirect(new URL("/sign-in", req.url));
      res.cookies.delete("accessToken");
      res.cookies.delete("refreshToken");
      return res;
    }
  }

  if (!accessToken && isPrivate) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (accessToken && isPublic) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/sign-in", "/sign-up", "/profile/:path*", "/notes/:path*"],
};
