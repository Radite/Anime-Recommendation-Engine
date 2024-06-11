// src/utils/fetchUserRating.js
export const fetchUserRating = async (id) => {
  try {
    const token = localStorage.getItem('token'); // Assuming you store the JWT token in localStorage
    const response = await fetch(`http://192.168.100.67:3001/user/anime/rating/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      return data.rating;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user rating:', error);
    throw error;
  }
};
