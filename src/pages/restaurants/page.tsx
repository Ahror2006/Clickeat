import { Link } from "react-router";
import { FaStar } from "react-icons/fa";
import { restaurants } from "../../defaults/restaurant.data";
import restaurantsBg from "../../assets/restaurants_bg.png";
import { useThemeStore } from "../../stores/theme.store";

function formatSum(value: number) {
  return `${value.toLocaleString("ru-RU")} сум`;
}

export const RestaurantsPage = () => {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";

  return (
    <main
      className={`min-h-screen pb-20 pt-[150px] transition-all ${isDark ? "bg-black text-white" : "bg-[#f6f1ea] text-[#171717]"
        }`}
    >
      <section className="relative mb-16 overflow-hidden rounded-[40px] bg-black">
        <img
          src={restaurantsBg}
          alt="Restaurants"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/58" />

        <div className="relative z-10 px-10 py-24 md:px-16">
          <div className="max-w-[700px]">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-5 py-2 backdrop-blur-md">
              <span className="font-bold text-orange-500">
                ClickEat Restaurants
              </span>
            </div>

            <h1 className="mb-6 text-5xl font-black leading-tight text-white md:text-7xl">
              Лучшие <span className="text-orange-500">рестораны</span>
            </h1>

            <p className="mb-4 text-xl leading-relaxed text-white/80">
              Открывайте новые рестораны, premium кухни и уникальные блюда
              в фирменном стиле ClickEat.
            </p>
          </div>
        </div>
      </section>

      <section className="restaurants-page">
        <div className="restaurants-container">
          <div className="restaurants-grid">
            {restaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                to={`/restaurant/${restaurant.id}`}
                className="restaurants-card"
              >
                <div className="restaurants-card-img">
                  <img src={restaurant.image} alt={restaurant.title} />
                  <b>{restaurant.deliveryTime}</b>
                </div>

                <div className="restaurants-card-body">
                  <h2>{restaurant.title}</h2>

                  <div className="restaurants-meta">
                    <span>
                      <FaStar />
                      {restaurant.rating}
                    </span>

                    <p>От {formatSum(restaurant.priceFrom)}</p>
                  </div>

                  <strong>{restaurant.category}</strong>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};