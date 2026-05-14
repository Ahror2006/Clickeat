export type CartItem = {
  id: number | string;
  title: string;
  image?: string;
  price: number;
  quantity: number;
  restaurant?: string;
  description?: string;
};

const CART_KEY = "cart";

export function getCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
}


export function addToCart(item: Omit<CartItem, "quantity">) {
  const cart = getCart();
  const id = String(item.id);

  const updated = cart.some((cartItem) => String(cartItem.id) === id)
    ? cart.map((cartItem) =>
      String(cartItem.id) === id
        ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 }
        : cartItem
    )
    : [...cart, { ...item, id, quantity: 1 }];

  saveCart(updated);
  return updated;
}

export function removeFromCart(id: number | string) {
  const updated = getCart().filter((item) => String(item.id) !== String(id));
  saveCart(updated);
  return updated;
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event("cart-updated"));
}

export function getCartCount() {
  return getCart().reduce((sum, item) => sum + (item.quantity || 0), 0);
}