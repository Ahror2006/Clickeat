import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiPackage,
  FiTruck,
  FiXCircle,
} from "react-icons/fi";

import { Container } from "../../widgets/container";
import { getMyOrders, type OrderStatus } from "../../lib/orders.api";
import { useThemeStore } from "../../stores/theme.store";

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  customerName: string;
  address: string;
  totalPrice: number;
  paymentMethod: string;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: string;
};

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    icon: React.ReactNode;
    color: string;
    bg: string;
  }
> = {
  pending: {
    label: "Ожидает",
    icon: <FiClock />,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },

  accepted: {
    label: "Принят",
    icon: <FiCheckCircle />,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },

  cooking: {
    label: "Готовится",
    icon: <FiPackage />,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },

  delivering: {
    label: "В пути",
    icon: <FiTruck />,
    color: "text-[#ff6b00]",
    bg: "bg-[#ff6b00]/10",
  },

  completed: {
    label: "Доставлен",
    icon: <FiCheckCircle />,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },

  cancelled: {
    label: "Отменён",
    icon: <FiXCircle />,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
};

function formatSum(value: number) {
  return `${value.toLocaleString("ru-RU")} сум`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("ru-RU");
}

export const OrderHistoryPage = () => {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();

    const interval = window.setInterval(() => {
      loadOrders();
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <main
      className={`min-h-screen pb-24 pt-[120px] lg:pt-[150px] ${isDark ? "bg-black text-white" : "bg-[#f6f1ea] text-[#2f3542]"
        }`}
    >
      <Container>
        <div className="mb-8">
          <span className="rounded-full bg-[#fff3e8] px-4 py-2 text-[12px] font-black text-[#ff6b00]">
            ClickEat Orders
          </span>

          <h1 className="mt-4 text-[34px] font-black lg:text-[52px]">
            История заказов
          </h1>

          <p
            className={`mt-2 text-[15px] ${isDark ? "text-white/55" : "text-black/55"
              }`}
          >
            Здесь отображаются все ваши заказы и статусы доставки.
          </p>
        </div>

        {loading ? (
          <div
            className={`rounded-[28px] border p-8 text-center ${isDark
                ? "border-[#2b1708] bg-[#101010]"
                : "border-black/10 bg-white"
              }`}
          >
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#fff0e6] border-t-[#ff6b00]" />

            <h2 className="text-[24px] font-black">
              Загружаем заказы...
            </h2>
          </div>
        ) : !orders.length ? (
          <div
            className={`rounded-[28px] border p-8 text-center ${isDark
                ? "border-[#2b1708] bg-[#101010]"
                : "border-black/10 bg-white"
              }`}
          >
            <h2 className="text-[28px] font-black">
              Заказов пока нет
            </h2>

            <p className="mt-2 opacity-55">
              Когда вы оформите заказ — он появится здесь.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {orders.map((order) => {
              const status = statusConfig[order.status];

              return (
                <article
                  key={order.id}
                  className={`rounded-[30px] border p-5 ${isDark
                      ? "border-[#2b1708] bg-[#101010]"
                      : "border-black/10 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
                    }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-[24px] font-black">
                        Заказ #{order.id.slice(-6)}
                      </h2>

                      <p
                        className={`mt-1 text-[13px] ${isDark ? "text-white/50" : "text-black/50"
                          }`}
                      >
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div
                      className={`flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-black ${status.color} ${status.bg}`}
                    >
                      {status.icon}
                      {status.label}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3">
                    {order.items.map((item, index) => (
                      <div
                        key={`${item.name}-${index}`}
                        className={`flex items-center justify-between rounded-[18px] p-3 ${isDark ? "bg-[#171717]" : "bg-[#fff8f1]"
                          }`}
                      >
                        <div>
                          <h3 className="font-black">{item.name}</h3>

                          <p
                            className={`mt-1 text-[13px] ${isDark ? "text-white/45" : "text-black/45"
                              }`}
                          >
                            Количество: {item.quantity}
                          </p>
                        </div>

                        <strong className="text-[#ff6b00]">
                          {formatSum(item.price)}
                        </strong>
                      </div>
                    ))}
                  </div>

                  <div
                    className={`mt-5 border-t pt-5 ${isDark ? "border-white/10" : "border-black/10"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className={`text-[13px] ${isDark ? "text-white/50" : "text-black/50"
                            }`}
                        >
                          Общая сумма
                        </p>

                        <strong className="text-[24px] text-[#ff6b00]">
                          {formatSum(order.totalPrice)}
                        </strong>
                      </div>

                      <Link
                        to={`/order-tracking/${order.id}`}
                        className="inline-flex items-center gap-2 rounded-full bg-[#ff6b00] px-5 py-3 text-[14px] font-black text-white"
                      >
                        Отследить
                        <FiArrowRight />
                      </Link>
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