import { NavLink } from "react-router";
import {
  FiHome,
  FiShoppingBag,
  FiShoppingCart,
  FiUser,
  FiClock,
} from "react-icons/fi";
import { useEffect, useState } from "react";
import { getCartCount } from "../lib/cart";
import { useThemeStore } from "../stores/theme.store";

const links = [
  { to: "/", label: "Home", icon: <FiHome /> },
  { to: "/menu", label: "Menu", icon: <FiShoppingBag /> },
  { to: "/cart", label: "Cart", icon: <FiShoppingCart />, cart: true },
  { to: "/order-history", label: "Orders", icon: <FiClock /> },
  { to: "/profile", label: "Profile", icon: <FiUser /> },
];

export const BottomMobileNav = () => {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";

  const [cartCount, setCartCount] = useState(getCartCount());

  useEffect(() => {
    const update = () => setCartCount(getCartCount());

    update();
    window.addEventListener("cart-updated", update);

    return () => window.removeEventListener("cart-updated", update);
  }, []);

  return (
    <nav className="fixed bottom-3 left-3 right-3 z-[80] lg:hidden">
      <div
        className={`grid grid-cols-5 rounded-[28px] border p-2 shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-xl ${
          isDark
            ? "border-[#2a1608] bg-black/92"
            : "border-black/10 bg-white/92"
        }`}
      >
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center gap-1 rounded-[22px] px-1 py-2 text-[11px] font-black transition ${
                isActive
                  ? "bg-[#ff6b00] text-white shadow-[0_10px_24px_rgba(255,107,0,0.35)]"
                  : isDark
                  ? "text-white/55"
                  : "text-black/55"
              }`
            }
          >
            <span className="relative text-[21px]">
              {item.icon}

              {item.cart && cartCount > 0 && (
                <b className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] text-[#ff6b00]">
                  {cartCount}
                </b>
              )}
            </span>

            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};