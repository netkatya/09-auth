"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { getUserProfile, checkSession } from "@/lib/api/clientApi";
import Loader from "@/app/loading";

const PUBLIC_ROUTES = ["/sign-in", "/sign-up"];
const PRIVATE_ROUTES = ["/profile", "/notes"];

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { setUser, clearIsAuthenticated, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyAuth() {
      try {
        await checkSession();
        const user = await getUserProfile();
        setUser(user);

        if (PUBLIC_ROUTES.includes(pathname)) router.replace("/profile");
      } catch (err) {
        clearIsAuthenticated();

        if (PRIVATE_ROUTES.some((route) => pathname.startsWith(route))) {
          router.replace("/sign-in");
        }
      } finally {
        setLoading(false);
      }
    }
    verifyAuth();
  }, [clearIsAuthenticated, pathname, router, setUser]);

  if (loading) return <Loader />;

  if (
    !isAuthenticated &&
    PRIVATE_ROUTES.some((route) => pathname.startsWith(route))
  )
    return null;

  return <>{children}</>;
}
