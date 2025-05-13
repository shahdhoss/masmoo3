import { io } from "socket.io-client";

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io("https://key-gertrudis-alhusseain-8243cb58.koyeb.app", {
      autoConnect: false,
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
