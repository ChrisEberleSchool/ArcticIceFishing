import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const users = {}; // Fake user database
const players = {};

app.post("/api/signup", (req, res) => {
  const { username, password } = req.body;
  if (users[username]) return res.status(400).json({ message: "User exists" });
  users[username] = { password };
  res.json({ username });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  if (!user || user.password !== password)
    return res.status(401).json({ message: "Invalid credentials" });
  res.json({ username });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  const username = socket.handshake.query.username || "Unknown";
  console.log(`Player connected: ${username} (${socket.id})`);

  players[socket.id] = {
    x: 250,
    y: 250,
    username,
  };

  socket.emit("currentPlayers", players);
  socket.broadcast.emit("newPlayer", {
    id: socket.id,
    ...players[socket.id],
  });

  socket.on("playerMovement", (data) => {
    if (players[socket.id]) {
      players[socket.id].x = data.x;
      players[socket.id].y = data.y;

      socket.broadcast.emit("playerMoved", {
        id: socket.id,
        x: data.x,
        y: data.y,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log(`Player disconnected: ${socket.id}`);
    delete players[socket.id];
    io.emit("playerDisconnected", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
