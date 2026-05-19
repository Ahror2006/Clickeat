import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Container } from "../../widgets/container";
import { menuItems, type MenuCategory } from "../../defaults/menu.data";
import { useThemeStore } from "../../stores/theme.store";

function shuffle<T>(array: T[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

function formatSum(value: number) {
  return `${value.toLocaleString("ru-RU")} сум`;
}

const categoryLabels: Record<MenuCategory, string> = {
  rolls: "Rolls",
  pizza: "Pizza",
  fastfood: "Fast Food",
  home: "Home Food",
  ramen: "Ramen",
  grill: "Grill",
};

export const FeaturedMenu = () => {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";

  const [visibleItems, setVisibleItems] = useState(() =>
    shuffle(menuItems).slice(0, 4)
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      setVisibleItems(shuffle(menuItems).slice(0, 4));
    }, 4500);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section id="menu" className="featured-menu-section py-8 lg:py-14">
      <Container>
        <div className="mb-6 flex items-end justify-between gap-4 lg:mb-9">
          <div>
            <span className="inline-flex rounded-full bg-[#fff3e8] px-4 py-2 text-[12px] font-black text-[#ff6b00]">
              ClickEat Menu
            </span>

            <h2
              className={`mt-4 text-[34px] font-black leading-tight sm:text-[40px] lg:text-[46px] ${
                isDark ? "text-white" : "text-[#2f3542]"
              }`}
            >
              Популярные блюда
            </h2>

            <p
              className={`mt-2 max-w-[650px] text-[15px] leading-6 sm:text-[17px] ${
                isDark ? "text-white/55" : "text-[#8C8C8C]"
              }`}
            >
              Быстрый выбор популярных блюд ClickEat.
            </p>
          </div>

          <Link
            to="/menu"
            className="hidden rounded-full bg-[#ff6b00] px-7 py-4 text-[15px] font-black text-white shadow-[0_12px_24px_rgba(255,107,0,0.22)] transition hover:scale-[1.03] md:inline-flex"
          >
            Открыть всё меню
          </Link>
        </div>

        <ul className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
          {visibleItems.slice(0, 3).map((item) => (
            <li key={item.id} className="animate-[fadeIn_.35s_ease]">
              <Link
                to={`/menu?category=${item.category}&restaurant=${item.restaurant_id}`}
                className={`group block h-full overflow-hidden rounded-[24px] border transition active:scale-[0.98] lg:rounded-[30px] lg:hover:-translate-y-1 ${
                  isDark
                    ? "border-[#2a1608] bg-[#121212]"
                    : "border-[#f0e7de] bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
                }`}
              >
                <div className="relative h-[122px] overflow-hidden sm:h-[160px] lg:h-[260px]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-500 lg:group-hover:scale-105"
                  />

                  <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-[11px] font-black text-[#ff6b00] sm:text-[12px] lg:left-5 lg:top-5 lg:px-5 lg:py-3 lg:text-[14px]">
                    {categoryLabels[item.category]}
                  </span>

                  <strong className="absolute bottom-3 left-3 hidden rounded-full bg-[#ff6b00] px-5 py-3 text-[14px] font-black text-white lg:inline-flex">
                    Открыть меню
                  </strong>
                </div>

                <div className="p-3 sm:p-4 lg:p-7">
                  <h3
                    className={`line-clamp-2 min-h-[42px] text-[16px] font-black leading-tight sm:text-[19px] lg:min-h-0 lg:text-[28px] ${
                      isDark ? "text-white" : "text-[#2f3542]"
                    }`}
                  >
                    {item.name}
                  </h3>

                  <p
                    className={`mt-2 hidden text-[14px] leading-6 lg:line-clamp-1 lg:block lg:text-[16px] ${
                      isDark ? "text-white/55" : "text-[#8C8C8C]"
                    }`}
                  >
                    {item.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between border-t border-[#f0e0d5] pt-3 lg:mt-8 lg:pt-6">
                    <span
                      className={`hidden text-[13px] font-black sm:inline ${
                        isDark ? "text-white/45" : "text-[#8C8C8C]"
                      }`}
                    >
                      ClickEat menu
                    </span>

                    <b className="text-[15px] font-black text-[#ff6b00] sm:text-[17px] lg:text-[26px]">
                      {formatSum(item.price)}
                    </b>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <Link
          to="/menu"
          className="mt-6 flex justify-center rounded-full bg-[#ff6b00] px-7 py-4 text-[15px] font-black text-white md:hidden"
        >
          Открыть всё меню
        </Link>
      </Container>
    </section>
  );
};