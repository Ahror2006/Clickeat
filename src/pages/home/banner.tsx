import { Container } from "../../widgets/container";
import BannerImage from "./../../assets/banners/pizza-banner.png";

export const Banner = () => {
  return (
    <section className="pt-[18px] pb-[56px]">
      <Container>
        <div className="hero-shell relative overflow-hidden rounded-[28px] bg-[#FFF1B8] px-[70px] py-[68px] shadow-[0_14px_34px_rgba(0,0,0,0.05)]">
          <div className="relative z-10 w-[538px] space-y-4">
            <h2 className="hero-title text-[39px] font-bold text-[#2f3542]">
              Онлайн-сервис доставки еды на дом
            </h2>

            <p className="hero-text text-2xl text-[#2f3542]">
              Блюда из любимого ресторана привезет курьер
              в перчатках, маске и с антисептиком
            </p>
          </div>

          <div className="absolute top-0 right-0 bottom-0">
            <img
              className="h-full w-full object-cover"
              src={BannerImage}
              alt="баннер"
            />
          </div>
        </div>
      </Container>
    </section>
  );
};