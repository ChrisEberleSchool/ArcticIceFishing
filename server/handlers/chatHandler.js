export default function chatHandler(socket, io) {
  socket.on("chatMessage", ({ username, message, color }) => {
    if (typeof message === "string" && message.trim().length > 0) {
      const safeUsername = username?.trim().slice(0, 50) || "Unknown";
      const safeMessage = message.trim().slice(0, 200);
      const safeColor = color || "white";

      console.log(`[Chat] ${safeUsername}: ${safeMessage}`);

      io.emit("chatMessage", {
        username: safeUsername,
        message: safeMessage,
        color: safeColor,
      });
    }
  });

  // Listen for requests from the client to send a server message
  socket.on("serverMessageRequest", ({ message, color }) => {
    if (typeof message === "string" && message.trim().length > 0) {
      sendServerMessage(io, message.trim().slice(0, 200), color);
    } else {
      console.log("Failed to process server Message");
    }
  });
}

export function sendServerMessage(io, message, color) {
  io.emit("chatMessage", {
    username: "[Server] ",
    message,
    color,
  });
}
