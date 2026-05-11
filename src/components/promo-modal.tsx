import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiTag, FiX } from "react-icons/fi";

type PromoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onApply: (code: string) => void;
};

export const PromoModal = ({ isOpen, onClose, onApply }: PromoModalProps) => {
  const [code, setCode] = useState("");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(
        document.documentElement.classList.contains("dark") ||
          document.documentElement.classList.contains("dark-theme")
      );
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const onEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onEsc);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modal = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
      <button
        type="button"
        onClick={onClose}
        aria-label="Закрыть промокод"
        className="absolute inset-0 bg-black/55 backdrop-blur-[8px]"
      />

      <div
        className={`relative z-[100000] w-full max-w-[560px] rounded-[34px] p-8 shadow-[0_30px_90px_rgba(0,0,0,0.35)] ${
          isDark
            ? "border border-[#2a1608] bg-[#111111]"
            : "border border-[#f1dfd0] bg-[#fff8f1]"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className={`absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full border shadow-sm transition ${
            isDark
              ? "border-[#333] bg-[#1f1f1f] text-white/70 hover:bg-[#ff6b00] hover:text-white"
              : "border-[#eadfd8] bg-white text-[#687385] hover:bg-[#ff6b00] hover:text-white"
          }`}
        >
          <FiX className="text-[22px]" />
        </button>

        <div
          className={`inline-flex rounded-full px-5 py-2 text-[14px] font-black text-[#ff6b00] ${
            isDark ? "bg-[#24140a]" : "bg-[#fff0e3]"
          }`}
        >
          ClickEat Promo
        </div>

        <h2
          className={`mt-7 text-[36px] font-black leading-tight ${
            isDark ? "text-white" : "text-[#2f3542]"
          }`}
        >
          Введите промокод
        </h2>

        <div
          className={`mt-5 rounded-[22px] border p-5 ${
            isDark
              ? "border-[#2a1608] bg-[#1a1a1a]"
              : "border-[#f1dfd0] bg-white/70"
          }`}
        >
          <p
            className={`text-[16px] font-semibold ${
              isDark ? "text-white/55" : "text-[#8b95a6]"
            }`}
          >
            Для проверки можно использовать:
          </p>

          <div className="mt-3 space-y-2 text-[16px]">
            <p className={isDark ? "text-white/55" : "text-[#8b95a6]"}>
              <span className="font-black text-[#ff6b00]">CLICK10</span> — скидка
              10%
            </p>

            <p className={isDark ? "text-white/55" : "text-[#8b95a6]"}>
              <span className="font-black text-[#ff6b00]">FOOD5000</span> — скидка
              5000 сум
            </p>
          </div>
        </div>

        <div
          className={`mt-6 flex items-center gap-4 rounded-[22px] border px-5 py-4 transition focus-within:border-[#ff6b00] ${
            isDark ? "border-[#333] bg-[#1f1f1f]" : "border-[#eadfd8] bg-white"
          }`}
        >
          <FiTag className="text-[22px] text-[#ff6b00]" />

          <input
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            placeholder="Введите промокод"
            className={`w-full bg-transparent text-[18px] font-bold outline-none ${
              isDark
                ? "text-white placeholder:text-white/35"
                : "text-[#2f3542] placeholder:text-[#a5adba]"
            }`}
          />
        </div>

        <div className="mt-7 grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={onClose}
            className={`rounded-[20px] border px-5 py-4 text-[16px] font-black transition ${
              isDark
                ? "border-[#333] bg-[#1f1f1f] text-white/70 hover:border-[#ff6b00] hover:text-[#ff6b00]"
                : "border-[#eadfd8] bg-white text-[#687385] hover:border-[#ff6b00] hover:text-[#ff6b00]"
            }`}
          >
            Отмена
          </button>

          <button
            type="button"
            onClick={() => {
              onApply(code.trim());
              setCode("");
            }}
            className="rounded-[20px] bg-gradient-to-r from-[#ff7a00] to-[#ff4f00] px-5 py-4 text-[16px] font-black text-white shadow-[0_16px_32px_rgba(255,107,0,0.28)] transition hover:-translate-y-1"
          >
            Применить
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};