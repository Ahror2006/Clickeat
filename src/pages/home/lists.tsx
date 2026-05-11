import { IoIosSearch } from "react-icons/io";
import { Container } from "../../widgets/container";
import { restaurantData } from "./../../defaults/restaurant.data";
import { useState } from "react";
import { ListsItem } from "./lists-item";

export const Lists = () => {
  const [search, setSearch] = useState("");

  const filtered = search
    ? restaurantData.filter((res) =>
        res.title.toLowerCase().includes(search.toLowerCase())
      )
    : restaurantData;

  return (
    <section className="pt-[10px]">
      <Container>
        <div className="space-y-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="home-section-title text-[40px] font-bold text-[#2f3542]">
              Рестораны
            </h2>

            <form className="w-full lg:w-[306px]">
              <label className="relative inline-block w-full">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.currentTarget.value)}
                  type="search"
                  placeholder="Поиск блюд и ресторанов"
                  className="home-search inline-block w-full rounded-[14px] border border-[#d9d9d9] bg-white py-[12px] pl-[38px] pr-[12px] text-[16px] outline-none"
                />

                <IoIosSearch className="absolute top-1/2 left-2.5 -translate-y-1/2 text-[19px] text-[#8C8C8C]" />
              </label>
            </form>
          </div>

          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => (
              <ListsItem key={item.id} {...item} />
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
};