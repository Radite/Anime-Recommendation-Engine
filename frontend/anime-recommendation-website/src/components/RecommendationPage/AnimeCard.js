// AnimeCard.js

import React from 'react';

function AnimeCard({ anime }) {
  return (
    <div className="anime-card">
      <h3>{anime.Alternative !== "" ? anime.Alternative : anime.Name}</h3> {/* Display anime.Alternative if not empty, else display anime.Name */}
      <p className="match">Match: {Math.ceil(anime.computedScore)}%</p>
    </div>
  );
}

export default AnimeCard;
