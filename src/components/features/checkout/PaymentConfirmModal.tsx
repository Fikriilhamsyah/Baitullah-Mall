"use client";

import { Button } from "@/components/ui/Button";
import { useModal } from "@/context/ModalContext";

interface PaymentConfirmModalProps {
  invoice: {
    invoice_url: string;
    external_id: string;
    amount: number;
  };
  paymentMethod: string;
}

const PaymentConfirmModal: React.FC<PaymentConfirmModalProps> = ({
  invoice,
  paymentMethod,
}) => {
  const closeModal = useModal((s) => s.closeModal);

  return (
    <div className="space-y-4 pt-4">
      <div className="space-y-1">
        <p className="text-sm text-neutral-600">Metode Pembayaran</p>
        <p className="font-medium">{paymentMethod}</p>
      </div>

      <div className="space-y-1">
        <p className="text-sm text-neutral-600">Total Pembayaran</p>
        <p className="font-semibold text-lg">
          Rp {invoice.amount.toLocaleString("id-ID")}
        </p>
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          label="Batal"
          color="secondary"
          fullWidth
          onClick={closeModal}
        />
        <Button
          label="Lanjutkan Pembayaran"
          color="primary"
          fullWidth
          onClick={() => {
            window.open(invoice.invoice_url, "_blank");
            closeModal();
          }}
        />
      </div>
    </div>
  );
};

export default PaymentConfirmModal;
