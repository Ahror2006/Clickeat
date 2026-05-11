import { menuItems } from "../defaults/menu.data";
import { restaurantData } from "../defaults/restaurant.data";

export type SearchResult = {
  id: string;
  type: "dish" | "restaurant";
  title: string;
  subtitle: string;
  image: string;
  href: string;
  badge: string;
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export function searchAll(query: string): SearchResult[] {
  const q = normalize(query);

  if (!q) return [];

  const dishes: SearchResult[] = menuItems
    .filter((item) => {
      const text = `${item.name} ${item.description} ${item.category}`.toLowerCase();
      return text.includes(q);
    })
    .map((item) => ({
      id: `dish-${item.id}`,
      type: "dish",
      title: item.name,
      subtitle: `${item.description} • ${item.price.toLocaleString("ru-RU")} сум`,
      image: item.image,
      href: `/menu?query=${encodeURIComponent(item.name)}`,
      badge: "Блюдо",
    }));

  const restaurants: SearchResult[] = restaurantData
    .filter((item) => {
      const text = `${item.title} ${item.name} ${item.category}`.toLowerCase();
      return text.includes(q);
    })
    .map((item) => ({
      id: `restaurant-${item.id}`,
      type: "restaurant",
      title: item.title,
      subtitle: `${item.category} • от ${item.priceFrom.toLocaleString("ru-RU")} сум • ${item.deliveryTime}`,
      image: item.image,
      href: `/restaurant/${item.id}`,
      badge: "Ресторан",
    }));

  return [...dishes, ...restaurants].slice(0, 7);
}