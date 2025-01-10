import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles.css'; // Importing CSS for Navbar

interface NavbarProps {
  openModal: () => void; // Added prop type for openModal
}

const Navbar: React.FC<NavbarProps> = ({ openModal }) => {
  const userRole = localStorage.getItem('userRole');
  const token = localStorage.getItem('token'); // Check for token
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/'); // Redirect to login page
  };

  return (
    <nav className="navbar">
      <ul className="navbar-list">
      {!token && ( // Only show login if token doesn't exist
        <li>
          <button className="nav-login-button" onClick={openModal}>Login</button> {/* Updated to open modal */}
        </li>
      )}
        <li>
          <Link to="/latest-rss-items">Latest News</Link>
        </li>

        {(userRole === 'admin' || userRole === 'superadmin') && (
          <>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/user-manager">User Manager</Link>
            </li>
            <li>
              <Link to="/rss-streams">Streams Manager</Link>
            </li>
            <li>
              <Link to="/rss-items">Items Manager</Link>
            </li>
            <li>
              <Link to="/filter-items">Filter Manager</Link>
            </li>
          </>
        )}
        {token && ( // Only show logout if token exists
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
