import restaurant1 from "../assets/restaurants/restaurant-1.png";
import restaurant2 from "../assets/restaurants/restaurant-2.png";
import restaurant3 from "../assets/restaurants/restaurant-3.png";
import restaurant4 from "../assets/restaurants/restaurant-4.png";
import restaurant5 from "../assets/restaurants/restaurant-5.png";
import restaurant6 from "../assets/restaurants/restaurant-6.png";

export type RestaurantType = {
  id: number;
  title: string;
  name: string;
  category: string;
  rating: number;
  price: number;
  priceFrom: number;
  time: number;
  deliveryTime: string;
  image: string;
};

export const restaurantData: RestaurantType[] = [
  {
    id: 1,
    title: "Пицца плюс",
    name: "Пицца плюс",
    category: "Пицца",
    rating: 4.5,
    price: 90000,
    priceFrom: 90000,
    time: 50,
    deliveryTime: "50 мин",
    image: restaurant1,
  },
  {
    id: 2,
    title: "Sushi Master",
    name: "Sushi Master",
    category: "Суши",
    rating: 4.9,
    price: 95000,
    priceFrom: 95000,
    time: 50,
    deliveryTime: "50 мин",
    image: restaurant2,
  },
  {
    id: 3,
    title: "Ramen House",
    name: "Ramen House",
    category: "Японская кухня",
    rating: 4.6,
    price: 88000,
    priceFrom: 88000,
    time: 45,
    deliveryTime: "45 мин",
    image: restaurant3,
  },
  {
    id: 4,
    title: "Home Food Cafe",
    name: "Home Food Cafe",
    category: "Домашняя еда",
    rating: 4.7,
    price: 65000,
    priceFrom: 65000,
    time: 40,
    deliveryTime: "40 мин",
    image: restaurant4,
  },
  {
    id: 5,
    title: "FoodBand",
    name: "FoodBand",
    category: "Fast Food",
    rating: 4.6,
    price: 90000,
    priceFrom: 90000,
    time: 40,
    deliveryTime: "40 мин",
    image: restaurant5,
  },
  {
    id: 6,
    title: "ClickEat Grill",
    name: "ClickEat Grill",
    category: "Гриль",
    rating: 4.4,
    price: 80000,
    priceFrom: 80000,
    time: 35,
    deliveryTime: "35 мин",
    image: restaurant6,
  },
];

export const restaurants = restaurantData;