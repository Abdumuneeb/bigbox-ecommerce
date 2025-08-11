"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getCookie } from "cookies-next";

export function SessionWatcher({ children }: { children?: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const token = getCookie("token");

  useEffect(() => {
    // ✅ If user is logged in (token exists) and tries to go to login or register, redirect to /home
    // if (token && pathname === "/login") {
    //   router.replace("/home");
    // }
  }, [pathname, router, token]);

  return <>{children}</>;
}
