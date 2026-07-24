import { Outlet, useLocation } from "react-router";
import { Header } from "./layouts/header";
import { Footer } from "./layouts/footer";
import { ScrollToTop } from "./components/scroll-to-top";
import { BottomMobileNav } from "./components/bottom-mobile-nav";
import { Toast } from "./components/toast";

export const App = () => {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  const isFocusedPage = [
    "/profile",
    "/checkout",
    "/orders",
    "/order-tracking",
    "/employee",
    "/admin",
  ].some(
    (path) =>
      location.pathname === path || location.pathname.startsWith(`${path}/`)
  );

  const showHeader = !isAuthPage;

  return (
    <div className="app-shell min-h-screen">
      {showHeader && <div className={isFocusedPage ? "hidden lg:block" : ""}><Header /></div>}

      <main className={!isAuthPage ? "pb-[86px] lg:pb-0" : ""}>
        <ScrollToTop />
        <Outlet />
      </main>

      {!isAuthPage && <BottomMobileNav />}
      {!isAuthPage && <Footer />}
      <Toast />
    </div>
  );
};
