"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuth, AuthContext } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

// Context
import { SearchProvider } from "@/context/SearchContext";

// Layout Components
import Header from "@components/layout/Header";
import Footer from "@components/layout/Footer";

// Components
import Modal from "@/components/ui/Modal";

export default function ClientProvider({ children }: { children: ReactNode }) {
  const user = useAuth((state) => state.user);
  const hydrated = useAuth((state) => state.hydrated);
  const router = useRouter();
  const pathname = usePathname();

  // local ready flag to avoid permanent null rendering if store doesn't set hydrated
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const state = AuthContext.getState();
        // Jika checkAuth async, tunggu selesainya. Jika bukan async, ini tetap aman.
        // checkAuth diharapkan mengatur user di store.
        await state.checkAuth?.();
      } catch (err) {
        // jangan crash app saat checkAuth error — tetap lanjut supaya user dapat melihat UI
        console.error("checkAuth failed:", err);
      } finally {
        // pastikan store hydrated flag di-set (jika store tidak meng-setnya sendiri)
        try {
          const state = AuthContext.getState();
          // jika ada method setHydrated di store, panggil; jika tidak, tidak apa-apa
          if (typeof state.setHydrated === "function") state.setHydrated(true);
        } catch (e) {
          // ignore
        }

        if (mounted) setReady(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // lakukan redirect hanya setelah kita yakin "ready" dan (atau) store.hydrated true
  useEffect(() => {
    // tunggu sampai ready (local) atau hydrated di store true
    if (!ready && !hydrated) return;

    // hanya redirect jika user null dan route protected
    const protectedRoutes = ["/checkout", "/checkout/", "/cart", "/cart/"];
    if (!user && protectedRoutes.includes(pathname)) {
      // gunakan replace supaya history tidak terisi
      router.replace("/");
    }
  }, [ready, hydrated, user, pathname, router]);

  // jangan render layout sebelum minimal ready (agar tidak flash/redirect prematur)
  if (!ready && !hydrated) return null;

  return (
    <>
      <SearchProvider>
        <Header />

        <main className="flex-grow">
          {children}
          <div className="container md:mx-auto md:px-6 pb-8">
            <Modal />
          </div>
        </main>

        <Footer />
      </SearchProvider>
    </>
  );
}
