"use client";

import { useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function AuthHydrator() {
  useEffect(() => {
    AuthContext.getState().checkAuth();
  }, []);
  return null;
}
