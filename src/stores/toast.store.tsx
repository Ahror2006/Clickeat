import { create } from "zustand";

type ToastType = "success" | "error" | "info";

interface ToastState {
  isOpen: boolean;
  message: string;
  type: ToastType;
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
}

let toastTimer: ReturnType<typeof setTimeout> | null = null;

export const useToastStore = create<ToastState>((set) => ({
  isOpen: false,
  message: "",
  type: "info",

  showToast: (message, type = "info") => {
    if (toastTimer) clearTimeout(toastTimer);

    set({
      isOpen: true,
      message,
      type,
    });

    toastTimer = setTimeout(() => {
      set({
        isOpen: false,
        message: "",
        type: "info",
      });
    }, 2500);
  },

  hideToast: () => {
    if (toastTimer) clearTimeout(toastTimer);

    set({
      isOpen: false,
      message: "",
      type: "info",
    });
  },
}));