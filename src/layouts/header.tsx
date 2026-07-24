import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { RiSearchLine, RiShoppingCart2Line } from "react-icons/ri";
import { GoPerson } from "react-icons/go";
import Logo from "../assets/logo.webp";
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
  const theme = useThemeStore((state) => state.theme);

  const [cartCount, setCartCount] = useState(getCartCount());

  const isDark = theme === "dark";

  useEffect(() => {
    const updateCartCount = () => setCartCount(getCartCount());

    updateCartCount();
    window.addEventListener("cart-updated", updateCartCount);

    return () => {
      window.removeEventListener("cart-updated", updateCartCount);
    };
  }, []);

  const results = useMemo(() => searchAll(search), [search]);
  const quickSuggestions = useMemo(() => getRandomSuggestions(), []);

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
      <header className="fixed left-0 top-0 z-[70] w-full px-3 pt-3 pb-3 sm:px-4 sm:pt-5 sm:pb-4">
        <Container>
          <div
            className={`w-full rounded-[24px] px-4 py-4 backdrop-blur-xl transition-all sm:rounded-[30px] sm:px-6 lg:px-8 ${
              isDark
                ? "border border-[#2a1608] bg-black/95 shadow-[0_18px_45px_rgba(0,0,0,0.45)]"
                : "border border-black/10 bg-white/95 shadow-[0_18px_45px_rgba(0,0,0,0.14)]"
            }`}
          >
            <div className="flex min-w-0 flex-col gap-4 lg:grid lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-8">
              <div className="flex min-w-0 items-center justify-between gap-3 lg:justify-start lg:gap-8">
                <Link
                  to="/"
                  className="inline-flex h-[62px] w-[120px] shrink-0 items-center justify-center rounded-[22px] bg-white px-3 py-3 shadow-sm transition hover:scale-[1.02] sm:h-[70px] sm:w-[140px]"
                >
                  <img
                    src={Logo}
                    alt="ClickEat"
                    className="max-h-[38px] w-auto max-w-[86px] object-contain sm:max-w-[96px]"
                  />
                </Link>

                <nav className="hidden items-center gap-9 lg:flex">
                  <Link
                    to="/menu"
                    className={`text-[18px] font-bold transition hover:text-[#ff6b00] ${
                      isDark ? "text-white" : "text-[#171717]"
                    }`}
                  >
                    Menu
                  </Link>

                  <Link
                    to="/restaurants"
                    className={`text-[18px] font-bold transition hover:text-[#ff6b00] ${
                      isDark ? "text-white" : "text-[#171717]"
                    }`}
                  >
                    Restaurants
                  </Link>

                  <Link
                    to="/contact"
                    className={`text-[18px] font-bold transition hover:text-[#ff6b00] ${
                      isDark ? "text-white" : "text-[#171717]"
                    }`}
                  >
                    Contact
                  </Link>
                </nav>

                <div className="flex shrink-0 items-center justify-end gap-3 lg:hidden">
                  <CartButton cartCount={cartCount} />

                  <ProfileButton user={user} onOpen={() => setIsOpen(true)} />
                </div>
              </div>

              <div className="relative min-w-0">
                <form
                  onSubmit={handleSubmitSearch}
                  className="relative z-[80] w-full min-w-0"
                >
                  <div className="flex h-[58px] min-w-0 items-center gap-3 rounded-full bg-white px-5 shadow-sm ring-1 ring-black/10 sm:h-[62px]">
                    <RiSearchLine className="shrink-0 text-[22px] text-[#8b95a7]" />

                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      onFocus={() => setFocused(true)}
                      type="text"
                      placeholder="Поиск"
                      className="w-full min-w-0 bg-transparent text-[16px] text-[#2f3542] outline-none placeholder:text-[#9aa3b2]"
                    />
                  </div>
                </form>

                {focused && (
                  <div
                    className={`absolute left-0 top-[68px] z-[90] w-full min-w-0 rounded-[24px] p-3 backdrop-blur-xl sm:rounded-[28px] sm:p-4 ${
                      isDark
                        ? "border border-[#2a1608] bg-[#111]/98 shadow-[0_24px_70px_rgba(0,0,0,0.55)]"
                        : "border border-black/10 bg-white/98 shadow-[0_24px_70px_rgba(0,0,0,0.22)]"
                    }`}
                  >
                    {search.trim() ? (
                      results.length > 0 ? (
                        <div className="space-y-2 sm:space-y-3">
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
                                className="h-[54px] w-[70px] shrink-0 rounded-[14px] object-cover sm:h-[64px] sm:w-[84px] sm:rounded-[16px]"
                              />

                              <div className="min-w-0 flex-1">
                                <div className="flex min-w-0 items-center gap-2">
                                  <h4
                                    className={`truncate text-[15px] font-black sm:text-[16px] ${
                                      isDark ? "text-white" : "text-[#171717]"
                                    }`}
                                  >
                                    {item.title}
                                  </h4>

                                  <span className="shrink-0 rounded-full bg-[#ff6b00] px-2 py-1 text-[10px] font-black text-white sm:px-3 sm:text-[11px]">
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
                            className={`text-[16px] font-black sm:text-[18px] ${
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
                              className="rounded-full bg-[#ff6b00]/10 px-4 py-2 text-[13px] font-black text-[#ff6b00] transition hover:bg-[#ff6b00] hover:text-white"
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

              <div className="hidden shrink-0 items-center justify-end gap-4 lg:flex">
                <CartButton cartCount={cartCount} />

                <ProfileButton user={user} onOpen={() => setIsOpen(true)} />
              </div>
            </div>
          </div>
        </Container>
      </header>

      {focused && (
        <button
          type="button"
          onClick={() => setFocused(false)}
          className="fixed inset-0 z-[60] cursor-default"
          aria-label="Закрыть поиск"
        />
      )}

      <ProfileSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

function CartButton({ cartCount }: { cartCount: number }) {
  return (
    <Link
      to="/cart"
      className="relative flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full bg-[#ff6b00] text-[27px] text-white shadow-[0_14px_32px_rgba(255,107,0,0.35)] transition hover:scale-105 sm:h-[64px] sm:w-[64px]"
    >
      <RiShoppingCart2Line />

      {cartCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-1.5 text-[12px] font-black text-[#ff6b00] shadow-md">
          {cartCount}
        </span>
      )}
    </Link>
  );
}

function ProfileButton({
  user,
  onOpen,
}: {
  user: { avatar?: string; name?: string };
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex h-[58px] w-[58px] shrink-0 items-center justify-center overflow-hidden rounded-full border-[4px] border-[#ff6b00] bg-[#fff3e8] text-[28px] text-[#ff6b00] shadow-[0_14px_32px_rgba(255,107,0,0.25)] transition hover:scale-105 sm:h-[64px] sm:w-[64px]"
    >
      {user.avatar ? (
        <img
          src={user.avatar}
          alt={user.name || "Profile"}
          className="h-full w-full object-cover"
        />
      ) : (
        <GoPerson />
      )}
    </button>
  );
}