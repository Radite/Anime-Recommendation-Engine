import React from 'react';
import { Link } from 'react-router-dom';

function AnimeCard2({ anime }) {
  const baseUrl = 'http://192.168.100.67:3001';
  const imageUrl = anime.imageUrl ? `${baseUrl}${anime.imageUrl}` : null;
  const animePageUrl = `http://localhost:3002/anime/${anime.Anime_ID}`; // Construct URL for the anime page

  return (
    <Link to={animePageUrl} className="anime-card2">
      <div>
        {imageUrl ? (
          <div className="image-container">
            <img src={imageUrl} alt={anime.Name} onError={(e) => { e.target.onerror = null; e.target.src = `${baseUrl}/default_image.jpg` }} />
          </div>
        ) : (
          <div className="image-container">
            <div>No image available</div>
          </div>
        )}
        <h3>{anime.Name}</h3>
        {anime.Alternative && <p className="alternative-name">({anime.Alternative})</p>}
      </div>
    </Link>
  );
}

export default AnimeCard2;
