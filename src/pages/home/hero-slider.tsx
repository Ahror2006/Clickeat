import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Container } from "../../widgets/container";

import PizzaBanner from "../../assets/banners/pizza-banner.png";
import SushiBanner from "../../assets/banners/sushi-banner.png";
import FastFoodBanner from "../../assets/banners/fastfood-banner.png";
import HomeFoodBanner from "../../assets/banners/homefood-banner.png";

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
    <section className="pt-[26px] pb-[38px]">
      <Container>
        <div className="relative h-[360px] overflow-hidden rounded-[32px] bg-[#fff3e0] shadow-[0_18px_45px_rgba(0,0,0,0.10)]">
          {banners.map((banner, index) => (
            <img
              key={banner.id}
              src={banner.image}
              alt={banner.alt}
              className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-700 ease-in-out ${
                active === index
                  ? "z-[2] opacity-100 scale-100"
                  : "z-[1] opacity-0 scale-[1.02]"
              }`}
            />
          ))}

          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-5 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#2f3542] shadow-md transition hover:scale-105 hover:text-[#ff6b00]"
          >
            <FiChevronLeft className="text-[25px]" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-5 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#2f3542] shadow-md transition hover:scale-105 hover:text-[#ff6b00]"
          >
            <FiChevronRight className="text-[25px]" />
          </button>

          <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/85 px-4 py-2 backdrop-blur-sm">
            {banners.map((banner, index) => (
              <button
                key={banner.id}
                type="button"
                onClick={() => {
                  setActive(index);
                  restartTimer();
                }}
                className={`h-2.5 rounded-full transition-all ${
                  active === index ? "w-8 bg-[#ff6b00]" : "w-2.5 bg-[#d8d8d8]"
                }`}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
