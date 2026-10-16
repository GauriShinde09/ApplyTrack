
import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

const TOAST_CONFIG = {
  success: {
    icon: CheckCircle2,
    color: "text-[#24845F]",
    bg: "bg-[#E2F6EC]",
  },
  error: {
    icon: XCircle,
    color: "text-[#C84F64]",
    bg: "bg-[#FFE9ED]",
  },
  info: {
    icon: Info,
    color: "text-[#7251CC]",
    bg: "bg-[#F0EAFE]",
  },
};

export default function Toast() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let timer;

    const handleToast = (event) => {
      clearTimeout(timer);

      setToast({
        message: event.detail?.message || "Action completed!",
        type: event.detail?.type || "success",
      });

      timer = setTimeout(() => {
        setToast(null);
      }, 3000);
    };

    window.addEventListener("applytrack-toast", handleToast);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("applytrack-toast", handleToast);
    };
  }, []);

  if (!toast) return null;

  const config = TOAST_CONFIG[toast.type] || TOAST_CONFIG.success;
  const Icon = config.icon;

  return (
    <div className="fixed right-5 top-5 z-[200] w-[calc(100%-2.5rem)] max-w-sm animate-in slide-in-from-right-5 duration-300">
      <div className="flex items-center gap-3 rounded-2xl border border-[#EAE3FA] bg-white p-4 shadow-xl">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.bg} ${config.color}`}
        >
          <Icon size={21} />
        </div>

        <p className="flex-1 text-sm font-semibold text-[#30264D]">
          {toast.message}
        </p>

        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={() => setToast(null)}
          className="rounded-lg p-1 text-[#887CA6] hover:bg-[#F4F0FC]"
        >
          <X size={17} />
        </button>
      </div>
    </div>
  );
}

export function showToast(message, type = "success") {
  window.dispatchEvent(
    new CustomEvent("applytrack-toast", {
      detail: { message, type },
    })
  );
}
