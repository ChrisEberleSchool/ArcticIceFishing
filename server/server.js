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
// Init express and create security paramaters
// ----------------------
const app = express();

app.enable("trust proxy");

// Force HTTPS redirect (only in production)
app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production" && !req.secure) {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});
// Apply Helmet with custom HSTS
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
// Using Express below to serve static web pages with clean urls
// ----------------------

// Serve static frontend files (dist folder from Vite build)
const distPath = join(__dirname, "../dist");
app.use(express.static(distPath));

/*
 * SPA fallbacks
 * so when a user types in a url that doesnt exist it reroutes user back to the homepage index.html
 */
app.get(/.*/, (req, res) => {
  console.log("REROUTING TO /index.html");
  try {
    res.sendFile(join(distPath, "index.html"));
  } catch (err) {
    console.error("Error sending index.html:", err);
  }
});

// ----------------------
// Server creation
// ----------------------

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
socketConfig(io);

export default server;
