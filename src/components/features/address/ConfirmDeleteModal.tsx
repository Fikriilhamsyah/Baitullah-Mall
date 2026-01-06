"use client";

import { Button } from "@/components/ui/Button";

interface ConfirmDeleteModalProps {
  title?: string;
  description?: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  title = "Hapus Data",
  description = "Apakah kamu yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.",
  loading = false,
  onCancel,
  onConfirm,
}) => {
  return (
    <div className="flex flex-col gap-4 pt-5 pb-10 lg:pb-0">
      <div className="space-y-2">
        <h3 className="text-base font-semibold text-neutral-900">
          {title}
        </h3>
        <p className="text-sm text-neutral-600">
          {description}
        </p>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          label="Batal"
          color="secondary"
          onClick={onCancel}
          disabled={loading}
        />
        <Button
          type="button"
          label={loading ? "Menghapus..." : "Hapus"}
          color="danger"
          onClick={onConfirm}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
