import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/RecommendationPage.css'; // Import the RecommendationPage.css file

const AltAnimeCard = ({ anime }) => {
  const { animeName, predictedRating } = anime;

  return (
    <div className="anime-card"> {/* Apply anime-card class here */}
      <h3>{animeName}</h3>
      <p>Predicted Score: {predictedRating}</p>
    </div>
  );
};

AltAnimeCard.propTypes = {
  anime: PropTypes.shape({
    animeName: PropTypes.string.isRequired,
    predictedRating: PropTypes.number.isRequired
  }).isRequired
};

export default AltAnimeCard;
