import { HeroSlider } from "./hero-slider";
import { HomeCategories } from "./categories";
import { FeaturedRestaurants } from "./featured-restaurants";
import { FeaturedMenu } from "./featured-menu";

export const HomePage = () => {
  return (
    <main className="home-page min-w-[360px] overflow-x-hidden">
      <HeroSlider />
      <HomeCategories />
      <FeaturedRestaurants />
      <FeaturedMenu />
    </main>
  );
};