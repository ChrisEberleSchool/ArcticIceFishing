import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="header">
      <a href="/" className="logo">
        FishHub
      </a>

      <nav className="navbar">
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/whatsnew">What's New</Link>
      </nav>
    </header>
  );
}
