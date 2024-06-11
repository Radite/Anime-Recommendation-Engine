// src/pages/AnimePage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/AnimePage.css'; // Import CSS file for styling
import Header from '../Header'; // Import the Header component
import AnimeDetails from './AnimeDetails'; // Import AnimeDetails component
import RatingPopup from './RatingPopup'; // Import RatingPopup component

import { fetchAnimeInfo } from '../../utils/fetchAnimeInfo'; // Import fetchAnimeInfo utility
import { fetchUserRating } from '../../utils/fetchUserRating'; // Import fetchUserRating utility
import { handleSaveRating } from '../../utils/handleSaveRating'; // Import handleSaveRating utility

function AnimePage() {
  const [animeInfo, setAnimeInfo] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [rating, setRating] = useState('');
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(''); // Success or error message type
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const animeData = await fetchAnimeInfo(id);
        setAnimeInfo(animeData);

        const userRating = await fetchUserRating(id);
        setRating(userRating);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  if (!animeInfo) {
    return <div>Loading...</div>;
  }

  const handleRateAnime = () => {
    setShowPopup(true);
  };

  return (
    <div>
      <Header /> {/* Include the Header component here */}
      <div className="anime-info-container">
        <div className="overlay"></div> {/* Include overlay */}
        <AnimeDetails animeInfo={animeInfo} handleRateAnime={handleRateAnime} />
        <RatingPopup
          showPopup={showPopup}
          setShowPopup={setShowPopup}
          animeInfo={animeInfo}
          rating={rating}
          setRating={setRating}
          handleSaveRating={() => handleSaveRating(id, rating, setMessage, setMessageType, setShowPopup)}
        />
        {message && (
          <p className={messageType}>{message}</p>
        )}
      </div>
    </div>
  );
}

export default AnimePage;
