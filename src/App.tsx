import { Outlet, useLocation } from "react-router";
import { Header } from "./layouts/header";
import { Footer } from "./layouts/footer";
import { ScrollToTop } from "./components/scroll-to-top";
import { BottomMobileNav } from "./components/bottom-mobile-nav";

export const App = () => {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="app-shell min-h-screen">
      {!isAuthPage && <Header />}

      <main className={!isAuthPage ? "pb-[86px] lg:pb-0" : ""}>
        <ScrollToTop />
        <Outlet />
      </main>

      {!isAuthPage && <BottomMobileNav />}
      {!isAuthPage && <Footer />}
    </div>
  );
};