"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useModal } from "@/context/ModalContext";
import { PAYMENT_METHODS } from "@/types/IXendit";
import { useXenditPost } from "@/hooks/useXenditPost";
import PaymentConfirmModal from "./PaymentConfirmModal";
import { useAuth } from "@/context/AuthContext";

interface Props {
  selectedMethod: string | null;
  onSelect: (method: string) => void;
}

const CheckoutPaymentSelector: React.FC<Props> = ({
  selectedMethod,
  onSelect,
}) => {
  const { showToast } = useToast();
  const user = useAuth((s) => s.user); // ✅ AMBIL USER

  const { postXendit, loading } = useXenditPost();

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold">Metode Pembayaran</h3>

      <div className="space-y-2">
        {PAYMENT_METHODS.map((method) => (
          <button
            key={method.code}
            type="button"
            onClick={() => onSelect(method.code)}
            className={`w-full text-left p-4 rounded-lg border ${
              selectedMethod === method.code
                ? "border-primary-500 bg-primary-50"
                : "border-neutral-200"
            }`}
          >
            <div className="font-medium">{method.label}</div>
            <div className="text-sm text-neutral-500">
              {method.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CheckoutPaymentSelector;
