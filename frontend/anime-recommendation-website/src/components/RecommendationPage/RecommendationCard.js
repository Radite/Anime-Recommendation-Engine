import React from 'react';

const RecommendationCard = ({ recommendation }) => {
  if (!recommendation.anime) {
    return null; // Return null or any fallback UI if recommendation.anime is undefined
  }

  const { animeName, animeImage } = recommendation.anime;

  return (
    <div className="recommendation-card">
      <img src={animeImage} alt={animeName} />
      <h2>{animeName}</h2>
    </div>
  );
};

export default RecommendationCard;
