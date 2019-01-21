import * as SocketServer from "socket.io";

function randomInt(max: number, min: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

function update(socket: SocketServer.Socket): NodeJS.Timeout {
  return setInterval(() => {
    const value = randomInt(80, 100);
    socket.emit("update", value);
  }, 100);
}

function onDisconnect(interval: NodeJS.Timeout) {
  console.log("disconnect");
  clearInterval(interval);
}

export let onConnection = (socket: SocketServer.Socket) => {
  console.info(`new connection on socket ${socket.handshake.address}`);
  const interval = update(socket);
  socket.on("disconnect", () => {
    onDisconnect(interval);
  });
};