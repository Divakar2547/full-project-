import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { authHelpers } from "../utils/api";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuth = authHelpers.isAuthenticated();
  const user = authHelpers.getUser();

  const handleLogout = () => { authHelpers.logout(); navigate('/Login'); };

  return (
    <>
      <header>
        <NavLink to="/">
          <img src="Img.png" alt="Vehicle Service Logo" />
        </NavLink>
        <div className="links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/About">About</NavLink>
          <NavLink to="/Product">Product</NavLink>
          <NavLink to="/Contact">Contact</NavLink>
          {isAuth ? (
            <>
              <NavLink to="/Dashboard">Dashboard</NavLink>
              <button onClick={handleLogout} style={{ background: 'none', border: '1px solid #ccc', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Logout</button>
            </>
          ) : (
            <NavLink to="/Login">Login</NavLink>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;