export const DELIVERY_FEE = 12000;

export const PROMOCODES = [
  { code: "CLICK10", title: "Скидка 10%", type: "percent", value: 10, minOrder: 50000, maxDiscount: 30000 },
  { code: "WELCOME15", title: "Скидка 15 000 сум", type: "fixed", value: 15000, minOrder: 80000, maxDiscount: 15000 },
  { code: "BIGORDER", title: "Скидка 20%", type: "percent", value: 20, minOrder: 200000, maxDiscount: 50000 },
];

export function calculateEarnedPoints(total) {
  const rate = total <= 100000 ? 0.05 : total <= 300000 ? 0.04 : 0.03;
  return { rate, points: Math.floor(Math.max(0, total) * rate) };
}

export function calculateQuote({ items, promoCode = "", pointsToUse = 0, pointsBalance = 0 }) {
  const normalizedItems = Array.isArray(items) ? items.map((item) => ({
    name: String(item.name || "").trim(),
    price: Math.max(0, Number(item.price) || 0),
    quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)),
    image: String(item.image || ""),
  })).filter((item) => item.name && item.price > 0) : [];
  const subtotal = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? DELIVERY_FEE : 0;
  const code = String(promoCode || "").trim().toUpperCase();
  const promo = code ? PROMOCODES.find((item) => item.code === code) : null;
  if (code && !promo) throw new Error("Промокод не найден");
  if (promo && subtotal < promo.minOrder) throw new Error(`Минимальная сумма для промокода — ${promo.minOrder.toLocaleString("ru-RU")} сум`);
  const rawPromoDiscount = !promo ? 0 : promo.type === "percent" ? subtotal * promo.value / 100 : promo.value;
  const promoDiscount = Math.floor(Math.min(rawPromoDiscount, promo?.maxDiscount || rawPromoDiscount, subtotal));
  const afterPromo = subtotal + deliveryFee - promoDiscount;
  const requestedPoints = Math.max(0, Math.floor(Number(pointsToUse) || 0));
  const pointsDiscount = Math.min(requestedPoints, Math.max(0, Math.floor(pointsBalance)), afterPromo);
  const totalPrice = afterPromo - pointsDiscount;
  const earned = calculateEarnedPoints(totalPrice);
  return { items: normalizedItems, subtotal, deliveryFee, promoCode: promo?.code || "", promoDiscount, pointsDiscount, totalPrice, estimatedPoints: earned.points, earnRate: earned.rate };
}
