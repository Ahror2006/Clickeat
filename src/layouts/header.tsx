import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { RiSearchLine, RiShoppingCart2Line } from "react-icons/ri";
import { GoPerson } from "react-icons/go";
import Logo from "../assets/logo.jpg";
import { Container } from "../widgets/container";
import { useAuth } from "../stores/auth.store";
import { useThemeStore } from "../stores/theme.store";
import { ProfileSidebar } from "../components/profile-sidebar";
import { searchAll } from "../lib/search";
import { menuItems } from "../defaults/menu.data";

function getCartCount() {
  try {
    const raw = localStorage.getItem("cart");
    if (!raw) return 0;

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return 0;

    return parsed.reduce(
      (sum: number, item: { quantity?: number }) => sum + (item.quantity || 0),
      0
    );
  } catch {
    return 0;
  }
}

function getRandomSuggestions() {
  return [...menuItems]
    .sort(() => Math.random() - 0.5)
    .slice(0, 5)
    .map((item) => ({
      title: item.name,
      restaurantId: item.restaurant_id,
    }));
}

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);

  const navigate = useNavigate();

  const user = useAuth((state) => state.user);
  const logout = useAuth((state) => state.handleLogout);

  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const [cartCount, setCartCount] = useState(getCartCount());

  useEffect(() => {
    const updateCartCount = () => {
      setCartCount(getCartCount());
    };

    updateCartCount();

    window.addEventListener("cart-updated", updateCartCount);
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("cart-updated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  const results = useMemo(() => searchAll(search), [search]);
  const quickSuggestions = useMemo(() => getRandomSuggestions(), []);

  const isDark = theme === "dark";

  const handleSubmitSearch = (event: React.FormEvent) => {
    event.preventDefault();

    const q = search.trim();
    if (!q) return;

    const found = searchAll(q);

    if (found.length > 0) {
      navigate(found[0].href);
    } else {
      navigate(`/menu?query=${encodeURIComponent(q)}`);
    }

    setFocused(false);
  };

  return (
    <>
      <header className="fixed left-0 top-0 z-[70] w-full px-2 pt-3 pb-3 sm:px-4 sm:pt-5 sm:pb-4">
        <Container>
          <div
            className={`rounded-[24px] px-4 py-4 backdrop-blur-xl transition-all sm:rounded-[30px] sm:px-6 ${
              isDark
                ? "border border-[#2a1608] bg-black/95 shadow-[0_18px_45px_rgba(0,0,0,0.45)]"
                : "border border-black/10 bg-white/95 shadow-[0_18px_45px_rgba(0,0,0,0.14)]"
            }`}
          >
            <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-6">
              <div className="flex items-center justify-between gap-4 lg:justify-start lg:gap-8">
                <Link
                  to="/"
                  className="inline-flex items-center rounded-[18px] bg-white px-3 py-2 shadow-sm transition hover:scale-[1.02] sm:rounded-[22px] sm:px-4 sm:py-3"
                >
                  <img
                    src={Logo}
                    alt="ClickEat"
                    className="w-[56px] sm:w-[72px]"
                  />
                </Link>

                <nav className="hidden items-center gap-5 lg:flex">
                  {[
                    { label: "Menu", href: "/menu" },
                    { label: "Restaurants", href: "/restaurants" },
                    { label: "Contact", href: "/contact" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`text-[17px] font-bold transition hover:text-[#ff6b00] ${
                        isDark ? "text-white" : "text-[#171717]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div className="flex items-center gap-2 lg:hidden">
                  <Link
                    to="/orders"
                    className="relative inline-flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#ff6b00] text-white shadow-[0_10px_30px_rgba(255,107,0,0.35)] transition hover:scale-105"
                  >
                    <RiShoppingCart2Line className="text-[23px]" />

                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-1 rounded-full bg-white px-2 py-[2px] text-[10px] font-bold text-[#ff6b00]">
                        {cartCount}
                      </span>
                    )}
                  </Link>

                  {user.email ? (
                    <button
                      type="button"
                      onClick={() => setIsOpen(true)}
                      className="flex h-[48px] w-[48px] items-center justify-center rounded-full border-[3px] border-[#ff6b00] bg-white shadow-sm transition hover:scale-105"
                    >
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt="avatar"
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <GoPerson className="text-[20px]" />
                      )}
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="inline-flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#ff6b00] text-white"
                    >
                      <GoPerson />
                    </Link>
                  )}
                </div>
              </div>

              <div className="relative flex justify-center">
                <form onSubmit={handleSubmitSearch} className="w-full max-w-[620px]">
                  <div className="flex items-center gap-3 rounded-full bg-white px-4 py-3 shadow-sm ring-1 ring-black/10 sm:px-5">
                    <RiSearchLine className="text-[22px] text-[#8b95a7]" />

                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onFocus={() => setFocused(true)}
                      type="text"
                      placeholder="Поиск"
                      className="w-full bg-transparent text-[15px] text-[#2f3542] outline-none placeholder:text-[#9aa3b2] sm:text-[16px]"
                    />
                  </div>
                </form>

                {focused && (
                  <div
                    className={`absolute top-[58px] z-[90] max-h-[70vh] w-full max-w-[620px] overflow-y-auto rounded-[24px] p-3 backdrop-blur-xl sm:top-[62px] sm:rounded-[28px] sm:p-4 ${
                      isDark
                        ? "border border-[#2a1608] bg-[#111]/98 shadow-[0_24px_70px_rgba(0,0,0,0.55)]"
                        : "border border-black/10 bg-white/98 shadow-[0_24px_70px_rgba(0,0,0,0.22)]"
                    }`}
                  >
                    {search.trim() ? (
                      results.length > 0 ? (
                        <div className="space-y-3">
                          {results.map((item) => (
                            <Link
                              key={item.id}
                              to={item.href}
                              onClick={() => setFocused(false)}
                              className={`flex items-center gap-3 rounded-[18px] p-2 transition sm:gap-4 sm:rounded-[20px] sm:p-3 ${
                                isDark ? "hover:bg-white/10" : "hover:bg-black/5"
                              }`}
                            >
                              <img
                                src={item.image}
                                alt={item.title}
                                className="h-[56px] w-[72px] rounded-[14px] object-cover sm:h-[64px] sm:w-[84px] sm:rounded-[16px]"
                              />

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <h4
                                    className={`truncate text-[15px] font-black sm:text-[16px] ${
                                      isDark ? "text-white" : "text-[#171717]"
                                    }`}
                                  >
                                    {item.title}
                                  </h4>

                                  <span className="rounded-full bg-[#ff6b00] px-2 py-1 text-[10px] font-black text-white sm:px-3 sm:text-[11px]">
                                    {item.badge}
                                  </span>
                                </div>

                                <p
                                  className={`mt-1 line-clamp-1 text-[12px] sm:text-[13px] ${
                                    isDark ? "text-white/60" : "text-black/55"
                                  }`}
                                >
                                  {item.subtitle}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center">
                          <h4
                            className={`text-[18px] font-black ${
                              isDark ? "text-white" : "text-[#171717]"
                            }`}
                          >
                            Ничего не найдено
                          </h4>
                        </div>
                      )
                    ) : (
                      <div>
                        <p
                          className={`mb-3 text-[14px] font-black ${
                            isDark ? "text-white/70" : "text-black/70"
                          }`}
                        >
                          Популярные запросы
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {quickSuggestions.map((item) => (
                            <button
                              key={item.title}
                              type="button"
                              onMouseDown={() => {
                                navigate(`/restaurant/${item.restaurantId}`);
                                setFocused(false);
                              }}
                              className={`rounded-full px-4 py-2 text-[13px] font-bold transition hover:bg-[#ff6b00] hover:text-white sm:text-[14px] ${
                                isDark
                                  ? "bg-white/10 text-white"
                                  : "bg-black/10 text-[#171717]"
                              }`}
                            >
                              {item.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="hidden items-center justify-end gap-3 lg:flex">
                <Link
                  to="/orders"
                  className="relative inline-flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#ff6b00] text-white shadow-[0_10px_30px_rgba(255,107,0,0.35)] transition hover:scale-105"
                >
                  <RiShoppingCart2Line className="text-[25px]" />

                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-1 rounded-full bg-white px-2 py-[2px] text-[11px] font-bold text-[#ff6b00]">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {user.email ? (
                  <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="flex h-[58px] w-[58px] items-center justify-center rounded-full border-4 border-[#ff6b00] bg-white shadow-sm transition hover:scale-105"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="avatar"
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <GoPerson />
                    )}
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 rounded-full bg-[#ff6b00] px-5 py-3 text-[15px] font-semibold text-white"
                  >
                    <GoPerson />
                    <span>Войти</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Container>
      </header>

      {focused && (
        <button
          type="button"
          aria-label="close search"
          onClick={() => setFocused(false)}
          className="fixed inset-0 z-[60] cursor-default bg-transparent"
        />
      )}

      <ProfileSidebar
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        userEmail={user.email}
        userName={user.name}
        userAvatar={user.avatar}
        logout={logout}
        orderCount={cartCount}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    </>
  );
};