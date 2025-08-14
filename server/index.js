import server from "./server.js";

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  const url =
    process.env.NODE_ENV === "production"
      ? "https://arcticicefishing.onrender.com"
      : `http://localhost:${PORT}`;

  console.log(`Server running at ${url}`);
});
