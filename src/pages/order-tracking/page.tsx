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
import { getToken } from "../../lib/auth";
import { socket } from "../../lib/socket";

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
  { status: "accepted", label: "Ресторан принял", icon: <FiCheckCircle /> },
  { status: "cooking", label: "Готовится", icon: <FiClock /> },
  { status: "delivering", label: "Курьер в пути", icon: <FiTruck /> },
  { status: "completed", label: "Доставлено", icon: <FiCheckCircle /> },
] as const;

function createEmojiIcon(emoji: string) {
  return L.divIcon({
    html: `<div style="
      width: 46px;
      height: 46px;
      border-radius: 50%;
      background: #ff6b00;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      border: 4px solid white;
      box-shadow: 0 10px 30px rgba(0,0,0,0.25);
    ">${emoji}</div>`,
    className: "",
    iconSize: [46, 46],
    iconAnchor: [23, 23],
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
  const token = getToken();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`https://clickeat-5wy1.onrender.com/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Заказ не найден");
        return;
      }

      setOrder(data.order);
    } catch {
      setError("Backend не отвечает");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();

    if (!id) return;

    socket.connect();
    socket.emit("join-order-room", id);

    socket.on("order:status-updated", (updatedOrder: Order) => {
      if (updatedOrder.id === id) {
        setOrder(updatedOrder);
      }
    });

    socket.on("courier:location-updated", (updatedOrder: Order) => {
      if (updatedOrder.id === id) {
        setOrder(updatedOrder);
      }
    });

    return () => {
      socket.emit("leave-order-room", id);
      socket.off("order:status-updated");
      socket.off("courier:location-updated");
    };
  }, [id]);

  const mapData = useMemo(() => {
    if (!order) return null;

    const restaurant: [number, number] = toLatLng(order.restaurantLocation, [
      41.315,
      69.248,
    ]);

    const client: [number, number] = toLatLng(order.deliveryLocation, [
      41.311081,
      69.240562,
    ]);

    const courier: [number, number] = toLatLng(
      order.courierLocation,
      restaurant
    );

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
      <section className="px-3 pb-10 sm:px-6 sm:pb-20">
        <div className="mx-auto max-w-[1300px] rounded-[28px] bg-white p-6 shadow sm:rounded-[34px] sm:p-10">
          <h1 className="text-2xl font-black text-[#2f3542] sm:text-3xl">
            Загружаем отслеживание...
          </h1>
        </div>
      </section>
    );
  }

  if (error || !order || !mapData) {
    return (
      <section className="px-3 pb-10 sm:px-6 sm:pb-20">
        <div className="mx-auto max-w-[1300px] rounded-[28px] bg-red-50 p-6 font-bold text-red-600 sm:rounded-[34px] sm:p-10">
          {error || "Заказ не найден"}
        </div>
      </section>
    );
  }

  const currentStep = statusIndex[order.status];

  return (
    <section className="px-3 pb-10 sm:px-6 sm:pb-20">
      <div className="mx-auto max-w-[1350px]">
        <div className="mb-5 sm:mb-8">
          <p className="text-sm font-bold text-[#ff6b00] sm:text-base">
            ClickEat Tracking
          </p>

          <h1 className="text-[32px] font-black leading-tight text-[#2f3542] sm:text-[48px]">
            Отслеживание заказа
          </h1>

          <p className="mt-2 text-sm text-[#7b8698] sm:text-base">
            Заказ #{order.id.slice(-6)} • {statusLabels[order.status]}
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_430px] lg:gap-7">
          <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_18px_45px_rgba(0,0,0,0.08)] sm:rounded-[38px]">
            <div className="h-[340px] sm:h-[450px] lg:h-[560px]">
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

                <Polyline
                  positions={mapData.route}
                  pathOptions={{
                    color: "#ff6b00",
                    weight: 5,
                    opacity: 0.85,
                  }}
                />

                <Marker
                  position={mapData.restaurant}
                  icon={restaurantIcon as L.Icon | L.DivIcon}
                >
                  <Popup>
                    <b>Ресторан</b>
                    <br />
                    {order.restaurantName}
                  </Popup>
                </Marker>

                <Marker
                  position={mapData.courier}
                  icon={courierIcon as L.Icon | L.DivIcon}
                >
                  <Popup>
                    <b>Курьер</b>
                    <br />
                    {order.courierName || "ClickEat Courier"}
                  </Popup>
                </Marker>

                <Marker
                  position={mapData.client}
                  icon={clientIcon as L.Icon | L.DivIcon}
                >
                  <Popup>
                    <b>Вы</b>
                    <br />
                    {formatAddress(order.address)}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

          <aside className="grid gap-4 sm:gap-5">
            <div className="sticky top-[95px] z-20 rounded-[26px] bg-white p-5 shadow-[0_18px_45px_rgba(0,0,0,0.08)] sm:rounded-[34px] sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-[#ff6b00] sm:text-base">
                    ETA
                  </p>

                  <h2 className="mt-1 text-[32px] font-black leading-none text-[#2f3542] sm:text-4xl">
                    {order.estimatedDeliveryTime || "35-45 минут"}
                  </h2>

                  <p className="mt-2 text-sm text-[#7b8698] sm:text-base">
                    {statusLabels[order.status]}
                  </p>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fff0e6] text-2xl text-[#ff6b00] sm:h-16 sm:w-16">
                  <FiTruck />
                </div>
              </div>
            </div>

            <div className="rounded-[26px] bg-white p-5 shadow-[0_18px_45px_rgba(0,0,0,0.08)] sm:rounded-[34px] sm:p-6">
              <h2 className="text-xl font-black text-[#2f3542] sm:text-2xl">
                Статус доставки
              </h2>

              <div className="mt-5 grid gap-4">
                {steps.map((step, index) => {
                  const active = currentStep >= index;

                  return (
                    <div key={step.status} className="flex items-center gap-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg ${
                          active
                            ? "bg-[#ff6b00] text-white"
                            : "bg-[#fff0e6] text-[#ff6b00]"
                        }`}
                      >
                        {step.icon}
                      </div>

                      <p
                        className={`text-sm font-black sm:text-base ${
                          active ? "text-[#2f3542]" : "text-[#9aa3b4]"
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[26px] bg-white p-5 shadow-[0_18px_45px_rgba(0,0,0,0.08)] sm:rounded-[34px] sm:p-6">
              <h2 className="text-xl font-black text-[#2f3542] sm:text-2xl">
                Адрес доставки
              </h2>

              <div className="mt-4 flex gap-3 rounded-[20px] bg-[#fff8f1] p-4 sm:gap-4 sm:rounded-[22px]">
                <FiMapPin className="mt-1 shrink-0 text-2xl text-[#ff6b00]" />

                <div className="min-w-0">
                  <p className="break-words text-sm font-black text-[#2f3542] sm:text-base">
                    {formatAddress(order.address)}
                  </p>

                  <p className="mt-1 text-xs text-[#7b8698] sm:text-sm">
                    Точка доставки выбрана на карте.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[26px] bg-white p-5 shadow-[0_18px_45px_rgba(0,0,0,0.08)] sm:rounded-[34px] sm:p-6">
              <h2 className="text-xl font-black text-[#2f3542] sm:text-2xl">
                Ваш заказ
              </h2>

              <div className="mt-4 grid gap-3">
                {order.items.map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className="flex items-center justify-between gap-4 rounded-[18px] bg-[#fff8f1] p-4"
                  >
                    <span className="text-sm font-bold text-[#2f3542] sm:text-base">
                      {item.name} × {item.quantity}
                    </span>

                    <b className="shrink-0 text-sm text-[#ff6b00] sm:text-base">
                      {formatSum(item.price)}
                    </b>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[22px] bg-[#ff6b00] p-5 text-white sm:rounded-[24px]">
                <p className="text-sm opacity-80 sm:text-base">Итого</p>

                <h3 className="text-[28px] font-black sm:text-3xl">
                  {formatSum(order.totalPrice)}
                </h3>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};