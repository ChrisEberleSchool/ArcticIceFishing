import express from "express";
import http from "http";
import { Server } from "socket.io";
import socketConfig from "./config/socketConfig.js";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.enable("trust proxy");

// ✅ Force HTTPS redirect (only in production)
app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production" && !req.secure) {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

// ✅ Apply Helmet with custom HSTS
app.use(
  helmet({
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);

// ✅ Serve static frontend files (dist folder from Vite build)
const distPath = path.join(__dirname, "../dist");
app.use(express.static(distPath));

// ✅ Handle direct page refresh (for routes like /about.html, /contact.html)
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const server = http.createServer(app);

const io = new Server(server, { cors: { origin: "*" } });
socketConfig(io);

export default server;
