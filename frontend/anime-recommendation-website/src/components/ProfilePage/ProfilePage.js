import React, { useEffect, useState } from 'react';
import '../../styles/ProfilePage.css';
import Header from '../Header';
import AnimeCard from './AnimeCard';
import ScoreEditPopup from './ScoreEditPopup';
import { fetchAnimeScores } from '../../utils/fetchAnimeScores';

const ProfilePage = () => {
  const [animeScores, setAnimeScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [editedScore, setEditedScore] = useState('');
  const [selectedAnimeId, setSelectedAnimeId] = useState(null);

  useEffect(() => {
    fetchAnimeData();
  }, [showPopup]);

  const fetchAnimeData = async () => {
    try {
      const data = await fetchAnimeScores();
      setAnimeScores(data);
      setLoading(false);
    } catch (error) {
      setError('No Scores to Display');
      setLoading(false);
    }
  };

  const handleEditScore = (animeId, currentScore) => {
    setSelectedAnimeId(animeId);
    setEditedScore(currentScore);
    setShowPopup(true);
  };

  const handleUpdateRecommendation = async () => {
    try {
      // Call the backend endpoint to update the model
      await fetch('http://192.168.100.67:3001/users/updateModelWithScores', {
        method: 'POST',
      });
      console.log('Updating recommendation...');
    } catch (error) {
      console.error('Error updating recommendation:', error);
    }
  };

  return (
    <div>
      <Header />
      <div className="profile-page">
        <div className="overlay"></div>
        <div className="profile-content">
          <h1>My Anime Scores</h1>
          {loading && <div>Loading...</div>}
          {error && <div>{error}</div>}
          <div className="anime-grid">
            {!loading && !error && animeScores.map(anime => (
              <AnimeCard
                key={anime.Anime_ID}
                anime={anime}
                handleEditScore={handleEditScore}
              />
            ))}
          </div>
        </div>
        {showPopup && (
          <ScoreEditPopup
            editedScore={editedScore}
            setEditedScore={setEditedScore}
            selectedAnimeId={selectedAnimeId}
            setShowPopup={setShowPopup}
            fetchAnimeData={fetchAnimeData}
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
