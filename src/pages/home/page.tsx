import { HeroSlider } from "./hero-slider";
import { HomeCategories } from "./categories";
import { FeaturedRestaurants } from "./featured-restaurants";
import { FeaturedMenu } from "./featured-menu";

export const HomePage = () => {
  return (
    <div className="home-page">
      <HeroSlider />
      <HomeCategories />
      <FeaturedRestaurants />
      <FeaturedMenu />
    </div>
  );
};