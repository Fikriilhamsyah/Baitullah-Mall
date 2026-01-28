"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

let sheetCount = 0;

const BottomSheet: React.FC<BottomSheetProps> = ({ open, onClose, children }) => {
  /** Body Scroll Lock agar multi sheet aman */
  useEffect(() => {
    if (open) {
      sheetCount++;
      document.body.classList.add("overflow-hidden");
    }
    return () => {
      sheetCount--;
      if (sheetCount <= 0) document.body.classList.remove("overflow-hidden");
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* SHEET */}
          <motion.div
            className="absolute bottom-0 left-0 w-full bg-white rounded-t-2xl max-h-[90vh] flex flex-col pointer-events-auto"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* HEADER */}
            <div className="flex justify-between items-start px-4 py-4">
              <div className="w-6 h-6" />
              <div className="w-12 h-1.5 bg-neutral-300 rounded-full" />
              <button
                onClick={onClose}
                className="flex justify-center items-center w-7 h-7 rounded-full bg-neutral-200"
              >
                <X size={16} className="text-neutral-600" />
              </button>
            </div>

            {/* CONTENT (scroll jika panjang) */}
            <div className="overflow-y-auto px-4 pb-6 flex-1">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;
