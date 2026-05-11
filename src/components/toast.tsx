import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi";
import { useToastStore } from "../stores/toast.store";

export const Toast = () => {
  const { isOpen, message, type, hideToast } = useToastStore();

  if (!isOpen) return null;

  const styles = {
    success: {
      icon: <FiCheckCircle className="text-[20px]" />,
      bg: "bg-[#ecfdf3]",
      border: "border-[#b7ebc6]",
      text: "text-[#166534]",
      iconBg: "bg-[#22c55e]",
    },
    error: {
      icon: <FiAlertCircle className="text-[20px]" />,
      bg: "bg-[#fff1f2]",
      border: "border-[#fecdd3]",
      text: "text-[#be123c]",
      iconBg: "bg-[#f43f5e]",
    },
    info: {
      icon: <FiInfo className="text-[20px]" />,
      bg: "bg-[#eff6ff]",
      border: "border-[#bfdbfe]",
      text: "text-[#1d4ed8]",
      iconBg: "bg-[#3b82f6]",
    },
  };

  const current = styles[type];

  return (
    <div className="fixed right-5 top-5 z-[100]">
      <div
        className={`flex min-w-[320px] max-w-[420px] items-start gap-3 rounded-2xl border ${current.bg} ${current.border} p-4 shadow-[0_14px_32px_rgba(0,0,0,0.12)]`}
      >
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white ${current.iconBg}`}
        >
          {current.icon}
        </div>

        <div className="flex-1">
          <p className={`text-[15px] font-semibold ${current.text}`}>
            {message}
          </p>
        </div>

        <button
          onClick={hideToast}
          className="text-[#7a8596] transition hover:text-black"
        >
          <FiX className="text-[18px]" />
        </button>
      </div>
    </div>
  );
};