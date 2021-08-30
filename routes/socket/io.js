import { Server } from "socket.io";
import socketHander from "../../controllers/socket/index.js";
export const socket = (server) => {
  const socketIo = new Server()
  const io = socketIo.listen(server, { cors: true })
  // socket事件监听

  io.on('connection', (socket) => {
    const socketId = socket.id

  })
}
