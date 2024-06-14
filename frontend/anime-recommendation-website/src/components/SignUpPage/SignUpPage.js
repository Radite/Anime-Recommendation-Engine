import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import handleInputChange from '../../utils/loginInputChange';
import handleSubmit from '../../utils/signUpSubmit';
import '../../styles/SignUpPage.css';

function SignUpPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    age: '',
    gender: 'male'
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const onInputChange = (e) => handleInputChange(e, formData, setFormData);

  const onFormSubmit = (e) => handleSubmit(e, formData, setErrorMessage, setSuccessMessage, navigate);

  const goToLoginPage = () => {
    navigate('/login');
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form className="signup-form" onSubmit={onFormSubmit}>
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" name="username" value={formData.username} onChange={onInputChange} required />

        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={onInputChange} required />

        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" value={formData.password} onChange={onInputChange} required />

        <label htmlFor="age">Age:</label>
        <input type="number" id="age" name="age" value={formData.age} onChange={onInputChange} required />

        <label htmlFor="gender">Gender:</label>
        <select id="gender" name="gender" value={formData.gender} onChange={onInputChange} required>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <div className="button-container2">
          <button type="submit" className="signup-button">Sign Up</button>
          <button type="button" className="login-button" onClick={goToLoginPage}>Go to Login</button>
        </div>
      </form>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
  );
}

export default SignUpPage;
