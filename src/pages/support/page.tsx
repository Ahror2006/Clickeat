import { useState } from "react";
import {
  RiCustomerService2Line,
  RiQuestionAnswerLine,
  RiShoppingBag3Line,
  RiBankCardLine,
  RiBugLine,
  RiSendPlaneLine,
  RiArrowDownSLine,
  RiImageAddLine,
  RiCloseLine,
} from "react-icons/ri";
import { useThemeStore } from "../../stores/theme.store";

const topics = [
  "Проблема с заказом",
  "Проблема с оплатой",
  "Ошибка на сайте",
  "Проблема с аккаунтом",
  "Другое",
];

const faq = [
  {
    q: "Заказ не отображается в профиле",
    a: "Проверь, вошёл ли ты в аккаунт. Если заказ всё равно не появился — напиши номер телефона и примерное время заказа.",
  },
  {
    q: "Оплата прошла, но заказ не создался",
    a: "Сохрани чек или скриншот оплаты и отправь его в техподдержку.",
  },
  {
    q: "Не открывается страница ресторана",
    a: "Попробуй обновить страницу. Если ошибка повторяется, приложи скриншот.",
  },
];

type SupportTicket = {
  id: number;
  name: string;
  contact: string;
  topic: string;
  message: string;
  fileName?: string;
  filePreview?: string;
  createdAt: string;
  status: "new";
};

export const SupportPage = () => {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";

  const [topic, setTopic] = useState(topics[0]);
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");

  const [fileName, setFileName] = useState("");
  const [filePreview, setFilePreview] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (file?: File) => {
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      setFilePreview(String(reader.result));
    };
    reader.readAsDataURL(file);
  };

  const clearFile = () => {
    setFileName("");
    setFilePreview("");
  };

  const handleSubmit = () => {
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Введите ваше имя.");
      return;
    }

    if (!contact.trim()) {
      setError("Введите email или телефон.");
      return;
    }

    if (!message.trim()) {
      setError("Опишите проблему.");
      return;
    }

    const ticket: SupportTicket = {
      id: Date.now(),
      name: name.trim(),
      contact: contact.trim(),
      topic,
      message: message.trim(),
      fileName,
      filePreview,
      createdAt: new Date().toLocaleString("ru-RU"),
      status: "new",
    };

    const saved = localStorage.getItem("supportTickets");
    const tickets: SupportTicket[] = saved ? JSON.parse(saved) : [];

    localStorage.setItem("supportTickets", JSON.stringify([ticket, ...tickets]));

    setSuccess("Обращение отправлено! Мы скоро свяжемся с вами.");
    setName("");
    setContact("");
    setMessage("");
    setTopic(topics[0]);
    clearFile();
  };

  return (
    <main
      className={`min-h-screen px-5 pb-20 pt-[170px] transition ${
        isDark ? "bg-black text-white" : "bg-[#f6f1ea] text-[#171717]"
      }`}
    >
      <section
        className={`mx-auto max-w-[1280px] rounded-[44px] border p-8 md:p-12 ${
          isDark
            ? "border-[#2a1608] bg-[#0f0f0f] shadow-[0_30px_90px_rgba(0,0,0,0.5)]"
            : "border-black/5 bg-white shadow-[0_30px_90px_rgba(0,0,0,0.1)]"
        }`}
      >
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <span className="inline-flex rounded-full bg-[#ff6b00]/15 px-5 py-2 text-[14px] font-black text-[#ff6b00]">
              ClickEat Support
            </span>

            <h1 className="mt-6 text-[48px] font-black leading-tight md:text-[72px]">
              Техническая <span className="text-[#ff6b00]">поддержка</span>
            </h1>

            <p className={`mt-5 text-[18px] leading-8 ${isDark ? "text-white/60" : "text-black/60"}`}>
              Поможем с заказом, оплатой, аккаунтом или ошибкой на сайте.
              Опиши проблему — и мы сохраним обращение.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <InfoCard icon={<RiShoppingBag3Line />} title="Заказы" text="Проблемы со статусом, составом или доставкой." isDark={isDark} />
              <InfoCard icon={<RiBankCardLine />} title="Оплата" text="Проверка платежей, чеков и возвратов." isDark={isDark} />
              <InfoCard icon={<RiBugLine />} title="Ошибки сайта" text="Баги, страницы 404, поиск и корзина." isDark={isDark} />
              <InfoCard icon={<RiQuestionAnswerLine />} title="Консультация" text="Ответим на вопросы по сервису ClickEat." isDark={isDark} />
            </div>
          </div>

          <div
            className={`rounded-[34px] border p-6 md:p-8 ${
              isDark ? "border-[#2a1608] bg-black/35" : "border-black/5 bg-[#fbf7f1]"
            }`}
          >
            <div className="mb-6 flex h-[70px] w-[70px] items-center justify-center rounded-[24px] bg-[#ff6b00] text-[34px] text-white shadow-[0_16px_40px_rgba(255,107,0,0.35)]">
              <RiCustomerService2Line />
            </div>

            <h2 className="text-[34px] font-black">Создать обращение</h2>

            <div className="mt-7 grid gap-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше имя"
                className={fieldClass(isDark)}
              />

              <input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Email или телефон"
                className={fieldClass(isDark)}
              />

              <div className="relative z-30">
                <button
                  type="button"
                  onClick={() => setOpen((prev) => !prev)}
                  className={`${fieldClass(isDark)} flex w-full items-center justify-between text-left font-bold`}
                >
                  <span>{topic}</span>
                  <RiArrowDownSLine className={`text-[24px] text-[#ff6b00] transition ${open ? "rotate-180" : ""}`} />
                </button>

                {open && (
                  <div
                    className={`absolute left-0 top-[66px] z-40 w-full rounded-[22px] border p-2 shadow-[0_24px_70px_rgba(0,0,0,0.28)] ${
                      isDark ? "border-[#2a1608] bg-[#0d0d0d]" : "border-black/10 bg-white"
                    }`}
                  >
                    {topics.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setTopic(item);
                          setOpen(false);
                        }}
                        className={`block w-full rounded-[16px] px-5 py-4 text-left text-[15px] font-black transition ${
                          item === topic
                            ? "bg-[#ff6b00] text-white"
                            : isDark
                            ? "text-white hover:bg-white/10"
                            : "text-[#171717] hover:bg-[#fff3eb]"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Опиши проблему подробнее"
                className={`${fieldClass(isDark)} resize-none`}
              />

              <label
                className={`cursor-pointer rounded-[24px] border-2 border-dashed p-5 transition ${
                  isDark
                    ? "border-white/10 bg-[#111] hover:border-[#ff6b00]"
                    : "border-black/10 bg-white hover:border-[#ff6b00]"
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files?.[0])}
                />

                <div className="flex items-center gap-4">
                  {filePreview ? (
                    <img
                      src={filePreview}
                      alt="preview"
                      className="h-[82px] w-[110px] shrink-0 rounded-[18px] object-cover"
                    />
                  ) : (
                    <div className="flex h-[70px] w-[70px] shrink-0 items-center justify-center rounded-[20px] bg-[#ff6b00]/15 text-[32px] text-[#ff6b00]">
                      <RiImageAddLine />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h3 className="font-black">Добавить скриншот или фото</h3>
                    <p className={isDark ? "mt-1 text-white/45" : "mt-1 text-black/45"}>
                      PNG, JPG или WEBP. Например: чек, ошибка, фото заказа.
                    </p>

                    {fileName && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          clearFile();
                        }}
                        className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#ff6b00] px-4 py-2 text-[13px] font-bold text-white"
                      >
                        {fileName}
                        <RiCloseLine />
                      </button>
                    )}
                  </div>
                </div>
              </label>

              {error && (
                <div className="rounded-[18px] bg-red-500/10 px-5 py-4 text-[15px] font-bold text-red-500">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-[18px] bg-green-500/10 px-5 py-4 text-[15px] font-bold text-green-500">
                  {success}
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ff6b00] px-7 py-4 text-[16px] font-black text-white shadow-[0_16px_42px_rgba(255,107,0,0.38)] transition hover:scale-[1.02] hover:bg-[#ff7a1a]"
              >
                Отправить в поддержку
                <RiSendPlaneLine />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-[36px] font-black">Частые вопросы</h2>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {faq.map((item) => (
              <div
                key={item.q}
                className={`rounded-[26px] border p-6 ${
                  isDark ? "border-[#2a1608] bg-black/35" : "border-black/5 bg-[#f8f4ee]"
                }`}
              >
                <h3 className="text-[18px] font-black">{item.q}</h3>
                <p className={`mt-3 leading-7 ${isDark ? "text-white/55" : "text-black/55"}`}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

function fieldClass(isDark: boolean) {
  return `rounded-[20px] border px-5 py-4 outline-none transition focus:border-[#ff6b00] ${
    isDark
      ? "border-white/10 bg-[#111] text-white placeholder:text-white/35"
      : "border-black/10 bg-white text-[#171717] placeholder:text-black/35"
  }`;
}

function InfoCard({
  icon,
  title,
  text,
  isDark,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  isDark: boolean;
}) {
  return (
    <div
      className={`rounded-[24px] border p-5 ${
        isDark ? "border-[#2a1608] bg-black/35" : "border-black/5 bg-[#f8f4ee]"
      }`}
    >
      <div className="mb-4 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#ff6b00]/15 text-[26px] text-[#ff6b00]">
        {icon}
      </div>

      <h3 className="text-[18px] font-black">{title}</h3>
      <p className={isDark ? "mt-1 text-white/60" : "mt-1 text-black/60"}>
        {text}
      </p>
    </div>
  );
}