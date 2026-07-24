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
          pointsBalance: freshUser.pointsBalance || 0,
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
        className={`min-h-screen pb-20 pt-6 lg:pt-10 ${
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
      className={`min-h-screen pb-24 pt-5 lg:pt-[150px] ${
        isDark ? "bg-[radial-gradient(circle_at_80%_0%,#241105_0%,#080808_32%)] text-white" : "bg-[radial-gradient(circle_at_80%_0%,#ffe3ce_0%,#f7f4f0_34%)] text-[#2f3542]"
      }`}
    >
      <Container>
        <section>
          <div className={`relative h-[220px] overflow-hidden rounded-[30px] border sm:h-[300px] lg:rounded-[40px] ${isDark ? "border-white/10" : "border-white/80 shadow-[0_24px_70px_rgba(55,31,13,0.16)]"}`}>
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-[#ff6b00] via-[#ff9b3d] to-[#111]" />
            )}

            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/20 to-transparent" />
            <div className="absolute bottom-5 left-6 text-white sm:bottom-8 sm:left-9">
              <span className="rounded-full border border-white/20 bg-black/25 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] backdrop-blur-md">ClickEat member</span>
            </div>
          </div>

          <div className="relative px-1 pb-7 sm:px-4">
            <div className="-mt-[54px] flex flex-col items-center text-center sm:-mt-[64px] lg:ml-9 lg:flex-row lg:items-end lg:text-left">
              <div className="relative">
                <div className={`flex h-[112px] w-[112px] items-center justify-center overflow-hidden rounded-[32px] border-[5px] bg-[#fff3e8] shadow-[0_16px_38px_rgba(0,0,0,0.28)] sm:h-[128px] sm:w-[128px] ${isDark ? "border-[#111]" : "border-white"}`}>
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

                <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-4 border-white bg-green-500" />
              </div>

              <div className="mt-4 lg:mb-1 lg:ml-6">
                <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start"><h1 className="text-[36px] font-black leading-tight sm:text-[44px]">{user.name || "User"}</h1><span className="rounded-full bg-[#ff6b00]/15 px-4 py-2 text-[11px] font-black uppercase tracking-wider text-[#ff6b00]">{getRoleLabel(user.role)}</span></div>
                <p className="mt-1 max-w-[560px] text-[14px] leading-6 opacity-55 sm:text-[15px]">Заказы, бонусы и личные данные — всё важное в одном месте.</p>
              </div>
            </div>

            <div className={`mt-7 grid grid-cols-2 overflow-hidden rounded-[26px] border lg:grid-cols-4 ${isDark ? "border-white/10 bg-white/[0.035]" : "border-black/[0.06] bg-white/80 shadow-[0_15px_45px_rgba(55,31,13,0.07)] backdrop-blur"}`}>
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

            <div className="mt-6 grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
              <div
                className={`rounded-[28px] border p-5 ${
                  isDark
                    ? "border-white/10 bg-white/[0.045]"
                    : "border-black/[0.06] bg-white/80 shadow-[0_16px_48px_rgba(55,31,13,0.07)]"
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
                    className="inline-flex items-center gap-2 rounded-full border border-[#ff6b00] px-4 py-2 text-[13px] font-black text-[#ff6b00] transition hover:bg-[#ff6b00] hover:text-white"
                  >
                    <FiEdit2 />
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
                    ? "border-white/10 bg-white/[0.045]"
                    : "border-black/[0.06] bg-white/80 shadow-[0_16px_48px_rgba(55,31,13,0.07)]"
                }`}
              >
                <h2 className="text-[24px] font-black">Статус аккаунта</h2>

                <p className="mt-1 text-[14px] opacity-55">
                  Роль определяется системой автоматически.
                </p>

                <div className="mt-5 flex items-center gap-4 rounded-[22px] bg-[#ff6b00]/10 p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ff6b00] text-2xl text-white"><FiShield /></div>
                  <div><h3 className="font-black text-[#ff6b00]">{getRoleLabel(user.role)}</h3><p className="mt-1 text-[13px] leading-5 opacity-60">{getRoleDescription(user.role)}</p></div>
                </div>

                <div className="mt-5 grid gap-3">
                  <Link
                    to="/orders"
                    className="group flex items-center justify-between rounded-[18px] bg-[#ff6b00] px-5 py-3.5 font-black text-white transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Открыть заказы
                    <FiArrowRight />
                  </Link>

                  <Link
                    to="/order-history"
                    className={`group flex items-center justify-between rounded-[18px] border px-5 py-3.5 font-black transition hover:border-[#ff6b00] hover:text-[#ff6b00] ${isDark ? "border-white/10" : "border-black/10"}`}
                  >
                    История заказов
                    <FiArrowRight />
                  </Link>

                  <Link
                    to="/promo"
                    className="flex items-center justify-between rounded-[18px] bg-[#ff6b00]/10 px-5 py-3.5 font-black text-[#ff6b00] transition hover:bg-[#ff6b00] hover:text-white"
                  >
                    Баллы: {(user.pointsBalance || 0).toLocaleString("ru-RU")}
                    <FiGift />
                  </Link>
                </div>
              </div>
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
      className={`relative p-4 after:absolute after:bottom-[20%] after:right-0 after:h-[60%] after:w-px after:bg-current after:opacity-10 last:after:hidden ${isDark ? "" : ""}`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#ff6b00]/12 text-[20px] text-[#ff6b00]">
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
        isDark ? "bg-black/30" : "bg-[#f8f5f1]"
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

