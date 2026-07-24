import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Container } from "../../widgets/container";

import PizzaBanner from "../../assets/banners/pizza-banner.webp";
import SushiBanner from "../../assets/banners/sushi-banner.webp";
import FastFoodBanner from "../../assets/banners/fastfood-banner.webp";
import HomeFoodBanner from "../../assets/banners/homefood-banner.webp";

const banners = [
  { id: 1, image: PizzaBanner, alt: "Pizza" },
  { id: 2, image: SushiBanner, alt: "Sushi" },
  { id: 3, image: FastFoodBanner, alt: "Fast Food" },
  { id: 4, image: HomeFoodBanner, alt: "Home Food" },
];

export const HeroSlider = () => {
  const [active, setActive] = useState(0);
  const timerRef = useRef<number | null>(null);

  const restartTimer = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);

    timerRef.current = window.setInterval(() => {
      setActive((prev) => (prev + 1) % banners.length);
    }, 4500);
  };

  useEffect(() => {
    restartTimer();

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const nextSlide = () => {
    setActive((prev) => (prev + 1) % banners.length);
    restartTimer();
  };

  const prevSlide = () => {
    setActive((prev) => (prev - 1 + banners.length) % banners.length);
    restartTimer();
  };

  return (
    <section className="home-hero-section pb-6 pt-[255px] sm:pb-10 sm:pt-[265px] lg:pt-[135px]">
      <Container>
        <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[24px] bg-[#fff3e0] shadow-[0_18px_50px_rgba(0,0,0,0.14)] sm:rounded-[32px] lg:aspect-auto lg:h-[440px] xl:h-[460px]">
          {banners.map((banner, index) => (
            <div key={banner.id} className={`absolute inset-0 transition-opacity duration-700 ${active === index ? "z-[2] opacity-100" : "z-[1] opacity-0"}`}>
              <img src={banner.image} alt={banner.alt} className="h-full w-full object-contain object-center lg:object-cover lg:object-[center_52%]" />
            </div>
          ))}

          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#2f3542] shadow-md transition hover:text-[#ff6b00] sm:flex"
          >
            <FiChevronLeft className="text-[22px]" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#2f3542] shadow-md transition hover:text-[#ff6b00] sm:flex"
          >
            <FiChevronRight className="text-[22px]" />
          </button>

          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/85 px-3 py-2 backdrop-blur-sm">
            {banners.map((banner, index) => (
              <button
                key={banner.id}
                type="button"
                onClick={() => {
                  setActive(index);
                  restartTimer();
                }}
                className={`h-2 rounded-full transition-all ${active === index ? "w-7 bg-[#ff6b00]" : "w-2 bg-[#d8d8d8]"
                  }`}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
