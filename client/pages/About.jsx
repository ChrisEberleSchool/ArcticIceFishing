export default function About() {
  return (
    <main id="aboutPage">
      <div className="about-content">
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
          <a href="/contact">Contact</a> page.
        </p>
      </div>
    </main>
  );
}
