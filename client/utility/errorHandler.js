import socket from "../network/socket.js";

export default function initErrorHandlers() {
  window.onerror = function (message, source, lineno, colno, error) {
    socket.emit("clientError", {
      message,
      source,
      line: lineno,
      column: colno,
      stack: error?.stack,
      userAgent: navigator.userAgent,
    });
  };

  window.addEventListener("unhandledrejection", function (event) {
    socket.emit("clientError", {
      message: event.reason?.message || event.reason,
      stack: event.reason?.stack,
      userAgent: navigator.userAgent,
    });
  });
}
