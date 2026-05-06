import { useState } from "react";
import { contactAPI } from "../utils/api";
import "./../Styles/Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await contactAPI.submitContact(formData);
      setSuccess(response.message);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setError(err.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact">
      <div className="contact-card">
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p className="contact-subtitle">We're here to help. Reach out anytime.</p>
          <div className="contact-details">
            <div className="contact-detail-item">
              <span className="contact-icon">📍</span>
              <span>123 Anna Nager Street, City</span>
            </div>
            <div className="contact-detail-item">
              <span className="contact-icon">📞</span>
              <span>+91 98765 43210</span>
            </div>
            <div className="contact-detail-item">
              <span className="contact-icon">✉️</span>
              <span>contact@vehicleservice.com</span>
            </div>
            <div className="contact-detail-item">
              <span className="contact-icon">🕐</span>
              <span>Mon – Sat, 9 AM – 6 PM</span>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <h3>Send a Message</h3>
          {success && <div className="contact-success">✅ {success}</div>}
          {error && <div className="contact-error">⚠️ {error}</div>}
          <div className="contact-field">
            <label>Your Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="contact-field">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="contact-field">
            <label>Message</label>
            <textarea
              name="message"
              placeholder="How can we help you?"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;