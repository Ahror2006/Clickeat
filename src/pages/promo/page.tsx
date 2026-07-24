import { useEffect, useState } from "react";
import { FiGift, FiTag } from "react-icons/fi";
import { getAvailablePromocodes } from "../../lib/orders.api";
import { useAuth } from "../../stores/auth.store";
import { useThemeStore } from "../../stores/theme.store";
import { Container } from "../../widgets/container";

type Promo = { code: string; title: string; minOrder: number; maxDiscount: number };

export const PromoPage = () => {
  const [promos, setPromos] = useState<Promo[]>([]);
  const user = useAuth((state) => state.user);
  const updateProfile = useAuth((state) => state.updateProfile);
  const isDark = useThemeStore((state) => state.theme) === "dark";

  useEffect(() => { getAvailablePromocodes().then((data) => { setPromos(data.promocodes || []); updateProfile({ pointsBalance: data.pointsBalance || 0 }); }).catch(() => setPromos([])); }, [updateProfile]);

  return <main className={`min-h-screen pb-24 pt-6 ${isDark ? "bg-black text-white" : "bg-[#f6f1ea] text-[#2f3542]"}`}>
    <Container>
      <div className="flex items-center gap-3"><FiGift className="text-4xl text-[#ff6b00]" /><div><h1 className="text-3xl font-black">Баллы и промокоды</h1><p className="opacity-60">1 балл = 1 сум скидки</p></div></div>
      <section className="mt-6 rounded-[28px] bg-[#ff6b00] p-6 text-white"><p className="text-sm opacity-80">Ваш баланс</p><b className="mt-1 block text-4xl">{(user.pointsBalance || 0).toLocaleString("ru-RU")} баллов</b><p className="mt-3 text-sm">Начисление после завершения заказа: до 100 000 — 5%, до 300 000 — 4%, свыше 300 000 — 3%.</p></section>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{promos.map((promo) => <article key={promo.code} className={`rounded-[26px] border p-5 ${isDark ? "border-white/10 bg-[#151515]" : "border-black/10 bg-white"}`}><FiTag className="text-3xl text-[#ff6b00]" /><h2 className="mt-3 text-xl font-black">{promo.title}</h2><button type="button" onClick={() => navigator.clipboard.writeText(promo.code)} className="mt-4 w-full rounded-full bg-[#fff3e8] px-4 py-3 font-black tracking-wider text-[#ff6b00]">{promo.code}</button><p className="mt-3 text-sm opacity-60">От {promo.minOrder.toLocaleString("ru-RU")} сум · максимум {promo.maxDiscount.toLocaleString("ru-RU")} сум</p></article>)}</div>
    </Container>
  </main>;
};
