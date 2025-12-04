// context/AuthContext.tsx
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IUser } from "@/types/IUser";
import { getAuthToken, clearAuthToken, setAuthToken } from "@/utils/authCookie";

interface AuthState {
  user: IUser | null;
  token: string | null;
  loading: boolean;
  hydrated: boolean;

  setUser: (u: IUser | null) => void;
  setToken: (t: string | null) => void;
  setLoading: (v: boolean) => void;
  setHydrated: (v: boolean) => void;
  logout: () => void;

  checkAuth: () => void;
}

// NAMA localStorage key untuk broadcast fallback
const LOGOUT_STORAGE_KEY = "bt-auth-logout";
const BC_CHANNEL_NAME = "bt_auth_channel";

// helper untuk cek environment
const isBrowser = typeof window !== "undefined";

// BroadcastChannel instance (if supported)
const bc: BroadcastChannel | null = (() => {
  if (!isBrowser) return null;
  try {
    if ("BroadcastChannel" in window) {
      // @ts-ignore
      return new BroadcastChannel(BC_CHANNEL_NAME);
    }
  } catch (e) {
    // ignore
  }
  return null;
})();

// performLocalLogout: hanya bersihkan state lokal (tidak broadcast)
const performLocalLogout = () => {
  try {
    // akses zustand store synchronously
    const state = AuthContext.getState();
    clearAuthToken();
    state.setUser(null);
    state.setToken(null);
    // keep hydrated/loading flags untouched — caller yang mau redirect bisa handle
    // (jika ingin, bisa juga memanggil router.replace('/') dari tempat yang tepat)
  } catch (e) {
    // ignore
    // console.error("performLocalLogout error", e);
  }
};

// Pasang listener BroadcastChannel / storage event (module scope so it's registered once per tab)
if (isBrowser) {
  // BroadcastChannel listener
  if (bc) {
    bc.addEventListener("message", (ev: MessageEvent) => {
      const payload = ev.data;
      if (!payload || typeof payload !== "object") return;
      if (payload.type === "logout") {
        // lakukan cleanup lokal (tanpa mem-broadcast lagi)
        performLocalLogout();
      }
    });
  }

  // fallback storage event: when other tab sets LOGOUT_STORAGE_KEY
  window.addEventListener("storage", (e: StorageEvent) => {
    if (e.key === LOGOUT_STORAGE_KEY) {
      performLocalLogout();
    }
  });
}

export const AuthContext = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      hydrated: false,

      setUser: (u) => set({ user: u }),
      setToken: (t) => set({ token: t }),
      setLoading: (v) => set({ loading: v }),
      setHydrated: (v) => set({ hydrated: v }),

      // logout sekarang: lakukan local cleanup terlebih dahulu lalu broadcast ke tab lain
      logout: () => {
        try {
          // perform local cleanup
          clearAuthToken();
          set({ user: null, token: null });

          // broadcast logout ke tab lain
          if (isBrowser) {
            try {
              if (bc) {
                bc.postMessage({ type: "logout", time: Date.now() });
              } else {
                // fallback: gunakan localStorage toggle (storage event tidak dipicu di same tab)
                localStorage.setItem(LOGOUT_STORAGE_KEY, String(Date.now()));
              }
            } catch (e) {
              // ignore
            }
          }
        } catch (e) {
          // ignore
          console.error("AuthContext.logout error:", e);
        }
      },

      checkAuth: () => {
        const cookieToken = getAuthToken();
        const storageToken = get().token;
        const user = get().user;

        // token + user sudah ada → tidak usah apa-apa
        if (cookieToken && storageToken && user) {
          return;
        }

        // token hilang
        if (!cookieToken) {
          set({ user: null, token: null });
          return;
        }

        // token ada tapi storage kosong — hanya set token agar tidak loop
        if (cookieToken && !storageToken) {
          set({ token: cookieToken });
        }
      },
    }),
    {
      name: "bt-auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);

export const useAuth = AuthContext;
