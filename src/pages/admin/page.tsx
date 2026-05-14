import { useEffect, useMemo, useState } from "react";
import {
  FiAlertCircle,
  FiBarChart2,
  FiLock,
  FiMail,
  FiPhone,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiTrash2,
  FiUnlock,
  FiUser,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { getAuthUser, getToken } from "../../lib/auth";

type UserRole = "client" | "employee" | "admin" | "user";
type FilterType = "all" | "client" | "employee" | "admin" | "blocked";

type AdminUser = {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  isBlocked: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type AdminStats = {
  totalUsers: number;
  clients: number;
  employees: number;
  admins: number;
  blockedUsers: number;
};

function getUserId(user: AdminUser) {
  return String(user.id || user._id || "");
}

function normalizeRole(role: UserRole) {
  return role === "user" ? "client" : role;
}

function roleLabel(role: UserRole) {
  const normalized = normalizeRole(role);

  if (normalized === "admin") return "Админ";
  if (normalized === "employee") return "Сотрудник";
  return "Клиент";
}

function formatDate(value?: string) {
  if (!value) return "Нет данных";

  return new Date(value).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminPage() {
  const currentUser = getAuthUser();
  const token = getToken();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const currentUserId = String(currentUser?.id || currentUser?._id || "");

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        setError("Token не найден. Войди заново как admin.");
        return;
      }

      const [usersResponse, statsResponse] = await Promise.all([
        fetch("http://localhost:5000/api/admin/users", {
          headers: authHeaders,
        }),
        fetch("http://localhost:5000/api/admin/stats", {
          headers: authHeaders,
        }),
      ]);

      const usersData = await usersResponse.json();
      const statsData = await statsResponse.json();

      if (!usersResponse.ok) {
        setError(usersData.message || "Недостаточно прав");
        return;
      }

      if (!statsResponse.ok) {
        setError(statsData.message || "Ошибка загрузки статистики");
        return;
      }

      setUsers(usersData.users || []);
      setStats(statsData.stats || null);
    } catch {
      setError("Backend не отвечает. Проверь backend сервер.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const localStats = useMemo(() => {
    return {
      totalUsers: users.length,
      clients: users.filter((user) => normalizeRole(user.role) === "client").length,
      employees: users.filter((user) => normalizeRole(user.role) === "employee").length,
      admins: users.filter((user) => normalizeRole(user.role) === "admin").length,
      blockedUsers: users.filter((user) => user.isBlocked).length,
    };
  }, [users]);

  const viewStats = stats || localStats;

  const filteredUsers = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return users.filter((user) => {
      const role = normalizeRole(user.role);

      const matchesFilter =
        filter === "all" ||
        role === filter ||
        (filter === "blocked" && user.isBlocked);

      const matchesSearch =
        !searchValue ||
        user.name.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue) ||
        user.phone?.toLowerCase().includes(searchValue);

      return matchesFilter && matchesSearch;
    });
  }, [users, filter, search]);

  const changeRole = async (
    user: AdminUser,
    role: "client" | "employee" | "admin"
  ) => {
    const id = getUserId(user);

    if (id === currentUserId) {
      alert("Нельзя менять роль самому себе");
      return;
    }

    try {
      setActionLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/admin/users/${id}/role`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders,
          },
          body: JSON.stringify({ role }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Ошибка изменения роли");
        return;
      }

      setUsers((prev) =>
        prev.map((item) =>
          getUserId(item) === id ? { ...item, role } : item
        )
      );

      setSelectedUser((prev) => (prev ? { ...prev, role } : prev));
    } finally {
      setActionLoading(false);
    }
  };

  const toggleBlock = async (user: AdminUser) => {
    const id = getUserId(user);

    if (id === currentUserId) {
      alert("Нельзя заблокировать самого себя");
      return;
    }

    try {
      setActionLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/admin/users/${id}/block`,
        {
          method: "PUT",
          headers: authHeaders,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Ошибка блокировки");
        return;
      }

      setUsers((prev) =>
        prev.map((item) =>
          getUserId(item) === id
            ? { ...item, isBlocked: !item.isBlocked }
            : item
        )
      );

      setSelectedUser((prev) =>
        prev ? { ...prev, isBlocked: !prev.isBlocked } : prev
      );
    } finally {
      setActionLoading(false);
    }
  };

  const deleteUser = async (user: AdminUser) => {
    const id = getUserId(user);

    if (id === currentUserId) {
      alert("Нельзя удалить самого себя");
      return;
    }

    const confirmed = confirm(`Удалить пользователя ${user.name}?`);

    if (!confirmed) return;

    try {
      setActionLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/admin/users/${id}`,
        {
          method: "DELETE",
          headers: authHeaders,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Ошибка удаления");
        return;
      }

      setUsers((prev) => prev.filter((item) => getUserId(item) !== id));
      setSelectedUser(null);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <section className="px-10 pb-16">
      <div className="mx-auto max-w-[1480px]">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="font-bold text-[#ff6b00]">ClickEat Admin</p>

            <h1 className="text-[52px] font-extrabold leading-tight text-[#2f3542]">
              Панель администратора
            </h1>

            <p className="mt-3 text-[#7b8698]">
              Управление пользователями, сотрудниками, ролями и блокировками.
            </p>
          </div>

          <button
            onClick={fetchAdminData}
            className="flex items-center gap-2 rounded-[18px] bg-[#ff6b00] px-5 py-4 font-extrabold text-white shadow-[0_18px_35px_rgba(255,107,0,0.22)]"
          >
            <FiRefreshCw />
            Обновить
          </button>
        </div>

        {loading && (
          <div className="rounded-[30px] bg-white p-8 text-xl font-bold shadow">
            Загружаем данные...
          </div>
        )}

        {error && (
          <div className="rounded-[30px] border border-red-200 bg-red-50 p-8 font-bold text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-5 gap-4">
              <StatCard
                title="Все пользователи"
                value={viewStats.totalUsers}
                icon={<FiUsers />}
                active={filter === "all"}
                onClick={() => setFilter("all")}
              />

              <StatCard
                title="Клиенты"
                value={viewStats.clients}
                icon={<FiUser />}
                active={filter === "client"}
                onClick={() => setFilter("client")}
              />

              <StatCard
                title="Сотрудники"
                value={viewStats.employees}
                icon={<FiShield />}
                active={filter === "employee"}
                onClick={() => setFilter("employee")}
              />

              <StatCard
                title="Админы"
                value={viewStats.admins}
                icon={<FiBarChart2 />}
                active={filter === "admin"}
                onClick={() => setFilter("admin")}
              />

              <StatCard
                title="Заблокированные"
                value={viewStats.blockedUsers}
                icon={<FiLock />}
                active={filter === "blocked"}
                onClick={() => setFilter("blocked")}
              />
            </div>

            <div className="mt-6 flex items-center gap-4 rounded-[28px] bg-white px-6 py-4 shadow-[0_18px_45px_rgba(0,0,0,0.06)]">
              <FiSearch className="text-xl text-[#ff6b00]" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Поиск по имени, email или телефону..."
                className="w-full bg-transparent text-[17px] outline-none"
              />
            </div>

            <div className="mt-6 rounded-[30px] bg-white p-5 shadow-[0_18px_45px_rgba(0,0,0,0.06)]">
              <div className="mb-4 flex items-center justify-between px-2">
                <h2 className="text-2xl font-extrabold text-[#2f3542]">
                  Пользователи
                </h2>

                <p className="text-[#7b8698]">
                  Найдено: <b>{filteredUsers.length}</b>
                </p>
              </div>

              <div className="grid gap-4">
                {filteredUsers.map((user) => {
                  const id = getUserId(user);
                  const isMe = id === currentUserId;

                  return (
                    <button
                      key={id}
                      onClick={() => setSelectedUser(user)}
                      className="w-full rounded-[26px] border border-[#f0e3d7] bg-[#fffaf5] p-5 text-left transition hover:border-[#ffb37a] hover:bg-white"
                    >
                      <div className="flex items-center justify-between gap-5">
                        <div className="flex items-center gap-5">
                          <Avatar user={user} size="small" />

                          <div>
                            <h3 className="text-xl font-extrabold text-[#2f3542]">
                              {user.name} {isMe ? "(Вы)" : ""}
                            </h3>

                            <p className="text-[#7b8698]">{user.email}</p>

                            <p className="text-[#7b8698]">
                              {user.phone || "Телефон не указан"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <RoleBadge role={normalizeRole(user.role)} />
                          <StatusBadge blocked={user.isBlocked} />
                        </div>
                      </div>
                    </button>
                  );
                })}

                {filteredUsers.length === 0 && (
                  <div className="rounded-[24px] bg-[#fff8f1] p-8 text-center font-bold text-[#7b8698]">
                    Пользователи не найдены
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {selectedUser && (
        <UserDrawer
          user={selectedUser}
          currentUserId={currentUserId}
          actionLoading={actionLoading}
          onClose={() => setSelectedUser(null)}
          onChangeRole={changeRole}
          onToggleBlock={toggleBlock}
          onDelete={deleteUser}
        />
      )}
    </section>
  );
}

function UserDrawer({
  user,
  currentUserId,
  actionLoading,
  onClose,
  onChangeRole,
  onToggleBlock,
  onDelete,
}: {
  user: AdminUser;
  currentUserId: string;
  actionLoading: boolean;
  onClose: () => void;
  onChangeRole: (user: AdminUser, role: "client" | "employee" | "admin") => void;
  onToggleBlock: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
}) {
  const id = getUserId(user);
  const isMe = id === currentUserId;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm">
      <div className="ml-auto h-full w-full max-w-[580px] overflow-y-auto bg-[#fff8f1] p-7 shadow-[-20px_0_60px_rgba(0,0,0,0.2)]">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-extrabold text-[#2f3542]">
            Профиль пользователя
          </h2>

          <button
            onClick={onClose}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl shadow"
          >
            <FiX />
          </button>
        </div>

        <div className="mt-8 rounded-[30px] bg-white p-6 shadow">
          <div className="flex items-center gap-5">
            <Avatar user={user} size="large" />

            <div>
              <h3 className="text-2xl font-extrabold text-[#2f3542]">
                {user.name} {isMe ? "(Вы)" : ""}
              </h3>

              <p className="mt-1 text-sm text-[#7b8698]">ID: {id}</p>
            </div>
          </div>

          <div className="mt-7 space-y-4">
            <Info icon={<FiMail />} label="Email" value={user.email} />
            <Info icon={<FiPhone />} label="Телефон" value={user.phone || "Не указан"} />
            <Info icon={<FiShield />} label="Роль" value={roleLabel(user.role)} />
            <Info
              icon={user.isBlocked ? <FiLock /> : <FiUnlock />}
              label="Статус"
              value={user.isBlocked ? "Заблокирован" : "Активен"}
            />
            <Info icon={<FiUser />} label="Дата регистрации" value={formatDate(user.createdAt)} />
          </div>
        </div>

        <div className="mt-6 rounded-[30px] bg-white p-6 shadow">
          <h3 className="text-xl font-extrabold text-[#2f3542]">
            Действия администратора
          </h3>

          <div className="mt-5 grid grid-cols-3 gap-3">
            {(["client", "employee", "admin"] as const).map((role) => (
              <button
                key={role}
                disabled={actionLoading || isMe}
                onClick={() => onChangeRole(user, role)}
                className={`rounded-2xl px-4 py-3 font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  normalizeRole(user.role) === role
                    ? "bg-[#ff6b00] text-white"
                    : "bg-[#fff0e6] text-[#ff6b00] hover:bg-[#ffe1cc]"
                }`}
              >
                {roleLabel(role)}
              </button>
            ))}
          </div>

          <button
            disabled={actionLoading || isMe}
            onClick={() => onToggleBlock(user)}
            className={`mt-5 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-50 ${
              user.isBlocked ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {user.isBlocked ? <FiUnlock /> : <FiLock />}
            {user.isBlocked ? "Разблокировать" : "Заблокировать"}
          </button>

          <a
            href={`mailto:${user.email}`}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2f3542] px-5 py-4 font-extrabold text-white"
          >
            <FiMail />
            Написать пользователю
          </a>

          <button
            disabled={actionLoading || isMe}
            onClick={() => onDelete(user)}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-5 py-4 font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiTrash2 />
            Удалить пользователя
          </button>

          {isMe && (
            <div className="mt-4 flex gap-3 rounded-2xl bg-orange-50 p-4 text-sm font-bold text-[#ff6b00]">
              <FiAlertCircle className="mt-[2px]" />
              Это ваш аккаунт. Нельзя менять себе роль, банить или удалять себя.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Avatar({ user, size }: { user: AdminUser; size: "small" | "large" }) {
  const className =
    size === "large"
      ? "h-[112px] w-[112px] text-[44px]"
      : "h-[76px] w-[76px] text-[30px]";

  return (
    <div
      className={`${className} overflow-hidden rounded-full bg-[#fff0e6]`}
    >
      {user.avatar ? (
        <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-[#ff6b00]">
          <FiUser />
        </div>
      )}
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  return (
    <span className="rounded-full bg-orange-100 px-5 py-2 font-bold text-[#ff6b00]">
      {roleLabel(role as UserRole)}
    </span>
  );
}

function StatusBadge({ blocked }: { blocked: boolean }) {
  return (
    <span
      className={`rounded-full px-5 py-2 font-bold ${
        blocked ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
      }`}
    >
      {blocked ? "Blocked" : "Active"}
    </span>
  );
}

function StatCard({
  title,
  value,
  icon,
  active,
  onClick,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-[26px] p-5 text-left shadow transition ${
        active ? "bg-[#ff6b00] text-white" : "bg-white text-[#2f3542]"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold opacity-70">{title}</p>
        <span className="text-xl">{icon}</span>
      </div>

      <p className="mt-3 text-3xl font-extrabold">{value}</p>
    </button>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-[20px] bg-[#fff8f1] p-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ff6b00] text-xl text-white">
        {icon}
      </div>

      <div>
        <p className="text-sm text-[#8a94a6]">{label}</p>
        <p className="font-extrabold text-[#2f3542]">{value}</p>
      </div>
    </div>
  );
}