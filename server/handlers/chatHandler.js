export default function chatHandler(socket, io) {
  socket.on("chatMessage", ({ username, message }) => {
    if (typeof message === "string" && message.trim().length > 0) {
      const safeUsername = username?.trim().slice(0, 50) || "Unknown";
      const safeMessage = message.trim().slice(0, 200);

      console.log(`[Chat] ${safeUsername}: ${safeMessage}`);

      io.emit("chatMessage", {
        username: safeUsername,
        message: safeMessage,
      });
    }
  });
}
