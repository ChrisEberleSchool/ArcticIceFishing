import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home/Home.jsx";
import Play from "./pages/Play.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import WhatsNew from "./pages/WhatsNew.jsx";

import "./styles/index.css";

// UI COMPONENTS
import Navbar from "./components/navbar/Navbar.jsx";
import Footer from "./components/footer/Footer.jsx";

export default function App() {
  return (
    <>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play" element={<Play />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/whatsnew" element={<WhatsNew />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}
