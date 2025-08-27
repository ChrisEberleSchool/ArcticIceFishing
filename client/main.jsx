import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.jsx";
import Home from "./pages/home/Home.jsx";
import Play from "./pages/play/Play.jsx";
import About from "./pages/about/About.jsx";
import Contact from "./pages/contact/Contact.jsx";
import Updates from "./pages/updates/Updates.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // layout
    children: [
      { index: true, element: <Home /> }, // homepage
      { path: "play", element: <Play /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "updates", element: <Updates /> },
      { path: "*", element: <NotFound /> }, // 404 page
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
