import React from 'react';
import LoginForm from './LoginForm';
import ErrorMessage from './ErrorMessage';
import ForgotPasswordLink from './ForgotPasswordLink';
import '../../styles/LoginPage.css';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate from react-router-dom

function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <h2>Login</h2>
      <LoginForm navigate={navigate} />
      <ErrorMessage />
      <ForgotPasswordLink />
    </div>
  );
}

export default LoginPage;
