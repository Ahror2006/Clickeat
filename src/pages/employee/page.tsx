import { useEffect, useState } from "react";
import {
  FiCheck,
  FiClock,
  FiPackage,
  FiTruck,
  FiUser,
} from "react-icons/fi";
import { Container } from "../../widgets/container";
import { useThemeStore } from "../../stores/theme.store";

type OrderStatus =
  | "pending"
  | "accepted"
  | "cooking"
  | "delivering"
  | "delivered";

type OrderItem = {
  id: number | string;
  title: string;
  image?: string;
  price: number;
  quantity: number;
};

type Order = {
  id: number | string;
  customerName?: string;
  customerPhone?: string;
  address?: string;
  paymentMethod?: string;
  totalPrice: number;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string;
};

const statusLabels: Record<OrderStatus, string> = {
  pending: "Ожидает принятия",
  accepted: "Принят",
  cooking: "Готовится",
  delivering: "В доставке",
  delivered: "Доставлен",
};

const nextStatus: Record<OrderStatus, OrderStatus | null> = {
  pending: "accepted",
  accepted: "cooking",
  cooking: "delivering",
  delivering: "delivered",
  delivered: null,
};

function formatSum(value: number) {
  return `${value.toLocaleString("ru-RU")} сум`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const EmployeePage = () => {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";

  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const loadOrders = () => {
      try {
        const raw = localStorage.getItem("orderHistory");
        const parsed = raw ? JSON.parse(raw) : [];

        setOrders(Array.isArray(parsed) ? parsed : []);
      } catch {
        setOrders([]);
      }
    };

    loadOrders();

    window.addEventListener("orders-updated", loadOrders);

    return () => {
      window.removeEventListener("orders-updated", loadOrders);
    };
  }, []);
  const updateOrderStatus = (
    orderId: number | string,
    status: OrderStatus
  ) => {
    const updatedOrders = orders.map((order) =>
      String(order.id) === String(orderId)
        ? { ...order, status }
        : order
    );

    localStorage.setItem(
      "orderHistory",
      JSON.stringify(updatedOrders)
    );
    window.dispatchEvent(new Event("orders-updated"));

    setOrders(updatedOrders);
  };

  return (
    <main
      className={`min-h-screen pb-16 pt-[120px] ${isDark ? "bg-black text-white" : "bg-[#f6f1ea] text-[#2f3542]"
        }`}
    >
      <Container>
        <div className="mb-6">
          <span className="inline-flex rounded-full bg-[#fff3e8] px-4 py-2 text-[12px] font-black text-[#ff6b00]">
            ClickEat Employee
          </span>

          <h1 className="mt-4 text-[34px] font-black">
            Панель сотрудника
          </h1>

          <p
            className={`mt-2 text-[14px] ${isDark ? "text-white/55" : "text-black/55"
              }`}
          >
            Управление заказами и статусами доставки.
          </p>
        </div>

        {!orders.length ? (
          <div
            className={`rounded-[28px] border p-8 text-center ${isDark
                ? "border-[#2b1708] bg-[#101010]"
                : "border-black/10 bg-white"
              }`}
          >
            <FiPackage className="mx-auto text-[40px] text-[#ff6b00]" />

            <h2 className="mt-4 text-[28px] font-black">
              Заказов пока нет
            </h2>
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            {orders.map((order) => {
              const next = nextStatus[order.status];

              return (
                <article
                  key={order.id}
                  className={`rounded-[28px] border p-5 ${isDark
                      ? "border-[#2b1708] bg-[#101010]"
                      : "border-black/10 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
                    }`}
                >
                  <div className="flex flex-col gap-5 2xl:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-[24px] font-black">
                          Заказ #{String(order.id).slice(-5)}
                        </h2>

                        <span className="rounded-full bg-[#ff6b00]/15 px-3 py-1 text-[12px] font-black text-[#ff6b00]">
                          {statusLabels[order.status]}
                        </span>
                      </div>

                      <p
                        className={`mt-2 text-[13px] ${isDark ? "text-white/45" : "text-black/45"
                          }`}
                      >
                        {formatDate(order.createdAt)}
                      </p>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <InfoCard
                          icon={<FiUser />}
                          label="Клиент"
                          value={order.customerName || "Не указан"}
                          isDark={isDark}
                        />

                        <InfoCard
                          icon={<FiTruck />}
                          label="Адрес"
                          value={order.address || "Не указан"}
                          isDark={isDark}
                        />
                      </div>

                      <div className="mt-5 grid gap-3">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className={`flex items-center gap-3 rounded-[18px] p-3 ${isDark ? "bg-[#171717]" : "bg-[#fff8f1]"
                              }`}
                          >
                            <img
                              src={item.image}
                              alt={item.title}
                              className="h-[64px] w-[64px] rounded-[16px] object-cover"
                            />

                            <div className="min-w-0 flex-1">
                              <h3 className="line-clamp-1 text-[15px] font-black">
                                {item.title}
                              </h3>

                              <p
                                className={`mt-1 text-[13px] ${isDark
                                    ? "text-white/45"
                                    : "text-black/45"
                                  }`}
                              >
                                {item.quantity} ×{" "}
                                {formatSum(item.price)}
                              </p>
                            </div>

                            <b className="text-[#ff6b00]">
                              {formatSum(
                                item.price * item.quantity
                              )}
                            </b>
                          </div>
                        ))}
                      </div>
                    </div>

                    <aside
                      className={`w-full rounded-[24px] border p-5 lg:w-[280px] ${isDark
                          ? "border-white/10 bg-[#171717]"
                          : "border-black/10 bg-[#fff8f1]"
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <FiClock className="text-[#ff6b00]" />

                        <h3 className="text-[18px] font-black">
                          Управление
                        </h3>
                      </div>

                      <div className="mt-5">
                        <p
                          className={`text-[13px] ${isDark
                              ? "text-white/45"
                              : "text-black/45"
                            }`}
                        >
                          Сумма заказа
                        </p>

                        <b className="mt-1 block text-[28px] font-black text-[#ff6b00]">
                          {formatSum(order.totalPrice)}
                        </b>
                      </div>

                      {next ? (
                        <button
                          type="button"
                          onClick={() =>
                            updateOrderStatus(order.id, next)
                          }
                          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#ff6b00] py-4 text-[14px] font-black text-white transition hover:bg-[#ff7f1f]"
                        >
                          <FiCheck />

                          Перевести в:
                          {statusLabels[next]}
                        </button>
                      ) : (
                        <div className="mt-6 rounded-full bg-green-100 px-4 py-4 text-center text-[14px] font-black text-green-700">
                          Заказ завершён
                        </div>
                      )}
                    </aside>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </Container>
    </main>
  );
};

function InfoCard({
  icon,
  label,
  value,
  isDark,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  isDark: boolean;
}) {
  return (
    <div
      className={`rounded-[18px] p-4 ${isDark ? "bg-[#171717]" : "bg-[#fff8f1]"
        }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-[#ff6b00]">{icon}</span>

        <p
          className={`text-[13px] ${isDark ? "text-white/45" : "text-black/45"
            }`}
        >
          {label}
        </p>
      </div>

      <b className="mt-2 block text-[15px]">{value}</b>
    </div>
  );
}