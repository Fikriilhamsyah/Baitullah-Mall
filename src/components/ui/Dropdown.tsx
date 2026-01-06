"use client";
import React, { useState, useRef, useEffect } from "react";

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /** delay sebelum menutup (ms) — bisa diubah jika perlu */
  closeDelay?: number;
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  className,
  closeDelay = 150,
}) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  // batalkan close jika ada timer
  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  // schedule close dengan delay
  const scheduleClose = () => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      setOpen(false);
      closeTimerRef.current = null;
    }, closeDelay);
  };

  // open segera
  const openNow = () => {
    clearCloseTimer();
    setOpen(true);
  };

  // 🔥 Toggle ketika klik pada trigger
  const toggleOpen = () => {
    clearCloseTimer();
    setOpen((prev) => !prev);
  };

  // Close jika klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ❗️🔥 Close saat halaman discroll
  useEffect(() => {
    const handleScroll = () => {
      setOpen(false);
    };
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, []);

  // Hover events tetap jalan
  useEffect(() => {
    const trig = triggerRef.current;
    const menu = menuRef.current;

    if (!trig || !menu) return;

    const onTriggerEnter = () => openNow();
    const onTriggerLeave = () => scheduleClose();

    const onMenuEnter = () => openNow();
    const onMenuLeave = () => scheduleClose();

    trig.addEventListener("mouseenter", onTriggerEnter);
    trig.addEventListener("mouseleave", onTriggerLeave);

    menu.addEventListener("mouseenter", onMenuEnter);
    menu.addEventListener("mouseleave", onMenuLeave);

    return () => {
      trig.removeEventListener("mouseenter", onTriggerEnter);
      trig.removeEventListener("mouseleave", onTriggerLeave);

      menu.removeEventListener("mouseenter", onMenuEnter);
      menu.removeEventListener("mouseleave", onMenuLeave);

      clearCloseTimer();
    };
  }, [closeDelay]);

  return (
    <div ref={wrapperRef} className={`relative inline-flex items-center ${className || ""}`}>
      {/* trigger area */}
      <div
        ref={triggerRef}
        className="cursor-pointer flex items-center gap-2"
        onClick={toggleOpen}
      >
        {trigger}
      </div>

      {/* dropdown */}
      <div
        ref={menuRef}
        className={`${
          open ? "block" : "hidden"
        } absolute right-0 top-full translate-y-2 w-44 bg-white rounded-md shadow-md border border-neutral-100 animate-fadeIn origin-top z-50`}
      >
        {children}
      </div>
    </div>
  );
};

export default Dropdown;
