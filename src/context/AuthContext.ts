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

      logout: () => {
        clearAuthToken();
        set({ user: null, token: null });
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
