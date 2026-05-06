import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BookingConfirm = () => {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    numberPlate: '',
    servicePackage: '',
    serviceDate: '',
    timeSlot: '',
    pickupRequired: false,
    pickupAddress: ''
  });
  const [bookingResult, setBookingResult] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Generate booking ID
    const bookingId = 'BK' + Date.now();
    
    // Create booking result
    const booking = {
      _id: bookingId,
      ...formData,
      status: 'confirmed',
      totalAmount: getServicePrice(formData.servicePackage),
      createdAt: new Date().toISOString()
    };
    
    setBookingResult(booking);
  };

  const getServicePrice = (service) => {
    const prices = {
      'basic': 899,
      'full': 1499,
      'repair': 2499,
      'maintenance': 3999
    };
    return prices[service] || 999;
  };

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Book Vehicle Service</h1>
      
      {bookingResult ? (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#d4edda', borderRadius: '8px', textAlign: 'center' }}>
          <h2 style={{ color: '#155724' }}>🎉 Vehicle Booked Successfully!</h2>
          <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '4px', margin: '15px 0' }}>
            <h3>Booking Details:</h3>
            <p><strong>Booking ID:</strong> {bookingResult._id}</p>
            <p><strong>Vehicle:</strong> {bookingResult.brand} {bookingResult.model} ({bookingResult.numberPlate})</p>
            <p><strong>Service:</strong> {bookingResult.servicePackage}</p>
            <p><strong>Service Date:</strong> {bookingResult.serviceDate}</p>
            <p><strong>Time Slot:</strong> {bookingResult.timeSlot}</p>
            <p><strong>Status:</strong> {bookingResult.status}</p>
            <p><strong>Total Amount:</strong> ₹{bookingResult.totalAmount}</p>
            {bookingResult.pickupRequired && (
              <p><strong>Pickup Address:</strong> {bookingResult.pickupAddress}</p>
            )}
          </div>
          <button 
            onClick={() => { setBookingResult(null); }}
            style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}
          >
            Book Another Service
          </button>
          <button 
            onClick={() => navigate('/')}
            style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Go to Home
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Vehicle Brand:</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="e.g., Honda, Hyundai"
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              required
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Vehicle Model:</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="e.g., Activa 6G, i20"
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              required
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Number Plate:</label>
            <input
              type="text"
              name="numberPlate"
              value={formData.numberPlate}
              onChange={handleChange}
              placeholder="e.g., TN37AB1234"
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              required
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Service Package:</label>
            <select
              name="servicePackage"
              value={formData.servicePackage}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              required
            >
              <option value="">Select a service</option>
              <option value="basic">Basic Service - ₹899</option>
              <option value="full">Full Service - ₹1499</option>
              <option value="repair">Repair Service - ₹2499</option>
              <option value="maintenance">Premium Maintenance - ₹3999</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Service Date:</label>
            <input
              type="date"
              name="serviceDate"
              value={formData.serviceDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              required
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Time Slot:</label>
            <select
              name="timeSlot"
              value={formData.timeSlot}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              required
            >
              <option value="">Select time slot</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                name="pickupRequired"
                checked={formData.pickupRequired}
                onChange={handleChange}
                style={{ marginRight: '8px' }}
              />
              <span style={{ fontWeight: 'bold' }}>Pickup Required</span>
            </label>
          </div>

          {formData.pickupRequired && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Pickup Address:</label>
              <textarea
                name="pickupAddress"
                value={formData.pickupAddress}
                onChange={handleChange}
                placeholder="Enter pickup address"
                rows="3"
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                required={formData.pickupRequired}
              />
            </div>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Book Service
          </button>
        </form>
      )}
    </div>
  );
};

export default BookingConfirm;