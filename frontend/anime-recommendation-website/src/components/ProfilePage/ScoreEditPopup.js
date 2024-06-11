import React from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { handleSaveRating } from '../../utils/handleSaveRating';

const ScoreEditPopup = ({ editedScore, setEditedScore, selectedAnimeId, setShowPopup }) => {
  const handleSaveRatingClick = async () => {
    try {
      // Call handleSaveRating function from utils
      await handleSaveRating(selectedAnimeId, editedScore, () => {}, () => {}, setShowPopup);
    } catch (error) {
      console.error('Error saving user rating:', error);
    }
  };

  const handleDeleteClick = async () => {
    try {
      // Get user ID from JWT token stored in localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
  
      // Call the backend route to delete the anime
      await axios.delete(`http://192.168.100.67:3001/users/user-anime-score/${userId}/${selectedAnimeId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Close the popup after successful deletion
      setShowPopup(false);
    } catch (error) {
      console.error('Error deleting anime:', error);
      // Handle error (e.g., show error message to the user)
    }
  };

  // Handler to handle change in input value
  const handleScoreChange = (event) => {
    let score = parseInt(event.target.value);
    // Cap the score at 10 if it exceeds 10
    if (score > 10) {
      score = 10;
    }
    // Set the score to 1 if it's less than 1
    if (score < 1) {
      score = 1;
    }
    // Update the edited score state
    setEditedScore(score.toString());
  };
  
  return (
    <div className="popup">
      <div className="popup-content">
        <button className="close-btn" onClick={() => setShowPopup(false)}>X</button>
        <h3>Edit Score</h3>
        <input
          type="number"
          min="1"
          max="10"
          placeholder="Enter new score (1-10)"
          value={editedScore}
          onChange={handleScoreChange} // Call handleScoreChange on input change
        />
        <button onClick={handleSaveRatingClick}>Save</button>
        <button className="delete-btn" onClick={handleDeleteClick}>Delete</button>
      </div>
    </div>
  );
};

export default ScoreEditPopup;
