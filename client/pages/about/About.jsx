import { Link } from "react-router-dom";
import "./About.css";
import Banner from "../../components/banner/Banner.jsx";

export default function About() {
  return (
    <main id="about">
      <Banner
        title="About FishHub"
        subtitle="Good things come to those who bait."
        className="banner--about"
      />
      <div className="content">
        <h1>About Fish Hub</h1>
        <p>An online fishing game</p>

        <h2>Features</h2>
        <ul>
          <li>
            Catch a variety of fish including common, uncommon,
            <br />
            rare and legendary species
          </li>
          <li>Customizable fishing gear and tackle boxes</li>
          <li>Multiplayer interactions and chat</li>
        </ul>

        <h2>Contact & Support</h2>
        <p>
          For questions, feedback, or support, please visit our{" "}
          <Link to="/contact">Contact</Link> page.
        </p>
      </div>
    </main>
  );
}
