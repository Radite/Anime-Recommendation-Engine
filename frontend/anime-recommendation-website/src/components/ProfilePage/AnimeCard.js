import React from 'react';
import { Link } from 'react-router-dom';

const AnimeCard = ({ anime, handleEditScore }) => {
  // Constructing the image URL
  const baseUrl = 'http://192.168.100.67:3001';
  const imageUrl = anime.imageUrl ? `${baseUrl}${anime.imageUrl}` : null;

  return (
    <div className="anime-card">
      <div className="anime-info">
        {/* Link to the anime details page */}
        <Link to={`/anime/${anime.Anime_ID}`}>
          <h2>{anime.Name}</h2>
        </Link>
        {anime.Alternative && <p>({anime.Alternative})</p>}
        {/* Displaying the image */}
        {imageUrl && <img src={imageUrl} alt={anime.Name} />}
        <p>Score: {anime.Rating}</p>
        <button onClick={() => handleEditScore(anime.Anime_ID, anime.Rating)}>Edit Score</button>
      </div>
    </div>
  );
};

export default AnimeCard;
