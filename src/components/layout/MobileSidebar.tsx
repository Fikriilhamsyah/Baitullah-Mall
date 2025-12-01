"use client";
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// Icons
import { X, Facebook, Instagram, Youtube, Mail } from "lucide-react";

// Next.js Link
import Link from "next/link";

// Animation
import { motion, AnimatePresence } from "framer-motion";

// Utils
import { formatPointsToRupiah } from "@/types/IUser";

// Context
import { useAuth } from "@/context/AuthContext";
import { useModal } from "@/context/ModalContext";

// Components
import SignIn from '@/components/features/auth/SignIn';
import { Button } from "../ui/Button";

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
  const hydrated = useAuth((s) => s.hydrated);
  if (!hydrated) return null;

  const router = useRouter();

  const user = useAuth((state) => state.user);
  const openModal = useModal(s => s.openModal);
  const closeModal = useModal(s => s.closeModal);

  const scrollYRef = useRef<number | null>(null);

  const handleToSignIn = () => {
    onClose();
    setTimeout(() => {
      openModal({
        size: "md",
        mobileMode: "full",
        content: <SignIn />,
      });
    }, 250);
  };

  const handleLogout = () => {
    useAuth.getState().logout();
    onClose();
    router.push("/");
  };

  useEffect(() => {
    if (isOpen) {
      scrollYRef.current = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      document.body.style.overflowY = "hidden";
    } else {
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
      } else if (scrollYRef.current !== null) {
        window.scrollTo({ top: scrollYRef.current });
      }
      scrollYRef.current = null;
    }

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
      } else if (scrollYRef.current !== null) {
        window.scrollTo({ top: scrollYRef.current });
      }
      scrollYRef.current = null;
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
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[50] cursor-pointer pointer-events-auto"
            aria-hidden="true"
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="fixed top-0 left-0 w-[280px] h-[100vh] bg-white shadow-2xl z-[100] flex flex-col pointer-events-auto"
            role="dialog"
            aria-modal="true"
          >
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
                aria-label="Tutup sidebar"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Profile */}
              {user !== null ? (
                <div className="flex flex-col items-center p-4 border-b border-gray-200">
                  {user.profile_photo_path ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BAITULLAH}/storage/${user.profile_photo_path}`}
                      className="w-20 h-20 rounded-full object-cover"
                      alt="photo profile"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-3xl text-gray-400">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}

                  <p className="text-lg font-semibold text-neutral-900 mt-2">
                    {user.name}
                  </p>
                  <p className="text-sm text-neutral-600">{user.email}</p>

                  {/* {user.points !== undefined && (
                    <p className="text-base font-bold text-green-600 mt-1">
                      {formatPointsToRupiah(user.points)} Poin
                    </p>
                  )} */}
                </div>
              ) : (
                <div className="flex flex-col items-center p-4 border-b border-gray-200">
                  <Button label="Masuk" color="primary" onClick={handleToSignIn} fullWidth />
                </div>
              )}

              {/* Menu */}
              <div className="p-4 space-y-6">
                {links.map((group, i) => (
                  <div key={i} className="space-y-2 pb-4 border-b border-gray-200">
                    <h4 className="text-xs uppercase text-gray-400 font-semibold tracking-wider px-3">
                      {group.title}
                      </h4>
                      <div className="space-y-1">
                        {group.items.map((item) => {
                          const isActive = activePath === item.href;
                          const Icon = item.icon;

                          // jika item adalah logout
                          if (item.href === "/logout") {
                            return (
                              <button
                                key="logout"
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-gray-600 transition-colors"
                              >
                                {Icon && <Icon className="h-5 w-5" />}
                                <span>Keluar</span>
                              </button>
                            );
                          }

                          // normal link
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={onClose}
                              className={`flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                                isActive
                                  ? "bg-primary-100 text-primary-700"
                                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                              }`}
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

            {/* Sosial Media */}
            <div className="p-4 flex justify-center gap-3 border-t border-gray-200 bg-white">
              <a href="#" aria-label="Facebook" className="hover:scale-110 transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Instagram" className="hover:scale-110 transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" aria-label="YouTube" className="hover:scale-110 transition">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Email" className="hover:scale-110 transition">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
