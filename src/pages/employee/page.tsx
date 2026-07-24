import { useEffect, useState } from "react";
import { FiTruck, FiUser } from "react-icons/fi";
import type { ReactNode } from "react";

import { Container } from "../../widgets/container";
import { useThemeStore } from "../../stores/theme.store";
import {
  getAllOrders,
  updateOrderStatus,
  type OrderStatus,
} from "../../lib/orders.api";
import { getErrorMessage } from "../../lib/get-error-message";

type OrderItem = {
  name: string;
  image?: string;
  price: number;
  quantity: number;
};

type Order = {
  id: string;
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

const nextStatusButton: Record<OrderStatus, string> = {
  pending: "Принять заказ",
  accepted: "Начать готовить",
  cooking: "Передать курьеру",
  delivering: "Завершить доставку",
  completed: "Заказ завершён",
  cancelled: "Заказ отменён",
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
  const [changingId, setChangingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      setError("");
      const data = await getAllOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Не удалось загрузить заказы. Проверь роль employee/admin."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();

    const interval = window.setInterval(() => {
      loadOrders();
    }, 6000);

    return () => window.clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      setChangingId(orderId);

      const updatedOrder = await updateOrderStatus(orderId, status);

      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? updatedOrder : order))
      );
    } catch (error: unknown) {
      alert(getErrorMessage(error, "Не удалось изменить статус"));
    } finally {
      setChangingId(null);
    }
  };

  return (
    <main
      className={`min-h-screen pb-24 pt-6 lg:pt-10 ${
        isDark ? "bg-black text-white" : "bg-[#f6f1ea] text-[#2f3542]"
      }`}
    >
      <Container>
        <div className="mb-8">
          <span className="inline-flex rounded-full bg-[#fff3e8] px-4 py-2 text-[12px] font-black text-[#ff6b00]">
            ClickEat Employee
          </span>

          <h1 className="mt-4 text-[34px] font-black leading-tight lg:text-[52px]">
            Панель заказов
          </h1>

          <p
            className={`mt-2 max-w-[620px] text-[15px] leading-6 ${
              isDark ? "text-white/55" : "text-black/55"
            }`}
          >
            Принимай заказы, меняй статус доставки и контролируй процесс.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-[24px] bg-red-50 p-5 font-black text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div
            className={`rounded-[28px] border p-8 text-center ${
              isDark
                ? "border-[#2b1708] bg-[#101010]"
                : "border-black/10 bg-white"
            }`}
          >
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#fff0e6] border-t-[#ff6b00]" />
            <h2 className="text-[24px] font-black">Загружаем заказы...</h2>
          </div>
        ) : !orders.length ? (
          <div
            className={`rounded-[28px] border p-8 text-center ${
              isDark
                ? "border-[#2b1708] bg-[#101010]"
                : "border-black/10 bg-white"
            }`}
          >
            <h2 className="text-[28px] font-black">Заказов пока нет</h2>
            <p className="mt-2 opacity-55">
              Когда клиент оформит заказ, он появится здесь.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            {orders.map((order) => {
              const next = nextStatus[order.status];

              return (
                <article
                  key={order.id}
                  className={`rounded-[28px] border p-4 sm:p-5 ${
                    isDark
                      ? "border-[#2b1708] bg-[#101010]"
                      : "border-black/10 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-[22px] font-black">
                        Заказ #{order.id.slice(-6)}
                      </h2>

                      <p
                        className={`mt-1 text-[13px] ${
                          isDark ? "text-white/50" : "text-black/50"
                        }`}
                      >
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <span className="rounded-full bg-[#ff6b00]/15 px-4 py-2 text-[12px] font-black text-[#ff6b00]">
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

                  <div className="mt-5 grid gap-3">
                    {order.items.map((item, index) => (
                      <div
                        key={`${item.name}-${index}`}
                        className={`flex items-center justify-between gap-3 rounded-[18px] p-3 ${
                          isDark ? "bg-[#171717]" : "bg-[#fff8f1]"
                        }`}
                      >
                        <div className="min-w-0">
                          <h3 className="truncate font-black">{item.name}</h3>

                          <p
                            className={`mt-1 text-[13px] ${
                              isDark ? "text-white/45" : "text-black/45"
                            }`}
                          >
                            Количество: {item.quantity}
                          </p>
                        </div>

                        <strong className="shrink-0 text-[#ff6b00]">
                          {formatSum(item.price)}
                        </strong>
                      </div>
                    ))}
                  </div>

                  <div
                    className={`mt-5 border-t pt-5 ${
                      isDark ? "border-white/10" : "border-black/10"
                    }`}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span className={isDark ? "text-white/55" : "text-black/55"}>
                        Итого
                      </span>

                      <b className="text-[22px] text-[#ff6b00]">
                        {formatSum(order.totalPrice)}
                      </b>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {next && (
                        <button
                          type="button"
                          disabled={changingId === order.id}
                          onClick={() => handleUpdateStatus(order.id, next)}
                          className="rounded-full bg-[#ff6b00] px-5 py-3 text-[14px] font-black text-white disabled:opacity-60"
                        >
                          {changingId === order.id
                            ? "Обновляем..."
                            : nextStatusButton[order.status]}
                        </button>
                      )}

                      {order.status !== "cancelled" &&
                        order.status !== "completed" && (
                          <button
                            type="button"
                            disabled={changingId === order.id}
                            onClick={() =>
                              handleUpdateStatus(order.id, "cancelled")
                            }
                            className="rounded-full bg-red-500 px-5 py-3 text-[14px] font-black text-white disabled:opacity-60"
                          >
                            Отменить
                          </button>
                        )}
                    </div>
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
      className={`rounded-[18px] p-4 ${
        isDark ? "bg-[#171717]" : "bg-[#fff8f1]"
      }`}
    >
      <div className="flex items-center gap-2 text-[#ff6b00]">
        {icon}

        <span className="text-[13px] font-black">{label}</span>
      </div>

      <p className="mt-2 line-clamp-2 font-black">{value}</p>
    </div>
  );
}
