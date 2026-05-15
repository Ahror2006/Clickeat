import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  FiMinus,
  FiPlus,
  FiTrash2,
  FiShoppingBag,
  FiUser,
  FiPhone,
  FiMapPin,
  FiClock,
  FiTruck,
  FiCreditCard,
  FiDollarSign,
  FiGlobe,
  FiMessageSquare,
  FiCheckCircle,
} from "react-icons/fi";
import { useAuth } from "../../stores/auth.store";
import { clearCart } from "../../lib/cart";


type CartItem = {
  id: number | string;
  title: string;
  image?: string;
  price: number;
  quantity: number;
  restaurant?: string;
};

type PaymentMethod = "cash" | "card" | "online";

const CART_KEY = "cart";
const ORDERS_KEY = "orders";


const RESTAURANT_ADDRESS =
  "Фарғона Йўли 15, Toshkent, Toshkent, Узбекистан";

const RESTAURANT_COORDS = {
  lat: 41.284,
  lng: 69.308,
};

const PROMO_CODES = [
  { code: "CLICK10", type: "percent", value: 10 },
  { code: "FOOD5000", type: "fixed", value: 5000 },
];

function getCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function saveCompletedOrder(order: unknown) {
  const raw = localStorage.getItem(ORDERS_KEY);
  const orders = raw ? JSON.parse(raw) : [];
  localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...orders]));
}

async function getAddressFromCoords(lat: number, lng: number) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=ru`
    );

    const data = await response.json();

    return (
      data.display_name ||
      `Ташкент, точка доставки: ${lat.toFixed(5)}, ${lng.toFixed(5)}`
    );
  } catch {
    return `Ташкент, точка доставки: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
}

export function OrdersPage() {
  const navigate = useNavigate();
  const user = useAuth((state) => state.user);
  const [successOrder, setSuccessOrder] = useState<{
    id: string;
    total: number;
  } | null>(null);

  const [cart, setCart] = useState<CartItem[]>(getCart());
  const [customerName, setCustomerName] = useState(user.name || "");
  const [customerPhone, setCustomerPhone] = useState(user.phone || "");

  const [address, setAddress] = useState(RESTAURANT_ADDRESS);
  const [coords, setCoords] = useState(RESTAURANT_COORDS);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [comment, setComment] = useState("");

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [promoError, setPromoError] = useState("");

  useEffect(() => {
    if (user.name) setCustomerName(user.name);
    if (user.phone) setCustomerPhone(user.phone);
  }, [user.name, user.phone]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setAddress(RESTAURANT_ADDRESS);
      setCoords(RESTAURANT_COORDS);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setCoords({ lat, lng });

        const readableAddress = await getAddressFromCoords(lat, lng);
        setAddress(readableAddress);
      },
      () => {
        setAddress(RESTAURANT_ADDRESS);
        setCoords(RESTAURANT_COORDS);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const deliveryPrice = cart.length > 0 ? 12000 : 0;
  const discount = appliedPromo?.discount || 0;
  const total = Math.max(0, subtotal + deliveryPrice - discount);
  const deliveryTime = cart.length > 0 ? "35–45 минут" : "—";

  const updateQuantity = (id: CartItem["id"], type: "plus" | "minus") => {
    const updated = cart.map((item) =>
      item.id === id
        ? {
          ...item,
          quantity:
            type === "plus"
              ? item.quantity + 1
              : Math.max(1, item.quantity - 1),
        }
        : item
    );

    setCart(updated);
    saveCart(updated);
    window.dispatchEvent(new Event("cart-updated"));
  };

  const removeItem = (id: CartItem["id"]) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    saveCart(updated);
    window.dispatchEvent(new Event("cart-updated"));
  };

  const handleApplyPromo = () => {
    const normalized = promoCode.trim().toUpperCase();
    setPromoError("");

    if (!normalized) {
      setPromoError("Введите промокод");
      return;
    }

    const found = PROMO_CODES.find((item) => item.code === normalized);

    if (!found) {
      setPromoError("Промокод не найден");
      return;
    }

    let promoDiscount = 0;

    if (found.type === "percent") {
      promoDiscount = Math.floor((subtotal * found.value) / 100);
    }

    if (found.type === "fixed") {
      promoDiscount = found.value;
    }

    setAppliedPromo({
      code: found.code,
      discount: promoDiscount,
    });

    setPromoCode("");
  };

  

    const orderId = `ORD-${Date.now()}`;

    const order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      items: cart,
      subtotal,
      deliveryPrice,
      discount,
      total,
      promo: appliedPromo,
      promoCode: appliedPromo?.code,
      promoDiscount: discount,
      paymentMethod,
      customerName,
      customerPhone,
      address,
      fullAddress: address,
      coords,
      restaurantAddress: RESTAURANT_ADDRESS,
      restaurantCoords: RESTAURANT_COORDS,
      deliveryTime,
      comment,
      status: "completed",
      bonusPoints: Math.floor(total / 10000),
      courierName: "Назначается автоматически",
      restaurantName: cart[0]?.restaurant || "ClickEat Restaurant",
      branchName: "ClickEat Main Branch",
      branchAddress: RESTAURANT_ADDRESS,
    };

    saveCompletedOrder(order);

    clearCart();
    setCart([]);
    setAppliedPromo(null);
    setPromoCode("");
    setComment("");

    setSuccessOrder({
      id: orderId,
      total,
    });
  };

  return (
    <section className="orders-page pb-14">
      <div className="mx-auto max-w-[1320px] px-4">
        <div className="orders-hero">
          <div>
            <span>ClickEat Checkout</span>
            <h1>Оформление заказа</h1>
            <p>Проверь блюда, адрес доставки, способ оплаты и подтверди заказ.</p>
          </div>

          <div className="orders-hero-stats">
            <div>
              <small>Блюд</small>
              <strong>{cart.reduce((sum, item) => sum + item.quantity, 0)}</strong>
            </div>
            <div>
              <small>Итого</small>
              <strong>{total.toLocaleString("ru-RU")} сум</strong>
            </div>
          </div>
        </div>

        <div className="orders-grid">
          <div className="orders-left">
            <div className="orders-card">
              <div className="orders-card-head">
                <div>
                  <h2>Состав заказа</h2>
                  <p>Выбранные блюда отображаются здесь.</p>
                </div>

                <Link to="/menu" className="orders-orange-btn">
                  Добавить блюда
                </Link>
              </div>

              {cart.length === 0 ? (
                <div className="orders-empty">
                  <div>
                    <FiShoppingBag />
                  </div>
                  <h3>Заказ пока пустой</h3>
                  <p>Добавь блюда из меню, и они появятся здесь.</p>
                  <Link to="/menu">Открыть меню</Link>
                </div>
              ) : (
                <div className="orders-items">
                  {cart.map((item) => (
                    <div className="orders-item" key={item.id}>
                      <img src={item.image} alt={item.title} />

                      <div className="orders-item-info">
                        <h3>{item.title}</h3>
                        <p>{item.restaurant || "ClickEat Restaurant"}</p>
                        <strong>{item.price.toLocaleString("ru-RU")} сум</strong>
                      </div>

                      <div className="orders-qty">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, "minus")}
                        >
                          <FiMinus />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, "plus")}
                        >
                          <FiPlus />
                        </button>
                      </div>

                      <button
                        type="button"
                        className="orders-remove"
                        onClick={() => removeItem(item.id)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="orders-card">
              <div className="orders-card-head">
                <div>
                  <h2>Клиент и доставка</h2>
                  <p>Данные клиента заполняются автоматически из профиля.</p>
                </div>
              </div>

              <div className="orders-form-grid">
                <Field
                  label="Имя клиента"
                  icon={<FiUser />}
                  value={customerName}
                  onChange={setCustomerName}
                  placeholder=""
                />

                <Field
                  label="Телефон клиента"
                  icon={<FiPhone />}
                  value={customerPhone}
                  onChange={setCustomerPhone}
                  placeholder=""
                />
              </div>

              <Field
                label="Адрес доставки"
                icon={<FiMapPin />}
                value={address}
                onChange={setAddress}
                placeholder=""
              />

              <div className="orders-map">
                <iframe
                  title="Карта доставки"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 0.01
                    }%2C${coords.lat - 0.01}%2C${coords.lng + 0.01}%2C${coords.lat + 0.01
                    }&layer=mapnik&marker=${coords.lat}%2C${coords.lng}`}
                />

                <div className="orders-map-info">
                  <FiMapPin />
                  <div>
                    <strong>{address}</strong>
                    <p>Адрес определён по текущей точке на карте.</p>
                  </div>
                </div>
              </div>

              <div className="orders-comment">
                <label>Комментарий к заказу</label>
                <div>
                  <FiMessageSquare />
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder=""
                  />
                </div>
              </div>
            </div>
          </div>

          <aside className="orders-right">
            <div className="orders-card orders-sticky">
              <h2>Итог по заказу</h2>

              <div className="orders-summary-list">
                <SummaryRow
                  label="Сумма блюд"
                  value={`${subtotal.toLocaleString("ru-RU")} сум`}
                />
                <SummaryRow
                  label="Доставка"
                  value={`${deliveryPrice.toLocaleString("ru-RU")} сум`}
                />
                <SummaryRow
                  label="Промокод"
                  value={
                    appliedPromo
                      ? `-${discount.toLocaleString("ru-RU")} сум`
                      : "Не выбран"
                  }
                />
                <SummaryRow label="Время доставки" value={deliveryTime} />
              </div>

              <div className="orders-promo">
                <h3>Промокод</h3>

                <div className="orders-promo-box">
                  <input
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder=""
                  />

                  <button type="button" onClick={handleApplyPromo}>
                    Применить
                  </button>
                </div>

                {appliedPromo && (
                  <p className="orders-promo-success">
                    Применён: {appliedPromo.code} · скидка{" "}
                    {discount.toLocaleString("ru-RU")} сум
                  </p>
                )}

                {promoError && <p className="orders-promo-error">{promoError}</p>}
              </div>

              <div className="orders-payment">
                <h3>Способ оплаты</h3>

                <PaymentButton
                  active={paymentMethod === "cash"}
                  icon={<FiDollarSign />}
                  title="Наличными"
                  onClick={() => setPaymentMethod("cash")}
                />

                <PaymentButton
                  active={paymentMethod === "card"}
                  icon={<FiCreditCard />}
                  title="Картой курьеру"
                  onClick={() => setPaymentMethod("card")}
                />

                <PaymentButton
                  active={paymentMethod === "online"}
                  icon={<FiGlobe />}
                  title="Онлайн оплата"
                  onClick={() => setPaymentMethod("online")}
                />
              </div>

              <div className="orders-auto-info">
                <InfoBox
                  icon={<FiClock />}
                  title="Время доставки"
                  text={deliveryTime}
                />
                <InfoBox
                  icon={<FiTruck />}
                  title="Курьер"
                  text="Назначается автоматически"
                />
                <InfoBox icon={<FiCheckCircle />} title="Адрес" text={address} />
              </div>

              <div className="orders-total">
                <span>Итого</span>
                <strong>{total.toLocaleString("ru-RU")} сум</strong>
              </div>

              <button
                type="button"
                className="orders-confirm-btn"
                onClick={() => navigate("/checkout")}
              >
                Оформить заказ
              </button>
            </div>
          </aside>
        </div>
      </div>
      {successOrder && (
        <div className="order-success-overlay">
          <div className="order-success-modal">
            <div className="order-success-icon">
              <FiCheckCircle />
            </div>

            <span>ClickEat Order</span>

            <h2>Заказ успешно оформлен</h2>

            <p>
              Заказ #{successOrder.id.slice(-6)} добавлен в историю. Корзина
              очищена, данные заказа сохранены.
            </p>

            <strong>
              {successOrder.total.toLocaleString("ru-RU")} сум
            </strong>

            <div className="order-success-actions">
              <Link to="/order-history">Открыть историю</Link>

              <button type="button" onClick={() => setSuccessOrder(null)}>
                Остаться здесь
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Field({
  label,
  icon,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="orders-field">
      <label>{label}</label>
      <div>
        <span>{icon}</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="orders-summary-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
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
      className={`orders-payment-btn ${active ? "active" : ""}`}
    >
      <span>{icon}</span>
      <strong>{title}</strong>
    </button>
  );
}

function InfoBox({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="orders-info-box">
      <span>{icon}</span>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}