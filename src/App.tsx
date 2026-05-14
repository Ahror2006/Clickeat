import { Outlet, useLocation } from "react-router";
import { Header } from "./layouts/header";
import { Footer } from "./layouts/footer";


export const App = () => {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="app-shell min-h-screen">
      {!isAuthPage && <Header />}

      <main className={!isAuthPage ? "pt-[165px]" : ""}>
        <Outlet />
      </main>

      {!isAuthPage && <Footer />}
    </div>
  );
};