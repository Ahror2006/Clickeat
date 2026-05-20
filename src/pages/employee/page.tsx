
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  FiTruck,
  FiUser,
} from "react-icons/fi";

import { Container } from "../../widgets/container";
import { useThemeStore } from "../../stores/theme.store";
import { api } from "../../lib/api";
import { getToken } from "../../lib/auth";

type OrderStatus =
  | "pending"
  | "accepted"
  | "cooking"
  | "delivering"
  | "completed"
  | "cancelled";

type OrderItem = {
  name: string;
  image?: string;
  price: number;
  quantity: number;
};

type Order = {
  _id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  paymentMethod: string;
  totalPrice: number;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string;
};

const statusLabels: Record<OrderStatus, string> = {
  pending: "Ожидает",
  accepted: "Принят",
  cooking: "Готовится",
  delivering: "В пути",
  completed: "Доставлен",
  cancelled: "Отменён",
};

const nextStatus: Record<OrderStatus, OrderStatus | null> = {
  pending: "accepted",
  accepted: "cooking",
  cooking: "delivering",
  delivering: "completed",
  completed: null,
  cancelled: null,
};

function formatSum(value: number) {
  return `${value.toLocaleString("ru-RU")} сум`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("ru-RU");
}

export const EmployeePage = () => {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const token = getToken();

  const loadOrders = async () => {
    try {
      const response = await api.get("/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (
    orderId: string,
    status: OrderStatus
  ) => {
    try {
      await api.patch(
        `/orders/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? { ...order, status }
            : order
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main
      className={`min-h-screen pb-20 pt-[140px] ${isDark
          ? "bg-black text-white"
          : "bg-[#f6f1ea] text-[#2f3542]"
        }`}
    >
      <Container>
        <div className="mb-8">
          <span className="rounded-full bg-[#fff3e8] px-4 py-2 text-[12px] font-black text-[#ff6b00]">
            ClickEat Employee
          </span>

          <h1 className="mt-4 text-[36px] font-black">
            Панель заказов
          </h1>

          <p
            className={`mt-2 ${isDark ? "text-white/55" : "text-black/55"
              }`}
          >
            Управление доставкой и заказами.
          </p>
        </div>

        {loading ? (
          <div>Загрузка...</div>
        ) : !orders.length ? (
          <div
            className={`rounded-[28px] border p-8 ${isDark
                ? "border-[#2b1708] bg-[#101010]"
                : "border-black/10 bg-white"
              }`}
          >
            <h2 className="text-[28px] font-black">
              Заказов пока нет
            </h2>
          </div>
        ) : (
          <div className="grid gap-5">
            {orders.map((order) => {
              const next = nextStatus[order.status];

              return (
                <article
                  key={order._id}
                  className={`rounded-[28px] border p-5 ${isDark
                      ? "border-[#2b1708] bg-[#101010]"
                      : "border-black/10 bg-white"
                    }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="text-[24px] font-black">
                        Заказ #{order._id.slice(-6)}
                      </h2>

                      <p className="mt-2 text-sm opacity-70">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <span className="rounded-full bg-[#ff6b00]/15 px-4 py-2 text-[13px] font-black text-[#ff6b00]">
                      {statusLabels[order.status]}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <InfoCard
                      icon={<FiUser />}
                      label="Клиент"
                      value={order.customerName}
                      isDark={isDark}
                    />

                    <InfoCard
                      icon={<FiTruck />}
                      label="Адрес"
                      value={order.address}
                      isDark={isDark}
                    />
                  </div>

                  <div className="mt-5 space-y-3">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between rounded-[18px] p-3 ${isDark
                            ? "bg-[#171717]"
                            : "bg-[#fff8f1]"
                          }`}
                      >
                        <div>
                          <h3 className="font-bold">
                            {item.name}
                          </h3>

                          <p className="text-sm opacity-70">
                            x{item.quantity}
                          </p>
                        </div>

                        <strong>
                          {formatSum(item.price)}
                        </strong>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {next && (
                      <button
                        onClick={() =>
                          updateStatus(order._id, next)
                        }
                        className="rounded-full bg-[#ff6b00] px-5 py-3 font-bold text-white"
                      >
                        Следующий статус
                      </button>
                    )}

                    {order.status !== "cancelled" &&
                      order.status !== "completed" && (
                        <button
                          onClick={() =>
                            updateStatus(
                              order._id,
                              "cancelled"
                            )
                          }
                          className="rounded-full bg-red-500 px-5 py-3 font-bold text-white"
                        >
                          Отменить
                        </button>
                      )}
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
  icon: ReactNode;
  label: string;
  value: string;
  isDark: boolean;
}) {
  return (
    <div
      className={`rounded-[18px] p-4 ${isDark ? "bg-[#171717]" : "bg-[#fff8f1]"
        }`}
    >
      <div className="flex items-center gap-2 text-[#ff6b00]">
        {icon}

        <span className="text-[13px] font-bold">
          {label}
        </span>
      </div>

      <p className="mt-2 font-black">{value}</p>
    </div>
  );
}

