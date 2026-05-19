import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  FiCreditCard,
  FiDollarSign,
  FiMapPin,
  FiMessageSquare,
  FiMinus,
  FiPlus,
  FiSend,
  FiShoppingBag,
  FiTrash2,
  FiTruck,
  FiUser,
} from "react-icons/fi";
import { useAuth } from "../../stores/auth.store";
import { useThemeStore } from "../../stores/theme.store";
import { clearCart, getCart, saveCart, type CartItem } from "../../lib/cart";
import { Container } from "../../widgets/container";

type PaymentMethod = "cash" | "card" | "online";

function formatSum(value: number) {
  return `${value.toLocaleString("ru-RU")} сум`;
}

export const OrdersPage = () => {
  const navigate = useNavigate();
  const user = useAuth((state) => state.user);
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";

  const [cart, setCart] = useState<CartItem[]>(getCart());
  const [name, setName] = useState(user.name || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [address, setAddress] = useState("Ферганское шоссе, Ташкент");
  const [comment, setComment] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");

  useEffect(() => {
    const updateCart = () => setCart(getCart());

    window.addEventListener("cart-updated", updateCart);

    return () => {
      window.removeEventListener("cart-updated", updateCart);
    };
  }, []);

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const deliveryPrice = cart.length ? 12000 : 0;
  const total = subtotal + deliveryPrice;
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const updateCart = (nextCart: CartItem[]) => {
    saveCart(nextCart);
    setCart(nextCart);
  };

  const handlePlus = (id: number | string) => {
    updateCart(
      cart.map((item) =>
        String(item.id) === String(id)
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const handleMinus = (id: number | string) => {
    updateCart(
      cart
        .map((item) =>
          String(item.id) === String(id)
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemove = (id: number | string) => {
    updateCart(cart.filter((item) => String(item.id) !== String(id)));
  };

  const handleSubmit = () => {
    if (!cart.length) {
      alert("Корзина пустая");
      return;
    }

    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert("Заполни имя, телефон и адрес");
      return;
    }

    const order = {
      id: Date.now(),
      customerName: name.trim(),
      customerPhone: phone.trim(),
      address: address.trim(),
      comment: comment.trim(),
      paymentMethod,
      items: cart,
      totalPrice: total,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const existingOrders = JSON.parse(
      localStorage.getItem("orderHistory") || "[]"
    );

    existingOrders.unshift(order);
    localStorage.setItem("orderHistory", JSON.stringify(existingOrders));

    clearCart();
    setCart([]);

    alert("Заказ создан! Он ожидает принятия сотрудником.");
    navigate("/order-history");
  };

  if (!user.email) {
    return (
      <main
        className={`min-h-screen pb-20 pt-[120px] transition-all lg:pt-[150px] ${
          isDark ? "bg-black text-white" : "bg-[#f6f1ea] text-[#2f3542]"
        }`}
      >
        <Container>
          <div
            className={`rounded-[30px] border p-8 text-center ${
              isDark
                ? "border-[#2b1708] bg-[#101010]"
                : "border-black/10 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
            }`}
          >
            <h1 className="text-[30px] font-black">Нужно войти</h1>

            <p className="mt-3 opacity-60">
              Чтобы оформить заказ, сначала войди в аккаунт.
            </p>

            <Link
              to="/login"
              className="mt-6 inline-flex rounded-full bg-[#ff6b00] px-8 py-4 font-black text-white"
            >
              Войти
            </Link>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main
      className={`min-h-screen pb-20 pt-[120px] transition-all lg:pt-[150px] ${
        isDark ? "bg-black text-white" : "bg-[#f6f1ea] text-[#2f3542]"
      }`}
    >
      <Container>
        <div className="mb-7 lg:mb-10">
          <span className="inline-flex rounded-full bg-[#fff3e8] px-4 py-2 text-[12px] font-black text-[#ff6b00]">
            ClickEat Checkout
          </span>

          <h1 className="mt-3 text-[34px] font-black leading-tight lg:text-[52px]">
            Оформление заказа
          </h1>

          <p
            className={`mt-2 max-w-[620px] text-[15px] leading-6 lg:text-[17px] ${
              isDark ? "text-white/55" : "text-black/55"
            }`}
          >
            Проверь блюда, адрес доставки и способ оплаты.
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
          <section className="grid gap-5">
            <Card isDark={isDark}>
              <SectionTitle
                title="Состав заказа"
                subtitle={`${totalCount} блюд`}
              />

              {!cart.length ? (
                <div className="rounded-[24px] bg-[#ff6b00]/10 p-6 text-center">
                  <FiShoppingBag className="mx-auto text-[34px] text-[#ff6b00]" />

                  <h3 className="mt-3 font-black">Заказ пустой</h3>

                  <Link
                    to="/menu"
                    className="mt-4 inline-flex rounded-full bg-[#ff6b00] px-6 py-3 font-black text-white"
                  >
                    Открыть меню
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className={`flex gap-3 rounded-[22px] p-3 sm:gap-4 lg:p-4 ${
                        isDark ? "bg-[#171717]" : "bg-[#fff8f1]"
                      }`}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-[82px] w-[82px] shrink-0 rounded-[18px] object-cover sm:h-[95px] sm:w-[95px] lg:h-[110px] lg:w-[110px]"
                      />

                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div>
                          <h3 className="line-clamp-2 text-[15px] font-black leading-tight sm:text-[18px] lg:text-[21px]">
                            {item.title}
                          </h3>

                          <p className="mt-1 text-[13px] font-black text-[#ff6b00] sm:text-[15px] lg:text-[18px]">
                            {formatSum(item.price)}
                          </p>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 rounded-full bg-[#ff6b00] px-2 py-1.5">
                            <button
                              type="button"
                              onClick={() => handleMinus(item.id)}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#ff6b00] active:scale-95"
                            >
                              <FiMinus />
                            </button>

                            <b className="min-w-[18px] text-center text-white">
                              {item.quantity}
                            </b>

                            <button
                              type="button"
                              onClick={() => handlePlus(item.id)}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#ff6b00] active:scale-95"
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
              <SectionTitle
                title="Клиент и доставка"
                subtitle="Данные для курьера"
              />

              <div className="grid gap-3 md:grid-cols-2">
                <Field
                  isDark={isDark}
                  icon={<FiUser />}
                  value={name}
                  onChange={setName}
                  placeholder="Имя клиента"
                />

                <Field
                  isDark={isDark}
                  icon={<FiTruck />}
                  value={phone}
                  onChange={setPhone}
                  placeholder="Телефон клиента"
                />

                <div className="md:col-span-2">
                  <Field
                    isDark={isDark}
                    icon={<FiMapPin />}
                    value={address}
                    onChange={setAddress}
                    placeholder="Адрес доставки"
                  />
                </div>

                <label
                  className={`flex gap-3 rounded-[20px] border px-4 py-3 md:col-span-2 ${
                    isDark
                      ? "border-white/10 bg-[#171717]"
                      : "border-black/10 bg-[#fff8f1]"
                  }`}
                >
                  <FiMessageSquare className="mt-1 shrink-0 text-[#ff6b00]" />

                  <textarea
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    placeholder="Комментарий к заказу"
                    rows={3}
                    className="w-full resize-none bg-transparent outline-none"
                  />
                </label>
              </div>
            </Card>

            <Card isDark={isDark}>
              <SectionTitle
                title="Способ оплаты"
                subtitle="Выбери удобный вариант"
              />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <PayButton
                  active={paymentMethod === "cash"}
                  icon={<FiDollarSign />}
                  label="Наличными"
                  onClick={() => setPaymentMethod("cash")}
                  isDark={isDark}
                />

                <PayButton
                  active={paymentMethod === "card"}
                  icon={<FiCreditCard />}
                  label="Картой"
                  onClick={() => setPaymentMethod("card")}
                  isDark={isDark}
                />

                <PayButton
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
              <h2 className="text-[24px] font-black lg:text-[28px]">Итого</h2>

              <div className="mt-5 grid gap-3">
                <Summary label="Блюда" value={formatSum(subtotal)} />
                <Summary label="Доставка" value={formatSum(deliveryPrice)} />

                <div
                  className={`border-t pt-3 ${
                    isDark ? "border-white/10" : "border-black/10"
                  }`}
                >
                  <Summary label="К оплате" value={formatSum(total)} big />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!cart.length}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#ff6b00] py-4 font-black text-white transition hover:bg-[#ff7f1f] disabled:opacity-50"
              >
                <FiSend />
                Подтвердить заказ
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

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="text-[21px] font-black lg:text-[26px]">{title}</h2>
      <p className="mt-1 text-[14px] opacity-55">{subtitle}</p>
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

function PayButton({
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

function Summary({
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