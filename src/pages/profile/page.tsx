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
import { getToken, saveAuth } from "../../lib/auth";

type OrderItem = {
  id: number | string;
  title: string;
  price: number;
  quantity: number;
};

type SavedOrder = {
  id: number | string;
  items?: OrderItem[];
  totalPrice?: number;
  promoCode?: string;
  status?: string;
};

function getSavedOrders(): SavedOrder[] {
  try {
    const raw = localStorage.getItem("orderHistory");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getRoleLabel(role?: string) {
  if (role === "admin") return "Админ";
  if (role === "employee" || role === "staff") return "Сотрудник";
  return "Клиент";
}

function getRoleDescription(role?: string) {
  if (role === "admin") return "Полный доступ к админ-панели и заказам.";
  if (role === "employee" || role === "staff") return "Доступ к заказам и смене статусов.";
  return "Обычный аккаунт для заказов, бонусов и личных данных.";
}

export const ProfilePage = () => {
  const user = useAuth((state) => state.user);
  const updateProfile = useAuth((state) => state.updateProfile);
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";

  const [orders, setOrders] = useState<SavedOrder[]>(() => getSavedOrders());

  useEffect(() => {
    const syncOrders = () => setOrders(getSavedOrders());

    syncOrders();

    window.addEventListener("storage", syncOrders);
    window.addEventListener("orders-updated", syncOrders);

    return () => {
      window.removeEventListener("storage", syncOrders);
      window.removeEventListener("orders-updated", syncOrders);
    };
  }, []);

  useEffect(() => {
    const syncFreshUser = async () => {
      const token = getToken();
      if (!token) return;

      try {
        const response = await fetch("https://clickeat-5wy1.onrender.com/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok || !data.user) return;

        updateProfile({
          name: data.user.name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          avatar: data.user.avatar || "",
          role: data.user.role || "client",
        });

        saveAuth(token, data.user);
      } catch {
        // Render может спать, поэтому профиль не ломаем
      }
    };

    syncFreshUser();
  }, [updateProfile]);

  const totalOrders = orders.length;

  const totalSpent = useMemo(() => {
    return orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
  }, [orders]);

  const totalItems = useMemo(() => {
    return orders.reduce((sum, order) => {
      return (
        sum +
        (order.items?.reduce((itemSum, item) => itemSum + (item.quantity || 0), 0) || 0)
      );
    }, 0);
  }, [orders]);

  const activeOrders = useMemo(() => {
    return orders.filter((order) => order.status && order.status !== "delivered").length;
  }, [orders]);

  if (!user.email) {
    return (
      <main
        className={`min-h-screen min-w-[360px] pb-16 pt-[125px] ${
          isDark ? "bg-black text-white" : "bg-[#f6f1ea] text-[#2f3542]"
        }`}
      >
        <Container>
          <section
            className={`rounded-[32px] border p-8 text-center ${
              isDark
                ? "border-[#2b1708] bg-[#101010]"
                : "border-black/10 bg-white shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
            }`}
          >
            <FiUser className="mx-auto text-[44px] text-[#ff6b00]" />
            <h1 className="mt-4 text-[30px] font-black">Вы не вошли</h1>
            <p className={`mt-2 text-[15px] ${isDark ? "text-white/55" : "text-black/55"}`}>
              Чтобы открыть профиль, нужно войти в аккаунт.
            </p>

            <Link
              to="/login"
              className="mt-6 inline-flex rounded-full bg-[#ff6b00] px-8 py-4 text-[15px] font-black text-white"
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
      className={`min-h-screen  pb-16 pt-[120px] ${
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
          <div className="relative h-[180px] overflow-hidden sm:h-[240px]">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-[#ff6b00] via-[#ff9b3d] to-[#111]" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <Link
              to="/profile/edit"
              className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] font-black text-[#ff6b00] shadow-xl"
            >
              <FiEdit2 />
              Изменить
            </Link>
          </div>

          <div className="relative px-5 pb-7 sm:px-8">
            <div className="-mt-[54px] flex flex-col items-center text-center">
              <div className="relative">
                <div className="flex h-[108px] w-[108px] items-center justify-center overflow-hidden rounded-full border-4 border-[#ff6b00] bg-[#fff3e8] shadow-[0_12px_30px_rgba(0,0,0,0.22)]">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <FiUser className="text-[46px] text-[#ff6b00]" />
                  )}
                </div>

                <span className="absolute bottom-2 right-1 h-5 w-5 rounded-full border-4 border-white bg-green-500" />
              </div>

              <p className={`mt-4 text-[13px] font-black ${isDark ? "text-white/45" : "text-black/45"}`}>
                Личный кабинет
              </p>

              <h1 className="mt-1 text-[36px] font-black leading-tight">{user.name || "User"}</h1>

              <p className={`mt-2 max-w-[520px] text-[15px] leading-6 ${isDark ? "text-white/60" : "text-black/55"}`}>
                Управляй личными данными, заказами, бонусами и промокодами.
              </p>

              <span className="mt-4 inline-flex rounded-full bg-[#ff6b00] px-5 py-2 text-[13px] font-black text-white">
                {getRoleLabel(user.role)}
              </span>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatCard icon={<FiShoppingBag />} label="Заказы" value={String(totalOrders)} isDark={isDark} />
              <StatCard icon={<FiClock />} label="Активные" value={String(activeOrders)} isDark={isDark} />
              <StatCard icon={<FiGift />} label="Блюда" value={String(totalItems)} isDark={isDark} />
              <StatCard icon={<FiTag />} label="Сумма" value={`${totalSpent.toLocaleString("ru-RU")} сум`} isDark={isDark} />
            </div>

            <div className="mt-6 grid gap-5 xl:grid-cols-2">
              <div
                className={`rounded-[28px] border p-5 ${
                  isDark ? "border-[#2b1708] bg-[#151515]" : "border-black/10 bg-[#fff8f1]"
                }`}
              >
                <div className="mb-4">
                  <h2 className="text-[22px] font-black">Основная информация</h2>
                  <p className={`mt-1 text-[14px] ${isDark ? "text-white/50" : "text-black/50"}`}>
                    Данные, которые используются в аккаунте.
                  </p>
                </div>

                <div className="grid gap-3">
                  <InfoRow icon={<FiUser />} label="Имя" value={user.name || "Не указано"} isDark={isDark} />
                  <InfoRow icon={<FiMail />} label="Email" value={user.email || "Не указано"} isDark={isDark} />
                  <InfoRow icon={<FiPhone />} label="Телефон" value={user.phone || "Не указано"} isDark={isDark} />
                </div>
              </div>

              <div
                className={`rounded-[28px] border p-5 ${
                  isDark ? "border-[#2b1708] bg-[#151515]" : "border-black/10 bg-[#fff8f1]"
                }`}
              >
                <div className="mb-4">
                  <h2 className="text-[22px] font-black">Статус аккаунта</h2>
                  <p className={`mt-1 text-[14px] ${isDark ? "text-white/50" : "text-black/50"}`}>
                    Роль определяется системой автоматически.
                  </p>
                </div>

                <div className="rounded-[24px] bg-[#ff6b00]/10 p-5 text-center">
                  <FiShield className="mx-auto text-[38px] text-[#ff6b00]" />
                  <p className="mt-3 text-[13px] opacity-60">Текущий статус</p>
                  <h3 className="mt-1 text-[26px] font-black">{getRoleLabel(user.role)}</h3>
                  <p className="mt-2 text-[14px] opacity-60">{getRoleDescription(user.role)}</p>
                </div>

                <div className="mt-5 grid gap-3">
                  {(user.role === "employee" || user.role === "client" || user.role === "admin") && (
                    <Link
                      to="/employee"
                      className="flex items-center justify-between rounded-full bg-[#ff6b00] px-5 py-4 text-[14px] font-black text-white"
                    >
                      <span>Панель сотрудника</span>
                      <FiArrowRight />
                    </Link>
                  )}

                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      className="flex items-center justify-between rounded-full bg-[#ff6b00] px-5 py-4 text-[14px] font-black text-white"
                    >
                      <span>Админ панель</span>
                      <FiArrowRight />
                    </Link>
                  )}

                  <Link
                    to="/orders"
                    className={`flex items-center justify-between rounded-full px-5 py-4 text-[14px] font-black ${
                      isDark ? "bg-white text-black" : "bg-[#2f3542] text-white"
                    }`}
                  >
                    <span>Открыть заказы</span>
                    <FiArrowRight />
                  </Link>

                  <Link
                    to="/order-history"
                    className={`flex items-center justify-between rounded-full px-5 py-4 text-[14px] font-black ${
                      isDark ? "bg-[#202020] text-white" : "bg-white text-[#2f3542]"
                    }`}
                  >
                    <span>История заказов</span>
                    <FiArrowRight />
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
      className={`rounded-[24px] border p-4 ${
        isDark ? "border-[#2b1708] bg-[#151515]" : "border-black/10 bg-[#fff8f1]"
      }`}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-[#ff6b00] text-[22px] text-white">
        {icon}
      </div>

      <p className={`mt-3 text-[13px] ${isDark ? "text-white/50" : "text-black/50"}`}>{label}</p>
      <h3 className="mt-1 break-words text-[20px] font-black">{value}</h3>
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
      className={`flex items-center gap-3 rounded-[20px] p-4 ${
        isDark ? "bg-black/35" : "bg-white"
      }`}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-[#ff6b00]/10 text-[22px] text-[#ff6b00]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className={`text-[13px] ${isDark ? "text-white/45" : "text-black/45"}`}>{label}</p>
        <b className="block break-words text-[15px]">{value}</b>
      </div>
    </div>
  );
}