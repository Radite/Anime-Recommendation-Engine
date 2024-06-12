import React, { useEffect, useState } from 'react';
import '../../styles/ProfilePage.css';
import Header from '../Header';
import AnimeCard from './AnimeCard';
import ScoreEditPopup from './ScoreEditPopup';
import { fetchAnimeScores } from '../../utils/fetchAnimeScores';
import { fetchAnimeInfo } from '../../utils/fetchAnimeInfo';

const ProfilePage = () => {
  const [animeScores, setAnimeScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [editedScore, setEditedScore] = useState('');
  const [selectedAnimeId, setSelectedAnimeId] = useState(null);
  const [sortBy, setSortBy] = useState('score');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAnimeData();
  }, [showPopup]);

  const fetchAnimeData = async () => {
    try {
      const data = await fetchAnimeScores();
      const enhancedData = await Promise.all(
        data.map(async (anime) => {
          const additionalInfo = await fetchAnimeInfo(anime.Anime_ID);
          return { ...anime, imageUrl: additionalInfo.imageUrl };
        })
      );
      const sortedData = enhancedData.sort((a, b) => b.Rating - a.Rating);
      setAnimeScores(sortedData);
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
      await fetch('http://192.168.100.67:3001/users/updateModelWithScores', {
        method: 'POST',
      });
      console.log('Updating recommendation...');
    } catch (error) {
      console.error('Error updating recommendation:', error);
    }
  };

  const sortByScore = () => {
    const sortedData = [...animeScores].sort((a, b) => b.Rating - a.Rating);
    setAnimeScores(sortedData);
    setSortBy('score');
  };

  const sortByName = () => {
    const sortedData = [...animeScores].sort((a, b) => a.Name.localeCompare(b.Name));
    setAnimeScores(sortedData);
    setSortBy('name');
  };

  const filterBySearch = () => {
    return animeScores.filter(anime =>
      anime.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (anime.Alternative && anime.Alternative.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  return (
    <div>
      <Header />
      <div className="profile-page">
        <div className="overlay"></div>
        <div className="profile-content">
          <h1>My Anime Scores</h1>
          <div className="sort-search-options">
            <div className="sort-options">
              <button onClick={sortByScore} className={sortBy === 'score' ? 'active' : ''}>Sort by Score</button>
              <button onClick={sortByName} className={sortBy === 'name' ? 'active' : ''}>Sort by Name</button>
            </div>
            <div className="search-bar2">
              <span>or</span>
              <input
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          {loading && <div>Loading...</div>}
          {error && <div>{error}</div>}
          <div className="anime-grid">
            {!loading && !error && filterBySearch().map(anime => (
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
