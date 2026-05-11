import { useState } from "react";
import { Link } from "react-router";
import {
  FiUser,
  FiPackage,
  FiClock,
  FiTag,
  FiStar,
  FiAlertCircle,
  FiChevronRight,
  FiX,
  FiLogOut,
} from "react-icons/fi";
import { MdOutlineSupportAgent } from "react-icons/md";
import { GoPerson } from "react-icons/go";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi2";
import { PromoModal } from "./promo-modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  userName?: string;
  userAvatar?: string;
  logout: () => void;
  orderCount: number;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export const ProfileSidebar = ({
  isOpen,
  onClose,
  userEmail,
  userName,
  userAvatar,
  logout,
  orderCount,
  theme,
  toggleTheme,
}: Props) => {
  const [isPromoOpen, setIsPromoOpen] = useState(false);

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[190] bg-[rgba(25,16,10,0.42)] backdrop-blur-[5px] transition-all duration-300 ${isOpen ? "visible opacity-100" : "invisible opacity-0"
          }`}
      />

      <aside
        className={`profile-sidebar fixed top-0 right-0 z-[200] h-full w-[360px] border-l border-[rgba(255,107,0,0.18)] shadow-[-14px_0_40px_rgba(0,0,0,0.35)] backdrop-blur-[18px] transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-[rgba(255,107,0,0.18)] px-6 pt-6 pb-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt="avatar"
                      className="h-14 w-14 rounded-2xl object-cover shadow-[0_10px_22px_rgba(255,107,0,0.25)]"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff7a00] to-[#ff5a00] text-white shadow-[0_10px_22px_rgba(255,107,0,0.25)]">
                      <GoPerson className="text-[24px]" />
                    </div>
                  )}

                  <span className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 border-white bg-green-500" />
                </div>

                <div>
                  <p className="profile-sidebar-muted text-[13px]">Аккаунт ClickEat</p>

                  <p className="profile-sidebar-title mt-1 max-w-[180px] truncate text-[15px] font-semibold">
                    {userName && userName.trim() !== "" ? userName : userEmail}
                  </p>
                  <p className="mt-1 text-[12px] text-green-500">Online</p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white text-[#2f3542] transition hover:bg-[#ff6b00] hover:text-white"
              >
                <FiX className="text-[18px]" />
              </button>
            </div>

            <div className="mt-5 rounded-2xl bg-[#fff3e8] px-4 py-3">
              <p className="text-[13px] text-[#8d796a]">Личный кабинет</p>
              <p className="mt-1 text-[15px] font-semibold text-[#2f3542]">
                Управляй профилем, заказами и бонусами
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5">
            <div className="space-y-3">
              <SidebarLink
                to="/profile"
                icon={<FiUser />}
                label="Профиль"
                onClick={onClose}
              />

              <SidebarLink
                to="/orders"
                icon={<FiPackage />}
                label="Заказы"
                onClick={onClose}
                badge={orderCount > 0 ? String(orderCount) : undefined}
              />

              <SidebarLink
                to="/order-history"
                icon={<FiClock />}
                label="История заказов"
                onClick={onClose}
              />

              <SidebarButton
                icon={<FiTag />}
                label="Промокоды"
                onClick={() => setIsPromoOpen(true)}
              />

              <SidebarLink
                to="/support"
                icon={<MdOutlineSupportAgent />}
                label="Тех поддержка"
                onClick={onClose}
              />

              <SidebarLink
                to="/reviews"
                icon={<FiStar />}
                label="Отзывы и предложения"
                onClick={onClose}
              />

              <SidebarLink
                to="/complaints"
                icon={<FiAlertCircle />}
                label="Жалобы"
                onClick={onClose}
              />
            </div>

            <div className="mt-8 rounded-[24px] border border-white/20 bg-white/10 p-4 shadow-sm">
              <h3 className="profile-sidebar-title text-[14px] font-semibold">
                Оформление сайта
              </h3>

              <p className="profile-sidebar-muted mt-1 text-[13px]">
                Переключай дневной и ночной режим.
              </p>

              <div className="mt-4 flex items-center justify-between rounded-2xl bg-white p-2">
                <button
                  type="button"
                  onClick={() => theme !== "light" && toggleTheme()}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${theme === "light"
                    ? "bg-[#ff6b00] text-white shadow-sm"
                    : "text-[#687385]"
                    }`}
                >
                  <HiOutlineSun />
                  <span>Day</span>
                </button>

                <button
                  type="button"
                  onClick={() => theme !== "dark" && toggleTheme()}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${theme === "dark"
                    ? "bg-[#ff6b00] text-white shadow-sm"
                    : "text-[#687385]"
                    }`}
                >
                  <HiOutlineMoon />
                  <span>Night</span>
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-[rgba(255,107,0,0.18)] px-4 py-4">
            <button
              type="button"
              onClick={() => {
                logout();
                onClose();
              }}
              className="group flex w-full items-center justify-center gap-2 rounded-[22px] bg-gradient-to-r from-[#ff7a00] to-[#ff5a00] px-4 py-3 text-[15px] font-semibold text-white shadow-[0_12px_24px_rgba(255,107,0,0.22)] transition hover:bg-none hover:bg-white hover:text-[#ff6b00]"
            >
              <FiLogOut className="text-[17px] text-white transition group-hover:text-[#ff6b00]" />
              <span>Выйти из аккаунта</span>
            </button>
          </div>
        </div>
      </aside>

      <PromoModal
        isOpen={isPromoOpen}
        onClose={() => setIsPromoOpen(false)}
        onApply={() => setIsPromoOpen(false)}
      />
    </>
  );
};

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  badge?: string;
}

function SidebarLink({ to, icon, label, onClick, badge }: SidebarLinkProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="group flex items-center justify-between rounded-[22px] bg-gradient-to-r from-[#ff7a00] to-[#ff5a00] px-4 py-3 text-white shadow-[0_12px_24px_rgba(255,107,0,0.22)] transition hover:bg-none hover:bg-white hover:text-[#ff6b00]"
    >
      <div className="flex items-center gap-3">
        <span className="text-[18px] text-white transition group-hover:text-[#ff6b00]">
          {icon}
        </span>
        <span className="text-[15px] font-semibold">{label}</span>
      </div>

      <div className="flex items-center gap-2">
        {badge && (
          <span className="min-w-[28px] rounded-full bg-white/20 px-2 py-1 text-center text-[12px] font-semibold text-white transition group-hover:bg-[#ffefe3] group-hover:text-[#ff6b00]">
            {badge}
          </span>
        )}

        <FiChevronRight className="text-[16px] text-white transition group-hover:text-[#ff6b00]" />
      </div>
    </Link>
  );
}

function SidebarButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center justify-between rounded-[22px] bg-gradient-to-r from-[#ff7a00] to-[#ff5a00] px-4 py-3 text-white shadow-[0_12px_24px_rgba(255,107,0,0.22)] transition hover:bg-none hover:bg-white hover:text-[#ff6b00]"
    >
      <div className="flex items-center gap-3">
        <span className="text-[18px] text-white transition group-hover:text-[#ff6b00]">
          {icon}
        </span>
        <span className="text-[15px] font-semibold">{label}</span>
      </div>

      <FiChevronRight className="text-[16px] text-white transition group-hover:text-[#ff6b00]" />
    </button>
  );
}