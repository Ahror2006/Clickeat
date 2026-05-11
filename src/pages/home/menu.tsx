import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { menuItems } from "../../defaults/menu.data";
import { Container } from "../../widgets/container";
import { RiShoppingCart2Line } from "react-icons/ri";
import { Button } from "../../components/button";
import { toMoney } from "../../lib/util";
import { IoIosSearch } from "react-icons/io";
import { addToCart } from "../../lib/cart";

function getTags(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();
  const tags: string[] = [];

  if (text.includes("ролл") || text.includes("суш") || text.includes("филадельф") || text.includes("калифор")) {
    tags.push("Суши", "Роллы");
  }
  if (text.includes("кревет")) tags.push("С морепродуктами");
  if (text.includes("лосос") || text.includes("тунц") || text.includes("угор")) tags.push("Рыба");
  if (text.includes("овощ")) tags.push("Лёгкое");
  if (text.includes("запеч")) tags.push("Запечённое");
  if (tags.length === 0) tags.push("Популярное", "Вкусное");

  return [...new Set(tags)].slice(0, 3);
}

export const HomeMenu = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("query") || "";
  const [search, setSearch] = useState(initialQuery);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return menuItems;

    return menuItems.filter((item) => {
      const tags = getTags(item.name, item.description).join(" ");
      const text = `${item.name} ${item.description} ${tags}`.toLowerCase();
      return text.includes(query);
    });
  }, [search]);

  return (
    <section id="menu" className="home-page min-h-screen pb-[70px]">
      <Container>
        <div className="space-y-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="home-title text-[40px] font-bold text-[#2f3542]">
                Все блюда
              </h2>

              <p className="home-text mt-2 max-w-[680px] text-[18px] text-[#8C8C8C]">
                Здесь собраны все блюда с описанием и тегами, чтобы клиент мог быстро выбрать то, что ему подходит.
              </p>
            </div>

            <form className="w-full lg:w-[360px]" onSubmit={(e) => e.preventDefault()}>
              <label className="relative inline-block w-full">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.currentTarget.value)}
                  type="search"
                  placeholder="Поиск"
                  className="home-search inline-block w-full rounded-[14px] border border-[#d9d9d9] bg-white py-[14px] pl-[42px] pr-[14px] text-[16px] outline-none"
                />
                <IoIosSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-[20px] text-[#8C8C8C]" />
              </label>
            </form>
          </div>

          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => {
              const tags = getTags(item.name, item.description);

              return (
                <li key={item.id}>
                  <div className="food-card overflow-hidden rounded-[22px] border border-[#ece2d7] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,0,0,0.10)]">
                    <div className="h-[240px] overflow-hidden">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>

                    <div className="p-5">
                      <div className="mb-3 flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <span key={`${item.id}-${tag}`} className="rounded-full bg-[#fff3e8] px-3 py-1 text-[13px] font-medium text-[#ff7a00]">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <h3 className="food-card-title mb-3 text-[24px] font-semibold text-[#2f3542]">
                        {item.name}
                      </h3>

                      <p className="food-card-text mb-5 line-clamp-3 text-[16px] leading-7 text-[#8C8C8C]">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between gap-4">
                        <Button
                          color="blue"
                          onClick={() =>
                            addToCart({
                              id: item.id,
                              title: item.name,
                              price: item.price,
                              image: item.image,
                              description: item.description,
                              restaurant: "ClickEat Restaurant",
                            })
                          }
                        >
                          <span>В корзину</span>
                          <RiShoppingCart2Line />
                        </Button>

                        <strong className="text-[22px] font-bold text-[#2f3542]">
                          {toMoney(item.price)}
                        </strong>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
};
