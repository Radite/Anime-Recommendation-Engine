import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/ProfilePage.css'; // Import the CSS file
import Header from './Header'; // Import the Header component

const ProfilePage = () => {
  const [animeScores, setAnimeScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [editedScore, setEditedScore] = useState('');
  const [selectedAnimeId, setSelectedAnimeId] = useState(null);

  const fetchAnimeScores = async () => {
    try {
      const token = localStorage.getItem('token'); // Assuming the JWT is stored in localStorage
      const response = await axios.get('http://192.168.100.67:3001/users/anime-scores', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAnimeScores(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch anime scores');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimeScores();
  }, []);

  const handleEditScore = (animeId, currentScore) => {
    setSelectedAnimeId(animeId);
    setEditedScore(currentScore);
    setShowPopup(true);
  };

  const handleSaveRating = async () => {
    try {
      // Validate if the edited score is within the range of 1 to 10
      const score = parseInt(editedScore);
      if (isNaN(score) || score < 1 || score > 10) {
        setError('Please enter a score between 1 and 10.');
        return;
      }

      const token = localStorage.getItem('token'); // Assuming you store the JWT token in localStorage
      const response = await fetch(`http://192.168.100.67:3001/users/user-anime-score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ anime_id: selectedAnimeId, rating: editedScore }) // Sending anime_id and rating in the request body
      });
      if (response.ok) {
        if (response.status === 201 || response.status === 200) {
          // Successfully saved rating, now fetch the updated scores
          await fetchAnimeScores();
          setShowPopup(false);
        }
      } else {
        // Handle other status codes (e.g., 404, 500)
        console.error('Failed to save rating:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving user rating:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Header /> {/* Include the Header component here */}
      <div className="profile-page">
        <div className="overlay"></div>
        <div className="profile-content">
          <h1>My Anime Scores</h1>
          {animeScores.map(anime => (
            <div key={anime.Anime_ID} className="anime-card">
              <div className="anime-info">
                <Link to={`/anime/${anime.Anime_ID}`}>
                  <h2>{anime.Name}</h2>
                </Link>
                <p>({anime.Alternative})</p>
                <p>Score: {anime.Rating}</p>
                <button onClick={() => handleEditScore(anime.Anime_ID, anime.Rating)}>Edit Score</button>
              </div>
            </div>
          ))}
        </div>
        {showPopup && (
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
                onChange={(e) => setEditedScore(e.target.value)}
              />
              <button onClick={handleSaveRating}>Save</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
