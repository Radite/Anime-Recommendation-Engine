import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import '../styles/LoginPage.css'; // Import CSS file for LoginPage styles

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add code to submit login data to backend
    console.log(formData);
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
      
      {/* Forgot Password Link */}
      <Link to="/forgotpassword" className="forgot-password-link">Forgot Password?</Link>
    </div>
  );
}

export default LoginPage;
