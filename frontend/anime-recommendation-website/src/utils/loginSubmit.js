import axios from 'axios';

const handleSubmit = async (e, formData, setErrorMessage, navigate) => {
  e.preventDefault();
  try {
    const response = await axios.post('http://localhost:3001/api/auth/login', formData);
    localStorage.setItem('token', response.data.token);
    setErrorMessage('');
    navigate('/recommendation');
  } catch (error) {
    setErrorMessage(error.response?.data?.message || 'Error during login');
  }
};

export default handleSubmit;
