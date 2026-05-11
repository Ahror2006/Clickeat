import { Link } from "react-router";
import { FaInstagram, FaFacebookF, FaTelegramPlane } from "react-icons/fa";
import Logo from "../assets/logo.jpg";
import { Container } from "../widgets/container";
import { useThemeStore } from "../stores/theme.store";

export const Footer = () => {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";

  return (
    <footer
      className={`px-5 pb-8 pt-16 ${isDark ? "bg-black text-white" : "bg-[#f6f1ea] text-[#171717]"
        }`}
    >
      <Container>
        <div
          className={`rounded-[34px] border p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)] ${isDark
              ? "border-[#2a1608] bg-[#0f0f0f]"
              : "border-black/5 bg-white"
            }`}
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <Link
                to="/"
                className="inline-flex w-fit rounded-[18px] bg-white p-3 shadow-sm"
              >
                <img src={Logo} alt="ClickEat" className="w-[92px]" />
              </Link>

              <div>
                <h3 className="text-[24px] font-black text-[#ff6b00]">
                  ClickEat
                </h3>

                <p
                  className={`mt-1 max-w-[430px] text-[15px] leading-6 ${isDark ? "text-white/55" : "text-black/55"
                    }`}
                >
                  Premium food delivery — рестораны, меню и любимые блюда в
                  одном месте.
                </p>

                <nav className="mt-4 flex flex-wrap gap-5 text-[15px] font-bold">
                  <Link className="transition hover:text-[#ff6b00]" to="/restaurants">
                    Рестораны
                  </Link>
                  <Link className="transition hover:text-[#ff6b00]" to="/menu">
                    Меню
                  </Link>
                  <Link className="transition hover:text-[#ff6b00]" to="/orders">
                    Заказы
                  </Link>
                  <Link className="transition hover:text-[#ff6b00]" to="/contact">
                    Контакты
                  </Link>
                </nav>
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:items-end">
              <p
                className={`text-[14px] font-semibold ${isDark ? "text-white/45" : "text-black/45"
                  }`}
              >
                Мы в соцсетях
              </p>

              <div className="flex items-center gap-4">
                <SocialIcon type="instagram" />
                <SocialIcon type="facebook" />
                <SocialIcon type="telegram" />
              </div>
            </div>
          </div>

          <div
            className={`mt-8 flex flex-col gap-3 border-t pt-5 text-[14px] sm:flex-row sm:items-center sm:justify-between ${isDark
                ? "border-white/10 text-white/40"
                : "border-black/10 text-black/45"
              }`}
          >
            <p>© 2025 ClickEat. Все права защищены.</p>
            <p>Good food • Fast delivery • Premium taste</p>
          </div>
        </div>
      </Container>
    </footer>
  );
};

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
      className={`flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#fff3eb] text-[22px] text-[#ff6b00] transition-all duration-300 hover:scale-110 hover:text-white ${hover}`}
    >
      <Icon />
    </a>
  );
}