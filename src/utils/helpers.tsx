import React from "react";
import {
  Shirt,
  Sparkles,
  Navigation,
  HeartPulse,
  BookOpen,
  Package,
  Menu,
  ShoppingBag,
  UserRound,
  House,
  Box,
  CreditCard,
} from "lucide-react";

// Icon Navbar
export const navIcons = {
  menu: <Menu className="block h-6 w-6" />,
  cart: <ShoppingBag className="h-6 w-6" />,
  account: <UserRound className="h-6 w-6" />,
};

// Helper untuk menggabungkan className conditionally merge class Tailwind
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
