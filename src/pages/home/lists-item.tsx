import { FaStar } from "react-icons/fa6";
import { Link } from "react-router";
import type { RestaurantType } from "../../defaults/restaurant.data";

export const ListsItem = ({
  category,
  id,
  image,
  price,
  rating,
  time,
  title,
}: Props) => {
  return (
    <li>
      <Link to={"/restaurant/" + id} className="inline-block w-full">
        <div className="restaurant-card overflow-hidden rounded-[22px] border border-[#f0e7de] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,0,0,0.10)]">
          <div className="h-[250px] overflow-hidden">
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="space-y-3 px-[23px] pt-[20px] pb-[24px]">
            <div className="flex items-center justify-between gap-3">
              <h3 className="restaurant-card-title text-[24px] font-bold text-[#2f3542]">
                {title}
              </h3>

              <time className="rounded-full bg-black px-3 py-1 text-[13px] font-medium text-white">
                {time} мин
              </time>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-[#FFC107]">
                <FaStar />
                <span className="text-[18px] font-bold">{rating}</span>
              </div>

              <div className="restaurant-card-text flex flex-wrap items-center gap-2 text-[15px] text-[#8C8C8C]">
                <span>От {price} ₽</span>
                <span>&bull;</span>
                <span>{category}</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="inline-flex rounded-full bg-[#fff3e8] px-3 py-1 text-[13px] font-medium text-[#ff7a00]">
                {category}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
};

type Props = RestaurantType;
