import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Helmet } from "react-helmet";
import { Container } from "../../widgets/container";
import { getMyOrders } from "../../lib/orders.api";
import { useThemeStore } from "../../stores/theme.store";

type Order = {
  id: string;
  status: string;
  totalPrice: number;
  createdAt: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }[];
};

function formatPrice(price: number) {
  return `${price.toLocaleString("ru-RU")} сум`;
}

function getStatusLabel(status: string) {
  switch (status) {
    case "pending":
      return "Ожидает";
    case "accepted":
      return "Принят";
    case "cooking":
      return "Готовится";
    case "delivering":
      return "Доставляется";
    case "completed":
      return "Доставлен";
    case "cancelled":
      return "Отменён";
    default:
      return status;
  }
}

export const OrderHistoryPage = () => {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className={`min-h-screen pt-[140px] pb-20 ${
        isDark
          ? "bg-black text-white"
          : "bg-[#f6f1ea] text-[#2f3542]"
      }`}
    >
      <Helmet>
        <title>История заказов</title>
      </Helmet>

      <Container>
        <div className="mb-10">
          <h1 className="text-[34px] font-black">
            История заказов
          </h1>

          <p
            className={`mt-2 text-[15px] ${
              isDark ? "text-white/60" : "text-[#7c7c7c]"
            }`}
          >
            Все ваши оформленные заказы ClickEat.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-[18px]">
            Загрузка...
          </div>
        ) : orders.length === 0 ? (
          <div
            className={`rounded-[28px] border p-10 text-center ${
              isDark
                ? "border-[#1f1f1f] bg-[#101010]"
                : "border-[#ece3d9] bg-white"
            }`}
          >
            <h2 className="text-[26px] font-black">
              Заказов пока нет
            </h2>

            <p
              className={`mt-3 ${
                isDark ? "text-white/60" : "text-[#7c7c7c]"
              }`}
            >
              Самое время заказать что-нибудь вкусное 🍕
            </p>

            <Link
              to="/menu"
              className="mt-6 inline-flex rounded-full bg-[#ff6b00] px-6 py-3 font-bold text-white"
            >
              Перейти в меню
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/order-tracking/${order.id}`}
                className={`rounded-[28px] border p-6 transition hover:-translate-y-1 ${
                  isDark
                    ? "border-[#1f1f1f] bg-[#101010]"
                    : "border-[#ece3d9] bg-white"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-[24px] font-black">
                      Заказ #{order.id.slice(-6)}
                    </h2>

                    <p
                      className={`mt-1 text-[14px] ${
                        isDark
                          ? "text-white/55"
                          : "text-[#7c7c7c]"
                      }`}
                    >
                      {new Date(order.createdAt).toLocaleString(
                        "ru-RU"
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-[#ff6b00]/15 px-4 py-2 text-[13px] font-bold text-[#ff6b00]">
                      {getStatusLabel(order.status)}
                    </span>

                    <strong className="text-[20px] text-[#ff6b00]">
                      {formatPrice(order.totalPrice)}
                    </strong>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className={`rounded-full px-4 py-2 text-[13px] ${
                        isDark
                          ? "bg-[#1a1a1a]"
                          : "bg-[#f5eee6]"
                      }`}
                    >
                      {item.name} × {item.quantity}
                    </div>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </main>
  );
};