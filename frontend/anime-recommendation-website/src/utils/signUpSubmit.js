import axios from 'axios';

const handleSubmit = async (e, formData, setErrorMessage, setSuccessMessage, navigate) => {
  e.preventDefault();
  try {
    const response = await axios.post('http://localhost:3001/api/auth/signup', formData);
    setSuccessMessage('Successfully signed up! Redirecting to login page...');
    setErrorMessage('');
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  } catch (error) {
    setErrorMessage(error.response?.data?.message || 'Error during signup');
    setSuccessMessage('');
  }
};

export default handleSubmit;
