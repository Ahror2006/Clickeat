import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    lat: {
      type: Number,
      default: null,
    },
    lng: {
      type: Number,
      default: null,
    },
    address: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const orderItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      default: 1,
    },

    image: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    customerName: {
      type: String,
      required: true,
    },

    customerPhone: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    deliveryLocation: {
      type: locationSchema,
      default: () => ({
        lat: null,
        lng: null,
        address: "",
      }),
    },

    restaurantName: {
      type: String,
      default: "ClickEat Restaurant",
    },

    restaurantLocation: {
      type: locationSchema,
      default: () => ({
        lat: 41.311081,
        lng: 69.240562,
        address: "ClickEat Restaurant, Tashkent",
      }),
    },

    courierName: {
      type: String,
      default: "",
    },

    courierPhone: {
      type: String,
      default: "",
    },

    courierLocation: {
      type: locationSchema,
      default: () => ({
        lat: null,
        lng: null,
        address: "",
      }),
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: "Order must contain at least one item",
      },
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "card", "online"],
      default: "cash",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "cooking",
        "delivering",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },

    estimatedDeliveryTime: {
      type: String,
      default: "35-45 минут",
    },

    comment: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model("Order", orderSchema);