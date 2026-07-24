import express from "express";
import { Order } from "../models/Order.js";
import { User } from "../models/User.js";
import { calculateEarnedPoints, calculateQuote, PROMOCODES } from "../lib/loyalty.js";
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
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    promoCode: order.promoCode,
    promoDiscount: order.promoDiscount,
    pointsUsed: order.pointsUsed,
    pointsEarned: order.pointsEarned,
    paymentMethod: order.paymentMethod,
    status: order.status,
    estimatedDeliveryTime: order.estimatedDeliveryTime,
    comment: order.comment,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}

router.get("/promocodes/available", protect, (req, res) => res.json({ success: true, pointsBalance: req.user.pointsBalance || 0, promocodes: PROMOCODES }));

router.post("/quote", protect, (req, res) => {
  try {
    return res.json({ success: true, quote: calculateQuote({ ...req.body, pointsBalance: req.user.pointsBalance || 0 }) });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

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
      promoCode,
      pointsToUse,
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

    const quote = calculateQuote({ items, promoCode, pointsToUse, pointsBalance: req.user.pointsBalance || 0 });
    if (!quote.items.length) return res.status(400).json({ success: false, message: "В заказе нет корректных товаров" });

    let chargedPoints = 0;
    if (quote.pointsDiscount > 0) {
      const updated = await User.findOneAndUpdate(
        { _id: req.user._id, pointsBalance: { $gte: quote.pointsDiscount } },
        { $inc: { pointsBalance: -quote.pointsDiscount } },
        { new: true }
      );
      if (!updated) return res.status(409).json({ success: false, message: "Баланс баллов изменился. Пересчитайте заказ." });
      chargedPoints = quote.pointsDiscount;
    }

    let order;
    try { order = await Order.create({
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
      items: quote.items,
      subtotal: quote.subtotal,
      deliveryFee: quote.deliveryFee,
      promoCode: quote.promoCode,
      promoDiscount: quote.promoDiscount,
      pointsUsed: quote.pointsDiscount,
      totalPrice: quote.totalPrice,
      paymentMethod: paymentMethod || "cash",
      comment: comment || "",
      status: "pending",
    }); } catch (error) {
      if (chargedPoints) await User.findByIdAndUpdate(req.user._id, { $inc: { pointsBalance: chargedPoints } });
      throw error;
    }

    const responseOrder = publicOrder(order);
    emitOrderCreated(responseOrder);

    return res.status(201).json({
      success: true,
      message: "Заказ создан",
      order: responseOrder,
      pointsBalance: Math.max(0, (req.user.pointsBalance || 0) - chargedPoints),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Ошибка создания заказа",
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
    if (order.pointsUsed > 0 && !order.pointsRefunded) {
      const claimed = await Order.updateOne({ _id: order._id, pointsRefunded: false }, { $set: { pointsRefunded: true } });
      if (claimed.modifiedCount) await User.findByIdAndUpdate(order.user, { $inc: { pointsBalance: order.pointsUsed } });
      order.pointsRefunded = true;
    }
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
      if (status === "cancelled" && order.pointsUsed > 0 && !order.pointsRefunded) {
        const claimed = await Order.updateOne({ _id: order._id, pointsRefunded: false }, { $set: { pointsRefunded: true } });
        if (claimed.modifiedCount) await User.findByIdAndUpdate(order.user, { $inc: { pointsBalance: order.pointsUsed } });
        order.pointsRefunded = true;
      }
      if (status === "completed" && !order.loyaltyCredited) {
        const earned = calculateEarnedPoints(order.totalPrice);
        order.pointsEarned = earned.points;
        order.loyaltyCredited = true;
        const claimed = await Order.updateOne({ _id: order._id, loyaltyCredited: false }, { $set: { loyaltyCredited: true, pointsEarned: earned.points } });
        if (claimed.modifiedCount && earned.points > 0) await User.findByIdAndUpdate(order.user, { $inc: { pointsBalance: earned.points } });
      }
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
      });
    }
  }
);

export default router;
