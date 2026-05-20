import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { Container } from "../../widgets/container";
import { getCart, saveCart, type CartItem } from "../../lib/cart";
import { useAuth } from "../../stores/auth.store";
import { useThemeStore } from "../../stores/theme.store";

function formatSum(value: number) {
  return `${value.toLocaleString("ru-RU")} сум`;
}

export const ProductList = () => {
  const user = useAuth((state) => state.user);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);

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
    return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
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
    const nextCart = cart.filter((item) => String(item.id) !== String(id));
    updateCart(nextCart);
  };

  if (!isAuthenticated || !user.email) {
    return (
      <Container>
        <section
          className={`flex min-h-[55vh] flex-col items-center justify-center rounded-[34px] border p-8 text-center ${
            isDark
              ? "border-[#2b1708] bg-[#101010]"
              : "border-black/10 bg-white"
          }`}
        >
          <h2 className="text-[30px] font-black">Войдите в аккаунт</h2>

          <p className={`mt-3 max-w-[420px] text-[15px] ${isDark ? "text-white/55" : "text-black/55"}`}>
            Чтобы оформить заказ, сначала нужно авторизоваться.
          </p>

          <Link
            to="/login"
            className="mt-6 rounded-full bg-[#ff6b00] px-7 py-3 font-black text-white"
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
          <h2 className="text-[30px] font-black">Корзина пустая</h2>

          <p className={`mt-3 max-w-[420px] text-[15px] ${isDark ? "text-white/55" : "text-black/55"}`}>
            Добавь блюда из меню, потом оформи заказ.
          </p>

          <Link
            to="/menu"
            className="mt-6 rounded-full bg-[#ff6b00] px-7 py-3 font-black text-white"
          >
            Перейти в меню
          </Link>
        </section>
      </Container>
    );
  }

  return (
    <Container>
      <section className="pb-24">
        <div className="mb-6">
          <h1 className="text-[34px] font-black">Корзина</h1>
          <p className={isDark ? "text-white/55" : "text-black/55"}>
            Всего товаров: {totalCount}
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-4">
            {cart.map((item) => (
              <article
                key={item.id}
                className={`flex gap-3 rounded-[28px] border p-3 ${
                  isDark
                    ? "border-[#2b1708] bg-[#101010]"
                    : "border-black/10 bg-white"
                }`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-[90px] w-[90px] rounded-[22px] object-cover"
                />

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="text-[17px] font-black">{item.title}</h3>

                    <p className={`mt-1 text-[13px] ${isDark ? "text-white/50" : "text-black/50"}`}>
                      {item.description}
                    </p>

                    <p className="mt-2 font-black text-[#ff6b00]">
                      {formatSum(item.price)}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 rounded-full bg-[#ff6b00] px-2 py-1.5">
                      <button
                        type="button"
                        onClick={() => handleMinus(item.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white font-black text-[#ff6b00]"
                      >
                        -
                      </button>

                      <b className="min-w-[20px] text-center text-white">
                        {item.quantity}
                      </b>

                      <button
                        type="button"
                        onClick={() => handlePlus(item.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white font-black text-[#ff6b00]"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      className="font-black text-red-500"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside
            className={`h-fit rounded-[30px] border p-5 ${
              isDark
                ? "border-[#2b1708] bg-[#101010]"
                : "border-black/10 bg-white"
            }`}
          >
            <h2 className="text-[26px] font-black">Итого</h2>

            <div className="mt-5 flex items-center justify-between">
              <span className={isDark ? "text-white/55" : "text-black/55"}>
                Товары
              </span>
              <b>{totalCount}</b>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className={isDark ? "text-white/55" : "text-black/55"}>
                Сумма
              </span>
              <b className="text-[#ff6b00]">{formatSum(totalPrice)}</b>
            </div>

            <Link
              to="/checkout"
              className="mt-6 flex w-full items-center justify-center rounded-full bg-[#ff6b00] px-6 py-4 text-[15px] font-black text-white"
            >
              Перейти к оформлению
            </Link>
          </aside>
        </div>
      </section>
    </Container>
  );
};