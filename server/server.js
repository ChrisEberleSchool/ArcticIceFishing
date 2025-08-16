import express from "express";
import http from "http";
import { Server } from "socket.io";
import socketConfig from "./config/socketConfig.js";
import helmet from "helmet";
import path, { join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----------------------
// Init express and security
// ----------------------
const app = express();
app.enable("trust proxy");

// Force HTTPS redirect (production only)
app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production" && !req.secure) {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

// Apply Helmet with HSTS
app.use(
  helmet({
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);

// ----------------------
// Serve static files
// ----------------------
const distPath = join(__dirname, "../dist");
app.use(express.static(distPath));

// ----------------------
// Multi-page routes
// ----------------------
app.get("/", (req, res) => res.sendFile(join(distPath, "index.html")));
app.get("/about", (req, res) => res.sendFile(join(distPath, "about.html")));
app.get("/contact", (req, res) => res.sendFile(join(distPath, "contact.html")));
app.get("/whatsnew", (req, res) =>
  res.sendFile(join(distPath, "whatsnew.html"))
);

// ----------------------
// SPA fallback for unknown routes
// ----------------------
app.get("*", (req, res) => res.sendFile(join(distPath, "index.html")));

// ----------------------
// Server & Socket.IO
// ----------------------
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
socketConfig(io);

export default server;
