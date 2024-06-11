import React from 'react';

function ErrorMessage({ message }) {
  return (
    message && <p className="error-message">{message}</p>
  );
}

export default ErrorMessage;
