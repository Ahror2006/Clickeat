import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet";
import {
  FiCreditCard,
  FiMapPin,
  FiNavigation,
  FiPhone,
  FiSend,
  FiShoppingBag,
  FiTruck,
  FiUser,
} from "react-icons/fi";
import { getCart, clearCart } from "../../lib/cart";
import { getToken } from "../../lib/auth";
import { getAuthUser } from "../../lib/auth";

type PaymentMethod = "cash" | "card" | "online";

type Coords = {
  lat: number;
  lng: number;
};

const DEFAULT_COORDS: Coords = {
  lat: 41.311081,
  lng: 69.240562,
};

const RESTAURANT_COORDS: Coords = {
  lat: 41.315,
  lng: 69.248,
};

function formatSum(value: number) {
  return `${value.toLocaleString("ru-RU")} сум`;
}

function cleanAddress(address: string) {
  return address
    .replace(/,\s*Узбекистан/gi, "")
    .replace(/,\s*Uzbekistan/gi, "")
    .replace(/,\s*Toshkent/gi, "")
    .replace(/,\s*Ташкент/gi, "")
    .replace(/,\s*100000/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function getAddressFromCoords(lat: number, lng: number) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ru`
    );

    const data = await response.json();

    return cleanAddress(data.display_name || "Выбранная точка доставки");
  } catch {
    return "Выбранная точка доставки";
  }
}

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const cart = getCart();
  const token = getToken();
  const user = getAuthUser();

  const [coords, setCoords] = useState<Coords>(DEFAULT_COORDS);

  const [form, setForm] = useState({
    customerName: user?.name || "",
    customerPhone: user?.phone || "",
    address: "",
    paymentMethod: "cash" as PaymentMethod,
    comment: "",
  });

  const [error, setError] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const deliveryPrice = cart.length ? 12000 : 0;
  const totalPrice = subtotal + deliveryPrice;

  const handleChange =
    (field: keyof typeof form) =>
      (
        event: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      ) => {
        setForm((prev) => ({
          ...prev,
          [field]: event.target.value,
        }));
      };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Геолокация не поддерживается браузером.");
      return;
    }

    setGeoLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setCoords({ lat, lng });

        const address = await getAddressFromCoords(lat, lng);

        setForm((prev) => ({
          ...prev,
          address,
        }));

        setGeoLoading(false);
      },
      () => {
        setGeoLoading(false);
        setError("Не удалось получить геолокацию. Введи адрес вручную.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    useMyLocation();
  }, []);

  const handleSubmit = async () => {
    setError("");

    if (!token) {
      setError("Сначала войдите в аккаунт.");
      return;
    }

    if (!cart.length) {
      setError("Корзина пустая.");
      return;
    }

    if (!form.customerName.trim()) {
      setError("Введите имя клиента.");
      return;
    }

    if (!form.customerPhone.trim()) {
      setError("Введите телефон клиента.");
      return;
    }

    if (!form.address.trim()) {
      setError("Введите адрес доставки.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerName: form.customerName.trim(),
          customerPhone: form.customerPhone.trim(),
          address: cleanAddress(form.address),
          deliveryLocation: {
            lat: coords.lat,
            lng: coords.lng,
            address: cleanAddress(form.address),
          },
          restaurantName: cart[0]?.restaurant || "ClickEat Restaurant",
          restaurantLocation: {
            lat: RESTAURANT_COORDS.lat,
            lng: RESTAURANT_COORDS.lng,
            address: cart[0]?.restaurant || "ClickEat Restaurant",
          },
          paymentMethod: form.paymentMethod,
          comment: form.comment.trim(),
          totalPrice,
          items: cart.map((item) => ({
            name: item.title,
            price: item.price,
            quantity: item.quantity,
            image: item.image || "",
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Ошибка создания заказа.");
        return;
      }

      clearCart();

      navigate(`/order-tracking/${data.order.id}`);
    } catch {
      setError("Backend не отвечает.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f1ea] px-6 pb-20">
      <Helmet>
        <title>Оформление заказа</title>
      </Helmet>

      <section className="mx-auto max-w-[1320px]">
        <div className="mb-10 rounded-[38px] bg-gradient-to-r from-[#ff7a00] to-[#ff4f00] px-9 py-12 text-white shadow-[0_24px_60px_rgba(255,107,0,0.28)]">
          <p className="inline-flex rounded-full bg-white/20 px-5 py-2 text-sm font-black">
            ClickEat Checkout
          </p>

          <h1 className="mt-6 text-[52px] font-black leading-tight">
            Оформление заказа
          </h1>

          <p className="mt-3 max-w-[760px] text-lg text-white/85">
            Проверь блюда, выбери адрес доставки и подтверди заказ.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          <div className="grid gap-8">
            <div className="rounded-[34px] bg-white p-7 shadow-[0_18px_45px_rgba(0,0,0,0.07)]">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <h2 className="text-3xl font-extrabold text-[#2f3542]">
                    Данные доставки
                  </h2>
                  <p className="mt-2 text-[#7b8698]">
                    Укажи контактные данные и точку доставки.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={useMyLocation}
                  disabled={geoLoading}
                  className="flex items-center gap-2 rounded-[18px] bg-[#fff0e6] px-5 py-3 font-bold text-[#ff6b00] transition hover:bg-[#ffe0c7] disabled:opacity-60"
                >
                  <FiNavigation />
                  {geoLoading ? "Ищем..." : "Моя геолокация"}
                </button>
              </div>

              <div className="mt-6 grid gap-4">
                <Field
                  icon={<FiUser />}
                  placeholder="Ваше имя"
                  value={form.customerName}
                  onChange={handleChange("customerName")}
                />

                <Field
                  icon={<FiPhone />}
                  placeholder="Телефон"
                  value={form.customerPhone}
                  onChange={handleChange("customerPhone")}
                />

                <Field
                  icon={<FiMapPin />}
                  placeholder="Адрес доставки"
                  value={form.address}
                  onChange={handleChange("address")}
                />

                <textarea
                  value={form.comment}
                  onChange={handleChange("comment")}
                  rows={4}
                  placeholder="Комментарий к заказу"
                  className="resize-none rounded-[24px] border border-black/10 bg-[#fff8f1] px-5 py-4 outline-none transition focus:border-[#ff6b00] focus:bg-white"
                />
              </div>
            </div>

            <div className="overflow-hidden rounded-[34px] bg-white shadow-[0_18px_45px_rgba(0,0,0,0.07)]">
              <div className="flex items-center justify-between px-7 py-6">
                <div>
                  <h2 className="text-3xl font-extrabold text-[#2f3542]">
                    Карта доставки
                  </h2>
                  <p className="mt-2 text-[#7b8698]">
                    Точка доставки будет сохранена в заказе.
                  </p>
                </div>
              </div>

              <div className="relative h-[420px] bg-[#eee7dc]">
                <iframe
                  title="Delivery map"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 0.02
                    }%2C${coords.lat - 0.02}%2C${coords.lng + 0.02}%2C${coords.lat + 0.02
                    }&layer=mapnik&marker=${coords.lat}%2C${coords.lng}`}
                  className="h-full w-full border-0"
                />

                <div className="absolute left-5 top-5 max-w-[360px] rounded-[24px] bg-white/95 p-5 shadow-[0_16px_35px_rgba(0,0,0,0.16)] backdrop-blur">
                  <p className="text-sm font-bold text-[#ff6b00]">
                    Адрес доставки
                  </p>
                  <h3 className="mt-1 text-lg font-black text-[#2f3542]">
                    {form.address
                      ? cleanAddress(form.address)
                      : "Адрес пока не выбран"}
                  </h3>
                  <p className="mt-2 text-sm text-[#7b8698]">
                    Координаты: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[34px] bg-white p-7 shadow-[0_18px_45px_rgba(0,0,0,0.07)]">
              <h2 className="text-3xl font-extrabold text-[#2f3542]">
                Способ оплаты
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <PaymentButton
                  active={form.paymentMethod === "cash"}
                  icon={<FiTruck />}
                  title="Наличными"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, paymentMethod: "cash" }))
                  }
                />

                <PaymentButton
                  active={form.paymentMethod === "card"}
                  icon={<FiCreditCard />}
                  title="Картой курьеру"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, paymentMethod: "card" }))
                  }
                />

                <PaymentButton
                  active={form.paymentMethod === "online"}
                  icon={<FiCreditCard />}
                  title="Онлайн"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, paymentMethod: "online" }))
                  }
                />
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-[34px] bg-white p-7 shadow-[0_18px_45px_rgba(0,0,0,0.07)]">
            <h2 className="text-3xl font-extrabold text-[#2f3542]">
              Ваш заказ
            </h2>

            <div className="mt-6 grid gap-4">
              {cart.length ? (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-[22px] bg-[#fff8f1] p-4"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-[76px] w-[92px] rounded-[18px] object-cover"
                      />
                    ) : (
                      <div className="flex h-[76px] w-[92px] items-center justify-center rounded-[18px] bg-[#fff0e6] text-2xl text-[#ff6b00]">
                        <FiShoppingBag />
                      </div>
                    )}

                    <div className="flex-1">
                      <h3 className="font-extrabold text-[#2f3542]">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-sm text-[#7b8698]">
                        {item.quantity} × {formatSum(item.price)}
                      </p>

                      <p className="mt-1 text-xs text-[#9aa3b4]">
                        {item.restaurant || "ClickEat Restaurant"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[22px] bg-[#fff8f1] p-6 text-center font-bold text-[#7b8698]">
                  Корзина пустая
                </div>
              )}
            </div>

            <div className="mt-6 grid gap-3 rounded-[24px] bg-[#fff8f1] p-5">
              <SummaryRow label="Блюда" value={formatSum(subtotal)} />
              <SummaryRow label="Доставка" value={formatSum(deliveryPrice)} />

              <div className="mt-3 border-t border-[#eadbcc] pt-4">
                <SummaryRow label="Итого" value={formatSum(totalPrice)} big />
              </div>
            </div>

            {error && (
              <div className="mt-5 rounded-[18px] bg-red-50 px-5 py-4 font-bold text-red-600">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !cart.length}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-[22px] bg-[#ff6b00] px-7 py-4 font-extrabold text-white shadow-[0_18px_35px_rgba(255,107,0,0.25)] transition hover:bg-[#ff5b00] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiSend />
              {loading ? "Создаём заказ..." : "Подтвердить заказ"}
            </button>
          </aside>
        </div>
      </section>
    </main>
  );
};

function Field({
  icon,
  placeholder,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="flex items-center gap-4 rounded-[20px] border border-black/10 bg-[#fff8f1] px-5 py-4 transition focus-within:border-[#ff6b00] focus-within:bg-white">
      <span className="text-xl text-[#ff6b00]">{icon}</span>

      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none"
      />
    </label>
  );
}

function PaymentButton({
  active,
  icon,
  title,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[22px] border p-5 text-left transition ${active
        ? "border-[#ff6b00] bg-[#ff6b00] text-white shadow-[0_16px_30px_rgba(255,107,0,0.22)]"
        : "border-black/10 bg-[#fff8f1] text-[#2f3542] hover:border-[#ff6b00]"
        }`}
    >
      <div className="text-2xl">{icon}</div>
      <p className="mt-4 font-extrabold">{title}</p>
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
    <div className="flex items-center justify-between">
      <span className={big ? "text-lg font-black text-[#2f3542]" : "text-[#7b8698]"}>
        {label}
      </span>

      <strong className={big ? "text-2xl text-[#ff6b00]" : "text-[#2f3542]"}>
        {value}
      </strong>
    </div>
  );
}