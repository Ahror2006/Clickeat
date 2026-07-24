import { useCallback, useEffect, useState } from "react";
import {
  RiStarFill,
  RiStarLine,
  RiSendPlaneLine,
  RiChatSmile3Line,
  RiLightbulbFlashLine,
  RiHeart3Line,
} from "react-icons/ri";
import { useThemeStore } from "../../stores/theme.store";
import { useAuth } from "../../stores/auth.store";
import { api } from "../../lib/api";
import { getErrorMessage } from "../../lib/get-error-message";

const types = ["Отзыв", "Предложение", "Идея для улучшения"];

type Review = {
  _id: string;
  name: string;
  category: string;
  rating: number;
  message: string;
  createdAt: string;
};

export const ReviewsPage = () => {
  const user = useAuth((state) => state.user);
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";

  const [name, setName] = useState(user.name || "");
  const [type, setType] = useState(types[0]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);

  const loadReviews = useCallback(async () => {
    try {
      const response = await api.get("/feedback/reviews");
      setReviews(response.data.reviews || []);
    } catch {
      // The form remains usable if the public review list is unavailable.
    }
  }, []);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Введите имя.");
      return;
    }

    if (!message.trim()) {
      setError("Напишите отзыв или предложение.");
      return;
    }

    if (!rating) {
      setError("Выберите оценку от 1 до 5 звёзд.");
      return;
    }

    try {
      await api.post("/feedback", {
        kind: "review",
        name: name.trim(),
        category: type,
        rating,
        message: message.trim(),
      });

      setName(user.name || "");
      setType(types[0]);
      setRating(0);
      setMessage("");
      setSuccess("Спасибо! Ваш отзыв отправлен.");
      void loadReviews();
    } catch (submitError: unknown) {
      setError(getErrorMessage(submitError, "Не удалось отправить отзыв."));
    }
  };

  return (
    <main
      className={`min-h-screen px-4 pb-20 pt-[255px] sm:px-5 sm:pt-[265px] lg:pt-[155px] ${
        isDark ? "bg-[radial-gradient(circle_at_15%_0%,#291205_0%,#080808_34%)] text-white" : "bg-[radial-gradient(circle_at_15%_0%,#ffe1c9_0%,#f7f4f0_36%)] text-[#171717]"
      }`}
    >
      <section
        className="mx-auto max-w-[1280px]"
      >
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <span className="inline-flex rounded-full bg-[#ff6b00]/15 px-5 py-2 text-[14px] font-black text-[#ff6b00]">
              ClickEat Reviews
            </span>

            <h1 className="mt-6 text-[40px] font-black leading-[0.98] tracking-[-0.04em] md:text-[68px]">
              Отзывы и <span className="text-[#ff6b00]">предложения</span>
            </h1>

            <p className={isDark ? "mt-5 text-white/60" : "mt-5 text-black/60"}>
              Помоги сделать ClickEat лучше. Оставь отзыв, идею или предложение
              по улучшению сайта.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <InfoCard icon={<RiChatSmile3Line />} title="Отзывы" isDark={isDark} />
              <InfoCard icon={<RiLightbulbFlashLine />} title="Идеи" isDark={isDark} />
              <InfoCard icon={<RiHeart3Line />} title="Улучшения" isDark={isDark} />
            </div>
          </div>

          <div
            className={`rounded-[34px] border p-6 md:p-8 ${
              isDark
                ? "border-white/10 bg-white/[0.045] shadow-[0_30px_90px_rgba(0,0,0,0.35)]"
                : "border-white/80 bg-white/80 shadow-[0_30px_90px_rgba(55,31,13,0.12)] backdrop-blur"
            }`}
          >
            <h2 className="text-[34px] font-black">Оставить отзыв</h2>

            <div className="mt-7 grid gap-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше имя"
                className={fieldClass(isDark)}
              />

              <div className="flex flex-wrap gap-2">
                {types.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setType(item)}
                    className={`rounded-full px-5 py-3 font-black transition ${
                      type === item
                        ? "bg-[#ff6b00] text-white"
                        : isDark
                        ? "bg-white/10 text-white hover:bg-white/15"
                        : "bg-white text-black/70 hover:text-[#ff6b00]"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between"><p className="font-black">Ваша оценка</p><span className="text-sm font-bold text-[#ff6b00]">{rating ? `${rating} из 5` : "Не выбрана"}</span></div>
                <div className="flex gap-1 text-[38px] text-[#ff6b00]" onMouseLeave={() => setHoverRating(0)}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" aria-label={`Поставить ${star} из 5`} onMouseEnter={() => setHoverRating(star)} onFocus={() => setHoverRating(star)} onBlur={() => setHoverRating(0)} onClick={() => setRating(star)} className="rounded-xl p-1 transition hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/40">
                      {star <= (hoverRating || rating) ? <RiStarFill /> : <RiStarLine />}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                placeholder="Напишите ваш отзыв или предложение"
                className={`${fieldClass(isDark)} resize-none`}
              />

              {error && <p className="rounded-[18px] bg-red-500/10 px-5 py-4 font-bold text-red-500">{error}</p>}
              {success && <p className="rounded-[18px] bg-green-500/10 px-5 py-4 font-bold text-green-500">{success}</p>}

              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ff6b00] px-7 py-4 font-black text-white shadow-[0_16px_42px_rgba(255,107,0,0.38)] transition hover:scale-[1.02]"
              >
                Отправить отзыв
                <RiSendPlaneLine />
              </button>
            </div>
          </div>
        </div>

        {reviews.length > 0 && (
          <div className="mt-12">
            <h2 className="text-[36px] font-black">Последние отзывы</h2>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {reviews.slice(0, 6).map((item) => (
                <div
                  key={item._id}
                  className={`rounded-[26px] border p-6 ${
                    isDark
                      ? "border-[#2a1608] bg-black/35"
                      : "border-black/5 bg-[#f8f4ee]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-black">{item.name}</h3>
                    <span className="rounded-full bg-[#ff6b00]/15 px-3 py-1 text-sm font-black text-[#ff6b00]">
                      {item.category}
                    </span>
                  </div>

                  <div className="mt-3 flex text-[#ff6b00]">
                    {[1, 2, 3, 4, 5].map((star) =>
                      star <= item.rating ? <RiStarFill key={star} /> : <RiStarLine key={star} />
                    )}
                  </div>

                  <p className={isDark ? "mt-3 text-white/60" : "mt-3 text-black/60"}>
                    {item.message}
                  </p>

                  <p className="mt-4 text-sm text-[#ff6b00]">
                    {new Date(item.createdAt).toLocaleString("ru-RU")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
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
  isDark,
}: {
  icon: React.ReactNode;
  title: string;
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
    </div>
  );
}
