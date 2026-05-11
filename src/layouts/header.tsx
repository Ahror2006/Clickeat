import { useMemo, useState } from "react";
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

  const cartCount = getCartCount();

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
      <header className="fixed left-0 top-0 z-[70] w-full px-4 pt-5 pb-4">
        <Container>
          <div
            className={`rounded-[30px] px-6 py-4 backdrop-blur-xl transition-all ${
              isDark
                ? "border border-[#2a1608] bg-black/95 shadow-[0_18px_45px_rgba(0,0,0,0.45)]"
                : "border border-black/10 bg-white/95 shadow-[0_18px_45px_rgba(0,0,0,0.14)]"
            }`}
          >
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6">
              <div className="flex items-center gap-8">
                <Link
                  to="/"
                  className="inline-flex items-center rounded-[22px] bg-white px-4 py-3 shadow-sm transition hover:scale-[1.02]"
                >
                  <img src={Logo} alt="ClickEat" className="w-[72px]" />
                </Link>

                <nav className="hidden items-center gap-9 lg:flex">
                  {[
                    { label: "Menu", href: "/menu" },
                    { label: "Restaurants", href: "/restaurants" },
                    { label: "Contact", href: "/contact" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`text-[18px] font-bold transition hover:text-[#ff6b00] ${
                        isDark ? "text-white" : "text-[#171717]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="relative flex justify-center">
                <form onSubmit={handleSubmitSearch} className="w-full max-w-[620px]">
                  <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-sm ring-1 ring-black/10">
                    <RiSearchLine className="text-[22px] text-[#8b95a7]" />

                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onFocus={() => setFocused(true)}
                      type="text"
                      placeholder="Поиск"
                      className="w-full bg-transparent text-[16px] text-[#2f3542] outline-none placeholder:text-[#9aa3b2]"
                    />
                  </div>
                </form>

                {focused && (
                  <div
                    className={`absolute top-[62px] z-[90] w-full max-w-[620px] rounded-[28px] p-4 backdrop-blur-xl ${
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
                              className={`flex items-center gap-4 rounded-[20px] p-3 transition ${
                                isDark ? "hover:bg-white/10" : "hover:bg-black/5"
                              }`}
                            >
                              <img
                                src={item.image}
                                alt={item.title}
                                className="h-[64px] w-[84px] rounded-[16px] object-cover"
                              />

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <h4
                                    className={`truncate text-[16px] font-black ${
                                      isDark ? "text-white" : "text-[#171717]"
                                    }`}
                                  >
                                    {item.title}
                                  </h4>

                                  <span className="rounded-full bg-[#ff6b00] px-3 py-1 text-[11px] font-black text-white">
                                    {item.badge}
                                  </span>
                                </div>

                                <p
                                  className={`mt-1 line-clamp-1 text-[13px] ${
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
                              onMouseDown={() => navigate(`/restaurant/${item.restaurantId}`)}
                              className={`rounded-full px-4 py-2 text-[14px] font-bold transition hover:bg-[#ff6b00] hover:text-white ${
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

              <div className="flex items-center justify-end gap-3">
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