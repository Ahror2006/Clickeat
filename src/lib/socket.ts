import { io } from "socket.io-client";
import { API_URL } from "../configs/api";
import { getToken } from "./auth";

export const socket = io(API_URL, {
  autoConnect: false,
  transports: ["websocket"],
  auth: (callback) => callback({ token: getToken() }),
});
