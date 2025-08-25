import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar/Navbar.jsx";
import Footer from "./components/footer/Footer.jsx";

import "./index.css";

export default function App() {
  return (
    <>
      <Navbar />

      <main>
        <Outlet /> {/* <- child pages will render here */}
      </main>

      <Footer />
    </>
  );
}
