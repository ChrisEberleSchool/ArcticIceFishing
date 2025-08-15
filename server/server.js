import express from "express";
import http from "http";
import { Server } from "socket.io";
import socketConfig from "./config/socketConfig.js";
import helmet from "helmet";

const app = express();

app.enable("trust proxy");

// ✅ Force HTTPS redirect
app.use((req, res, next) => {
  if (req.secure) {
    return next();
  }
  res.redirect(`https://${req.headers.host}${req.url}`);
});

// ✅ Apply Helmet with custom HSTS
app.use(
  helmet({
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
  })
);

const server = http.createServer(app);

const io = new Server(server, { cors: { origin: "*" } });
socketConfig(io);

export default server;
