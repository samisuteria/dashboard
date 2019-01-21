import express from "express";
import http from "http";
import next from "next";
import path from "path";
import socketio from "socket.io";

const port = process.env.PORT || 9000;
const dev = process.env.NODE_ENV !== "production";
const dir = path.join(__dirname, "../dist");

// Controllers
import * as apiController from "./controllers/api";
import * as socketController from "./controllers/socket";

// Next
const nextServer = next({dev, dir});
const handle = nextServer.getRequestHandler();

// Express
const expressServer = express();
expressServer.get("/api", apiController.root);

// HTTP
const httpServer = new http.Server(expressServer);

// Socket.IO
const io = socketio(httpServer);
io.on("connection", socketController.onConnection);

async function prepare() {
  await nextServer.prepare();

  expressServer.get("*", (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(port, (error: Error) => {
    if (error) { throw error; }
    console.log(`Server started on: localhost:${port}`);
    console.log(`Server in ${expressServer.get("env")} mode.`);
    console.log("Press CTRL+C to stop \n");
  });
}

export {expressServer, prepare};