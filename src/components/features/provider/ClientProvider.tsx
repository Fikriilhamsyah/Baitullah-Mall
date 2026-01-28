"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuth, AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Context
import { SearchProvider } from "@/context/SearchContext";

// Layout Components
import Header from "@components/layout/Header";
import Footer from "@components/layout/Footer";

// Components
import Modal from "@/components/ui/Modal";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,      // 1 fetch seumur session
      gcTime: Infinity,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function ClientProvider({ children }: { children: ReactNode }) {
  const user = useAuth((state) => state.user);
  const hydrated = useAuth((state) => state.hydrated);
  const router = useRouter();
  const pathname = router.pathname;

  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        await AuthContext.getState().checkAuth?.();
      } catch (err) {
        console.error("checkAuth failed:", err);
      } finally {
        try {
          const state = AuthContext.getState();
          if (typeof state.setHydrated === "function") {
            state.setHydrated(true);
          }
        } catch {}

        if (mounted) setReady(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!ready && !hydrated) return;

    const protectedRoutes = [
      "/checkout",
      "/checkout/payment",
      "/cart",
      "/profile",
      "/profile/account",
      "/profile/orders",
      "/profile/address",
      "/profile/voucher",
      "/profile/setting",
    ];

    if (!user && protectedRoutes.includes(pathname)) {
      router.replace("/");
    }
  }, [ready, hydrated, user, pathname, router]);

  if (!ready && !hydrated) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <SearchProvider>
        <Header />

        <main className="flex-grow">
          {children}
          <Modal />
        </main>

        <Footer />
      </SearchProvider>
    </QueryClientProvider>
  );
}
