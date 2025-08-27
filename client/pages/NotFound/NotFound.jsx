import { Link } from "react-router-dom";
import "./NotFound.css";
import Banner from "../../components/banner/Banner.jsx";

export default function NotFound() {
  return (
    <main id="not-found">
      <Banner
        title="404"
        subtitle="Page Not Found :("
        className="banner--404"
      />
      <div className="content"></div>
    </main>
  );
}
