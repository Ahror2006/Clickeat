import { createBrowserRouter } from "react-router";
import { lazy } from "react";
import { App } from "./App";

const HomePage = lazy(() => import("./pages/home/page").then((m) => ({ default: m.HomePage })));
const MenuPage = lazy(() => import("./pages/menu/page").then((m) => ({ default: m.MenuPage })));
const RestaurantsPage = lazy(() => import("./pages/restaurants/page").then((m) => ({ default: m.RestaurantsPage })));
const RestaurantPage = lazy(() => import("./pages/restaurant/page").then((m) => ({ default: m.RestaurantPage })));
const CartPage = lazy(() => import("./pages/cart/page").then((m) => ({ default: m.CartPage })));
const OrderHistoryPage = lazy(() => import("./pages/order-history/page").then((m) => ({ default: m.OrderHistoryPage })));
const ProfilePage = lazy(() => import("./pages/profile/page").then((m) => ({ default: m.ProfilePage })));
const EditProfilePage = lazy(() => import("./pages/profile/edit-page").then((m) => ({ default: m.EditProfilePage })));
const LoginPage = lazy(() => import("./pages/login/page").then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import("./pages/register/page").then((m) => ({ default: m.RegisterPage })));
const ContactPage = lazy(() => import("./pages/contact/page").then((m) => ({ default: m.ContactPage })));
const SupportPage = lazy(() => import("./pages/support/page").then((m) => ({ default: m.SupportPage })));
const ReviewsPage = lazy(() => import("./pages/reviews/page").then((m) => ({ default: m.ReviewsPage })));
const ComplaintsPage = lazy(() => import("./pages/complaints/page").then((m) => ({ default: m.ComplaintsPage })));
const CheckoutPage = lazy(() => import("./pages/checkout/page").then((m) => ({ default: m.CheckoutPage })));
const OrderTrackingPage = lazy(() => import("./pages/order-tracking/page").then((m) => ({ default: m.OrderTrackingPage })));
const EmployeePage = lazy(() => import("./pages/employee/page").then((m) => ({ default: m.EmployeePage })));
const AdminPage = lazy(() => import("./pages/admin/page"));
const NotFoundPage = lazy(() => import("./not-found").then((m) => ({ default: m.NotFoundPage })));

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
          { path: "orders", Component: CheckoutPage },
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
