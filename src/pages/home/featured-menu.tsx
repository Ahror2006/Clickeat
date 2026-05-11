import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Container } from "../../widgets/container";
import { menuItems, type MenuCategory } from "../../defaults/menu.data";

function shuffle<T>(array: T[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

function formatSum(value: number) {
  return `${value.toLocaleString("ru-RU")} сум`;
}

const categoryLabels: Record<MenuCategory, string> = {
  rolls: "Rolls",
  pizza: "Pizza",
  fastfood: "Fast Food",
  home: "Home Food",
  ramen: "Ramen",
  grill: "Grill",
};

export const FeaturedMenu = () => {
  const [visibleItems, setVisibleItems] = useState(() =>
    shuffle(menuItems).slice(0, 3)
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      setVisibleItems(shuffle(menuItems).slice(0, 3));
    }, 12000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="featured-menu-section">
      <Container>
        <div className="featured-menu-head">
          <div>
            <span className="featured-menu-badge">ClickEat Menu</span>

            <h2>Популярные блюда</h2>

            <p>Выбирай категорию и открывай меню с нужными блюдами.</p>
          </div>

          <Link to="/menu" className="featured-menu-all">
            Открыть всё меню
          </Link>
        </div>

        <ul className="featured-menu-grid">
          {visibleItems.map((item) => (
            <li key={item.id}>
              <Link
                to={`/menu?category=${item.category}&restaurant=${item.restaurant_id}`}
                className="featured-menu-card"
              >
                <div className="featured-menu-image">
                  <img src={item.image} alt={item.name} />

                  <span className="featured-menu-tag">
                    {categoryLabels[item.category]}
                  </span>

                  <strong className="featured-menu-open">Открыть меню</strong>
                </div>

                <div className="featured-menu-body">
                  <h3>{item.name}</h3>

                  <p>{item.description}</p>

                  <div className="featured-menu-bottom">
                    <span>ClickEat menu</span>
                    <strong>{formatSum(item.price)}</strong>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
};