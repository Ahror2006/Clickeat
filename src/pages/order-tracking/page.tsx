import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import L from "leaflet";
import {
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiPackage,
  FiTruck,
} from "react-icons/fi";

import { cancelOrder, getOrderById } from "../../lib/orders.api";
import { socket } from "../../lib/socket";
import { useThemeStore } from "../../stores/theme.store";

type OrderStatus =
  | "pending"
  | "accepted"
  | "cooking"
  | "delivering"
  | "completed"
  | "cancelled";

type Location = {
  lat: number | null;
  lng: number | null;
  address?: string;
};

type OrderItem = {
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  deliveryLocation: Location;
  restaurantName: string;
  restaurantLocation: Location;
  courierName?: string;
  courierPhone?: string;
  courierLocation: Location;
  items: OrderItem[];
  totalPrice: number;
  paymentMethod: string;
  status: OrderStatus;
  estimatedDeliveryTime?: string;
  comment?: string;
  createdAt: string;
};

const statusLabels: Record<OrderStatus, string> = {
  pending: "Заказ создан",
  accepted: "Ресторан принял заказ",
  cooking: "Заказ готовится",
  delivering: "Курьер в пути",
  completed: "Заказ доставлен",
  cancelled: "Заказ отменён",
};

const statusIndex: Record<OrderStatus, number> = {
  pending: 0,
  accepted: 1,
  cooking: 2,
  delivering: 3,
  completed: 4,
  cancelled: -1,
};

const steps = [
  { status: "pending", label: "Заказ создан", icon: <FiPackage /> },
  { status: "accepted", label: "Принят", icon: <FiCheckCircle /> },
  { status: "cooking", label: "Готовится", icon: <FiClock /> },
  { status: "delivering", label: "Курьер в пути", icon: <FiTruck /> },
  { status: "completed", label: "Доставлено", icon: <FiCheckCircle /> },
] as const;

function createEmojiIcon(emoji: string) {
  return L.divIcon({
    html: `<div style="
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: #ff6b00;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      border: 4px solid white;
      box-shadow: 0 10px 30px rgba(0,0,0,0.25);
    ">${emoji}</div>`,
    className: "",
    iconSize: [42, 42],
    iconAnchor: [21, 21],
  });
}

const restaurantIcon = createEmojiIcon("🍔");
const courierIcon = createEmojiIcon("🛵");
const clientIcon = createEmojiIcon("📍");

function formatSum(value: number) {
  return `${value.toLocaleString("ru-RU")} сум`;
}

function formatAddress(address = "") {
  return address
    .replace(/,\s*Узбекистан/gi, "")
    .replace(/,\s*Uzbekistan/gi, "")
    .replace(/,\s*Toshkent/gi, "")
    .replace(/,\s*Ташкент/gi, "")
    .replace(/,\s*100000/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function toLatLng(
  location: Location,
  fallback: [number, number]
): [number, number] {
  if (typeof location?.lat === "number" && typeof location?.lng === "number") {
    return [location.lat, location.lng];
  }

  return fallback;
}

export const OrderTrackingPage = () => {
  const { id } = useParams();

  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrder = async (silent = false) => {
    if (!id) return;

    try {
      if (!silent) setLoading(true);
      setError("");

      const data = await getOrderById(id);
      setOrder(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Заказ не найден");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;

    try {
      setCancelLoading(true);
      const updatedOrder = await cancelOrder(order.id);
      setOrder(updatedOrder);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Не удалось отменить заказ");
    } finally {
      setCancelLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();

    if (!id) return;

    const interval = window.setInterval(() => {
      fetchOrder(true);
    }, 5000);

    socket.connect();
    socket.emit("join-order-room", id);

    socket.on("order:status-updated", (updatedOrder: Order) => {
      if (updatedOrder.id === id) setOrder(updatedOrder);
    });

    socket.on("courier:location-updated", (updatedOrder: Order) => {
      if (updatedOrder.id === id) setOrder(updatedOrder);
    });

    return () => {
      window.clearInterval(interval);
      socket.emit("leave-order-room", id);
      socket.off("order:status-updated");
      socket.off("courier:location-updated");
    };
  }, [id]);

  const mapData = useMemo(() => {
    if (!order) return null;

    const restaurant = toLatLng(order.restaurantLocation, [41.315, 69.248]);
    const client = toLatLng(order.deliveryLocation, [41.311081, 69.240562]);
    const courier = toLatLng(order.courierLocation, restaurant);

    return {
      center: courier,
      restaurant,
      client,
      courier,
      route: [restaurant, courier, client] as [number, number][],
    };
  }, [order]);

  if (loading) {
    return (
      <main className={`tracking-page ${isDark ? "tracking-dark" : ""}`}>
        <div className="tracking-shell">
          <div className="tracking-card tracking-loading">
            <div className="tracking-spinner" />
            <h1>Загружаем заказ...</h1>
          </div>
        </div>
      </main>
    );
  }

  if (error || !order || !mapData) {
    return (
      <main className={`tracking-page ${isDark ? "tracking-dark" : ""}`}>
        <div className="tracking-shell">
          <div className="tracking-error">{error || "Заказ не найден"}</div>
        </div>
      </main>
    );
  }

  const currentStep = statusIndex[order.status];
  const progress = order.status === "cancelled" ? 0 : (currentStep / 4) * 100;
  const canCancel = ["pending", "accepted", "cooking"].includes(order.status);

  return (
    <main className={`tracking-page ${isDark ? "tracking-dark" : ""}`}>
      <div className="tracking-shell">
        <div className="tracking-head">
          <span>ClickEat Tracking</span>
          <h1>Отслеживание заказа</h1>
          <p>
            Заказ #{order.id.slice(-6)} • {statusLabels[order.status]}
          </p>
        </div>

        <div className="tracking-layout">
          <section className="tracking-map-card">
            <div className="tracking-map">
              <MapContainer
                center={mapData.center}
                zoom={13}
                scrollWheelZoom
                className="h-full w-full"
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* маршрут */}
                <Polyline
                  positions={mapData.route}
                  pathOptions={{
                    color: "#ff6b00",
                    weight: 5,
                    opacity: 0.85,
                  }}
                />

                {/* ресторан */}
                <Marker
                  position={mapData.restaurant}
                  icon={restaurantIcon}
                >
                  <Popup>
                    <div className="text-center">
                      <b>🍔 Ресторан</b>
                      <br />
                      {order.restaurantName}
                    </div>
                  </Popup>
                </Marker>

                {/* курьер */}
                <Marker
                  position={mapData.courier}
                  icon={courierIcon}
                >
                  <Popup>
                    <div className="text-center">
                      <b>🛵 Курьер</b>
                      <br />
                      {order.courierName || "ClickEat Courier"}
                    </div>
                  </Popup>
                </Marker>

                {/* клиент */}
                <Marker
                  position={mapData.client}
                  icon={clientIcon}
                >
                  <Popup>
                    <div className="text-center">
                      <b>📍 Доставка</b>
                      <br />
                      {order.address}
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </section>

          <aside className="tracking-side">
            <div className="tracking-card tracking-eta">
              <div>
                <span>ETA</span>
                <h2>{order.estimatedDeliveryTime || "35-45 минут"}</h2>
                <p>{statusLabels[order.status]}</p>
              </div>

              <div className="tracking-eta-icon">
                <FiTruck />
              </div>
            </div>

            {canCancel && (
              <button
                type="button"
                onClick={handleCancelOrder}
                disabled={cancelLoading}
                className="w-full rounded-[22px] bg-red-500 px-5 py-4 text-[14px] font-black text-white disabled:opacity-60"
              >
                {cancelLoading ? "Отменяем..." : "Отменить заказ"}
              </button>
            )}

            <div className="tracking-card">
              <h2>Статус доставки</h2>

              <div className="tracking-progress">
                <div style={{ width: `${progress}%` }} />
              </div>

              <div className="tracking-steps">
                {steps.map((step, index) => {
                  const active = currentStep >= index;

                  return (
                    <div key={step.status} className="tracking-step">
                      <div className={active ? "active" : ""}>{step.icon}</div>
                      <p className={active ? "active" : ""}>{step.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="tracking-card">
              <h2>Адрес доставки</h2>

              <div className="tracking-address">
                <FiMapPin />
                <div>
                  <b>{formatAddress(order.address)}</b>
                  <p>Точка доставки выбрана на карте.</p>
                </div>
              </div>
            </div>

            <div className="tracking-card">
              <h2>Ваш заказ</h2>

              <div className="tracking-items">
                {order.items.map((item, index) => (
                  <div key={`${item.name}-${index}`} className="tracking-item">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <b>{formatSum(item.price)}</b>
                  </div>
                ))}
              </div>

              <div className="tracking-total">
                <span>Итого</span>
                <b>{formatSum(order.totalPrice)}</b>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};