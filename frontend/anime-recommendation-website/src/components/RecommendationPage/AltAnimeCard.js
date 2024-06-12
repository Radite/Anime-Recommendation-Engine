import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/RecommendationPage.css'; // Import the RecommendationPage.css file

const AltAnimeCard = ({ anime }) => {
  const { animeName, predictedRating, imageUrl, animeId } = anime;
  const baseUrl = 'http://192.168.100.67:3001';
  const fullImageUrl = imageUrl ? `${baseUrl}${imageUrl}` : `${baseUrl}/default_image.jpg`;
  const animePageUrl = `http://localhost:3002/anime/${animeId}`; // Construct URL for the anime page

  return (
    <a href={animePageUrl} target="_blank" rel="noopener noreferrer" className="anime-card"> {/* Open link in new tab */}
      <div> {/* Removed the condition for the match percentage */}
        {imageUrl ? (
          <div className="image-container">
            <img src={fullImageUrl} alt={animeName} onError={(e) => { e.target.onerror = null; e.target.src = `${baseUrl}/images/placeholder.png` }} />
          </div>
        ) : (
          <div className="image-container">
            <div>No image available</div>
          </div>
        )}
        <h3>{animeName}</h3>
        <p>Predicted Score: {predictedRating}</p>
      </div>
    </a>
  );
};

AltAnimeCard.propTypes = {
  anime: PropTypes.shape({
    animeName: PropTypes.string.isRequired,
    predictedRating: PropTypes.number.isRequired,
    imageUrl: PropTypes.string, // imageUrl is now optional
    animeId: PropTypes.string.isRequired
  }).isRequired
};

export default AltAnimeCard;
