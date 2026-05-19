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
      className={`min-w-[360px] px-3 pb-5 pt-10 sm:px-5 sm:pb-8 sm:pt-16 ${
        isDark ? "bg-black text-white" : "bg-[#f6f1ea] text-[#171717]"
      }`}
    >
      <Container>
        <div
          className={`rounded-[24px] border p-5 shadow-[0_14px_40px_rgba(0,0,0,0.08)] sm:rounded-[34px] sm:p-8 ${
            isDark
              ? "border-[#2a1608] bg-[#0f0f0f]"
              : "border-black/5 bg-white"
          }`}
        >
          <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:text-left">
              <Link
                to="/"
                className="inline-flex shrink-0 rounded-[18px] bg-white p-3 shadow-sm"
              >
                <img
                  src={Logo}
                  alt="ClickEat"
                  className="w-[78px] sm:w-[92px]"
                />
              </Link>

              <div className="min-w-0">
                <h3 className="text-[22px] font-black text-[#ff6b00] sm:text-[24px]">
                  ClickEat
                </h3>

                <p
                  className={`mx-auto mt-2 max-w-[430px] text-[14px] leading-6 sm:mx-0 sm:text-[15px] ${
                    isDark ? "text-white/55" : "text-black/55"
                  }`}
                >
                  Premium food delivery — рестораны, меню и любимые блюда в
                  одном месте.
                </p>

                <nav className="mt-5 grid grid-cols-2 gap-3 text-[14px] font-bold sm:flex sm:flex-wrap sm:gap-5 sm:text-[15px]">
                  <FooterLink to="/restaurants">Рестораны</FooterLink>
                  <FooterLink to="/menu">Меню</FooterLink>
                  <FooterLink to="/orders">Заказы</FooterLink>
                  <FooterLink to="/contact">Контакты</FooterLink>
                </nav>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 lg:items-end">
              <p
                className={`text-[14px] font-semibold ${
                  isDark ? "text-white/45" : "text-black/45"
                }`}
              >
                Мы в соцсетях
              </p>

              <div className="flex items-center gap-3 sm:gap-4">
                <SocialIcon type="instagram" />
                <SocialIcon type="facebook" />
                <SocialIcon type="telegram" />
              </div>
            </div>
          </div>

          <div
            className={`mt-7 flex flex-col gap-2 border-t pt-5 text-center text-[13px] sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:text-left sm:text-[14px] ${
              isDark
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

function FooterLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      className="rounded-full bg-[#fff3eb] px-4 py-2 text-center text-[#2f3542] transition hover:bg-[#ff6b00] hover:text-white"
      to={to}
    >
      {children}
    </Link>
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
      className={`flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[#fff3eb] text-[20px] text-[#ff6b00] transition-all duration-300 hover:scale-110 hover:text-white sm:h-[52px] sm:w-[52px] sm:text-[22px] ${hover}`}
    >
      <Icon />
    </a>
  );
}