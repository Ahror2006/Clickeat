import { RiShoppingCart2Line } from "react-icons/ri";
import { toMoney } from "../../../lib/util";
import { addToCart } from "../../../lib/cart";

export const ListItem = ({ description, image, price, title, id }: Props) => {
  const onAdd = () => {
    addToCart({
      id,
      title,
      price,
      image,
      description,
      restaurant: "ClickEat Restaurant",
    });
  };

  return (
    <li>
      <div className="group overflow-hidden rounded-[32px] border border-[#2a1608] bg-[#0f0f0f] shadow-[0_18px_45px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-2 hover:border-[#ff6b00]/70">
        <div className="relative h-[280px] overflow-hidden bg-[#151515]">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.06]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        </div>

        <div className="p-6">
          <h3 className="text-[28px] font-black text-white">{title}</h3>

          <p className="mt-3 min-h-[64px] text-[17px] leading-7 text-white/65">
            {description}
          </p>

          <div className="mt-8 flex items-center justify-between border-t border-[#2a1608] pt-6">
            <button
              onClick={onAdd}
              className="flex items-center gap-2 rounded-full bg-[#ff6b00] px-5 py-3 text-[15px] font-black text-white transition hover:bg-white hover:text-[#ff6b00]"
            >
              <span>В корзину</span>
              <RiShoppingCart2Line />
            </button>

            <strong className="text-[24px] font-black text-[#ff6b00]">
              {toMoney(price)}
            </strong>
          </div>
        </div>
      </div>
    </li>
  );
};

interface Props {
  image: string;
  title: string;
  description: string;
  price: number;
  id: number;
}