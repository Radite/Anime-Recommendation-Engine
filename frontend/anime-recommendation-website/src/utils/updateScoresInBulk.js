// src/utils/updateScoresInBulk.js
export const updateScoresInBulk = async (scoreUpdates) => {
    try {
      const token = localStorage.getItem('token'); // Assuming you store the JWT token in localStorage
      const response = await fetch('http://192.168.100.67:3001/users/update-scores-in-bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ scoreUpdates }) // Sending the array of score updates
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data.message); // Log success message
      } else {
        console.error('Failed to update scores:', response.statusText);
        throw new Error('Failed to update scores');
      }
    } catch (error) {
      console.error('Error updating scores:', error);
      throw error;
    }
  };
  