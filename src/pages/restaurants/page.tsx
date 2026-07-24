import { Link } from "react-router";
import { FaStar } from "react-icons/fa";
import { restaurants } from "../../defaults/restaurant.data";
import restaurantsBg from "../../assets/restaurants_bg.webp";
import { useThemeStore } from "../../stores/theme.store";
import { Container } from "../../widgets/container";

function formatSum(value: number) {
  return `${value.toLocaleString("ru-RU")} сум`;
}

export const RestaurantsPage = () => {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";

  return (
    <main
      className={`min-h-screen pb-20 pt-[120px] transition-all lg:pt-[150px] ${
        isDark ? "bg-black text-white" : "bg-[#f6f1ea] text-[#171717]"
      }`}
    >
      <Container>
        <section className="relative mb-10 overflow-hidden rounded-[30px] bg-black lg:mb-16 lg:rounded-[40px]">
          <img
            src={restaurantsBg}
            alt="Restaurants"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/60" />

          <div className="relative z-10 px-5 py-16 sm:px-8 lg:px-16 lg:py-24">
            <div className="max-w-[760px]">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 backdrop-blur-md lg:px-5">
                <span className="text-[12px] font-black text-orange-500 lg:text-[14px]">
                  ClickEat Restaurants
                </span>
              </div>

              <h1 className="mb-5 text-[38px] font-black leading-tight text-white sm:text-[52px] lg:text-7xl">
                Лучшие{" "}
                <span className="text-orange-500">рестораны</span>
              </h1>

              <p className="max-w-[620px] text-[15px] leading-7 text-white/80 sm:text-[17px] lg:text-xl">
                Открывайте новые рестораны, premium кухни и уникальные блюда
                в фирменном стиле ClickEat.
              </p>
            </div>
          </div>
        </section>

        <section className="restaurants-page">
          <div className="restaurants-container">
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {restaurants.map((restaurant) => (
                <Link
                  key={restaurant.id}
                  to={`/restaurant/${restaurant.id}`}
                  className={`group overflow-hidden rounded-[24px] border transition active:scale-[0.98] lg:rounded-[30px] lg:hover:-translate-y-1 ${
                    isDark
                      ? "border-[#2a1608] bg-[#121212]"
                      : "border-[#f0e7de] bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
                  }`}
                >
                  <div className="relative h-[130px] overflow-hidden sm:h-[170px] lg:h-[270px]">
                    <img
                      src={restaurant.image}
                      alt={restaurant.title}
                      className="h-full w-full object-cover transition duration-500 lg:group-hover:scale-105"
                    />

                    <b className="absolute bottom-0 right-3 rounded-t-[16px] bg-white px-3 py-2 text-[11px] font-black text-[#2f3542] shadow-lg sm:text-[13px] lg:right-5 lg:px-5 lg:py-3 lg:text-[15px]">
                      {restaurant.deliveryTime}
                    </b>
                  </div>

                  <div className="p-3 sm:p-4 lg:p-7">
                    <h2
                      className={`line-clamp-2 text-[16px] font-black leading-tight sm:text-[20px] lg:text-[28px] ${
                        isDark ? "text-white" : "text-[#2f3542]"
                      }`}
                    >
                      {restaurant.title}
                    </h2>

                    <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3 lg:mt-5">
                      <span className="inline-flex items-center gap-1 text-[13px] font-black text-[#ffb300] sm:text-[15px]">
                        <FaStar />
                        {restaurant.rating}
                      </span>

                      <p
                        className={`text-[12px] sm:text-[14px] lg:text-[16px] ${
                          isDark ? "text-white/55" : "text-[#8C8C8C]"
                        }`}
                      >
                        От {formatSum(restaurant.priceFrom)}
                      </p>
                    </div>

                    <strong className="mt-3 inline-flex rounded-full bg-[#fff3e8] px-3 py-1.5 text-[11px] font-black text-[#ff6b00] lg:mt-5 lg:px-5 lg:py-3 lg:text-[14px]">
                      {restaurant.category}
                    </strong>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
};