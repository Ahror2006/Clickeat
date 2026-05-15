import { io } from "socket.io-client";

export const socket = io("https://clickeat-5wy1.onrender.com", {
  autoConnect: false,
  transports: ["websocket"],
});