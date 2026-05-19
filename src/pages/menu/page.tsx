import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Container } from "../../widgets/container";
import { type MenuCategory, menuItems } from "../../defaults/menu.data";
import { useThemeStore } from "../../stores/theme.store";
import { addToCart, getCart, saveCart } from "../../lib/cart";

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

  const [cart, setCart] = useState(getCart());

  useEffect(() => {
    const updateCart = () => setCart(getCart());

    window.addEventListener("cart-updated", updateCart);

    return () => {
      window.removeEventListener("cart-updated", updateCart);
    };
  }, []);

  const category = searchParams.get("category") || "all";
  const restaurantId = searchParams.get("restaurant");
  const query = searchParams.get("query") || "";

  const filteredItems = menuItems.filter((item) => {
    const categoryMatch =
      category === "all" || item.category === category;

    const restaurantMatch =
      !restaurantId ||
      item.restaurant_id === Number(restaurantId);

    const queryMatch =
      !query ||
      `${item.name} ${item.description} ${item.category}`
        .toLowerCase()
        .includes(query.toLowerCase());

    return categoryMatch && restaurantMatch && queryMatch;
  });

  const getItemQuantity = (id: number | string) => {
    const item = cart.find(
      (cartItem) => String(cartItem.id) === String(id)
    );

    return item?.quantity || 0;
  };

  const handleAdd = (item: (typeof menuItems)[number]) => {
    addToCart({
      id: item.id,
      title: item.name,
      image: item.image,
      price: item.price,
      restaurant: String(item.restaurant_id),
      description: item.description,
    });

    setCart(getCart());
  };

  const handleMinus = (id: number | string) => {
    const current = cart.find(
      (cartItem) => String(cartItem.id) === String(id)
    );

    if (!current) return;

    const nextCart =
      current.quantity <= 1
        ? cart.filter(
            (cartItem) =>
              String(cartItem.id) !== String(id)
          )
        : cart.map((cartItem) =>
            String(cartItem.id) === String(id)
              ? {
                  ...cartItem,
                  quantity: cartItem.quantity - 1,
                }
              : cartItem
          );

    saveCart(nextCart);
    setCart(nextCart);
  };

  return (
    <main
      className={`min-h-screen pb-16 pt-[120px] transition-all lg:pt-[150px] ${
        isDark
          ? "bg-black text-white"
          : "bg-[#f6f1ea] text-[#171717]"
      }`}
    >
      <Container>
        <section className="mb-8 lg:mb-12">
          <span
            className={`inline-flex rounded-full px-4 py-2 text-[12px] font-black ${
              isDark
                ? "bg-[#171717] text-[#ff6b00]"
                : "bg-[#fff3e8] text-[#ff6b00]"
            }`}
          >
            ClickEat Menu
          </span>

          <h1
            className={`mt-4 text-[38px] font-black leading-tight sm:text-[52px] lg:text-7xl ${
              isDark ? "text-white" : "text-[#2f3542]"
            }`}
          >
            Меню блюд
          </h1>

          <p
            className={`mt-3 max-w-[620px] text-[15px] leading-7 sm:text-[17px] ${
              isDark ? "text-white/60" : "text-black/55"
            }`}
          >
            Выбери категорию и добавь любимые блюда в корзину.
          </p>

          <div className="mt-6 flex gap-3 overflow-x-auto pb-2 sm:flex-wrap">
            {categories.map((item) => {
              const isActive = category === item.value;

              return (
                <Link
                  key={item.value}
                  to={`/menu?category=${item.value}${
                    query ? `&query=${query}` : ""
                  }`}
                  className={`shrink-0 rounded-full px-5 py-3 text-[14px] font-black transition-all ${
                    isActive
                      ? "bg-[#ff6b00] text-white shadow-[0_0_28px_rgba(255,107,0,0.42)]"
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

        {filteredItems.length > 0 ? (
          <section className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => {
              const quantity = getItemQuantity(item.id);

              return (
                <article
                  key={item.id}
                  className={`group overflow-hidden rounded-[24px] border transition-all duration-300 active:scale-[0.98] lg:rounded-[30px] lg:hover:-translate-y-1 ${
                    isDark
                      ? "border-[#2b1708] bg-[#121212]"
                      : "border-black/10 bg-white shadow-[0_12px_28px_rgba(0,0,0,0.12)]"
                  }`}
                >
                  <Link
                    to={`/restaurant/${item.restaurant_id}`}
                  >
                    <div className="relative h-[125px] overflow-hidden sm:h-[180px] lg:h-[260px]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover transition duration-500 lg:group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                      <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-[10px] font-black text-[#ff6b00] shadow-lg sm:text-[12px] lg:left-5 lg:top-5 lg:px-5 lg:py-3 lg:text-[14px]">
                        {categoryLabels[item.category]}
                      </span>
                    </div>

                    <div className="p-3 sm:p-4 lg:p-6">
                      <h3
                        className={`line-clamp-2 min-h-[38px] text-[15px] font-black leading-tight sm:text-[18px] lg:min-h-[58px] lg:text-[24px] ${
                          isDark
                            ? "text-white"
                            : "text-[#2f3542]"
                        }`}
                      >
                        {item.name}
                      </h3>

                      <p
                        className={`mt-2 hidden text-[14px] leading-6 lg:line-clamp-2 lg:block ${
                          isDark
                            ? "text-white/55"
                            : "text-[#8C8C8C]"
                        }`}
                      >
                        {item.description}
                      </p>

                      <div className="mt-3 flex items-center justify-between lg:mt-5">
                        <p className="text-[14px] font-black text-[#ff6b00] sm:text-[18px] lg:text-[24px]">
                          {formatSum(item.price)}
                        </p>
                      </div>

                      {quantity > 0 ? (
                        <div
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                          }}
                          className="mt-4 flex items-center justify-between rounded-[16px] bg-[#ff7a00] px-3 py-2.5 lg:rounded-[18px] lg:px-4 lg:py-3"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              handleMinus(item.id)
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[20px] font-black text-[#ff7a00] active:scale-95"
                          >
                            -
                          </button>

                          <span className="text-[15px] font-black text-white">
                            {quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleAdd(item)}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[20px] font-black text-[#ff7a00] active:scale-95"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            handleAdd(item);
                          }}
                          className="mt-4 w-full rounded-[16px] bg-[#ff7a00] py-3 text-[14px] font-black text-white transition hover:bg-[#ff8c1a]"
                        >
                          В корзину
                        </button>
                      )}
                    </div>
                  </Link>
                </article>
              );
            })}
          </section>
        ) : (
          <div
            className={`flex min-h-[320px] flex-col items-center justify-center rounded-[32px] border p-6 text-center ${
              isDark
                ? "border-[#1c1c1c] bg-[#090909]"
                : "border-black/10 bg-white"
            }`}
          >
            <h2 className="text-[30px] font-black">
              Ничего не найдено
            </h2>

            <p
              className={`mt-4 max-w-[500px] text-[15px] leading-relaxed ${
                isDark
                  ? "text-white/50"
                  : "text-black/50"
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