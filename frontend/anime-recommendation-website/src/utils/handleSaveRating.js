// src/utils/handleSaveRating.js
export const handleSaveRating = async (id, rating, setMessage, setMessageType, setShowPopup) => {
  try {
    const token = localStorage.getItem('token'); // Assuming you store the JWT token in localStorage
    const response = await fetch(`http://192.168.100.67:3001/users/user-anime-score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ anime_id: id, rating }) // Sending anime_id and rating in the request body
    });
    if (response.ok) {
      if (response.status === 201) {
        // New rating added successfully
        setMessage('Rating added successfully!');
        setMessageType('success');
        setShowPopup(false);
      } else if (response.status === 200) {
        // Rating updated successfully
        setMessage('Rating updated successfully!');
        setMessageType('success');
        setShowPopup(false);
      }
    } else {
      // Handle other status codes (e.g., 404, 500)
      setMessage('Failed to save rating');
      setMessageType('error');
      console.error('Failed to save rating:', response.statusText);
    }
  } catch (error) {
    setMessage('Error saving user rating');
    setMessageType('error');
    console.error('Error saving user rating:', error);
  }
};
