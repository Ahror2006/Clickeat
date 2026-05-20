import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  FiArrowRight,
  FiClock,
  FiEdit2,
  FiGift,
  FiMail,
  FiPhone,
  FiShield,
  FiShoppingBag,
  FiTag,
  FiUser,
} from "react-icons/fi";

import { Container } from "../../widgets/container";
import { useAuth } from "../../stores/auth.store";
import { useThemeStore } from "../../stores/theme.store";
import { getMyOrders, type OrderStatus } from "../../lib/orders.api";
import { api } from "../../lib/api";
import { getToken, saveAuth } from "../../lib/auth";

type OrderItem = {
  name: string;
  price: number;
  quantity: number;
};

type Order = {
  id: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
};

function getRoleLabel(role?: string) {
  if (role === "admin") return "Админ";
  if (role === "employee") return "Сотрудник";
  return "Клиент";
}

function getRoleDescription(role?: string) {
  if (role === "admin") return "Полный доступ к админ-панели и заказам.";
  if (role === "employee") return "Доступ к заказам и смене статусов.";
  return "Обычный аккаунт для заказов, бонусов и личных данных.";
}

function formatSum(value: number) {
  return `${value.toLocaleString("ru-RU")} сум`;
}

export const ProfilePage = () => {
  const user = useAuth((state) => state.user);
  const updateProfile = useAuth((state) => state.updateProfile);

  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const syncFreshUser = async () => {
      const token = getToken();
      if (!token) return;

      try {
        const response = await api.get("/auth/me");
        const freshUser = response.data.user;

        updateProfile({
          name: freshUser.name || "",
          email: freshUser.email || "",
          phone: freshUser.phone || "",
          avatar: freshUser.avatar || "",
          role: freshUser.role || "client",
        });

        saveAuth(token, freshUser);
      } catch {
        // backend может спать, профиль не ломаем
      }
    };

    syncFreshUser();
  }, [updateProfile]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(Array.isArray(data) ? data : []);
      } catch {
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };

    loadOrders();

    const interval = window.setInterval(loadOrders, 5000);

    return () => window.clearInterval(interval);
  }, []);

  const totalOrders = orders.length;

  const activeOrders = useMemo(() => {
    return orders.filter((order) =>
      ["pending", "accepted", "cooking", "delivering"].includes(order.status)
    ).length;
  }, [orders]);

  const completedOrders = useMemo(() => {
    return orders.filter((order) => order.status === "completed").length;
  }, [orders]);

  const totalItems = useMemo(() => {
    return orders.reduce((sum, order) => {
      if (order.status === "cancelled") return sum;

      return (
        sum +
        order.items.reduce(
          (itemSum, item) => itemSum + (item.quantity || 0),
          0
        )
      );
    }, 0);
  }, [orders]);

  const totalSpent = useMemo(() => {
    return orders.reduce((sum, order) => {
      if (order.status === "cancelled") return sum;
      return sum + (order.totalPrice || 0);
    }, 0);
  }, [orders]);

  if (!user.email) {
    return (
      <main
        className={`min-h-screen pb-20 pt-[130px] ${
          isDark ? "bg-black text-white" : "bg-[#f6f1ea] text-[#2f3542]"
        }`}
      >
        <Container>
          <section
            className={`rounded-[32px] border p-8 text-center ${
              isDark
                ? "border-[#2b1708] bg-[#101010]"
                : "border-black/10 bg-white"
            }`}
          >
            <FiUser className="mx-auto text-[44px] text-[#ff6b00]" />

            <h1 className="mt-4 text-[30px] font-black">Вы не вошли</h1>

            <p className="mt-2 opacity-60">
              Чтобы открыть профиль, нужно войти в аккаунт.
            </p>

            <Link
              to="/login"
              className="mt-6 inline-flex rounded-full bg-[#ff6b00] px-8 py-4 font-black text-white"
            >
              Войти
            </Link>
          </section>
        </Container>
      </main>
    );
  }

  return (
    <main
      className={`min-h-screen pb-24 pt-[120px] lg:pt-[150px] ${
        isDark ? "bg-black text-white" : "bg-[#f6f1ea] text-[#2f3542]"
      }`}
    >
      <Container>
        <section
          className={`overflow-hidden rounded-[34px] border ${
            isDark
              ? "border-[#2b1708] bg-[#101010]"
              : "border-black/10 bg-white shadow-[0_18px_48px_rgba(0,0,0,0.08)]"
          }`}
        >
          <div className="relative h-[190px] overflow-hidden sm:h-[240px]">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-[#ff6b00] via-[#ff9b3d] to-[#111]" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <Link
              to="/profile/edit"
              className="absolute right-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] font-black text-[#ff6b00] shadow-xl"
            >
              <FiEdit2 />
              Редактировать
            </Link>
          </div>

          <div className="relative px-5 pb-7 sm:px-8">
            <div className="-mt-[58px] flex flex-col items-center text-center">
              <div className="relative">
                <div className="flex h-[112px] w-[112px] items-center justify-center overflow-hidden rounded-full border-4 border-[#ff6b00] bg-[#fff3e8] shadow-[0_12px_30px_rgba(0,0,0,0.22)]">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FiUser className="text-[46px] text-[#ff6b00]" />
                  )}
                </div>

                <span className="absolute bottom-2 right-1 h-5 w-5 rounded-full border-4 border-white bg-green-500" />
              </div>

              <p className="mt-4 text-[13px] font-black opacity-50">
                Личный кабинет
              </p>

              <h1 className="mt-1 text-[36px] font-black leading-tight">
                {user.name || "User"}
              </h1>

              <p className="mt-2 max-w-[520px] text-[15px] leading-6 opacity-60">
                Управляй личными данными, заказами, бонусами и промокодами.
              </p>

              <span className="mt-4 inline-flex rounded-full bg-[#ff6b00] px-5 py-2 text-[13px] font-black text-white">
                {getRoleLabel(user.role)}
              </span>

              <Link
                to="/profile/edit"
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#ff6b00] px-5 py-3 text-[14px] font-black text-[#ff6b00]"
              >
                <FiEdit2 />
                Редактировать профиль
              </Link>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatCard
                icon={<FiShoppingBag />}
                label="Заказы"
                value={loadingOrders ? "..." : String(totalOrders)}
                isDark={isDark}
              />

              <StatCard
                icon={<FiClock />}
                label="Активные"
                value={loadingOrders ? "..." : String(activeOrders)}
                isDark={isDark}
              />

              <StatCard
                icon={<FiGift />}
                label="Блюда"
                value={loadingOrders ? "..." : String(totalItems)}
                isDark={isDark}
              />

              <StatCard
                icon={<FiTag />}
                label="Сумма"
                value={loadingOrders ? "..." : formatSum(totalSpent)}
                isDark={isDark}
              />
            </div>

            <div className="mt-6 grid gap-5 xl:grid-cols-2">
              <div
                className={`rounded-[28px] border p-5 ${
                  isDark
                    ? "border-[#2b1708] bg-[#151515]"
                    : "border-black/10 bg-[#fff8f1]"
                }`}
              >
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-[24px] font-black">
                      Основная информация
                    </h2>
                    <p className="mt-1 text-[14px] opacity-55">
                      Данные, которые используются в аккаунте.
                    </p>
                  </div>

                  <Link
                    to="/profile/edit"
                    className="rounded-full bg-[#ff6b00] px-4 py-2 text-[13px] font-black text-white"
                  >
                    Изменить
                  </Link>
                </div>

                <InfoRow
                  icon={<FiUser />}
                  label="Имя"
                  value={user.name || "Не указано"}
                  isDark={isDark}
                />

                <InfoRow
                  icon={<FiMail />}
                  label="Email"
                  value={user.email || "Не указано"}
                  isDark={isDark}
                />

                <InfoRow
                  icon={<FiPhone />}
                  label="Телефон"
                  value={user.phone || "Не указано"}
                  isDark={isDark}
                />
              </div>

              <div
                className={`rounded-[28px] border p-5 ${
                  isDark
                    ? "border-[#2b1708] bg-[#151515]"
                    : "border-black/10 bg-[#fff8f1]"
                }`}
              >
                <h2 className="text-[24px] font-black">Статус аккаунта</h2>

                <p className="mt-1 text-[14px] opacity-55">
                  Роль определяется системой автоматически.
                </p>

                <div className="mt-5 rounded-[24px] bg-[#ff6b00]/10 p-5 text-center">
                  <FiShield className="mx-auto text-[34px] text-[#ff6b00]" />

                  <p className="mt-3 text-[13px] font-black opacity-55">
                    Текущий статус
                  </p>

                  <h3 className="mt-1 text-[24px] font-black text-[#ff6b00]">
                    {getRoleLabel(user.role)}
                  </h3>

                  <p className="mt-2 text-[14px] opacity-65">
                    {getRoleDescription(user.role)}
                  </p>
                </div>

                <div className="mt-5 grid gap-3">
                  <Link
                    to="/orders"
                    className="flex items-center justify-between rounded-[20px] bg-[#ff6b00] px-5 py-4 font-black text-white"
                  >
                    Открыть заказы
                    <FiArrowRight />
                  </Link>

                  <Link
                    to="/order-history"
                    className="flex items-center justify-between rounded-[20px] bg-[#ff6b00] px-5 py-4 font-black text-white"
                  >
                    История заказов
                    <FiArrowRight />
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              <SmallCard
                title="Активные заказы"
                value={String(activeOrders)}
                text="Заказы, которые ещё не закрыты."
                isDark={isDark}
              />

              <SmallCard
                title="Завершённые"
                value={String(completedOrders)}
                text="Доставленные заказы."
                isDark={isDark}
              />

              <SmallCard
                title="Промокоды"
                value="0"
                text="Пока нет активных промокодов."
                isDark={isDark}
              />
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
};

function StatCard({
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
      className={`rounded-[24px] border p-4 ${
        isDark
          ? "border-[#2b1708] bg-[#151515]"
          : "border-black/10 bg-[#fff8f1]"
      }`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#ff6b00] text-[24px] text-white">
        {icon}
      </div>

      <p className="mt-4 text-[13px] opacity-55">{label}</p>

      <b className="mt-1 block text-[22px] font-black">{value}</b>
    </div>
  );
}

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
      className={`mb-3 flex items-center gap-4 rounded-[20px] p-4 ${
        isDark ? "bg-[#101010]" : "bg-white"
      }`}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#ff6b00]/15 text-[22px] text-[#ff6b00]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[13px] opacity-55">{label}</p>
        <b className="block truncate">{value}</b>
      </div>
    </div>
  );
}

function SmallCard({
  title,
  value,
  text,
  isDark,
}: {
  title: string;
  value: string;
  text: string;
  isDark: boolean;
}) {
  return (
    <div
      className={`rounded-[24px] border p-5 ${
        isDark
          ? "border-[#2b1708] bg-[#151515]"
          : "border-black/10 bg-[#fff8f1]"
      }`}
    >
      <p className="text-[14px] font-black opacity-55">{title}</p>
      <h3 className="mt-2 text-[30px] font-black text-[#ff6b00]">{value}</h3>
      <p className="mt-2 text-[13px] leading-5 opacity-55">{text}</p>
    </div>
  );
}