import { useParams, Link } from "react-router";
import { restaurantData } from "../../../defaults/restaurant.data";

function formatSum(value: number) {
  return `${value.toLocaleString("ru-RU")} сум`;
}

export const Info = () => {
  const { id } = useParams<{ id: string }>();

  const restaurant = restaurantData.find((item) => item.id === Number(id));

  if (!restaurant) {
    return (
      <div className="restaurant-detail-empty">
        <h1>Ресторан не найден</h1>
        <Link to="/restaurants">Вернуться к ресторанам</Link>
      </div>
    );
  }

  return (
    <>
      <title>{restaurant.title} | ClickEat</title>

      <section className="restaurant-detail-hero">
        <img src={restaurant.image} alt={restaurant.title} />

        <div className="restaurant-detail-overlay" />

        <div className="restaurant-detail-content">
          <span>ClickEat Restaurant</span>

          <h1>{restaurant.title}</h1>

          <p>
            {restaurant.category} • от {formatSum(restaurant.priceFrom)} •{" "}
            {restaurant.deliveryTime}
          </p>

          <div className="restaurant-detail-actions">
            <Link to={`/menu?restaurant=${restaurant.id}`}>
              Открыть меню ресторана
            </Link>

            <Link to="/restaurants">Все рестораны</Link>
          </div>
        </div>
      </section>
    </>
  );
};
