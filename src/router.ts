import { createBrowserRouter } from "react-router";
import { App } from "./App";
import { HomePage } from "./pages/home/page";
import { RestaurantPage } from "./pages/restaurant/page";
import { RestaurantsPage } from "./pages/restaurants/page";
import { NotFoundPage } from "./not-found";
import { CartPage } from "./pages/cart/page";
import { LoginPage } from "./pages/login/page";
import { RegisterPage } from "./pages/register/page";
import { ProfilePage } from "./pages/profile/page";
import { EditProfilePage } from "./pages/profile/edit-page";
import { OrdersPage } from "./pages/orders/page";
import { MenuPage } from "./pages/menu/page";
import { OrderHistoryPage } from "./pages/order-history/page";
import { ContactPage } from "./pages/contact/page";
import { SupportPage } from "./pages/support/page";
import { ReviewsPage } from "./pages/reviews/page";
import { ComplaintsPage } from "./pages/complaints/page";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      { index: true, Component: HomePage },
      { path: "menu", Component: MenuPage },
      { path: "restaurants", Component: RestaurantsPage },
      { path: "restaurant/:id", Component: RestaurantPage },
      { path: "cart", Component: CartPage },
      { path: "orders", Component: OrdersPage },
      { path: "order-history", Component: OrderHistoryPage },
      { path: "profile", Component: ProfilePage },
      { path: "profile/edit", Component: EditProfilePage },
      { path: "login", Component: LoginPage },
      { path: "register", Component: RegisterPage },
      { path: "*", Component: NotFoundPage },
      {
        path: "contact",
        Component: ContactPage,
      },
      {
        path: "support",
        Component: SupportPage,
      },
      {
        path: "reviews",
        Component: ReviewsPage,
      },
      {
        path: "complaints",
        Component: ComplaintsPage,
      },
    ],
  },
]);
