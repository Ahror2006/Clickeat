import { Link, useNavigate } from "react-router";
import {
  FiBox,
  FiClock,
  FiHelpCircle,
  FiLogIn,
  FiLogOut,
  FiMessageSquare,
  FiMoon,
  FiSettings,
  FiShield,
  FiStar,
  FiSun,
  FiUser,
  FiUserPlus,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../stores/auth.store";
import { useThemeStore } from "../stores/theme.store";

type ProfileSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const ProfileSidebar = ({ isOpen, onClose }: ProfileSidebarProps) => {
  const navigate = useNavigate();

  const user = useAuth((state) => state.user);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const logout = useAuth((state) => state.handleLogout);

  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const isDark = theme === "dark";

  const roleLabel =
    user.role === "admin"
      ? "ADMIN"
      : user.role === "employee"
      ? "EMPLOYEE"
      : "CLIENT";

  const canOpenEmployee = user.role === "employee" || user.role === "admin";

  const handleLogout = () => {
    const confirmed = window.confirm("Выйти из аккаунта?");
    if (!confirmed) return;

    logout();

    localStorage.removeItem("clickeat-token");
    localStorage.removeItem("clickeat-user");
    localStorage.removeItem("click-eat-current-user");

    onClose();
    navigate("/");
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[190] bg-black/45 backdrop-blur-[4px] transition-all duration-300 ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />

      <aside
        className={`fixed right-0 top-0 z-[200] h-full w-[88vw] max-w-[420px] overflow-y-auto border-l transition-transform duration-300 sm:w-[50vw] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } ${
          isDark
            ? "border-[#2a1608] bg-[#0b0b0b] text-white"
            : "border-[#ffd6bd] bg-[#fff8f1] text-[#2f3542]"
        }`}
      >
        <div
          className={`border-b p-5 ${
            isDark ? "border-white/10" : "border-[#ffd6bd]"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-[64px] w-[64px] items-center justify-center overflow-hidden rounded-[20px] bg-[#fff3e8] text-[28px] text-[#ff6b00]">
                  {isAuthenticated && user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FiUser />
                  )}
                </div>

                {isAuthenticated && (
                  <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-green-500" />
                )}
              </div>

              <div>
                <p
                  className={`text-[12px] ${
                    isDark ? "text-white/45" : "text-black/45"
                  }`}
                >
                  Аккаунт ClickEat
                </p>

                <h3 className="text-[18px] font-black">
                  {isAuthenticated ? user.name || "User" : "Гость"}
                </h3>

                <div className="mt-2 flex items-center gap-2">
                  <span className="rounded-full bg-[#ff6b00]/15 px-2.5 py-1 text-[10px] font-black text-[#ff6b00]">
                    {isAuthenticated ? roleLabel : "GUEST"}
                  </span>

                  <span
                    className={`text-[12px] font-semibold ${
                      isAuthenticated ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {isAuthenticated ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                isDark ? "bg-white/10 text-white" : "bg-white text-[#2f3542]"
              }`}
            >
              <FiX />
            </button>
          </div>

          <div
            className={`mt-5 rounded-[22px] p-4 ${
              isDark ? "bg-[#151515]" : "bg-white"
            }`}
          >
            <p
              className={`text-[12px] ${
                isDark ? "text-white/45" : "text-black/45"
              }`}
            >
              {isAuthenticated ? "Личный кабинет" : "Вход в аккаунт"}
            </p>

            <b className="mt-1 block text-[14px]">
              {isAuthenticated
                ? "Управляй профилем, заказами и бонусами"
                : "Войдите или создайте аккаунт, чтобы оформлять заказы"}
            </b>
          </div>
        </div>

        {!isAuthenticated ? (
          <div className="grid gap-3 p-5">
            <SidebarLink
              to="/login"
              icon={<FiLogIn />}
              label="Войти"
              onClick={onClose}
            />

            <SidebarLink
              to="/register"
              icon={<FiUserPlus />}
              label="Регистрация"
              onClick={onClose}
            />

            <SidebarLink
              to="/menu"
              icon={<FiBox />}
              label="Посмотреть меню"
              onClick={onClose}
            />
          </div>
        ) : (
          <nav className="grid gap-3 p-5">
            <SidebarLink
              to="/profile"
              icon={<FiUser />}
              label="Профиль"
              onClick={onClose}
            />

            <SidebarLink
              to="/orders"
              icon={<FiBox />}
              label="Заказы"
              onClick={onClose}
            />

            <SidebarLink
              to="/order-history"
              icon={<FiClock />}
              label="История заказов"
              onClick={onClose}
            />

            <SidebarLink
              to="/support"
              icon={<FiHelpCircle />}
              label="Тех поддержка"
              onClick={onClose}
            />

            <SidebarLink
              to="/reviews"
              icon={<FiStar />}
              label="Отзывы"
              onClick={onClose}
            />

            <SidebarLink
              to="/complaints"
              icon={<FiMessageSquare />}
              label="Жалобы"
              onClick={onClose}
            />

            {canOpenEmployee && (
              <SidebarLink
                to="/employee"
                icon={<FiShield />}
                label="Панель сотрудника"
                onClick={onClose}
              />
            )}

            {user.role === "admin" && (
              <SidebarLink
                to="/admin"
                icon={<FiSettings />}
                label="Админ панель"
                onClick={onClose}
              />
            )}
          </nav>
        )}

        <div className="px-5 pb-5">
          <div
            className={`rounded-[24px] border p-4 ${
              isDark ? "border-white/10 bg-[#151515]" : "border-black/10 bg-white"
            }`}
          >
            <h3 className="font-black">Оформление сайта</h3>

            <p
              className={`mt-1 text-[13px] ${
                isDark ? "text-white/45" : "text-black/45"
              }`}
            >
              Переключай дневной и ночной режим.
            </p>

            <div
              className={`mt-4 grid grid-cols-2 rounded-[18px] p-1 ${
                isDark ? "bg-black" : "bg-[#f6f1ea]"
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  if (isDark) toggleTheme();
                }}
                className={`flex items-center justify-center gap-2 rounded-[15px] py-3 font-black ${
                  !isDark ? "bg-[#ff6b00] text-white" : "text-white/55"
                }`}
              >
                <FiSun />
                Day
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!isDark) toggleTheme();
                }}
                className={`flex items-center justify-center gap-2 rounded-[15px] py-3 font-black ${
                  isDark ? "bg-[#ff6b00] text-white" : "text-black/55"
                }`}
              >
                <FiMoon />
                Night
              </button>
            </div>
          </div>
        </div>

        {isAuthenticated && (
          <div
            className={`sticky bottom-0 border-t p-5 ${
              isDark
                ? "border-white/10 bg-[#0b0b0b]"
                : "border-[#ffd6bd] bg-[#fff8f1]"
            }`}
          >
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-[22px] bg-[#ff6b00] py-4 text-[15px] font-black text-white"
            >
              <FiLogOut />
              Выйти из аккаунта
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

function SidebarLink({
  to,
  icon,
  label,
  onClick,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="group flex items-center justify-between rounded-[22px] bg-[#ff6b00] px-5 py-4 text-[15px] font-black text-white transition active:scale-[0.98]"
    >
      <span className="flex items-center gap-3">
        <span className="text-[20px]">{icon}</span>
        {label}
      </span>

      <span className="transition group-hover:translate-x-1">›</span>
    </Link>
  );
}
