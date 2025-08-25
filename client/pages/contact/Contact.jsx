import { useState } from "react";
import emailjs from "emailjs-com";
import "./Contact.css";
import Banner from "../../components/banner/Banner.jsx";

emailjs.init("jQX2Vwa52uH3luip1");

export default function Contact() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send("service_8crcafy", "template_pwcq6hs", {
        from_name: name,
        message,
        subject: "[FISHHUB CONTACT]",
      })
      .then(() => {
        setFeedback("✅ Message sent successfully!");
        setName("");
        setMessage("");
      })
      .catch((err) => {
        setFeedback("❌ Failed to send: " + JSON.stringify(err));
      })
      .finally(() => setLoading(false));
  }

  return (
    <section className="contact-page">
      <Banner
        title="Contact Us"
        subtitle="The fishing was good, but the catching sucked."
        className="banner--contact"
      />

      <div className="contact-form-wrapper">
        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            <textarea
              placeholder="Write your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </label>

          <button type="submit" disabled={loading || message.length < 3}>
            {loading ? "Sending..." : "Send"}
          </button>

          {feedback && <p className="feedback">{feedback}</p>}
        </form>
      </div>
    </section>
  );
}
