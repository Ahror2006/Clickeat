import { useEffect, useState } from "react";
import { Link } from "react-router";
import { FaStar } from "react-icons/fa";
import { Container } from "../../widgets/container";
import { restaurants } from "../../defaults/restaurant.data";

function shuffle<T>(array: T[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

function formatSum(value: number) {
  return `${value.toLocaleString("ru-RU")} сум`;
}

export const FeaturedRestaurants = () => {
  const [visibleRestaurants, setVisibleRestaurants] = useState(() =>
    shuffle(restaurants).slice(0, 3)
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      setVisibleRestaurants(shuffle(restaurants).slice(0, 3));
    }, 30000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section id="restaurants" className="featured-restaurants-section">
      <Container>
        <div className="featured-restaurants-head">
          <div>
            <h2>Популярные рестораны</h2>
            <p>Лучшие заведения, которые выбирают пользователи ClickEat.</p>
          </div>

          <Link to="/restaurants">Смотреть все</Link>
        </div>

        <ul className="featured-restaurants-grid">
          {visibleRestaurants.map((restaurant) => (
            <li key={restaurant.id}>
              <Link
                to={`/restaurant/${restaurant.id}`}
                className="featured-restaurants-card"
              >
                <div className="featured-restaurants-image">
                  <img src={restaurant.image} alt={restaurant.title} />
                  <span>{restaurant.deliveryTime}</span>
                </div>

                <div className="featured-restaurants-body">
                  <h3>{restaurant.title}</h3>

                  <div className="featured-restaurants-meta">
                    <b>
                      <FaStar />
                      {restaurant.rating}
                    </b>

                    <p>От {formatSum(restaurant.priceFrom)}</p>
                  </div>

                  <strong>{restaurant.category}</strong>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
};
