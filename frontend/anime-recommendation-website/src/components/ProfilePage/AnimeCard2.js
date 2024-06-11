import React from 'react';
import { Link } from 'react-router-dom';

const AnimeCard = ({ anime, handleEditScore }) => {
  return (
    <div className="anime-card">
      <div className="anime-info">
        <Link to={`/anime/${anime.Anime_ID}`}>
          <h2>{anime.Name}</h2>
        </Link>
        <p>({anime.Alternative})</p>
        <p>Score: {anime.Rating}</p>
        <button onClick={() => handleEditScore(anime.Anime_ID, anime.Rating)}>Edit Score</button>
      </div>
    </div>
  );
};

export default AnimeCard;
