import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./../Styles/Home.css";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [onlineUsers, setOnlineUsers] = useState(0);
  const navigate = useNavigate();

  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      title: "Professional Car & Bike Services at Your Doorstep",
      subtitle: "Book trusted mechanics, transparent pricing & quick service"
    },
    {
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      title: "Expert Vehicle Maintenance & Repair",
      subtitle: "Certified mechanics, genuine parts & doorstep service"
    }
  ];

  const services = [
    { 
      name: "Oil Change", 
      icon: "🛢️", 
      price: "₹2,499",
      image: "https://d26qplkpp6t30l.cloudfront.net/wp-content/uploads/2019/01/22092032/oil-change-explained.jpg"
    },
    { 
      name: "Brake Service", 
      icon: "🛑", 
      price: "₹7,499",
      image: "data:image/jpeg;base64,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"
    },
    { 
      name: "Tire Service", 
      icon: "🛞", 
      price: "₹4,199",
      image: "data:image/jpeg;base64,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"
    },
    { 
      name: "Engine Repair", 
      icon: "⚙️", 
      price: "₹6,699",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIlb921LpToVSTVKZHAl3xomTUS7mgsnjVkQ&s"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    setIsVisible(true);
    
    // Real-time clock
    const clockTimer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    // Simulate online users
    const userTimer = setInterval(() => {
      setOnlineUsers(Math.floor(Math.random() * 50) + 20);
    }, 3000);
    
    return () => {
      clearInterval(clockTimer);
      clearInterval(userTimer);
    };
  }, []);

  const handleBookService = () => {
    navigate('/BookNow');
  };

  const handleServiceClick = (serviceName) => {
    alert(`Selected: ${serviceName}`);
    navigate('/Services');
  };

  return (
    <div className="home">
      <div className="real-time-bar">
        <div className="time-display">
          <span className="clock">{currentTime.toLocaleTimeString()}</span>
          <span className="date">{currentTime.toLocaleDateString()}</span>
        </div>
        <div className="live-stats">
          <span className="online-indicator">🟢 {onlineUsers} users online</span>
          <span className="status">Service Available 24/7</span>
        </div>
      </div>
      
      <div className="hero" style={{ backgroundImage: `url(${heroSlides[currentSlide].image})` }}>
        <div className={`hero-content ${isVisible ? 'fade-in' : ''}`}>
          <h1>{heroSlides[currentSlide].title}</h1>
          <p>{heroSlides[currentSlide].subtitle}</p>
          <button className="cta-button" onClick={handleBookService}>
            Book Service
          </button>
        </div>
        <div className="slide-indicators">
          {heroSlides.map((_, index) => (
            <span 
              key={index} 
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      <div className="gallery">
        <h2>Our Workshop</h2>
        <div className="gallery-grid">
          <img src="https://s3.amazonaws.com/arcb_project/2051200972/795831/thumbs/2_mo.jpg" alt="Modern Workshop" />
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAs0w7LhyrXWjcN4ewOaGrNIOa6UGa_IDKuw&s" alt="Professional Tools" />
          <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&w=400&h=200&fit=crop" alt="Car Maintenance" />
          <img src="https://images.unsplash.com/photo-1487754180451-c456f719a1fc?ixlib=rb-4.0.3&w=400&h=200&fit=crop" alt="Engine Service" />
        </div>
      </div>

      <div className="services">
        <h2>Our Services</h2>
        <div className="service-grid">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="service-item"
              onClick={() => handleServiceClick(service.name)}
            >
              <img src={service.image} alt={service.name} className="service-image" />
              <div className="service-icon">{service.icon}</div>
              <h3>{service.name}</h3>
              <p className="service-price">{service.price}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="stats">
        <div className="stat-item">
          <h3>500+</h3>
          <p>Happy Customers</p>
        </div>
        <div className="stat-item">
          <h3>50+</h3>
          <p>Expert Mechanics</p>
        </div>
        <div className="stat-item">
          <h3>24/7</h3>
          <p>Service Available</p>
        </div>
        <div className="stat-item">
          <h3>4.9★</h3>
          <p>Average Rating</p>
        </div>
      </div>

      {/* How It Works */}
      <div className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-grid">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-icon">🔍</div>
            <h3>Choose a Service</h3>
            <p>Browse our service packages and pick what your vehicle needs.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-icon">📅</div>
            <h3>Pick a Date & Time</h3>
            <p>Select a convenient slot from our available schedule.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-icon">🚗</div>
            <h3>Drop Your Vehicle</h3>
            <p>Bring your vehicle to our service center at the booked time.</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-icon">✅</div>
            <h3>Pick It Up Ready</h3>
            <p>Get notified when done. Drive away with a serviced vehicle.</p>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="why-us">
        <h2>Why Choose Us</h2>
        <div className="why-grid">
          <div className="why-item">
            <span>🔧</span>
            <h3>Certified Mechanics</h3>
            <p>All our technicians are trained and certified with 5+ years of experience.</p>
          </div>
          <div className="why-item">
            <span>💰</span>
            <h3>Transparent Pricing</h3>
            <p>No hidden charges. You see the full price before confirming your booking.</p>
          </div>
          <div className="why-item">
            <span>🛡️</span>
            <h3>Genuine Parts</h3>
            <p>We use only OEM and manufacturer-approved parts for all repairs.</p>
          </div>
          <div className="why-item">
            <span>⏱️</span>
            <h3>On-Time Delivery</h3>
            <p>We respect your time. 95% of our services are completed on schedule.</p>
          </div>
          <div className="why-item">
            <span>📋</span>
            <h3>Service History</h3>
            <p>Track all past and upcoming services for every vehicle you register.</p>
          </div>
          <div className="why-item">
            <span>📞</span>
            <h3>24/7 Support</h3>
            <p>Our support team is always available to assist you anytime.</p>
          </div>
        </div>
      </div>

      {/* Service Hours & Location */}
      <div className="info-section">
        <div className="info-card">
          <h3>🕐 Service Hours</h3>
          <table className="hours-table">
            <tbody>
              <tr><td>Monday – Friday</td><td>8:00 AM – 8:00 PM</td></tr>
              <tr><td>Saturday</td><td>9:00 AM – 6:00 PM</td></tr>
              <tr><td>Sunday</td><td>10:00 AM – 4:00 PM</td></tr>
              <tr className="highlight"><td>Emergency</td><td>24/7 Available</td></tr>
            </tbody>
          </table>
        </div>
        <div className="info-card">
          <h3>📍 Find Us</h3>
          <p>123 Anna Nager Street, Chennai – 600040</p>
          <p>📞 +91 98765 43210</p>
          <p>✉️ contact@vehicleservice.com</p>
          <div className="map-placeholder">
            <span>🗺️ View on Google Maps</span>
          </div>
        </div>
        <div className="info-card">
          <h3>🚘 Vehicles We Service</h3>
          <ul className="vehicle-list">
            <li>🚗 Hatchbacks & Sedans</li>
            <li>🚙 SUVs & MUVs</li>
            <li>🏍️ Motorcycles & Scooters</li>
            <li>🚐 Vans & Minibuses</li>
            <li>🚚 Light Commercial Vehicles</li>
          </ul>
        </div>
      </div>

      {/* Quick Book Banner */}
      <div className="quick-book-banner">
        <div className="banner-text">
          <h2>Ready to Book Your Service?</h2>
          <p>Join 500+ satisfied customers. Book in under 2 minutes.</p>
        </div>
        <button className="cta-button" onClick={handleBookService}>Book Now →</button>
      </div>

    </div>
  );
};
export default Home;