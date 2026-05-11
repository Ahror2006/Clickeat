import { useState } from "react";
import { FaInstagram, FaFacebookF, FaTelegramPlane } from "react-icons/fa";
import {
  RiMapPinLine,
  RiPhoneLine,
  RiMailLine,
  RiTimeLine,
  RiSendPlaneLine,
  RiAttachment2,
  RiImageAddLine,
  RiCloseLine,
  RiCustomerService2Line,
  RiArrowDownSLine,
} from "react-icons/ri";
import { useThemeStore } from "../../stores/theme.store";

const topics = [
  "Вопрос по заказу",
  "Сотрудничество с рестораном",
  "Техническая поддержка",
  "Отзывы и предложения",
  "Жалоба",
];

export const ContactPage = () => {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";

  const [fileName, setFileName] = useState("");
  const [filePreview, setFilePreview] = useState("");
  const [topic, setTopic] = useState("Вопрос по заказу");
  const [topicOpen, setTopicOpen] = useState(false);

  const clearFile = () => {
    setFileName("");
    setFilePreview("");
  };

  return (
    <main
      className={`min-h-screen px-5 pb-20 pt-[170px] transition ${
        isDark ? "bg-black text-white" : "bg-[#f6f1ea] text-[#171717]"
      }`}
    >
      <section
        className={`mx-auto max-w-[1320px] overflow-visible rounded-[44px] border ${
          isDark
            ? "border-[#2a1608] bg-[#0f0f0f] shadow-[0_30px_90px_rgba(0,0,0,0.5)]"
            : "border-black/5 bg-white shadow-[0_30px_90px_rgba(0,0,0,0.1)]"
        }`}
      >
        <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
          <div className="p-8 md:p-12">
            <span className="inline-flex rounded-full bg-[#ff6b00]/15 px-5 py-2 text-[14px] font-black text-[#ff6b00]">
              ClickEat Contact
            </span>

            <h1 className="mt-6 text-[48px] font-black leading-tight md:text-[72px]">
              Связаться с <span className="text-[#ff6b00]">ClickEat</span>
            </h1>

            <p
              className={`mt-5 max-w-[720px] text-[18px] leading-8 ${
                isDark ? "text-white/65" : "text-black/60"
              }`}
            >
              Есть вопрос по заказу, ресторану или доставке? Напиши нам — мы
              быстро поможем, проверим детали и подскажем лучший вариант.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <ContactCard icon={<RiPhoneLine />} title="Телефон" text="+998 90 777 77 77" isDark={isDark} />
              <ContactCard icon={<RiMailLine />} title="Email" text="support@clickeat.uz" isDark={isDark} />
              <ContactCard icon={<RiMapPinLine />} title="Адрес" text="Ташкент, Uzbekistan" isDark={isDark} />
              <ContactCard icon={<RiTimeLine />} title="Рабочее время" text="Ежедневно 09:00 — 23:00" isDark={isDark} />
            </div>

            <div className="mt-10 flex items-center gap-4">
              <SocialIcon type="instagram" />
              <SocialIcon type="facebook" />
              <SocialIcon type="telegram" />
            </div>
          </div>

          <div
            className={`relative border-l p-8 md:p-12 ${
              isDark
                ? "border-[#2a1608] bg-black/30"
                : "border-black/5 bg-[#fbf7f1]"
            }`}
          >
            <div className="absolute right-8 top-8 hidden h-[120px] w-[120px] rounded-full bg-[#ff6b00]/20 blur-[55px] md:block" />

            <div className="relative">
              <div className="mb-6 flex h-[70px] w-[70px] items-center justify-center rounded-[24px] bg-[#ff6b00] text-[34px] text-white shadow-[0_16px_40px_rgba(255,107,0,0.35)]">
                <RiCustomerService2Line />
              </div>

              <h2 className="text-[36px] font-black">Написать нам</h2>

              <p
                className={`mt-2 text-[16px] leading-7 ${
                  isDark ? "text-white/55" : "text-black/55"
                }`}
              >
                Опиши ситуацию и при необходимости приложи скриншот заказа,
                оплаты или ошибку на сайте.
              </p>

              <form className="mt-8 grid gap-4">
                <Field placeholder="Ваше имя" isDark={isDark} />
                <Field placeholder="Email или телефон" isDark={isDark} />

                <div className="relative z-40">
                  <button
                    type="button"
                    onClick={() => setTopicOpen((prev) => !prev)}
                    className={`flex w-full items-center justify-between rounded-[20px] border px-5 py-4 text-left text-[16px] font-bold outline-none transition ${
                      isDark
                        ? "border-white/10 bg-[#111] text-white"
                        : "border-black/10 bg-white text-[#171717]"
                    } ${
                      topicOpen
                        ? "border-[#ff6b00] shadow-[0_0_0_4px_rgba(255,107,0,0.12)]"
                        : ""
                    }`}
                  >
                    <span>{topic}</span>
                    <RiArrowDownSLine
                      className={`text-[24px] text-[#ff6b00] transition ${
                        topicOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {topicOpen && (
                    <div
                      className={`absolute left-0 top-[66px] z-50 w-full overflow-hidden rounded-[22px] border p-2 shadow-[0_24px_70px_rgba(0,0,0,0.28)] ${
                        isDark
                          ? "border-[#2a1608] bg-[#0d0d0d]"
                          : "border-black/10 bg-white"
                      }`}
                    >
                      {topics.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            setTopic(item);
                            setTopicOpen(false);
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
                  placeholder="Сообщение"
                  rows={5}
                  className={`resize-none rounded-[24px] border px-5 py-4 outline-none transition focus:border-[#ff6b00] ${
                    isDark
                      ? "border-white/10 bg-[#111] text-white placeholder:text-white/35"
                      : "border-black/10 bg-white text-[#171717] placeholder:text-black/35"
                  }`}
                />

                <label
                  className={`group cursor-pointer overflow-hidden rounded-[24px] border-2 border-dashed p-5 transition ${
                    isDark
                      ? "border-white/10 bg-[#111] hover:border-[#ff6b00]"
                      : "border-black/10 bg-white hover:border-[#ff6b00]"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      setFileName(file.name);
                      setFilePreview(URL.createObjectURL(file));
                    }}
                  />

                  <div className="flex items-center gap-4">
                    {filePreview ? (
                      <img
                        src={filePreview}
                        alt="Preview"
                        className="h-[82px] w-[110px] shrink-0 rounded-[18px] object-cover"
                      />
                    ) : (
                      <div className="flex h-[70px] w-[70px] shrink-0 items-center justify-center rounded-[20px] bg-[#ff6b00]/15 text-[32px] text-[#ff6b00]">
                        <RiImageAddLine />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h3 className="font-black">Добавить скриншот или фото</h3>

                      <p
                        className={`mt-1 text-[14px] ${
                          isDark ? "text-white/45" : "text-black/45"
                        }`}
                      >
                        PNG, JPG или WEBP. Например: чек, ошибка, фото заказа.
                      </p>

                      {fileName && (
                        <div className="mt-3 flex max-w-full items-center gap-2">
                          <div className="inline-flex min-w-0 items-center gap-2 rounded-full bg-[#ff6b00]/15 px-4 py-2 text-[13px] font-bold text-[#ff6b00]">
                            <RiAttachment2 className="shrink-0" />
                            <span className="max-w-[260px] truncate">
                              {fileName}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              clearFile();
                            }}
                            className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-[#ff6b00] text-white transition hover:scale-105"
                          >
                            <RiCloseLine />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </label>

                <button
                  type="button"
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#ff6b00] px-7 py-4 text-[16px] font-black text-white shadow-[0_16px_42px_rgba(255,107,0,0.38)] transition hover:scale-[1.02] hover:bg-[#ff7a1a]"
                >
                  Отправить сообщение
                  <RiSendPlaneLine />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

function Field({ placeholder, isDark }: { placeholder: string; isDark: boolean }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className={`rounded-[20px] border px-5 py-4 outline-none transition focus:border-[#ff6b00] ${
        isDark
          ? "border-white/10 bg-[#111] text-white placeholder:text-white/35"
          : "border-black/10 bg-white text-[#171717] placeholder:text-black/35"
      }`}
    />
  );
}

function ContactCard({
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
      className={`rounded-[24px] border p-5 transition hover:-translate-y-1 ${
        isDark
          ? "border-[#2a1608] bg-black/35"
          : "border-black/5 bg-[#f8f4ee]"
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

function SocialIcon({ type }: { type: "instagram" | "facebook" | "telegram" }) {
  const Icon =
    type === "instagram"
      ? FaInstagram
      : type === "facebook"
      ? FaFacebookF
      : FaTelegramPlane;

  const hover =
    type === "instagram"
      ? "hover:bg-[#E1306C] hover:shadow-[0_0_25px_rgba(225,48,108,0.45)]"
      : type === "facebook"
      ? "hover:bg-[#1877F2] hover:shadow-[0_0_25px_rgba(24,119,242,0.45)]"
      : "hover:bg-[#229ED9] hover:shadow-[0_0_25px_rgba(34,158,217,0.5)]";

  return (
    <a
      href="#"
      className={`flex h-[54px] w-[54px] items-center justify-center rounded-full bg-[#fff3eb] text-[23px] text-[#ff6b00] transition-all duration-300 hover:scale-110 hover:text-white ${hover}`}
    >
      <Icon />
    </a>
  );
}