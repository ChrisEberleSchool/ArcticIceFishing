import "./Whatsnew.css";
import Banner from "../../components/banner/Banner.jsx";

export default function WhatsNew() {
  return (
    <main id="whatsNew">
      <Banner
        title="Whats New"
        subtitle="I’m hooked… line and sinker."
        className="banner--contact"
      />
      <h1>What's New</h1>
      <p>Check out the latest updates and new features in FishHub!</p>
      <ul>
        <li>Added legendary fish species</li>
        <li>Improved multiplayer chat system</li>
        <li>New customizable gear</li>
        <li>Bug fixes and performance improvements</li>
      </ul>
    </main>
  );
}
