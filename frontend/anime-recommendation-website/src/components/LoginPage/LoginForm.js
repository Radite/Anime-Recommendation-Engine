import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import handleInputChange from '../../utils/loginInputChange';
import handleSubmit from '../../utils/loginSubmit';

function LoginForm({ navigate }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errorMessage, setErrorMessage] = useState('');

  const onInputChange = (e) => handleInputChange(e, formData, setFormData);

  const onFormSubmit = (e) => handleSubmit(e, formData, setErrorMessage, navigate);

  return (
    <form className="login-form" onSubmit={onFormSubmit}>
      <label htmlFor="email">Email:</label>
      <input type="email" id="email" name="email" value={formData.email} onChange={onInputChange} required />

      <label htmlFor="password">Password:</label>
      <input type="password" id="password" name="password" value={formData.password} onChange={onInputChange} required />

      <div className="button-container">
        <button type="submit" className="login-button">Login</button>
        <Link to="/signup" className="signup-button">Sign Up</Link>
      </div>
    </form>
  );
}

export default LoginForm;
