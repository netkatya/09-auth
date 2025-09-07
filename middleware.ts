import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { checkSession } from "./lib/api/serverApi";

const PUBLIC_ROUTES = ["/sign-in", "/sign-up"];
const PRIVATE_ROUTES = ["/profile", "/notes"];

export async function middleware(req: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const { pathname } = req.nextUrl;

  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
  const isPrivate = PRIVATE_ROUTES.some((route) => pathname.startsWith(route));

  const sessionValid = !!accessToken;
  if (!accessToken && refreshToken) {
    try {
      const newTokens = await checkSession(refreshToken);

      const res = NextResponse.next();
      if (newTokens.accessToken) {
        res.cookies.set("accessToken", newTokens.accessToken, {
          httpOnly: true,
          secure: true,
          path: "/",
        });
      }
      if (newTokens.refreshToken) {
        res.cookies.set("refreshToken", newTokens.refreshToken, {
          httpOnly: true,
          secure: true,
          path: "/",
        });
      }

      return res;
    } catch {
      const res = NextResponse.redirect(new URL("/sign-in", req.url));
      res.cookies.delete("accessToken");
      res.cookies.delete("refreshToken");
      return res;
    }
  }

  if (!sessionValid && isPrivate) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (sessionValid && isPublic) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/sign-in", "/sign-up", "/profile/:path*", "/notes/:path*"],
};
