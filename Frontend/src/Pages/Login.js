import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI, authHelpers } from "../utils/api";
import "./../Styles/Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
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
      const response = await authAPI.login(formData);
      authHelpers.setToken(response.token);
      authHelpers.setUser(response.user);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <form className="loginForm" onSubmit={handleSubmit}>
        <h2>Welcome Back</h2>
        {error && <div className="login-error">{error}</div>}
        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          autoComplete="current-password"
          required
        />
        <button className="loginButton" type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <hr className="login-divider" />
        <p className="login-footer">
          Don't have an account? <Link to="/Register">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;