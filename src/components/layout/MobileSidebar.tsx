"use client";
import React, { useEffect } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarItem {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  links: SidebarGroup[];
  activePath?: string;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isOpen,
  onClose,
  links,
  activePath,
}) => {
  useEffect(() => {
    let scrollY = 0;

    if (isOpen) {
      // Simpan posisi scroll sekarang
      scrollY = window.scrollY;
      // Kunci body agar tidak bisa digeser, tetap di posisi terakhir
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      document.body.style.overflowY = "hidden";
    } else {
      // Saat ditutup, kembalikan ke posisi semula tanpa reset ke atas
      const top = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";
      if (top) {
        const y = parseInt(top.replace("px", "")) * -1;
        window.scrollTo({ top: y });
      }
    }

    // Cleanup kalau komponen unmount
    return () => {
      const top = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";
      if (top) {
        const y = parseInt(top.replace("px", "")) * -1;
        window.scrollTo({ top: y });
      }
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] cursor-pointer"
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-[100] flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 z-10 bg-white">
                <Link href="/" className="flex items-center gap-2">
                  <img
                    src="/img/logo/logo-baitullah-mall.webp"
                    alt="Baitullah Mall"
                    className="h-7 lg:h-10"
                  />
                </Link>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Menu */}
              <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
                {links.map((group, i) => (
                  <div key={i} className="space-y-2 pb-4 border-b border-gray-200">
                    <h4 className="text-xs uppercase text-gray-400 font-semibold tracking-wider px-3">
                      {group.title}
                    </h4>
                    <div className="space-y-1">
                      {group.items.map((item) => {
                        const isActive = activePath === item.href;
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={`
                              flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors
                              ${
                                isActive
                                  ? "bg-primary-100 text-primary-700"
                                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                              }
                            `}
                          >
                            {Icon && <Icon className="h-5 w-5" />}
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
