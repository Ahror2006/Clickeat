import { useState } from "react";
import {
  RiErrorWarningLine,
  RiSendPlaneLine,
  RiArrowDownSLine,
  RiImageAddLine,
  RiCloseLine,
  RiShieldCheckLine,
  RiRestaurantLine,
  RiTruckLine,
  RiBankCardLine,
} from "react-icons/ri";
import { useThemeStore } from "../../stores/theme.store";

const complaintTypes = [
  "Проблема с доставкой",
  "Проблема с оплатой",
  "Проблема с рестораном",
  "Некачественное блюдо",
  "Ошибка в заказе",
  "Другое",
];

type Complaint = {
  id: number;
  name: string;
  contact: string;
  type: string;
  message: string;
  fileName?: string;
  filePreview?: string;
  createdAt: string;
  status: "new";
};

export const ComplaintsPage = () => {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";

  const [type, setType] = useState(complaintTypes[0]);
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");

  const [fileName, setFileName] = useState("");
  const [filePreview, setFilePreview] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const clearFile = () => {
    setFileName("");
    setFilePreview("");
  };

  const handleFile = (file?: File) => {
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => setFilePreview(String(reader.result));
    reader.readAsDataURL(file);
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
      setError("Опишите жалобу.");
      return;
    }

    const complaint: Complaint = {
      id: Date.now(),
      name: name.trim(),
      contact: contact.trim(),
      type,
      message: message.trim(),
      fileName,
      filePreview,
      createdAt: new Date().toLocaleString("ru-RU"),
      status: "new",
    };

    const saved = localStorage.getItem("clickEatComplaints");
    const complaints: Complaint[] = saved ? JSON.parse(saved) : [];

    localStorage.setItem(
      "clickEatComplaints",
      JSON.stringify([complaint, ...complaints])
    );

    setSuccess("Жалоба отправлена. Мы проверим ситуацию и свяжемся с вами.");
    setName("");
    setContact("");
    setMessage("");
    setType(complaintTypes[0]);
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
              ClickEat Complaints
            </span>

            <h1 className="mt-6 text-[48px] font-black leading-tight md:text-[72px]">
              Жалобы и <span className="text-[#ff6b00]">обращения</span>
            </h1>

            <p
              className={`mt-5 text-[18px] leading-8 ${
                isDark ? "text-white/60" : "text-black/60"
              }`}
            >
              Если что-то пошло не так — напиши нам. Мы сохраним обращение,
              проверим детали и поможем решить проблему.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <InfoCard
                icon={<RiTruckLine />}
                title="Доставка"
                text="Задержка, неверный адрес или проблема с курьером."
                isDark={isDark}
              />

              <InfoCard
                icon={<RiRestaurantLine />}
                title="Ресторан"
                text="Качество блюда, состав заказа или упаковка."
                isDark={isDark}
              />

              <InfoCard
                icon={<RiBankCardLine />}
                title="Оплата"
                text="Платёж, чек, возврат или двойное списание."
                isDark={isDark}
              />

              <InfoCard
                icon={<RiShieldCheckLine />}
                title="Контроль"
                text="Мы сохраняем обращение и передаём его на проверку."
                isDark={isDark}
              />
            </div>
          </div>

          <div
            className={`rounded-[34px] border p-6 md:p-8 ${
              isDark
                ? "border-[#2a1608] bg-black/35"
                : "border-black/5 bg-[#fbf7f1]"
            }`}
          >
            <div className="mb-6 flex h-[70px] w-[70px] items-center justify-center rounded-[24px] bg-[#ff6b00] text-[34px] text-white shadow-[0_16px_40px_rgba(255,107,0,0.35)]">
              <RiErrorWarningLine />
            </div>

            <h2 className="text-[34px] font-black">Создать жалобу</h2>

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
                  className={`${fieldClass(
                    isDark
                  )} flex w-full items-center justify-between text-left font-bold`}
                >
                  <span>{type}</span>

                  <RiArrowDownSLine
                    className={`text-[24px] text-[#ff6b00] transition ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {open && (
                  <div
                    className={`absolute left-0 top-[66px] z-40 w-full rounded-[22px] border p-2 shadow-[0_24px_70px_rgba(0,0,0,0.28)] ${
                      isDark
                        ? "border-[#2a1608] bg-[#0d0d0d]"
                        : "border-black/10 bg-white"
                    }`}
                  >
                    {complaintTypes.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setType(item);
                          setOpen(false);
                        }}
                        className={`block w-full rounded-[16px] px-5 py-4 text-left text-[15px] font-black transition ${
                          item === type
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
                placeholder="Опишите проблему подробнее"
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
                  onChange={(e) => handleFile(e.target.files?.[0])}
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

                    <p
                      className={
                        isDark ? "mt-1 text-white/45" : "mt-1 text-black/45"
                      }
                    >
                      Можно приложить чек, фото заказа или скриншот ошибки.
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
                Отправить жалобу
                <RiSendPlaneLine />
              </button>
            </div>
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