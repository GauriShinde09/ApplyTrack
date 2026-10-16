
import { AlertTriangle, X, Trash2 } from "lucide-react";

export default function DeleteConfirmationModal({
  application,
  onConfirm,
  onCancel,
}) {
  if (!application) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#21183D]/50 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-3xl border border-[#EAE3FA] bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFE9ED] text-[#C84F64]">
            <AlertTriangle size={25} />
          </div>

          <button
            onClick={onCancel}
            className="rounded-xl p-2 text-[#887CA6] hover:bg-[#F4F0FC]"
          >
            <X size={20} />
          </button>
        </div>

        <h2 className="mt-5 text-xl font-bold text-[#30264D]">
          Delete application?
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#756A91]">
          Are you sure you want to delete{" "}
          <strong className="text-[#7251CC]">
            {application.company}
          </strong>{" "}
          — {application.role}? This action cannot be undone.
        </p>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={onCancel}
            className="rounded-xl border border-[#E6DFF5] px-5 py-2.5 text-sm font-semibold text-[#655780] hover:bg-[#F7F4FD]"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D9546B] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#C64259]"
          >
            <Trash2 size={16} />
            Delete application
          </button>
        </div>
      </div>
    </div>
  );
}
