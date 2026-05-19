import { useEffect, useState } from "react";
import { Link } from "react-router";
import { FaStar } from "react-icons/fa";
import { Container } from "../../widgets/container";
import { restaurants } from "../../defaults/restaurant.data";
import { useThemeStore } from "../../stores/theme.store";

function shuffle<T>(array: T[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

function formatSum(value: number) {
  return `${value.toLocaleString("ru-RU")} сум`;
}

export const FeaturedRestaurants = () => {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";

  const [visibleRestaurants, setVisibleRestaurants] = useState(() =>
    shuffle(restaurants).slice(0, 4)
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      setVisibleRestaurants(shuffle(restaurants).slice(0, 4));
    }, 7000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section id="restaurants" className="featured-restaurants-section py-8 lg:py-14">
      <Container>
        <div className="mb-6 flex items-end justify-between gap-4 lg:mb-9">
          <div>
            <span className="inline-flex rounded-full bg-[#fff3e8] px-4 py-2 text-[12px] font-black text-[#ff6b00]">
              ClickEat Restaurants
            </span>

            <h2
              className={`mt-4 text-[34px] font-black leading-tight sm:text-[40px] lg:text-[46px] ${
                isDark ? "text-white" : "text-[#2f3542]"
              }`}
            >
              Популярные рестораны
            </h2>

            <p
              className={`mt-2 max-w-[650px] text-[15px] leading-6 sm:text-[17px] ${
                isDark ? "text-white/55" : "text-[#8C8C8C]"
              }`}
            >
              Лучшие заведения, которые выбирают пользователи ClickEat.
            </p>
          </div>

          <Link
            to="/restaurants"
            className="hidden rounded-full bg-[#ff6b00] px-7 py-4 text-[15px] font-black text-white shadow-[0_12px_24px_rgba(255,107,0,0.22)] transition hover:scale-[1.03] md:inline-flex"
          >
            Смотреть все
          </Link>
        </div>

        <ul className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {visibleRestaurants.map((restaurant) => (
            <li key={restaurant.id}>
              <Link
                to={`/restaurant/${restaurant.id}`}
                className={`group block h-full overflow-hidden rounded-[24px] border transition active:scale-[0.98] lg:rounded-[30px] lg:hover:-translate-y-1 ${
                  isDark
                    ? "border-[#2a1608] bg-[#121212]"
                    : "border-[#f0e7de] bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
                }`}
              >
                <div className="relative h-[118px] overflow-hidden sm:h-[150px] lg:h-[260px]">
                  <img
                    src={restaurant.image}
                    alt={restaurant.title}
                    className="h-full w-full object-cover transition duration-500 lg:group-hover:scale-105"
                  />

                  <span className="absolute bottom-0 right-3 rounded-t-[16px] bg-white px-3 py-2 text-[12px] font-black text-[#2f3542] shadow-lg sm:text-[13px] lg:right-5 lg:px-5 lg:py-3 lg:text-[15px]">
                    {restaurant.deliveryTime}
                  </span>
                </div>

                <div className="p-3 sm:p-4 lg:p-7">
                  <h3
                    className={`line-clamp-2 text-[16px] font-black leading-tight sm:text-[19px] lg:text-[28px] ${
                      isDark ? "text-white" : "text-[#2f3542]"
                    }`}
                  >
                    {restaurant.title}
                  </h3>

                  <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3 lg:mt-5">
                    <b className="inline-flex items-center gap-1 text-[13px] text-[#ffb300] sm:text-[15px]">
                      <FaStar />
                      {restaurant.rating}
                    </b>

                    <p
                      className={`text-[12px] sm:text-[14px] lg:text-[16px] ${
                        isDark ? "text-white/55" : "text-[#8C8C8C]"
                      }`}
                    >
                      От {formatSum(restaurant.priceFrom)}
                    </p>
                  </div>

                  <strong className="mt-3 inline-flex rounded-full bg-[#fff3e8] px-3 py-1.5 text-[12px] font-black text-[#ff6b00] lg:mt-5 lg:px-5 lg:py-3 lg:text-[14px]">
                    {restaurant.category}
                  </strong>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <Link
          to="/restaurants"
          className="mt-6 flex justify-center rounded-full bg-[#ff6b00] px-7 py-4 text-[15px] font-black text-white md:hidden"
        >
          Смотреть все
        </Link>
      </Container>
    </section>
  );
};