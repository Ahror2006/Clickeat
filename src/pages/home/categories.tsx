import { Link } from "react-router";
import { Container } from "../../widgets/container";
import { HiOutlineHome } from "react-icons/hi";
import { useThemeStore } from "../../stores/theme.store";

import {
  GiFullPizza,
  GiHamburger,
  GiNoodles,
  GiBarbecue,
  GiChopsticks,
} from "react-icons/gi";

const categories = [
  {
    title: "Pizza",
    description: "Горячая, сочная, любимая классика",
    icon: <GiFullPizza />,
    category: "pizza",
  },
  {
    title: "Sushi",
    description: "Роллы, сеты и свежие морепродукты",
    icon: <GiChopsticks />,
    category: "rolls",
  },
  {
    title: "Fast Food",
    description: "Бургеры, картошка и напитки",
    icon: <GiHamburger />,
    category: "fastfood",
  },
  {
    title: "Home Food",
    description: "Домашние блюда с тёплой подачей",
    icon: <HiOutlineHome />,
    category: "home",
  },
  {
    title: "Ramen",
    description: "Японский ramen и насыщенный broth",
    icon: <GiNoodles />,
    category: "ramen",
  },
  {
    title: "Grill",
    description: "BBQ, стейки и мясо на огне",
    icon: <GiBarbecue />,
    category: "grill",
  },
];

export const HomeCategories = () => {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";

  return (
    <section className="home-categories-section pb-8 pt-2 sm:pb-12 lg:pb-14">
      <Container>
        <div className="space-y-6 lg:space-y-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2
                className={`home-title text-[34px] font-black leading-tight sm:text-[38px] lg:text-[40px] ${
                  isDark ? "text-white" : "text-[#2f3542]"
                }`}
              >
                Категории
              </h2>

              <p
                className={`home-text mt-2 max-w-[650px] text-[15px] leading-6 sm:text-[17px] ${
                  isDark ? "text-white/55" : "text-[#8C8C8C]"
                }`}
              >
                Выбирай то, что хочется именно сейчас — от горячей пиццы до
                домашней еды.
              </p>
            </div>

            <Link
              to="/menu"
              className="hidden rounded-full bg-gradient-to-r from-[#ff7a00] to-[#ff5a00] px-7 py-4 text-[15px] font-black text-white shadow-[0_12px_24px_rgba(255,107,0,0.22)] transition hover:scale-[1.03] md:inline-flex"
            >
              Открыть меню
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 xl:grid-cols-4">
            {categories.map((item) => (
              <Link
                key={item.category}
                to={`/menu?category=${item.category}`}
                className={`group min-h-[176px] rounded-[24px] border p-4 shadow-[0_8px_22px_rgba(0,0,0,0.05)] transition active:scale-[0.98] sm:min-h-[154px] sm:p-5 lg:min-h-[132px] lg:hover:-translate-y-1 lg:hover:shadow-[0_16px_30px_rgba(0,0,0,0.10)] ${
                  isDark
                    ? "border-[#2a1608] bg-[#121212]"
                    : "border-[#f0e7de] bg-white"
                }`}
              >
                <div className="flex h-full flex-col justify-between gap-4 lg:flex-row lg:items-center">
                  <div className="min-w-0">
                    <h3
                      className={`text-[20px] font-black leading-tight transition lg:group-hover:text-[#ff6b00] sm:text-[24px] ${
                        isDark ? "text-white" : "text-[#2f3542]"
                      }`}
                    >
                      {item.title}
                    </h3>

                    <p
                      className={`mt-2 text-[13px] leading-5 sm:text-[15px] sm:leading-6 ${
                        isDark ? "text-white/55" : "text-[#8C8C8C]"
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>

                  <div
                    className={`ml-auto flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full text-[27px] text-[#ff6b00] sm:h-[66px] sm:w-[66px] lg:h-[74px] lg:w-[74px] lg:text-[30px] ${
                      isDark ? "bg-[#1f1f1f]" : "bg-[#fff3e8]"
                    }`}
                  >
                    {item.icon}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};