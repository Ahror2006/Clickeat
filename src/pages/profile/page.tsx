import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../stores/auth.store";
import { Container } from "../../widgets/container";
import { getToken, saveAuth } from "../../lib/auth";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiEdit2,
  FiShoppingBag,
  FiClock,
  FiGift,
  FiTag,
  FiShield,
  FiArrowRight,
} from "react-icons/fi";

type SavedOrder = {
  id: string;
  total?: number;
  bonusPoints?: number;
  promoCode?: string;
};

function getSavedOrders(): SavedOrder[] {
  try {
    const raw = localStorage.getItem("orders");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const ProfilePage = () => {
  const user = useAuth((state) => state.user);
  const updateProfile = useAuth((state) => state.updateProfile);

  const [orders, setOrders] = useState<SavedOrder[]>(() => getSavedOrders());

  useEffect(() => {
    const syncFreshUser = async () => {
      const token = getToken();

      if (!token) return;

      try {
        const response = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) return;

        updateProfile({
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone || "",
          avatar: data.user.avatar || "",
          role: data.user.role,
        });

        saveAuth(token, data.user);
      } catch {
        // silently ignore
      }
    };

    syncFreshUser();
  }, [updateProfile]);

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

  const totalBonuses = orders.reduce(
    (sum, order) =>
      sum + (order.bonusPoints || Math.floor((order.total || 0) / 10000)),
    0
  );

  const usedPromocodes = orders.filter((order) => order.promoCode).length;

  const getRoleLabel = () => {
    switch (user?.role) {
      case "admin":
        return "Администратор";
      case "employee":
        return "Сотрудник";
      default:
        return "Клиент";
    }
  };

  const getRoleDescription = () => {
    switch (user?.role) {
      case "admin":
        return "Полный доступ к управлению сайтом, заказами и пользователями.";
      case "employee":
        return "Доступ к заказам, обработке заявок и рабочим функциям.";
      default:
        return "Обычный аккаунт для заказов, бонусов и личных данных.";
    }
  };

  const stats = [
    { title: "Заказы", value: orders.length, icon: <FiShoppingBag /> },
    { title: "История", value: orders.length, icon: <FiClock /> },
    { title: "Бонусы", value: totalBonuses, icon: <FiGift /> },
    { title: "Промокоды", value: usedPromocodes, icon: <FiTag /> },
  ];

  return (
    <div className="profile-page min-h-screen pb-10 sm:pb-12">
      <Container>
        <section className="profile-hero !px-5 !py-7 sm:!px-8 sm:!py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
              <div className="profile-avatar-wrap shrink-0">
                {user?.avatar ? (
                  <img src={user.avatar} alt="avatar" className="profile-avatar" />
                ) : (
                  <div className="profile-avatar-fallback">
                    <FiUser />
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <p className="profile-kicker">Личный кабинет</p>
                <h1 className="profile-name break-words !text-[34px] sm:!text-[48px] lg:!text-[58px]">
                  {user?.name || "Пользователь"}
                </h1>
                <p className="profile-subtitle !text-[15px] sm:!text-[17px]">
                  Управляй личными данными, заказами, бонусами и промокодами.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-stretch gap-3 sm:flex-row lg:flex-col lg:items-end">
              <Link to="/profile/edit" className="profile-edit-btn justify-center">
                <FiEdit2 />
                <span>Редактировать</span>
              </Link>

              <div className="profile-role-badge justify-center">
                <FiShield />
                <span>{getRoleLabel()}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="profile-stats !grid-cols-1 sm:!grid-cols-2 xl:!grid-cols-4">
          {stats.map((item) => (
            <div className="profile-stat-card" key={item.title}>
              <div className="profile-stat-icon">{item.icon}</div>
              <div>
                <p>{item.title}</p>
                <strong>{item.value}</strong>
              </div>
            </div>
          ))}
        </section>

        <section className="profile-grid !grid-cols-1 xl:!grid-cols-2">
          <div className="profile-card">
            <div className="profile-card-head flex-col gap-3 sm:flex-row">
              <div>
                <h2>Основная информация</h2>
                <p>Данные, которые используются в аккаунте.</p>
              </div>

              <Link to="/profile/edit" className="profile-small-link">
                Изменить
              </Link>
            </div>

            <div className="profile-info-list">
              <InfoRow icon={<FiUser />} label="Имя" value={user?.name || "Не указано"} />
              <InfoRow icon={<FiMail />} label="Email" value={user?.email || "Не указано"} />
              <InfoRow icon={<FiPhone />} label="Телефон" value={user?.phone || "Не указано"} />
            </div>
          </div>

          <div className="profile-card">
            <div className="profile-card-head">
              <div>
                <h2>Статус аккаунта</h2>
                <p>Роль определяется системой автоматически.</p>
              </div>
            </div>

            <div className="profile-status-box flex-col text-center sm:flex-row sm:text-left">
              <div className="profile-status-icon">
                <FiShield />
              </div>

              <div>
                <p>Текущий статус</p>
                <h3>{getRoleLabel()}</h3>
                <span>{getRoleDescription()}</span>
              </div>
            </div>

            <div className="profile-actions">
              <Link to="/orders" className="profile-primary-action">
                <span>Открыть заказы</span>
                <FiArrowRight />
              </Link>

              <Link to="/order-history" className="profile-secondary-action">
                <span>История заказов</span>
                <FiArrowRight />
              </Link>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
};

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="profile-info-row">
      <div className="profile-info-icon">{icon}</div>
      <div className="min-w-0">
        <p>{label}</p>
        <strong className="break-words">{value}</strong>
      </div>
    </div>
  );
}