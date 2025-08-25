import GameCanvas from "../../components/gameCanvas/GameCanvas.jsx";
import "./Play.css";

export default function Play() {
  return (
    <section className="playSpace">
      <div className="playSpaceContainer">
        <GameCanvas />
      </div>
    </section>
  );
}
