import { createBrowserRouter } from "react-router";
import { App } from "./App";

import { HomePage } from "./pages/home/page";
import { MenuPage } from "./pages/menu/page";
import { RestaurantsPage } from "./pages/restaurants/page";
import { RestaurantPage } from "./pages/restaurant/page";
import { CartPage } from "./pages/cart/page";
import { OrdersPage } from "./pages/orders/page";
import { OrderHistoryPage } from "./pages/order-history/page";
import { ProfilePage } from "./pages/profile/page";
import { EditProfilePage } from "./pages/profile/edit-page";
import { LoginPage } from "./pages/login/page";
import { RegisterPage } from "./pages/register/page";
import { ContactPage } from "./pages/contact/page";
import { SupportPage } from "./pages/support/page";
import { ReviewsPage } from "./pages/reviews/page";
import { ComplaintsPage } from "./pages/complaints/page";
import { CheckoutPage } from "./pages/checkout/page";
import { OrderTrackingPage } from "./pages/order-tracking/page";
import { EmployeePage } from "./pages/employee/page";
import AdminPage from "./pages/admin/page";
import { NotFoundPage } from "./not-found";

import { ProtectedRoute } from "./components/ProtectedRoute";
import { EmployeeRoute } from "./components/EmployeeRoute";
import AdminRoute from "./components/AdminRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      { index: true, Component: HomePage },

      { path: "menu", Component: MenuPage },
      { path: "restaurants", Component: RestaurantsPage },
      { path: "restaurant/:id", Component: RestaurantPage },
      { path: "contact", Component: ContactPage },
      { path: "support", Component: SupportPage },
      { path: "reviews", Component: ReviewsPage },
      { path: "complaints", Component: ComplaintsPage },

      { path: "login", Component: LoginPage },
      { path: "register", Component: RegisterPage },

      {
        Component: ProtectedRoute,
        children: [
          { path: "cart", Component: CartPage },
          { path: "orders", Component: OrdersPage },
          { path: "order-history", Component: OrderHistoryPage },
          { path: "profile", Component: ProfilePage },
          { path: "profile/edit", Component: EditProfilePage },
          { path: "checkout", Component: CheckoutPage },
          { path: "order-tracking/:id", Component: OrderTrackingPage },
        ],
      },

      {
        Component: EmployeeRoute,
        children: [{ path: "employee", Component: EmployeePage }],
      },

      {
        Component: AdminRoute,
        children: [{ path: "admin", Component: AdminPage }],
      },

      { path: "*", Component: NotFoundPage },
    ],
  },
]);