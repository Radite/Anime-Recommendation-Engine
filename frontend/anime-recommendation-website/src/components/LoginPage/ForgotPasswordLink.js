import React from 'react';
import { Link } from 'react-router-dom';

function ForgotPasswordLink() {
  return (
    <Link to="/forgotpassword" className="forgot-password-link">Forgot Password?</Link>
  );
}

export default ForgotPasswordLink;
