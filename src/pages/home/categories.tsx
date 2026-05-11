import { Link } from "react-router";
import { Container } from "../../widgets/container";

import { HiOutlineHome } from "react-icons/hi";

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
  return (
    <section className="pb-[38px]">
      <Container>
        <div className="space-y-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="home-title text-[38px] font-bold text-[#2f3542]">
                Категории
              </h2>
              <p className="home-text mt-2 max-w-[650px] text-[17px] text-[#8C8C8C]">
                Выбирай то, что хочется именно сейчас — от горячей пиццы до домашней еды.
              </p>
            </div>

            <Link
              to="/menu"
              className="hidden rounded-full bg-gradient-to-r from-[#ff7a00] to-[#ff5a00] px-6 py-3 text-[15px] font-semibold text-white shadow-[0_12px_24px_rgba(255,107,0,0.22)] md:inline-flex"
            >
              Открыть меню
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {categories.map((item) => (
              <Link
                key={item.category}
                to={`/menu?category=${item.category}`}
                className="glass-card group overflow-hidden rounded-[24px] border border-[#f0e7de] bg-white p-5 shadow-[0_8px_22px_rgba(0,0,0,0.05)] transition hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(0,0,0,0.10)]"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-[24px] font-bold text-[#2f3542] transition group-hover:text-[#ff6b00]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-6 text-[#8C8C8C]">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex h-[74px] w-[74px] items-center justify-center rounded-full bg-[#fff3e8] text-[30px] text-[#ff6b00]">
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