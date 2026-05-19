import { Helmet } from "react-helmet";
import { ProductList } from "./product-list";
import { useThemeStore } from "../../stores/theme.store";

export const CartPage = () => {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";

  return (
    <main
      className={`min-h-screen pb-20 pt-[120px] transition-all lg:pt-[150px] ${
        isDark ? "bg-black text-white" : "bg-[#f6f1ea] text-[#2f3542]"
      }`}
    >
      <Helmet>
        <title>Корзина</title>
      </Helmet>

      <ProductList />
    </main>
  );
};