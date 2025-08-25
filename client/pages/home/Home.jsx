import { useNavigate } from "react-router-dom";
import "./Home.css";

// UI COMPONENTS
import Banner from "../../components/banner/Banner.jsx";

export default function Home() {
  const navigate = useNavigate();

  return (
    <section>
      <Banner
        title="Welcome to FishHub!"
        subtitle="I’m hooked… line and sinker."
      />
      <div className="playNow">
        <button
          className="button-74"
          role="button"
          onClick={() => navigate("/play")}
        >
          Play Now
        </button>
      </div>
    </section>
  );
}
