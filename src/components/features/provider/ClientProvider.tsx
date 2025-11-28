"use client";

import { ReactNode, useEffect, useState } from "react";

// Context
import { SearchProvider } from "@/context/SearchContext";
import { AuthContext } from "@/context/AuthContext";

// Layout Components
import Header from "@components/layout/Header";
import Footer from "@components/layout/Footer";

// Components
import Modal from "@/components/ui/Modal";

export default function ClientProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const state = AuthContext.getState();
    state.checkAuth();
    state.setHydrated(true);
    setReady(true);
  }, []);

  // jangan render layout sebelum hydrated
  if (!ready) return null;

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
