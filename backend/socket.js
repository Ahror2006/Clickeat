import { Order } from "./models/Order.js";
import { User } from "./models/User.js";
import jwt from "jsonwebtoken";

let ioInstance = null;
const activeCourierSimulations = new Map();

export function initSocket(io) {
  ioInstance = io;

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication required"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);

      if (!user || user.isBlocked) {
        return next(new Error("Authentication failed"));
      }

      socket.user = user;
      next();
    } catch {
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    if (["employee", "admin"].includes(socket.user.role)) {
      socket.join("staff");
    }

    socket.on("join-order-room", async (orderId) => {
      if (typeof orderId !== "string") return;

      const order = await Order.findById(orderId).select("user");
      const isStaff = ["employee", "admin"].includes(socket.user.role);
      const isOwner = order && String(order.user) === String(socket.user._id);

      if (isStaff || isOwner) socket.join(`order:${orderId}`);
    });

    socket.on("leave-order-room", (orderId) => {
      socket.leave(`order:${orderId}`);
    });

  });
}

export function emitOrderCreated(order) {
  if (!ioInstance) return;
  ioInstance.to("staff").emit("order:created", order);
}

export function emitOrderStatusUpdated(order) {
  if (!ioInstance) return;

  const orderId = order._id || order.id;

  if (orderId) {
    ioInstance.to(`order:${orderId}`).emit("order:status-updated", order);
  }
}

export function emitCourierLocationUpdated(order) {
  if (!ioInstance) return;

  const orderId = order._id || order.id;

  if (orderId) {
    ioInstance.to(`order:${orderId}`).emit("courier:location-updated", order);
  }
}

function publicOrder(order) {
  return {
    id: order._id.toString(),
    user: order.user,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    address: order.address,
    deliveryLocation: order.deliveryLocation,
    restaurantName: order.restaurantName,
    restaurantLocation: order.restaurantLocation,
    courierName: order.courierName,
    courierPhone: order.courierPhone,
    courierLocation: order.courierLocation,
    items: order.items,
    totalPrice: order.totalPrice,
    paymentMethod: order.paymentMethod,
    status: order.status,
    estimatedDeliveryTime: order.estimatedDeliveryTime,
    comment: order.comment,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}

export function startCourierSimulation(order) {
  if (!ioInstance || !order) return;

  const orderId = String(order._id || order.id);

  if (activeCourierSimulations.has(orderId)) {
    clearInterval(activeCourierSimulations.get(orderId));
    activeCourierSimulations.delete(orderId);
  }

  const restaurantLat = order.restaurantLocation?.lat || 41.311081;
  const restaurantLng = order.restaurantLocation?.lng || 69.240562;

  const clientLat = order.deliveryLocation?.lat || 41.315;
  const clientLng = order.deliveryLocation?.lng || 69.248;

  let step = 0;
  const maxSteps = 12;

  const interval = setInterval(async () => {
    try {
      step += 1;

      const progress = Math.min(step / maxSteps, 1);

      const lat = restaurantLat + (clientLat - restaurantLat) * progress;
      const lng = restaurantLng + (clientLng - restaurantLng) * progress;

      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        {
          courierName: "ClickEat Courier",
          courierPhone: "+998 90 111 22 33",
          courierLocation: {
            lat,
            lng,
            address: progress >= 1 ? "Courier arrived" : "Courier is on the way",
          },
        },
        { new: true }
      );

      if (!updatedOrder) {
        clearInterval(interval);
        activeCourierSimulations.delete(orderId);
        return;
      }

      emitCourierLocationUpdated(publicOrder(updatedOrder));

      if (progress >= 1) {
        clearInterval(interval);
        activeCourierSimulations.delete(orderId);
      }
    } catch (error) {
      console.log("Courier simulation error:", error.message);
      clearInterval(interval);
      activeCourierSimulations.delete(orderId);
    }
  }, 2500);

  activeCourierSimulations.set(orderId, interval);
}
