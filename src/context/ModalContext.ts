"use client";

import { create } from "zustand";
import { ReactNode } from "react";

interface ModalState {
  isOpen: boolean;
  content: ReactNode | null;
  title?: string;
  size?: "sm" | "md" | "lg";
  mobileMode?: "normal" | "full";
  openModal: (config: {
    title?: string;
    content: ReactNode;
    size?: "sm" | "md" | "lg";
    mobileMode?: "normal" | "full";
  }) => void;
  closeModal: () => void;
}

const modalStore = create<ModalState>((set) => ({
  isOpen: false,
  content: null,
  title: "",
  size: "md",
  mobileMode: "normal",

  openModal: ({ title = "", content, size = "md", mobileMode = "normal" }) =>
    set({ isOpen: true, title, content, size, mobileMode }),

  closeModal: () => set({ isOpen: false, content: null, title: "" }),
}));

export const useModal = modalStore;
