import { useParams } from "react-router";
import { menuItems } from "../../../defaults/menu.data";
import { ListItem } from "./list-item";
import { Container } from "../../../widgets/container";

export const Lists = () => {
  const { id } = useParams<{ id: string }>();
  const restaurantId = Number(id);

  const items = menuItems.filter((item) => item.restaurant_id === restaurantId);

  return (
    <Container>
      {items.length === 0 ? (
        <div className="mt-12 rounded-[30px] border border-[#2a1608] bg-[#111] p-12 text-center">
          <h2 className="text-[30px] font-black text-white">
            Блюда не найдены
          </h2>
          <p className="mt-3 text-white/60">
            Для этого ресторана пока нет блюд.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-[24px] pt-10 pb-[112px] md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <ListItem
              key={item.id}
              description={item.description}
              image={item.image}
              price={item.price}
              title={item.name}
              id={item.id}
            />
          ))}
        </ul>
      )}
    </Container>
  );
};