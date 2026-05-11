export type UsedPromo = {
  code: string;
  usedAt: string;
  orderId: string;
  discount: number;
};

const USED_PROMOS_KEY = "usedPromocodes";

export function getUsedPromos(): UsedPromo[] {
  try {
    const raw = localStorage.getItem(USED_PROMOS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveUsedPromos(promos: UsedPromo[]) {
  localStorage.setItem(USED_PROMOS_KEY, JSON.stringify(promos));
}

export function isPromoUsed(code: string): boolean {
  const promos = getUsedPromos();
  return promos.some((item) => item.code.toUpperCase() === code.toUpperCase());
}

export function addUsedPromo(promo: UsedPromo) {
  const promos = getUsedPromos();
  promos.unshift(promo);
  saveUsedPromos(promos);
}