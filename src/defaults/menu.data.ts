import dragon from "../assets/rolls/dragon.webp";
import greenDragon from "../assets/rolls/green-dragon.webp";
import imperator from "../assets/rolls/imperator.webp";
import tiger from "../assets/rolls/tiger.webp";
import tuna from "../assets/rolls/tuna.webp";
import philadelphia from "../assets/rolls/philadelphia.webp";

import margherita from "../assets/pizza/margherita-premium.webp";
import pepperoni from "../assets/pizza/pepperoni-classic.webp";
import fourCheese from "../assets/pizza/four-cheese.webp";
import bbqChickenPizza from "../assets/pizza/bbq-chicken.webp";
import meatDeluxe from "../assets/pizza/meat-deluxe.webp";
import mexicanPizza from "../assets/pizza/mexican-hot.webp";

import blackAngus from "../assets/fast_food/black-angus-burger.webp";
import doubleSmash from "../assets/fast_food/double-smash-burger.webp";
import crispyChicken from "../assets/fast_food/crispy-chicken-deluxe.webp";
import bbqBacon from "../assets/fast_food/bbq-bacon-burger.webp";
import loadedFries from "../assets/fast_food/loaded-cheese-fries.webp";
import hotMexican from "../assets/fast_food/hot-mexican-burger.webp";

import plov from "../assets/home_food/plov-premium.webp";
import kazanKebab from "../assets/home_food/kazan-kebab-deluxe.webp";
import lagman from "../assets/home_food/lagman-signature.webp";
import manty from "../assets/home_food/manty.webp";
import stew from "../assets/home_food/stew-classic.webp";
import chickenPuree from "../assets/home_food/chicken-puree.webp";

import tokyoShoyuRamen from "../assets/ramen/Tokyo Shoyu Ramen.webp";
import spicyMisoRamen from "../assets/ramen/Spicy Miso Ramen.webp";
import blackGarlicTonkotsu from "../assets/ramen/Black Garlic Tonkotsu.webp";
import seafoodRamen from "../assets/ramen/Seafood Ramen.webp";
import chickenTeriyakiRamen from "../assets/ramen/Chicken Teriyaki Ramen.webp";
import neonFireRamen from "../assets/ramen/Neon Fire Ramen.webp";

import bbqBeefRibs from "../assets/grill/BBQ Beef Ribs.webp";
import clickEatInfernoGrill from "../assets/grill/ClickEat Inferno Grill.webp";
import fireSteakGrill from "../assets/grill/Fire Steak Grill.webp";
import mixGrillPlate from "../assets/grill/Mix Grill Plate.webp";
import smokyChickenGrill from "../assets/grill/Smoky Chicken Grill.webp";
import turkishAdanaKebab from "../assets/grill/Turkish Adana Kebab.webp";

export type MenuCategory =
  | "rolls"
  | "pizza"
  | "fastfood"
  | "home"
  | "ramen"
  | "grill";

export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  restaurant_id: number;
  category: MenuCategory;
  image: string;
};

export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Дракон ролл",
    description: "Угорь, авокадо, огурец, соус унаги",
    price: 85000,
    restaurant_id: 2,
    category: "rolls",
    image: dragon,
  },
  {
    id: 2,
    name: "Зелёный дракон",
    description: "Лосось, авокадо, сыр, огурец",
    price: 78000,
    restaurant_id: 2,
    category: "rolls",
    image: greenDragon,
  },
  {
    id: 3,
    name: "Император ролл",
    description: "Креветки, угорь, сыр, соус спайси",
    price: 92000,
    restaurant_id: 2,
    category: "rolls",
    image: imperator,
  },
  {
    id: 4,
    name: "Тайгер ролл",
    description: "Креветка темпура, соус унаги",
    price: 88000,
    restaurant_id: 2,
    category: "rolls",
    image: tiger,
  },
  {
    id: 5,
    name: "Тунец премиум",
    description: "Свежий тунец, авокадо, сыр",
    price: 95000,
    restaurant_id: 2,
    category: "rolls",
    image: tuna,
  },
  {
    id: 6,
    name: "Филадельфия классик",
    description: "Лосось, сливочный сыр",
    price: 89000,
    restaurant_id: 2,
    category: "rolls",
    image: philadelphia,
  },

  {
    id: 7,
    name: "Маргарита Премиум",
    description: "Моцарелла, томатный соус, базилик",
    price: 79000,
    restaurant_id: 1,
    category: "pizza",
    image: margherita,
  },
  {
    id: 8,
    name: "Пепперони Классик",
    description: "Пепперони, моцарелла, фирменный томатный соус",
    price: 90000,
    restaurant_id: 1,
    category: "pizza",
    image: pepperoni,
  },
  {
    id: 9,
    name: "Четыре сыра",
    description: "Моцарелла, дорблю, пармезан, чеддер",
    price: 88000,
    restaurant_id: 1,
    category: "pizza",
    image: fourCheese,
  },
  {
    id: 10,
    name: "BBQ Chicken",
    description: "Курица гриль, BBQ соус, красный лук",
    price: 92000,
    restaurant_id: 1,
    category: "pizza",
    image: bbqChickenPizza,
  },
  {
    id: 11,
    name: "Мясная Deluxe",
    description: "Говядина, пепперони, бекон, сыр",
    price: 99000,
    restaurant_id: 1,
    category: "pizza",
    image: meatDeluxe,
  },
  {
    id: 12,
    name: "Мексиканская Острая",
    description: "Халапеньо, фарш, кукуруза, острый соус",
    price: 94000,
    restaurant_id: 1,
    category: "pizza",
    image: mexicanPizza,
  },

  {
    id: 13,
    name: "Black Angus Burger",
    description: "Мраморная говядина, cheddar, карамельный лук",
    price: 76000,
    restaurant_id: 5,
    category: "fastfood",
    image: blackAngus,
  },
  {
    id: 14,
    name: "Double Smash Burger",
    description: "Две котлеты, cheddar, бекон, фирменный соус",
    price: 82000,
    restaurant_id: 5,
    category: "fastfood",
    image: doubleSmash,
  },
  {
    id: 15,
    name: "Crispy Chicken Deluxe",
    description: "Хрустящее куриное филе, салат, spicy mayo",
    price: 69000,
    restaurant_id: 5,
    category: "fastfood",
    image: crispyChicken,
  },
  {
    id: 16,
    name: "BBQ Bacon Burger",
    description: "Говядина, бекон, BBQ соус, красный лук",
    price: 79000,
    restaurant_id: 5,
    category: "fastfood",
    image: bbqBacon,
  },
  {
    id: 17,
    name: "Loaded Cheese Fries",
    description: "Картофель фри, cheddar, бекон, фирменный соус",
    price: 52000,
    restaurant_id: 5,
    category: "fastfood",
    image: loadedFries,
  },
  {
    id: 18,
    name: "Hot Mexican Burger",
    description: "Острая котлета, jalapeño, salsa sauce, cheddar",
    price: 78000,
    restaurant_id: 5,
    category: "fastfood",
    image: hotMexican,
  },

  {
    id: 19,
    name: "Томлёный плов Premium",
    description: "Плов с говядиной, нутом и барбарисом",
    price: 68000,
    restaurant_id: 4,
    category: "home",
    image: plov,
  },
  {
    id: 20,
    name: "Казан Кебаб Deluxe",
    description: "Мясо, картофель, лук и специи в казане",
    price: 74000,
    restaurant_id: 4,
    category: "home",
    image: kazanKebab,
  },
  {
    id: 21,
    name: "Домашняя Лагман Signature",
    description: "Тянутая лапша, мясо, овощи и насыщенный бульон",
    price: 62000,
    restaurant_id: 4,
    category: "home",
    image: lagman,
  },
  {
    id: 22,
    name: "Манты Handmade Selection",
    description: "Манты ручной лепки с мясом и луком",
    price: 58000,
    restaurant_id: 4,
    category: "home",
    image: manty,
  },
  {
    id: 23,
    name: "Жаркое по-домашнему Classic",
    description: "Говядина, картофель, морковь и домашний соус",
    price: 66000,
    restaurant_id: 4,
    category: "home",
    image: stew,
  },
  {
    id: 24,
    name: "Курица с пюре Comfort Plate",
    description: "Куриное филе, сливочный соус и картофельное пюре",
    price: 64000,
    restaurant_id: 4,
    category: "home",
    image: chickenPuree,
  },

  {
    id: 25,
    name: "Tokyo Shoyu Ramen",
    description: "Классический японский рамен с соевым бульоном",
    price: 72000,
    restaurant_id: 3,
    category: "ramen",
    image: tokyoShoyuRamen,
  },
  {
    id: 26,
    name: "Spicy Miso Ramen",
    description: "Острый мисо-рамен с насыщенным бульоном",
    price: 76000,
    restaurant_id: 3,
    category: "ramen",
    image: spicyMisoRamen,
  },
  {
    id: 27,
    name: "Black Garlic Tonkotsu",
    description: "Премиальный tonkotsu ramen с black garlic",
    price: 89000,
    restaurant_id: 3,
    category: "ramen",
    image: blackGarlicTonkotsu,
  },
  {
    id: 28,
    name: "Seafood Ramen",
    description: "Морской рамен с креветками, кальмаром и мидиями",
    price: 93000,
    restaurant_id: 3,
    category: "ramen",
    image: seafoodRamen,
  },
  {
    id: 29,
    name: "Chicken Teriyaki Ramen",
    description: "Рамен с курицей терияки, яйцом и зелёным луком",
    price: 79000,
    restaurant_id: 3,
    category: "ramen",
    image: chickenTeriyakiRamen,
  },
  {
    id: 30,
    name: "Neon Fire Ramen",
    description: "Фирменный острый ramen от ClickEat",
    price: 99000,
    restaurant_id: 3,
    category: "ramen",
    image: neonFireRamen,
  },

  {
    id: 31,
    name: "Fire Steak Grill",
    description: "Сочный стейк рибай на открытом огне",
    price: 139000,
    restaurant_id: 6,
    category: "grill",
    image: fireSteakGrill,
  },
  {
    id: 32,
    name: "BBQ Beef Ribs",
    description: "Говяжьи BBQ рёбра в фирменном соусе",
    price: 129000,
    restaurant_id: 6,
    category: "grill",
    image: bbqBeefRibs,
  },
  {
    id: 33,
    name: "Smoky Chicken Grill",
    description: "Курица гриль с дымным ароматом и овощами",
    price: 99000,
    restaurant_id: 6,
    category: "grill",
    image: smokyChickenGrill,
  },
  {
    id: 34,
    name: "Mix Grill Plate",
    description: "Большой мясной grill plate с овощами",
    price: 159000,
    restaurant_id: 6,
    category: "grill",
    image: mixGrillPlate,
  },
  {
    id: 35,
    name: "ClickEat Inferno Grill",
    description: "Фирменный spicy grill set от ClickEat",
    price: 145000,
    restaurant_id: 6,
    category: "grill",
    image: clickEatInfernoGrill,
  },
  {
    id: 36,
    name: "Turkish Adana Kebab",
    description: "Турецкий adana kebab с лавашом и зеленью",
    price: 112000,
    restaurant_id: 6,
    category: "grill",
    image: turkishAdanaKebab,
  },
];