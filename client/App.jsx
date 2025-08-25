import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home/Home.jsx";
import Play from "./pages/play/Play.jsx";
import About from "./pages/about/About.jsx";
import Contact from "./pages/contact/Contact.jsx";
import Updates from "./pages/updates/Updates.jsx";

import "./index.css";

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
          <Route path="/updates" element={<Updates />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}
