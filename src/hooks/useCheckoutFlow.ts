import { create } from "zustand";

interface CheckoutFlowState {
  payload: any | null;
  setPayload: (data: any) => void;
  clear: () => void;
}

export const useCheckoutFlow = create<CheckoutFlowState>((set) => ({
  payload: null,
  setPayload: (data) => set({ payload: data }),
  clear: () => set({ payload: null }),
}));
