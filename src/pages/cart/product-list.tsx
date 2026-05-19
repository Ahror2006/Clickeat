import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { Container } from "../../widgets/container";
import { clearCart, getCart, saveCart, type CartItem } from "../../lib/cart";
import { useAuth } from "../../stores/auth.store";
import { useThemeStore } from "../../stores/theme.store";

function formatSum(value: number) {
  return `${value.toLocaleString("ru-RU")} сум`;
}

export const ProductList = () => {
  const user = useAuth((state) => state.user);

  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";

  const [cart, setCart] = useState<CartItem[]>(getCart());

  useEffect(() => {
    const updateCart = () => setCart(getCart());

    window.addEventListener("cart-updated", updateCart);

    return () => {
      window.removeEventListener("cart-updated", updateCart);
    };
  }, []);

  const totalPrice = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );
  }, [cart]);

  const totalCount = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0
    );
  }, [cart]);

  const updateCart = (nextCart: CartItem[]) => {
    saveCart(nextCart);
    setCart(nextCart);
  };

  const handlePlus = (id: number | string) => {
    const nextCart = cart.map((item) =>
      String(item.id) === String(id)
        ? { ...item, quantity: (item.quantity || 1) + 1 }
        : item
    );

    updateCart(nextCart);
  };

  const handleMinus = (id: number | string) => {
    const nextCart = cart
      .map((item) =>
        String(item.id) === String(id)
          ? { ...item, quantity: (item.quantity || 1) - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    updateCart(nextCart);
  };

  const handleRemove = (id: number | string) => {
    const nextCart = cart.filter(
      (item) => String(item.id) !== String(id)
    );

    updateCart(nextCart);
  };

  const handleBuy = () => {
    const confirmed = confirm(
      "Вы действительно хотите оформить заказ?"
    );

    if (!confirmed) return;

    clearCart();
    setCart([]);

    alert("Заказ успешно оформлен!");
  };

  if (!user.email) {
    return (
      <Container>
        <section
          className={`flex min-h-[55vh] flex-col items-center justify-center rounded-[34px] border p-8 text-center ${
            isDark
              ? "border-[#2b1708] bg-[#101010]"
              : "border-black/10 bg-white"
          }`}
        >
          <h2 className="text-[30px] font-black">
            Войдите в аккаунт
          </h2>

          <p
            className={`mt-3 max-w-[420px] text-[15px] ${
              isDark ? "text-white/55" : "text-black/55"
            }`}
          >
            Чтобы оформить заказ, сначала нужно авторизоваться.
          </p>

          <Link
            to="/login"
            className="mt-6 rounded-full bg-[#ff6b00] px-8 py-4 text-[15px] font-black text-white"
          >
            Войти
          </Link>
        </section>
      </Container>
    );
  }

  if (!cart.length) {
    return (
      <Container>
        <section
          className={`flex min-h-[55vh] flex-col items-center justify-center rounded-[34px] border p-8 text-center ${
            isDark
              ? "border-[#2b1708] bg-[#101010]"
              : "border-black/10 bg-white"
          }`}
        >
          <h2 className="text-[32px] font-black">
            Корзина пустая
          </h2>

          <p
            className={`mt-3 max-w-[420px] text-[15px] ${
              isDark ? "text-white/55" : "text-black/55"
            }`}
          >
            Добавь любимые блюда из меню, и они появятся здесь.
          </p>

          <Link
            to="/menu"
            className="mt-6 rounded-full bg-[#ff6b00] px-8 py-4 text-[15px] font-black text-white"
          >
            Открыть меню
          </Link>
        </section>
      </Container>
    );
  }

  return (
    <section>
      <Container>
        <div className="mb-7">
          <span className="inline-flex rounded-full bg-[#fff3e8] px-4 py-2 text-[12px] font-black text-[#ff6b00]">
            ClickEat Cart
          </span>

          <h1 className="mt-3 text-[34px] font-black leading-tight lg:text-[48px]">
            Корзина
          </h1>

          <p
            className={
              isDark
                ? "mt-2 text-white/55"
                : "mt-2 text-black/55"
            }
          >
            Всего товаров: {totalCount}
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
          <ul className="grid gap-4">
            {cart.map((item) => (
              <li
                key={item.id}
                className={`overflow-hidden rounded-[24px] border lg:rounded-[30px] ${
                  isDark
                    ? "border-[#2b1708] bg-[#101010]"
                    : "border-black/10 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
                }`}
              >
                <div className="flex gap-3 p-3 sm:gap-4 sm:p-4 lg:p-5">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-[82px] w-[82px] shrink-0 rounded-[18px] object-cover sm:h-[95px] sm:w-[95px] lg:h-[115px] lg:w-[115px] lg:rounded-[24px]"
                  />

                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <h3 className="line-clamp-2 text-[15px] font-black leading-tight sm:text-[18px] lg:text-[22px]">
                        {item.title}
                      </h3>

                      <p
                        className={`mt-1 line-clamp-1 text-[12px] sm:text-[13px] ${
                          isDark
                            ? "text-white/45"
                            : "text-black/45"
                        }`}
                      >
                        {item.description || "ClickEat menu"}
                      </p>

                      <p className="mt-2 text-[14px] font-black text-[#ff6b00] sm:text-[16px] lg:text-[20px]">
                        {formatSum(item.price)}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 rounded-full bg-[#ff6b00] px-2 py-2 lg:gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            handleMinus(item.id)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[18px] font-black text-[#ff6b00] active:scale-95 lg:h-8 lg:w-8"
                        >
                          -
                        </button>

                        <span className="min-w-[20px] text-center text-[14px] font-black text-white lg:text-[16px]">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            handlePlus(item.id)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[18px] font-black text-[#ff6b00] active:scale-95 lg:h-8 lg:w-8"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemove(item.id)
                        }
                        className="text-[12px] font-black text-red-500 sm:text-[13px]"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside
            className={`h-fit rounded-[28px] border p-5 lg:sticky lg:top-[140px] lg:rounded-[32px] ${
              isDark
                ? "border-[#2b1708] bg-[#101010]"
                : "border-black/10 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
            }`}
          >
            <h2 className="text-[24px] font-black">
              Итого
            </h2>

            <div className="mt-5 space-y-3">
              <div className="flex justify-between text-[15px]">
                <span
                  className={
                    isDark
                      ? "text-white/55"
                      : "text-black/55"
                  }
                >
                  Товары
                </span>

                <b>{totalCount}</b>
              </div>

              <div className="flex justify-between text-[18px] lg:text-[22px]">
                <span className="font-black">Сумма</span>

                <b className="text-[#ff6b00]">
                  {formatSum(totalPrice)}
                </b>
              </div>
            </div>

            <button
              type="button"
              onClick={handleBuy}
              className="mt-6 w-full rounded-full bg-[#ff6b00] py-4 text-[15px] font-black text-white transition hover:bg-[#ff7f1f]"
            >
              Оформить заказ
            </button>
          </aside>
        </div>
      </Container>
    </section>
  );
};