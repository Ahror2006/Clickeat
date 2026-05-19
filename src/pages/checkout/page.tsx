import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router";
import {
  FiCreditCard,
  FiDollarSign,
  FiMapPin,
  FiMinus,
  FiPlus,
  FiSend,
  FiShoppingBag,
  FiTrash2,
  FiTruck,
  FiUser,
} from "react-icons/fi";

import { Container } from "../../widgets/container";
import { useAuth } from "../../stores/auth.store";
import { useThemeStore } from "../../stores/theme.store";
import { clearCart, getCart, saveCart, type CartItem } from "../../lib/cart";
import { createOrder } from "../../lib/orders.api";

type PaymentMethod = "cash" | "card" | "online";

const RESTAURANT_COORDS = {
  lat: 41.311081,
  lng: 69.240562,
};

function formatSum(value: number) {
  return `${value.toLocaleString("ru-RU")} сум`;
}

export const CheckoutPage = () => {
  const navigate = useNavigate();

  const user = useAuth((state) => state.user);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);

  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";

  const [cart, setCart] = useState<CartItem[]>(getCart());

  const [customerName, setCustomerName] = useState(user.name || "");
  const [customerPhone, setCustomerPhone] = useState(user.phone || "");
  const [address, setAddress] = useState("Ферганское шоссе, Ташкент");
  const [comment, setComment] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deliveryPrice = cart.length ? 12000 : 0;

  const subtotal = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );
  }, [cart]);

  const totalPrice = subtotal + deliveryPrice;

  const totalCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }, [cart]);

  useEffect(() => {
    const updateCart = () => setCart(getCart());

    window.addEventListener("cart-updated", updateCart);

    return () => {
      window.removeEventListener("cart-updated", updateCart);
    };
  }, []);

  const updateCart = (nextCart: CartItem[]) => {
    saveCart(nextCart);
    setCart(nextCart);
  };

  const handlePlus = (id: string | number) => {
    const nextCart = cart.map((item) =>
      String(item.id) === String(id)
        ? { ...item, quantity: (item.quantity || 1) + 1 }
        : item
    );

    updateCart(nextCart);
  };

  const handleMinus = (id: string | number) => {
    const nextCart = cart
      .map((item) =>
        String(item.id) === String(id)
          ? { ...item, quantity: (item.quantity || 1) - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    updateCart(nextCart);
  };

  const handleRemove = (id: string | number) => {
    const nextCart = cart.filter((item) => String(item.id) !== String(id));
    updateCart(nextCart);
  };

  const handleSubmit = async () => {
    setError("");

    if (!isAuthenticated) {
      setError("Сначала войдите в аккаунт.");
      return;
    }

    if (!cart.length) {
      setError("Корзина пустая.");
      return;
    }

    if (!customerName.trim()) {
      setError("Введите имя клиента.");
      return;
    }

    if (!customerPhone.trim()) {
      setError("Введите телефон клиента.");
      return;
    }

    if (!address.trim()) {
      setError("Введите адрес доставки.");
      return;
    }

    try {
      setLoading(true);

      const order = await createOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        address: address.trim(),

        deliveryLocation: {
          lat: null,
          lng: null,
          address: address.trim(),
        },

        restaurantName: cart[0]?.restaurant || "ClickEat Restaurant",

        restaurantLocation: {
          lat: RESTAURANT_COORDS.lat,
          lng: RESTAURANT_COORDS.lng,
          address: cart[0]?.restaurant || "ClickEat Restaurant, Tashkent",
        },

        paymentMethod,
        comment: comment.trim(),
        totalPrice,

        items: cart.map((item) => ({
          name: item.title,
          price: item.price,
          quantity: item.quantity || 1,
          image: item.image || "",
        })),
      });

      clearCart();
      setCart([]);

      navigate(`/order-tracking/${order.id}`);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Не удалось создать заказ. Проверь backend."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className={`min-h-screen pb-24 pt-[120px] transition-all lg:pt-[150px] ${
        isDark ? "bg-black text-white" : "bg-[#f6f1ea] text-[#2f3542]"
      }`}
    >
      <Helmet>
        <title>Оформление заказа</title>
      </Helmet>

      <Container>
        <div className="mb-7">
          <span className="inline-flex rounded-full bg-[#fff3e8] px-4 py-2 text-[12px] font-black text-[#ff6b00]">
            ClickEat Checkout
          </span>

          <h1 className="mt-3 text-[34px] font-black leading-tight lg:text-[52px]">
            Оформление заказа
          </h1>

          <p
            className={`mt-2 max-w-[620px] text-[15px] leading-6 ${
              isDark ? "text-white/55" : "text-black/55"
            }`}
          >
            Проверь блюда, адрес доставки и подтверди заказ.
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
          <section className="grid gap-5">
            <Card isDark={isDark}>
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-[22px] font-black lg:text-[28px]">
                    Состав заказа
                  </h2>

                  <p className="mt-1 text-[14px] opacity-55">
                    Всего блюд: {totalCount}
                  </p>
                </div>

                <Link
                  to="/menu"
                  className="rounded-full bg-[#ff6b00] px-5 py-3 text-[13px] font-black text-white"
                >
                  Добавить
                </Link>
              </div>

              {!cart.length ? (
                <div className="rounded-[24px] bg-[#ff6b00]/10 p-7 text-center">
                  <FiShoppingBag className="mx-auto text-[36px] text-[#ff6b00]" />

                  <h3 className="mt-3 text-[22px] font-black">
                    Корзина пустая
                  </h3>

                  <p className="mt-2 opacity-55">
                    Добавь блюда из меню, чтобы оформить заказ.
                  </p>

                  <Link
                    to="/menu"
                    className="mt-5 inline-flex rounded-full bg-[#ff6b00] px-7 py-3 font-black text-white"
                  >
                    Открыть меню
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className={`flex gap-3 rounded-[22px] p-3 sm:gap-4 ${
                        isDark ? "bg-[#171717]" : "bg-[#fff8f1]"
                      }`}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-[82px] w-[82px] shrink-0 rounded-[18px] object-cover sm:h-[100px] sm:w-[110px]"
                      />

                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div>
                          <h3 className="line-clamp-2 text-[15px] font-black leading-tight sm:text-[18px]">
                            {item.title}
                          </h3>

                          <p className="mt-1 text-[13px] opacity-55">
                            {item.restaurant || "ClickEat Restaurant"}
                          </p>

                          <p className="mt-2 text-[15px] font-black text-[#ff6b00]">
                            {formatSum(item.price)}
                          </p>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-2 rounded-full bg-[#ff6b00] px-2 py-1.5">
                            <button
                              type="button"
                              onClick={() => handleMinus(item.id)}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#ff6b00]"
                            >
                              <FiMinus />
                            </button>

                            <b className="min-w-[20px] text-center text-white">
                              {item.quantity}
                            </b>

                            <button
                              type="button"
                              onClick={() => handlePlus(item.id)}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#ff6b00]"
                            >
                              <FiPlus />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemove(item.id)}
                            className="text-red-500"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card isDark={isDark}>
              <h2 className="text-[22px] font-black lg:text-[28px]">
                Клиент и доставка
              </h2>

              <p className="mt-1 text-[14px] opacity-55">
                Эти данные попадут в заказ для сотрудника.
              </p>

              <div className="mt-5 grid gap-3">
                <Field
                  isDark={isDark}
                  icon={<FiUser />}
                  value={customerName}
                  onChange={setCustomerName}
                  placeholder="Имя клиента"
                />

                <Field
                  isDark={isDark}
                  icon={<FiTruck />}
                  value={customerPhone}
                  onChange={setCustomerPhone}
                  placeholder="Телефон клиента"
                />

                <Field
                  isDark={isDark}
                  icon={<FiMapPin />}
                  value={address}
                  onChange={setAddress}
                  placeholder="Адрес доставки"
                />

                <textarea
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder="Комментарий к заказу"
                  rows={4}
                  className={`resize-none rounded-[20px] border px-4 py-3 outline-none ${
                    isDark
                      ? "border-white/10 bg-[#171717] text-white placeholder:text-white/35"
                      : "border-black/10 bg-[#fff8f1] text-[#2f3542]"
                  }`}
                />
              </div>
            </Card>

            <Card isDark={isDark}>
              <h2 className="text-[22px] font-black lg:text-[28px]">
                Способ оплаты
              </h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <PaymentButton
                  active={paymentMethod === "cash"}
                  icon={<FiDollarSign />}
                  label="Наличными"
                  onClick={() => setPaymentMethod("cash")}
                  isDark={isDark}
                />

                <PaymentButton
                  active={paymentMethod === "card"}
                  icon={<FiCreditCard />}
                  label="Картой"
                  onClick={() => setPaymentMethod("card")}
                  isDark={isDark}
                />

                <PaymentButton
                  active={paymentMethod === "online"}
                  icon={<FiCreditCard />}
                  label="Онлайн"
                  onClick={() => setPaymentMethod("online")}
                  isDark={isDark}
                />
              </div>
            </Card>
          </section>

          <aside className="xl:sticky xl:top-[150px] xl:h-fit">
            <Card isDark={isDark}>
              <h2 className="text-[26px] font-black">Итого</h2>

              <div className="mt-5 grid gap-3">
                <SummaryRow label="Блюда" value={formatSum(subtotal)} />
                <SummaryRow
                  label="Доставка"
                  value={formatSum(deliveryPrice)}
                />

                <div
                  className={`border-t pt-4 ${
                    isDark ? "border-white/10" : "border-black/10"
                  }`}
                >
                  <SummaryRow label="К оплате" value={formatSum(totalPrice)} big />
                </div>
              </div>

              {error && (
                <div className="mt-5 rounded-[18px] bg-red-50 px-5 py-4 text-[14px] font-bold text-red-600">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !cart.length}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-[22px] bg-[#ff6b00] px-7 py-4 font-black text-white shadow-[0_18px_35px_rgba(255,107,0,0.25)] transition hover:bg-[#ff5b00] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiSend />
                {loading ? "Создаём заказ..." : "Подтвердить заказ"}
              </button>
            </Card>
          </aside>
        </div>
      </Container>
    </main>
  );
};

function Card({
  children,
  isDark,
}: {
  children: React.ReactNode;
  isDark: boolean;
}) {
  return (
    <div
      className={`rounded-[26px] border p-4 sm:p-5 lg:rounded-[30px] lg:p-6 ${
        isDark
          ? "border-[#2b1708] bg-[#101010]"
          : "border-black/10 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
      }`}
    >
      {children}
    </div>
  );
}

function Field({
  icon,
  value,
  onChange,
  placeholder,
  isDark,
}: {
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  isDark: boolean;
}) {
  return (
    <label
      className={`flex items-center gap-3 rounded-[20px] border px-4 py-3 ${
        isDark
          ? "border-white/10 bg-[#171717] text-white"
          : "border-black/10 bg-[#fff8f1] text-[#2f3542]"
      }`}
    >
      <span className="shrink-0 text-[#ff6b00]">{icon}</span>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none"
      />
    </label>
  );
}

function PaymentButton({
  active,
  icon,
  label,
  onClick,
  isDark,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isDark: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[20px] border p-4 text-left font-black transition active:scale-[0.98] ${
        active
          ? "border-[#ff6b00] bg-[#ff6b00] text-white"
          : isDark
          ? "border-white/10 bg-[#171717] text-white"
          : "border-black/10 bg-[#fff8f1] text-[#2f3542]"
      }`}
    >
      <div className="text-[24px]">{icon}</div>
      <p className="mt-2">{label}</p>
    </button>
  );
}

function SummaryRow({
  label,
  value,
  big = false,
}: {
  label: string;
  value: string;
  big?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={big ? "font-black" : "opacity-55"}>{label}</span>

      <b className={big ? "text-[22px] text-[#ff6b00]" : ""}>{value}</b>
    </div>
  );
}