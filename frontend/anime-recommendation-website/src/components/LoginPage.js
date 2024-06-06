import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate from react-router-dom
import axios from 'axios'; // Import Axios for making HTTP requests
import '../styles/LoginPage.css'; // Import CSS file for LoginPage styles

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Initialize navigate

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send login request to backend
      const response = await axios.post('http://localhost:3001/api/auth/login', formData);
      // Store token and navigate to home page or dashboard
      localStorage.setItem('token', response.data.token);
      setErrorMessage('');
      navigate('/recommendation'); // Adjust the path to your home page or dashboard
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error during login');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required />

        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} required />

        <div className="button-container">
          <button type="submit" className="login-button">Login</button>
          <Link to="/signup" className="signup-button">Sign Up</Link>
        </div>
      </form>
      
      {/* Error Message Display */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* Forgot Password Link */}
      <Link to="/forgotpassword" className="forgot-password-link">Forgot Password?</Link>
    </div>
  );
}

export default LoginPage;
