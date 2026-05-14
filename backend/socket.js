let ioInstance = null;

export function initSocket(io) {
  ioInstance = io;

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join-order-room", (orderId) => {
      socket.join(`order:${orderId}`);
      console.log(`Socket ${socket.id} joined order:${orderId}`);
    });

    socket.on("leave-order-room", (orderId) => {
      socket.leave(`order:${orderId}`);
      console.log(`Socket ${socket.id} left order:${orderId}`);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
}

export function getIO() {
  if (!ioInstance) {
    throw new Error("Socket.IO is not initialized");
  }

  return ioInstance;
}

export function emitOrderCreated(order) {
  if (!ioInstance) return;

  ioInstance.emit("order:created", order);
}

export function emitOrderStatusUpdated(order) {
  if (!ioInstance) return;

  ioInstance.emit("order:status-updated", order);
  ioInstance.to(`order:${order.id}`).emit("order:status-updated", order);
}

export function emitCourierLocationUpdated(order) {
  if (!ioInstance) return;

  ioInstance.emit("courier:location-updated", order);
  ioInstance.to(`order:${order.id}`).emit("courier:location-updated", order);
}