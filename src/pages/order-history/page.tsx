import { useState } from "react";
import {
  RiArrowDownSLine,
  RiShoppingBag3Line,
  RiMapPinLine,
  RiTimeLine,
  RiBankCardLine,
  RiUserLine,
  RiTruckLine,
} from "react-icons/ri";
import { useThemeStore } from "../../stores/theme.store";

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: number;
  createdAt: string;
  items: OrderItem[];
  total: number;
  restaurant?: string;
  address?: string;
  payment?: string;
  deliveryTime?: string;
  client?: string;
  phone?: string;
  comment?: string;
};

const demoOrders: Order[] = [
  {
    id: 1001,
    createdAt: "12.02.2025, 19:42",
    restaurant: "ClickEat Restaurant",
    address: "Фарғона Йўли 15, Toshkent",
    payment: "Наличными",
    deliveryTime: "35–45 минут",
    client: "Ahror",
    phone: "+998 93 767 09 24",
    comment: "Комментарий к заказу не был оставлен.",
    items: [
      { name: "Зелёный дракон", quantity: 4, price: 312000 },
      { name: "Император ролл", quantity: 3, price: 276000 },
      { name: "Тунец премиум", quantity: 2, price: 190000 },
    ],
    total: 778000,
  },
];

function formatSum(value: number) {
  return `${value.toLocaleString("ru-RU")} сум`;
}

export const OrderHistoryPage = () => {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";

  const [openId, setOpenId] = useState<number | null>(null);

  const savedOrders: Order[] = JSON.parse(
    localStorage.getItem("orderHistory") || "[]"
  );

  const orders = savedOrders.length ? savedOrders : demoOrders;

  return (
    <main
      className={`min-h-screen px-5 pb-20 pt-[170px] ${
        isDark ? "bg-black text-white" : "bg-[#f6f1ea] text-[#171717]"
      }`}
    >
      <section
        className={`mx-auto max-w-[1180px] rounded-[44px] border p-8 md:p-12 ${
          isDark
            ? "border-[#2a1608] bg-[#0f0f0f]"
            : "border-black/5 bg-white shadow-[0_30px_90px_rgba(0,0,0,0.1)]"
        }`}
      >
        <span className="inline-flex rounded-full bg-[#ff6b00]/15 px-5 py-2 text-[14px] font-black text-[#ff6b00]">
          ClickEat Orders
        </span>

        <h1 className="mt-6 text-[46px] font-black md:text-[64px]">
          История <span className="text-[#ff6b00]">заказов</span>
        </h1>

        <p className={`mt-3 ${isDark ? "text-white/55" : "text-black/55"}`}>
          Нажми на заказ, чтобы посмотреть полную информацию.
        </p>

        <div className="mt-10 grid gap-5">
          {orders.map((order) => {
            const isOpen = openId === order.id;
            const firstItem = order.items?.[0];

            return (
              <article
                key={order.id}
                className={`overflow-hidden rounded-[30px] border transition ${
                  isDark
                    ? "border-[#2a1608] bg-black/35"
                    : "border-black/5 bg-[#fbf7f1]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : order.id)}
                  className="flex w-full flex-col gap-5 p-6 text-left md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#ff6b00] text-[26px] text-white">
                      <RiShoppingBag3Line />
                    </div>

                    <div>
                      <h2 className="text-[22px] font-black">
                        Заказ #{order.id}
                      </h2>

                      <p
                        className={`mt-1 text-[15px] ${
                          isDark ? "text-white/55" : "text-black/55"
                        }`}
                      >
                        {order.createdAt} • {firstItem?.name || "Заказ"}{" "}
                        {order.items.length > 1 &&
                          `+ ещё ${order.items.length - 1}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-5 md:justify-end">
                    <p className="text-[22px] font-black text-[#ff6b00]">
                      {formatSum(order.total)}
                    </p>

                    <RiArrowDownSLine
                      className={`text-[30px] text-[#ff6b00] transition ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div
                    className={`border-t p-6 ${
                      isDark ? "border-white/10" : "border-black/10"
                    }`}
                  >
                    <div className="grid gap-8 lg:grid-cols-2">
                      <div>
                        <h3 className="text-[26px] font-black">
                          Блюда в заказе
                        </h3>

                        <div className="mt-5 grid gap-4">
                          {order.items.map((item) => (
                            <div
                              key={item.name}
                              className={`flex items-center justify-between rounded-[22px] p-4 ${
                                isDark ? "bg-[#111]" : "bg-white"
                              }`}
                            >
                              <div>
                                <h4 className="font-black">{item.name}</h4>
                                <p
                                  className={
                                    isDark
                                      ? "mt-1 text-white/50"
                                      : "mt-1 text-black/50"
                                  }
                                >
                                  {item.quantity} шт.
                                </p>
                              </div>

                              <p className="font-black text-[#ff6b00]">
                                {formatSum(item.price)}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="mt-6 rounded-[24px] bg-[#ff6b00] p-5 text-white">
                          <p className="text-[15px] opacity-80">Итого</p>
                          <h3 className="text-[30px] font-black">
                            {formatSum(order.total)}
                          </h3>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-[26px] font-black">
                          Информация о доставке
                        </h3>

                        <div className="mt-5 grid gap-4">
                          <InfoRow
                            icon={<RiShoppingBag3Line />}
                            label="Ресторан"
                            value={order.restaurant || "ClickEat Restaurant"}
                            isDark={isDark}
                          />

                          <InfoRow
                            icon={<RiMapPinLine />}
                            label="Адрес"
                            value={order.address || "Адрес не указан"}
                            isDark={isDark}
                          />

                          <InfoRow
                            icon={<RiTimeLine />}
                            label="Время доставки"
                            value={order.deliveryTime || "35–45 минут"}
                            isDark={isDark}
                          />

                          <InfoRow
                            icon={<RiTruckLine />}
                            label="Курьер"
                            value="Назначается автоматически"
                            isDark={isDark}
                          />

                          <InfoRow
                            icon={<RiBankCardLine />}
                            label="Оплата"
                            value={order.payment || "Наличными"}
                            isDark={isDark}
                          />

                          <InfoRow
                            icon={<RiUserLine />}
                            label="Клиент"
                            value={`${order.client || "Ahror"} ${
                              order.phone || ""
                            }`}
                            isDark={isDark}
                          />
                        </div>

                        <div
                          className={`mt-6 rounded-[24px] border p-5 ${
                            isDark
                              ? "border-[#2a1608] bg-[#111]"
                              : "border-black/5 bg-white"
                          }`}
                        >
                          <h4 className="font-black">Комментарий клиента</h4>
                          <p
                            className={`mt-2 ${
                              isDark ? "text-white/55" : "text-black/55"
                            }`}
                          >
                            {order.comment || "Комментарий к заказу не был оставлен."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
};

function InfoRow({
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
      className={`flex gap-4 rounded-[22px] p-4 ${
        isDark ? "bg-[#111]" : "bg-white"
      }`}
    >
      <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-[#ff6b00] text-[22px] text-white">
        {icon}
      </div>

      <div>
        <p className={isDark ? "text-white/45" : "text-black/45"}>{label}</p>
        <h4 className="mt-1 font-black">{value}</h4>
      </div>
    </div>
  );
}