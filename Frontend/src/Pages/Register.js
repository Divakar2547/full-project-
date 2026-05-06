import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI, authHelpers } from "../utils/api";

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.register(formData);
      authHelpers.setToken(response.token);
      authHelpers.setUser(response.user);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <form className="loginForm" onSubmit={handleSubmit}>
        <h2>Register</h2>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        
        <label>Name</label>
        <input 
          type="text" 
          name="name"
          placeholder="Full Name" 
          value={formData.name}
          onChange={handleChange}
          required 
        />
        
        <label>Email</label>
        <input 
          type="email" 
          name="email"
          placeholder="Email" 
          value={formData.email}
          onChange={handleChange}
          required 
        />
        
        <label>Password</label>
        <input 
          type="password" 
          name="password"
          placeholder="Password (min 6 characters)" 
          value={formData.password}
          onChange={handleChange}
          minLength="6"
          required 
        />
        
        <label>Phone</label>
        <input 
          type="tel" 
          name="phone"
          placeholder="Phone Number" 
          value={formData.phone}
          onChange={handleChange}
          required 
        />
        
        <label>Address</label>
        <input 
          type="text" 
          name="address"
          placeholder="Address (Optional)" 
          value={formData.address}
          onChange={handleChange}
        />
        
        <button className="loginButton" type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
        
        <p style={{ marginTop: '15px', textAlign: 'center' }}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;