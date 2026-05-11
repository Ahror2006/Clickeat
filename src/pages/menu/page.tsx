import { Link, useSearchParams } from "react-router";
import { Container } from "../../widgets/container";
import { type MenuCategory, menuItems } from "../../defaults/menu.data";
import { useThemeStore } from "../../stores/theme.store";

function formatSum(value: number) {
  return `${value.toLocaleString("ru-RU")} сум`;
}

const categories: { label: string; value: "all" | MenuCategory }[] = [
  { label: "Все", value: "all" },
  { label: "Роллы", value: "rolls" },
  { label: "Пицца", value: "pizza" },
  { label: "Fast Food", value: "fastfood" },
  { label: "Home Food", value: "home" },
  { label: "Рамен", value: "ramen" },
  { label: "Гриль", value: "grill" },
];

const categoryLabels: Record<MenuCategory, string> = {
  rolls: "Rolls",
  pizza: "Pizza",
  fastfood: "Fast Food",
  home: "Home Food",
  ramen: "Ramen",
  grill: "Grill",
};

export const MenuPage = () => {
  const [searchParams] = useSearchParams();
  const theme = useThemeStore((state) => state.theme);

  const isDark = theme === "dark";

  const category = searchParams.get("category") || "all";
  const restaurantId = searchParams.get("restaurant");
  const query = searchParams.get("query") || "";

  const filteredItems = menuItems.filter((item) => {
    const categoryMatch = category === "all" || item.category === category;

    const restaurantMatch =
      !restaurantId || item.restaurant_id === Number(restaurantId);

    const queryMatch =
      !query ||
      `${item.name} ${item.description} ${item.category}`
        .toLowerCase()
        .includes(query.toLowerCase());

    return categoryMatch && restaurantMatch && queryMatch;
  });

  return (
    <main
      className={`min-h-screen pb-20 pt-[150px] transition-all ${
        isDark ? "bg-black text-white" : "bg-[#f6f1ea] text-[#171717]"
      }`}
    >
      <Container>
        <section className="mb-10">
          <div className="flex flex-wrap gap-4">
            {categories.map((item) => {
              const isActive = category === item.value;

              return (
                <Link
                  key={item.value}
                  to={`/menu?category=${item.value}${
                    restaurantId ? `&restaurant=${restaurantId}` : ""
                  }${query ? `&query=${query}` : ""}`}
                  className={`rounded-full px-6 py-3 text-[15px] font-bold transition-all duration-300 ${
                    isActive
                      ? "bg-[#ff6b00] text-white shadow-[0_0_30px_rgba(255,107,0,0.45)]"
                      : isDark
                      ? "border border-[#2c2c2c] bg-[#111] text-white/70 hover:border-[#ff6b00] hover:text-white"
                      : "border border-black/10 bg-white text-black/60 hover:border-[#ff6b00] hover:text-[#ff6b00]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </section>

        {query && (
          <div className="mb-8">
            <h2 className="text-[32px] font-black">Результаты поиска:</h2>

            <p className={isDark ? "mt-2 text-white/60" : "mt-2 text-black/60"}>
              По запросу:{" "}
              <span className="font-bold text-[#ff6b00]">{query}</span>
            </p>
          </div>
        )}

        {filteredItems.length > 0 ? (
          <section className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => (
              <article
                key={item.id}
                className={`group overflow-hidden rounded-[34px] border transition-all duration-500 hover:-translate-y-1 hover:border-[#ff6b00] ${
                  isDark
                    ? "border-[#2b1708] bg-[#090909] shadow-[0_12px_50px_rgba(0,0,0,0.45)]"
                    : "border-black/10 bg-white shadow-[0_12px_50px_rgba(0,0,0,0.12)]"
                }`}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-[340px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                  <div className="absolute left-5 top-5">
                    <span className="rounded-full bg-white px-4 py-2 text-[13px] font-black text-[#ff6b00] shadow-lg">
                      {categoryLabels[item.category]}
                    </span>
                  </div>
                </div>

                <div className="p-7">
                  <h3
                    className={`text-[38px] font-black leading-none ${
                      isDark ? "text-white" : "text-[#171717]"
                    }`}
                  >
                    {item.name}
                  </h3>

                  <p
                    className={`mt-4 min-h-[56px] text-[18px] leading-relaxed ${
                      isDark ? "text-white/70" : "text-black/60"
                    }`}
                  >
                    {item.description}
                  </p>

                  <div className="mt-8 flex items-center justify-between">
                    <div>
                      <p className={isDark ? "text-[15px] text-white/40" : "text-[15px] text-black/40"}>
                        ClickEat menu
                      </p>

                      <p className="mt-1 text-[24px] font-black text-[#ff6b00]">
                        {formatSum(item.price)}
                      </p>
                    </div>

                    <Link
                      to={`/restaurant/${item.restaurant_id}`}
                      className="rounded-full bg-[#ff6b00] px-7 py-4 text-[15px] font-black text-white transition-all duration-300 hover:scale-105 hover:bg-[#ff7f1f]"
                    >
                      К ресторану
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <div
            className={`flex min-h-[400px] flex-col items-center justify-center rounded-[40px] border text-center ${
              isDark
                ? "border-[#1c1c1c] bg-[#090909]"
                : "border-black/10 bg-white shadow-[0_12px_50px_rgba(0,0,0,0.08)]"
            }`}
          >
            <h2
              className={`text-[52px] font-black ${
                isDark ? "text-white" : "text-[#171717]"
              }`}
            >
              Ничего не найдено
            </h2>

            <p
              className={`mt-4 max-w-[500px] text-[18px] leading-relaxed ${
                isDark ? "text-white/50" : "text-black/50"
              }`}
            >
              Попробуй изменить запрос или выбрать другую категорию меню.
            </p>
          </div>
        )}
      </Container>
    </main>
  );
};