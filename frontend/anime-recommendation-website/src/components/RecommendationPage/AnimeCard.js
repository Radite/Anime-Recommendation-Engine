import React from 'react';

function AnimeCard({ anime }) {
  const baseUrl = 'http://192.168.100.67:3001';
  const imageUrl = anime.imageUrl ? `${baseUrl}${anime.imageUrl}` : null;
  const animePageUrl = `http://localhost:3002/anime/${anime.animeId}`; // Construct URL for the anime page

  return (
    <a href={animePageUrl} target="_blank" rel="noopener noreferrer" className="anime-card3"> {/* Open link in new tab */}
      <div> {/* Removed the condition for the match percentage */}
        {imageUrl ? (
          <div className="image-container">
            <img src={imageUrl} alt={anime.Name} onError={(e) => { e.target.onerror = null; e.target.src = `${baseUrl}/default_image.jpg` }} />
          </div>
        ) : (
          <div className="image-container">
            <div>No image available</div>
          </div>
        )}
        <h3>{anime.Alternative !== "" ? anime.Alternative : anime.Name}</h3>
      </div>
    </a>
  );
}

export default AnimeCard;
