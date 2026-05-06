import "../Styles/About.css";
import { Link } from "react-router-dom";

const features = [
  { icon: "🔧", title: "Expert Mechanics",    desc: "Certified professionals with 10+ years of hands-on experience." },
  { icon: "📅", title: "Easy Booking",        desc: "Schedule your service in under 2 minutes from any device." },
  { icon: "🛡️", title: "Quality Guaranteed", desc: "Only genuine parts used. Every job backed by our service warranty." },
  { icon: "🚗", title: "Pickup & Drop",       desc: "We collect and return your vehicle right from your doorstep." },
  { icon: "💬", title: "Live Updates",        desc: "Get real-time status updates on your vehicle's service progress." },
  { icon: "💰", title: "Transparent Pricing", desc: "No hidden charges. See the full cost before you confirm." },
];

const stats = [
  { number: "5000+", label: "Happy Customers" },
  { number: "50+",   label: "Service Centers"  },
  { number: "15+",   label: "Years Experience" },
  { number: "24/7",  label: "Customer Support" },
];

const steps = [
  { step: "01", title: "Book Online",      desc: "Choose your service and pick a date & time slot." },
  { step: "02", title: "We Confirm",       desc: "Get instant confirmation with mechanic details." },
  { step: "03", title: "Service Done",     desc: "Your vehicle is serviced by certified experts." },
  { step: "04", title: "Pickup & Pay",     desc: "Collect your vehicle and pay only what was quoted." },
];

const About = () => {
  return (
    <div className="about-page">

      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-inner">
          <span className="about-badge">About Us</span>
          <h1>Your Trusted Vehicle<br />Service Partner</h1>
          <p>We make vehicle maintenance simple, transparent, and stress-free — so you can focus on the road ahead.</p>
          <Link to="/BookNow" className="about-cta-btn">Book a Service</Link>
        </div>
      </section>

      {/* Stats */}
      <section className="about-stats">
        {stats.map((s, i) => (
          <div className="about-stat" key={i}>
            <span className="about-stat-number">{s.number}</span>
            <span className="about-stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* Mission */}
      <section className="about-mission">
        <div className="about-mission-text">
          <span className="about-section-tag">Our Mission</span>
          <h2>Making Car Care Effortless</h2>
          <p>
            We built this platform because vehicle maintenance shouldn't be complicated.
            Whether it's a routine oil change or a major repair, we connect you with
            trusted service centers, give you full visibility into the process, and
            ensure fair pricing — every single time.
          </p>
          <p>
            From booking to billing, everything is handled in one place so you never
            have to worry about your vehicle again.
          </p>
        </div>
        <div className="about-mission-visual">
          <div className="mission-card">🔩 <span>Routine Maintenance</span></div>
          <div className="mission-card">🛠️ <span>Repairs & Diagnostics</span></div>
          <div className="mission-card">🧹 <span>Cleaning & Detailing</span></div>
          <div className="mission-card">🔋 <span>Electrical & Battery</span></div>
        </div>
      </section>

      {/* Features */}
      <section className="about-features">
        <div className="about-section-header">
          <span className="about-section-tag">Why Choose Us</span>
          <h2>Everything You Need</h2>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="about-steps">
        <div className="about-section-header">
          <span className="about-section-tag">How It Works</span>
          <h2>Service in 4 Simple Steps</h2>
        </div>
        <div className="steps-grid">
          {steps.map((s, i) => (
            <div className="step-card" key={i}>
              <div className="step-number">{s.step}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <h2>Ready to Book Your Service?</h2>
        <p>Join thousands of happy customers who trust us with their vehicles.</p>
        <div className="about-cta-actions">
          <Link to="/BookNow" className="about-cta-btn">Book Now</Link>
          <Link to="/Contact" className="about-cta-outline">Contact Us</Link>
        </div>
      </section>

    </div>
  );
};

export default About;
