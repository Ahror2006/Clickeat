import { useEffect, useMemo, useState } from "react";
import {
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiNavigation,
  FiPackage,
  FiRefreshCw,
  FiTruck,
  FiXCircle,
} from "react-icons/fi";
import { Link } from "react-router";
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
  deliveryLocation?: Location;
  restaurantName: string;
  restaurantLocation?: Location;
  courierName?: string;
  courierPhone?: string;
  courierLocation?: Location;
  items: OrderItem[];
  totalPrice: number;
  paymentMethod: string;
  status: OrderStatus;
  comment?: string;
  createdAt: string;
};

const statuses: OrderStatus[] = [
  "pending",
  "accepted",
  "cooking",
  "delivering",
  "completed",
  "cancelled",
];

const statusLabels: Record<OrderStatus, string> = {
  pending: "Новый",
  accepted: "Принят",
  cooking: "Готовится",
  delivering: "Доставка",
  completed: "Завершён",
  cancelled: "Отменён",
};

const statusIcons: Record<OrderStatus, React.ReactNode> = {
  pending: <FiClock />,
  accepted: <FiCheckCircle />,
  cooking: <FiPackage />,
  delivering: <FiTruck />,
  completed: <FiCheckCircle />,
  cancelled: <FiXCircle />,
};

function formatSum(value: number) {
  return `${value.toLocaleString("ru-RU")} сум`;
}

function cleanAddress(address = "") {
  return address
    .replace(/,\s*Узбекистан/gi, "")
    .replace(/,\s*Uzbekistan/gi, "")
    .replace(/,\s*Toshkent/gi, "")
    .replace(/,\s*Ташкент/gi, "")
    .replace(/,\s*100000/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getCourierBase(order: Order) {
  const courier = order.courierLocation;
  const restaurant = order.restaurantLocation;

  return {
    lat: courier?.lat ?? restaurant?.lat ?? 41.311081,
    lng: courier?.lng ?? restaurant?.lng ?? 69.240562,
  };
}

export function EmployeePage() {
  const token = getToken();

  const [orders, setOrders] = useState<Order[]>([]);
  const [activeStatus, setActiveStatus] = useState<OrderStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const [movingId, setMovingId] = useState("");
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("https://clickeat-5wy1.onrender.com/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Ошибка загрузки заказов");
        return;
      }

      setOrders(data.orders || []);
    } catch {
      setError("Backend не отвечает");
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (orderId: string, status: OrderStatus) => {
    const response = await fetch(
      `https://clickeat-5wy1.onrender.com/api/orders/${orderId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Ошибка изменения статуса");
      return;
    }

    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? data.order : order))
    );
  };

  const moveCourier = async (
    order: Order,
    direction: "up" | "down" | "left" | "right"
  ) => {
    try {
      setMovingId(order.id);

      const current = getCourierBase(order);
      const step = 0.0012;

      const next = {
        lat:
          direction === "up"
            ? current.lat + step
            : direction === "down"
              ? current.lat - step
              : current.lat,
        lng:
          direction === "right"
            ? current.lng + step
            : direction === "left"
              ? current.lng - step
              : current.lng,
      };

      const response = await fetch(
        `https://clickeat-5wy1.onrender.com/api/orders/${order.id}/courier-location`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            lat: next.lat,
            lng: next.lng,
            address: "Курьер в пути",
            courierName: order.courierName || "ClickEat Courier",
            courierPhone: order.courierPhone || "+998901112233",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Ошибка обновления локации курьера");
        return;
      }

      if (order.status !== "delivering") {
        await changeStatus(order.id, "delivering");
      }

      setOrders((prev) =>
        prev.map((item) => (item.id === order.id ? data.order : item))
      );
    } finally {
      setMovingId("");
    }
  };

  useEffect(() => {
    fetchOrders();

    socket.connect();

    socket.on("order:created", (newOrder: Order) => {
      setOrders((prev) => [newOrder, ...prev]);
    });

    socket.on("order:status-updated", (updatedOrder: Order) => {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );
    });

    socket.on("courier:location-updated", (updatedOrder: Order) => {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );
    });

    return () => {
      socket.off("order:created");
      socket.off("order:status-updated");
      socket.off("courier:location-updated");
    };
  }, []);

  const stats = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      accepted: orders.filter((o) => o.status === "accepted").length,
      cooking: orders.filter((o) => o.status === "cooking").length,
      delivering: orders.filter((o) => o.status === "delivering").length,
      completed: orders.filter((o) => o.status === "completed").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (activeStatus === "all") return orders;
    return orders.filter((order) => order.status === activeStatus);
  }, [orders, activeStatus]);

  return (
    <section className="px-10 pb-16">
      <div className="mx-auto max-w-[1450px]">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="font-bold text-[#ff6b00]">ClickEat Employee</p>
            <h1 className="text-[52px] font-extrabold text-[#2f3542]">
              Панель сотрудника
            </h1>
            <p className="mt-3 text-[#7b8698]">
              Управление заказами, статусами доставки и курьером.
            </p>
          </div>

          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 rounded-[18px] bg-[#ff6b00] px-5 py-4 font-extrabold text-white"
          >
            <FiRefreshCw />
            Обновить
          </button>
        </div>

        {loading && (
          <div className="rounded-[30px] bg-white p-8 text-xl font-bold shadow">
            Загружаем заказы...
          </div>
        )}

        {error && (
          <div className="rounded-[30px] bg-red-50 p-8 font-bold text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-4 gap-5">
              <StatusCard title="Все" value={stats.all} active={activeStatus === "all"} onClick={() => setActiveStatus("all")} />
              <StatusCard title="Новые" value={stats.pending} active={activeStatus === "pending"} onClick={() => setActiveStatus("pending")} />
              <StatusCard title="Готовятся" value={stats.cooking} active={activeStatus === "cooking"} onClick={() => setActiveStatus("cooking")} />
              <StatusCard title="Доставка" value={stats.delivering} active={activeStatus === "delivering"} onClick={() => setActiveStatus("delivering")} />
            </div>

            <div className="mt-8 rounded-[34px] bg-white p-6 shadow-[0_18px_45px_rgba(0,0,0,0.07)]">
              <h2 className="text-3xl font-extrabold text-[#2f3542]">
                Заказы
              </h2>

              <div className="mt-6 grid gap-5">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-[26px] border border-[#f0e3d7] bg-[#fffaf5] p-6"
                  >
                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <h3 className="text-2xl font-extrabold text-[#2f3542]">
                          Заказ #{order.id.slice(-6)}
                        </h3>

                        <p className="mt-2 text-[#7b8698]">
                          {order.customerName} • {order.customerPhone}
                        </p>

                        <p className="text-[#7b8698]">
                          {cleanAddress(order.address)}
                        </p>

                        <p className="text-[#7b8698]">
                          {order.restaurantName}
                        </p>
                      </div>

                      <span className="flex items-center gap-2 rounded-full bg-orange-100 px-5 py-2 font-bold text-[#ff6b00]">
                        {statusIcons[order.status]}
                        {statusLabels[order.status]}
                      </span>
                    </div>

                    <div className="mt-5 rounded-[20px] bg-white p-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between py-2">
                          <span>
                            {item.name} × {item.quantity}
                          </span>
                          <b>{formatSum(item.price)}</b>
                        </div>
                      ))}

                      <div className="mt-3 border-t pt-3 text-right text-xl font-extrabold">
                        Итого: {formatSum(order.totalPrice)}
                      </div>
                    </div>

                    {order.comment && (
                      <p className="mt-4 rounded-[18px] bg-orange-50 p-4 text-[#7b8698]">
                        Комментарий: {order.comment}
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap gap-3">
                      {statuses.map((status) => (
                        <button
                          key={status}
                          onClick={() => changeStatus(order.id, status)}
                          className={`rounded-2xl px-4 py-3 font-bold ${
                            order.status === status
                              ? "bg-[#ff6b00] text-white"
                              : "bg-white text-[#ff6b00]"
                          }`}
                        >
                          {statusLabels[status]}
                        </button>
                      ))}

                      <Link
                        to={`/order-tracking/${order.id}`}
                        className="rounded-2xl bg-[#2f3542] px-4 py-3 font-bold text-white"
                      >
                        Открыть tracking
                      </Link>
                    </div>

                    <div className="mt-5 rounded-[22px] bg-white p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h4 className="flex items-center gap-2 text-xl font-extrabold text-[#2f3542]">
                            <FiNavigation />
                            Управление курьером
                          </h4>

                          <p className="mt-1 text-sm text-[#7b8698]">
                            Нажимай стрелки — клиент увидит движение на карте.
                          </p>
                        </div>

                        <div className="text-right text-sm text-[#7b8698]">
                          <p>{order.courierName || "ClickEat Courier"}</p>
                          <p>{order.courierPhone || "+998901112233"}</p>
                        </div>
                      </div>

                      <div className="mt-5 grid w-[170px] grid-cols-3 gap-2">
                        <div />

                        <MoveButton
                          label="↑"
                          disabled={movingId === order.id}
                          onClick={() => moveCourier(order, "up")}
                        />

                        <div />

                        <MoveButton
                          label="←"
                          disabled={movingId === order.id}
                          onClick={() => moveCourier(order, "left")}
                        />

                        <MoveButton
                          label="•"
                          disabled
                          onClick={() => {}}
                        />

                        <MoveButton
                          label="→"
                          disabled={movingId === order.id}
                          onClick={() => moveCourier(order, "right")}
                        />

                        <div />

                        <MoveButton
                          label="↓"
                          disabled={movingId === order.id}
                          onClick={() => moveCourier(order, "down")}
                        />

                        <div />
                      </div>
                    </div>
                  </div>
                ))}

                {filteredOrders.length === 0 && (
                  <div className="rounded-[26px] bg-[#fff8f1] p-10 text-center font-bold text-[#7b8698]">
                    Заказов пока нет
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function StatusCard({
  title,
  value,
  active,
  onClick,
}: {
  title: string;
  value: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-[30px] p-6 text-left shadow-[0_18px_45px_rgba(0,0,0,0.07)] ${
        active ? "bg-[#ff6b00] text-white" : "bg-white text-[#2f3542]"
      }`}
    >
      <div className="text-2xl">
        <FiPackage />
      </div>
      <p className="mt-5 font-bold opacity-70">{title}</p>
      <h3 className="mt-2 text-4xl font-extrabold">{value}</h3>
    </button>
  );
}

function MoveButton({
  label,
  disabled,
  onClick,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="h-12 rounded-2xl bg-[#fff0e6] text-xl font-black text-[#ff6b00] transition hover:bg-[#ff6b00] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      {label}
    </button>
  );
}