import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css'; // Import CSS file

function Header() {
  const handleLogout = () => {
    // Make an API call to delete the JWT token
    fetch('http://192.168.100.67:3001/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Send the JWT token in the Authorization header
      },
    })
      .then((response) => {
        if (response.ok) {
          // If logout is successful, remove the token from local storage
          localStorage.removeItem('token');
          // Redirect to the sign-up page
          window.location.href = '/login'; // You can replace this with your actual sign-up page route
        } else {
          throw new Error('Logout failed');
        }
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  };

  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to="/recommendation">Content Recommendations </Link>
          </li>
          <li>
            <Link to="/personalrecommendation">Personal Recommendations </Link>
          </li>
          <li>
            <Link to="/anime-list">Anime Search</Link>
          </li>
          <li>
            <Link to="/profile">My Profile</Link>
          </li>
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
