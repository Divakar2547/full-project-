import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authHelpers, bookingAPI, authAPI } from "../utils/api";
import "../Styles/Dashboard.css";

const SERVICE_NAMES = { basic: 'Basic Service', full: 'Full Service', repair: 'Repair Service', maintenance: 'Premium Maintenance' };
const STATUS_COLOR  = { confirmed: 'green', pending: 'orange', 'in-progress': 'blue', completed: 'teal', cancelled: 'red' };

const Dashboard = () => {
  const navigate  = useNavigate();
  const user      = authHelpers.getUser();
  const [bookings, setBookings]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [activeTab, setActiveTab]   = useState('overview');
  const [profile, setProfile]       = useState({ name: user?.name || '', email: user?.email || '', phone: '', address: '' });
  const [editMode, setEditMode]     = useState(false);
  const [saveMsg, setSaveMsg]       = useState('');

  useEffect(() => {
    if (!authHelpers.isAuthenticated()) { navigate('/Login'); return; }
    bookingAPI.getBookings()
      .then(data => setBookings(Array.isArray(data) ? data : []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
    authAPI.getProfile()
      .then(data => setProfile({ name: data.name || '', email: data.email || '', phone: data.phone || '', address: data.address || '' }))
      .catch(() => {});
  }, [navigate]);

  const handleLogout = () => { authHelpers.logout(); navigate('/Login'); };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    authHelpers.setUser({ ...user, name: profile.name, email: profile.email });
    setSaveMsg('Profile updated successfully!');
    setEditMode(false);
    setTimeout(() => setSaveMsg(''), 3000);
  };

  const stats = {
    total:     bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    pending:   bookings.filter(b => b.status === 'pending').length,
    spent:     bookings.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + (b.totalAmount || 0), 0),
  };

  const recentBookings = [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  const serviceName = (id) => SERVICE_NAMES[id] || (typeof id === 'object' ? id?.name : id) || 'Service';
  const formatDate  = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  if (!authHelpers.isAuthenticated()) return null;

  return (
    <div className="dash-page">

      {/* ── Sidebar ── */}
      <aside className="dash-sidebar">
        <div className="dash-profile-box">
          <div className="dash-avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
          <div className="dash-profile-name">{user?.name || 'User'}</div>
          <div className="dash-profile-email">{user?.email}</div>
          <span className="dash-role-badge">{user?.role || 'customer'}</span>
        </div>

        <nav className="dash-nav">
          {[
            { id: 'overview',  icon: '📊', label: 'Overview'      },
            { id: 'bookings',  icon: '📅', label: 'My Bookings'   },
            { id: 'profile',   icon: '👤', label: 'Profile'       },
            { id: 'settings',  icon: '⚙️', label: 'Settings'      },
          ].map(item => (
            <button
              key={item.id}
              className={`dash-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>

        <div className="dash-sidebar-links">
          <Link to="/BookNow" className="dash-quick-link">🔧 Book a Service</Link>
          <Link to="/Product" className="dash-quick-link">🛒 Shop Parts</Link>
          <button className="dash-logout-btn" onClick={handleLogout}>🚪 Logout</button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="dash-main">

        {/* ── Overview Tab ── */}
        {activeTab === 'overview' && (
          <div>
            <div className="dash-section-header">
              <h2>Welcome back, {user?.name?.split(' ')[0]} 👋</h2>
              <p>Here's a summary of your account activity</p>
            </div>

            {/* Stats */}
            <div className="dash-stats">
              <div className="dash-stat-card">
                <div className="dash-stat-icon" style={{ background: '#eef2ff', color: '#4f46e5' }}>📅</div>
                <div><div className="dash-stat-num">{stats.total}</div><div className="dash-stat-label">Total Bookings</div></div>
              </div>
              <div className="dash-stat-card">
                <div className="dash-stat-icon" style={{ background: '#dcfce7', color: '#16a34a' }}>✅</div>
                <div><div className="dash-stat-num">{stats.completed}</div><div className="dash-stat-label">Completed</div></div>
              </div>
              <div className="dash-stat-card">
                <div className="dash-stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>⏳</div>
                <div><div className="dash-stat-num">{stats.pending + stats.confirmed}</div><div className="dash-stat-label">Upcoming</div></div>
              </div>
              <div className="dash-stat-card">
                <div className="dash-stat-icon" style={{ background: '#f0fdf4', color: '#15803d' }}>💰</div>
                <div><div className="dash-stat-num">₹{stats.spent.toLocaleString('en-IN')}</div><div className="dash-stat-label">Total Spent</div></div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="dash-section-title">Quick Actions</div>
            <div className="dash-actions">
              <Link to="/BookNow" className="dash-action-card">
                <span>🔧</span><strong>Book Service</strong><p>Schedule a new vehicle service</p>
              </Link>
              <Link to="/Services" className="dash-action-card">
                <span>📋</span><strong>View Services</strong><p>Browse available service packages</p>
              </Link>
              <Link to="/Product" className="dash-action-card">
                <span>🛒</span><strong>Shop Parts</strong><p>Buy genuine vehicle parts</p>
              </Link>
              <Link to="/Contact" className="dash-action-card">
                <span>💬</span><strong>Get Support</strong><p>Contact our service team</p>
              </Link>
            </div>

            {/* Recent Bookings */}
            <div className="dash-section-title" style={{ marginTop: 28 }}>Recent Bookings</div>
            {loading ? (
              <div className="dash-loading">Loading bookings...</div>
            ) : recentBookings.length === 0 ? (
              <div className="dash-empty">
                <span>📅</span>
                <p>No bookings yet. <Link to="/BookNow">Book your first service →</Link></p>
              </div>
            ) : (
              <div className="dash-table-wrap">
                <table className="dash-table">
                  <thead>
                    <tr><th>Service</th><th>Date</th><th>Time</th><th>Amount</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {recentBookings.map(b => (
                      <tr key={b._id}>
                        <td>{serviceName(b.servicePackageId)}</td>
                        <td>{formatDate(b.serviceDate)}</td>
                        <td>{b.timeSlot || '—'}</td>
                        <td>₹{(b.totalAmount || 0).toLocaleString('en-IN')}</td>
                        <td><span className={`dash-status ${STATUS_COLOR[b.status] || 'grey'}`}>{b.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {bookings.length > 5 && (
                  <button className="dash-view-all" onClick={() => setActiveTab('bookings')}>View all {bookings.length} bookings →</button>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Bookings Tab ── */}
        {activeTab === 'bookings' && (
          <div>
            <div className="dash-section-header">
              <h2>My Bookings</h2>
              <Link to="/BookNow" className="dash-btn-primary">+ New Booking</Link>
            </div>

            {/* Filter pills */}
            <div className="dash-filter-row">
              {['all', 'confirmed', 'pending', 'completed', 'cancelled'].map(s => (
                <BookingFilter key={s} label={s} bookings={bookings} />
              ))}
            </div>

            {loading ? (
              <div className="dash-loading">Loading...</div>
            ) : bookings.length === 0 ? (
              <div className="dash-empty">
                <span>📅</span>
                <p>No bookings found. <Link to="/BookNow">Book a service →</Link></p>
              </div>
            ) : (
              <div className="dash-booking-cards">
                {[...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(b => (
                  <div className="dash-booking-card" key={b._id}>
                    <div className="dbc-left">
                      <div className="dbc-service">{serviceName(b.servicePackageId)}</div>
                      <div className="dbc-id">ID: #{b._id?.slice(-8).toUpperCase()}</div>
                    </div>
                    <div className="dbc-mid">
                      <div className="dbc-info"><span>📅</span> {formatDate(b.serviceDate)}</div>
                      <div className="dbc-info"><span>🕐</span> {b.timeSlot || '—'}</div>
                      {b.pickupRequired && <div className="dbc-info"><span>📍</span> Pickup requested</div>}
                    </div>
                    <div className="dbc-right">
                      <div className="dbc-amount">₹{(b.totalAmount || 0).toLocaleString('en-IN')}</div>
                      <span className={`dash-status ${STATUS_COLOR[b.status] || 'grey'}`}>{b.status}</span>
                      <span className={`dash-pay-status ${b.paymentStatus === 'paid' ? 'paid' : 'unpaid'}`}>{b.paymentStatus || 'pending'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Profile Tab ── */}
        {activeTab === 'profile' && (
          <div>
            <div className="dash-section-header">
              <h2>My Profile</h2>
              {!editMode && <button className="dash-btn-primary" onClick={() => setEditMode(true)}>✏️ Edit Profile</button>}
            </div>

            {saveMsg && <div className="dash-alert success">{saveMsg}</div>}

            <div className="dash-profile-card">
              <div className="dash-profile-avatar-lg">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
              <div className="dash-profile-info">
                <div className="dash-profile-name-lg">{user?.name}</div>
                <div className="dash-profile-role">{user?.role || 'Customer'}</div>
              </div>
            </div>

            <form className="dash-form" onSubmit={handleSaveProfile}>
              <div className="dash-form-grid">
                <div className="dash-form-group">
                  <label>Full Name</label>
                  <input type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} disabled={!editMode} required />
                </div>
                <div className="dash-form-group">
                  <label>Email Address</label>
                  <input type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} disabled={!editMode} required />
                </div>
                <div className="dash-form-group">
                  <label>Phone Number</label>
                  <input type="tel" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} disabled={!editMode} placeholder="Enter phone number" />
                </div>
                <div className="dash-form-group">
                  <label>Address</label>
                  <input type="text" value={profile.address} onChange={e => setProfile({ ...profile, address: e.target.value })} disabled={!editMode} placeholder="Enter address" />
                </div>
              </div>
              {editMode && (
                <div className="dash-form-actions">
                  <button type="submit" className="dash-btn-primary">Save Changes</button>
                  <button type="button" className="dash-btn-outline" onClick={() => setEditMode(false)}>Cancel</button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* ── Settings Tab ── */}
        {activeTab === 'settings' && (
          <div>
            <div className="dash-section-header">
              <h2>Settings</h2>
            </div>

            <div className="dash-settings-list">
              <div className="dash-settings-item">
                <div>
                  <div className="dash-settings-title">Email Notifications</div>
                  <div className="dash-settings-desc">Receive booking confirmations and updates via email</div>
                </div>
                <label className="dash-toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="dash-toggle-track"></span>
                </label>
              </div>
              <div className="dash-settings-item">
                <div>
                  <div className="dash-settings-title">SMS Alerts</div>
                  <div className="dash-settings-desc">Get SMS reminders for upcoming service appointments</div>
                </div>
                <label className="dash-toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="dash-toggle-track"></span>
                </label>
              </div>
              <div className="dash-settings-item">
                <div>
                  <div className="dash-settings-title">Promotional Offers</div>
                  <div className="dash-settings-desc">Receive discount offers and seasonal promotions</div>
                </div>
                <label className="dash-toggle">
                  <input type="checkbox" />
                  <span className="dash-toggle-track"></span>
                </label>
              </div>
            </div>

            <div className="dash-danger-zone">
              <div className="dash-settings-title" style={{ color: '#dc2626', marginBottom: 8 }}>Danger Zone</div>
              <button className="dash-btn-danger" onClick={handleLogout}>Logout from all devices</button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

// Small helper component for booking filter pills (display only)
const BookingFilter = ({ label, bookings }) => {
  const count = label === 'all' ? bookings.length : bookings.filter(b => b.status === label).length;
  return (
    <span className="dash-filter-pill">
      {label.charAt(0).toUpperCase() + label.slice(1)} <span className="dash-filter-count">{count}</span>
    </span>
  );
};

export default Dashboard;
