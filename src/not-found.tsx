import { Link } from "react-router";
import { RiArrowLeftLine, RiRestaurant2Line } from "react-icons/ri";
import { useThemeStore } from "./stores/theme.store";

export const NotFoundPage = () => {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";

  return (
    <main
      className={`min-h-screen px-5 pb-20 pt-[170px] transition ${
        isDark ? "bg-black text-white" : "bg-[#f6f1ea] text-[#171717]"
      }`}
    >
      <section
        className={`mx-auto max-w-[1050px] overflow-hidden rounded-[42px] p-10 text-center md:p-16 ${
          isDark
            ? "border border-[#2a1608] bg-[#0f0f0f] shadow-[0_25px_80px_rgba(0,0,0,0.45)]"
            : "border border-black/5 bg-white shadow-[0_25px_80px_rgba(0,0,0,0.10)]"
        }`}
      >
        <div className="mx-auto flex h-[110px] w-[110px] items-center justify-center rounded-full bg-[#ff6b00]/15 text-[#ff6b00]">
          <RiRestaurant2Line className="text-[56px]" />
        </div>

        <p className="mt-8 text-[95px] font-black leading-none text-[#ff6b00] md:text-[150px]">
          404
        </p>

        <h1 className="mt-4 text-[34px] font-black md:text-[54px]">
          Страница не найдена
        </h1>

        <p
          className={`mx-auto mt-4 max-w-[650px] text-[18px] leading-8 ${
            isDark ? "text-white/60" : "text-black/55"
          }`}
        >
          Кажется, это блюдо исчезло из меню. Вернись на главную или открой
          каталог ClickEat.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#ff6b00] px-7 py-4 text-[16px] font-black text-white shadow-[0_12px_35px_rgba(255,107,0,0.35)] transition hover:scale-105"
          >
            <RiArrowLeftLine />
            На главную
          </Link>

          <Link
            to="/menu"
            className={`inline-flex items-center gap-2 rounded-full px-7 py-4 text-[16px] font-black transition hover:bg-[#ff6b00] hover:text-white ${
              isDark
                ? "border border-[#2a1608] bg-white/10 text-white"
                : "border border-black/10 bg-black/5 text-[#171717]"
            }`}
          >
            Открыть меню
          </Link>
        </div>
      </section>
    </main>
  );
};