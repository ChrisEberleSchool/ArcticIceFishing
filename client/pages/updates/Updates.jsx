import "./Updates.css";
import Banner from "../../components/banner/Banner.jsx";

export default function Updates() {
  return (
    <main id="updates">
      <Banner
        title="Updates"
        subtitle="Good things come to those who bait."
        className="banner--contact"
      />

      <h1>Coming Soon</h1>
      <ul>
        <li>New purchasable items in the shop.</li>
        <li>Additional maps to explore.</li>
        <li>Rivers with unique fishing spots.</li>
        <li>Improved fishing mechanics and mini-games.</li>
      </ul>

      <h1>Latest Updates</h1>
      <ul>
        <li>Introduced 16 new fish species.</li>
        <li>Implemented the in-game shop UI.</li>
        <li>Added a persistent global leaderboard.</li>
        <li>General bug fixes and performance enhancements.</li>
      </ul>
    </main>
  );
}
