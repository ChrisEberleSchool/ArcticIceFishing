import { Link } from "react-router-dom";
import "./Banner.css";

export default function Banner({
  title,
  subtitle,
  className = "",
  style = {},
}) {
  return (
    <div className={`banner ${className}`} style={style}>
      <h1 className="banner__title">{title}</h1>
      {subtitle && <p className="banner__subtitle">{subtitle}</p>}
    </div>
  );
}
