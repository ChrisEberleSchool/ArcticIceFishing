import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="header">
      <a href="/" className="logo">
        FishHub
      </a>

      <nav className="navbar">
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
        <a href="/whatsnew">What's New</a>
      </nav>
    </header>
  );
}
