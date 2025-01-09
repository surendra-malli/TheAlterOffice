// src/components/Layout/Navbar.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Import the useAuth hook

const Navbar: React.FC = () => {
  const { user } = useAuth();

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {user ? (
          <li>
            <span>{user.displayName} "hxwbbwxjj"</span> {/* Display user's name if logged in */}
          </li>
        ) : (
          <li>
            <Link to="/login">Login</Link> {/* Link to login page */}
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;