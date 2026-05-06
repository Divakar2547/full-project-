import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { bookingAPI, authHelpers } from "../utils/api";
import "../Styles/BookNow.css";

const SERVICES = [
  { id: 'basic',       name: 'Basic Service',       price: 899,  desc: 'Oil change, wash & inspection' },
  { id: 'full',        name: 'Full Service',         price: 1499, desc: 'Complete service + all filters' },
  { id: 'repair',      name: 'Repair Service',       price: 2499, desc: 'Mechanical repairs & diagnostics' },
  { id: 'maintenance', name: 'Premium Maintenance',  price: 3999, desc: 'Full maintenance package' },
];

const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

const BookNow = () => {
  const { services: dbServices } = useOutletContext() || {};
  const [formData, setFormData] = useState({
    brand: '', model: '', numberPlate: '',
    servicePackageId: '', serviceDate: '', timeSlot: '',
    pickupRequired: false, pickupAddress: ''
  });
  const [bookingResult, setBookingResult] = useState(null);
  const [savedForm, setSavedForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => { setIsAuthenticated(authHelpers.isAuthenticated()); }, []);

  const user = authHelpers.getUser();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await bookingAPI.createBooking(formData);
      setSavedForm({ ...formData });
      setBookingResult(response.booking);
    } catch (err) {
      setError(err.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setBookingResult(null);
    setSavedForm(null);
    setFormData({ brand: '', model: '', numberPlate: '', servicePackageId: '', serviceDate: '', timeSlot: '', pickupRequired: false, pickupAddress: '' });
  };

  const allServices = [
    ...SERVICES,
    ...(dbServices?.map(s => ({ id: s._id, name: s.name, price: s.price, desc: s.description })) || [])
  ];

  const selectedService = allServices.find(s => s.id === formData.servicePackageId);

  if (!isAuthenticated) {
    return (
      <div className="booknow-wrapper">
        <div className="login-required">
          <div className="lock-icon">🔒</div>
          <h2>Login Required</h2>
          <p>Please sign in to book a vehicle service appointment.</p>
          <a href="/login" className="btn-login">Sign In to Continue</a>
        </div>
      </div>
    );
  }

  if (bookingResult) {
    const f = savedForm || formData;
    return (
      <div className="booknow-wrapper">
        <div className="confirm-wrapper">
          <div className="confirm-header">
            <div className="check-icon">✓</div>
            <h2>Booking Confirmed!</h2>
            <p>Your service appointment has been scheduled.</p>
          </div>
          <div className="confirm-body">
            <div className="confirm-row">
              <span className="label">Booking ID</span>
              <span className="value" style={{ fontSize: '0.8rem', color: '#888' }}>#{bookingResult._id?.slice(-8).toUpperCase()}</span>
            </div>
            <div className="confirm-row">
              <span className="label">Vehicle</span>
              <span className="value">{f.brand} {f.model}</span>
            </div>
            <div className="confirm-row">
              <span className="label">Number Plate</span>
              <span className="value">{f.numberPlate?.toUpperCase()}</span>
            </div>
            <div className="confirm-row">
              <span className="label">Service</span>
              <span className="value">{selectedService?.name || f.servicePackageId}</span>
            </div>
            <div className="confirm-row">
              <span className="label">Date</span>
              <span className="value">{new Date(bookingResult.serviceDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="confirm-row">
              <span className="label">Time</span>
              <span className="value">{bookingResult.timeSlot}</span>
            </div>
            <div className="confirm-row">
              <span className="label">Status</span>
              <span className="value"><span className="status-pill">{bookingResult.status}</span></span>
            </div>
            <div className="confirm-row">
              <span className="label">Total Amount</span>
              <span className="value amount">₹{bookingResult.totalAmount?.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <div className="confirm-footer">
            <button className="btn-again" onClick={resetForm}>Book Another Service</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booknow-wrapper">
      <div className="booknow-header">
        <h1>Book a Service</h1>
        <p>Schedule your vehicle service in just a few steps</p>
      </div>

      <div className="user-bar">
        <div className="avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
        <span>Logged in as <strong>{user?.name || user?.email}</strong></span>
        <span className="role-badge">{user?.role || 'customer'}</span>
      </div>

      {error && <div className="alert error">⚠ {error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="booknow-card">

          {/* Vehicle Details */}
          <div className="form-section">
            <div className="section-title">
              <div className="icon">🚗</div>
              Vehicle Details
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Brand</label>
                <input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="e.g. Honda" required />
              </div>
              <div className="form-group">
                <label>Model</label>
                <input type="text" name="model" value={formData.model} onChange={handleChange} placeholder="e.g. Activa 6G" required />
              </div>
              <div className="form-group full">
                <label>Number Plate</label>
                <input type="text" name="numberPlate" value={formData.numberPlate} onChange={handleChange} placeholder="e.g. TN37AB1234" required />
              </div>
            </div>
          </div>

          {/* Service Package */}
          <div className="form-section">
            <div className="section-title">
              <div className="icon">🔧</div>
              Choose Service
            </div>
            <div className="service-cards">
              {allServices.map(svc => (
                <div
                  key={svc.id}
                  className={`service-card ${formData.servicePackageId === svc.id ? 'selected' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, servicePackageId: svc.id }))}
                >
                  <div className="svc-name">{svc.name}</div>
                  <div className="svc-price">₹{svc.price?.toLocaleString('en-IN')}</div>
                  <div className="svc-desc">{svc.desc}</div>
                </div>
              ))}
            </div>
            <input type="hidden" name="servicePackageId" value={formData.servicePackageId} required />
          </div>

          {/* Date & Time */}
          <div className="form-section">
            <div className="section-title">
              <div className="icon">📅</div>
              Date & Time
            </div>
            <div className="form-grid single">
              <div className="form-group">
                <label>Service Date</label>
                <input
                  type="date"
                  name="serviceDate"
                  value={formData.serviceDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: '14px' }}>
              <label>Time Slot</label>
              <div className="time-slots">
                {TIME_SLOTS.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    className={`time-slot-btn ${formData.timeSlot === slot ? 'selected' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, timeSlot: slot }))}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pickup */}
          <div className="form-section">
            <div className="section-title">
              <div className="icon">📍</div>
              Pickup Option
            </div>
            <label className="pickup-toggle">
              <input type="checkbox" name="pickupRequired" checked={formData.pickupRequired} onChange={handleChange} />
              <span className="toggle-track"></span>
              <span>
                <div className="toggle-label">Home Pickup</div>
                <div className="toggle-sub">We'll pick up your vehicle from your location</div>
              </span>
            </label>
            {formData.pickupRequired && (
              <div className="form-group" style={{ marginTop: '16px' }}>
                <label>Pickup Address</label>
                <textarea
                  name="pickupAddress"
                  value={formData.pickupAddress}
                  onChange={handleChange}
                  placeholder="Enter your full pickup address"
                  required
                />
              </div>
            )}
          </div>

        </div>

        {/* Summary + Submit */}
        <div className="booknow-card" style={{ marginTop: '16px' }}>
          <div className="submit-section">
            {selectedService && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '12px 16px', background: '#eef2ff', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.9rem', color: '#555' }}>
                  {selectedService.name} {formData.serviceDate && `· ${new Date(formData.serviceDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`} {formData.timeSlot && `· ${formData.timeSlot}`}
                </span>
                <span style={{ fontWeight: '800', color: '#4f46e5', fontSize: '1.05rem' }}>₹{selectedService.price?.toLocaleString('en-IN')}</span>
              </div>
            )}
            <button type="submit" className="btn-submit" disabled={loading || !formData.servicePackageId || !formData.timeSlot}>
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BookNow;
