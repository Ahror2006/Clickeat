import express from "express";
import { Order } from "../models/Order.js";
import { protect, allowRoles } from "../middleware/auth.middleware.js";
import {
  emitOrderCreated,
  emitOrderStatusUpdated,
  emitCourierLocationUpdated,
  startCourierSimulation,
} from "../socket.js";

const router = express.Router();

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

// CLIENT: create order
router.post("/", protect, async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      address,
      deliveryLocation,
      restaurantName,
      restaurantLocation,
      items,
      totalPrice,
      paymentMethod,
      comment,
    } = req.body;

    if (!customerName || !customerPhone || !address) {
      return res.status(400).json({
        success: false,
        message: "Имя, телефон и адрес обязательны",
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Заказ должен содержать товары",
      });
    }

    const activeOrder = await Order.findOne({
      user: req.user._id,
      status: { $in: ["pending", "accepted", "cooking", "delivering"] },
    });

    if (activeOrder) {
      return res.status(400).json({
        success: false,
        message:
          "У вас уже есть активный заказ. Дождитесь завершения или отмените его.",
      });
    }

    const order = await Order.create({
      user: req.user._id,
      customerName,
      customerPhone,
      address,
      deliveryLocation: {
        lat: deliveryLocation?.lat ?? null,
        lng: deliveryLocation?.lng ?? null,
        address: deliveryLocation?.address || address,
      },
      restaurantName: restaurantName || "ClickEat Restaurant",
      restaurantLocation: {
        lat: restaurantLocation?.lat ?? 41.311081,
        lng: restaurantLocation?.lng ?? 69.240562,
        address: restaurantLocation?.address || "ClickEat Restaurant, Tashkent",
      },
      courierName: "",
      courierPhone: "",
      courierLocation: {
        lat: restaurantLocation?.lat ?? 41.311081,
        lng: restaurantLocation?.lng ?? 69.240562,
        address: "Courier is waiting near restaurant",
      },
      items,
      totalPrice,
      paymentMethod: paymentMethod || "cash",
      comment: comment || "",
      status: "pending",
    });

    const responseOrder = publicOrder(order);
    emitOrderCreated(responseOrder);

    return res.status(201).json({
      success: true,
      message: "Заказ создан",
      order: responseOrder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Ошибка создания заказа",
      error: error.message,
    });
  }
});

// CLIENT: my orders
router.get("/my", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    return res.json({
      success: true,
      orders: orders.map(publicOrder),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Ошибка загрузки заказов",
      error: error.message,
    });
  }
});

// CLIENT: cancel own order
router.patch("/:id/cancel", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Заказ не найден",
      });
    }

    const isOwner = String(order.user) === String(req.user._id);

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: "Можно отменить только свой заказ",
      });
    }

    const canCancel = ["pending", "accepted", "cooking"].includes(order.status);

    if (!canCancel) {
      return res.status(400).json({
        success: false,
        message: "Этот заказ уже нельзя отменить",
      });
    }

    order.status = "cancelled";
    await order.save();

    const responseOrder = publicOrder(order);
    emitOrderStatusUpdated(responseOrder);

    return res.json({
      success: true,
      message: "Заказ отменён",
      order: responseOrder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Ошибка отмены заказа",
      error: error.message,
    });
  }
});

// ONE ORDER
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email phone role"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Заказ не найден",
      });
    }

    const isOwner =
      String(order.user._id || order.user) === String(req.user._id);

    const isStaff = req.user.role === "admin" || req.user.role === "employee";

    if (!isOwner && !isStaff) {
      return res.status(403).json({
        success: false,
        message: "Недостаточно прав",
      });
    }

    return res.json({
      success: true,
      order: publicOrder(order),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Ошибка загрузки заказа",
      error: error.message,
    });
  }
});

// EMPLOYEE + ADMIN: all orders
router.get("/", protect, allowRoles("employee", "admin"), async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone role")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      orders: orders.map(publicOrder),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Ошибка загрузки всех заказов",
      error: error.message,
    });
  }
});

// EMPLOYEE + ADMIN: change status
router.patch(
  "/:id/status",
  protect,
  allowRoles("employee", "admin"),
  async (req, res) => {
    try {
      const { status } = req.body;

      const allowedStatuses = [
        "pending",
        "accepted",
        "cooking",
        "delivering",
        "completed",
        "cancelled",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Неверный статус заказа",
        });
      }

      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Заказ не найден",
        });
      }

      if (["completed", "cancelled"].includes(order.status)) {
        return res.status(400).json({
          success: false,
          message: "Этот заказ уже закрыт",
        });
      }

      order.status = status;
      await order.save();

      const responseOrder = publicOrder(order);
      emitOrderStatusUpdated(responseOrder);

      if (status === "delivering") {
        startCourierSimulation(order);
      }

      return res.json({
        success: true,
        message: "Статус заказа обновлён",
        order: responseOrder,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Ошибка изменения статуса",
        error: error.message,
      });
    }
  }
);

// EMPLOYEE + ADMIN: update courier location
router.patch(
  "/:id/courier-location",
  protect,
  allowRoles("employee", "admin"),
  async (req, res) => {
    try {
      const { lat, lng, address, courierName, courierPhone } = req.body;

      if (lat === undefined || lng === undefined) {
        return res.status(400).json({
          success: false,
          message: "lat и lng обязательны",
        });
      }

      const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
          courierLocation: {
            lat,
            lng,
            address: address || "",
          },
          courierName: courierName || "ClickEat Courier",
          courierPhone: courierPhone || "+998901112233",
        },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Заказ не найден",
        });
      }

      const responseOrder = publicOrder(order);
      emitCourierLocationUpdated(responseOrder);

      return res.json({
        success: true,
        message: "Локация курьера обновлена",
        order: responseOrder,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Ошибка обновления локации курьера",
        error: error.message,
      });
    }
  }
);

export default router;