import { api } from "./api";

export type OrderStatus =
  | "pending"
  | "accepted"
  | "cooking"
  | "delivering"
  | "completed"
  | "cancelled";

export type CreateOrderPayload = {
  customerName: string;
  customerPhone: string;
  address: string;

  deliveryLocation?: {
    lat: number | null;
    lng: number | null;
    address: string;
  };

  restaurantName?: string;

  restaurantLocation?: {
    lat: number | null;
    lng: number | null;
    address: string;
  };

  items: any[];

  totalPrice: number;

  paymentMethod: "cash" | "card" | "online";

  comment?: string;
};

export async function createOrder(payload: CreateOrderPayload) {
  const response = await api.post("/orders", payload);

  return response.data.order;
}

export async function getMyOrders() {
  const response = await api.get("/orders/my");

  return response.data.orders;
}

export async function getOrderById(id: string) {
  const response = await api.get(`/orders/${id}`);

  return response.data.order;
}

export async function getAllOrders() {
  const response = await api.get("/orders");

  return response.data.orders;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
) {
  const response = await api.patch(`/orders/${id}/status`, {
    status,
  });

  return response.data.order;
}

export async function cancelOrder(id: string) {
  const response = await api.patch(`/orders/${id}/cancel`);
  return response.data.order;
}