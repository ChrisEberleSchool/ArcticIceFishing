import express from "express";
import http from "http";
import { Server } from "socket.io";
import socketConfig from "./config/socketConfig.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, { cors: { origin: "*" } });
socketConfig(io); // pass io to your socket setup

export default server;
